"use server"

import { sql } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { headers } from "next/headers"
import { v4 as uuidv4 } from "uuid"

export async function createAuditLog(data: {
  action: string
  itemType: string
  itemId: string
  details?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const userId = session.user.id
    const id = uuidv4()
    const now = new Date().toISOString()

    // Get IP and user agent
    const headersList = headers()
    const ipAddress = headersList.get("x-forwarded-for") || "unknown"
    const userAgent = headersList.get("user-agent") || "unknown"

    // Create audit log
    const result = await sql`
      INSERT INTO audit_logs (
        id, action, item_type, item_id, details, ip_address,
        device_info, business_id, user_id, created_at
      )
      VALUES (
        ${id}, ${data.action}, ${data.itemType}, ${data.itemId},
        ${data.details || null}, ${ipAddress}, ${userAgent},
        ${businessId}, ${userId}, ${now}
      )
      RETURNING *
    `

    const auditLog = result.rows[0]

    return { success: true, auditLog }
  } catch (error) {
    console.error("Error creating audit log:", error)
    return { success: false, error: "Failed to create audit log" }
  }
}

export async function getAuditLogs(
  search?: string,
  action?: string,
  itemType?: string,
  startDate?: string,
  endDate?: string,
  page = 1,
  limit = 10,
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const offset = (page - 1) * limit

    // Build the WHERE clause
    let whereClause = `WHERE a.business_id = $1`
    const values = [businessId]
    let paramIndex = 2

    if (search) {
      whereClause += ` AND (a.item_id LIKE $${paramIndex} OR a.details LIKE $${paramIndex})`
      values.push(`%${search}%`)
      paramIndex++
    }

    if (action) {
      whereClause += ` AND a.action = $${paramIndex}`
      values.push(action)
      paramIndex++
    }

    if (itemType) {
      whereClause += ` AND a.item_type = $${paramIndex}`
      values.push(itemType)
      paramIndex++
    }

    if (startDate) {
      whereClause += ` AND a.created_at >= $${paramIndex}`
      values.push(startDate)
      paramIndex++
    }

    if (endDate) {
      whereClause += ` AND a.created_at <= $${paramIndex}`
      values.push(endDate)
      paramIndex++
    }

    // Get logs with pagination
    const logsQuery = `
      SELECT 
        a.*,
        u.name as user_name,
        u.email as user_email
      FROM audit_logs a
      LEFT JOIN users u ON a.user_id = u.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    values.push(limit, offset)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM audit_logs a
      ${whereClause}
    `

    const [logsResult, countResult] = await Promise.all([
      sql.query(logsQuery, values),
      sql.query(countQuery, values.slice(0, paramIndex - 1)),
    ])

    const logs = logsResult.rows
    const total = Number.parseInt(countResult.rows[0].total)

    return {
      success: true,
      logs,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    }
  } catch (error) {
    console.error("Error getting audit logs:", error)
    return { success: false, error: "Failed to get audit logs" }
  }
}

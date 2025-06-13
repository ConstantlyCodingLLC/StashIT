"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"
import { hash } from "bcryptjs"
import { createAuditLog } from "./audit"

export async function addUser(data: {
  name: string
  email: string
  password: string
  role: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can add users" }
    }

    const businessId = session.user.businessId
    const id = uuidv4()
    const now = new Date().toISOString()
    const hashedPassword = await hash(data.password, 10)

    // Check if user with email already exists
    const checkResult = await sql`
      SELECT * FROM users
      WHERE email = ${data.email} AND business_id = ${businessId}
    `

    if (checkResult.rows.length > 0) {
      return { success: false, error: "User with this email already exists" }
    }

    // Create user
    const result = await sql`
      INSERT INTO users (
        id, name, email, password, role, business_id, created_at, updated_at
      )
      VALUES (
        ${id}, ${data.name}, ${data.email}, ${hashedPassword}, ${data.role},
        ${businessId}, ${now}, ${now}
      )
      RETURNING id, name, email, role, created_at
    `

    const user = result.rows[0]

    // Create audit log
    await createAuditLog({
      action: "created",
      itemType: "user",
      itemId: user.id,
      details: JSON.stringify({ name: data.name, email: data.email, role: data.role }),
    })

    revalidatePath("/users")
    return { success: true, user }
  } catch (error) {
    console.error("Error adding user:", error)
    return { success: false, error: "Failed to add user" }
  }
}

export async function updateUser(
  id: string,
  data: {
    name?: string
    email?: string
    role?: string
    password?: string
  },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user has admin role or is updating their own profile
    if (session.user.role !== "admin" && session.user.id !== id) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const now = new Date().toISOString()

    // Ensure the user belongs to the business
    const checkResult = await sql`
      SELECT * FROM users
      WHERE id = ${id} AND business_id = ${businessId}
    `

    if (checkResult.rows.length === 0) {
      return { success: false, error: "User not found" }
    }

    // Build the SET clause dynamically
    const updates = []
    const values = [id, businessId]
    let paramIndex = 3

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(data.name)
    }
    if (data.email !== undefined) {
      updates.push(`email = $${paramIndex++}`)
      values.push(data.email)
    }
    if (data.role !== undefined && session.user.role === "admin") {
      updates.push(`role = $${paramIndex++}`)
      values.push(data.role)
    }
    if (data.password !== undefined) {
      const hashedPassword = await hash(data.password, 10)
      updates.push(`password = $${paramIndex++}`)
      values.push(hashedPassword)
    }

    // Add updated timestamp
    updates.push(`updated_at = $${paramIndex++}`)
    values.push(now)

    // Execute the update
    const updateQuery = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $1 AND business_id = $2
      RETURNING id, name, email, role, updated_at
    `

    const result = await sql.query(updateQuery, values)
    const user = result.rows[0]

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "user",
      itemId: user.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/users")
    return { success: true, user }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    // Check if user has admin role
    if (session.user.role !== "admin") {
      return { success: false, error: "Only admins can delete users" }
    }

    // Prevent deleting yourself
    if (session.user.id === id) {
      return { success: false, error: "You cannot delete your own account" }
    }

    const businessId = session.user.businessId

    // Ensure the user belongs to the business
    const checkResult = await sql`
      SELECT * FROM users
      WHERE id = ${id} AND business_id = ${businessId}
    `

    if (checkResult.rows.length === 0) {
      return { success: false, error: "User not found" }
    }

    const existingUser = checkResult.rows[0]

    // Delete the user
    await sql`
      DELETE FROM users
      WHERE id = ${id} AND business_id = ${businessId}
    `

    // Create audit log
    await createAuditLog({
      action: "deleted",
      itemType: "user",
      itemId: id,
      details: JSON.stringify({ name: existingUser.name, email: existingUser.email }),
    })

    revalidatePath("/users")
    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}

export async function getUsers(search?: string, role?: string, page = 1, limit = 10) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const offset = (page - 1) * limit

    // Build the WHERE clause
    let whereClause = `WHERE business_id = $1`
    const values = [businessId]
    let paramIndex = 2

    if (search) {
      whereClause += ` AND (name ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`
      values.push(`%${search}%`)
      paramIndex++
    }

    if (role) {
      whereClause += ` AND role = $${paramIndex}`
      values.push(role)
      paramIndex++
    }

    // Get users with pagination
    const usersQuery = `
      SELECT id, name, email, role, created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    values.push(limit, offset)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM users
      ${whereClause}
    `

    const [usersResult, countResult] = await Promise.all([
      sql.query(usersQuery, values),
      sql.query(countQuery, values.slice(0, paramIndex - 1)),
    ])

    const users = usersResult.rows
    const total = Number.parseInt(countResult.rows[0].total)

    return {
      success: true,
      users,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    }
  } catch (error) {
    console.error("Error getting users:", error)
    return { success: false, error: "Failed to get users" }
  }
}

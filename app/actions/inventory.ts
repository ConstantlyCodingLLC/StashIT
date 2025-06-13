"use server"

import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { createAuditLog } from "./audit"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { v4 as uuidv4 } from "uuid"

export async function addInventoryItem(data: {
  name: string
  sku: string
  description?: string
  quantity: number
  minQuantity: number
  costPrice?: number
  sellingPrice?: number
  location?: string
  categoryId?: string
  supplierId?: string
}) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const id = uuidv4()
    const now = new Date().toISOString()

    // Insert the inventory item
    const result = await sql`
      INSERT INTO inventory_items (
        id, name, sku, description, quantity, min_quantity, 
        cost_price, selling_price, location, category_id, 
        supplier_id, business_id, created_at, updated_at
      )
      VALUES (
        ${id}, ${data.name}, ${data.sku}, ${data.description || null}, 
        ${data.quantity}, ${data.minQuantity}, ${data.costPrice || null}, 
        ${data.sellingPrice || null}, ${data.location || null}, 
        ${data.categoryId || null}, ${data.supplierId || null}, 
        ${businessId}, ${now}, ${now}
      )
      RETURNING *
    `

    const item = result.rows[0]

    // Create audit log
    await createAuditLog({
      action: "created",
      itemType: "inventory",
      itemId: item.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/inventory")
    return { success: true, item }
  } catch (error) {
    console.error("Error adding inventory item:", error)
    return { success: false, error: "Failed to add inventory item" }
  }
}

export async function updateInventoryItem(
  id: string,
  data: {
    name?: string
    sku?: string
    description?: string
    quantity?: number
    minQuantity?: number
    costPrice?: number
    sellingPrice?: number
    location?: string
    categoryId?: string
    supplierId?: string
  },
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId
    const now = new Date().toISOString()

    // Ensure the item belongs to the business
    const checkResult = await sql`
      SELECT * FROM inventory_items
      WHERE id = ${id} AND business_id = ${businessId}
    `

    if (checkResult.rows.length === 0) {
      return { success: false, error: "Item not found" }
    }

    // Build the SET clause dynamically
    const updates = []
    const values = [id, businessId]
    let paramIndex = 3

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      values.push(data.name)
    }
    if (data.sku !== undefined) {
      updates.push(`sku = $${paramIndex++}`)
      values.push(data.sku)
    }
    if (data.description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      values.push(data.description)
    }
    if (data.quantity !== undefined) {
      updates.push(`quantity = $${paramIndex++}`)
      values.push(data.quantity)
    }
    if (data.minQuantity !== undefined) {
      updates.push(`min_quantity = $${paramIndex++}`)
      values.push(data.minQuantity)
    }
    if (data.costPrice !== undefined) {
      updates.push(`cost_price = $${paramIndex++}`)
      values.push(data.costPrice)
    }
    if (data.sellingPrice !== undefined) {
      updates.push(`selling_price = $${paramIndex++}`)
      values.push(data.sellingPrice)
    }
    if (data.location !== undefined) {
      updates.push(`location = $${paramIndex++}`)
      values.push(data.location)
    }
    if (data.categoryId !== undefined) {
      updates.push(`category_id = $${paramIndex++}`)
      values.push(data.categoryId)
    }
    if (data.supplierId !== undefined) {
      updates.push(`supplier_id = $${paramIndex++}`)
      values.push(data.supplierId)
    }

    // Add updated timestamp
    updates.push(`updated_at = $${paramIndex++}`)
    values.push(now)

    // Execute the update
    const updateQuery = `
      UPDATE inventory_items
      SET ${updates.join(", ")}
      WHERE id = $1 AND business_id = $2
      RETURNING *
    `

    const result = await sql.query(updateQuery, values)
    const item = result.rows[0]

    // Create audit log
    await createAuditLog({
      action: "updated",
      itemType: "inventory",
      itemId: item.id,
      details: JSON.stringify(data),
    })

    revalidatePath("/inventory")
    revalidatePath(`/inventory/${id}`)
    return { success: true, item }
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return { success: false, error: "Failed to update inventory item" }
  }
}

export async function deleteInventoryItem(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Ensure the item belongs to the business
    const checkResult = await sql`
      SELECT * FROM inventory_items
      WHERE id = ${id} AND business_id = ${businessId}
    `

    if (checkResult.rows.length === 0) {
      return { success: false, error: "Item not found" }
    }

    const existingItem = checkResult.rows[0]

    // Delete the item
    await sql`
      DELETE FROM inventory_items
      WHERE id = ${id} AND business_id = ${businessId}
    `

    // Create audit log
    await createAuditLog({
      action: "deleted",
      itemType: "inventory",
      itemId: id,
      details: JSON.stringify(existingItem),
    })

    revalidatePath("/inventory")
    return { success: true }
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return { success: false, error: "Failed to delete inventory item" }
  }
}

export async function getInventoryItems(
  search?: string,
  categoryId?: string,
  lowStock?: boolean,
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
    let whereClause = `WHERE i.business_id = $1`
    const values = [businessId]
    let paramIndex = 2

    if (search) {
      whereClause += ` AND (i.name ILIKE $${paramIndex} OR i.sku ILIKE $${paramIndex})`
      values.push(`%${search}%`)
      paramIndex++
    }

    if (categoryId) {
      whereClause += ` AND i.category_id = $${paramIndex}`
      values.push(categoryId)
      paramIndex++
    }

    if (lowStock) {
      // Get business settings for low stock threshold
      const settingsResult = await sql`
        SELECT * FROM business_settings
        WHERE business_id = ${businessId}
      `

      const settings = settingsResult.rows[0]
      const threshold = settings?.low_stock_threshold || 10

      whereClause += ` AND i.quantity <= $${paramIndex}`
      values.push(threshold)
      paramIndex++
    }

    // Get items with pagination
    const itemsQuery = `
      SELECT 
        i.*,
        c.name as category_name,
        s.name as supplier_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      ${whereClause}
      ORDER BY i.updated_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `

    values.push(limit, offset)

    const countQuery = `
      SELECT COUNT(*) as total
      FROM inventory_items i
      ${whereClause}
    `

    const [itemsResult, countResult] = await Promise.all([
      sql.query(itemsQuery, values),
      sql.query(countQuery, values.slice(0, paramIndex - 1)),
    ])

    const items = itemsResult.rows
    const total = Number.parseInt(countResult.rows[0].total)

    return {
      success: true,
      items,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    }
  } catch (error) {
    console.error("Error getting inventory items:", error)
    return { success: false, error: "Failed to get inventory items" }
  }
}

export async function getInventoryItem(id: string) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const businessId = session.user.businessId

    // Get the item with category and supplier info
    const itemResult = await sql`
      SELECT 
        i.*,
        c.name as category_name,
        s.name as supplier_name
      FROM inventory_items i
      LEFT JOIN categories c ON i.category_id = c.id
      LEFT JOIN suppliers s ON i.supplier_id = s.id
      WHERE i.id = ${id} AND i.business_id = ${businessId}
    `

    if (itemResult.rows.length === 0) {
      return { success: false, error: "Item not found" }
    }

    const item = itemResult.rows[0]

    // Get item transactions
    const transactionsResult = await sql`
      SELECT t.*, u.name as user_name
      FROM inventory_transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.item_id = ${id} AND t.business_id = ${businessId}
      ORDER BY t.created_at DESC
      LIMIT 10
    `

    const transactions = transactionsResult.rows

    return { success: true, item, transactions }
  } catch (error) {
    console.error("Error getting inventory item:", error)
    return { success: false, error: "Failed to get inventory item" }
  }
}

"use server"

import { hash } from "bcryptjs"
import { sql } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export interface BusinessSetupData {
  businessName: string
  businessType: string
  address: string
  adminName: string
  adminEmail: string
  adminPassword: string
  currency: string
  taxRate: number
  fiscalYearStart: string
}

export async function setupBusiness(data: BusinessSetupData) {
  try {
    const businessId = uuidv4()
    const userId = uuidv4()
    const now = new Date().toISOString()

    // Create the business
    await sql`
      INSERT INTO businesses (
        id, name, business_type, address, currency, tax_rate, fiscal_year_start, created_at, updated_at
      )
      VALUES (
        ${businessId}, ${data.businessName}, ${data.businessType}, ${data.address}, 
        ${data.currency}, ${data.taxRate}, ${data.fiscalYearStart}, ${now}, ${now}
      )
    `

    // Create business settings
    await sql`
      INSERT INTO business_settings (
        id, business_id, low_stock_alerts, auto_order_suggestions, low_stock_threshold, created_at, updated_at
      )
      VALUES (
        ${uuidv4()}, ${businessId}, true, true, 10, ${now}, ${now}
      )
    `

    // Create the admin user
    const hashedPassword = await hash(data.adminPassword, 10)
    await sql`
      INSERT INTO users (
        id, name, email, password, role, business_id, created_at, updated_at
      )
      VALUES (
        ${userId}, ${data.adminName}, ${data.adminEmail}, ${hashedPassword}, 
        'admin', ${businessId}, ${now}, ${now}
      )
    `

    // Create default categories
    const defaultCategories = ["Office Supplies", "Electronics", "Packaging", "Furniture"]

    for (const category of defaultCategories) {
      await sql`
        INSERT INTO categories (
          id, name, business_id, created_at, updated_at
        )
        VALUES (
          ${uuidv4()}, ${category}, ${businessId}, ${now}, ${now}
        )
      `
    }

    return { success: true, businessId }
  } catch (error) {
    console.error("Error setting up business:", error)
    return { success: false, error: "Failed to set up business" }
  }
}

export async function clearBusinessData(businessId: string) {
  try {
    // Delete all business data in the correct order to respect foreign key constraints
    await sql`BEGIN`

    // Delete audit logs
    await sql`DELETE FROM audit_logs WHERE business_id = ${businessId}`

    // Delete invoice items
    await sql`
      DELETE FROM invoice_items 
      WHERE invoice_id IN (
        SELECT id FROM invoices WHERE business_id = ${businessId}
      )
    `

    // Delete invoices
    await sql`DELETE FROM invoices WHERE business_id = ${businessId}`

    // Delete purchase order items
    await sql`
      DELETE FROM purchase_order_items 
      WHERE purchase_order_id IN (
        SELECT id FROM purchase_orders WHERE business_id = ${businessId}
      )
    `

    // Delete transactions
    await sql`DELETE FROM inventory_transactions WHERE business_id = ${businessId}`

    // Delete purchase orders
    await sql`DELETE FROM purchase_orders WHERE business_id = ${businessId}`

    // Delete devices
    await sql`DELETE FROM devices WHERE business_id = ${businessId}`

    // Delete inventory items
    await sql`DELETE FROM inventory_items WHERE business_id = ${businessId}`

    // Delete suppliers
    await sql`DELETE FROM suppliers WHERE business_id = ${businessId}`

    // Delete categories
    await sql`DELETE FROM categories WHERE business_id = ${businessId}`

    // Delete business settings
    await sql`DELETE FROM business_settings WHERE business_id = ${businessId}`

    // Delete business
    await sql`DELETE FROM businesses WHERE id = ${businessId}`

    await sql`COMMIT`

    return { success: true }
  } catch (error) {
    await sql`ROLLBACK`
    console.error("Error clearing business data:", error)
    return { success: false, error: "Failed to clear business data" }
  }
}

export async function updateBusinessSettings(
  businessId: string,
  data: {
    name?: string
    address?: string
    phone?: string
    email?: string
    lowStockAlerts?: boolean
    autoOrderSuggestions?: boolean
    lowStockThreshold?: number
  },
) {
  try {
    // Update business info
    if (data.name || data.address || data.phone || data.email) {
      const updates = []
      const values = [businessId]
      let paramIndex = 2

      if (data.name) {
        updates.push(`name = $${paramIndex++}`)
        values.push(data.name)
      }
      if (data.address) {
        updates.push(`address = $${paramIndex++}`)
        values.push(data.address)
      }
      if (data.phone) {
        updates.push(`phone = $${paramIndex++}`)
        values.push(data.phone)
      }
      if (data.email) {
        updates.push(`email = $${paramIndex++}`)
        values.push(data.email)
      }

      const now = new Date().toISOString()
      updates.push(`updated_at = $${paramIndex++}`)
      values.push(now)

      const updateQuery = `
        UPDATE businesses
        SET ${updates.join(", ")}
        WHERE id = $1
      `

      await sql.query(updateQuery, values)
    }

    // Update business settings
    if (
      data.lowStockAlerts !== undefined ||
      data.autoOrderSuggestions !== undefined ||
      data.lowStockThreshold !== undefined
    ) {
      const updates = []
      const values = [businessId]
      let paramIndex = 2

      if (data.lowStockAlerts !== undefined) {
        updates.push(`low_stock_alerts = $${paramIndex++}`)
        values.push(data.lowStockAlerts)
      }
      if (data.autoOrderSuggestions !== undefined) {
        updates.push(`auto_order_suggestions = $${paramIndex++}`)
        values.push(data.autoOrderSuggestions)
      }
      if (data.lowStockThreshold !== undefined) {
        updates.push(`low_stock_threshold = $${paramIndex++}`)
        values.push(data.lowStockThreshold)
      }

      const updateQuery = `
        UPDATE business_settings
        SET ${updates.join(", ")}
        WHERE business_id = $1
      `

      await sql.query(updateQuery, values)
    }

    revalidatePath("/settings")
    return { success: true }
  } catch (error) {
    console.error("Error updating business settings:", error)
    return { success: false, error: "Failed to update business settings" }
  }
}

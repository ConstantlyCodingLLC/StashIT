import { sql } from "@vercel/postgres"
import { v4 as uuidv4 } from "uuid"

export { sql }

// Helper function to execute SQL queries
export async function query(query: string, values: any[] = []) {
  try {
    const result = await sql.query(query, values)
    return { rows: result.rows, rowCount: result.rowCount }
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Helper function to execute a transaction
export async function transaction(queries: { query: string; values: any[] }[]) {
  try {
    await sql`BEGIN`

    const results = []
    for (const q of queries) {
      const result = await sql.query(q.query, q.values)
      results.push(result)
    }

    await sql`COMMIT`
    return results
  } catch (error) {
    await sql`ROLLBACK`
    console.error("Transaction error:", error)
    throw error
  }
}

// Create a mock prisma client to satisfy imports
// This will be replaced with SQL queries in the actual implementation
export const prisma = {
  business: {
    create: async (data: any) => {
      const id = uuidv4()
      const now = new Date().toISOString()

      const result = await sql`
        INSERT INTO businesses (
          id, name, business_type, address, currency, tax_rate, fiscal_year_start, created_at, updated_at
        )
        VALUES (
          ${id}, ${data.data.name}, ${data.data.businessType}, ${data.data.address}, 
          ${data.data.currency}, ${data.data.taxRate}, ${data.data.fiscalYearStart}, 
          ${now}, ${now}
        )
        RETURNING *
      `

      // Create business settings
      await sql`
        INSERT INTO business_settings (
          id, business_id, low_stock_alerts, auto_order_suggestions, low_stock_threshold, created_at, updated_at
        )
        VALUES (
          ${uuidv4()}, ${id}, ${data.data.settings.create.lowStockAlerts}, 
          ${data.data.settings.create.autoOrderSuggestions}, ${data.data.settings.create.lowStockThreshold}, 
          ${now}, ${now}
        )
      `

      return result.rows[0]
    },
    delete: async (where: any) => {
      await sql`DELETE FROM businesses WHERE id = ${where.id}`
      return { id: where.id }
    },
  },
  user: {
    create: async (data: any) => {
      const id = uuidv4()
      const now = new Date().toISOString()

      const result = await sql`
        INSERT INTO users (
          id, name, email, password, role, business_id, created_at, updated_at
        )
        VALUES (
          ${id}, ${data.data.name}, ${data.data.email}, ${data.data.password}, 
          ${data.data.role}, ${data.data.businessId}, ${now}, ${now}
        )
        RETURNING *
      `

      return result.rows[0]
    },
  },
  category: {
    createMany: async (data: any) => {
      const values = data.data.map((category: any) => {
        const id = uuidv4()
        const now = new Date().toISOString()
        return [id, category.name, category.businessId, now, now]
      })

      const placeholders = values
        .map((_, i) => `($${i * 5 + 1}, $${i * 5 + 2}, $${i * 5 + 3}, $${i * 5 + 4}, $${i * 5 + 5})`)
        .join(", ")

      const flatValues = values.flat()

      const query = `
        INSERT INTO categories (id, name, business_id, created_at, updated_at)
        VALUES ${placeholders}
        RETURNING *
      `

      const result = await sql.query(query, flatValues)
      return { count: result.rowCount }
    },
  },
  auditLog: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM audit_logs WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  invoiceItem: {
    deleteMany: async (where: any) => {
      await sql`
        DELETE FROM invoice_items 
        WHERE invoice_id IN (
          SELECT id FROM invoices WHERE business_id = ${where.invoice.businessId}
        )
      `
      return { count: 0 }
    },
  },
  invoice: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM invoices WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  purchaseOrderItem: {
    deleteMany: async (where: any) => {
      await sql`
        DELETE FROM purchase_order_items 
        WHERE purchase_order_id IN (
          SELECT id FROM purchase_orders WHERE business_id = ${where.purchaseOrder.businessId}
        )
      `
      return { count: 0 }
    },
  },
  transaction: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM inventory_transactions WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  purchaseOrder: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM purchase_orders WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  device: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM devices WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  inventoryItem: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM inventory_items WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  supplier: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM suppliers WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  category: {
    deleteMany: async (where: any) => {
      await sql`DELETE FROM categories WHERE business_id = ${where.businessId}`
      return { count: 0 }
    },
  },
  businessSettings: {
    delete: async (where: any) => {
      await sql`DELETE FROM business_settings WHERE business_id = ${where.businessId}`
      return { id: where.businessId }
    },
  },
  $transaction: async (operations: any[]) => {
    try {
      await sql`BEGIN`

      for (const operation of operations) {
        await operation
      }

      await sql`COMMIT`
      return operations
    } catch (error) {
      await sql`ROLLBACK`
      throw error
    }
  },
}

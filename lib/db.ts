import { sql } from "@vercel/postgres"
import { Pool } from "pg"

// Re-export sql from @vercel/postgres
export { sql }

// Create a singleton database connection
let pool: Pool

if (!pool) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
  })
}

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

// Mock prisma client for compatibility with existing code
export const prisma = {
  // Add basic mock methods that might be used in the application
  user: {
    findUnique: async (args: any) => {
      const { where } = args
      if (where?.email) {
        const result = await sql`SELECT * FROM users WHERE email = ${where.email} LIMIT 1`
        return result.rows[0] || null
      }
      if (where?.id) {
        const result = await sql`SELECT * FROM users WHERE id = ${where.id} LIMIT 1`
        return result.rows[0] || null
      }
      return null
    },
    create: async (args: any) => {
      const { data } = args
      const result = await sql`
        INSERT INTO users (name, email, password, role)
        VALUES (${data.name}, ${data.email}, ${data.password}, ${data.role || "user"})
        RETURNING *
      `
      return result.rows[0]
    },
  },
  inventory: {
    findMany: async () => {
      const result = await sql`SELECT * FROM inventory`
      return result.rows
    },
    findUnique: async (args: any) => {
      const { where } = args
      if (where?.id) {
        const result = await sql`SELECT * FROM inventory WHERE id = ${where.id} LIMIT 1`
        return result.rows[0] || null
      }
      return null
    },
    create: async (args: any) => {
      const { data } = args
      const result = await sql`
        INSERT INTO inventory (name, description, quantity, price, category_id, supplier_id)
        VALUES (${data.name}, ${data.description}, ${data.quantity}, ${data.price}, ${data.category_id}, ${data.supplier_id})
        RETURNING *
      `
      return result.rows[0]
    },
    update: async (args: any) => {
      const { where, data } = args
      const updates = Object.entries(data)
        .map(([key, value]) => `${key} = ${value}`)
        .join(", ")

      const result = await sql.query(
        `
        UPDATE inventory 
        SET ${updates}
        WHERE id = $1
        RETURNING *
      `,
        [where.id],
      )

      return result.rows[0]
    },
    delete: async (args: any) => {
      const { where } = args
      const result = await sql`
        DELETE FROM inventory
        WHERE id = ${where.id}
        RETURNING *
      `
      return result.rows[0]
    },
  },
  supplier: {
    findMany: async () => {
      const result = await sql`SELECT * FROM suppliers`
      return result.rows
    },
    findUnique: async (args: any) => {
      const { where } = args
      if (where?.id) {
        const result = await sql`SELECT * FROM suppliers WHERE id = ${where.id} LIMIT 1`
        return result.rows[0] || null
      }
      return null
    },
  },
  order: {
    findMany: async () => {
      const result = await sql`SELECT * FROM orders`
      return result.rows
    },
    findUnique: async (args: any) => {
      const { where } = args
      if (where?.id) {
        const result = await sql`SELECT * FROM orders WHERE id = ${where.id} LIMIT 1`
        return result.rows[0] || null
      }
      return null
    },
  },
  // Add other models as needed
}

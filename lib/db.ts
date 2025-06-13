import { Pool } from "pg"
import { sql } from "@vercel/postgres"

// Create a connection pool
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

// Export the pool as db
export const db = pool

// Simple query function
export async function query(text: string, params: any[] = []) {
  try {
    const result = await pool.query(text, params)
    return result
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

// Simple transaction function
export async function transaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await callback(client)
    await client.query("COMMIT")
    return result
  } catch (error) {
    await client.query("ROLLBACK")
    throw error
  } finally {
    client.release()
  }
}

// Mock prisma client with minimal functionality
export const prisma = {
  user: {
    findUnique: async ({ where }: any) => {
      const result = await query("SELECT * FROM users WHERE id = $1 LIMIT 1", [where.id])
      return result.rows[0] || null
    },
    findMany: async () => {
      const result = await query("SELECT * FROM users")
      return result.rows
    },
    create: async ({ data }: any) => {
      const result = await query(
        "INSERT INTO users (id, name, email, password, role, business_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
        [data.id, data.name, data.email, data.password, data.role, data.businessId],
      )
      return result.rows[0]
    },
  },
  // Add minimal implementations for other models as needed
}

// Re-export sql from @vercel/postgres
export { sql }

import { sql } from "@vercel/postgres"

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

// Mock prisma client for compatibility
export const prisma = {
  // Add any necessary mock methods here if needed
}

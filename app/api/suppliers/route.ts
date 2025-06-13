import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    // Build the query
    let query = `
      SELECT * FROM suppliers
      WHERE 1=1
    `

    const params: any[] = []

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR contact_person ILIKE $${params.length + 1} OR email ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    if (status) {
      query += ` AND status = $${params.length + 1}`
      params.push(status)
    }

    query += ` ORDER BY name ASC`

    const result = await db.query(query, params)

    return NextResponse.json({ suppliers: result.rows })
  } catch (error) {
    console.error("Error fetching suppliers:", error)
    return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, contact_person, email, phone, address, status, notes } = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if supplier with same email already exists
    const existingSupplier = await db.query("SELECT * FROM suppliers WHERE email = $1", [email])
    if (existingSupplier.rows.length > 0) {
      return NextResponse.json({ error: "Supplier with this email already exists" }, { status: 400 })
    }

    // Insert new supplier
    const result = await db.query(
      `INSERT INTO suppliers 
       (name, contact_person, email, phone, address, status, notes, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [name, contact_person || "", email, phone || "", address || "", status || "Active", notes || ""],
    )

    return NextResponse.json({ supplier: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating supplier:", error)
    return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 })
  }
}

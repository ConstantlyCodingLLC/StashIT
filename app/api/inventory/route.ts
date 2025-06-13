import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const status = searchParams.get("status")

    // Build the query
    let query = `
      SELECT * FROM inventory
      WHERE 1=1
    `

    const params: any[] = []

    if (category) {
      query += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR sku ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    if (status === "low-stock") {
      query += ` AND quantity <= min_quantity`
    }

    query += ` ORDER BY name ASC`

    const result = await db.query(query, params)

    return NextResponse.json({ items: result.rows })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory items" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, category, sku, quantity, min_quantity, cost_price, selling_price, location, description } = body

    // Validate required fields
    if (!name || !category || !sku || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if SKU already exists
    const existingItem = await db.query("SELECT * FROM inventory WHERE sku = $1", [sku])
    if (existingItem.rows.length > 0) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
    }

    // Insert new inventory item
    const result = await db.query(
      `INSERT INTO inventory 
       (name, category, sku, quantity, min_quantity, cost_price, selling_price, location, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
       RETURNING *`,
      [
        name,
        category,
        sku,
        quantity,
        min_quantity || 0,
        cost_price || 0,
        selling_price || 0,
        location || "",
        description || "",
      ],
    )

    return NextResponse.json({ item: result.rows[0] }, { status: 201 })
  } catch (error) {
    console.error("Error creating inventory item:", error)
    return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 })
  }
}

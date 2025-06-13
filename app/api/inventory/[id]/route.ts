import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    const result = await db.query("SELECT * FROM inventory WHERE id = $1", [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error fetching inventory item:", error)
    return NextResponse.json({ error: "Failed to fetch inventory item" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()
    const { name, category, sku, quantity, min_quantity, cost_price, selling_price, location, description } = body

    // Validate required fields
    if (!name || !category || !sku || quantity === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if item exists
    const existingItem = await db.query("SELECT * FROM inventory WHERE id = $1", [id])
    if (existingItem.rows.length === 0) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    // Check if SKU already exists for another item
    const skuCheck = await db.query("SELECT * FROM inventory WHERE sku = $1 AND id != $2", [sku, id])
    if (skuCheck.rows.length > 0) {
      return NextResponse.json({ error: "SKU already exists for another item" }, { status: 400 })
    }

    // Update inventory item
    const result = await db.query(
      `UPDATE inventory 
       SET name = $1, category = $2, sku = $3, quantity = $4, min_quantity = $5, 
           cost_price = $6, selling_price = $7, location = $8, description = $9, updated_at = NOW()
       WHERE id = $10
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
        id,
      ],
    )

    return NextResponse.json({ item: result.rows[0] })
  } catch (error) {
    console.error("Error updating inventory item:", error)
    return NextResponse.json({ error: "Failed to update inventory item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    // Check if item exists
    const existingItem = await db.query("SELECT * FROM inventory WHERE id = $1", [id])
    if (existingItem.rows.length === 0) {
      return NextResponse.json({ error: "Inventory item not found" }, { status: 404 })
    }

    // Delete inventory item
    await db.query("DELETE FROM inventory WHERE id = $1", [id])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting inventory item:", error)
    return NextResponse.json({ error: "Failed to delete inventory item" }, { status: 500 })
  }
}

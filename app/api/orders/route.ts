import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const status = searchParams.get("status")
    const startDate = searchParams.get("startDate")
    const endDate = searchParams.get("endDate")

    // Build the query
    let query = `
      SELECT o.*, s.name as supplier_name
      FROM orders o
      LEFT JOIN suppliers s ON o.supplier_id = s.id
      WHERE 1=1
    `

    const params: any[] = []

    if (search) {
      query += ` AND (o.order_number ILIKE $${params.length + 1} OR s.name ILIKE $${params.length + 1})`
      params.push(`%${search}%`)
    }

    if (status) {
      query += ` AND o.status = $${params.length + 1}`
      params.push(status)
    }

    if (startDate) {
      query += ` AND o.order_date >= $${params.length + 1}`
      params.push(startDate)
    }

    if (endDate) {
      query += ` AND o.order_date <= $${params.length + 1}`
      params.push(endDate)
    }

    query += ` ORDER BY o.order_date DESC`

    const result = await db.query(query, params)

    return NextResponse.json({ orders: result.rows })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { supplier_id, order_date, expected_delivery_date, status, notes, items } = body

    // Validate required fields
    if (!supplier_id || !order_date || !items || !items.length) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Start a transaction
    await db.query("BEGIN")

    try {
      // Generate order number
      const orderNumberResult = await db.query("SELECT COUNT(*) FROM orders")
      const orderCount = Number.parseInt(orderNumberResult.rows[0].count) + 1
      const orderNumber = `PO-${new Date().getFullYear()}-${orderCount.toString().padStart(3, "0")}`

      // Insert order
      const orderResult = await db.query(
        `INSERT INTO orders 
         (order_number, supplier_id, order_date, expected_delivery_date, status, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
         RETURNING *`,
        [orderNumber, supplier_id, order_date, expected_delivery_date || null, status || "Pending", notes || ""],
      )

      const orderId = orderResult.rows[0].id

      // Insert order items
      let totalAmount = 0

      for (const item of items) {
        const { inventory_id, quantity, unit_price } = item

        if (!inventory_id || !quantity || !unit_price) {
          throw new Error("Invalid order item")
        }

        const itemTotal = quantity * unit_price
        totalAmount += itemTotal

        await db.query(
          `INSERT INTO order_items 
           (order_id, inventory_id, quantity, unit_price, total_price)
           VALUES ($1, $2, $3, $4, $5)`,
          [orderId, inventory_id, quantity, unit_price, itemTotal],
        )
      }

      // Update order total
      await db.query(`UPDATE orders SET total_amount = $1 WHERE id = $2`, [totalAmount, orderId])

      // Commit transaction
      await db.query("COMMIT")

      // Get the complete order with items
      const completeOrderResult = await db.query(
        `SELECT o.*, s.name as supplier_name,
          (SELECT json_agg(oi.*) FROM order_items oi WHERE oi.order_id = o.id) as items
         FROM orders o
         LEFT JOIN suppliers s ON o.supplier_id = s.id
         WHERE o.id = $1`,
        [orderId],
      )

      return NextResponse.json({ order: completeOrderResult.rows[0] }, { status: 201 })
    } catch (error) {
      // Rollback transaction on error
      await db.query("ROLLBACK")
      throw error
    }
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

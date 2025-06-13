import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(request: Request) {
  try {
    // Get inventory summary
    const summaryResult = await db.query(`
      SELECT 
        COUNT(*) as total_items,
        SUM(quantity) as total_quantity,
        SUM(quantity * selling_price) as total_value,
        COUNT(CASE WHEN quantity <= min_quantity THEN 1 END) as low_stock_count
      FROM inventory
    `)

    // Get inventory by category
    const categoryResult = await db.query(`
      SELECT 
        category,
        COUNT(*) as item_count,
        SUM(quantity) as total_quantity,
        SUM(quantity * selling_price) as total_value
      FROM inventory
      GROUP BY category
      ORDER BY total_value DESC
    `)

    // Get low stock items
    const lowStockResult = await db.query(`
      SELECT 
        id, name, sku, category, quantity, min_quantity,
        (min_quantity - quantity) as reorder_amount
      FROM inventory
      WHERE quantity <= min_quantity
      ORDER BY (quantity / NULLIF(min_quantity, 0)) ASC
    `)

    return NextResponse.json({
      summary: summaryResult.rows[0],
      categories: categoryResult.rows,
      lowStockItems: lowStockResult.rows,
    })
  } catch (error) {
    console.error("Error generating inventory report:", error)
    return NextResponse.json({ error: "Failed to generate inventory report" }, { status: 500 })
  }
}

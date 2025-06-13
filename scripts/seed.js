// This script seeds the database with initial data
const { sql } = require("@vercel/postgres")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

async function seedDatabase() {
  try {
    console.log("Seeding database...")

    // Create a business
    const businessId = uuidv4()
    const now = new Date().toISOString()

    await sql`
      INSERT INTO businesses (
        id, name, business_type, address, currency, tax_rate, fiscal_year_start, created_at, updated_at
      )
      VALUES (
        ${businessId}, 'Demo Company', 'Retail', '123 Main St, Anytown, USA', 
        'USD', 7.5, '2023-01-01', ${now}, ${now}
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

    // Create admin user
    const hashedPassword = await bcrypt.hash("password123", 10)
    const userId = uuidv4()

    await sql`
      INSERT INTO users (
        id, name, email, password, role, business_id, created_at, updated_at
      )
      VALUES (
        ${userId}, 'Admin User', 'admin@example.com', ${hashedPassword}, 
        'admin', ${businessId}, ${now}, ${now}
      )
    `

    // Create categories
    const categories = [
      { name: "Office Supplies", description: "Paper, pens, and other office items" },
      { name: "Electronics", description: "Computers, phones, and other electronic devices" },
      { name: "Furniture", description: "Desks, chairs, and other furniture" },
      { name: "Packaging", description: "Boxes, tape, and other packaging materials" },
    ]

    const categoryIds = {}

    for (const category of categories) {
      const categoryId = uuidv4()
      categoryIds[category.name] = categoryId

      await sql`
        INSERT INTO categories (
          id, name, description, business_id, created_at, updated_at
        )
        VALUES (
          ${categoryId}, ${category.name}, ${category.description}, ${businessId}, ${now}, ${now}
        )
      `
    }

    // Create suppliers
    const suppliers = [
      {
        name: "Office Depot",
        contactName: "John Smith",
        email: "john@officedepot.example.com",
        phone: "555-123-4567",
        address: "456 Business Ave, Commerce City, USA",
        paymentTerms: "Net 30",
      },
      {
        name: "Tech Supplies Inc",
        contactName: "Jane Doe",
        email: "jane@techsupplies.example.com",
        phone: "555-987-6543",
        address: "789 Tech Blvd, Silicon Valley, USA",
        paymentTerms: "Net 15",
      },
    ]

    const supplierIds = {}

    for (const supplier of suppliers) {
      const supplierId = uuidv4()
      supplierIds[supplier.name] = supplierId

      await sql`
        INSERT INTO suppliers (
          id, name, contact_name, email, phone, address, payment_terms, business_id, created_at, updated_at
        )
        VALUES (
          ${supplierId}, ${supplier.name}, ${supplier.contactName}, ${supplier.email},
          ${supplier.phone}, ${supplier.address}, ${supplier.paymentTerms}, ${businessId}, ${now}, ${now}
        )
      `
    }

    // Create inventory items
    const items = [
      {
        name: "Printer Paper",
        sku: "PP-001",
        description: "A4 printer paper, 500 sheets",
        quantity: 50,
        minQuantity: 10,
        costPrice: 3.99,
        sellingPrice: 5.99,
        location: "Shelf A1",
        categoryName: "Office Supplies",
        supplierName: "Office Depot",
      },
      {
        name: "Ballpoint Pens",
        sku: "BP-002",
        description: "Blue ballpoint pens, box of 12",
        quantity: 30,
        minQuantity: 5,
        costPrice: 2.49,
        sellingPrice: 3.99,
        location: "Shelf A2",
        categoryName: "Office Supplies",
        supplierName: "Office Depot",
      },
      {
        name: "Laptop",
        sku: "LT-003",
        description: '15" Laptop, 8GB RAM, 256GB SSD',
        quantity: 5,
        minQuantity: 2,
        costPrice: 599.99,
        sellingPrice: 799.99,
        location: "Shelf B1",
        categoryName: "Electronics",
        supplierName: "Tech Supplies Inc",
      },
    ]

    for (const item of items) {
      const itemId = uuidv4()

      await sql`
        INSERT INTO inventory_items (
          id, name, sku, description, quantity, min_quantity, cost_price, selling_price,
          location, category_id, supplier_id, business_id, created_at, updated_at
        )
        VALUES (
          ${itemId}, ${item.name}, ${item.sku}, ${item.description}, ${item.quantity},
          ${item.minQuantity}, ${item.costPrice}, ${item.sellingPrice}, ${item.location},
          ${categoryIds[item.categoryName]}, ${supplierIds[item.supplierName]}, ${businessId}, ${now}, ${now}
        )
      `

      // Create initial inventory transaction
      await sql`
        INSERT INTO inventory_transactions (
          id, business_id, item_id, quantity, type, notes, user_id, created_at
        )
        VALUES (
          ${uuidv4()}, ${businessId}, ${itemId}, ${item.quantity}, 'initial',
          'Initial inventory setup', ${userId}, ${now}
        )
      `
    }

    console.log("Database seeded successfully!")
    console.log("Business ID:", businessId)
    console.log("Admin user: admin@example.com / password123")
  } catch (error) {
    console.error("Error seeding database:", error)
    process.exit(1)
  }
}

seedDatabase()

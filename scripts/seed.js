const { sql } = require("@vercel/postgres")
const { v4: uuidv4 } = require("uuid")
const bcrypt = require("bcryptjs")

async function seedDatabase() {
  try {
    console.log("Starting database seed...")

    // Check if business already exists
    const checkBusiness = await sql`SELECT * FROM businesses WHERE name = 'Demo Business'`

    if (checkBusiness.rows.length > 0) {
      console.log("Seed data already exists. Skipping...")
      return
    }

    // Create business
    const businessId = uuidv4()
    const now = new Date().toISOString()

    await sql`
      INSERT INTO businesses (
        id, name, business_type, address, currency, tax_rate, 
        fiscal_year_start, created_at, updated_at
      )
      VALUES (
        ${businessId}, 'Demo Business', 'retail', '123 Demo Street, Demo City',
        'USD', 8, 'jan', ${now}, ${now}
      )
    `

    console.log(`Created business: Demo Business (${businessId})`)

    // Create business settings
    const settingsId = uuidv4()
    await sql`
      INSERT INTO business_settings (
        id, low_stock_alerts, auto_order_suggestions, low_stock_threshold, business_id
      )
      VALUES (
        ${settingsId}, true, true, 10, ${businessId}
      )
    `

    console.log("Created business settings")

    // Create admin user
    const adminId = uuidv4()
    const hashedPassword = await bcrypt.hash("password123", 10)

    await sql`
      INSERT INTO users (
        id, name, email, password, role, business_id, created_at, updated_at
      )
      VALUES (
        ${adminId}, 'Admin User', 'admin@example.com', ${hashedPassword},
        'admin', ${businessId}, ${now}, ${now}
      )
    `

    console.log(`Created admin user: admin@example.com (${adminId})`)

    // Create categories
    const categoryIds = []
    const categories = ["Office Supplies", "Electronics", "Packaging", "Furniture"]

    for (const categoryName of categories) {
      const categoryId = uuidv4()
      categoryIds.push(categoryId)

      await sql`
        INSERT INTO categories (
          id, name, business_id, created_at, updated_at
        )
        VALUES (
          ${categoryId}, ${categoryName}, ${businessId}, ${now}, ${now}
        )
      `
    }

    console.log(`Created ${categories.length} categories`)

    // Create suppliers
    const supplierIds = []
    const suppliers = [
      { name: "Acme Supplies", contactName: "John Doe", email: "john@acmesupplies.com", phone: "555-123-4567" },
      { name: "TechWorld", contactName: "Jane Smith", email: "jane@techworld.com", phone: "555-987-6543" },
      { name: "BoxCo Packaging", contactName: "Bob Johnson", email: "bob@boxco.com", phone: "555-456-7890" },
    ]

    for (const supplier of suppliers) {
      const supplierId = uuidv4()
      supplierIds.push(supplierId)

      await sql`
        INSERT INTO suppliers (
          id, name, contact_name, email, phone, business_id, created_at, updated_at
        )
        VALUES (
          ${supplierId}, ${supplier.name}, ${supplier.contactName}, 
          ${supplier.email}, ${supplier.phone}, ${businessId}, ${now}, ${now}
        )
      `
    }

    console.log(`Created ${suppliers.length} suppliers`)

    // Create inventory items
    const items = [
      {
        name: "Office Paper",
        sku: "OFF-PAP-001",
        description: "Premium quality A4 office paper, 80gsm",
        quantity: 124,
        minQuantity: 20,
        costPrice: 3.99,
        sellingPrice: 5.99,
        location: "Shelf A3",
        categoryId: categoryIds[0],
        supplierId: supplierIds[0],
      },
      {
        name: "HDMI Cables",
        sku: "ELE-CAB-002",
        description: "6ft HDMI cables, high speed",
        quantity: 87,
        minQuantity: 15,
        costPrice: 4.5,
        sellingPrice: 12.99,
        location: "Shelf B2",
        categoryId: categoryIds[1],
        supplierId: supplierIds[1],
      },
      {
        name: "Shipping Boxes (Small)",
        sku: "PKG-BOX-001",
        description: "Small shipping boxes, 6x6x6 inches",
        quantity: 65,
        minQuantity: 30,
        costPrice: 0.75,
        sellingPrice: 1.5,
        location: "Warehouse C",
        categoryId: categoryIds[2],
        supplierId: supplierIds[2],
      },
    ]

    for (const item of items) {
      const itemId = uuidv4()

      await sql`
        INSERT INTO inventory_items (
          id, name, sku, description, quantity, min_quantity, cost_price,
          selling_price, location, business_id, category_id, supplier_id,
          created_at, updated_at
        )
        VALUES (
          ${itemId}, ${item.name}, ${item.sku}, ${item.description}, ${item.quantity},
          ${item.minQuantity}, ${item.costPrice}, ${item.sellingPrice}, ${item.location},
          ${businessId}, ${item.categoryId}, ${item.supplierId}, ${now}, ${now}
        )
      `
    }

    console.log(`Created ${items.length} inventory items`)

    // Create devices
    const devices = [
      {
        name: 'MacBook Pro 16"',
        deviceType: "laptop",
        manufacturer: "Apple",
        model: "MacBook Pro",
        serialNumber: "FVFXC2ABCD12",
        sku: "DEV-LAP-001",
        status: "deployed",
        assignedTo: "Sarah Johnson",
      },
      {
        name: 'iPad Pro 12.9"',
        deviceType: "tablet",
        manufacturer: "Apple",
        model: "iPad Pro",
        serialNumber: "DLXPF987ZYX",
        sku: "DEV-TAB-001",
        status: "deployed",
        assignedTo: "Alex Rodriguez",
      },
    ]

    for (const device of devices) {
      const deviceId = uuidv4()

      await sql`
        INSERT INTO devices (
          id, name, device_type, manufacturer, model, serial_number, sku,
          status, assigned_to, business_id, created_at, updated_at
        )
        VALUES (
          ${deviceId}, ${device.name}, ${device.deviceType}, ${device.manufacturer},
          ${device.model}, ${device.serialNumber}, ${device.sku}, ${device.status},
          ${device.assignedTo}, ${businessId}, ${now}, ${now}
        )
      `
    }

    console.log(`Created ${devices.length} devices`)

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}

// Run the seed function if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("Seed completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Seed failed:", error)
      process.exit(1)
    })
}

module.exports = seedDatabase

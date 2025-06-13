// This script sets up the database schema
const { sql } = require("@vercel/postgres")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  try {
    console.log("Setting up database schema...")

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, "schema.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Split the SQL into individual statements
    const statements = schemaSql.split(";").filter((statement) => statement.trim() !== "")

    // Execute each statement
    for (const statement of statements) {
      await sql.query(statement + ";")
    }

    console.log("Database schema setup complete!")
  } catch (error) {
    console.error("Error setting up database schema:", error)
    process.exit(1)
  }
}

setupDatabase()

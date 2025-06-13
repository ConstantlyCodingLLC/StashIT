const { sql } = require("@vercel/postgres")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  try {
    console.log("Setting up database...")

    // Read the schema SQL file
    const schemaPath = path.join(__dirname, "schema.sql")
    const schemaSql = fs.readFileSync(schemaPath, "utf8")

    // Split the SQL into individual statements
    const statements = schemaSql.split(";").filter((statement) => statement.trim() !== "")

    // Execute each statement
    for (const statement of statements) {
      try {
        await sql.query(statement)
      } catch (error) {
        console.error(`Error executing statement: ${statement}`)
        console.error(error)
        // Continue with other statements
      }
    }

    console.log("Database schema created successfully")
  } catch (error) {
    console.error("Error setting up database:", error)
    throw error
  }
}

// Run the setup function if this script is executed directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log("Setup completed")
      process.exit(0)
    })
    .catch((error) => {
      console.error("Setup failed:", error)
      process.exit(1)
    })
}

module.exports = setupDatabase

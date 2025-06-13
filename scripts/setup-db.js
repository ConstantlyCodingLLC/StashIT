const { Pool } = require("pg")
const fs = require("fs")
const path = require("path")

async function setupDatabase() {
  try {
    // Get database connection string from environment variables
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL

    if (!connectionString) {
      console.error(
        "Database connection string not found. Please set DATABASE_URL or POSTGRES_URL environment variable.",
      )
      process.exit(1)
    }

    // Create a new database connection
    const pool = new Pool({
      connectionString,
      ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
    })

    // Read the SQL setup script
    const sqlScript = fs.readFileSync(path.join(__dirname, "setup-database.sql"), "utf8")

    // Execute the SQL script
    await pool.query(sqlScript)

    console.log("Database setup completed successfully!")

    // Close the database connection
    await pool.end()

    return true
  } catch (error) {
    console.error("Error setting up database:", error)
    return false
  }
}

// Execute the setup function if this script is run directly
if (require.main === module) {
  setupDatabase()
    .then((success) => {
      if (success) {
        console.log("Database setup completed.")
      } else {
        console.error("Database setup failed.")
        process.exit(1)
      }
    })
    .catch((error) => {
      console.error("Unexpected error:", error)
      process.exit(1)
    })
}

module.exports = { setupDatabase }

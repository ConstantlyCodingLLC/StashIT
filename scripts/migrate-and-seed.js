const { execSync } = require("child_process")

// Run migrations
console.log("Running Prisma migrations...")
try {
  execSync("npx prisma migrate deploy", { stdio: "inherit" })
  console.log("Migrations completed successfully.")
} catch (error) {
  console.error("Error running migrations:", error)
  process.exit(1)
}

// Run seed script
console.log("Running seed script...")
try {
  execSync("npx ts-node scripts/seed.ts", { stdio: "inherit" })
  console.log("Seed completed successfully.")
} catch (error) {
  console.error("Error running seed script:", error)
  process.exit(1)
}

console.log("Database setup completed successfully.")

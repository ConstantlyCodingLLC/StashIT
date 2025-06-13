import { PrismaClient } from "@prisma/client"

// This script ensures Prisma Client is generated during Vercel build
async function main() {
  // Just instantiate the client to verify it works
  const prisma = new PrismaClient()

  try {
    // Test the connection
    await prisma.$connect()
    console.log("Prisma Client successfully connected to the database")
  } catch (error) {
    console.error("Error connecting to the database:", error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .then(() => {
    console.log("Prisma setup for Vercel completed successfully")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Prisma setup for Vercel failed:", error)
    process.exit(1)
  })

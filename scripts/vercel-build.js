const { execSync } = require("child_process")

try {
  // Force Prisma to generate the client
  console.log("Generating Prisma Client...")
  execSync("npx prisma generate", { stdio: "inherit" })

  console.log("Prisma Client generated successfully!")
} catch (error) {
  console.error("Error generating Prisma Client:", error)
  process.exit(1)
}

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

console.log("Checking dependencies...")

// List of critical dependencies to check
const criticalDeps = [
  "next-themes",
  "@radix-ui/react-alert-dialog",
  "@radix-ui/react-label",
  "@radix-ui/react-select",
  "@radix-ui/react-switch",
]

// Check if node_modules exists
const nodeModulesPath = path.join(process.cwd(), "node_modules")
if (!fs.existsSync(nodeModulesPath)) {
  console.log("node_modules directory not found. Running npm install...")
  try {
    execSync("npm install --no-audit --no-fund", { stdio: "inherit" })
  } catch (error) {
    console.error("Error during npm install:", error)
    process.exit(1)
  }
}

// Check each critical dependency
const missingDeps = []
for (const dep of criticalDeps) {
  const depPath = path.join(nodeModulesPath, dep)
  if (!fs.existsSync(depPath)) {
    missingDeps.push(dep)
  }
}

// Install missing dependencies if any
if (missingDeps.length > 0) {
  console.log(`Installing missing dependencies: ${missingDeps.join(", ")}`)
  try {
    execSync(`npm install ${missingDeps.join(" ")} --no-audit --no-fund`, { stdio: "inherit" })
  } catch (error) {
    console.error("Error installing missing dependencies:", error)
    process.exit(1)
  }
}

console.log("All dependencies are installed.")

const fs = require("fs")
const path = require("path")

// Function to find and modify package.json files
function findAndModifyPackageJson(dir) {
  try {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        // Recursively search directories
        findAndModifyPackageJson(filePath)
      } else if (file === "package.json") {
        try {
          const packageJson = JSON.parse(fs.readFileSync(filePath, "utf8"))
          let modified = false

          // Remove react-day-picker from dependencies
          if (packageJson.dependencies && packageJson.dependencies["react-day-picker"]) {
            delete packageJson.dependencies["react-day-picker"]
            modified = true
            console.log(`Removed react-day-picker from dependencies in ${filePath}`)
          }

          // Remove date-fns from dependencies if it's version 4.x
          if (
            packageJson.dependencies &&
            packageJson.dependencies["date-fns"] &&
            packageJson.dependencies["date-fns"].startsWith("4.")
          ) {
            delete packageJson.dependencies["date-fns"]
            modified = true
            console.log(`Removed date-fns from dependencies in ${filePath}`)
          }

          // Remove react-day-picker from peerDependencies
          if (packageJson.peerDependencies && packageJson.peerDependencies["react-day-picker"]) {
            delete packageJson.peerDependencies["react-day-picker"]
            modified = true
            console.log(`Removed react-day-picker from peerDependencies in ${filePath}`)
          }

          // Write back the modified package.json
          if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(packageJson, null, 2))
            console.log(`Updated ${filePath}`)
          }
        } catch (err) {
          console.error(`Error processing ${filePath}:`, err)
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err)
  }
}

// Start from node_modules
console.log("Starting dependency fix script...")
findAndModifyPackageJson("./node_modules")
console.log("Dependency fix script completed.")

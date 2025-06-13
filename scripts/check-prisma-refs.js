const fs = require("fs")
const path = require("path")

function findPrismaReferences(dir, results = []) {
  const files = fs.readdirSync(dir)

  for (const file of files) {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)

    if (stat.isDirectory() && !filePath.includes("node_modules") && !filePath.includes(".next")) {
      findPrismaReferences(filePath, results)
    } else if (
      stat.isFile() &&
      (filePath.endsWith(".js") || filePath.endsWith(".ts") || filePath.endsWith(".tsx") || filePath.endsWith(".jsx"))
    ) {
      const content = fs.readFileSync(filePath, "utf8")
      if (content.includes("prisma") || content.includes("Prisma")) {
        results.push({
          file: filePath,
          lines: content
            .split("\n")
            .map((line, i) => ({ line, number: i + 1 }))
            .filter(({ line }) => line.includes("prisma") || line.includes("Prisma"))
            .map(({ line, number }) => `Line ${number}: ${line.trim()}`),
        })
      }
    }
  }

  return results
}

const references = findPrismaReferences(".")

if (references.length > 0) {
  console.log("Found Prisma references in the following files:")
  references.forEach((ref) => {
    console.log(`\nFile: ${ref.file}`)
    ref.lines.forEach((line) => console.log(`  ${line}`))
  })
} else {
  console.log("No Prisma references found!")
}

const { execSync } = require("child_process")
const fs = require("fs")
const dotenv = require("dotenv")

// Function to get all environment variables
function getAllEnvVariables() {
  const envVariables = { ...process.env }
  return Object.keys(envVariables).reduce((acc, key) => {
    acc[key] = envVariables[key]
    return acc
  }, {})
}

// Function to write environment variables to a file
function writeEnvFile(variables, filename) {
  const fileContent = Object.entries(variables)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n")
  fs.writeFileSync(filename, fileContent)
  console.log(`${filename} has been created with all environment variables.`)
}

// Main execution
try {
  // Pull Vercel environment variables
  console.log("Pulling Vercel environment variables...")
  execSync("vercel env pull .env.vercel", { stdio: "inherit" })

  // Read Vercel environment variables
  const vercelEnv = dotenv.parse(fs.readFileSync(".env.vercel"))

  // Get all environment variables
  const allEnv = getAllEnvVariables()

  // Merge Vercel and all environment variables
  const mergedEnv = { ...allEnv, ...vercelEnv }

  // Write to .env file
  writeEnvFile(mergedEnv, ".env")

  // Clean up
  fs.unlinkSync(".env.vercel")
  console.log("Temporary .env.vercel file has been removed.")
} catch (error) {
  console.error("An error occurred:", error.message)
}

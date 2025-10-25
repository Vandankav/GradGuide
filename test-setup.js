// Test script to verify the application setup
const fs = require("fs");
const path = require("path");

console.log("🧪 Testing AI Travel Guide Setup...\n");

// Check if all required files exist
const requiredFiles = [
  "package.json",
  "server/package.json",
  "client/package.json",
  "server/index.js",
  "client/src/App.jsx",
  "client/vite.config.js",
  "README.md",
];

let allFilesExist = true;

console.log("📁 Checking required files:");
requiredFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    allFilesExist = false;
  }
});

// Check if .env file exists
console.log("\n🔧 Checking environment setup:");
if (fs.existsSync("server/.env")) {
  console.log("✅ server/.env exists");
} else if (fs.existsSync("server/env.example")) {
  console.log("⚠️  server/.env not found, but env.example exists");
  console.log("   Please copy env.example to .env and add your API keys");
} else {
  console.log("❌ No environment file found");
  allFilesExist = false;
}

// Check package.json scripts
console.log("\n📦 Checking package.json scripts:");
const rootPackage = JSON.parse(fs.readFileSync("package.json", "utf8"));
const requiredScripts = ["dev", "server", "client", "build", "start"];

requiredScripts.forEach((script) => {
  if (rootPackage.scripts && rootPackage.scripts[script]) {
    console.log(`✅ ${script} script exists`);
  } else {
    console.log(`❌ ${script} script missing`);
    allFilesExist = false;
  }
});

// Check if node_modules exist
console.log("\n📚 Checking dependencies:");
const nodeModulesPaths = [
  "node_modules",
  "server/node_modules",
  "client/node_modules",
];

nodeModulesPaths.forEach((modulesPath) => {
  if (fs.existsSync(modulesPath)) {
    console.log(`✅ ${modulesPath} exists`);
  } else {
    console.log(
      `❌ ${modulesPath} missing - run 'npm install' in the respective directory`
    );
    allFilesExist = false;
  }
});

// Summary
console.log("\n" + "=".repeat(50));
if (allFilesExist) {
  console.log("🎉 Setup looks good! You can now run:");
  console.log("   npm run dev");
  console.log("\n📝 Don't forget to:");
  console.log("   1. Add your API keys to server/.env");
  console.log("   2. Start the application with npm run dev");
  console.log("   3. Open http://localhost:5173 in your browser");
} else {
  console.log("❌ Setup incomplete. Please check the missing items above.");
  console.log("\n🔧 Quick fixes:");
  console.log(
    "   - Run the install script: ./install.sh (Linux/Mac) or install.bat (Windows)"
  );
  console.log(
    "   - Or manually run: npm install in root, server, and client directories"
  );
}

console.log("\n📖 For detailed instructions, see README.md");

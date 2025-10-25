@echo off
echo 🚀 Setting up AI Travel Guide...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js (v16 or higher) first.
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install root dependencies
echo 📦 Installing root dependencies...
npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd server
npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
npm install
cd ..

REM Create .env file if it doesn't exist
if not exist server\.env (
    echo 📝 Creating environment file...
    copy server\env.example server\.env
    echo ⚠️  Please update server\.env with your API keys:
    echo    - OPENAI_API_KEY (required for AI features)
    echo    - OPENWEATHER_API_KEY (required for weather data)
)

echo.
echo 🎉 Installation complete!
echo.
echo Next steps:
echo 1. Update server\.env with your API keys
echo 2. Run 'npm run dev' to start the application
echo 3. Open http://localhost:5173 in your browser
echo.
echo For detailed setup instructions, see README.md
pause

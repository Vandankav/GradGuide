#!/bin/bash

echo "🚀 Setting up AI Travel Guide..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (v16 or higher) first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd server
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f server/.env ]; then
    echo "📝 Creating environment file..."
    cp server/env.example server/.env
    echo "⚠️  Please update server/.env with your API keys:"
    echo "   - OPENAI_API_KEY (required for AI features)"
    echo "   - OPENWEATHER_API_KEY (required for weather data)"
fi

echo ""
echo "🎉 Installation complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your API keys"
echo "2. Run 'npm run dev' to start the application"
echo "3. Open http://localhost:5173 in your browser"
echo ""
echo "For detailed setup instructions, see README.md"

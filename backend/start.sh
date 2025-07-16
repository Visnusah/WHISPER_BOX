#!/bin/bash

echo "🚀 Starting WHISPER_BOX Backend Server..."

# Navigate to backend directory
cd "$(dirname "$0")"

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: server.js not found. Make sure you're in the backend directory."
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Check dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "🌟 Starting server on port 5001..."
echo "📊 Health check will be available at: http://localhost:5001/health"
echo "🖼️  Images will be served at: http://localhost:5001/api/images/"
echo ""

node server.js

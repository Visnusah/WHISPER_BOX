#!/bin/bash

echo "Starting WHISPER_BOX Backend Server..."
cd "$(dirname "$0")"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "Error: .env file not found!"
    exit 1
fi

# Start the server
echo "Starting server on port 5000..."
node server.js

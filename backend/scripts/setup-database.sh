#!/bin/bash

# Database Setup Script for Whisper Box

echo "🗄️  Setting up PostgreSQL database for Whisper Box..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "🍺 On macOS with Homebrew: brew install postgresql"
    echo "🐧 On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pgrep -f postgres &> /dev/null; then
    echo "❌ PostgreSQL service is not running."
    echo "🚀 On macOS with Homebrew: brew services start postgresql"
    echo "🐧 On Ubuntu: sudo systemctl start postgresql"
    exit 1
fi

# Database configuration
DB_NAME="whisper_box_db"
DB_USER="postgres"

echo "📋 Database Name: $DB_NAME"
echo "👤 Database User: $DB_USER"

# Create database
echo "🔧 Creating database..."
psql -U $DB_USER -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database '$DB_NAME' created successfully!"
else
    echo "ℹ️  Database '$DB_NAME' might already exist."
fi

# Test connection
echo "🔗 Testing database connection..."
psql -U $DB_USER -d $DB_NAME -c "SELECT version();" &> /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    echo "🎉 Database setup completed!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Update your .env file with the correct database credentials"
    echo "2. Run 'npm run dev' to start the server"
    echo "3. Run 'npm run seed' to populate with demo data"
    echo ""
    echo "🔗 PgAdmin4 connection details:"
    echo "   Host: localhost"
    echo "   Port: 5432"
    echo "   Database: $DB_NAME"
    echo "   Username: $DB_USER"
else
    echo "❌ Database connection failed. Please check your PostgreSQL setup."
    exit 1
fi

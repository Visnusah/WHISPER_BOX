#!/bin/bash

# Whisper Box Database Setup Script
echo "🗄️ Setting up Whisper Box Database..."

# Database configuration from .env
DB_NAME="whisper_box_db"
DB_USER="postgres"
DB_PASSWORD="kamlesh@123"
DB_HOST="localhost"
DB_PORT="5432"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "On macOS: brew install postgresql"
    echo "On Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    exit 1
fi

# Check if PostgreSQL service is running
if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
    echo "⚠️ PostgreSQL service is not running. Starting PostgreSQL..."
    
    # Try to start PostgreSQL on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql
    # Try to start PostgreSQL on Linux
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        sudo systemctl start postgresql
    fi
    
    # Wait a bit for the service to start
    sleep 3
    
    # Check again
    if ! pg_isready -h $DB_HOST -p $DB_PORT &> /dev/null; then
        echo "❌ Failed to start PostgreSQL service. Please start it manually."
        exit 1
    fi
fi

echo "✅ PostgreSQL service is running"

# Create database if it doesn't exist
echo "📝 Creating database: $DB_NAME"

# Use PGPASSWORD to avoid password prompt
export PGPASSWORD=$DB_PASSWORD

# Check if database exists
DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; echo $?)

if [ $DB_EXISTS -eq 0 ]; then
    echo "📄 Database $DB_NAME already exists"
else
    # Create the database
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
    if [ $? -eq 0 ]; then
        echo "✅ Database $DB_NAME created successfully"
    else
        echo "❌ Failed to create database $DB_NAME"
        exit 1
    fi
fi

# Test connection
echo "🔗 Testing database connection..."
psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "SELECT 1;" > /dev/null

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful"
    echo ""
    echo "🎉 Database setup completed!"
    echo ""
    echo "📊 Database Details:"
    echo "   Host: $DB_HOST"
    echo "   Port: $DB_PORT"
    echo "   Database: $DB_NAME"
    echo "   User: $DB_USER"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. cd backend"
    echo "   2. npm run seed"
    echo "   3. npm run dev"
else
    echo "❌ Database connection failed"
    exit 1
fi

# Cleanup
unset PGPASSWORD

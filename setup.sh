#!/bin/bash

# TODO App Setup Script
# This script sets up the entire TODO application

set -e

echo "🚀 Setting up TODO App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed. Please install Python 3.8+"
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    # Check MySQL
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL is not installed. Please install MySQL 8.0+"
    fi
    
    print_success "Requirements check completed"
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Create virtual environment
    print_status "Creating virtual environment..."
    python3 -m venv venv
    
    # Activate virtual environment
    print_status "Activating virtual environment..."
    source venv/bin/activate
    
    # Install dependencies
    print_status "Installing Python dependencies..."
    pip install -r requirements.txt
    
    # Copy environment file
    if [ ! -f .env ]; then
        print_status "Creating environment file..."
        cp .env.example .env
        print_warning "Please edit .env file with your database credentials"
    fi
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing Node.js dependencies..."
    npm install
    
    # Copy environment file
    if [ ! -f .env.local ]; then
        print_status "Creating environment file..."
        echo "NEXT_PUBLIC_API_URL=http://localhost:8000" > .env.local
    fi
    
    print_success "Frontend setup completed"
    cd ..
}

# Setup MySQL database
setup_mysql() {
    print_status "Setting up MySQL database..."
    
    echo ""
    echo "=== MySQL Database Setup ==="
    echo "Please provide your MySQL credentials to create the database."
    echo ""
    
    read -p "MySQL Host [localhost]: " DB_HOST
    DB_HOST=${DB_HOST:-localhost}
    
    read -p "MySQL Port [3306]: " DB_PORT
    DB_PORT=${DB_PORT:-3306}
    
    read -p "MySQL Username [root]: " DB_USER
    DB_USER=${DB_USER:-root}
    
    read -sp "MySQL Password: " DB_PASSWORD
    echo ""
    
    read -p "Database Name [todo_db]: " DB_NAME
    DB_NAME=${DB_NAME:-todo_db}
    
    # Test MySQL connection and create database
    print_status "Testing MySQL connection..."
    if mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "SELECT 1;" > /dev/null 2>&1; then
        print_success "MySQL connection successful!"
        
        # Create database if not exists
        print_status "Creating database '$DB_NAME' if it doesn't exist..."
        mysql -h"$DB_HOST" -P"$DB_PORT" -u"$DB_USER" -p"$DB_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        print_success "Database '$DB_NAME' is ready!"
        
        # Create .env file
        print_status "Creating backend/.env file..."
        echo "DATABASE_URL=mysql+pymysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME" > backend/.env
        print_success "Created backend/.env file"
        
        # Run migrations
        print_status "Running database migrations..."
        cd backend
        source venv/bin/activate
        alembic upgrade head
        cd ..
        print_success "Database migrations completed!"
    else
        print_error "MySQL connection failed!"
        echo ""
        echo "Please check:"
        echo "  1. MySQL is running"
        echo "  2. Credentials are correct"
        echo "  3. MySQL is accessible on $DB_HOST:$DB_PORT"
        echo ""
        echo "You can manually create the .env file later:"
        echo "  DATABASE_URL=mysql+pymysql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
        exit 1
    fi
}

# Main setup function
main() {
    echo "🎯 TODO App Setup Script"
    echo "========================="
    
    # Check requirements
    check_requirements
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Setup MySQL database
    setup_mysql
    
    echo ""
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Start the backend server: cd backend && source venv/bin/activate && python main.py"
    echo "2. Start the frontend server: cd frontend && npm run dev"
    echo "3. Open http://localhost:3000 in your browser"
    echo ""
    echo "📚 For more information, see README.md"
}

# Run main function
main "$@"

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

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    cd backend
    
    # Activate virtual environment
    source venv/bin/activate
    
    # Run migrations
    print_status "Running database migrations..."
    alembic upgrade head
    
    print_success "Database setup completed"
    cd ..
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
    
    # Setup database
    setup_database
    
    echo ""
    print_success "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Edit backend/.env with your database credentials"
    echo "2. Start the backend server: cd backend && source venv/bin/activate && uvicorn main:app --reload"
    echo "3. Start the frontend server: cd frontend && npm run dev"
    echo "4. Open http://localhost:3000 in your browser"
    echo ""
    echo "📚 For more information, see README.md"
}

# Run main function
main "$@"

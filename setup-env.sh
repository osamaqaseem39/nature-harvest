#!/bin/bash

# Nature Harvest Environment Setup Script
# This script helps you set up environment files for all three projects

set -e

echo "🌱 Nature Harvest Environment Setup"
echo "=================================="
echo ""

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

# Function to check if file exists
file_exists() {
    if [ -f "$1" ]; then
        return 0
    else
        return 1
    fi
}

# Function to backup existing file
backup_file() {
    if file_exists "$1"; then
        cp "$1" "$1.backup.$(date +%Y%m%d_%H%M%S)"
        print_warning "Backed up existing $1"
    fi
}

# Function to copy example file
copy_example() {
    local example_file="$1"
    local target_file="$2"
    local project_name="$3"
    
    if file_exists "$example_file"; then
        backup_file "$target_file"
        cp "$example_file" "$target_file"
        print_success "Created $target_file for $project_name"
    else
        print_error "Example file $example_file not found!"
        return 1
    fi
}

# Function to generate random JWT secret
generate_jwt_secret() {
    openssl rand -base64 32 | tr -d "=+/" | cut -c1-32
}

# Function to prompt for input with default
prompt_with_default() {
    local prompt="$1"
    local default="$2"
    local var_name="$3"
    
    echo -n "$prompt [$default]: "
    read -r input
    if [ -z "$input" ]; then
        input="$default"
    fi
    eval "$var_name='$input'"
}

# Main setup process
main() {
    print_status "Starting environment setup..."
    echo ""
    
    # Check if we're in the right directory
    if [ ! -d "nature-harvest-server" ] || [ ! -d "nature-harvest-dashboard" ] || [ ! -d "nature-harvest-website" ]; then
        print_error "Please run this script from the root directory containing all three projects"
        exit 1
    fi
    
    # Generate a secure JWT secret
    JWT_SECRET=$(generate_jwt_secret)
    
    # Get user preferences
    echo "Please provide the following information for your environment setup:"
    echo ""
    
    prompt_with_default "MongoDB URI" "mongodb://localhost:27017/nature-harvest" "MONGODB_URI"
    prompt_with_default "Server Port" "3002" "SERVER_PORT"
    prompt_with_default "API URL for clients" "https://nature-harvest-q2ra.vercel.app/api" "API_URL"
    prompt_with_default "Website URL" "http://localhost:3000" "WEBSITE_URL"
    prompt_with_default "Dashboard URL" "http://localhost:3001" "DASHBOARD_URL"
    
    echo ""
    print_status "Setting up environment files..."
    echo ""
    
    # Setup Server Environment
    print_status "Setting up server environment..."
    copy_example "nature-harvest-server/env.example" "nature-harvest-server/.env" "Server"
    
    # Update server .env with user values
    sed -i.bak "s|mongodb://localhost:27017/nature-harvest|$MONGODB_URI|g" nature-harvest-server/.env
    sed -i.bak "s|PORT=3002|PORT=$SERVER_PORT|g" nature-harvest-server/.env
    sed -i.bak "s|your-super-secure-secret-key-change-this-in-production|$JWT_SECRET|g" nature-harvest-server/.env
    rm -f nature-harvest-server/.env.bak
    
    # Setup Dashboard Environment
    print_status "Setting up dashboard environment..."
    copy_example "nature-harvest-dashboard/env.example" "nature-harvest-dashboard/.env" "Dashboard"
    
    # Update dashboard .env with user values
    sed -i.bak "s|http://localhost:3002/api|$API_URL|g" nature-harvest-dashboard/.env
    sed -i.bak "s|http://localhost:3001|$DASHBOARD_URL|g" nature-harvest-dashboard/.env
    rm -f nature-harvest-dashboard/.env.bak
    
    # Setup Website Environment
    print_status "Setting up website environment..."
    copy_example "nature-harvest-website/env.example" "nature-harvest-website/.env.local" "Website"
    
    # Update website .env.local with user values
    sed -i.bak "s|http://localhost:3002/api|$API_URL|g" nature-harvest-website/.env.local
    sed -i.bak "s|http://localhost:3000|$WEBSITE_URL|g" nature-harvest-website/.env.local
    rm -f nature-harvest-website/.env.local.bak
    
    echo ""
    print_success "Environment setup completed!"
    echo ""
    
    # Display summary
    echo "📋 Setup Summary:"
    echo "================="
    echo "• Server: nature-harvest-server/.env"
    echo "• Dashboard: nature-harvest-dashboard/.env"
    echo "• Website: nature-harvest-website/.env.local"
    echo ""
    echo "🔧 Configuration:"
    echo "================="
    echo "• MongoDB URI: $MONGODB_URI"
    echo "• Server Port: $SERVER_PORT"
    echo "• API URL: $API_URL"
    echo "• Website URL: $WEBSITE_URL"
    echo "• Dashboard URL: $DASHBOARD_URL"
    echo "• JWT Secret: [Generated securely]"
    echo ""
    
    # Next steps
    echo "🚀 Next Steps:"
    echo "=============="
    echo "1. Start MongoDB: docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo "2. Start Server: cd nature-harvest-server && npm install && npm start"
    echo "3. Start Dashboard: cd nature-harvest-dashboard && npm install && npm start"
    echo "4. Start Website: cd nature-harvest-website && npm install && npm run dev"
    echo ""
    
    print_warning "Remember to:"
    echo "• Never commit .env files to version control"
    echo "• Use different secrets for production"
    echo "• Set up proper CORS origins for production"
    echo "• Configure SSL certificates for production"
    echo ""
    
    print_success "Setup complete! Happy coding! 🎉"
}

# Run the main function
main "$@" 
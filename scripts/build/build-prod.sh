#!/bin/bash

echo "🏗️ Building RPG Fantasy Multiplayer for production..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf client/dist client/build server/dist
print_success "Previous builds cleaned"

# Build server
print_status "Building server..."
cd server
npm run build
if [ $? -ne 0 ]; then
    print_error "Server build failed"
    exit 1
fi
cd ..
print_success "Server built successfully"

# Build client
print_status "Building client..."
cd client
npm run build
if [ $? -ne 0 ]; then
    print_error "Client build failed"
    exit 1
fi
cd ..
print_success "Client built successfully"

# Build Docker images
print_status "Building Docker images..."
docker-compose build
if [ $? -ne 0 ]; then
    print_error "Docker build failed"
    exit 1
fi
print_success "Docker images built successfully"

print_success "Production build completed!"
echo ""
echo "🚀 Ready for deployment!"
echo ""
echo "📋 Next steps:"
echo "  • Test production build: docker-compose -f docker-compose.prod.yml up"
echo "  • Deploy to production server"
echo "  • Update environment variables for production"

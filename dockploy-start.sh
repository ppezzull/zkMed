#!/bin/bash
set -e

echo "🚀 Starting zkMed Dockploy Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null && ! command -v docker &> /dev/null; then
    print_error "Docker or Docker Compose not found!"
    exit 1
fi

# Use docker compose (newer) or docker-compose (legacy)
DOCKER_COMPOSE_CMD="docker-compose"
if command -v docker &> /dev/null && docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
fi

print_info "Using Docker Compose command: $DOCKER_COMPOSE_CMD"

# Create necessary directories
print_info "Creating necessary directories..."
mkdir -p srcs/demo-data
mkdir -p srcs/containers/nginx/ssl
mkdir -p logs

# Set permissions for deployment script
if [ -f "srcs/foundry/scripts/deploy.sh" ]; then
    chmod +x srcs/foundry/scripts/deploy.sh
    print_status "Made deployment script executable"
fi

# Clean up any existing containers
print_info "Cleaning up existing containers..."
$DOCKER_COMPOSE_CMD -f dockploy-compose.yml down --remove-orphans --volumes 2>/dev/null || true

# Build and start services
print_info "Building and starting zkMed services..."
$DOCKER_COMPOSE_CMD -f dockploy-compose.yml up --build -d

# Wait for services to be ready
print_info "Waiting for services to be ready..."

# Wait for Mantle fork
print_info "Waiting for Mantle fork to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        http://localhost:8545 > /dev/null 2>&1; then
        print_status "Mantle fork is ready!"
        break
    fi
    attempt=$((attempt + 1))
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    print_error "Mantle fork failed to start within expected time"
    exit 1
fi

# Wait for contract deployment
print_info "Waiting for contract deployment..."
max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker logs zkmed-deployer 2>&1 | grep -q "Deployment completed successfully!"; then
        print_status "Contracts deployed successfully!"
        break
    fi
    if docker logs zkmed-deployer 2>&1 | grep -q "Error\|Failed"; then
        print_error "Contract deployment failed!"
        print_info "Deployment logs:"
        docker logs zkmed-deployer
        exit 1
    fi
    attempt=$((attempt + 1))
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    print_error "Contract deployment timed out"
    exit 1
fi

# Wait for frontend to be ready
print_info "Waiting for frontend to be ready..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
        print_status "Frontend is ready!"
        break
    fi
    attempt=$((attempt + 1))
    sleep 2
done

if [ $attempt -eq $max_attempts ]; then
    print_warning "Frontend health check timed out, but continuing..."
fi

# Display service status
print_info "Checking service status..."
$DOCKER_COMPOSE_CMD -f dockploy-compose.yml ps

# Get contract information
print_info "Getting deployment information..."
if [ -f "srcs/foundry/out/addresses.json" ]; then
    print_status "Contract addresses:"
    cat srcs/foundry/out/addresses.json | jq '.contracts' 2>/dev/null || cat srcs/foundry/out/addresses.json
else
    print_warning "Contract addresses file not found"
fi

# Display service URLs
echo ""
print_status "🎉 zkMed Deployment Complete!"
echo ""
print_info "Service URLs:"
echo "  📱 Frontend: http://localhost:3000"
echo "  🔗 Blockchain RPC: http://localhost:8545"
echo "  🗂️  Demo API: http://localhost:8080"
echo "  🏥 Nginx Proxy: http://localhost:80"
echo ""
print_info "Health Checks:"
echo "  🔍 Frontend Health: http://localhost:3000/api/health"
echo "  🔍 Nginx Health: http://localhost/nginx-health"
echo ""
print_info "Demo Accounts:"
echo "  👤 Account 1 (Admin): 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
echo "  👤 Account 2 (User):  0x70997970C51812dc3A010C7d01b50e0d17dc79C8"  
echo "  👤 Account 3 (User):  0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
echo ""
print_status "Ready for Dockploy deployment! 🚀"

# Optional: Display logs in follow mode
if [ "$1" = "--logs" ]; then
    print_info "Following container logs (Ctrl+C to exit)..."
    $DOCKER_COMPOSE_CMD -f dockploy-compose.yml logs -f
fi 
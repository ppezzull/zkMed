#!/bin/bash
# zkMed Local Development Environment Setup Script

set -e

echo "🚀 zkMed Local Development Setup"
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    if ! command -v forge &> /dev/null; then
        print_error "Foundry not found. Please install: curl -L https://foundry.paradigm.xyz | bash"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker not found. Please install Docker"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose not found. Please install Docker Compose"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js not found. Please install Node.js"
        exit 1
    fi
    
    print_success "All prerequisites found"
}

# Build contracts
build_contracts() {
    print_status "Building smart contracts..."
    cd backend
    forge build
    cd ..
    print_success "Contracts built successfully"
}

# Start vlayer services
start_vlayer_services() {
    print_status "Starting vlayer services..."
    cd backend/vlayer
    
    # Check if services are already running
    if docker-compose -f docker-compose.devnet.yaml ps | grep -q "Up"; then
        print_warning "vlayer services already running"
    else
        docker-compose -f docker-compose.devnet.yaml up -d
        print_status "Waiting for services to start..."
        sleep 15
    fi
    
    cd ../..
    print_success "vlayer services started"
}

# Health check services
health_check() {
    print_status "Performing health check..."
    
    # Check Anvil
    if curl -s http://localhost:8545 -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' > /dev/null; then
        print_success "Anvil: OK"
    else
        print_error "Anvil: FAILED"
        return 1
    fi
    
    # Check vlayer Call Server
    if curl -s http://localhost:3000/health > /dev/null; then
        print_success "vlayer Call Server: OK"
    else
        print_error "vlayer Call Server: FAILED"
        return 1
    fi
    
    # Check vlayer DNS Server
    if curl -s http://localhost:3002/health > /dev/null; then
        print_success "vlayer DNS Server: OK"
    else
        print_error "vlayer DNS Server: FAILED"
        return 1
    fi
    
    print_success "All services healthy"
}

# Deploy contracts
deploy_contracts() {
    print_status "Deploying contracts to local Anvil..."
    cd backend
    
    forge script script/DeployLocal.s.sol \
        --rpc-url http://localhost:8545 \
        --broadcast \
        --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
    
    cd ..
    print_success "Contracts deployed successfully"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    cd backend
    forge test --rpc-url http://localhost:8545
    cd ..
    print_success "Tests completed"
}

# Setup vlayer environment
setup_vlayer_env() {
    print_status "Setting up vlayer environment..."
    cd backend/vlayer
    
    if [ ! -f .env ]; then
        cp .env.dev .env
        print_success "vlayer environment configured"
    else
        print_warning "vlayer environment already exists"
    fi
    
    if [ ! -d node_modules ]; then
        npm install
        print_success "Node.js dependencies installed"
    else
        print_warning "Node.js dependencies already installed"
    fi
    
    cd ../..
}

# Display connection info
display_info() {
    print_success "🎉 zkMed Local Development Environment Ready!"
    echo ""
    echo "=== Service Endpoints ==="
    echo "Anvil RPC:           http://localhost:8545"
    echo "vlayer Call Server:  http://localhost:3000"
    echo "vlayer DNS Server:   http://localhost:3002"
    echo ""
    echo "=== Test Accounts ==="
    echo "Default Account:     0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    echo "Private Key:         0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
    echo ""
    echo "=== Next Steps ==="
    echo "1. Test email proof: cd backend/vlayer && npx tsx proveEmailDomain.ts"
    echo "2. Run specific tests: cd backend && forge test --match-test testCompletePatientJourney"
    echo "3. Use Makefile commands: make help"
    echo ""
    echo "=== Useful Commands ==="
    echo "Stop services:       cd backend && make stop-local"
    echo "View logs:           cd backend && make logs"
    echo "Health check:        cd backend && make health"
    echo "Reset environment:   cd backend && make reset"
}

# Main setup function
main() {
    print_status "Starting zkMed local development setup..."
    
    check_prerequisites
    build_contracts
    setup_vlayer_env
    start_vlayer_services
    
    # Wait a bit more for services to be fully ready
    print_status "Waiting for services to stabilize..."
    sleep 10
    
    health_check
    deploy_contracts
    run_tests
    
    display_info
}

# Handle script arguments
case "${1:-setup}" in
    "setup")
        main
        ;;
    "health")
        health_check
        ;;
    "stop")
        print_status "Stopping all services..."
        cd backend/vlayer
        docker-compose -f docker-compose.devnet.yaml down
        print_success "Services stopped"
        ;;
    "logs")
        print_status "Showing service logs..."
        cd backend/vlayer
        docker-compose -f docker-compose.devnet.yaml logs --tail=50
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  setup   - Full environment setup (default)"
        echo "  health  - Health check all services"
        echo "  stop    - Stop all services"
        echo "  logs    - Show service logs"
        echo "  help    - Show this help"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac

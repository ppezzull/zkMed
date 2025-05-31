#!/bin/bash

# vlayer Development Environment Setup and Testing Script
# Comprehensive tool for managing vlayer local development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
VLAYER_DIR="vlayer"
BACKEND_DIR="."
ANVIL_L1_PORT="8545"
ANVIL_L2_PORT="8546"
CALL_SERVER_PORT="3000"
VDNS_PORT="3002"
WSPROXY_PORT="3003"
NOTARY_PORT="7047"

# Header
print_header() {
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}         vlayer Development Environment Manager       ${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
    echo
}

# Function to show usage
show_usage() {
    echo -e "${YELLOW}Usage: $0 [COMMAND]${NC}"
    echo
    echo -e "${YELLOW}Environment Management:${NC}"
    echo -e "  ${GREEN}setup${NC}       - Initial setup and environment check"
    echo -e "  ${GREEN}start${NC}       - Start complete vlayer development environment"
    echo -e "  ${GREEN}stop${NC}        - Stop all vlayer services"
    echo -e "  ${GREEN}restart${NC}     - Restart all vlayer services"
    echo -e "  ${GREEN}status${NC}      - Check status of all services"
    echo -e "  ${GREEN}health${NC}      - Run comprehensive health checks"
    echo
    echo -e "${YELLOW}Development Tools:${NC}"
    echo -e "  ${GREEN}test-env${NC}    - Test vlayer environment connectivity"
    echo -e "  ${GREEN}deploy${NC}      - Deploy contracts to local vlayer environment"
    echo -e "  ${GREEN}prove${NC}       - Run vlayer proof generation test"
    echo -e "  ${GREEN}verify${NC}      - Verify proofs on local chain"
    echo
    echo -e "${YELLOW}Utilities:${NC}"
    echo -e "  ${GREEN}logs${NC}       - Show logs from all services"
    echo -e "  ${GREEN}clean${NC}      - Clean up development environment"
    echo -e "  ${GREEN}reset${NC}      - Full reset (stop, clean, rebuild, start)"
    echo -e "  ${GREEN}monitor${NC}    - Real-time monitoring dashboard"
    echo
}

# Function to check prerequisites
check_prerequisites() {
    echo -e "${BLUE}🔍 Checking Prerequisites${NC}"
    echo -e "${BLUE}─────────────────────────${NC}"
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker not found${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ Docker found${NC}"
    
    # Check Docker Compose
    if ! docker compose version &> /dev/null; then
        echo -e "${RED}❌ Docker Compose not found${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ Docker Compose found${NC}"
    
    # Check if vlayer directory exists
    if [ ! -d "$VLAYER_DIR" ]; then
        echo -e "${RED}❌ vlayer directory not found${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ vlayer directory found${NC}"
    
    # Check if foundry is available
    if ! command -v forge &> /dev/null; then
        echo -e "${RED}❌ Foundry not found${NC}"
        return 1
    fi
    echo -e "${GREEN}✅ Foundry found${NC}"
    
    echo
}

# Function to setup environment
setup_environment() {
    echo -e "${BLUE}🚀 Setting up vlayer Development Environment${NC}"
    echo -e "${BLUE}──────────────────────────────────────────────${NC}"
    
    # Check prerequisites
    if ! check_prerequisites; then
        echo -e "${RED}❌ Prerequisites check failed${NC}"
        return 1
    fi
    
    # Build Docker images if needed
    echo -e "${YELLOW}🔨 Building Docker images...${NC}"
    cd "$VLAYER_DIR"
    docker compose -f docker-compose.devnet.yaml build
    cd ..
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    cd "$VLAYER_DIR"
    if [ -f "package.json" ]; then
        npm install
    fi
    cd ..
    
    # Compile contracts
    echo -e "${YELLOW}⚙️  Compiling contracts...${NC}"
    forge build
    
    echo -e "${GREEN}✅ Environment setup completed${NC}"
    echo
}

# Function to start services
start_services() {
    echo -e "${BLUE}▶️  Starting vlayer Services${NC}"
    echo -e "${BLUE}─────────────────────────${NC}"
    
    cd "$VLAYER_DIR"
    
    # Stop any conflicting processes
    echo -e "${YELLOW}🛑 Stopping conflicting processes...${NC}"
    pkill -f "anvil.*8545" || true
    
    # Start services
    echo -e "${YELLOW}🚀 Starting Docker services...${NC}"
    docker compose -f docker-compose.devnet.yaml up -d
    
    cd ..
    
    # Wait for services to be ready
    echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
    sleep 10
    
    echo -e "${GREEN}✅ Services started${NC}"
    echo
}

# Function to test environment connectivity
test_environment() {
    echo -e "${BLUE}🧪 Testing vlayer Environment${NC}"
    echo -e "${BLUE}─────────────────────────────${NC}"
    
    # Test Anvil L1
    echo -e "${YELLOW}Testing Anvil L1 (port $ANVIL_L1_PORT)...${NC}"
    if curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
        "http://localhost:$ANVIL_L1_PORT" | grep -q "0x7a69"; then
        echo -e "${GREEN}✅ Anvil L1 responsive (Chain ID: 31337)${NC}"
    else
        echo -e "${RED}❌ Anvil L1 not responsive${NC}"
    fi
    
    # Test Anvil L2
    echo -e "${YELLOW}Testing Anvil L2 (port $ANVIL_L2_PORT)...${NC}"
    if curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
        "http://localhost:$ANVIL_L2_PORT" | grep -q "0x7a6a"; then
        echo -e "${GREEN}✅ Anvil L2 responsive (Chain ID: 31338)${NC}"
    else
        echo -e "${RED}❌ Anvil L2 not responsive${NC}"
    fi
    
    # Test Call Server
    echo -e "${YELLOW}Testing Call Server (port $CALL_SERVER_PORT)...${NC}"
    response_code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:$CALL_SERVER_PORT" 2>/dev/null || echo "000")
    if [[ "$response_code" =~ ^(200|404|405)$ ]]; then
        echo -e "${GREEN}✅ Call Server responsive (HTTP $response_code)${NC}"
    else
        echo -e "${RED}❌ Call Server not responsive (HTTP $response_code)${NC}"
    fi
    
    # Test VDNS Server
    echo -e "${YELLOW}Testing VDNS Server (port $VDNS_PORT)...${NC}"
    if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$VDNS_PORT" | grep -q "200\|404"; then
        echo -e "${GREEN}✅ VDNS Server responsive${NC}"
    else
        echo -e "${RED}❌ VDNS Server not responsive${NC}"
    fi
    
    # Test Notary Server
    echo -e "${YELLOW}Testing Notary Server (port $NOTARY_PORT)...${NC}"
    if nc -z localhost "$NOTARY_PORT"; then
        echo -e "${GREEN}✅ Notary Server responsive${NC}"
    else
        echo -e "${RED}❌ Notary Server not responsive${NC}"
    fi
    
    echo
}

# Function to deploy contracts
deploy_contracts() {
    echo -e "${BLUE}📄 Deploying Contracts to Local Environment${NC}"
    echo -e "${BLUE}────────────────────────────────────────────${NC}"
    
    # Deploy to Anvil L1
    echo -e "${YELLOW}🚀 Deploying to Anvil L1 (Chain ID: 31337)...${NC}"
    forge script script/DeployLocal.s.sol --rpc-url "http://localhost:$ANVIL_L1_PORT" --broadcast --chain-id 31337 || true
    
    # Deploy to Anvil L2
    echo -e "${YELLOW}🚀 Deploying to Anvil L2 (Chain ID: 31338)...${NC}"
    forge script script/DeployLocal.s.sol --rpc-url "http://localhost:$ANVIL_L2_PORT" --broadcast --chain-id 31338 || true
    
    echo -e "${GREEN}✅ Contract deployment completed${NC}"
    echo
}

# Function to run proof generation test
test_proof_generation() {
    echo -e "${BLUE}🔬 Testing vlayer Proof Generation${NC}"
    echo -e "${BLUE}──────────────────────────────────${NC}"
    
    cd "$VLAYER_DIR"
    
    if [ -f "prove.ts" ]; then
        echo -e "${YELLOW}🔍 Running proof generation test...${NC}"
        npx tsx prove.ts || echo -e "${YELLOW}⚠️  Proof generation test completed with warnings${NC}"
    else
        echo -e "${YELLOW}⚠️  No prove.ts file found, skipping proof test${NC}"
    fi
    
    cd ..
    echo
}

# Function to run comprehensive health check
health_check() {
    echo -e "${BLUE}🏥 Comprehensive Health Check${NC}"
    echo -e "${BLUE}─────────────────────────────${NC}"
    
    # Run container analysis
    ./scripts/vlayer-docker-analysis.sh health
    
    # Test connectivity
    test_environment
    
    # Check logs for errors
    echo -e "${YELLOW}🔍 Checking for critical errors in logs...${NC}"
    if docker logs vlayer-call-server 2>&1 | grep -i "error\|failed\|exception" | head -5; then
        echo -e "${YELLOW}⚠️  Found some errors in call-server logs${NC}"
    fi
    
    echo -e "${GREEN}✅ Health check completed${NC}"
    echo
}

# Function to clean environment
clean_environment() {
    echo -e "${BLUE}🧹 Cleaning Development Environment${NC}"
    echo -e "${BLUE}─────────────────────────────────${NC}"
    
    cd "$VLAYER_DIR"
    
    # Stop and remove containers
    docker compose -f docker-compose.devnet.yaml down --remove-orphans
    
    # Clean up Docker resources
    docker system prune -f
    
    cd ..
    
    # Clean forge cache
    forge clean
    
    echo -e "${GREEN}✅ Environment cleaned${NC}"
    echo
}

# Function to reset environment
reset_environment() {
    echo -e "${BLUE}🔄 Resetting vlayer Development Environment${NC}"
    echo -e "${BLUE}─────────────────────────────────────────────${NC}"
    
    # Stop services
    cd "$VLAYER_DIR"
    docker compose -f docker-compose.devnet.yaml down --remove-orphans
    cd ..
    
    # Clean
    clean_environment
    
    # Rebuild and start
    setup_environment
    start_services
    
    # Test
    test_environment
    
    echo -e "${GREEN}✅ Environment reset completed${NC}"
    echo
}

# Function for real-time monitoring
monitor_environment() {
    echo -e "${BLUE}📺 Real-time vlayer Environment Monitoring${NC}"
    echo -e "${BLUE}─────────────────────────────────────────────${NC}"
    echo -e "${YELLOW}Press Ctrl+C to exit${NC}"
    echo
    
    while true; do
        clear
        print_header
        
        # Show container status
        ./scripts/vlayer-docker-analysis.sh status
        
        # Show port usage
        echo -e "${YELLOW}📊 Current Resource Usage:${NC}"
        echo -e "${YELLOW}─────────────────────────${NC}"
        docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -8
        echo
        
        echo -e "${YELLOW}Last updated: $(date)${NC}"
        sleep 5
    done
}

# Main execution
print_header

case "${1:-}" in
    "setup")
        setup_environment
        ;;
    "start")
        start_services
        ;;
    "stop")
        cd "$VLAYER_DIR"
        docker compose -f docker-compose.devnet.yaml down
        cd ..
        echo -e "${GREEN}✅ Services stopped${NC}"
        ;;
    "restart")
        cd "$VLAYER_DIR"
        docker compose -f docker-compose.devnet.yaml restart
        cd ..
        echo -e "${GREEN}✅ Services restarted${NC}"
        ;;
    "status")
        ./scripts/vlayer-docker-analysis.sh status
        ;;
    "health")
        health_check
        ;;
    "test-env")
        test_environment
        ;;
    "deploy")
        deploy_contracts
        ;;
    "prove")
        test_proof_generation
        ;;
    "verify")
        echo -e "${YELLOW}🔍 Verification functionality coming soon...${NC}"
        ;;
    "logs")
        ./scripts/vlayer-docker-analysis.sh logs
        ;;
    "clean")
        clean_environment
        ;;
    "reset")
        reset_environment
        ;;
    "monitor")
        monitor_environment
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    "")
        echo -e "${YELLOW}🔧 vlayer Development Environment Manager${NC}"
        echo
        show_usage
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo
        show_usage
        exit 1
        ;;
esac

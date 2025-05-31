#!/bin/bash
# vlayer Docker Infrastructure Analysis Script

set -e

echo "🔍 vlayer Docker Infrastructure Analysis"
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${CYAN}=== $1 ===${NC}"
}

print_info() {
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

# Check if in correct directory
if [ ! -f "docker-compose.devnet.yaml" ]; then
    print_error "Must be run from the vlayer directory"
    exit 1
fi

print_header "Docker Compose Configuration Analysis"
echo ""

# Analyze docker-compose structure
print_info "Analyzing docker-compose.devnet.yaml..."
echo ""

# Show the include structure
echo "📋 Service Include Structure:"
grep -E "^[[:space:]]*-" docker-compose.devnet.yaml | sed 's/^[[:space:]]*-[[:space:]]*/  ▶ /'
echo ""

# Analyze each service file
print_header "Service Configuration Details"
echo ""

# Function to analyze service file
analyze_service() {
    local service_file="$1"
    local service_name="$2"
    
    if [ -f "$service_file" ]; then
        print_info "📦 $service_name"
        echo "   File: $service_file"
        
        # Extract key information
        if grep -q "image:" "$service_file"; then
            local image=$(grep "image:" "$service_file" | sed 's/.*image:[[:space:]]*//' | head -1)
            echo "   Image: $image"
        fi
        
        if grep -q "ports:" "$service_file"; then
            echo "   Ports:"
            grep -A 10 "ports:" "$service_file" | grep -E "^[[:space:]]*-" | sed 's/^[[:space:]]*-[[:space:]]*/     /'
        fi
        
        if grep -q "command:" "$service_file"; then
            local command=$(grep "command:" "$service_file" | sed 's/.*command:[[:space:]]*//')
            echo "   Command: $command"
        fi
        
        if grep -q "depends_on:" "$service_file"; then
            echo "   Dependencies:"
            grep -A 5 "depends_on:" "$service_file" | grep -E "^[[:space:]]*-" | sed 's/^[[:space:]]*-[[:space:]]*/     /'
        fi
        
        echo ""
    else
        print_warning "Service file not found: $service_file"
    fi
}

# Analyze each service
analyze_service "anvil/service.yaml" "Anvil Blockchain Services"
analyze_service "vdns_server/service.yaml" "vlayer DNS Server"
analyze_service "call_server/service.yaml" "vlayer Call Server"
analyze_service "websockify/service.yaml" "WebSocket Proxy"
analyze_service "websockify-test-client/service.yaml" "WebSocket Test Client"
analyze_service "notary-server/service.yaml" "Notary Server"

print_header "Network Architecture Analysis"
echo ""

print_info "🌐 Network Topology:"
echo ""
echo "     ┌─────────────────┐    ┌─────────────────┐"
echo "     │   anvil-l1      │    │   anvil-l2-op   │"
echo "     │   Chain: 31337  │    │   Chain: 31338  │"
echo "     │   Port: 8545    │    │   Port: 8546    │"
echo "     └─────────┬───────┘    └─────────┬───────┘"
echo "               │                      │"
echo "               └──────────┬───────────┘"
echo "                          │"
echo "               ┌──────────▼───────────┐"
echo "               │  vlayer-call-server  │"
echo "               │      Port: 3000      │"
echo "               │  (Proof Generation)  │"
echo "               └──────────┬───────────┘"
echo "                          │"
echo "               ┌──────────▼───────────┐"
echo "               │     vdns_server      │"
echo "               │      Port: 3002      │"
echo "               │  (Domain Resolution) │"
echo "               └──────────────────────┘"
echo ""
echo "     ┌─────────────────┐    ┌─────────────────┐"
echo "     │   websockify    │    │  notary-server  │"
echo "     │   Port: 3003    │    │   Port: 7047    │"
echo "     │ (WebProof Proxy)│    │ (TLS Notarize)  │"
echo "     └─────────────────┘    └─────────────────┘"
echo ""

print_header "Port Mapping Analysis"
echo ""

print_info "📡 Exposed Ports:"
echo "   8545  - Anvil L1 (Main blockchain)"
echo "   8546  - Anvil L2 Optimism (Layer 2)"
echo "   3000  - vlayer Call Server (Proof generation)"
echo "   3002  - vlayer DNS Server (Domain resolution)"
echo "   3003  - WebSocket Proxy (WebProof connections)"
echo "   7047  - Notary Server (TLS notarization)"
echo ""

print_info "🔌 Service Dependencies:"
echo "   vlayer-call-server → anvil-l1, anvil-l2-op"
echo "   websockify → websockify-test-client"
echo "   notary-server → (standalone)"
echo "   vdns_server → (standalone)"
echo ""

print_header "Production vs Development Analysis"
echo ""

print_info "🔧 Development Mode (Current Docker Setup):"
echo "   ✓ Local Anvil chains for testing"
echo "   ✓ All services containerized"
echo "   ✓ Fake proof mode enabled"
echo "   ✓ Local network isolation"
echo "   ✓ Persistent volumes for configuration"
echo ""

print_info "🚀 Production Mode Differences:"
echo "   • Real blockchain networks (Mainnet, Arbitrum, etc.)"
echo "   • vlayer hosted services (no local containers)"
echo "   • Real proof generation (not fake mode)"
echo "   • External RPC providers (Alchemy, Infura)"
echo "   • Proper key management and security"
echo ""

print_header "Service Health Check"
echo ""

# Function to check if a port is open
check_port() {
    local port=$1
    local service=$2
    
    if nc -z localhost $port 2>/dev/null; then
        print_success "$service (port $port): RUNNING"
    else
        print_warning "$service (port $port): NOT RUNNING"
    fi
}

print_info "Checking service availability..."
check_port 8545 "Anvil L1"
check_port 8546 "Anvil L2"
check_port 3000 "vlayer Call Server"
check_port 3002 "vlayer DNS Server"
check_port 3003 "WebSocket Proxy"
check_port 7047 "Notary Server"
echo ""

print_header "Docker Container Status"
echo ""

if command -v docker-compose &> /dev/null; then
    print_info "Current container status:"
    docker-compose -f docker-compose.devnet.yaml ps 2>/dev/null || print_warning "Services not running"
    echo ""
else
    print_warning "Docker Compose not found"
fi

print_header "Environment Configuration Analysis"
echo ""

# Check environment files
for env_file in .env.dev .env.testnet .env.mainnet; do
    if [ -f "$env_file" ]; then
        print_info "📄 $env_file:"
        grep -v "^#" "$env_file" | grep -v "^$" | sed 's/^/   /'
        echo ""
    fi
done

print_header "vlayer Integration Points"
echo ""

print_info "🔗 Key Integration Points:"
echo ""
echo "1. 📧 Email Proof Generation:"
echo "   • Client connects to vlayer Call Server (port 3000)"
echo "   • Submits email data for proof generation"
echo "   • Receives cryptographic proof"
echo ""
echo "2. 🌐 Domain Resolution:"
echo "   • vlayer DNS Server (port 3002) resolves domains"
echo "   • Provides domain ownership verification"
echo ""
echo "3. 🔐 TLS Notarization:"
echo "   • Notary Server (port 7047) notarizes TLS connections"
echo "   • Provides cryptographic proof of email authenticity"
echo ""
echo "4. 🌍 WebProof Support:"
echo "   • WebSocket Proxy (port 3003) enables browser connections"
echo "   • Supports web-based proof generation"
echo ""

print_header "Connection Testing"
echo ""

# Function to test HTTP endpoint
test_endpoint() {
    local url=$1
    local name=$2
    
    if curl -s --max-time 5 "$url" > /dev/null 2>&1; then
        print_success "$name: ACCESSIBLE"
    else
        print_warning "$name: NOT ACCESSIBLE"
    fi
}

print_info "Testing HTTP endpoints..."
test_endpoint "http://localhost:8545" "Anvil L1 RPC"
test_endpoint "http://localhost:3000/health" "vlayer Call Server"
test_endpoint "http://localhost:3002/health" "vlayer DNS Server"
echo ""

print_header "Local Development Recommendations"
echo ""

print_info "💡 Development Tips:"
echo ""
echo "1. 🚀 Quick Start:"
echo "   cd backend && make start-local"
echo ""
echo "2. 🔍 Monitor Logs:"
echo "   docker-compose -f docker-compose.devnet.yaml logs -f"
echo ""
echo "3. 🧪 Test Email Proofs:"
echo "   npx tsx proveEmailDomain.ts"
echo ""
echo "4. 🛑 Clean Shutdown:"
echo "   cd backend && make stop-local"
echo ""
echo "5. 🔧 Debug Issues:"
echo "   docker-compose -f docker-compose.devnet.yaml logs [service_name]"
echo ""

print_header "Production Deployment Strategy"
echo ""

print_info "🎯 Production Considerations:"
echo ""
echo "1. 🌐 Use Real Networks:"
echo "   • Replace Anvil with Mainnet/Arbitrum/Polygon"
echo "   • Use production RPC providers"
echo ""
echo "2. 🏢 vlayer Production Services:"
echo "   • Connect to vlayer's hosted infrastructure"
echo "   • No need to run local Docker containers"
echo ""
echo "3. 🔐 Security:"
echo "   • Proper private key management"
echo "   • TLS/SSL for all connections"
echo "   • Rate limiting and monitoring"
echo ""
echo "4. 📊 Monitoring:"
echo "   • Service health checks"
echo "   • Performance metrics"
echo "   • Error alerting"
echo ""

echo ""
print_success "Analysis complete! Check the recommendations above for optimal setup."

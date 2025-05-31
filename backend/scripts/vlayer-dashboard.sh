#!/bin/bash

# vlayer Development Dashboard
# Real-time status overview of the complete vlayer development environment

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Configuration
UPDATE_INTERVAL=3

# Signal handling for clean exit
cleanup() {
    echo -e "\n${GREEN}Dashboard closed cleanly.${NC}"
    exit 0
}

# Trap signals for clean exit
trap cleanup SIGINT SIGTERM

# Function to clear screen and show header
show_header() {
    clear
    echo -e "${CYAN}${BOLD}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${CYAN}${BOLD}║                    zkMed vlayer Dashboard                    ║${NC}"
    echo -e "${CYAN}${BOLD}║                     $(date '+%Y-%m-%d %H:%M:%S')                     ║${NC}"
    echo -e "${CYAN}${BOLD}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo
}

# Function to show service status
show_services() {
    echo -e "${BLUE}${BOLD}🔧 Service Status${NC}"
    echo -e "${BLUE}────────────────${NC}"
    
    # Check each service
    services=("anvil-l1:8545:L1 Blockchain" "anvil-l2-op:8546:L2 Blockchain" "vlayer-call-server:3000:Proof Server" "vlayer-vdns-server:3002:DNS Server" "notary-server:7047:Notary Server" "wsproxy:3003:WebSocket Proxy")
    
    for service_info in "${services[@]}"; do
        IFS=':' read -ra INFO <<< "$service_info"
        container=${INFO[0]}
        port=${INFO[1]}
        name=${INFO[2]}
        
        # Check container status
        status=$(docker ps --filter "name=$container" --format "{{.Status}}" 2>/dev/null || echo "Not Found")
        
        if echo "$status" | grep -q "Up"; then
            if echo "$status" | grep -q "healthy"; then
                status_icon="${GREEN}✅${NC}"
            else
                status_icon="${YELLOW}⚠️${NC}"
            fi
        else
            status_icon="${RED}❌${NC}"
        fi
        
        # Check port connectivity
        if nc -z localhost $port 2>/dev/null; then
            port_icon="${GREEN}🟢${NC}"
        else
            port_icon="${RED}🔴${NC}"
        fi
        
        printf "  %-20s %s %s %-15s %s\n" "$name" "$status_icon" "$port_icon" "($port)" "$status"
    done
    echo
}

# Function to show blockchain status
show_blockchain_status() {
    echo -e "${PURPLE}${BOLD}⛓️  Blockchain Status${NC}"
    echo -e "${PURPLE}──────────────────${NC}"
    
    # L1 Chain
    if nc -z localhost 8545 2>/dev/null; then
        l1_response=$(curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 2>/dev/null || echo "")
        if [ -n "$l1_response" ]; then
            l1_block=$(echo "$l1_response" | jq -r '.result' 2>/dev/null | xargs printf "%d\n" 2>/dev/null || echo "Unknown")
            echo -e "  ${GREEN}✅${NC} L1 (31337): Block #$l1_block"
        else
            echo -e "  ${RED}❌${NC} L1 (31337): Not responding"
        fi
    else
        echo -e "  ${RED}❌${NC} L1 (31337): Port closed"
    fi
    
    # L2 Chain
    if nc -z localhost 8546 2>/dev/null; then
        l2_response=$(curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8546 2>/dev/null || echo "")
        if [ -n "$l2_response" ]; then
            l2_block=$(echo "$l2_response" | jq -r '.result' 2>/dev/null | xargs printf "%d\n" 2>/dev/null || echo "Unknown")
            echo -e "  ${GREEN}✅${NC} L2 (31338): Block #$l2_block"
        else
            echo -e "  ${RED}❌${NC} L2 (31338): Not responding"
        fi
    else
        echo -e "  ${RED}❌${NC} L2 (31338): Port closed"
    fi
    echo
}

# Function to show resource usage
show_resources() {
    echo -e "${YELLOW}${BOLD}📊 Resource Usage${NC}"
    echo -e "${YELLOW}─────────────────${NC}"
    
    # Docker stats for vlayer containers
    docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" \
        $(docker ps --filter "name=vlayer\|anvil\|notary\|wsproxy" --format "{{.Names}}" | tr '\n' ' ') 2>/dev/null | head -8
    echo
}

# Function to show recent activity
show_activity() {
    echo -e "${CYAN}${BOLD}📋 Recent Activity${NC}"
    echo -e "${CYAN}─────────────────${NC}"
    
    # Show recent logs from call server
    echo -e "${YELLOW}Call Server (last 3 lines):${NC}"
    docker logs vlayer-call-server --tail=3 2>/dev/null | sed 's/^/  /' || echo "  No logs available"
    
    echo
    
    # Show recent logs from notary server
    echo -e "${YELLOW}Notary Server (last 3 lines):${NC}"
    docker logs notary-server --tail=3 2>/dev/null | sed 's/^/  /' || echo "  No logs available"
    echo
}

# Function to show available commands
show_commands() {
    echo -e "${GREEN}${BOLD}🎮 Quick Commands${NC}"
    echo -e "${GREEN}─────────────────${NC}"
    echo -e "  ${BLUE}r${NC} - Restart all services    ${BLUE}s${NC} - Show detailed status"
    echo -e "  ${BLUE}l${NC} - Show logs              ${BLUE}t${NC} - Test connectivity"
    echo -e "  ${BLUE}d${NC} - Deploy contracts       ${BLUE}h${NC} - Health check"
    echo -e "  ${BLUE}q${NC} - Quit dashboard         ${BLUE}?${NC} - Show help"
    echo
    echo -e "${YELLOW}Press any key for commands, or wait for auto-refresh...${NC}"
}

# Function to handle user input
handle_input() {
    # Use timeout with proper exit code handling
    if read -t $UPDATE_INTERVAL -n 1 key 2>/dev/null; then
        # Key was pressed, handle it
        case $key in
        'r'|'R')
            echo -e "\n${YELLOW}Restarting services...${NC}"
            make restart-vlayer
            sleep 2
            ;;
        's'|'S')
            echo -e "\n${YELLOW}Showing detailed status...${NC}"
            make status-vlayer
            read -p "Press Enter to continue..."
            ;;
        'l'|'L')
            echo -e "\n${YELLOW}Showing logs...${NC}"
            make logs-vlayer
            read -p "Press Enter to continue..."
            ;;
        't'|'T')
            echo -e "\n${YELLOW}Testing connectivity...${NC}"
            make dev-test
            read -p "Press Enter to continue..."
            ;;
        'd'|'D')
            echo -e "\n${YELLOW}Deploying contracts...${NC}"
            make dev-deploy
            read -p "Press Enter to continue..."
            ;;
        'h'|'H')
            echo -e "\n${YELLOW}Running health check...${NC}"
            make dev-health
            read -p "Press Enter to continue..."
            ;;
        'q'|'Q')
            echo -e "\n${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        '?')
            echo -e "\n${BLUE}Available commands:${NC}"
            echo -e "${BLUE}r${NC} - Restart all vlayer services"
            echo -e "${BLUE}s${NC} - Show detailed service status"
            echo -e "${BLUE}l${NC} - Show service logs"
            echo -e "${BLUE}t${NC} - Test environment connectivity"
            echo -e "${BLUE}d${NC} - Deploy contracts to local environment"
            echo -e "${BLUE}h${NC} - Run comprehensive health check"
            echo -e "${BLUE}q${NC} - Quit dashboard"
            echo -e "${BLUE}?${NC} - Show this help"
            read -p "Press Enter to continue..."
            ;;
    esac
    fi
    # If no key was pressed, just return and continue auto-refresh
}

# Main dashboard loop
main() {
    # Check if we're in the right directory
    if [ ! -f "Makefile" ] || [ ! -d "vlayer" ]; then
        echo -e "${RED}❌ Please run this script from the zkMed backend directory${NC}"
        exit 1
    fi
    
    # Initial setup message
    echo -e "${CYAN}🚀 Starting vlayer Development Dashboard...${NC}"
    echo -e "${YELLOW}Press 'q' to quit, '?' for help${NC}"
    sleep 2
    
    # Main loop
    while true; do
        show_header
        show_services
        show_blockchain_status
        show_resources
        show_activity
        show_commands
        handle_input
    done
}

# Run the dashboard
main

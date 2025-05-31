#!/bin/bash

# vlayer Docker Infrastructure Analysis Tool
# Provides comprehensive analysis and management of vlayer Docker containers

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Header
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo -e "${CYAN}         vlayer Docker Infrastructure Analysis        ${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
echo

# Function to show usage
show_usage() {
    echo -e "${YELLOW}Usage: $0 [COMMAND]${NC}"
    echo
    echo -e "${YELLOW}Commands:${NC}"
    echo -e "  ${GREEN}status${NC}    - Show container status and health"
    echo -e "  ${GREEN}logs${NC}      - Show logs for all vlayer containers"
    echo -e "  ${GREEN}ports${NC}     - Analyze port mappings and conflicts"
    echo -e "  ${GREEN}health${NC}    - Check health status of containers"
    echo -e "  ${GREEN}restart${NC}   - Restart all vlayer containers"
    echo -e "  ${GREEN}stop${NC}      - Stop all vlayer containers"
    echo -e "  ${GREEN}start${NC}     - Start all vlayer containers"
    echo -e "  ${GREEN}clean${NC}     - Clean up stopped containers"
    echo -e "  ${GREEN}monitor${NC}   - Real-time container monitoring"
    echo
    echo -e "${YELLOW}If no command is provided, runs full analysis${NC}"
    echo
}

# Function to analyze container status
analyze_status() {
    echo -e "${BLUE}📊 Container Status Analysis${NC}"
    echo -e "${BLUE}─────────────────────────────${NC}"
    
    # Check if vlayer containers exist
    VLAYER_CONTAINERS=$(docker ps -a --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}")
    
    if [ -z "$VLAYER_CONTAINERS" ]; then
        echo -e "${RED}❌ No vlayer-related containers found${NC}"
        return 1
    fi
    
    echo "$VLAYER_CONTAINERS"
    echo
    
    # Count containers by status
    RUNNING=$(docker ps --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --format "{{.Names}}" | wc -l)
    STOPPED=$(docker ps -a --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --filter "status=exited" --format "{{.Names}}" | wc -l)
    CREATED=$(docker ps -a --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --filter "status=created" --format "{{.Names}}" | wc -l)
    
    echo -e "${GREEN}🏃 Running: $RUNNING${NC}"
    echo -e "${RED}⏹️  Stopped: $STOPPED${NC}"
    echo -e "${YELLOW}📋 Created: $CREATED${NC}"
    echo
}

# Function to analyze ports
analyze_ports() {
    echo -e "${BLUE}🔌 Port Analysis${NC}"
    echo -e "${BLUE}─────────────────${NC}"
    
    # Check for port conflicts
    echo -e "${YELLOW}Port Usage:${NC}"
    netstat -tlnp 2>/dev/null | grep -E "(8545|8546|3002|3003|7047)" || echo "No vlayer ports in use"
    echo
    
    echo -e "${YELLOW}Container Port Mappings:${NC}"
    docker ps --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --format "table {{.Names}}\t{{.Ports}}" 2>/dev/null || echo "No containers with port mappings found"
    echo
}

# Function to check health
check_health() {
    echo -e "${BLUE}🏥 Health Status${NC}"
    echo -e "${BLUE}─────────────────${NC}"
    
    # Check health status of containers
    docker ps --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --format "table {{.Names}}\t{{.Status}}" 2>/dev/null | while read line; do
        if echo "$line" | grep -q "healthy"; then
            echo -e "${GREEN}✅ $line${NC}"
        elif echo "$line" | grep -q "unhealthy"; then
            echo -e "${RED}❌ $line${NC}"
        elif echo "$line" | grep -q "Up"; then
            echo -e "${YELLOW}⚠️  $line${NC}"
        else
            echo -e "${RED}🔴 $line${NC}"
        fi
    done
    echo
}

# Function to show logs
show_logs() {
    echo -e "${BLUE}📋 Container Logs${NC}"
    echo -e "${BLUE}──────────────────${NC}"
    
    # Get list of vlayer containers
    CONTAINERS=$(docker ps -a --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --format "{{.Names}}" 2>/dev/null)
    
    if [ -z "$CONTAINERS" ]; then
        echo -e "${RED}❌ No vlayer containers found${NC}"
        return 1
    fi
    
    for container in $CONTAINERS; do
        echo -e "${CYAN}🐳 $container${NC}"
        echo -e "${CYAN}$(printf '─%.0s' {1..50})${NC}"
        docker logs --tail=10 "$container" 2>&1 || echo "Cannot access logs for $container"
        echo
    done
}

# Function to restart containers
restart_containers() {
    echo -e "${YELLOW}🔄 Restarting vlayer containers...${NC}"
    
    cd vlayer && docker-compose restart
    
    echo -e "${GREEN}✅ Restart completed${NC}"
}

# Function to stop containers
stop_containers() {
    echo -e "${YELLOW}⏹️  Stopping vlayer containers...${NC}"
    
    cd vlayer && docker-compose down
    
    echo -e "${GREEN}✅ Stop completed${NC}"
}

# Function to start containers
start_containers() {
    echo -e "${YELLOW}▶️  Starting vlayer containers...${NC}"
    
    cd vlayer && docker-compose up -d
    
    echo -e "${GREEN}✅ Start completed${NC}"
}

# Function to clean containers
clean_containers() {
    echo -e "${YELLOW}🧹 Cleaning up stopped containers...${NC}"
    
    # Remove stopped vlayer containers
    STOPPED_CONTAINERS=$(docker ps -a --filter "name=vlayer" --filter "name=anvil" --filter "name=notary" --filter "name=wsproxy" --filter "status=exited" --format "{{.Names}}" 2>/dev/null)
    
    if [ -n "$STOPPED_CONTAINERS" ]; then
        echo "$STOPPED_CONTAINERS" | xargs docker rm
        echo -e "${GREEN}✅ Cleanup completed${NC}"
    else
        echo -e "${YELLOW}ℹ️  No stopped containers to clean${NC}"
    fi
}

# Function for real-time monitoring
monitor_containers() {
    echo -e "${BLUE}📺 Real-time Container Monitoring${NC}"
    echo -e "${BLUE}──────────────────────────────────${NC}"
    echo -e "${YELLOW}Press Ctrl+C to exit${NC}"
    echo
    
    while true; do
        clear
        echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
        echo -e "${CYAN}         vlayer Real-time Monitoring                ${NC}"
        echo -e "${CYAN}═══════════════════════════════════════════════════${NC}"
        echo
        
        analyze_status
        analyze_ports
        check_health
        
        echo -e "${YELLOW}Last updated: $(date)${NC}"
        sleep 5
    done
}

# Function to run full analysis
run_full_analysis() {
    analyze_status
    analyze_ports
    check_health
    
    echo -e "${PURPLE}💡 Management Commands${NC}"
    echo -e "${PURPLE}─────────────────────${NC}"
    echo -e "${YELLOW}Available commands:${NC}"
    echo -e "  make start-vlayer   - Start vlayer services"
    echo -e "  make stop-vlayer    - Stop vlayer services"
    echo -e "  make restart-vlayer - Restart vlayer services"
    echo -e "  make logs-vlayer    - Show container logs"
    echo -e "  make clean-vlayer   - Clean up containers"
    echo
    echo -e "${YELLOW}Or use this script directly:${NC}"
    echo -e "  ./scripts/vlayer-docker-analysis.sh [command]"
    echo
}

# Main execution
case "${1:-}" in
    "status")
        analyze_status
        ;;
    "logs")
        show_logs
        ;;
    "ports")
        analyze_ports
        ;;
    "health")
        check_health
        ;;
    "restart")
        restart_containers
        ;;
    "stop")
        stop_containers
        ;;
    "start")
        start_containers
        ;;
    "clean")
        clean_containers
        ;;
    "monitor")
        monitor_containers
        ;;
    "help"|"-h"|"--help")
        show_usage
        ;;
    "")
        run_full_analysis
        ;;
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo
        show_usage
        exit 1
        ;;
esac

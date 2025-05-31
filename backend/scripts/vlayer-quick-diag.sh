#!/bin/bash

# Quick vlayer Service Diagnostics Tool

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔧 vlayer Quick Diagnostics${NC}"
echo -e "${BLUE}──────────────────────────${NC}"

# Check if containers are running
echo -e "${YELLOW}Container Status:${NC}"
docker ps --filter "name=vlayer\|anvil\|notary\|wsproxy" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo

# Check port availability
echo -e "${YELLOW}Port Check:${NC}"
for port in 8545 8546 3000 3002 3003 7047; do
    if nc -z localhost $port 2>/dev/null; then
        echo -e "${GREEN}✅ Port $port: Open${NC}"
    else
        echo -e "${RED}❌ Port $port: Closed${NC}"
    fi
done
echo

# Check anvil chain IDs
echo -e "${YELLOW}Chain ID Check:${NC}"
for port_info in "8545:0x7a69:31337:L1" "8546:0x7a6a:31338:L2"; do
    IFS=':' read -ra INFO <<< "$port_info"
    port=${INFO[0]}
    expected_hex=${INFO[1]}
    expected_decimal=${INFO[2]}
    chain_name=${INFO[3]}
    
    if nc -z localhost $port 2>/dev/null; then
        response=$(curl -s -X POST -H "Content-Type: application/json" \
            --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
            "http://localhost:$port" 2>/dev/null || echo "")
        
        if echo "$response" | grep -q "$expected_hex"; then
            echo -e "${GREEN}✅ Anvil $chain_name: Correct chain ID ($expected_decimal)${NC}"
        else
            echo -e "${RED}❌ Anvil $chain_name: Wrong/No response${NC}"
            echo "   Expected: $expected_hex ($expected_decimal)"
            echo "   Response: $response"
        fi
    else
        echo -e "${RED}❌ Anvil $chain_name: Port $port not accessible${NC}"
    fi
done
echo

# Check for recent container logs with errors
echo -e "${YELLOW}Recent Error Logs:${NC}"
containers=($(docker ps --filter "name=vlayer\|anvil\|notary\|wsproxy" --format "{{.Names}}"))
for container in "${containers[@]}"; do
    errors=$(docker logs --tail=5 "$container" 2>&1 | grep -i "error\|failed\|exception" | head -2 || echo "")
    if [ -n "$errors" ]; then
        echo -e "${RED}❌ $container:${NC}"
        echo "$errors" | sed 's/^/   /'
    else
        echo -e "${GREEN}✅ $container: No recent errors${NC}"
    fi
done
echo

# Quick fix suggestions
echo -e "${YELLOW}🔧 Quick Fix Suggestions:${NC}"
if ! nc -z localhost 8545 2>/dev/null; then
    echo -e "${BLUE}• Anvil L1 not responding: Try 'docker start anvil-l1'${NC}"
fi
if ! nc -z localhost 8546 2>/dev/null; then
    echo -e "${BLUE}• Anvil L2 not responding: Try 'docker start anvil-l2-op'${NC}"
fi
if ! nc -z localhost 3000 2>/dev/null; then
    echo -e "${BLUE}• Call Server not responding: Try 'docker restart vlayer-call-server'${NC}"
fi
echo -e "${BLUE}• For full restart: './scripts/vlayer-dev-env.sh restart'${NC}"
echo -e "${BLUE}• For complete reset: './scripts/vlayer-dev-env.sh reset'${NC}"

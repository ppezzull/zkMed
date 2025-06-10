#!/bin/bash

set -e

echo "🚀 Starting Greeting Contract Deployment..."

# Wait for anvil to be ready
echo "⏳ Waiting for Anvil to be ready..."
until curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  $RPC_URL > /dev/null 2>&1; do
  echo "Waiting for Anvil..."
  sleep 2
done

echo "✅ Anvil is ready!"

# Deploy Greeting contract
echo "📋 Deploying Greeting contract..."
forge script script/DeployGreeting.s.sol --rpc-url $RPC_URL --broadcast --unlocked

# Get deployed contract address
GREETING_CONTRACT=$(jq -r '.transactions[] | select(.contractName == "Greeting") | .contractAddress' broadcast/DeployGreeting.s.sol/31339/run-latest.json 2>/dev/null || echo "")

if [ -z "$GREETING_CONTRACT" ]; then
  echo "❌ Failed to get Greeting contract address"
  exit 1
fi

echo "📄 Contract deployed:"
echo "  Greeting: $GREETING_CONTRACT"

# Save contract addresses to artifacts
mkdir -p /app/out/contracts
cat > /app/out/contracts.json << EOF
{
  "chainId": $CHAIN_ID,
  "greeting": "$GREETING_CONTRACT",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

echo "✅ Greeting deployment completed successfully!"
echo "📄 Contract address saved to /app/out/contracts.json"
echo ""
echo "📋 Access Information:"
echo "  RPC URL: $RPC_URL"
echo "  Chain ID: $CHAIN_ID"
echo "  Greeting Contract: $GREETING_CONTRACT" 
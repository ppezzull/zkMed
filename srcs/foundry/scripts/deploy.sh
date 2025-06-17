#!/bin/bash
set -e

echo "🚀 Starting zkMed Contract Deployment..."

# Wait for Anvil to be ready
echo "⏳ Waiting for Anvil to be ready..."
while ! curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    ${RPC_URL:-http://host.docker.internal:8547} > /dev/null; do
    echo "Waiting for Anvil..."
    sleep 2
done

echo "✅ Anvil is ready!"

# Check if contracts are already deployed
echo "🔍 Checking for existing contract deployment..."
# Check both the local out directory and the volume mount location (which is /app/out)
ADDRESSES_FILE=""
if [ -f "out/addresses.json" ] && [ -s "out/addresses.json" ]; then
    ADDRESSES_FILE="out/addresses.json"
fi

if [ ! -z "$ADDRESSES_FILE" ] && [ -s "$ADDRESSES_FILE" ]; then
    # Check if the JSON file has a valid contract address
    EXISTING_ADDRESS=$(jq -r '.contracts.Greeting.address // empty' "$ADDRESSES_FILE" 2>/dev/null)
    if [ ! -z "$EXISTING_ADDRESS" ] && [ "$EXISTING_ADDRESS" != "null" ]; then
        echo "✅ Contract already deployed at: $EXISTING_ADDRESS"
        echo "⏭️ Skipping deployment - using existing contract"
        echo "🎉 Deployment check completed successfully!"
        echo "Contract Address: $EXISTING_ADDRESS"
        echo "Chain ID: $(jq -r '.chainId // 31339' "$ADDRESSES_FILE" 2>/dev/null)"
        echo "RPC URL: $(jq -r '.rpcUrl // "http://host.docker.internal:8547"' "$ADDRESSES_FILE" 2>/dev/null)"
        echo "📄 Using existing contract data"
        exit 0
    fi
fi

echo "📝 No existing contract found - proceeding with new deployment..."

# Build contracts
echo "🔨 Building contracts..."
forge soldeer install
forge build

# Deploy Greeting contract using forge script (simplified version)
echo "📝 Deploying Greeting contract using forge script..."
echo "🔧 Running forge script command..."

# Create a simple deployment script output file
DEPLOY_OUTPUT="/tmp/deploy_output.txt"

# Use forge script for deployment - capture all output
if forge script script/Greeting.s.sol:DeployGreeting \
    --rpc-url ${RPC_URL:-http://host.docker.internal:8547} \
    --broadcast  > "$DEPLOY_OUTPUT" 2>&1; then
    
    echo "✅ Forge script completed successfully!"
    echo "📄 Deployment output:"
    cat "$DEPLOY_OUTPUT"
    
    # Try to extract the contract address from the logs
    GREETING_ADDRESS=$(grep -E "(deployed to:|Greeting contract deployed to:)" "$DEPLOY_OUTPUT" | grep -oE "0x[a-fA-F0-9]{40}" | head -1)
    
    if [ -z "$GREETING_ADDRESS" ]; then
        echo "⚠️ Could not extract contract address, trying alternative method..."
        # Look for any 40-character hex address in the output
        GREETING_ADDRESS=$(grep -oE "0x[a-fA-F0-9]{40}" "$DEPLOY_OUTPUT" | head -1)
    fi
    
else
    echo "❌ Forge script failed!"
    echo "📄 Error output:"
    cat "$DEPLOY_OUTPUT"
    exit 1
fi

if [ -z "$GREETING_ADDRESS" ]; then
    echo "❌ Failed to extract contract address from deployment output"
    exit 1
fi

echo "✅ Greeting contract deployed at: $GREETING_ADDRESS"

# Create a simple addresses file without JSON
echo "📄 Creating simple contract addresses file..."
echo "GREETING_ADDRESS=$GREETING_ADDRESS" > out/addresses.txt
echo "CHAIN_ID=${CHAIN_ID:-31339}" >> out/addresses.txt
echo "RPC_URL=${RPC_URL:-http://host.docker.internal:8547}" >> out/addresses.txt
echo "DEPLOYMENT_TIME=$(date)" >> out/addresses.txt

# Create JSON file for frontend API
echo "📝 Creating contracts JSON file..."
cat > out/addresses.json << EOF
{
  "chainId": ${CHAIN_ID:-31339},
  "rpcUrl": "${RPC_URL:-http://host.docker.internal:8547}",
  "contracts": {
    "Greeting": {
      "address": "$GREETING_ADDRESS",
      "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    }
  },
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "status": "deployed"
}
EOF

echo "Contract addresses saved to out/addresses.json"

# Also create environment file for compatibility
echo "📝 Creating environment variables..."
cat > out/contracts.env << EOF
NEXT_PUBLIC_GREETING_CONTRACT_ADDRESS=$GREETING_ADDRESS
DEPLOYED_CHAIN_ID=${CHAIN_ID:-31339}
DEPLOYED_RPC_URL=${RPC_URL:-http://host.docker.internal:8547}
DEPLOYMENT_TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

echo "🎉 Deployment completed successfully!"
echo "Contract Address: $GREETING_ADDRESS"
echo "Chain ID: ${CHAIN_ID:-31339}"
echo "RPC URL: ${RPC_URL:-http://host.docker.internal:8547}"
echo "📄 Contract data exported to Docker volume" 
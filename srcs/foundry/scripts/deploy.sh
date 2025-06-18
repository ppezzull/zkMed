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
    # Check if the JSON file has valid contract addresses
    EXISTING_GREETING=$(jq -r '.contracts.Greeting.address // empty' "$ADDRESSES_FILE" 2>/dev/null)
    EXISTING_HEALTHCARE=$(jq -r '.contracts.HealthcareRegistration.address // empty' "$ADDRESSES_FILE" 2>/dev/null)
    
    if [ ! -z "$EXISTING_GREETING" ] && [ "$EXISTING_GREETING" != "null" ] && \
       [ ! -z "$EXISTING_HEALTHCARE" ] && [ "$EXISTING_HEALTHCARE" != "null" ]; then
        echo "✅ Contracts already deployed:"
        echo "   Greeting: $EXISTING_GREETING"
        echo "   HealthcareRegistration: $EXISTING_HEALTHCARE"
        echo "⏭️ Skipping deployment - using existing contracts"
        echo "🎉 Deployment check completed successfully!"
        echo "Chain ID: $(jq -r '.chainId // 31339' "$ADDRESSES_FILE" 2>/dev/null)"
        echo "RPC URL: $(jq -r '.rpcUrl // "http://host.docker.internal:8547"' "$ADDRESSES_FILE" 2>/dev/null)"
        echo "📄 Using existing contract data"
        exit 0
    fi
fi

echo "📝 No existing contracts found - proceeding with new deployment..."

# Build contracts
echo "🔨 Building contracts..."
forge soldeer install
forge build

# Deploy Greeting contract using forge script
echo "📝 Deploying Greeting contract..."
GREETING_OUTPUT="/tmp/greeting_deploy.txt"

if forge script script/Greeting.s.sol:DeployGreeting \
    --rpc-url ${RPC_URL:-http://host.docker.internal:8547} \
    --broadcast > "$GREETING_OUTPUT" 2>&1; then
    
    echo "✅ Greeting contract deployment completed!"
    GREETING_ADDRESS=$(grep -E "Greeting contract deployed to:" "$GREETING_OUTPUT" | grep -oE "0x[a-fA-F0-9]{40}" | head -1)
    
    if [ -z "$GREETING_ADDRESS" ]; then
        GREETING_ADDRESS=$(grep -oE "0x[a-fA-F0-9]{40}" "$GREETING_OUTPUT" | head -1)
    fi
    
    if [ ! -z "$GREETING_ADDRESS" ]; then
        echo "✅ Greeting contract deployed at: $GREETING_ADDRESS"
    else
        echo "❌ Failed to extract Greeting contract address"
        exit 1
    fi
else
    echo "❌ Greeting contract deployment failed!"
    cat "$GREETING_OUTPUT"
    exit 1
fi

# Deploy HealthcareRegistration contracts using forge script
echo "📝 Deploying HealthcareRegistration contracts..."
HEALTHCARE_OUTPUT="/tmp/healthcare_deploy.txt"

if forge script script/HealthcareRegistration.s.sol:DeployHealthcareRegistration \
    --rpc-url ${RPC_URL:-http://host.docker.internal:8547} \
    --broadcast > "$HEALTHCARE_OUTPUT" 2>&1; then
    
    echo "✅ HealthcareRegistration deployment completed!"
    
    # Extract contract addresses from logs
    PROVER_ADDRESS=$(grep -E "HealthcareRegistrationProver deployed to:" "$HEALTHCARE_OUTPUT" | grep -oE "0x[a-fA-F0-9]{40}" | head -1)
    HEALTHCARE_ADDRESS=$(grep -E "HealthcareRegistration contract deployed to:" "$HEALTHCARE_OUTPUT" | grep -oE "0x[a-fA-F0-9]{40}" | head -1)
    
    if [ ! -z "$PROVER_ADDRESS" ] && [ ! -z "$HEALTHCARE_ADDRESS" ]; then
        echo "✅ HealthcareRegistrationProver deployed at: $PROVER_ADDRESS"
        echo "✅ HealthcareRegistration deployed at: $HEALTHCARE_ADDRESS"
    else
        echo "❌ Failed to extract HealthcareRegistration contract addresses"
        echo "📄 Deployment output:"
        cat "$HEALTHCARE_OUTPUT"
        exit 1
    fi
else
    echo "❌ HealthcareRegistration deployment failed!"
    cat "$HEALTHCARE_OUTPUT"
    exit 1
fi

# Create a simple addresses file without JSON
echo "📄 Creating contract addresses files..."
echo "GREETING_ADDRESS=$GREETING_ADDRESS" > out/addresses.txt
echo "HEALTHCARE_REGISTRATION_ADDRESS=$HEALTHCARE_ADDRESS" >> out/addresses.txt
echo "HEALTHCARE_REGISTRATION_PROVER_ADDRESS=$PROVER_ADDRESS" >> out/addresses.txt
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
    },
    "HealthcareRegistration": {
      "address": "$HEALTHCARE_ADDRESS",
      "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    },
    "HealthcareRegistrationProver": {
      "address": "$PROVER_ADDRESS",
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
NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=$HEALTHCARE_ADDRESS
NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS=$PROVER_ADDRESS
DEPLOYED_CHAIN_ID=${CHAIN_ID:-31339}
DEPLOYED_RPC_URL=${RPC_URL:-http://host.docker.internal:8547}
DEPLOYMENT_TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
EOF

echo "🎉 Deployment completed successfully!"
echo "📋 Contract Addresses:"
echo "   Greeting: $GREETING_ADDRESS"
echo "   HealthcareRegistration: $HEALTHCARE_ADDRESS"
echo "   HealthcareRegistrationProver: $PROVER_ADDRESS"
echo "Chain ID: ${CHAIN_ID:-31339}"
echo "RPC URL: ${RPC_URL:-http://host.docker.internal:8547}"
echo "📄 Contract data exported to Docker volume" 
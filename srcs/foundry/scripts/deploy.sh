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
ADDRESSES_FILE=""
if [ -f "out/addresses.json" ] && [ -s "out/addresses.json" ]; then
    ADDRESSES_FILE="out/addresses.json"
fi

if [ ! -z "$ADDRESSES_FILE" ] && [ -s "$ADDRESSES_FILE" ]; then
    EXISTING_HEALTHCARE=$(jq -r '.contracts.HealthcareRegistration.address // empty' "$ADDRESSES_FILE" 2>/dev/null)
    if [ ! -z "$EXISTING_HEALTHCARE" ] && [ "$EXISTING_HEALTHCARE" != "null" ] && [ "$EXISTING_HEALTHCARE" != "0x0000000000000000000000000000000000000000" ]; then
        echo "✅ HealthcareRegistration contract already deployed: $EXISTING_HEALTHCARE"
        echo "⏭️ Skipping deployment - using existing contract"
        echo "🎉 Deployment check completed successfully!"
        echo "Chain ID: $(jq -r '.chainId // 31337' "$ADDRESSES_FILE" 2>/dev/null)"
        echo "RPC URL: $(jq -r '.rpcUrl // \"http://host.docker.internal:8547\"' "$ADDRESSES_FILE" 2>/dev/null)"
        echo "📄 Using existing contract data"
        exit 0
    fi
fi

echo "📝 No existing HealthcareRegistration contract found - proceeding with new deployment..."

# Build contracts
echo "🔨 Building contracts..."
forge soldeer install
forge build

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
        echo "🔍 DEBUG: Proceeding to create JSON file..."
    else
        echo "❌ Failed to extract HealthcareRegistration contract addresses"
        echo "🔍 DEBUG: PROVER_ADDRESS=$PROVER_ADDRESS"
        echo "� DEBUG: HEALTHCARE_ADDRESS=$HEALTHCARE_ADDRESS"
        echo "�📄 Deployment output:"
        cat "$HEALTHCARE_OUTPUT"
        exit 1
    fi
else
    echo "❌ HealthcareRegistration deployment failed!"
    echo "📄 Forge script output:"
    cat "$HEALTHCARE_OUTPUT"
    exit 1
fi

# Create a JSON addresses file
echo "📄 Creating contract addresses JSON file..."
cat > out/addresses.json <<EOF
{
  "chainId": ${CHAIN_ID:-31337},
  "rpcUrl": "${RPC_URL:-http://host.docker.internal:8547}",
  "contracts": {
    "HealthcareRegistration": {
      "address": "$HEALTHCARE_ADDRESS",
      "deployer": "default"
    },
    "HealthcareRegistrationProver": {
      "address": "$PROVER_ADDRESS",
      "deployer": "default"
    }
  },
  "timestamp": "$(date -Iseconds)"
}
EOF

echo "🎉 Deployment completed successfully!"
echo "📋 Contract Addresses:"
echo "   HealthcareRegistration: $HEALTHCARE_ADDRESS"
echo "   HealthcareRegistrationProver: $PROVER_ADDRESS"
echo "Chain ID: ${CHAIN_ID:-31337}"
echo "RPC URL: ${RPC_URL:-http://host.docker.internal:8547}"
echo "📄 Contract data exported to Docker volume"
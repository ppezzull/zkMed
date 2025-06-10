#!/bin/bash
set -e

echo "🚀 Starting zkMed Contract Deployment..."

# Wait for Anvil to be ready
echo "⏳ Waiting for Anvil to be ready..."
while ! curl -s -X POST -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    ${RPC_URL:-http://mantle-fork:8545} > /dev/null; do
    echo "Waiting for Anvil..."
    sleep 2
done

echo "✅ Anvil is ready!"

# Build contracts
echo "🔨 Building contracts..."
forge build

# Deploy Greeting contract
echo "📝 Deploying Greeting contract..."
GREETING_ADDRESS=$(forge create src/Greeting.sol:Greeting \
    --rpc-url ${RPC_URL:-http://mantle-fork:8545} \
    --private-key ${PRIVATE_KEY} \
    --constructor-args "Hello from zkMed!" \
    --json | jq -r '.deployedTo')

echo "✅ Greeting contract deployed at: $GREETING_ADDRESS"

# Create addresses.json file
echo "📄 Creating contract addresses file..."
cat > out/addresses.json << EOF
{
    "chainId": ${CHAIN_ID:-31339},
    "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
    "contracts": {
        "Greeting": {
            "address": "$GREETING_ADDRESS",
            "deployer": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
        }
    },
    "demoAccounts": {
        "account1": {
            "address": "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
            "privateKey": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            "role": "Admin/Deployer"
        },
        "account2": {
            "address": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
            "privateKey": "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
            "role": "User"
        },
        "account3": {
            "address": "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
            "privateKey": "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a",
            "role": "User"
        }
    }
}
EOF

# Set some initial greetings for demo
echo "🎭 Setting up demo data..."

# Set greeting from account 2
cast send $GREETING_ADDRESS \
    "setGreeting(string)" \
    "Welcome to zkMed Healthcare!" \
    --rpc-url ${RPC_URL:-http://mantle-fork:8545} \
    --private-key 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

# Set greeting from account 3  
cast send $GREETING_ADDRESS \
    "setGreeting(string)" \
    "Privacy-preserving healthcare for all!" \
    --rpc-url ${RPC_URL:-http://mantle-fork:8545} \
    --private-key 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a

echo "✅ Demo data setup complete!"

# Verify deployment
echo "🔍 Verifying deployment..."
CURRENT_GREETING=$(cast call $GREETING_ADDRESS "getGreeting()" --rpc-url ${RPC_URL:-http://mantle-fork:8545})
TOTAL_GREETINGS=$(cast call $GREETING_ADDRESS "totalGreetings()" --rpc-url ${RPC_URL:-http://mantle-fork:8545})

echo "Current greeting: $CURRENT_GREETING"
echo "Total greetings: $TOTAL_GREETINGS"

echo "🎉 Deployment completed successfully!"
echo "Contract Address: $GREETING_ADDRESS"
echo "Chain ID: ${CHAIN_ID:-31339}"
echo "RPC URL: ${RPC_URL:-http://mantle-fork:8545}" 
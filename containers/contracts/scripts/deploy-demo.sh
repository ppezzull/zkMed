#!/bin/bash

set -e

echo "🚀 Starting zkMed Demo Deployment..."

# Wait for anvil to be ready
echo "⏳ Waiting for Anvil to be ready..."
until curl -s -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  $RPC_URL > /dev/null 2>&1; do
  echo "Waiting for Anvil..."
  sleep 2
done

echo "✅ Anvil is ready!"

# Deploy contracts
echo "📋 Deploying zkMed contracts..."
forge script script/DeployLocal.s.sol --rpc-url $RPC_URL --broadcast --unlocked

# Get deployed contract addresses
REGISTRATION_CONTRACT=$(jq -r '.transactions[] | select(.contractName == "RegistrationContract") | .contractAddress' broadcast/DeployLocal.s.sol/31337/run-latest.json)
EMAIL_DOMAIN_PROVER=$(jq -r '.transactions[] | select(.contractName == "EmailDomainProver") | .contractAddress' broadcast/DeployLocal.s.sol/31337/run-latest.json)

echo "📄 Contract addresses:"
echo "  RegistrationContract: $REGISTRATION_CONTRACT"
echo "  EmailDomainProver: $EMAIL_DOMAIN_PROVER"

# Save contract addresses to artifacts
mkdir -p /app/artifacts
cat > /app/artifacts/contracts.json << EOF
{
  "chainId": 31337,
  "registrationContract": "$REGISTRATION_CONTRACT",
  "emailDomainProver": "$EMAIL_DOMAIN_PROVER",
  "deployedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
EOF

# Create demo accounts configuration
echo "👥 Setting up demo accounts..."
cat > /app/demo-data/accounts.json << EOF
{
  "chainId": 31337,
  "rpcUrl": "$RPC_URL",
  "contracts": {
    "registrationContract": "$REGISTRATION_CONTRACT",
    "emailDomainProver": "$EMAIL_DOMAIN_PROVER"
  },
  "accounts": {
    "insurer": {
      "name": "Regione Lazio Health Insurance",
      "domain": "laziosalute.it",
      "email": "admin@laziosalute.it",
      "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
      "privateKey": "$PRIVATE_KEY_INSURER",
      "role": "Insurer"
    },
    "hospital": {
      "name": "Ospedale San Giovanni",
      "domain": "sangiovanni.lazio.it",
      "email": "admin@sangiovanni.lazio.it",
      "address": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
      "privateKey": "$PRIVATE_KEY_HOSPITAL",
      "role": "Hospital"
    },
    "patient": {
      "name": "Demo Patient",
      "address": "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
      "privateKey": "$PRIVATE_KEY_PATIENT",
      "role": "Patient",
      "commitment": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
    },
    "admin": {
      "name": "System Admin",
      "address": "0x90f79bf6eb2c4f870365e785982e1f101e93b906",
      "privateKey": "$PRIVATE_KEY_ADMIN",
      "role": "Admin"
    }
  }
}
EOF

# Fund demo accounts with ETH
echo "💰 Funding demo accounts..."

# Fund insurer account
cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY_ADMIN \
  --value 10ether 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

# Fund hospital account  
cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY_ADMIN \
  --value 10ether 0x70997970c51812dc3a010c7d01b50e0d17dc79c8

# Fund patient account
cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY_ADMIN \
  --value 10ether 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc

# Register demo patient
echo "👤 Registering demo patient..."
cast send --rpc-url $RPC_URL --private-key $PRIVATE_KEY_PATIENT \
  $REGISTRATION_CONTRACT \
  "registerPatient(bytes32)" \
  0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef

# TODO: Add organization registration via vlayer email proofs
# This will require integration with vlayer services for email proof generation

echo "✅ Demo deployment completed successfully!"
echo "🌐 Contract addresses saved to /app/artifacts/contracts.json"
echo "👥 Demo accounts configured in /app/demo-data/accounts.json"
echo ""
echo "📋 Demo Access Information:"
echo "  RPC URL: $RPC_URL"
echo "  Chain ID: 31337"
echo "  Registration Contract: $REGISTRATION_CONTRACT"
echo "  Email Domain Prover: $EMAIL_DOMAIN_PROVER"
echo ""
echo "👥 Demo Accounts:"
echo "  Insurer: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
echo "  Hospital: 0x70997970c51812dc3a010c7d01b50e0d17dc79c8"
echo "  Patient: 0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc" 
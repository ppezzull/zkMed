# zkMed Local Development Setup

## 🔧 Local Anvil Deployment & vlayer Integration

This guide covers local deployment on Anvil and explains the vlayer Docker architecture for development and production.

---

## 🚀 Quick Start - Local Deployment

### 1. Start Anvil (Method 1: Standalone)
```bash
# Start local Anvil instance
anvil --host 0.0.0.0 --chain-id 31337
```

### 2. Start vlayer Services (Method 2: Docker Compose)
```bash
cd backend/vlayer
docker-compose -f docker-compose.devnet.yaml up -d
```

### 3. Deploy zkMed Contracts
```bash
cd backend
forge script script/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast
```

### 4. Test Email Proof Workflow
```bash
cd vlayer
npx tsx proveEmailDomain.ts
```

---

## 🐳 vlayer Docker Architecture Analysis

### Docker Services Overview

The vlayer system consists of multiple interconnected services:

#### 1. **Blockchain Layer**
- **anvil-l1** (Port 8545): Main Ethereum-like chain (Chain ID: 31337)
- **anvil-l2-op** (Port 8546): Optimism-compatible L2 chain (Chain ID: 31338)

#### 2. **vlayer Core Services**
- **vlayer-call-server** (Port 3000): Main proof generation service
- **vdns_server** (Port 3002): Domain name resolution for proofs

#### 3. **WebProof Infrastructure**
- **websockify** (Port varies): WebSocket proxy for browser connections
- **notary-server**: TLS notarization service for email proofs

### Service Dependencies
```
┌─────────────────┐    ┌─────────────────┐
│   anvil-l1      │    │   anvil-l2-op   │
│   Chain: 31337  │    │   Chain: 31338  │
│   Port: 8545    │    │   Port: 8546    │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │  vlayer-call-server  │
          │      Port: 3000      │
          │  (Proof Generation)  │
          └──────────┬───────────┘
                     │
          ┌──────────▼───────────┐
          │     vdns_server      │
          │      Port: 3002      │
          │  (Domain Resolution) │
          └──────────────────────┘
```

---

## 🌐 Network Connectivity Analysis

### Local Development Mode

**Configuration**: `.env.dev`
```bash
CHAIN_NAME=anvil
PROVER_URL=http://127.0.0.1:3000
JSON_RPC_URL=http://127.0.0.1:8545
EXAMPLES_TEST_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Service Endpoints**:
- Anvil L1: `http://localhost:8545`
- Anvil L2: `http://localhost:8546`
- vlayer Call Server: `http://localhost:3000`
- vlayer DNS Server: `http://localhost:3002`

### Production Mode Considerations

**Key Differences for Production**:

1. **Real Blockchain Networks**
   - Replace Anvil with actual networks (Mainnet, Arbitrum, etc.)
   - Use real RPC providers (Alchemy, Infura, etc.)

2. **vlayer Production Services**
   - vlayer provides hosted production endpoints
   - No need to run Docker containers in production
   - Connect to vlayer's production infrastructure

3. **Security Considerations**
   - Use proper private key management (not test keys)
   - Enable TLS/SSL for all connections
   - Implement proper access controls

---

## 📋 Step-by-Step Local Setup

### Prerequisites
```bash
# Install required tools
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install Docker and Docker Compose
sudo apt update && sudo apt install docker.io docker-compose

# Install Node.js dependencies
cd vlayer && npm install
```

### 1. Start Services

**Option A: All-in-One Docker**
```bash
cd backend/vlayer
docker-compose -f docker-compose.devnet.yaml up -d

# Check service status
docker-compose -f docker-compose.devnet.yaml ps
```

**Option B: Manual Service Start**
```bash
# Terminal 1: Start Anvil
anvil --host 0.0.0.0 --chain-id 31337

# Terminal 2: Start vlayer services
cd backend/vlayer
docker-compose -f docker-compose.devnet.yaml up vlayer-call-server vdns_server
```

### 2. Deploy Contracts
```bash
cd backend
forge script script/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 3. Verify Deployment
```bash
# Run tests to verify everything works
forge test --rpc-url http://localhost:8545

# Check contract deployment
cast call <REGISTRATION_CONTRACT_ADDRESS> "admin()" --rpc-url http://localhost:8545
```

### 4. Test Email Proof Workflow
```bash
cd vlayer
# Set up environment
cp .env.dev .env

# Run email proof generation
npx tsx proveEmailDomain.ts
```

---

## 🔍 Service Health Checks

### Check Service Status
```bash
# Docker services
docker-compose -f vlayer/docker-compose.devnet.yaml ps

# Service health endpoints
curl http://localhost:3000/health  # vlayer-call-server
curl http://localhost:3002/health  # vdns_server

# Blockchain connectivity
curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' http://localhost:8545
```

### Debug Connection Issues
```bash
# Check Docker logs
docker-compose -f vlayer/docker-compose.devnet.yaml logs vlayer-call-server
docker-compose -f vlayer/docker-compose.devnet.yaml logs anvil-l1

# Check network connectivity
docker network ls
docker network inspect vlayer_default
```

---

## 🚀 Production Deployment Strategy

### vlayer Production Integration

**Production Setup**:
1. **Use vlayer's Production Infrastructure**
   ```bash
   # Production environment variables
   PROVER_URL=https://api.vlayer.xyz
   JSON_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
   ```

2. **Deploy to Real Networks**
   ```bash
   # Mainnet deployment
   forge script script/DeployProduction.s.sol \
     --rpc-url $MAINNET_RPC_URL \
     --private-key $DEPLOYER_KEY \
     --broadcast --verify
   ```

3. **Configure Production Endpoints**
   - Use vlayer's hosted services instead of local Docker
   - Connect to production blockchain networks
   - Implement proper monitoring and alerting

### Environment Configuration

**Local Development** (`.env.dev`):
```bash
CHAIN_NAME=anvil
PROVER_URL=http://127.0.0.1:3000
JSON_RPC_URL=http://127.0.0.1:8545
```

**Production** (`.env.prod`):
```bash
CHAIN_NAME=mainnet
PROVER_URL=https://api.vlayer.xyz
JSON_RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_secure_private_key
```

---

## 🛠️ Development Workflow

### Daily Development Process
```bash
# 1. Start local environment
cd backend/vlayer && docker-compose -f docker-compose.devnet.yaml up -d

# 2. Deploy contracts if needed
cd ../
forge script script/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast

# 3. Run tests
forge test

# 4. Test email proofs
cd vlayer && npx tsx proveEmailDomain.ts

# 5. Clean up
docker-compose -f docker-compose.devnet.yaml down
```

### Debugging Tips
1. **Check service logs**: `docker-compose logs <service_name>`
2. **Verify network connectivity**: Test each endpoint individually
3. **Monitor blockchain state**: Use cast commands to check contract state
4. **vlayer debugging**: Check proof generation logs in call_server

---

## 📊 Performance Monitoring

### Local Development Metrics
- **Contract Deployment**: ~9.27M gas
- **Patient Registration**: ~115k gas
- **Organization Registration**: ~44k gas
- **Proof Generation Time**: Varies based on email complexity

### Production Considerations
- Monitor vlayer API rate limits
- Track blockchain network congestion
- Implement proper error handling and retries
- Set up alerts for service failures

---

**🎯 Ready for Local Development!**

This setup provides a complete local development environment that mirrors the production architecture while remaining easy to debug and test.

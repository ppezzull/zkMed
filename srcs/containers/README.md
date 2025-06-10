# zkMed Essential Container Architecture

This directory contains the minimal Docker container configurations for the zkMed platform, designed to work with the existing vlayer infrastructure.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                 zkMed Essential Stack                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐                          │
│  │   Next.js   │  │  Contract   │                          │
│  │  Frontend   │  │  Deployer   │                          │
│  │ (Port 3000) │  │ (One-time)  │                          │
│  └─────────────┘  └─────────────┘                          │
├─────────────────────────────────────────────────────────────┤
│              Existing vlayer Infrastructure                 │
│  ┌─────────────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐  │
│  │  anvil-l2-mantle│  │  Call   │  │  VDNS   │  │ Other │  │
│  │  (Port 8547)    │  │ Server  │  │ Server  │  │Services│  │
│  └─────────────────┘  └─────────┘  └─────────┘  └───────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Essential Services

### 1. contract-deployer
**Purpose**: Deploy smart contracts to vlayer anvil
- **Type**: One-time execution container
- **Network**: host mode (connects to vlayer anvil on localhost:8547)
- **Outputs**: Contract artifacts in shared volume

**Key Features**:
- Deploys Greeting contract to anvil-l2-mantle (chain-id 31339)
- Creates artifacts for frontend consumption
- Uses vlayer's pre-funded demo accounts

### 2. zkmed-frontend  
**Purpose**: Next.js application with server actions
- **Type**: Long-running web service
- **Port**: 3000
- **Dependencies**: contract-deployer (for contract addresses)

**Key Features**:
- Production-optimized Next.js build with bun
- Server actions instead of API endpoints
- Direct integration with vlayer anvil
- /dev page with GreetingDemo, ChainStats, WalletFunding components

## Network Architecture

### Service Communication
- **vlayer anvil**: Runs on host localhost:8547 (chain-id 31339)
- **Frontend**: Connects directly to anvil via host network
- **Contract deployer**: Uses host network to deploy to vlayer anvil

### Port Mapping
| Service | Port | Purpose |
|---------|------|---------|
| vlayer anvil-l2-mantle | 8547 | Blockchain RPC |
| zkmed-frontend | 3000 | Web application |

## Demo Environment

### Pre-configured Accounts (from vlayer)
Uses vlayer's deterministic anvil accounts:

```json
{
  "deployer": {
    "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "privateKey": "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
  },
  "user1": {
    "address": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    "privateKey": "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
  },
  "user2": {
    "address": "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    "privateKey": "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
  }
}
```

## Deployment Instructions

### Prerequisites
- vlayer containers already running (anvil-l2-mantle on port 8547)
- Docker and Docker Compose installed

### Quick Start
```bash
# Ensure vlayer is running
cd packages/foundry/vlayer
docker-compose -f docker-compose.devnet.yaml ps

# Deploy zkMed essential services
cd ../../../
docker-compose -f dockploy-compose.yml up -d

# Check status
docker-compose -f dockploy-compose.yml ps

# Access the app
open http://localhost:3000/dev
```

### Development Workflow
```bash
# View logs
docker-compose -f dockploy-compose.yml logs -f

# Restart services
docker-compose -f dockploy-compose.yml restart

# Check contract deployment
docker-compose -f dockploy-compose.yml logs contract-deployer

# Access frontend shell
docker-compose -f dockploy-compose.yml exec zkmed-frontend /bin/bash
```

## Configuration

### Environment Variables

#### contract-deployer
- `RPC_URL`: vlayer anvil endpoint (http://host.docker.internal:8547)
- `CHAIN_ID`: Chain ID (31339)
- `PRIVATE_KEY`: Deployer account private key

#### zkmed-frontend
- `NEXT_PUBLIC_RPC_URL`: Public RPC for browser (http://localhost:8547)
- `NEXT_PUBLIC_CHAIN_ID`: Chain ID for frontend (31339)
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`: Thirdweb client ID

### Volume Mounts
- `contract_artifacts`: Shared contract artifacts between deployer and frontend

## Server Actions

The frontend uses server actions instead of API endpoints:

- `getContractAddresses()`: Get deployed contract addresses
- `getGreetingContract()`: Get Greeting contract info
- `getChainInfo()`: Get blockchain network information
- `getDemoAccounts()`: Get demo account information

## Monitoring and Health

### Health Checks
```bash
# Frontend health
curl http://localhost:3000/api/health

# Check anvil connection
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://localhost:8547
```

### Common Issues

1. **vlayer not running**: Ensure anvil-l2-mantle is running on port 8547
2. **Contract deployment fails**: Check contract-deployer logs
3. **Frontend can't connect**: Verify RPC_URL environment variables

## Production Deployment

For production deployment on Dockploy:

1. **Repository Setup**: Push to Git repository
2. **Environment Variables**: Set production values for THIRDWEB_CLIENT_ID
3. **Domain Configuration**: Configure custom domain for port 3000
4. **Health Monitoring**: Monitor container health via Dockploy

---

This simplified architecture focuses on the essential components needed for the zkMed greeting demo, leveraging vlayer's existing infrastructure and server actions for optimal performance. 
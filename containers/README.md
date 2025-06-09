# zkMed Container Architecture

This directory contains the Docker container configurations for the zkMed platform, designed to work with the existing vlayer infrastructure and provide a complete demo environment.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    zkMed Container Stack                    │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Nginx     │  │   Next.js   │  │  Demo API   │        │
│  │   Proxy     │  │  Frontend   │  │   Service   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐                                           │
│  │ Contracts   │  (One-time deployment & demo setup)      │
│  │ Deployer    │                                           │
│  └─────────────┘                                           │
├─────────────────────────────────────────────────────────────┤
│              Existing vlayer Infrastructure                 │
│  ┌─────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌───────┐ │
│  │Anvil│  │  Call   │  │  VDNS   │  │ Notary  │  │WebSocket│
│  │ L1  │  │ Server  │  │ Server  │  │ Server  │  │ Proxy  │ │
│  └─────┘  └─────────┘  └─────────┘  └─────────┘  └───────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Container Services

### 1. zkmed-contracts
**Purpose**: Deploy smart contracts and setup demo accounts
- **Dockerfile**: `./contracts/Dockerfile`
- **Type**: One-time execution container
- **Dependencies**: anvil (from vlayer)
- **Outputs**: Contract addresses, demo account configuration

**Key Features**:
- Deploys RegistrationContract and EmailDomainProver
- Funds demo accounts with ETH
- Registers demo patient with commitment
- Generates configuration files for other services

### 2. zkmed-frontend  
**Purpose**: Next.js application container
- **Dockerfile**: `../packages/nextjs/Dockerfile`
- **Type**: Long-running web service
- **Port**: 3000
- **Dependencies**: zkmed-contracts (for contract addresses)

**Key Features**:
- Production-optimized Next.js build
- Demo mode with pre-configured accounts
- Integration with vlayer services
- Real-time demo interactions

### 3. zkmed-demo-api
**Purpose**: REST API for demo data and blockchain interactions
- **Dockerfile**: `./demo-api/Dockerfile`
- **Type**: Long-running API service  
- **Port**: 8080
- **Dependencies**: zkmed-contracts, anvil

**Key Features**:
- RESTful endpoints for demo account information
- Blockchain interaction utilities
- Account balance monitoring
- Demo workflow simulation

### 4. zkmed-proxy
**Purpose**: Nginx reverse proxy for unified access
- **Configuration**: `./nginx/nginx.conf`
- **Type**: Long-running proxy service
- **Ports**: 80, 443
- **Dependencies**: zkmed-frontend, zkmed-demo-api

**Key Features**:
- Routes traffic to appropriate services
- CORS configuration for API access
- SSL termination (when configured)
- Rate limiting and security headers

## Network Architecture

### Service Communication
- **Internal Network**: `vlayer-network` (shared with vlayer services)
- **External Access**: Only through nginx proxy on ports 80/443
- **Inter-Service**: Containers communicate via internal hostnames

### Port Mapping
| Service | Internal Port | External Port | Purpose |
|---------|--------------|---------------|----------|
| anvil | 8545 | 8545 | Blockchain RPC (via vlayer) |
| zkmed-frontend | 3000 | - | Web application |
| zkmed-demo-api | 8080 | - | Demo API |
| zkmed-proxy | 80/443 | 80/443 | Public access |

### URL Routing
```
http://localhost/              → zkmed-frontend (Next.js app)
http://localhost/api/demo/     → zkmed-demo-api (demo endpoints)
http://localhost/api/contracts → zkmed-demo-api (contract info)
http://localhost/rpc           → anvil (blockchain RPC)
http://localhost/health        → nginx health check
```

## Demo Environment

### Pre-configured Accounts
The container stack creates demo accounts with Anvil's deterministic keys:

```json
{
  "insurer": {
    "address": "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266",
    "name": "Regione Lazio Health Insurance",
    "domain": "laziosalute.it"
  },
  "hospital": {
    "address": "0x70997970c51812dc3a010c7d01b50e0d17dc79c8",
    "name": "Ospedale San Giovanni", 
    "domain": "sangiovanni.lazio.it"
  },
  "patient": {
    "address": "0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc",
    "commitment": "0x1234...cdef"
  }
}
```

### Demo Workflows
1. **Patient Registration**: Pre-registered with commitment
2. **Organization Verification**: Domain verification via vlayer
3. **Claim Submission**: Multi-proof claim processing
4. **Claim Approval**: Insurer approval workflow

## Deployment Instructions

### Prerequisites
- Docker and Docker Compose installed
- jq (for JSON processing in Makefile)
- curl (for health checks and testing)

### Quick Start
```bash
# Clone and navigate to zkMed directory
cd zkMed

# Setup development environment
make dev-env

# Quick start (builds and starts everything)
make quick-start

# Access the demo
open http://localhost
```

### Manual Deployment
```bash
# 1. Start vlayer services first
cd packages/foundry/vlayer
docker-compose -f docker-compose.devnet.yaml up -d

# 2. Wait for anvil to be ready
sleep 10

# 3. Build zkMed containers  
cd ../../../
docker-compose build

# 4. Start zkMed services
docker-compose up -d

# 5. Check status
make status
```

### Development Workflow
```bash
# View logs
make logs

# Check health
make health

# Run demo tests
make demo-test

# Access individual services
make shell-frontend
make shell-api

# Restart services
make restart
```

## Configuration

### Environment Variables

#### zkmed-contracts
- `RPC_URL`: Blockchain RPC endpoint (default: http://anvil:8545)
- `CHAIN_ID`: Chain ID (default: 31337)
- `DEMO_MODE`: Enable demo setup (default: true)
- `PRIVATE_KEY_*`: Demo account private keys

#### zkmed-frontend
- `NEXT_PUBLIC_RPC_URL`: Public RPC URL for browser
- `NEXT_PUBLIC_CHAIN_ID`: Chain ID for frontend
- `NEXT_PUBLIC_DEMO_MODE`: Enable demo mode
- `NEXT_PUBLIC_DEMO_*`: Demo account addresses
- `NEXT_PUBLIC_VLAYER_*`: vlayer service endpoints

#### zkmed-demo-api
- `RPC_URL`: Blockchain RPC for API calls
- `CHAIN_ID`: Chain ID for network validation
- `DEMO_ACCOUNTS_FILE`: Path to demo accounts configuration

### Volume Mounts
- `contract-artifacts`: Shared contract addresses and ABIs
- `./demo-data`: Demo account configuration and test data
- `./packages/foundry`: Smart contract source code

## Monitoring and Debugging

### Health Checks
All containers include health check endpoints:

```bash
# Overall system health
make health

# Individual service health
curl http://localhost:3000/health.json  # Frontend
curl http://localhost:8080/health       # Demo API
curl http://localhost/health            # Nginx proxy
```

### Log Monitoring
```bash
# All services
make logs

# Individual services
make logs-frontend
make logs-api
make logs-contracts
make logs-vlayer
```

### Common Issues

1. **Container startup order**: Ensure vlayer services start first
2. **Network connectivity**: Check that containers are on vlayer-network
3. **Contract deployment**: Verify zkmed-contracts completed successfully
4. **Demo data**: Check that `/app/demo-data/accounts.json` was created

### Debugging Commands
```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs -f [service-name]

# Access container shell
docker-compose exec [service-name] /bin/bash

# Restart specific service
docker-compose restart [service-name]

# Rebuild and restart
docker-compose up -d --build [service-name]
```

## Production Deployment

### Dockploy Integration
This container architecture is designed for Dockploy deployment:

1. **Repository Setup**: Push to Git repository
2. **Dockploy Configuration**: Import repository and configure services
3. **Environment Variables**: Set production environment variables
4. **Domain Configuration**: Configure custom domain and SSL
5. **Monitoring**: Setup container health monitoring

### Security Considerations
- Change default demo private keys for production
- Configure proper SSL certificates
- Setup firewall rules for container access
- Enable container resource limits
- Configure log retention and rotation

### Scaling
- **Frontend**: Can be horizontally scaled via Dockploy
- **Demo API**: Can be scaled for higher API throughput
- **Blockchain**: Anvil is single-instance (consider mainnet for production)
- **Proxy**: Nginx can handle multiple backend instances

## Contributing

### Adding New Containers
1. Create new directory under `./containers/[service-name]/`
2. Add Dockerfile and required configuration files
3. Update `docker-compose.yml` with new service
4. Add Makefile targets for management
5. Update this README with service documentation

### Container Development
- Use multi-stage builds for optimized images
- Include health checks in all containers
- Follow security best practices (non-root users)
- Add proper logging and error handling
- Document environment variables and volumes

### Testing
- Test containers individually and as a stack
- Verify demo workflows work end-to-end
- Check health endpoints respond correctly
- Validate container restart behavior
- Test with different resource constraints

---

For questions or support, please refer to the main zkMed documentation or open an issue in the repository. 
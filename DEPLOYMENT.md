# zkMed Deployment Guide

Complete guide for deploying zkMed with containerized infrastructure and live demo environment.

## 🚀 Quick Start

### Prerequisites
- Docker and Docker Compose installed
- jq (for JSON processing)
- curl (for API testing)
- Git (for repository access)

### One-Command Setup
```bash
git clone <zkmed-repository>
cd zkMed
make quick-start
```

This command will:
1. Build all containers
2. Start vlayer infrastructure
3. Deploy smart contracts with demo accounts
4. Start the Next.js frontend
5. Configure nginx reverse proxy

**Access URLs:**
- **Frontend**: http://localhost
- **Demo API**: http://localhost:8080
- **RPC Endpoint**: http://localhost/rpc
- **Health Check**: http://localhost/health

## 🐳 Container Architecture

### Service Overview
```
┌─────────────────────────────────────────────────────────────┐
│                    zkMed Container Stack                    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│ │   Nginx     │ │   Next.js   │ │  Demo API   │ │Contract │ │
│ │   Proxy     │ │  Frontend   │ │   Service   │ │Deployer │ │
│ │  (Port 80)  │ │ (Port 3000) │ │ (Port 8080) │ │(One-time│ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
├─────────────────────────────────────────────────────────────┤
│              Existing vlayer Infrastructure                 │
│ ┌─────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐ │
│ │Anvil│ │  Call   │ │  VDNS   │ │ Notary  │ │ WebSocket   │ │
│ │8545 │ │Server   │ │Server   │ │Server   │ │   Proxy     │ │
│ │     │ │  3000   │ │  3002   │ │  7047   │ │    3003     │ │
│ └─────┘ └─────────┘ └─────────┘ └─────────┘ └─────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Container Details

#### 1. zkmed-contracts (One-time)
- **Purpose**: Deploy contracts and setup demo accounts
- **Runtime**: Executes once then exits
- **Outputs**: Contract addresses, demo account configuration
- **Dependencies**: anvil (vlayer)

#### 2. zkmed-frontend (Persistent)
- **Purpose**: Next.js web application
- **Runtime**: Long-running web service
- **Access**: Internal port 3000, external via proxy
- **Features**: Demo mode, real contract interactions

#### 3. zkmed-demo-api (Persistent)  
- **Purpose**: REST API for demo data
- **Runtime**: Long-running API service
- **Access**: Internal port 8080, external via proxy
- **Features**: Account management, workflow simulation

#### 4. zkmed-proxy (Persistent)
- **Purpose**: Nginx reverse proxy
- **Runtime**: Long-running proxy service
- **Access**: External ports 80/443
- **Features**: SSL termination, CORS, rate limiting

## 📋 Step-by-Step Deployment

### Step 1: Environment Setup
```bash
# Clone repository
git clone <zkmed-repository>
cd zkMed

# Check prerequisites
make dev-env

# Verify Docker is running
docker --version
docker-compose --version
```

### Step 2: Build Containers
```bash
# Build all zkMed containers
make build

# Verify builds completed
docker images | grep zkmed
```

### Step 3: Start vlayer Infrastructure
```bash
# Start vlayer services first
cd packages/foundry/vlayer
docker-compose -f docker-compose.devnet.yaml up -d

# Wait for services to initialize
sleep 10

# Check vlayer status
docker-compose -f docker-compose.devnet.yaml ps
```

### Step 4: Deploy zkMed Stack
```bash
# Return to root directory
cd ../../../

# Start zkMed services
docker-compose up -d

# Monitor deployment
make logs-contracts
```

### Step 5: Verify Deployment
```bash
# Check all services running
make status

# Run health checks
make health

# Test demo functionality
make demo-test
```

## 🎭 Demo Environment

### Pre-configured Accounts
The deployment automatically creates demo accounts:

| Role | Address | Name | Domain |
|------|---------|------|--------|
| Insurer | `0xf39f...2266` | Regione Lazio Health Insurance | laziosalute.it |
| Hospital | `0x7099...79c8` | Ospedale San Giovanni | sangiovanni.lazio.it |
| Patient | `0x3c44...93bc` | Demo Patient | - |
| Admin | `0x90f7...3b906` | System Admin | - |

### Demo Workflows Available

#### 1. Patient Registration
```bash
# API endpoint
curl -X POST http://localhost:8080/api/demo/register-patient \
  -H "Content-Type: application/json" \
  -d '{"commitment":"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"}'

# Frontend access
open http://localhost/demo/patient-registration
```

#### 2. Hospital Claim Submission
```bash
# API endpoint  
curl -X POST http://localhost:8080/api/demo/submit-claim \
  -H "Content-Type: application/json" \
  -d '{"amount":"1000","description":"Demo medical procedure"}'

# Frontend access
open http://localhost/demo/claim-submission
```

#### 3. Insurer Claim Approval
```bash
# API endpoint
curl -X POST http://localhost:8080/api/demo/approve-claim \
  -H "Content-Type: application/json" \
  -d '{"claimId":"DEMO_CLAIM","amount":"1000"}'

# Frontend access  
open http://localhost/demo/claim-approval
```

### Demo Data Access
```bash
# Get all demo accounts
curl http://localhost:8080/api/demo/accounts

# Get account balances
curl http://localhost:8080/api/demo/balances

# Get blockchain status
curl http://localhost:8080/api/demo/blockchain

# Get contract addresses
curl http://localhost:8080/api/contracts
```

## 🔧 Development Workflow

### Daily Development Commands
```bash
# Check status
make status

# View logs
make logs

# Restart services
make restart

# Run tests
make demo-test

# Check health
make health
```

### Individual Service Management
```bash
# Frontend development
make logs-frontend
make shell-frontend

# API development
make logs-api
make shell-api

# Contract development
make logs-contracts
make shell-contracts

# vlayer services
make logs-vlayer
```

### Making Changes

#### Frontend Changes
```bash
# Edit files in packages/nextjs/
# Rebuild frontend container
docker-compose build zkmed-frontend
docker-compose restart zkmed-frontend
```

#### Smart Contract Changes
```bash
# Edit files in packages/foundry/
# Redeploy contracts
docker-compose restart zkmed-contracts
# Wait for deployment to complete
make demo-status
```

#### Demo API Changes
```bash
# Edit files in containers/demo-api/
# Rebuild and restart
docker-compose build zkmed-demo-api
docker-compose restart zkmed-demo-api
```

## 🏭 Production Deployment

### Dockploy Deployment

#### 1. Repository Setup
```bash
# Push to Git repository
git add .
git commit -m "feat: container deployment ready"
git push origin main
```

#### 2. Dockploy Configuration
```yaml
# dockploy.yml (for Dockploy platform)
name: zkmed
services:
  include:
    - docker-compose.yml
environment:
  NODE_ENV: production
  NEXT_PUBLIC_DEMO_MODE: true
domain: zkmed.yourdomain.com
ssl: auto
```

#### 3. Environment Variables
Set these in Dockploy dashboard:
```env
NODE_ENV=production
NEXT_PUBLIC_RPC_URL=https://zkmed.yourdomain.com/rpc
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_INSURER=0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
NEXT_PUBLIC_DEMO_HOSPITAL=0x70997970c51812dc3a010c7d01b50e0d17dc79c8
NEXT_PUBLIC_DEMO_PATIENT=0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc
```

### Custom Domain Setup
```bash
# Configure DNS (example)
A     zkmed.yourdomain.com    → [dockploy-ip]
CNAME api.zkmed.yourdomain.com → zkmed.yourdomain.com

# SSL will be automatically configured by Dockploy
```

### Production Access URLs
```
Frontend:    https://zkmed.yourdomain.com
Demo API:    https://zkmed.yourdomain.com:8080
RPC:         https://zkmed.yourdomain.com/rpc
Health:      https://zkmed.yourdomain.com/health
```

## 📊 Monitoring and Maintenance

### Health Monitoring
```bash
# Automated health checks
curl -f https://zkmed.yourdomain.com/health || echo "Frontend down"
curl -f https://zkmed.yourdomain.com:8080/health || echo "API down"

# Check blockchain connectivity
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  https://zkmed.yourdomain.com/rpc
```

### Log Management
```bash
# View live logs
make logs

# Search logs
docker-compose logs zkmed-frontend | grep ERROR
docker-compose logs zkmed-demo-api | grep WARNING

# Log rotation (production)
docker system prune -f --volumes
```

### Container Maintenance
```bash
# Update containers
make build
make restart

# Clean up
make clean

# Full reset
make reset

# Production rebuild
make prod-build
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Containers Won't Start
```bash
# Check Docker daemon
systemctl status docker

# Check port conflicts
netstat -tulpn | grep :8545
netstat -tulpn | grep :3000

# Clear Docker state
make clean
docker system prune -a
```

#### 2. Contract Deployment Fails
```bash
# Check anvil connection
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://localhost:8545

# Check contract deployer logs
make logs-contracts

# Restart deployment
docker-compose restart zkmed-contracts
```

#### 3. Frontend Not Accessible
```bash
# Check nginx configuration
docker-compose exec zkmed-proxy nginx -t

# Check frontend health
curl http://localhost:3000/health.json

# Restart proxy
docker-compose restart zkmed-proxy
```

#### 4. Demo API Not Responding
```bash
# Check API health
curl http://localhost:8080/health

# Check demo data exists
docker-compose exec zkmed-demo-api ls -la /app/demo-data/

# Restart API service
docker-compose restart zkmed-demo-api
```

### Debug Commands
```bash
# Container status
docker-compose ps

# Resource usage
docker stats

# Network connectivity
docker-compose exec zkmed-frontend ping zkmed-demo-api
docker-compose exec zkmed-demo-api ping anvil

# Container logs
docker-compose logs --tail=100 [service-name]

# Execute in container
docker-compose exec [service-name] /bin/bash
```

### Recovery Procedures

#### Full System Recovery
```bash
# Stop everything
make down

# Clean Docker state
docker system prune -a -f

# Remove volumes
docker volume prune -f

# Rebuild and restart
make build
make up

# Verify recovery
make health
```

#### Partial Service Recovery
```bash
# Restart specific service
docker-compose restart [service-name]

# Rebuild specific service
docker-compose build [service-name]
docker-compose up -d [service-name]

# Check service logs
make logs-[service-name]
```

## 📚 Additional Resources

### Documentation
- [Container Architecture](./containers/README.md)
- [Demo Data Structure](./demo-data/README.md)
- [vlayer Integration](./packages/foundry/vlayer/README.md)
- [Frontend Configuration](./packages/nextjs/README.md)

### API Documentation
- Demo API: http://localhost:8080/api/docs (when available)
- Contract ABIs: Available in `/app/artifacts/` volume
- Health Endpoints: All services provide `/health` endpoints

### Development Tools
```bash
# Makefile commands
make help                 # Show all available commands
make demo-setup          # Complete demo environment setup
make dev-env             # Check development prerequisites
make docs               # Show documentation links
```

### Support and Contributing
- **Issues**: Report issues in the GitHub repository
- **Contributing**: See CONTRIBUTING.md for development guidelines
- **Security**: Report security issues privately to the team

---

**🎉 Congratulations!** You now have a fully functional zkMed platform with containerized deployment, live demo environment, and production-ready infrastructure.

Access your demo at: **http://localhost** 🚀 
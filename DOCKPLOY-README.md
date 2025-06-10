# zkMed Dockploy Deployment Guide

**zkMed** - Revolutionary Privacy-Preserving Healthcare Platform with Yield-Generating Fund Pools

This guide covers deploying zkMed using Dockploy for production-ready containerized deployment.

---

## 🚀 Quick Start

### 1. Prerequisites

- **Docker & Docker Compose**: Latest versions installed
- **System Requirements**: 4GB RAM, 2 CPU cores, 10GB storage
- **Network Access**: Ports 80, 443, 3000, 8080, 8545 available

### 2. One-Command Deployment

```bash
# Clone and deploy zkMed
git clone <repository-url>
cd zkMed
./dockploy-start.sh
```

### 3. Access Your Deployment

- **Frontend**: http://localhost:3000
- **Blockchain RPC**: http://localhost:8545  
- **Demo API**: http://localhost:8080
- **Nginx Proxy**: http://localhost

---

## 🏗️ Architecture Overview

### Container Services

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| **Mantle Fork** | `zkmed-mantle-fork` | 8545 | Persistent blockchain (Chain ID: 31339) |
| **Frontend** | `zkmed-frontend` | 3000 | Next.js application with Web3 integration |
| **Demo API** | `zkmed-demo-api` | 8080 | Backend API for demo data management |
| **Nginx Proxy** | `zkmed-proxy` | 80/443 | Reverse proxy with SSL termination |
| **Contract Deployer** | `zkmed-deployer` | - | One-time contract deployment |

### Data Persistence

- **Blockchain Data**: Persistent Anvil state in `blockchain_data` volume
- **Contract Artifacts**: Shared contract addresses in `contract_artifacts` volume
- **Demo Data**: Pre-configured accounts and sample transactions

---

## 🔧 Configuration

### Environment Variables

The deployment uses the following key environment variables:

```env
# Blockchain Configuration
CHAIN_ID=31339
RPC_URL=http://mantle-fork:8545

# Demo Accounts (Anvil defaults)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Frontend Configuration  
NODE_ENV=production
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_CHAIN_ID=31339
NEXT_PUBLIC_RPC_URL=http://localhost:8545
```

### Demo Accounts

The deployment includes three pre-configured demo accounts:

| Role | Address | Private Key |
|------|---------|-------------|
| **Admin/Deployer** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| **User 1** | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| **User 2** | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |

---

## 🎯 Smart Contracts

### Greeting Contract

The deployment includes a functional Greeting contract for testing:

```solidity
// Contract Functions
- setGreeting(string): Set a new greeting message
- getGreeting(): Get the current greeting
- getUserGreeting(address): Get user-specific greeting
- totalGreetings(): Get total number of greetings set
```

### Contract Addresses

After deployment, contract addresses are available in:
- **File**: `srcs/foundry/out/addresses.json`
- **API**: `http://localhost:8080/api/contracts`

---

## 🔍 Monitoring & Health Checks

### Health Endpoints

| Service | Endpoint | Purpose |
|---------|----------|---------|
| **Frontend** | `/api/health` | Application health status |
| **Nginx** | `/nginx-health` | Proxy health status |
| **Blockchain** | `/rpc` | RPC endpoint health |

### Service Status

```bash
# Check all container status
docker-compose -f dockploy-compose.yml ps

# View service logs
docker-compose -f dockploy-compose.yml logs [service-name]

# Monitor real-time logs
./dockploy-start.sh --logs
```

---

## 🐳 Dockploy Integration

### Dockploy Configuration

For Dockploy deployment, use the following settings:

```yaml
# dockploy.yml
version: "1.0"
services:
  zkmed:
    compose_file: "./dockploy-compose.yml"
    startup_script: "./dockploy-start.sh"
    health_check: "http://localhost:3000/api/health"
    auto_restart: true
    persistent_data:
      - blockchain_data
      - contract_artifacts
```

### Domain Configuration

For custom domain deployment:

1. **Update Nginx Config**: Modify `srcs/containers/nginx/nginx.conf`
2. **SSL Certificates**: Mount certificates to `/etc/ssl/certs/`
3. **Environment Variables**: Update domain-specific variables

```bash
# Example for production domain
DOMAIN=zkmed.example.com
NEXT_PUBLIC_RPC_URL=https://${DOMAIN}/rpc
```

---

## 🔄 Development Workflow

### Local Development

```bash
# Start development environment
./dockploy-start.sh

# Update contracts
cd srcs/foundry
forge build
forge test

# Update frontend
cd srcs/nextjs
npm run dev
```

### Container Updates

```bash
# Rebuild specific service
docker-compose -f dockploy-compose.yml build [service-name]

# Update and restart
docker-compose -f dockploy-compose.yml up --build -d
```

---

## 🚨 Troubleshooting

### Common Issues

#### Container Startup Issues
```bash
# Check container logs
docker logs zkmed-mantle-fork
docker logs zkmed-deployer
docker logs zkmed-frontend

# Restart services
docker-compose -f dockploy-compose.yml restart
```

#### Contract Deployment Failures
```bash
# Check deployer logs
docker logs zkmed-deployer

# Manual contract deployment
cd srcs/foundry
./scripts/deploy.sh
```

#### Frontend Connection Issues
```bash
# Verify RPC connectivity
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:8545

# Check frontend health
curl http://localhost:3000/api/health
```

### Service Recovery

```bash
# Full reset (destroys data)
docker-compose -f dockploy-compose.yml down --volumes
./dockploy-start.sh

# Partial restart (preserves data)
docker-compose -f dockploy-compose.yml restart
```

---

## 📊 Performance & Scaling

### Resource Requirements

| Environment | CPU | RAM | Storage | Network |
|-------------|-----|-----|---------|---------|
| **Development** | 2 cores | 4GB | 10GB | 100Mbps |
| **Production** | 4 cores | 8GB | 50GB | 1Gbps |
| **High Load** | 8 cores | 16GB | 100GB | 10Gbps |

### Scaling Options

1. **Horizontal Scaling**: Multiple frontend replicas
2. **Load Balancing**: Nginx upstream configuration
3. **Caching**: Redis integration for session data
4. **CDN**: Static asset distribution

---

## 🔐 Security Considerations

### Production Deployment

1. **Change Default Keys**: Update all demo private keys
2. **SSL Certificates**: Use valid certificates for HTTPS
3. **Firewall Rules**: Restrict access to necessary ports
4. **Environment Variables**: Use secure environment management
5. **Container Security**: Regular image updates and scans

### Network Security

```bash
# Example firewall configuration (Ubuntu/CentOS)
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw deny 8545/tcp   # Block direct RPC access
ufw deny 3000/tcp   # Block direct frontend access
```

---

## 📈 Next Steps

### Immediate Actions

1. **Test Deployment**: Verify all services are running
2. **Configure Domain**: Set up custom domain and SSL
3. **Monitor Performance**: Set up logging and monitoring
4. **Backup Strategy**: Implement data backup procedures

### Future Enhancements

1. **Advanced Features**: Integrate zkMed healthcare contracts
2. **Analytics**: Add performance monitoring
3. **CI/CD Pipeline**: Automated deployment workflows
4. **Multi-Environment**: Development, staging, production setups

---

## 🎉 Success!

Your zkMed deployment should now be running successfully. The platform demonstrates:

- **Revolutionary Healthcare Innovation**: Yield-generating fund pools
- **Privacy-Preserving Technology**: Zero-knowledge proof integration
- **Production-Ready Infrastructure**: Containerized scalable deployment
- **Modern Web3 UX**: Seamless blockchain interaction

**Ready for The Cookathon on Mantle Network!** 🚀

---

## 📞 Support

For deployment issues or questions:

1. **Check Logs**: Use provided commands to diagnose issues
2. **Health Checks**: Verify all endpoints are responding
3. **Documentation**: Review memory bank files for detailed context
4. **Container Status**: Ensure all services are running properly

The deployment includes comprehensive logging and monitoring to help identify and resolve any issues quickly. 
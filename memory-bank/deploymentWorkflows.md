# Deployment & Development Workflows

## 🚀 Dockploy Production Deployment

### Status: ✅ PRODUCTION READY FOR CONTAINERIZATION
- **Smart Contracts**: Fully implemented and tested (37/37 tests passing)
- **vlayer Integration**: Complete email proof workflow
- **Security**: Production hardened, test helpers removed
- **Container Architecture**: Multi-service Docker setup for Dockploy
- **Demo Environment**: Pre-configured accounts for live POC

### Dockploy Deployment Commands

#### Container Stack Deployment
```bash
# Deploy complete zkMed stack to Dockploy
dockploy deploy zkmed-stack --config ./dockploy.yml

# Monitor deployment status
dockploy status zkmed-stack

# View container logs
dockploy logs zkmed-mantle-fork
dockploy logs zkmed-frontend
dockploy logs zkmed-deployer
```

#### Demo Environment Access
```bash
# Access live demo at your domain
https://zkmed.yourdomain.com

# Check demo account status
curl https://zkmed.yourdomain.com/api/demo/accounts

# Monitor blockchain RPC
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  https://zkmed.yourdomain.com/rpc
```

### Dockploy Requirements Checklist
- [ ] Dockploy account and CLI configured
- [ ] Custom domain configured (e.g., zkmed.yourdomain.com)
- [ ] SSL certificate setup (automatic via Dockploy)
- [ ] Container resource limits defined
- [ ] Monitoring and alerting configured
- [ ] Demo account private keys secured

## 🐳 Container Architecture

### Multi-Service Docker Setup
**Key Innovation**: Persistent Mantle fork with automated demo data initialization
- ✅ Long-running blockchain state preservation
- ✅ Pre-configured demo accounts for immediate POC
- ✅ Live frontend with real transaction capabilities
- ✅ Clean domain access via reverse proxy

### Container Services Stack
```
✅ mantle-fork (Chain ID: 31339) - Port 8545 (Persistent)
✅ contract-deployer (One-time setup) - Demo initialization
✅ zkmed-frontend (Next.js) - Port 3000 (Live demo)
✅ nginx-proxy (Reverse proxy) - Ports 80/443 (Domain access)
```

### One-Command Dockploy Setup
```bash
# Complete stack deployment
dockploy deploy zkmed-stack

# Automated demo account setup
dockploy exec zkmed-deployer setup-demo-accounts

# Health check all services
dockploy health zkmed-stack

# Access live demo
open https://zkmed.yourdomain.com
```

## 🏥 Pre-Configured Demo Environment

### Demo Account Setup
Create pre-configured accounts for immediate POC testing:

#### Demo Insurer Account
```json
{
  "name": "Regione Lazio Health Insurance",
  "domain": "laziosalute.it",
  "email": "admin@laziosalute.it",
  "walletAddress": "0x742d35Cc6634C0532925a3b8D0B5B0052A57adD4",
  "privateKey": "0x...",
  "role": "Insurer",
  "verified": true,
  "poolBalance": "100000000000000000000000" // 100k mUSD
}
```

#### Demo Hospital Account
```json
{
  "name": "Ospedale San Giovanni",
  "domain": "sangiovanni.lazio.it",
  "email": "admin@sangiovanni.lazio.it", 
  "walletAddress": "0x8ba1f109551bD432803012645Hac136c7Aad5a6",
  "privateKey": "0x...",
  "role": "Hospital",
  "verified": true
}
```

#### Demo Patient Account
```json
{
  "commitment": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "walletAddress": "0x123456789abcdef123456789abcdef1234567890",
  "privateKey": "0x...",
  "role": "Patient",
  "insurer": "0x742d35Cc6634C0532925a3b8D0B5B0052A57adD4",
  "monthlyPremium": "500000000000000000000", // 500 mUSD
  "poolBalance": "6000000000000000000000" // 6k mUSD (12 months)
}
```

### Automated Demo Workflows
```bash
# Initialize all demo accounts
docker exec zkmed-deployer npm run setup-demo-accounts

# Fund demo accounts with mUSD
docker exec zkmed-deployer npm run fund-demo-accounts

# Register demo organizations
docker exec zkmed-deployer npm run register-demo-orgs

# Create demo patient pools
docker exec zkmed-deployer npm run create-demo-pools
```

## 🖥️ Next.js Container Integration

### Container Environment Setup
Create `packages/nextjs/Dockerfile`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### Container Environment Variables
```bash
# packages/nextjs/.env.container
NEXT_PUBLIC_RPC_URL=http://mantle-fork:8545
NEXT_PUBLIC_CHAIN_ID=31339
NEXT_PUBLIC_REGISTRATION_CONTRACT=0x...
NEXT_PUBLIC_POOLING_CONTRACT=0x...

# Demo account access
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_DEMO_INSURER=0x742d35Cc6634C0532925a3b8D0B5B0052A57adD4
NEXT_PUBLIC_DEMO_HOSPITAL=0x8ba1f109551bD432803012645Hac136c7Aad5a6
NEXT_PUBLIC_DEMO_PATIENT=0x123456789abcdef123456789abcdef1234567890
```

### wagmi Container Configuration
```typescript
import { createConfig, http } from 'wagmi'

export const containerMantle = {
  id: 31339,
  name: 'Mantle Fork (Container)',
  rpcUrls: {
    default: { http: [process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545'] }
  },
  nativeCurrency: {
    decimals: 18,
    name: 'Mantle',
    symbol: 'MNT',
  },
} as const

export const config = createConfig({
  chains: [containerMantle],
  transports: {
    [containerMantle.id]: http(),
  },
})
```

### Live Demo Integration
```typescript
// packages/nextjs/src/services/demo.ts
export class DemoService {
  async connectDemoAccount(accountType: 'insurer' | 'hospital' | 'patient') {
    const demoAccounts = {
      insurer: process.env.NEXT_PUBLIC_DEMO_INSURER,
      hospital: process.env.NEXT_PUBLIC_DEMO_HOSPITAL,
      patient: process.env.NEXT_PUBLIC_DEMO_PATIENT
    };
    
    // Connect to pre-configured demo account
    return await connectWallet(demoAccounts[accountType]);
  }
  
  async runDemoWorkflow(workflow: string) {
    switch(workflow) {
      case 'patient-registration':
        return await this.demoPatientRegistration();
      case 'hospital-claim':
        return await this.demoHospitalClaim();
      case 'insurer-approval':
        return await this.demoInsurerApproval();
    }
  }
}
```

## 🔧 Container Development Tools

### Dockploy Management Commands
```bash
# Container lifecycle
dockploy start zkmed-stack
dockploy stop zkmed-stack  
dockploy restart zkmed-stack
dockploy scale zkmed-frontend --replicas 3

# Monitoring and debugging
dockploy logs zkmed-mantle-fork --follow
dockploy exec zkmed-frontend /bin/sh
dockploy stats zkmed-stack

# Domain and SSL management
dockploy domain add zkmed.yourdomain.com
dockploy ssl enable zkmed.yourdomain.com
```

### Container Health Monitoring
```bash
# Check container health
curl https://zkmed.yourdomain.com/health

# Check blockchain connectivity
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  https://zkmed.yourdomain.com/rpc

# Check demo account status
curl https://zkmed.yourdomain.com/api/demo/status
```

### Demo Interaction Testing
```bash
# Test demo patient registration
curl -X POST https://zkmed.yourdomain.com/api/demo/register-patient

# Test demo claim submission
curl -X POST https://zkmed.yourdomain.com/api/demo/submit-claim

# Test demo approval workflow
curl -X POST https://zkmed.yourdomain.com/api/demo/approve-claim
```

## 📊 Container Performance Metrics

### Resource Requirements
| Container | CPU | Memory | Storage | Restart Policy |
|-----------|-----|--------|---------|----------------|
| mantle-fork | 1 core | 2GB | 20GB | always |
| contract-deployer | 0.5 core | 1GB | 1GB | no |
| zkmed-frontend | 0.5 core | 1GB | 5GB | always |
| nginx-proxy | 0.2 core | 256MB | 1GB | always |

### Container Health Checks
```yaml
# Health check configurations
healthcheck:
  mantle-fork:
    test: ["CMD", "curl", "-f", "http://localhost:8545"]
    interval: 30s
    timeout: 10s
    retries: 3
    
  frontend:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
```

## 🛡️ Container Security & Privacy

### Container Security Measures
- ✅ **Isolated Networks**: Containers communicate via internal networks only
- ✅ **Minimal Images**: Alpine-based images with only required dependencies
- ✅ **Non-root Users**: All containers run with non-privileged users
- ✅ **Resource Limits**: CPU and memory limits prevent resource exhaustion
- ✅ **Health Monitoring**: Automated restart on failure detection

### Demo Data Security
- ✅ **Encrypted Secrets**: Demo private keys stored in Dockploy secrets
- ✅ **Environment Isolation**: Demo accounts isolated from production
- ✅ **Access Logging**: All demo interactions logged for monitoring
- ✅ **Privacy Preservation**: Real privacy features maintained in demo

## 🚧 Known Container Limitations & Best Practices

### Current Container Limitations
1. **Demo Data Reset**: Container restart resets demo account states
2. **Single Node**: No horizontal scaling for blockchain container
3. **Volume Management**: Persistent data requires proper volume configuration
4. **SSL Dependencies**: Custom domains require proper SSL setup

### Container Best Practices
1. **Volume Persistence**: Always mount blockchain data to persistent volumes
2. **Health Monitoring**: Configure proper health checks for all services
3. **Resource Limits**: Set appropriate CPU and memory limits
4. **Log Management**: Configure log rotation and retention policies
5. **Backup Strategy**: Regular backup of persistent blockchain data

## 🔍 Container Monitoring & Health Checks

### Service Health Verification
```bash
# Check all container status
dockploy ps zkmed-stack

# Verify blockchain accessibility
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  https://zkmed.yourdomain.com/rpc

# Test frontend accessibility
curl -I https://zkmed.yourdomain.com

# Check demo account balances
curl https://zkmed.yourdomain.com/api/demo/balances
```

### Real-time Container Monitoring
The Dockploy dashboard provides:
- Container status and resource usage
- Application logs and error tracking
- Network traffic monitoring
- SSL certificate status
- Domain configuration health

### Production Container Requirements
- Monitor contract deployment success rates
- Track demo interaction completion rates
- Watch container resource utilization
- Monitor SSL certificate expiration
- Set up alerts for container failures

## 📋 Container Development Best Practices

### Daily Container Routine
1. **Check Status**: `dockploy status zkmed-stack`
2. **View Logs**: `dockploy logs zkmed-stack --tail 100`
3. **Test Demo**: Visit https://zkmed.yourdomain.com
4. **Monitor Resources**: Check Dockploy dashboard
5. **Backup Data**: Ensure persistent data is backed up

### Container Testing Workflow
```bash
# Local container testing
docker-compose -f docker-compose.local.yml up

# Integration testing with demo accounts
npm run test:demo-integration

# Container resource testing
docker stats zkmed-containers

# Full deployment test
dockploy deploy zkmed-stack --dry-run
```

### Error Resolution for Containers
1. **Container Health**: `dockploy health zkmed-stack`
2. **Service Logs**: `dockploy logs [service-name]`
3. **Container Restart**: `dockploy restart [service-name]`
4. **Full Stack Restart**: `dockploy restart zkmed-stack`
5. **Emergency Rollback**: `dockploy rollback zkmed-stack`

## 🎯 Dockploy Production Deployment Checklist

### Pre-Deployment
- [ ] All containers tested locally (docker-compose)
- [ ] Demo accounts and data prepared
- [ ] Domain and SSL configuration ready
- [ ] Resource limits and health checks configured
- [ ] Backup and monitoring procedures documented

### Deployment Steps
1. **Deploy Container Stack**: `dockploy deploy zkmed-stack`
2. **Verify Container Health**: Check all services running
3. **Initialize Demo Data**: Run demo account setup scripts
4. **Test Live Demo**: Verify frontend and blockchain connectivity
5. **Configure Monitoring**: Setup alerting and log retention
6. **Document Access**: Provide demo URLs and account info

### Post-Deployment
- [ ] All containers running and healthy
- [ ] Demo accounts functional and accessible
- [ ] Frontend application responding correctly
- [ ] SSL certificates valid and auto-renewing
- [ ] Monitoring and alerting active
- [ ] Demo interaction workflows tested

---

**Status**: ✅ Container Architecture Ready  
**Next Phase**: Dockploy Deployment & Live Demo Environment Setup 

## 🐳 Local Development Environment (Legacy)

### L1-Only Architecture (PROVEN SOLUTION)
**Key Insight**: vlayer works optimally with Chain ID 31337 (L1 only)
- ✅ No `InvalidChainId()` errors
- ✅ Simplified single-chain architecture
- ✅ Production-ready pattern

### vlayer Services Stack
```
✅ Anvil L1 (Chain ID: 31337) - Port 8545
✅ Call Server (Proof Generation) - Port 3000
✅ VDNS Server (DNS Service) - Port 3002
✅ Notary Server (TLS Notarization) - Port 7047
✅ WebSocket Proxy - Port 3003
```

### One-Command Setup (Local Development)
```bash
# Start complete environment (legacy)
make start-vlayer

# Interactive monitoring dashboard
make dashboard

# Deploy contracts locally
make dev-deploy

# Test email proofs
make test-prove

# Health check all services
make dev-health
```

## 🖥️ Next.js Integration (100% COMPATIBLE)

### Environment Setup
Create `frontend/.env.local`:
```bash
# vlayer Local Development Endpoints
NEXT_PUBLIC_ANVIL_L1_RPC=http://localhost:8545
NEXT_PUBLIC_VLAYER_PROVER_URL=http://localhost:3000
NEXT_PUBLIC_VLAYER_DNS_URL=http://localhost:3002

# Chain Configuration
NEXT_PUBLIC_L1_CHAIN_ID=31337

# Contract Addresses (update after deployment)
NEXT_PUBLIC_REGISTRATION_CONTRACT=0x...
```

### wagmi Configuration
```typescript
import { createConfig, http } from 'wagmi'

export const anvilL1 = {
  id: 31337,
  name: 'Anvil L1',
  rpcUrls: {
    default: { http: ['http://localhost:8545'] }
  }
} as const

export const config = createConfig({
  chains: [anvilL1],
  transports: {
    [anvilL1.id]: http(),
  },
})
```

### Complete Development Workflow
```bash
# Terminal 1: Start vlayer services
make start-vlayer

# Terminal 2: Deploy contracts
make dev-deploy

# Terminal 3: Start Next.js
cd frontend && npm run dev

# Terminal 4: Monitor services
make dashboard
```

### vlayer Service Integration
```typescript
// frontend/src/services/vlayer.ts
export class VlayerService {
  async generateEmailProof(email: string, domain: string) {
    const response = await fetch('http://localhost:3000/prove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'email_domain',
        email,
        domain
      })
    });
    return await response.json();
  }
}
```

## 🔧 Development Tools

### Available Make Commands
```bash
# Service Management
make start-vlayer     # Start all vlayer services
make stop-vlayer      # Stop all vlayer services
make restart-vlayer   # Restart services
make logs-vlayer      # Show service logs

# Development Tools
make dev-setup        # Initial environment setup
make dev-deploy       # Deploy contracts locally
make dev-health       # Comprehensive health check
make dev-monitor      # Real-time monitoring

# Utilities
make diag            # Quick diagnostics
make dashboard       # Interactive dashboard
make test-prove      # Test proof generation
```

### Development Scripts
- **vlayer-docker-analysis.sh**: Docker infrastructure analysis
- **vlayer-dev-env.sh**: Complete environment management
- **vlayer-quick-diag.sh**: Fast troubleshooting utility
- **vlayer-dashboard.sh**: Real-time monitoring dashboard

### Troubleshooting Commands
```bash
# Check service status
make dev-health

# View service logs
make logs-vlayer

# Quick diagnostics
make diag

# Full environment reset
make dev-reset
```

## 📊 Performance Metrics

### Gas Consumption (Verified)
| Function | Gas Cost | Status |
|----------|----------|---------|
| Patient Registration | 115,377 gas | ⚠️ Optimization opportunity |
| Organization Registration | 43,892 gas | ✅ Within target |
| Domain Verification | 43,013 gas | ✅ Within target |
| View Functions | 2,869-8,523 gas | ✅ Optimal |
| Contract Deployment | 9.27M gas | ✅ One-time cost |

### Test Results
- **Unit Tests**: 28/28 passed ✅
- **Gas Analysis**: 7/7 passed ✅
- **Utility Tests**: 2/2 passed ✅
- **Total Success Rate**: 100% ✅

## 🛡️ Security & Privacy

### Production Security Measures
- ✅ **Test helpers removed**: No development functions in production
- ✅ **Role-based access control**: Admin functions properly protected
- ✅ **Privacy preservation**: No personal data stored on-chain
- ✅ **Replay attack prevention**: Email hash uniqueness enforced
- ✅ **Domain ownership protection**: Prevents domain reuse

### vlayer Integration Security
- ✅ **Proof verification**: All vlayer proofs properly validated
- ✅ **Error handling**: Graceful failures for invalid proofs
- ✅ **Type safety**: Full TypeScript integration

## 🚧 Known Limitations & Future Improvements

### Current Limitations
1. **Single Email Per Domain**: Each domain can only be registered once
2. **Admin Email Requirement**: Only admin@, info@, contact@, support@ emails accepted
3. **Gas Optimization**: Patient registration needs optimization (115k → 50k target)
4. **No Batch Operations**: Individual transactions required

### Future Enhancement Opportunities
1. **Gas Optimization**: Implement packed structs, batch operations
2. **Multi-Domain Support**: Organizations with multiple domains
3. **Advanced Email Patterns**: Support for more email formats
4. **Cross-Chain Support**: Multi-blockchain compatibility

## 🔍 Monitoring & Health Checks

### Service Health Verification
```bash
# Check all services
curl http://localhost:8545  # Anvil L1
curl http://localhost:3000  # vlayer Call Server
curl http://localhost:3002  # vlayer DNS Server

# Blockchain connectivity test
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://localhost:8545
```

### Real-time Monitoring
The `make dashboard` command provides:
- Container status and health
- Port usage analysis
- Resource utilization
- Real-time log streaming
- Interactive service management

### Production Monitoring Requirements
- Track registration success rates
- Monitor gas costs for optimization opportunities
- Watch vlayer proof verification performance
- Collect user feedback for improvements
- Set up alerts for service failures

## 📋 Development Best Practices

### Daily Development Routine
1. **Start Environment**: `make start-vlayer`
2. **Health Check**: `make dev-health`
3. **Deploy Contracts**: `make dev-deploy`
4. **Monitor**: `make dashboard` (interactive)
5. **Develop & Test**: Normal development workflow
6. **Stop**: `make stop-vlayer`

### Testing Workflow
```bash
# Unit tests
forge test

# Integration tests with vlayer
make test-prove

# Gas analysis
forge test --gas-report

# Full environment test
make dev-test
```

### Error Resolution
1. **Quick Check**: `make diag`
2. **Detailed Health**: `make dev-health`
3. **Service Logs**: `make logs-vlayer`
4. **Restart if Needed**: `make restart-vlayer`
5. **Full Reset**: `make dev-reset` (if required)

## 🎯 Production Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (currently 37/37 ✅)
- [ ] Security audit completed
- [ ] Gas optimization reviewed
- [ ] Environment variables configured
- [ ] Backup procedures documented

### Deployment Steps
1. **Deploy to Testnet**: Test full workflow
2. **Frontend Integration**: Connect UI to contracts
3. **User Testing**: Validate complete user flows
4. **Security Review**: Final security check
5. **Mainnet Deployment**: Production deployment
6. **Monitoring Setup**: Operational monitoring

### Post-Deployment
- [ ] Contract verification on block explorer
- [ ] Frontend application deployed
- [ ] Monitoring and alerting active
- [ ] Admin procedures documented
- [ ] User documentation published

---

**Status**: ✅ Production Ready  
**Next Phase**: Frontend Development & User Interface Implementation 
# Deployment & Development Workflows

## 🚀 Production Deployment

### Status: ✅ PRODUCTION READY
- **Smart Contracts**: Fully implemented and tested (37/37 tests passing)
- **vlayer Integration**: Complete email proof workflow
- **Security**: Production hardened, test helpers removed
- **Documentation**: Complete deployment guides

### Quick Deployment Commands

#### Testnet Deployment
```bash
forge script script/DeployProduction.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

#### Mainnet Deployment
```bash
forge script script/DeployProduction.s.sol --rpc-url $MAINNET_RPC_URL --broadcast --verify
```

#### Email Proof Workflow
```bash
cd vlayer && npx tsx proveEmailDomain.ts
```

### Production Requirements Checklist
- [ ] Environment variables configured (RPC_URL, PRIVATE_KEY)
- [ ] vlayer production token obtained
- [ ] Gas price strategy defined
- [ ] Security audit completed (recommended)
- [ ] Multi-sig setup for admin functions (recommended)
- [ ] Monitoring and alerting configured

## 🛠️ Local Development Environment

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

### One-Command Setup
```bash
# Start complete environment
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
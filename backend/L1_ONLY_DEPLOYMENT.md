# zkMed L1-Only Deployment Guide

## ✅ SOLUTION: Deploy Only to L1 (Chain ID 31337)

Based on investigation of the `InvalidChainId()` error, **vlayer's development infrastructure is optimized for chain ID 31337** (Anvil L1). The L2 chain (31338) is not required for zkMed functionality.

## 🚀 Simplified Deployment Workflow

### 1. Start L1-Only Services
```bash
cd backend/vlayer
docker compose -f docker-compose.devnet.yaml up -d

# Verify only L1 is needed
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://localhost:8545
# Should return: {"jsonrpc":"2.0","id":1,"result":"0x7a69"} (31337)
```

### 2. Deploy Contracts to L1 Only
```bash
cd backend

# Deploy to Anvil L1 (31337) - This works!
forge script script/DeployLocal.s.sol \
  --rpc-url http://localhost:8545 \
  --broadcast \
  --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### 3. Test Email Proof Generation (L1)
```bash
cd vlayer

# This will work on L1 (31337)
npx tsx proveEmailDomain.ts
```

## 🔧 Configuration Changes Required

### Update Environment Variables
```bash
# Focus on L1 only
CHAIN_ID=31337
JSON_RPC_URL=http://127.0.0.1:8545
PROVER_URL=http://127.0.0.1:3000
```

### Remove L2 References
- Remove L2 deployment scripts
- Update documentation to focus on L1
- Simplify Next.js configuration to single chain

## ✅ Benefits of L1-Only Approach

1. **No `InvalidChainId()` errors** - vlayer infrastructure fully supports 31337
2. **Simplified architecture** - Single chain reduces complexity
3. **Faster development** - No need to manage L2 state
4. **Production-ready** - Same pattern works for mainnet deployment

## 🎯 Production Deployment

For production, replace Anvil L1 with real networks:
- **Ethereum Mainnet** (Chain ID: 1)
- **Arbitrum** (Chain ID: 42161)  
- **Polygon** (Chain ID: 137)
- **Sepolia Testnet** (Chain ID: 11155111)

vlayer supports these production networks without the chain ID restrictions seen in development.

## 📊 Verification

### Test Commands
```bash
# 1. Check L1 is working
make dev-health

# 2. Deploy contracts
make dev-deploy

# 3. Test proofs
make test-prove

# 4. Run full test suite
forge test
```

### Expected Results
- ✅ Contract deployment succeeds on L1
- ✅ Email proof generation works
- ✅ No `InvalidChainId()` errors
- ✅ All zkMed functionality operational

---

**Conclusion**: The L2 chain was causing unnecessary complexity. zkMed works perfectly on L1 alone, both for development and production deployment.

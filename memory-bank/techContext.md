# zkMed Technical Context - Comprehensive Healthcare Technology Stack with Merchant Moe Liquidity Book

**Purpose**: Advanced technical overview of zkMed's revolutionary healthcare platform with yield-generating Merchant Moe Liquidity Book pools, comprehensive vlayer MailProof verification, multi-role user management, and Context7-enhanced development workflows.

---

## 🛠️ Core Technology Stack

### Blockchain Infrastructure
- **Primary Chain**: Mantle Network (Ethereum L2)
- **Chain ID**: 31339 (Local Fork) / 5000 (Mainnet)
- **Native Currency**: Mantle USD (mUSD) for all healthcare transactions
- **Consensus**: Optimistic rollup with fast finality
- **Gas Optimization**: Native Layer 2 benefits for reduced transaction costs

### Smart Contract Development
- **Framework**: Foundry (Solidity development, testing, deployment)
- **Language**: Solidity ^0.8.20 with latest features
- **Testing**: Forge with 100% test coverage requirement
- **Deployment**: Automated scripts with contract verification
- **Standards**: OpenZeppelin contracts for security and standards compliance

### Privacy & Proof Technology
- **vlayer Integration**: Advanced MailProof verification and domain authentication
  - **MailProofs**: DKIM-signed email verification for payment authorization
  - **Domain Verification**: Cryptographic proof of organizational email control
  - **Email Infrastructure**: Complete audit trail generation with privacy preservation
- **Commitment Schemes**: Cryptographic patient identity protection
- **PRE Encryption**: Controlled post-approval medical data access
- **Zero-Knowledge Architecture**: Complete medical privacy preservation

### DeFi Integration - Merchant Moe Liquidity Book Healthcare Pools
- **Merchant Moe Liquidity Book Protocol**: Advanced liquidity book system with custom hooks
  - **Healthcare Pools**: Specialized mUSD/USDC pools with discretized liquidity bins
  - **Custom Hooks**: Healthcare-specific beforeSwap, afterSwap, beforeMint, and afterMint implementations
  - **Yield Generation**: Trading fees and incentives for yield generation
  - **Instant Liquidity**: Proven mechanisms for immediate claim payouts
  - **Risk Management**: Battle-tested Liquidity Book protocols with custom healthcare validation
- **Pool Management**: Automated rebalancing and yield distribution
- **Hook Architecture**: Custom healthcare logic integrated into liquidity operations

### User Experience & Authentication
- **thirdweb SDK**: Comprehensive Web3 authentication and interaction
  - **Smart Accounts**: Abstract account management for seamless UX
  - **Gas Sponsorship**: Sponsored transactions for healthcare interactions
  - **Social Login**: Familiar authentication methods for user onboarding
  - **Mobile Support**: Full mobile compatibility with responsive design
- **Wallet Integration**: Support for all major wallet providers
- **Session Management**: Persistent authentication across interactions

---

## 📋 Context7 Integration for Enhanced Development

### Context7 MCP Server Configuration
**Revolutionary Development Environment**: Context7 integration provides real-time access to up-to-date library documentation, enabling rapid development of complex healthcare platform features.

#### Production Configuration
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "DEFAULT_MINIMUM_TOKENS": "10000",
        "CONTEXT7_CACHE_TTL": "3600"
      }
    }
  }
}
```

#### Alternative Configuration Options
```json
// High-performance bunx configuration
{
  "mcpServers": {
    "context7": {
      "command": "bunx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "DEFAULT_MINIMUM_TOKENS": "12000"
      },
      "timeout": 45000
    }
  }
}

// Remote Context7 server for production environments
{
  "mcpServers": {
    "context7": {
      "type": "streamable-http",
      "url": "https://mcp.context7.com/mcp",
      "headers": {
        "Authorization": "Bearer ${CONTEXT7_API_KEY}",
        "X-Context7-Project": "zkMed-Healthcare"
      }
    }
  }
}

// Local Context7 server for air-gapped development
{
  "mcpServers": {
    "context7": {
      "command": "node",
      "args": ["./local-context7-server.js"],
      "env": {
        "CONTEXT7_LOCAL_MODE": "true"
      }
    }
  }
}
```

#### Context7 Healthcare Development Workflows

**Merchant Moe Liquidity Book Integration Development**:
```bash
# Get latest LB hook development patterns
use context7: "Implement Merchant Moe Liquidity Book custom hooks for healthcare payment automation with beforeSwap validation"

# Advanced pool management strategies
use context7: "Create Merchant Moe Liquidity Book pool manager with custom healthcare logic and yield distribution"

# Gas optimization for healthcare transactions
use context7: "Optimize Merchant Moe Liquidity Book healthcare hook gas usage with efficient validation patterns"
```

**vlayer MailProof Integration**:
```bash
# DKIM signature verification in Solidity
use context7: "Integrate vlayer MailProofs for DKIM email verification in healthcare smart contracts"

# Domain ownership validation patterns
use context7: "Implement secure domain verification using vlayer MailProofs for hospital registration"

# Email-based payment authorization
use context7: "Extract payment instructions from DKIM-signed emails using vlayer verification"
```

**Next.js Healthcare Platform Development**:
```bash
# Server actions for blockchain interaction
use context7: "Create Next.js 15 server actions for Merchant Moe Liquidity Book pool management and MailProof verification"

# Real-time healthcare dashboards
use context7: "Build real-time multi-role healthcare dashboard with pool monitoring and claim tracking"

# thirdweb authentication integration
use context7: "Implement role-based authentication system with thirdweb and healthcare permissions"
```

**Container and Infrastructure**:
```bash
# Complex healthcare platform deployment
use context7: "Docker compose setup for healthcare platform with Merchant Moe Liquidity Book, vlayer, and multi-service architecture"

# Healthcare-specific monitoring
use context7: "Implement comprehensive monitoring for healthcare DeFi platform with custom alerts"

# Security patterns for medical data
use context7: "Healthcare blockchain security patterns with privacy-preserving MailProof verification"
```

#### Context7 Development Benefits
- **Real-Time Documentation**: Always current information on rapidly evolving DeFi and Web3 technologies
- **Best Practice Integration**: Latest patterns and recommendations for secure healthcare development
- **Rapid Prototyping**: Accelerated development with proven code patterns and implementations
- **Security Enhancement**: Current security practices and vulnerability prevention strategies
- **Performance Optimization**: Latest optimization techniques for gas efficiency and user experience
- **Healthcare Specialization**: Domain-specific patterns for medical privacy and compliance

---

## 🏗️ Development Environment & Tools

### Local Development Setup
- **Mantle Fork Environment**: Chain ID 31339 with real mainnet state
- **Merchant Moe Liquidity Book Contracts**: Full protocol access for pool testing and hook development
- **vlayer Services**: Complete MailProof generation and verification stack
- **Docker Containers**: Consistent development environment across teams
- **Hot Reloading**: Instant feedback during smart contract development
- **Context7 Integration**: Real-time documentation access for enhanced development velocity

### Enhanced Development Workflow
```bash
# Environment Setup with Context7
make dev-setup          # Initialize complete development environment with Context7
make start-mantle-fork  # Launch persistent Mantle fork with demo data
make deploy-contracts   # Deploy all contracts with demo configuration
make setup-lb-pools     # Initialize Merchant Moe Liquidity Book pools with custom healthcare hooks
make start-frontend     # Launch Next.js with multi-role dashboard
make test-integration   # Run comprehensive integration tests
make test-mailproof     # Test MailProof verification workflows
make context7-docs      # Access real-time documentation for development
```

### Testing Infrastructure
- **Unit Testing**: Individual contract testing with Forge
- **Integration Testing**: Multi-contract interaction validation
- **End-to-End Testing**: Complete user flow testing including MailProof workflows
- **Hook Testing**: Specialized testing for Merchant Moe Liquidity Book custom hook implementations
- **Performance Testing**: Gas optimization and transaction throughput validation
- **Security Testing**: Vulnerability scanning and audit preparation
- **MailProof Testing**: DKIM verification and domain authentication testing
- **Pool Testing**: Merchant Moe Liquidity Book pool operations and yield distribution validation

### Production Infrastructure
```yaml
# docker-compose.production.yml
version: '3.8'
services:
  zkmed-platform:
    build: ./srcs
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MANTLE_NETWORK_URL=${MANTLE_MAINNET_URL}
      - MERCHANT_MOE_LB_FACTORY=${LB_FACTORY_ADDRESS}
      - VLAYER_MAILPROOF_API=${VLAYER_PRODUCTION_API}
      - REDIS_URL=${REDIS_CONNECTION_STRING}

  merchant-moe-environment:
    image: merchant-moe/liquidity-book:latest
    environment:
      - LB_FACTORY_ADDRESS=${LB_FACTORY_ADDRESS}
      - LB_ROUTER_ADDRESS=${LB_ROUTER_ADDRESS}

  mantle-node:
    image: mantlenetworkio/mantle:latest
    ports:
      - "8545:8545"
    environment:
      - NETWORK=mainnet
      - CHAIN_ID=5000

  vlayer-services:
    image: vlayer/mailproof:latest
    environment:
      - VLAYER_API_KEY=${VLAYER_API_KEY}
      - VLAYER_ENDPOINT=${VLAYER_PRODUCTION_ENDPOINT}
    
  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=zkmed
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  redis-data:
  postgres-data:
```

### Environment Variables
```bash
# Blockchain Configuration
MANTLE_NETWORK_URL=https://rpc.mantle.xyz
MANTLE_CHAIN_ID=5000
NEXT_PUBLIC_MANTLE_CHAIN_ID=5000

# Merchant Moe Liquidity Book Configuration
LB_FACTORY_ADDRESS=0xa6630671775c4EA2743840F9A5016dCf2A104054
LB_ROUTER_ADDRESS=0x013e138EF6008ae5FDFDE29700e3f2Bc61d21E3a
LB_QUOTER_ADDRESS=0x501b8AFd35df20f531fF45F6f695793AC3316c85
NEXT_PUBLIC_MERCHANT_MOE_LB_ENABLED=true

# vlayer MailProof Configuration
VLAYER_MAILPROOF_ENDPOINT=https://api.vlayer.xyz
VLAYER_API_KEY=${VLAYER_PRODUCTION_KEY}
NEXT_PUBLIC_VLAYER_ENABLED=true

# thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=${THIRDWEB_CLIENT_ID}
THIRDWEB_SECRET_KEY=${THIRDWEB_SECRET}
NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN=${DOMAIN}

# Database Configuration
DATABASE_URL=postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/zkmed
REDIS_URL=redis://redis:6379

# Security Configuration
NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
NEXTAUTH_URL=${PRODUCTION_URL}

# Monitoring Configuration
SENTRY_DSN=${SENTRY_DSN}
ANALYTICS_ID=${ANALYTICS_ID}
```

### Smart Contract Deployment Configuration
```javascript
// hardhat.config.js
module.exports = {
  networks: {
    mantle: {
      url: process.env.MANTLE_NETWORK_URL,
      chainId: 5000,
      accounts: [process.env.PRIVATE_KEY]
    },
    mantleTestnet: {
      url: process.env.MANTLE_TESTNET_URL,
      chainId: 5001,
      accounts: [process.env.TESTNET_PRIVATE_KEY]
    },
    local: {
      url: "http://localhost:8545",
      chainId: 31339,
      accounts: [process.env.LOCAL_PRIVATE_KEY]
    }
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
```

---

## 🔒 Security & Compliance Framework

### Healthcare-Specific Security Patterns
- **Medical Privacy Protection**: Complete MailProof verification without exposing medical data
- **GDPR Compliance**: Privacy-by-design architecture with minimal data collection
- **HIPAA Readiness**: Audit trail generation and access control frameworks
- **Multi-Signature Administration**: All critical functions require multiple signatures
- **MailProof Replay Prevention**: Email hash tracking prevents duplicate submissions
- **Custom Hook Validation**: Comprehensive authorization checks in Merchant Moe Liquidity Book operations
- **Emergency Controls**: Circuit breakers for critical system functions
- **Complete Audit Trail**: Full verification history for regulatory compliance

### Advanced Security Configurations
```solidity
// Security configuration for healthcare contracts
contract HealthcareSecurity {
    // Multi-signature requirement for critical operations
    modifier requireMultiSig() {
        require(
            adminSignatures[msg.sender] >= REQUIRED_SIGNATURES,
            "Insufficient signatures"
        );
        _;
    }
    
    // Rate limiting for MailProof submissions
    modifier rateLimited(address user) {
        require(
            block.timestamp >= lastSubmission[user] + RATE_LIMIT_PERIOD,
            "Rate limit exceeded"
        );
        lastSubmission[user] = block.timestamp;
        _;
    }
    
    // Emergency pause functionality
    modifier whenNotPaused() {
        require(!paused, "System paused");
        _;
    }
}
```

---

## 📊 Monitoring & Analytics

### Comprehensive Platform Monitoring
- **Real-Time Pool Monitoring**: Live tracking of Merchant Moe Liquidity Book pool performance
- **MailProof Analytics**: Verification success rates and processing times
- **User Behavior Tracking**: Registration patterns and user engagement metrics
- **Security Event Monitoring**: Real-time alerts for suspicious activities
- **Performance Metrics**: Transaction throughput and system response times
- **Financial Analytics**: Yield distribution and cost efficiency tracking

### Enhanced Analytics Configuration
```javascript
// Analytics tracking for healthcare platform
const healthcareAnalytics = {
  // Pool performance tracking
  trackPoolMetrics: async (poolId) => {
    const metrics = await getLBPoolMetrics(poolId);
    await analytics.track('pool_performance', {
      poolId,
      totalLiquidity: metrics.totalLiquidity,
      yieldGenerated: metrics.yieldGenerated,
      claimsProcessed: metrics.claimsProcessed
    });
  },
  
  // MailProof verification tracking
  trackMailProofVerification: async (verificationId, success) => {
    await analytics.track('mailproof_verification', {
      verificationId,
      success,
      processingTime: Date.now() - verificationStartTime,
      verificationMethod: 'dkim_signature'
    });
  },
  
  // User onboarding analytics
  trackUserRegistration: async (userType, registrationMethod) => {
    await analytics.track('user_registration', {
      userType, // patient, hospital, insurer, admin
      registrationMethod, // thirdweb, mailproof
      timestamp: Date.now()
    });
  }
};
```

---

## 🚀 Deployment & Production Strategy

### Production Deployment Requirements
- **Healthcare Contract Deployment**: Automated smart contract deployment with verification
- **Merchant Moe Liquidity Book Pool Management**: Custom hook integration and pool initialization
- **vlayer MailProof Services**: DKIM verification and domain authentication
- **Multi-Role Frontend**: Specialized interfaces for all user types
- **Comprehensive Monitoring**: Health checks and performance tracking
- **Security Hardening**: Production security configurations and access controls

### Deployment Checklist
- [ ] **Smart Contract Verification**: All contracts verified on Mantlescan
- [ ] **Merchant Moe Liquidity Book Pool Testing**: Custom hooks validated and deployed
- [ ] **MailProof Integration**: vlayer services configured and tested
- [ ] **Frontend Deployment**: Multi-role interfaces deployed with SSL
- [ ] **Database Migration**: User data and analytics infrastructure ready
- [ ] **Monitoring Setup**: Comprehensive observability and alerting configured
- [ ] **Security Audit**: Third-party security review completed
- [ ] **Load Testing**: Performance validation under expected load
- [ ] **Backup Strategy**: Data backup and recovery procedures tested
- [ ] **Documentation**: Technical and user documentation complete

**zkMed's technical architecture represents the first comprehensive implementation of yield-generating healthcare insurance through Merchant Moe Liquidity Book integration, delivering enterprise-grade security, compliance, and performance while maintaining the flexibility for rapid feature development through Context7 integration.** 🚀 
# zkMed Technical Context - Advanced Healthcare Technology Stack

**Purpose**: Comprehensive technical overview of zkMed's revolutionary pool-enabled healthcare platform, including all technologies, development setup, constraints, and integration patterns.

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
- **vlayer Integration**: Advanced email and web proof generation
  - **MailProofs**: Domain verification for healthcare organizations
  - **WebProofs**: Patient portal and hospital system validation
  - **ZK Proofs**: Privacy-preserving medical procedure validation
- **Commitment Schemes**: Cryptographic patient identity protection
- **PRE Encryption**: Controlled post-approval medical data access
- **Zero-Knowledge Architecture**: Complete medical privacy preservation

### DeFi Integration
- **Aave V3 Protocol**: Battle-tested lending pools for yield generation
  - **Healthcare Pools**: Dedicated pools for patient premiums and insurer funds
  - **Yield Generation**: 3-5% APY on idle healthcare funds
  - **Instant Liquidity**: Proven mechanisms for immediate claim payouts
  - **Risk Management**: Aave's established risk parameters and insurance
- **Multi-Asset Support**: mUSD primary with expansion capability
- **Pool Management**: Automated rebalancing and optimization

### User Experience & Authentication
- **thirdweb SDK**: Comprehensive Web3 authentication and interaction
  - **Smart Accounts**: Abstract account management for seamless UX
  - **Gas Sponsorship**: Sponsored transactions for healthcare interactions
  - **Social Login**: Familiar authentication methods for user onboarding
  - **Mobile Support**: Full mobile compatibility with responsive design
- **Wallet Integration**: Support for all major wallet providers
- **Session Management**: Persistent authentication across interactions

---

## 🏗️ Development Environment & Tools

### Local Development Setup
- **Mantle Fork Environment**: Chain ID 31339 with real mainnet state
- **Aave V3 Contracts**: Full protocol access for pool testing
- **vlayer Services**: Complete proof generation and verification stack
- **Docker Containers**: Consistent development environment across teams
- **Hot Reloading**: Instant feedback during smart contract development

### Development Workflow
```bash
# Environment Setup
make dev-setup          # Initialize complete development environment
make start-mantle-fork  # Launch persistent Mantle fork with demo data
make deploy-contracts   # Deploy all contracts with demo configuration
make start-frontend     # Launch Next.js with pool dashboard
make test-integration   # Run comprehensive integration tests
```

### Testing Infrastructure
- **Unit Testing**: Individual contract function testing
- **Integration Testing**: Cross-contract interaction validation
- **E2E Testing**: Complete user workflow testing
- **Gas Analysis**: Optimization and cost tracking
- **Security Testing**: Vulnerability scanning and audit preparation

### Container Architecture
```yaml
# Development Stack
services:
  mantle-fork:
    image: ghcr.io/foundry-rs/foundry:latest
    command: anvil --fork-url https://rpc.mantle.xyz --chain-id 31339
    ports: ["8545:8545"]
    
  vlayer-services:
    image: vlayer/dev-stack:latest
    ports: ["3000:3000", "3002:3002", "7047:7047"]
    
  redis-cache:
    image: redis:alpine
    ports: ["6379:6379"]
    
  frontend:
    build: ./packages/nextjs
    ports: ["3001:3000"]
    environment:
      - NEXT_PUBLIC_RPC_URL=http://mantle-fork:8545
```

---

## 🔐 Security Architecture & Patterns

### Smart Contract Security
- **Access Control**: Role-based permissions with multi-signature requirements
- **Reentrancy Protection**: Comprehensive guards against attack vectors
- **Input Validation**: Strict validation of all user inputs and external data
- **Emergency Pauses**: Circuit breakers for critical system functions
- **Upgrade Patterns**: Secure proxy patterns for future improvements

### Privacy Preservation Patterns
```solidity
// Patient Commitment Pattern
bytes32 commitment = keccak256(abi.encodePacked(secret, patientAddress));

// Zero-Knowledge Validation Pattern
function validateWithoutExposure(bytes zkProof, bytes32 procedureHash) external {
    require(vlayerVerifier.verifyProof(zkProof, procedureHash), "Invalid proof");
    // Medical data never exposed, only validity confirmed
}

// Encrypted Storage Pattern
struct EncryptedEHR {
    string ipfsCID;     // Encrypted file reference
    bytes preKey;       // PRE key for controlled access
    bytes32 hash;       // Integrity verification
}
```

### Container Security
- **Image Scanning**: Automated vulnerability detection in container images
- **Minimal Images**: Alpine-based containers with only required dependencies
- **Non-Root Users**: All containers run with unprivileged user accounts
- **Network Isolation**: Service-specific networks with controlled communication
- **Secret Management**: Encrypted storage of sensitive configuration data

---

## 💰 Aave V3 Integration Architecture

### Pool Management Patterns
```solidity
interface IPoolingContract {
    // Core pool operations
    function depositToHealthcarePool(address patient, uint256 amount) external;
    function authorizeClaimPayout(uint256 claimId, address hospital, uint256 amount) external;
    function calculateAccruedYield(address stakeholder) external view returns (uint256);
    function distributeYield() external;
    
    // Pool state management
    function getPoolBalance(address stakeholder) external view returns (uint256);
    function getYieldEarned(address stakeholder) external view returns (uint256);
    function validatePoolLiquidity(uint256 requestedAmount) external view returns (bool);
}
```

### Yield Distribution Architecture
```solidity
struct YieldDistribution {
    uint256 totalYield;
    uint256 patientShare;    // 60% of yield
    uint256 insurerShare;    // 20% of yield
    uint256 protocolShare;   // 20% of yield
    uint256 distributionTime;
}

function automatedYieldDistribution() external {
    uint256 totalYield = aavePool.getReservesData(mUSD).liquidityIndex;
    distributeProportionally(totalYield);
    emit YieldDistributed(totalYield, block.timestamp);
}
```

### Pool Safety Mechanisms
- **Liquidity Buffers**: Minimum reserves for emergency withdrawals
- **Gradual Withdrawal Limits**: Rate limiting for large withdrawals
- **Pool Health Monitoring**: Continuous monitoring of utilization rates
- **Emergency Shutdown**: Ability to pause operations during market stress

---

## 🌐 Frontend Technology Stack

### Next.js 15 Architecture
- **App Router**: Modern routing with server-side rendering
- **React Server Components**: Optimal performance with minimal client JavaScript
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling with responsive design
- **Responsive Design**: Mobile-first approach with desktop optimization

### Web3 Integration
```typescript
// thirdweb Configuration
import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

const mantleChain = defineChain({
  id: 31339,
  rpc: "http://localhost:8545",
  nativeCurrency: { name: "Mantle", symbol: "MNT", decimals: 18 },
});

// Contract Integration
const registrationContract = getContract({
  client,
  chain: mantleChain,
  address: process.env.NEXT_PUBLIC_REGISTRATION_CONTRACT,
});
```

### Pool Dashboard Components
- **Real-time Yield Tracking**: Live updates of pool performance and yields
- **Insurance Selection Interface**: Comparison of insurers by pool metrics
- **Automated Payment Management**: Setup and monitoring of monthly premiums
- **Claims Status Tracking**: Multi-proof validation progress and payouts
- **Privacy-Preserving Analytics**: Pool insights without personal data exposure

### State Management
- **React Query**: Server state management with automatic caching
- **Zustand**: Client state management for UI interactions
- **Local Storage**: Persistent user preferences and session data
- **Real-time Updates**: WebSocket connections for live pool data

---

## 🐳 Production Deployment Architecture

### Container Orchestration (Dockploy)
```yaml
# Production Container Stack
version: '3.8'
services:
  mantle-fork:
    image: zkmed/mantle-fork:latest
    restart: always
    ports: ["8545:8545"]
    volumes:
      - blockchain_data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8545"]
      interval: 30s
      timeout: 10s
      retries: 3

  contract-deployer:
    image: zkmed/deployer:latest
    restart: "no"
    depends_on:
      - mantle-fork
    environment:
      - RPC_URL=http://mantle-fork:8545
      - PRIVATE_KEY=${DEPLOYER_PRIVATE_KEY}

  frontend:
    image: zkmed/frontend:latest
    restart: always
    ports: ["3000:3000"]
    environment:
      - NEXT_PUBLIC_RPC_URL=http://mantle-fork:8545
      - NEXT_PUBLIC_CHAIN_ID=31339
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]

  nginx-proxy:
    image: nginx:alpine
    restart: always
    ports: ["80:80", "443:443"]
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ssl_certs:/etc/ssl/certs
```

### Infrastructure Requirements
- **CPU**: Minimum 4 cores for production workload
- **Memory**: 8GB RAM for all services
- **Storage**: 100GB SSD for blockchain data and logs
- **Network**: Stable internet with 100Mbps bandwidth
- **SSL**: Automatic certificate management via Let's Encrypt

### Monitoring & Observability
- **Health Checks**: Automated monitoring of all service endpoints
- **Logging**: Centralized log aggregation and analysis
- **Metrics**: Real-time performance monitoring and alerting
- **Backup**: Automated snapshots of blockchain state and configuration
- **Disaster Recovery**: Documented procedures for service restoration

---

## 🔧 Development Constraints & Considerations

### Technical Constraints
- **Gas Limits**: Optimized contract design for Mantle network limits
- **Oracle Dependencies**: Eliminated through native mUSD integration
- **Scalability**: Container architecture designed for horizontal scaling
- **Privacy Requirements**: Zero medical data on-chain compliance
- **Regulatory Compliance**: GDPR/HIPAA-ready architecture patterns

### Performance Requirements
- **Transaction Speed**: Sub-second confirmation times on Mantle L2
- **Pool Updates**: Real-time yield calculations and distribution
- **UI Responsiveness**: <200ms response times for all interactions
- **Container Startup**: <30 seconds for full stack initialization
- **Error Recovery**: Automatic restart and state restoration capabilities

### Security Requirements
- **Multi-Signature**: All administrative functions require multiple signatures
- **Audit Trail**: Complete logging of all system interactions
- **Privacy Preservation**: Medical data never stored or transmitted unencrypted
- **Access Control**: Granular permissions with regular access reviews
- **Vulnerability Management**: Regular security updates and patch management

---

## 📚 Dependencies & Integration Points

### Core Dependencies
```json
{
  "smart-contracts": {
    "@openzeppelin/contracts": "^5.0.0",
    "@aave/core-v3": "^1.19.0",
    "vlayer": "^0.1.0",
    "forge-std": "^1.7.0"
  },
  "frontend": {
    "next": "^15.0.0",
    "react": "^18.2.0",
    "thirdweb": "^5.0.0",
    "@tanstack/react-query": "^5.0.0",
    "wagmi": "^2.0.0",
    "zustand": "^4.4.0"
  },
  "infrastructure": {
    "docker": "^24.0.0",
    "nginx": "^1.25.0",
    "redis": "^7.2.0"
  }
}
```

### External Service Integration
- **vlayer Network**: Proof generation and verification services
- **Aave V3 Protocol**: Lending pool integration for yield generation
- **IPFS/Web3.Storage**: Decentralized storage for encrypted medical records
- **Mantle RPC**: Blockchain interaction and state queries
- **thirdweb Infrastructure**: Gas sponsorship and wallet management

### API Integration Points
```typescript
// External Service APIs
interface ExternalAPIs {
  vlayer: {
    proveEmail: (email: UnverifiedEmail) => Promise<Proof>;
    verifyProof: (proof: Proof) => Promise<boolean>;
  };
  aave: {
    supply: (asset: string, amount: bigint) => Promise<TxHash>;
    withdraw: (asset: string, amount: bigint) => Promise<TxHash>;
    getAPY: (asset: string) => Promise<number>;
  };
  thirdweb: {
    sponsorTransaction: (tx: Transaction) => Promise<SponsoredTx>;
    createSmartAccount: (owner: string) => Promise<SmartAccount>;
  };
}
```

---

## 🎯 Technical Success Metrics

### Performance Benchmarks
- **Contract Deployment**: <30 seconds on Mantle network
- **Pool Operations**: <5 seconds for deposits and withdrawals
- **Proof Generation**: <10 seconds for multi-proof validation
- **Frontend Loading**: <3 seconds for initial page load
- **Real-time Updates**: <1 second latency for pool data updates

### Reliability Targets
- **System Uptime**: 99.9% availability target
- **Container Health**: Automatic restart within 30 seconds
- **Data Persistence**: Zero data loss across service restarts
- **Error Handling**: Graceful degradation for all failure scenarios
- **Recovery Time**: <5 minutes for full system restoration

### Security Validation
- **Audit Completion**: Full security audit before mainnet deployment
- **Penetration Testing**: Regular testing of all system components
- **Vulnerability Scanning**: Automated scanning of container images
- **Access Review**: Monthly review of all system permissions
- **Incident Response**: Documented procedures for security incidents

**zkMed's technical architecture represents a cutting-edge integration of privacy-preserving technologies, DeFi protocols, and modern container infrastructure, delivering unprecedented healthcare innovation while maintaining enterprise-grade security and reliability.** 🚀 
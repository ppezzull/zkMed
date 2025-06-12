# zkMed Technical Context - Comprehensive Healthcare Technology Stack with Uniswap v4

**Purpose**: Advanced technical overview of zkMed's revolutionary healthcare platform with yield-generating Uniswap v4 pools, comprehensive vlayer MailProof verification, multi-role user management, and Context7-enhanced development workflows.

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

### DeFi Integration - Uniswap v4 Healthcare Pools
- **Uniswap v4 Protocol**: Advanced automated market maker with custom hooks
  - **Healthcare Pools**: Specialized mUSD/USDC pools with custom logic
  - **Custom Hooks**: Healthcare-specific beforeSwap and afterSwap implementations
  - **Yield Generation**: Trading fees and incentives for yield generation
  - **Instant Liquidity**: Proven mechanisms for immediate claim payouts
  - **Risk Management**: Battle-tested AMM protocols with custom healthcare validation
- **Pool Management**: Automated rebalancing and yield distribution
- **Hook Architecture**: Custom healthcare logic integrated into swap operations

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

**Uniswap v4 Integration Development**:
```bash
# Get latest Uniswap v4 hook development patterns
use context7: "Implement Uniswap v4 custom hooks for healthcare payment automation with beforeSwap validation"

# Advanced pool management strategies
use context7: "Create Uniswap v4 pool manager with custom healthcare logic and yield distribution"

# Gas optimization for healthcare transactions
use context7: "Optimize Uniswap v4 healthcare hook gas usage with efficient validation patterns"
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
use context7: "Create Next.js 15 server actions for Uniswap v4 pool management and MailProof verification"

# Real-time healthcare dashboards
use context7: "Build real-time multi-role healthcare dashboard with pool monitoring and claim tracking"

# thirdweb authentication integration
use context7: "Implement role-based authentication system with thirdweb and healthcare permissions"
```

**Container and Infrastructure**:
```bash
# Complex healthcare platform deployment
use context7: "Docker compose setup for healthcare platform with Uniswap v4, vlayer, and multi-service architecture"

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
- **Uniswap v4 Contracts**: Full protocol access for pool testing and hook development
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
make setup-uniswap-pools # Initialize Uniswap v4 pools with custom healthcare hooks
make start-frontend     # Launch Next.js with multi-role dashboard
make test-integration   # Run comprehensive integration tests
make test-mailproof     # Test MailProof verification workflows
make context7-docs      # Access real-time documentation for development
```

### Testing Infrastructure
- **Unit Testing**: Individual contract function testing with gas analysis
- **Integration Testing**: Cross-contract interaction validation
- **E2E Testing**: Complete user workflow testing including MailProof validation
- **Hook Testing**: Specialized testing for Uniswap v4 custom hook implementations
- **Gas Analysis**: Optimization and cost tracking for healthcare transactions
- **Security Testing**: Vulnerability scanning and audit preparation
- **MailProof Testing**: Comprehensive email verification workflow validation
- **Pool Testing**: Uniswap v4 pool operations and yield distribution validation

### Container Architecture with Healthcare Services
```yaml
# Comprehensive Development Stack
services:
  mantle-fork:
    image: ghcr.io/foundry-rs/foundry:latest
    command: anvil --fork-url https://rpc.mantle.xyz --chain-id 31339
    ports: ["8545:8545"]
    
  vlayer-services:
    image: vlayer/dev-stack:latest
    ports: ["3000:3000", "3002:3002", "7047:7047"]
    environment:
      - MAILPROOF_ENABLED=true
      - HEALTHCARE_MODE=true
    
  uniswap-v4-environment:
    image: uniswap/v4-core:latest
    ports: ["8546:8545"]
    environment:
      - HOOKS_ENABLED=true
      - HEALTHCARE_HOOKS=true
    
  redis-cache:
    image: redis:alpine
    ports: ["6379:6379"]
    command: redis-server --appendonly yes
    
  context7-server:
    image: context7/mcp-server:latest
    ports: ["3007:3000"]
    environment:
      - CONTEXT7_MODE=healthcare
      - LIBRARY_CACHE_SIZE=1000
    
  frontend:
    build: ./packages/nextjs
    ports: ["3001:3000"]
    environment:
      - NEXT_PUBLIC_RPC_URL=http://mantle-fork:8545
      - NEXT_PUBLIC_MAILPROOF_ENABLED=true
      - NEXT_PUBLIC_UNISWAP_V4_ENABLED=true
      - CONTEXT7_API_URL=http://context7-server:3000
```

---

## 🔐 Security Architecture & Patterns

### Smart Contract Security
- **Access Control**: Role-based permissions with multi-signature requirements
- **Reentrancy Protection**: Comprehensive guards against attack vectors
- **Input Validation**: Strict validation of all user inputs and external data
- **Emergency Pauses**: Circuit breakers for critical system functions
- **Upgrade Patterns**: Secure proxy patterns for future improvements

### Enhanced MailProof-Based Privacy Preservation
```solidity
// Patient Commitment Pattern with MailProof Integration
bytes32 commitment = keccak256(abi.encodePacked(secret, patientAddress));

// MailProof Validation Pattern for Payment Authorization
function validateMailProofPayment(
    bytes calldata mailProof,
    bytes32 paymentHash,
    uint256 claimId
) external view returns (bool) {
    require(vlayerVerifier.verifyMailProof(mailProof), "Invalid MailProof");
    
    // Extract payment instructions without exposing medical data
    (address recipient, uint256 amount, address token) = extractPaymentData(mailProof);
    
    // Verify payment authorization corresponds to claim
    bytes32 authHash = keccak256(abi.encodePacked(recipient, amount, token, claimId));
    return claimPaymentHashes[claimId] == authHash;
}

// Privacy-Preserving MailProof Claim Processing
struct MailProofClaim {
    bytes32 emailDomainHash;     // Hash of verified domain
    bytes32 paymentAuthHash;     // Hash of payment authorization
    address hospital;            // Hospital receiving payment
    address patient;             // Patient with coverage
    uint256 timestamp;           // Authorization timestamp
    bool processed;              // Processing status
}

// Uniswap v4 Hook Integration for MailProof Validation
function beforeSwap(
    address sender,
    PoolKey calldata key,
    IPoolManager.SwapParams calldata params,
    bytes calldata hookData
) external override returns (bytes4) {
    // Decode MailProof from hook data
    bytes memory mailProof = abi.decode(hookData, (bytes));
    
    // Validate MailProof authorization
    require(validateMailProofPayment(mailProof, extractPaymentHash(params), getCurrentClaimId(sender)), 
            "Invalid payment authorization");
    
    // Verify pool has sufficient liquidity for healthcare payment
    require(validateHealthcarePoolLiquidity(key, params.amountSpecified), 
            "Insufficient healthcare pool liquidity");
    
    return BaseHook.beforeSwap.selector;
}
```

### Container Security
- **Image Scanning**: Automated vulnerability detection in container images
- **Minimal Images**: Alpine-based containers with only required dependencies
- **Non-Root Users**: All containers run with unprivileged user accounts
- **Network Isolation**: Service-specific networks with controlled communication
- **Secret Management**: Encrypted storage of sensitive configuration data

---

## 💰 Uniswap v4 Healthcare Pool Architecture

### Advanced Pool Management with Custom Healthcare Hooks
```solidity
interface IHealthcarePoolManager {
    // Pool initialization with healthcare-specific hooks
    function initializeHealthcarePool(
        PoolKey calldata key,
        uint160 sqrtPriceX96,
        address hookContract
    ) external returns (PoolId);
    
    // Healthcare payment processing through Uniswap v4
    function processHealthcarePayment(
        PoolKey calldata key,
        bytes calldata mailProof,
        HealthcarePaymentParams calldata params
    ) external returns (BalanceDelta);
    
    // Yield distribution for healthcare stakeholders
    function distributeHealthcareYield(
        PoolId poolId,
        YieldDistributionParams calldata params
    ) external;
    
    // Pool monitoring and health checks
    function getHealthcarePoolMetrics(PoolId poolId) external view returns (HealthcarePoolMetrics memory);
    function validateHealthcarePoolState(PoolId poolId) external view returns (bool);
}

// Healthcare-specific Uniswap v4 Hook Implementation
contract HealthcarePoolHook is BaseHook {
    using PoolIdLibrary for PoolKey;
    
    struct HealthcareSwapParams {
        bytes mailProof;
        uint256 claimId;
        address patient;
        address hospital;
        uint256 authorizationDeadline;
    }
    
    // Before swap: Validate healthcare payment authorization
    function beforeSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        bytes calldata hookData
    ) external override onlyPoolManager returns (bytes4) {
        HealthcareSwapParams memory healthcareParams = abi.decode(hookData, (HealthcareSwapParams));
        
        // Validate MailProof authorization
        require(vlayerVerifier.verifyMailProof(healthcareParams.mailProof), "Invalid MailProof");
        
        // Extract and validate payment instructions
        (address authorizedRecipient, uint256 authorizedAmount) = 
            extractPaymentInstructions(healthcareParams.mailProof);
        
        require(authorizedRecipient == healthcareParams.hospital, "Unauthorized recipient");
        require(uint256(-params.amountSpecified) <= authorizedAmount, "Exceeds authorized amount");
        
        // Verify claim is still valid
        require(block.timestamp <= healthcareParams.authorizationDeadline, "Authorization expired");
        require(!processedClaims[healthcareParams.claimId], "Claim already processed");
        
        // Mark claim as being processed
        processedClaims[healthcareParams.claimId] = true;
        
        return BaseHook.beforeSwap.selector;
    }
    
    // After swap: Handle yield distribution and claim completion
    function afterSwap(
        address sender,
        PoolKey calldata key,
        IPoolManager.SwapParams calldata params,
        BalanceDelta delta,
        bytes calldata hookData
    ) external override onlyPoolManager returns (bytes4) {
        HealthcareSwapParams memory healthcareParams = abi.decode(hookData, (HealthcareSwapParams));
        
        // Calculate and distribute yield
        uint256 swapFees = calculateSwapFees(delta);
        distributeHealthcareYield(key, swapFees, healthcareParams);
        
        // Update patient and hospital balances
        updateStakeholderBalances(healthcareParams.patient, healthcareParams.hospital, delta);
        
        // Emit healthcare payment event
        emit HealthcarePaymentProcessed(
            healthcareParams.claimId,
            healthcareParams.patient,
            healthcareParams.hospital,
            uint256(-params.amountSpecified),
            block.timestamp
        );
        
        return BaseHook.afterSwap.selector;
    }
    
    // Healthcare-specific yield distribution (60/20/20 split)
    function distributeHealthcareYield(
        PoolKey calldata key,
        uint256 totalYield,
        HealthcareSwapParams memory params
    ) internal {
        // 60% to patients (premium cost reduction)
        uint256 patientYield = (totalYield * 6000) / 10000;
        allocatePatientYield(params.patient, patientYield);
        
        // 20% to insurers (operational returns)
        uint256 insurerYield = (totalYield * 2000) / 10000;
        address insurer = getPatientInsurer(params.patient);
        allocateInsurerYield(insurer, insurerYield);
        
        // 20% to protocol treasury
        uint256 protocolYield = (totalYield * 2000) / 10000;
        allocateProtocolYield(protocolYield);
    
        emit HealthcareYieldDistributed(
            params.claimId,
            patientYield,
            insurerYield,
            protocolYield,
            block.timestamp
        );
    }
}
```

### Pool Safety Mechanisms
- **Liquidity Buffers**: Minimum reserves for emergency withdrawals
- **MailProof Validation**: Multi-party email verification before withdrawals
- **Gradual Withdrawal Limits**: Rate limiting for large withdrawals
- **Pool Health Monitoring**: Continuous monitoring of utilization rates
- **Emergency Shutdown**: Ability to pause operations during market stress

---

## 🌐 Frontend Technology Stack

### Next.js 15 Architecture with Healthcare Features
- **App Router**: Modern routing with server-side rendering
- **React Server Components**: Optimal performance with minimal client JavaScript
- **TypeScript**: Full type safety across the application
- **Tailwind CSS**: Utility-first styling with responsive design
- **Responsive Design**: Mobile-first approach with desktop optimization

### Web3 Integration with MailProof and Multi-Role Support
```typescript
// thirdweb Configuration with Healthcare Integration
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

// Healthcare Contract Integration
const healthcarePoolContract = getContract({
  client,
  chain: mantleChain,
  address: process.env.NEXT_PUBLIC_HEALTHCARE_POOL_CONTRACT,
  abi: healthcarePoolABI, // Includes MailProof and Uniswap v4 functions
});

// MailProof Integration for Healthcare Claims
interface MailProofClaimData {
  claimId: string;
  hospitalEmail: string;
  patientWallet: string;
  mailProofHash: string;
  verificationStatus: 'pending' | 'verified' | 'processed' | 'failed';
  paymentAmount: string;
  authorizationDeadline: number;
  auditTrail: MailProofAuditEntry[];
}

// Multi-Role User Interface State
interface HealthcareUserState {
  userRole: 'patient' | 'hospital' | 'insurer' | 'admin';
  permissions: string[];
  verificationStatus: boolean;
  poolAccess: boolean;
  activeCllaims: MailProofClaimData[];
  yieldEarned: string;
}
```

### Healthcare Dashboard Components
- **Real-time Pool Tracking**: Live updates of Uniswap v4 pool performance and yields
- **Multi-Role Authentication**: Specialized interfaces for patients, hospitals, insurers, and admins
- **MailProof Claims Management**: Complete claim submission and tracking interface
- **Yield Distribution Monitoring**: Real-time tracking of yield allocation and distribution
- **Automated Payment Management**: Setup and monitoring of premium and claim payments
- **Privacy-Preserving Analytics**: Pool insights without personal data exposure

### State Management
- **React Query**: Server state management with automatic caching
- **Zustand**: Client state management for UI interactions
- **Local Storage**: Persistent user preferences and session data
- **Real-time Updates**: WebSocket connections for live pool data and MailProof status
- **Multi-Role State**: Dedicated state management for different user roles and permissions

---

## 🐳 Production Deployment Architecture

### Enhanced Container Stack for Healthcare Platform
```yaml
# Production Healthcare Platform Container Stack
services:
  healthcare-contracts:
    build:
      context: ./srcs/foundry
      dockerfile: Dockerfile.healthcare
    container_name: zkmed-healthcare-contracts
    volumes:
      - contract_artifacts:/app/out:rw
      - healthcare_config:/app/config:rw
    environment:
      - RPC_URL=http://host.docker.internal:8547
      - CHAIN_ID=31339
      - PRIVATE_KEY=${DEPLOYER_PRIVATE_KEY}
      - MAILPROOF_ENABLED=true
      - UNISWAP_V4_ENABLED=true
      - HEALTHCARE_MODE=production
    restart: "no"
    network_mode: "host"

  uniswap-v4-pools:
    build:
      context: ./srcs/uniswap-v4
      dockerfile: Dockerfile.pools
    container_name: zkmed-uniswap-pools
    depends_on:
      - healthcare-contracts
    volumes:
      - contract_artifacts:/app/contracts:ro
      - pool_state:/app/state:rw
    environment:
      - POOL_MANAGER_ADDRESS=${POOL_MANAGER_ADDRESS}
      - HEALTHCARE_HOOK_ADDRESS=${HEALTHCARE_HOOK_ADDRESS}
      - INITIAL_LIQUIDITY=${INITIAL_LIQUIDITY}
    restart: always

  vlayer-mailproof:
    image: vlayer/mailproof-server:latest
    container_name: zkmed-vlayer-mailproof
    ports:
      - "3002:3000"
    environment:
      - MAILPROOF_VERIFICATION_ENABLED=true
      - DKIM_VALIDATION_STRICT=true
      - HEALTHCARE_DOMAINS_WHITELIST=${HEALTHCARE_DOMAINS}
    restart: always

  zkmed-frontend:
    build:
      context: ./srcs/nextjs
      dockerfile: Dockerfile.healthcare
    container_name: zkmed-frontend
    ports:
      - "3000:3000"
    depends_on:
      - healthcare-contracts
      - uniswap-v4-pools
      - vlayer-mailproof
    volumes:
      - contract_artifacts:/app/contracts:ro
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_CHAIN_ID=31339
      - NEXT_PUBLIC_RPC_URL=http://localhost:8547
      - NEXT_PUBLIC_THIRDWEB_CLIENT_ID=${NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      - NEXT_PUBLIC_MAILPROOF_ENABLED=true
      - NEXT_PUBLIC_UNISWAP_V4_ENABLED=true
      - NEXT_PUBLIC_HEALTHCARE_POOL_ADDRESS=${HEALTHCARE_POOL_ADDRESS}
      - CONTEXT7_API_URL=http://context7-server:3000
    restart: always

  context7-server:
    image: context7/mcp-server:healthcare
    container_name: zkmed-context7
    ports:
      - "3007:3000"
    environment:
      - CONTEXT7_MODE=healthcare
      - LIBRARY_CACHE_SIZE=2000
      - HEALTHCARE_DOCS_ENABLED=true
    restart: always

  monitoring-stack:
    build:
      context: ./monitoring
      dockerfile: Dockerfile.healthcare
    container_name: zkmed-monitoring
    ports:
      - "3001:3000"
      - "9090:9090"
    environment:
      - PROMETHEUS_ENABLED=true
      - GRAFANA_ENABLED=true
      - HEALTHCARE_METRICS=true
    restart: always

volumes:
  contract_artifacts:
    driver: local
  healthcare_config:
    driver: local
  pool_state:
    driver: local
```

### Infrastructure Requirements
- **CPU**: Minimum 4 cores for healthcare services
- **Memory**: 8GB RAM for complete stack
- **Storage**: 50GB SSD for contract artifacts, pool state, and MailProof data
- **Network**: Stable internet with 100Mbps bandwidth for DeFi and vlayer connectivity
- **External Dependencies**: 
  - Existing vlayer infrastructure for MailProof verification
  - Uniswap v4 protocol contracts on Mantle Network
  - Healthcare domain email infrastructure for DKIM verification

### Monitoring & Observability
- **Health Checks**: Automated monitoring of all service endpoints
- **Logging**: Centralized log aggregation and analysis
- **Metrics**: Real-time performance monitoring and alerting
- **MailProof Monitoring**: Verification workflow tracking and alerts
- **Pool Monitoring**: Uniswap v4 pool health and yield tracking
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
- **MailProof Validation**: Comprehensive email verification without content exposure
- **Hook Gas Limits**: Uniswap v4 hook gas optimization for complex healthcare logic

### Performance Requirements
- **Transaction Speed**: Sub-second confirmation times on Mantle L2
- **Pool Updates**: Real-time yield calculations and distribution
- **MailProof Processing**: <10 seconds for email verification workflows
- **UI Responsiveness**: <200ms response times for all interactions
- **Container Startup**: <30 seconds for full stack initialization
- **Error Recovery**: Automatic restart and state restoration capabilities
- **Hook Performance**: <50,000 gas for healthcare hook execution

### Security Requirements
- **Multi-Signature**: All administrative functions require multiple signatures
- **Audit Trail**: Complete logging of all system interactions
- **Privacy Preservation**: Medical data never stored or transmitted unencrypted
- **MailProof Security**: Email content encrypted, only proof validity confirmed
- **Access Control**: Granular permissions with regular access reviews
- **Vulnerability Management**: Regular security updates and patch management
- **Hook Security**: Comprehensive validation in Uniswap v4 hook implementations

---

## 📚 Dependencies & Integration Points

### Core Dependencies
```json
{
  "smart-contracts": {
    "@openzeppelin/contracts": "^5.0.0",
    "@uniswap/v4-core": "^0.1.0",
    "@uniswap/v4-periphery": "^0.1.0",
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
  },
  "context7": {
    "@upstash/context7-mcp": "^1.0.6"
  },
  "uniswap-v4": {
    "@uniswap/v4-sdk": "^1.0.0",
    "@uniswap/v4-hook-library": "^1.0.0"
  }
}
```

### External Service Integration
- **vlayer Network**: MailProof generation and verification services
- **Uniswap v4 Protocol**: Pool management and custom hook integration
- **IPFS/Web3.Storage**: Decentralized storage for encrypted medical records
- **Mantle RPC**: Blockchain interaction and state queries
- **thirdweb Infrastructure**: Gas sponsorship and wallet management
- **Context7 MCP**: Real-time documentation access during development

### API Integration Points
```typescript
// External Service APIs with Healthcare Integration
interface HealthcareAPIs {
  vlayer: {
    proveEmail: (email: UnverifiedEmail) => Promise<MailProof>;
    verifyMailProof: (proof: MailProof) => Promise<boolean>;
    generateAuditTrail: (emails: Email[]) => Promise<AuditTrail>;
  };
  uniswap: {
    initializePool: (key: PoolKey, sqrtPriceX96: bigint, hookData: bytes) => Promise<TxHash>;
    swap: (key: PoolKey, params: SwapParams, hookData: bytes) => Promise<BalanceDelta>;
    getPoolState: (poolId: PoolId) => Promise<PoolState>;
  };
  thirdweb: {
    sponsorTransaction: (tx: Transaction) => Promise<SponsoredTx>;
    createSmartAccount: (owner: string) => Promise<SmartAccount>;
  };
  context7: {
    resolveLibraryId: (libraryName: string) => Promise<string>;
    getLibraryDocs: (libraryId: string, topic?: string, tokens?: number) => Promise<Documentation>;
    getHealthcareDocs: (topic: string) => Promise<HealthcareDocumentation>;
  };
}
```

---

## 🎯 Technical Success Metrics

### Performance Benchmarks
- **Contract Deployment**: <30 seconds on Mantle network
- **Pool Operations**: <5 seconds for deposits and withdrawals
- **MailProof Generation**: <10 seconds for email verification
- **MailProof Validation**: <5 seconds for proof verification
- **Frontend Loading**: <3 seconds for initial page load
- **Real-time Updates**: <1 second latency for pool data updates
- **Hook Execution**: <50,000 gas for healthcare hook operations

### MailProof Verification Metrics
- **Email Processing**: <15 seconds for complete email verification workflow
- **Multi-Party Verification**: <30 seconds for hospital, patient, insurer confirmations
- **Audit Trail Generation**: <5 seconds for complete communication history
- **Domain Verification**: <10 seconds for DKIM signature validation
- **Privacy Preservation**: 100% success rate for content encryption

### Uniswap v4 Pool Performance
- **Pool Initialization**: <20 seconds for healthcare pool setup with custom hooks
- **Swap Execution**: <10 seconds for healthcare payment processing
- **Yield Distribution**: <15 seconds for automated 60/20/20 allocation
- **Hook Performance**: <3 seconds for beforeSwap and afterSwap execution
- **Liquidity Management**: Real-time rebalancing with <5% slippage

### Reliability Targets
- **System Uptime**: 99.9% availability target
- **Container Health**: Automatic restart within 30 seconds
- **Data Persistence**: Zero data loss across service restarts
- **Error Handling**: Graceful degradation for all failure scenarios
- **Recovery Time**: <5 minutes for full system restoration
- **MailProof Reliability**: 99.5% verification success rate

### Security Validation
- **Audit Completion**: Full security audit before mainnet deployment
- **Penetration Testing**: Regular testing of all system components
- **Vulnerability Scanning**: Automated scanning of container images
- **Access Review**: Monthly review of all system permissions
- **Incident Response**: Documented procedures for security incidents
- **MailProof Security**: Zero email content exposure incidents

---

## 📚 Research Foundation & Technical Validation

zkMed's technical architecture is validated by cutting-edge research in blockchain healthcare applications:

**Technical Innovation Validation**:
- **Blockchain Infrastructure**: Decentralized systems enhance transparency and operational efficiency (Shouri & Ramezani, 2025)
- **Privacy Technology**: Integration with healthcare systems improves data security and interoperability (Implementation of Electronic Health Record, 2023)
- **DeFi Integration**: Automated settlement mechanisms enable peer-to-peer risk sharing (MAPFRE, 2025)
- **Fraud Prevention**: Real-time validation systems reduce fraudulent activities (Ncube et al., 2022)
- **Advanced Protocols**: Uniswap v4's hook system provides gas-efficient, customizable liquidity management

---

## 📊 Technical Architecture Summary

| Component | Web2 Integration | Web3 Integration | Hybrid Benefits |
|-----------|------------------|------------------|----------------|
| **Agreement Management** | Traditional contracts + KYC | Smart contract mapping | Legal compliance + transparency |
| **Payment Processing** | Bank transfers, SEPA | Uniswap v4 pools + hooks | Familiar UX + yield generation |
| **Claim Validation** | Manual review processes | MailProof verification | Regulatory adherence + automation |
| **Data Management** | EHR integration | Cryptographic proofs | Privacy preservation + auditability |

**zkMed's advanced technical architecture represents the first practical implementation of hybrid Web2/Web3 integration in healthcare, combining cutting-edge privacy-preserving technologies, advanced DeFi protocols (Uniswap v4), and comprehensive MailProof verification systems. This research-validated approach delivers unprecedented healthcare innovation while maintaining enterprise-grade security, reliability, and regulatory compliance.** 🚀 
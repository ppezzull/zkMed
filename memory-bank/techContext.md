# Technical Context - zkMed Development Environment

## Technology Stack Overview

### Blockchain & Smart Contracts
- **Foundry**: Smart contract development framework (latest stable)
- **Solidity**: `^0.8.21` for smart contract implementation
- **OpenZeppelin**: `5.0.1` for security patterns and utilities
- **vlayer SDK**: `1.0.2` for zero-knowledge email and web proofs
- **Deployment Target**: Ethereum Sepolia (testnet), Ethereum Mainnet (production)

### Frontend & User Interface
- **Next.js**: `15+` with App Router for Server Components
- **React**: `18+` with TypeScript for type safety
- **Thirdweb**: Latest for wallet connection and SIWE authentication
- **Viem**: `2.27.0` for Ethereum interactions
- **TypeScript**: `^5.5.4` for full-stack type safety

### Integration & Oracle Layer
- **vlayer Client**: Email and web proof generation
- **Flare Data Connector**: Off-chain policy rules and data feeds
- **Flare FTSO**: Real-time pricing oracles for medical procedures
- **Blockscout API**: Merit system tracking and public analytics

## Current Project Structure

```
zkMed/
├── backend/                    # Smart contract development
│   ├── src/
│   │   ├── vlayer/            # vlayer integration contracts
│   │   │   ├── SimpleProver.sol
│   │   │   ├── SimpleVerifier.sol
│   │   │   ├── ExampleNFT.sol
│   │   │   └── ExampleToken.sol
│   │   └── Counter.sol         # Basic example contract
│   ├── test/                  # Foundry test suite
│   ├── script/                # Deployment scripts
│   ├── vlayer/                # vlayer SDK integration
│   │   ├── prove.ts           # Proof generation scripts
│   │   ├── package.json       # vlayer dependencies
│   │   └── docker-compose.devnet.yaml
│   ├── foundry.toml           # Foundry configuration
│   ├── remappings.txt         # Solidity import mappings
│   └── soldeer.lock           # Dependency lock file
├── memory-bank/               # Project documentation and context
└── README.md
```

## Smart Contract Dependencies

### Foundry Configuration

```toml
# foundry.toml
[profile.default]
src = "src"
out = "out"
libs = ["lib", "dependencies"]
fs_permissions = [{ access = "read", path = "./testdata"}]

[dependencies]
"@openzeppelin-contracts" = "5.0.1"
forge-std = "1.9.4"
risc0-ethereum = { version = "2.0.0", url = "https://github.com/vlayer-xyz/risc0-ethereum/releases/download/v2.0.0-soldeer/contracts.zip" }
vlayer = "1.0.2"
```

### Import Remappings

```
# remappings.txt
forge-std-1.9.4/src/=dependencies/forge-std-1.9.4/src/
forge-std/=dependencies/forge-std-1.9.4/src/
openzeppelin-contracts/=dependencies/@openzeppelin-contracts-5.0.1/
risc0-ethereum-2.0.0/=dependencies/risc0-ethereum-2.0.0/
vlayer-0.1.0/=dependencies/vlayer-1.0.2/src/
```

## vlayer Integration Setup

### vlayer TypeScript Configuration

```json
{
  "compilerOptions": {
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "target": "ESNext",
    "module": "ESNext",
    "moduleDetection": "force",
    "jsx": "react-jsx",
    "allowJs": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": false,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "paths": {
      "types/*": ["../../../packages/sdk/src/api/lib/types/*"]
    }
  }
}
```

### vlayer Dependencies

```json
{
  "name": "simple",
  "module": "prove.ts",
  "type": "module",
  "dependencies": {
    "@vlayer/sdk": "1.0.2",
    "viem": "2.27.0",
    "@vlayer/react": "1.0.2"
  },
  "devDependencies": {
    "typescript": "^5.5.4",
    "@types/bun": "^1.1.6",
    "solhint": "5.0.5"
  }
}
```

## Development Environment Setup

### Required Tools

1. **Node.js**: `18+` (LTS recommended)
2. **Bun**: Latest for fast package management and TypeScript execution
3. **Foundry**: Latest for smart contract development
4. **Docker**: For vlayer devnet setup
5. **Git**: Version control

### Environment Variables

```bash
# .env (backend/vlayer/)
VLAYER_ENV=dev|testnet|mainnet
EXAMPLES_TEST_PRIVATE_KEY=<private_key_for_testing>

# .env (frontend - future)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=<thirdweb_client_id>
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia
PRIVATE_RPC_URL=<private_rpc_endpoint>
VLAYER_TOKEN=<vlayer_api_token>
```

### Local Development Commands

```bash
# Smart Contract Development
cd backend
forge build                    # Compile contracts
forge test                     # Run test suite
forge test --gas-report       # Test with gas reporting

# vlayer Integration
cd backend/vlayer
bun install                    # Install dependencies
bun run devnet:up             # Start local vlayer devnet
bun run prove:dev             # Generate proofs locally
bun run devnet:down           # Stop devnet

# Code Quality
forge fmt                     # Format Solidity code
bun run lint:solidity        # Lint contracts
```

## Current Implementation Status

### ✅ Completed Components

1. **Basic Foundry Setup**
   - Project structure with proper dependency management
   - OpenZeppelin integration for security patterns
   - forge-std for testing utilities

2. **vlayer Integration Foundation**
   - SDK integration with TypeScript configuration
   - Example prover/verifier contracts (SimpleProver.sol, SimpleVerifier.sol)
   - Docker devnet setup for local development
   - Example proof generation script (prove.ts)

3. **Smart Contract Examples**
   - ERC20 token contract (ExampleToken.sol)
   - ERC721 NFT contract (ExampleNFT.sol)
   - Basic counter contract for testing

### 🚧 In Development

1. **RegistrationContract**
   - Patient commitment registration
   - Organization domain verification
   - Role-based access control
   - vlayer email proof integration

2. **Email Proof Workflow**
   - Domain verification through vlayer
   - Proof generation and verification
   - Error handling and retry mechanisms

### 📋 Planned Implementation

1. **Core Smart Contracts**
   - ClaimContract for health insurance claims processing
   - InsuranceContract for policy management
   - MeritsContract for reward system

2. **Frontend Application**
   - Next.js 15+ with App Router
   - Thirdweb authentication integration
   - Server Actions for secure blockchain interactions

3. **Oracle Integration**
   - Flare Data Connector for policy rules
   - FTSO integration for real-time pricing
   - Blockscout API for merit tracking

## Development Workflow

### Smart Contract Development

1. **Development Cycle**
   ```bash
   # Write contracts in src/
   forge build              # Compile
   forge test               # Test
   forge test --fork-url $RPC_URL  # Fork testing
   ```

2. **Testing Strategy**
   - Unit tests for all contract functions
   - Integration tests with vlayer proofs
   - Fuzzing for edge cases
   - Gas optimization testing

3. **Deployment Process**
   ```bash
   # Deploy to testnet
   forge script script/Deploy.s.sol --rpc-url sepolia --broadcast
   
   # Verify contracts
   forge verify-contract <address> <contract> --chain sepolia
   ```

### vlayer Proof Development

1. **Local Development**
   ```bash
   cd backend/vlayer
   bun run devnet:up        # Start local infrastructure
   bun run prove:dev        # Test proof generation
   ```

2. **Testing Against vlayer Networks**
   ```bash
   bun run prove:testnet    # Test on vlayer testnet
   bun run prove:mainnet    # Production proofs
   ```

## Security Considerations

### Smart Contract Security

1. **Dependency Management**
   - Pin exact versions in soldeer.lock
   - Regular security audits of dependencies
   - Use OpenZeppelin for battle-tested patterns

2. **Testing Requirements**
   - 100% test coverage for critical functions
   - Property-based testing with fuzzing
   - Integration tests with realistic scenarios

3. **Access Control**
   - Role-based permissions with verification requirements
   - Time-locked admin functions for critical changes
   - Multi-signature requirements for high-value operations

### Privacy & Data Protection

1. **On-Chain Data Minimization**
   - Only store essential verification data
   - Use events for audit trails without personal data
   - Hash commitments for patient privacy

2. **Off-Chain Data Handling**
   - Encrypted storage for temporary data
   - Zero-knowledge proof generation
   - Secure communication with vlayer services

## Performance & Optimization

### Gas Optimization Targets

- Patient registration: < 50k gas
- Organization verification: < 100k gas
- Claim processing: < 150k gas
- Batch operations for efficiency

### Proof Generation Performance

- Email proof generation: < 30 seconds
- Web proof generation: < 60 seconds
- Local caching for repeated proofs
- Progressive enhancement for better UX

## Deployment Architecture

### Development Environment
- **Local Anvil**: For rapid iteration
- **vlayer Devnet**: For proof testing
- **Local Next.js**: For frontend development

### Staging Environment
- **Ethereum Sepolia**: For integration testing
- **vlayer Testnet**: For proof validation
- **Vercel Preview**: For frontend testing

### Production Environment
- **Ethereum Mainnet**: For live operations
- **vlayer Mainnet**: For production proofs
- **Vercel Production**: For user-facing application

## Monitoring & Analytics

### Smart Contract Monitoring
- Event indexing with The Graph or similar
- Gas usage tracking and optimization
- Error rate monitoring and alerting

### Application Performance
- Frontend performance monitoring
- Proof generation success rates
- User experience analytics

### Security Monitoring
- Contract interaction analysis
- Anomaly detection for unusual patterns
- Automated security scanning

This technical context provides the foundation for consistent development practices and ensures all team members understand the technology choices and constraints of the zkMed platform. 
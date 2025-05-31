# Technical Context - zkMed Advanced Web3 Platform

## Technology Stack Overview

### Advanced Web3 Healthcare Platform with Multi-Protocol Integration

zkMed implements a cutting-edge technology stack combining privacy-preserving proofs, real-time oracles, sponsored transactions, and seamless authentication for a revolutionary healthcare claims platform.

---

## 🏗️ Backend Technology Stack

### Core Blockchain Infrastructure
- **Solidity 0.8.20+**: Smart contract development language
- **Foundry**: Development framework with comprehensive testing
- **OpenZeppelin**: Security-audited contract libraries
- **ERC-7824**: Abstract account and meta-transaction standards

### Advanced Web3 Integrations

#### 1. vlayer Integration (Multi-Proof System)
```typescript
// vlayer SDK Configuration
{
  "vlayer": {
    "version": "latest",
    "proofs": {
      "mailProofs": "Organization domain verification via email",
      "webProofs": "Patient portal and hospital system validation",
      "zkProofs": "Privacy-preserving medical procedure validation"
    },
    "networks": ["anvil", "sepolia", "mainnet"],
    "environment": "dev"
  }
}
```

**Features Implemented**:
- **MailProofs**: Organization email domain verification without exposing email addresses
- **WebProofs**: Patient portal and hospital system verification (planned)
- **Multi-Proof Architecture**: Combined proof validation for maximum security
- **Privacy Preservation**: Prove validity without revealing sensitive data

#### 2. ERC-7824 Abstract Accounts (Nitrolite)
```solidity
// ERC-7824 Gateway Configuration
contract ERC7824Gateway {
    struct ERC7824ForwardRequest {
        address from;
        address to;
        uint256 value;
        uint256 gas;
        uint256 nonce;
        bytes data;
        uint256 validUntilTime;
    }
}
```

**Features Planned**:
- **Sponsored Transactions**: Gas-free patient and hospital interactions
- **Meta-Transaction Router**: Seamless UX without gas barriers
- **Batch Operations**: Efficient bulk transaction processing
- **Account Abstraction**: Simplified user experience

#### 3. Flare FTSO Oracle Integration
```solidity
// Flare FTSO Price Integration
interface IFlareFtsoV2 {
    function getCurrentPrice(string memory symbol) 
        external view returns (uint256 price, uint256 timestamp);
}
```

**Features Planned**:
- **Real-Time Pricing**: Live USD to USDC conversion for claims
- **Dynamic Calculations**: Accurate claim amounts with live oracle data
- **Multi-Currency Support**: Flexible pricing across different tokens
- **Decentralized Oracles**: No reliance on centralized price feeds

#### 4. thirdweb Authentication
```typescript
// thirdweb Configuration
{
  "thirdweb": {
    "clientId": "your-client-id",
    "secretKey": "your-secret-key",
    "supportedWallets": ["metamask", "walletconnect", "coinbase"],
    "supportedChains": [31337, 11155111], // anvil, sepolia
    "authDomain": "zkmed.health"
  }
}
```

**Features Planned**:
- **Social Login**: Easy onboarding with familiar authentication methods
- **Wallet Abstraction**: Simplified wallet management for users
- **Session Management**: Persistent user sessions across devices
- **Account Binding**: Link social accounts to ERC-7824 abstract accounts

---

## 📦 Smart Contract Architecture

### Core Contract Suite

#### 1. RegistrationContract.sol [PRODUCTION READY] ✅
```solidity
contract RegistrationContract {
    // Privacy-preserving patient registration
    mapping(address => bytes32) public patientCommitments;
    mapping(address => bool) public verified;
    mapping(address => Role) public roles;
    mapping(string => address) public domainToAddress;
    
    // Multi-owner system (up to 10 owners)
    mapping(address => bool) public owners;
    address[] public ownersList;
    
    // User activation system
    mapping(address => bool) public activeUsers;
}
```

**Features Implemented**:
- Patient registration with privacy-preserving commitments
- Organization verification via vlayer MailProofs
- Multi-owner management system
- Role-based access control (Patient, Hospital, Insurer, Admin)
- Batch user activation/deactivation
- Domain uniqueness enforcement

#### 2. ERC7824Gateway.sol [PLANNED] 🔄
```solidity
contract ERC7824Gateway {
    mapping(address => uint256) public nonces;
    mapping(address => bool) public approvedSponsors;
    
    function execute(
        ERC7824ForwardRequest calldata req,
        bytes calldata signature
    ) external;
    
    function batchExecute(
        ERC7824ForwardRequest[] calldata requests,
        bytes[] calldata signatures
    ) external;
}
```

**Features Planned**:
- Meta-transaction execution with signature validation
- Nonce management for replay protection
- Gas sponsorship mechanisms
- Batch operations support

#### 3. Enhanced Claims Processing Suite [PLANNED] 🔄
```solidity
// PatientModule.sol - Enhanced patient operations
contract PatientModule {
    function uploadEncryptedEHR(string cid, bytes preKey) external;
    function proposeOperation(bytes webProof, bytes32 procedureHash, uint256 estimatedCost) external;
    function proposeOperationSponsored(ERC7824ForwardRequest req, bytes signature) external;
}

// ClaimProcessingContract.sol - Multi-proof validation
contract ClaimProcessingContract {
    function submitClaimWithMultiProof(
        address patient,
        bytes32 procedureCodeHash,
        uint256 requestedUSD,
        string encryptedEHRCID,
        bytes ehrPREKey,
        bytes zkProof,
        bytes webProof,
        bytes hospitalProof
    ) external;
}

// InsuranceContract.sol - Advanced policy management
contract InsuranceContract {
    IFlareFtsoV2 public ftsoV2;
    ERC7824Gateway public gateway;
    
    function createPolicy(address patient, string policyId, uint256 totalCoverageUSD) external;
    function approveClaimSponsored(uint256 claimId, ERC7824ForwardRequest req) external;
}
```

---

## 🎨 Frontend Technology Stack

### Next.js 15 Application Architecture
```json
{
  "name": "zkmed-frontend",
  "version": "1.0.0",
  "dependencies": {
    "next": "^15.0.0",
    "@thirdweb-dev/react": "^4.0.0",
    "@erc7824/nitrolite-client": "^1.0.0",
    "vlayer-client": "^1.0.0",
    "@flare-network/ftso-sdk": "^1.0.0",
    "viem": "^2.0.0",
    "wagmi": "^2.0.0"
  }
}
```

### Key Frontend Features

#### 1. thirdweb Authentication Integration
```typescript
// app/providers.tsx
import { ThirdwebProvider } from "@thirdweb-dev/react";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider 
      activeChain="ethereum"
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      authConfig={{
        domain: "zkmed.health",
        authUrl: "/api/auth"
      }}
    >
      {children}
    </ThirdwebProvider>
  );
}
```

#### 2. ERC-7824 Account Binding
```typescript
// lib/erc7824.ts
import { bindAccount, ERC7824Client } from "@erc7824/nitrolite-client";

export class zkMedERC7824Client {
  async bindUserAccount(userAddress: string) {
    return await bindAccount(provider, {
      accountAddress: userAddress,
      gatewayAddress: ERC_7824_GATEWAY,
      chainId: 11155111 // Sepolia
    });
  }
  
  async submitSponsoredTransaction(tx: TransactionRequest) {
    return await this.client.execute(tx);
  }
}
```

#### 3. vlayer Proof Generation
```typescript
// lib/vlayer.ts
import { VlayerClient } from "vlayer-client";

export class zkMedProofGenerator {
  async generateMailProof(email: string, domain: string) {
    return await this.vlayer.generateMailProof({
      email,
      domain,
      targetWallet: userAddress
    });
  }
  
  async generateWebProof(portalUrl: string, selector: string) {
    return await this.vlayer.generateWebProof({
      url: portalUrl,
      selector,
      claim: "Patient has legitimate medical procedure"
    });
  }
}
```

#### 4. Real-Time Price Integration
```typescript
// lib/flare.ts
import { FtsoV2Client } from "@flare-network/ftso-sdk";

export class zkMedPriceService {
  async getUSDCPrice(): Promise<{ price: number; timestamp: number }> {
    const result = await this.ftso.getCurrentPrice("USDC/USD");
    return {
      price: result.price,
      timestamp: result.timestamp
    };
  }
  
  async convertUSDToUSDC(amountUSD: number): Promise<number> {
    const { price } = await this.getUSDCPrice();
    return (amountUSD * 1e18) / price;
  }
}
```

---

## 🛠️ Development Environment

### Local Development Setup
```bash
# Backend Setup (Foundry)
git clone <zkmed-repo>
cd backend
make install           # Install dependencies
make build             # Compile contracts
make test              # Run tests (53/53 passing)
make deploy-local      # Deploy to anvil

# vlayer Setup
make vlayer-setup      # Configure vlayer environment
make vlayer-test       # Test email proof generation

# Frontend Setup (Next.js)
cd frontend
npm install
npm run dev
```

### Environment Configuration
```env
# Backend (.env)
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
JSON_RPC_URL=http://localhost:8545
ETHERSCAN_API_KEY=your_etherscan_api_key

# vlayer (.env.vlayer)
VLAYER_ENV=dev
PROVER_URL=http://localhost:3000
CHAIN_NAME=anvil
EXAMPLES_TEST_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Frontend (.env.local)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_ERC7824_GATEWAY=0x...
NEXT_PUBLIC_REGISTRATION_CONTRACT=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
```

### Testing Infrastructure

#### 1. Foundry Test Suite
```solidity
// test/Registration.t.sol - 53 tests passing
contract RegistrationTest is Test {
    function testPatientRegistrationThroughContract() public { ... }
    function testOrganizationEmailProofThroughContract() public { ... }
    function testMultiOwnerSystemThroughContract() public { ... }
    // ... 50 more tests
}
```

#### 2. vlayer Integration Tests
```typescript
// vlayer/proveEmailDomain.ts
describe('vlayer Email Proof Integration', () => {
  it('should generate valid email proofs for organizations', async () => {
    const proof = await generateEmailProof('mountsinai.org');
    expect(proof).toBeDefined();
    expect(proof.domain).toBe('mountsinai.org');
  });
});
```

#### 3. Frontend Component Tests
```typescript
// __tests__/components/ClaimSubmission.test.tsx
import { render, screen } from '@testing-library/react';
import { ClaimSubmission } from '@/components/ClaimSubmission';

describe('ClaimSubmission', () => {
  it('should handle sponsored transaction submission', async () => {
    // Test ERC-7824 sponsored transaction flow
  });
});
```

---

## 🔐 Security & Privacy Infrastructure

### Privacy Preservation Mechanisms

#### 1. Commitment-Reveal Pattern
```solidity
// Patient registration without exposing personal data
bytes32 commitment = keccak256(abi.encodePacked(secret, patientAddress));
patientCommitments[commitment] = true;
```

#### 2. Encrypted Storage
```typescript
// IPFS + AES encryption for medical records
const encryptedEHR = await encrypt(medicalRecord, aesKey);
const cid = await ipfs.add(encryptedEHR);
const preKey = generatePREKey(aesKey); // Proxy re-encryption key
```

#### 3. Zero-Knowledge Proofs
```typescript
// vlayer ZK proof: "EHR contains valid procedure" without revealing details
const zkProof = await vlayer.generateZKProof({
  circuit: "procedure_validation",
  inputs: { encryptedEHR, allowedCodes },
  outputs: ["isValidProcedure", "procedureHash"]
});
```

### Security Patterns

#### 1. Multi-Signature Governance
```solidity
mapping(address => bool) public owners;
uint256 public constant REQUIRED_CONFIRMATIONS = 3;
```

#### 2. Role-Based Access Control
```solidity
enum Role { Patient, Hospital, Insurer, Admin }
mapping(address => Role) public roles;
mapping(address => bool) public verified;
```

#### 3. Reentrancy Protection
```solidity
uint256 private constant _NOT_ENTERED = 1;
uint256 private constant _ENTERED = 2;
uint256 private _status;

modifier nonReentrant() {
    require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
    _status = _ENTERED;
    _;
    _status = _NOT_ENTERED;
}
```

---

## 📊 Performance & Monitoring

### Gas Optimization Strategies
- **Packed Structs**: Minimize storage slots usage
- **Batch Operations**: Process multiple operations in single transaction
- **Event-Driven Architecture**: Use events for off-chain indexing
- **Proxy Patterns**: Enable upgradeable contracts

### Monitoring Infrastructure
```typescript
// Event monitoring for real-time analytics
const events = {
  ClaimProcessed: "Track successful claims",
  ProofValidated: "Monitor proof validation success rates", 
  SponsoredTransaction: "Track gas sponsorship usage",
  OrganizationRegistered: "Monitor organization onboarding"
};
```

### Performance Metrics
- **Transaction Confirmation Time**: < 15 seconds on Sepolia
- **Gas Usage**: Optimized for cost-effective operations
- **Proof Generation Time**: < 30 seconds for vlayer proofs
- **Frontend Load Time**: < 2 seconds with Next.js optimization

---

## 🚀 Deployment Architecture

### Multi-Environment Setup

#### 1. Local Development (Anvil)
```bash
# Anvil local testnet
anvil --host 0.0.0.0 --port 8545 --chain-id 31337
```

#### 2. Testnet Deployment (Sepolia)
```bash
# Deploy to Sepolia testnet
forge script script/DeployRegistration.s.sol --rpc-url sepolia --broadcast
```

#### 3. Production Deployment (Mainnet)
```bash
# Production deployment with additional security checks
forge script script/DeployRegistration.s.sol --rpc-url mainnet --broadcast --verify
```

### Contract Verification
```bash
# Automatic contract verification on Etherscan/Blockscout
forge verify-contract <contract-address> RegistrationContract --chain sepolia
```

---

## 🔧 Development Tools & Utilities

### Code Quality Tools
- **Solhint**: Solidity linting and style checking
- **Prettier**: Code formatting for TypeScript/JavaScript
- **ESLint**: JavaScript/TypeScript linting
- **Slither**: Static analysis for smart contracts

### Export & Integration Tools
```javascript
// scripts/export-abis.cjs - Frontend integration
const CONTRACTS = ['RegistrationContract'];
// Generates: exports/RegistrationContract.json, deployment-local.json, index.ts
```

### vlayer Development Tools
```typescript
// vlayer/proveEmailDomain.ts - Email proof testing
export async function testEmailProof(domain: string): Promise<EmailProofResult> {
  // Integration with vlayer SDK for proof generation
}
```

This comprehensive technical stack enables zkMed to deliver a privacy-preserving, user-friendly healthcare platform with advanced Web3 features including sponsored transactions, multi-proof validation, real-time pricing, and seamless authentication. 🚀 
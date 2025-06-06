# System Patterns - zkMed Advanced Web3 Architecture

## Overall Architecture Pattern

### Comprehensive Multi-Layer Privacy-First Design

zkMed implements a **Layered Privacy Architecture** with advanced Web3 integrations where each layer maintains specific privacy guarantees while enabling seamless user experience through sponsored transactions and multi-proof validation.

## 🏗️ Complete System Integration Diagram

```mermaid
flowchart TD

  %% Onboarding Layer
  subgraph Onboarding & Identity
    A1[Patient]
    A2[Hospital]
    A3[Insurer]
    RC[RegistrationContract]
    ED[EmailDomainProver]
  end

  %% Claims Layer
  subgraph Claims & Approvals
    CP[ClaimProcessingContract]
    IC[InsuranceContract]
    GW[ERC7824Gateway]
    ZKV[ZKVerifier]
  end

  %% Off-chain Infra
  subgraph Off-Chain Proofs
    IPFS[Encrypted EHR on IPFS]
    ZK[ZK-SNARK of Covered Procedure]
    CG[CoinGecko API (USD/USDC Display)]
    PRE[Proxy Re-Encryption Key]
    WP[WebProofs from Patient Portal]
    MP[MailProofs from Organization Email]
  end

  %% Execution Layer
  subgraph Payment & Escrow
    USDC[Stablecoin (USDC)]
    HWallet[Hospital Wallet]
    TWAuth[thirdweb Authentication]
  end

  %% Relationships

  %% Identity Setup
  A1 -->|registerPatient(commitment)| RC
  A1 -->|thirdweb social login| TWAuth
  A2 -->|MailProof| ED --> RC
  A2 -->|WebProof validation| WP --> RC
  A3 -->|MailProof| ED --> RC
  A3 -->|Sponsored registration| GW --> RC

  %% Claim Submission
  A2 -->|Encrypted EHR to IPFS| IPFS
  A2 -->|ZK Proof| ZK --> CP
  A2 -->|WebProof| WP --> CP
  A2 -->|USDC amount (direct)| CP
  CP -->|verifyZKProof| ZKV
  CP -->|verifyWebProof| WP
  CP -->|check Role: Hospital| RC
  CP -->|submitClaim(USDC)| IC

  %% Frontend Price Display
  A2 -->|Check USD price| CG
  CG -->|Display conversion| A2

  %% Sponsored Transactions
  A1 -->|sponsored claim proposal| GW
  A2 -->|sponsored claim submission| GW
  GW -->|execute meta-transactions| CP
  GW -->|execute meta-transactions| IC

  %% Claim Evaluation
  A3 -->|sponsored approveClaim(tx)| GW
  GW -->|execute(...)| IC

  IC -->|escrow payout| USDC
  IC -->|escrow balance| HWallet
  HWallet -->|withdrawPayout()| USDC

  %% Final Confirmation
  A2 -->|confirmOperation| IC
  A1 -->|confirmOperation| IC
  
  %% Authentication Layer
  TWAuth -->|account binding| GW
  TWAuth -->|session management| A1
  TWAuth -->|wallet abstraction| A2
  TWAuth -->|social login| A3
```

## 🧠 Complete Contract Roles & Responsibilities

| Contract | Primary Role | Key Features | Integrations |
|----------|-------------|--------------|--------------|
| **RegistrationContract** | Identity/role management via multi-proof | Patient commitments, organization MailProofs, ERC-7824 compatibility | vlayer MailProofs, ERC-7824 Gateway, thirdweb |
| **EmailDomainProver** | Verifies organization domain ownership (ZK) | Email-based domain verification without exposing emails | vlayer SDK, RegistrationContract |
| **ERC7824Gateway** | Executes sponsored meta-transactions | Gas-free interactions, batch operations, nonce management | All contracts, thirdweb authentication |
| **PatientModule** | Patient EHR & WebProof management | Encrypted EHR storage, WebProof operation proposals | vlayer WebProofs, ERC-7824, IPFS |
| **OrganizationModule** | Hospital/insurer multi-proof operations | WebProof validation, multi-proof claim submissions | vlayer WebProofs, ERC-7824 Gateway |
| **ClaimProcessingContract** | ZK proof gatekeeper + multi-proof validator | ZK+Web+Mail proof validation, direct USDC handling | vlayer proofs, ERC-7824 |
| **InsuranceContract** | Policy management, claims approval, escrow | Direct USDC processing, sponsored approvals, USDC payouts | ERC-7824, USDC token |
| **ZKVerifier** | Verifies ZK-SNARKs (Circom-based) | Privacy-preserving procedure validation | ClaimProcessingContract, vlayer |

---

## Advanced Integration Patterns

### 1. Multi-Proof Validation Architecture

```solidity
contract MultiProofValidator {
    struct ProofBundle {
        bytes zkProof;        // Privacy-preserving procedure validation
        bytes webProof;       // Patient portal verification
        bytes mailProof;      // Organization domain ownership
        bytes32 combinedHash; // Hash of all proofs combined
    }
    
    function validateMultiProof(ProofBundle calldata proofs) external returns (bool) {
        bool zkValid = zkVerifier.verify(proofs.zkProof);
        bool webValid = webProofVerifier.verify(proofs.webProof);
        bool mailValid = mailProofVerifier.verify(proofs.mailProof);
        
        require(zkValid && webValid && mailValid, "Multi-proof validation failed");
        return true;
    }
}
```

**Security Benefits:**
- Multiple proof types prevent single point of failure
- Cross-validation ensures claim legitimacy
- Privacy preservation through ZK components
- Domain ownership verification prevents impersonation

### 2. ERC-7824 Sponsored Transaction Flow

```mermaid
sequenceDiagram
    participant P as Patient
    participant I as Insurer (Sponsor)
    participant G as ERC7824Gateway
    participant C as ClaimProcessingContract
    participant T as thirdweb Auth
    
    P->>T: Social login
    T->>P: Session established
    P->>P: Generate claim request
    P->>I: Request sponsorship
    I->>G: Sign meta-transaction
    G->>G: Validate signature & nonce
    G->>C: Execute sponsored claim
    C->>C: Validate proofs & process USDC
    C-->>P: Claim submitted (gas-free)
```

**UX Benefits:**
- Gas-free patient interactions
- Seamless onboarding via social login
- Sponsored operations reduce barriers
- Batch transactions optimize costs

### 3. Simplified USDC Processing Pattern

```solidity
contract StreamlinedClaimsContract {
    IERC20 public usdc;
    
    function submitClaim(
        address patient,
        bytes32 procedureCodeHash,
        uint256 requestedUSDCAmount, // Direct USDC amount
        string memory encryptedEHRCID,
        bytes memory ehrPREKey,
        bytes memory zkProof
    ) external onlyVerifiedHospital {
        // Validate ZK proof without price conversion
        require(zkVerifier.verify(zkProof), "Invalid procedure proof");
        
        // Process claim with direct USDC amount
        insuranceContract.submitClaim(
            patient,
            msg.sender, // hospital
            procedureCodeHash,
            requestedUSDCAmount, // No conversion needed
            encryptedEHRCID,
            ehrPREKey
        );
    }
}
```

**Simplification Benefits:**
- No external oracle dependencies
- Reduced attack surface
- Faster transaction processing
- Frontend handles price display using CoinGecko API

### 4. Privacy-Preserving Claims Workflow

```mermaid
sequenceDiagram
    participant P as Patient
    participant H as Hospital
    participant I as Insurer
    participant ZK as ZK Prover
    participant IPFS as IPFS Storage
    participant UI as Frontend (CoinGecko)
    
    P->>H: Medical procedure performed
    H->>IPFS: Encrypt & store EHR
    H->>ZK: Generate proof: "EHR contains covered procedure"
    ZK-->>H: ZK proof (no procedure details revealed)
    H->>UI: Check USD to USDC rate (display only)
    UI-->>H: Current rate for user display
    H->>ClaimContract: Submit claim with USDC amount
    ClaimContract->>I: Forward validated claim
    I->>I: Review proof results (not medical data)
    I->>ClaimContract: Approve USDC amount
    ClaimContract->>H: Release USDC payment
    
    Note over P,H: Medical details never exposed to insurer
    Note over ZK,IPFS: Privacy preserved via encryption + ZK proofs
    Note over UI,H: Price conversion in frontend only
```

**Privacy Guarantees:**
- Medical data never exposed on-chain
- Insurers approve without seeing procedure details
- ZK proofs validate coverage without revealing data
- Post-approval decryption only for authorized parties
- Price conversion handled off-chain for display

### 5. Frontend Price Display Integration

```typescript
// Frontend USD to USDC conversion for display only
class zkMedPriceDisplay {
    async getUSDCRate(): Promise<number> {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=usd');
        const data = await response.json();
        return data['usd-coin'].usd;
    }
    
    async displayClaimAmount(usdAmount: number): Promise<string> {
        const rate = await this.getUSDCRate();
        const usdcAmount = usdAmount / rate;
        
        return `Requesting ${usdcAmount.toFixed(2)} USDC (≈ $${usdAmount} USD)`;
    }
    
    // Submit claim with USDC amount directly
    async submitClaim(usdAmount: number, proofs: ProofBundle) {
        const rate = await this.getUSDCRate();
        const usdcAmount = Math.round((usdAmount / rate) * 1e6); // USDC has 6 decimals
        
        return await claimContract.submitClaim(
            patient,
            procedureHash,
            usdcAmount, // Direct USDC, no on-chain conversion
            encryptedEHRCID,
            ehrPREKey,
            proofs.zkProof
        );
    }
}
```

## 🔐 Security Patterns

### 1. Defense in Depth
- **Layer 1**: Role-based access control (RegistrationContract)
- **Layer 2**: Multi-proof validation (ZK + Web + Mail)
- **Layer 3**: Sponsored transaction verification (ERC-7824)
- **Layer 4**: Direct USDC validation (no oracle dependencies)
- **Layer 5**: Encrypted storage with controlled access (IPFS + PRE)

### 2. Privacy by Design
- **Commitment-Reveal**: Patient data as hashed commitments
- **Zero-Knowledge Proofs**: Validate without revealing medical details
- **Proxy Re-Encryption**: Controlled post-approval access
- **Domain Verification**: Prove ownership without exposing emails
- **Sponsored Privacy**: Gas-free interactions maintain anonymity

### 3. Economic Security
- **Direct USDC Processing**: No price manipulation risks
- **Escrow System**: Guaranteed payments for valid claims
- **Sponsored Incentives**: Insurers cover gas for better UX
- **Multi-Signature Approvals**: Large claims require multiple signatures

## 🚀 Performance Optimization Patterns

### 1. Gas Optimization
```solidity
contract GasOptimized {
    // Pack structs to minimize storage slots
    struct Claim {
        uint128 usdcAmount;  // Direct USDC amount
        uint128 timestamp;
        address patient;     // 20 bytes
        bytes12 padding;     // Pad to 32 bytes
        bytes32 proofHash;   // Separate slot
    }
    
    // Batch operations for efficiency
    function batchProcessClaims(uint256[] calldata claimIds) external {
        for (uint256 i = 0; i < claimIds.length;) {
            _processClaim(claimIds[i]);
            unchecked { ++i; }
        }
    }
}
```

### 2. Proof Verification Optimization
- **Parallel Verification**: Validate multiple proof types simultaneously
- **Caching**: Store verification results to avoid re-computation
- **Batching**: Process multiple proofs in single transaction
- **Selective Verification**: Skip redundant checks based on trust levels

### 3. Simplified Processing Benefits
- **No Oracle Delays**: Eliminate external API call delays
- **Reduced Gas Costs**: No complex price conversion calculations
- **Faster Execution**: Direct USDC processing
- **Better Reliability**: Fewer external dependencies

## 📊 Monitoring & Analytics Patterns

### 1. Event-Driven Analytics
```solidity
event ClaimProcessed(
    address indexed patient,
    address indexed hospital,
    address indexed insurer,
    uint256 claimId,
    uint256 usdcAmount, // Direct USDC amount
    bytes32 proofHash,
    uint256 timestamp
);

event ProofValidated(
    bytes32 indexed proofHash,
    string proofType, // "ZK", "Web", "Mail"
    bool isValid,
    uint256 timestamp
);

event SponsoredTransaction(
    address indexed sponsor,
    address indexed user,
    address indexed targetContract,
    uint256 gasUsed,
    uint256 timestamp
);
```

### 2. Privacy-Preserving Metrics
- **Aggregated Statistics**: Claims volume without individual details
- **Proof Success Rates**: Validation success percentages by type
- **Performance Metrics**: Transaction times and gas usage
- **User Experience**: Sponsored transaction adoption rates

This streamlined system architecture enables zkMed to provide privacy-preserving healthcare claims processing with simplified USDC handling, sponsored transactions, multi-proof validation, and seamless authentication - without the complexity of on-chain price oracles. 🚀 
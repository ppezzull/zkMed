# Active Context - zkMed Privacy-Preserving Healthcare Platform

## 🎯 EXPANDED SCOPE: Advanced Web3 Healthcare Platform

### Current Status: Registration System COMPLETE → Advanced Claims Processing NEXT
**Registration Phase**: ✅ **PRODUCTION READY** (37/37 tests passing)  
**Advanced Claims Phase**: 🚧 **DESIGN & IMPLEMENTATION PHASE**  
**Integration Target**: vlayer WebProofs/MailProofs + Flare FTSO + ERC-7824 Abstract Accounts + thirdweb  

---

## 🏗️ EXPANDED CONTRACT ARCHITECTURE

### Phase 1: Registration System [COMPLETED] ✅
- **RegistrationContract.sol**: Privacy-preserving patient/organization registration with multi-owner system
- **EmailDomainProver.sol**: vlayer email domain verification
- **Multi-Owner Management**: Up to 10 owners with granular access controls
- **User Activation System**: Enable/disable users with batch operations
- **Status**: Production-ready, 100% test coverage (53/53 tests passing)

### Phase 2: Advanced Claims Processing System [CURRENT FOCUS] 🚧

#### 🔒 1. RegistrationContract.sol [ENHANCED]
**Purpose**: Main registry of roles (Patient, Hospital, Insurer) and proof-based onboarding

**Key Features**:
- `registerPatient(bytes32 commitment)`: Patient anonymous registration
- `registerOrganization(Proof proof, OrganizationVerificationData data, Role role)`: Hospital/insurer onboarding with **MailProof** (vlayer email ZK)
- Role checks: `onlyVerifiedHospital`, `onlyVerifiedInsurer`
- **Future extension**: Add `registerWithWebProof(...)` for web-based organization verification

**Integrations**:
- **MailProofs** via `EmailDomainProver`
- Stores role → `RegistrationStorage`
- **ERC-7824 Gateway** compatibility for meta-transactions

#### 🧑‍⚕️ 2. PatientModule.sol [NEW]
**Purpose**: Patient-specific actions with encrypted EHR management

**Key Features**:
- `uploadEncryptedEHR(string cid, bytes preKey)`: EHR CID + PRE key storage
- `proposeOperation(...)`: Propose encrypted operation with **WebProof**
- `verifyPatientCommitment(string secret)`: Verify patient's health data commitment

**Integrations**:
- **WebProofs** → prove diagnosis/procedure from real patient portal (HIPAA-compliant ZK)
- Adds PRE key for **post-approval decryption**
- Works with ERC-7824 for sponsored patient transactions

#### 🏥 3. OrganizationModule.sol [NEW]
**Purpose**: Hospital/insurer post-verification features

**Key Features**:
- `approveOperation(patient, opId)`: Hospital agrees to operate
- `confirmOperation(opId)`: Final confirmation after surgery
- `getHospitalOperations()`: Hospital views pending operations
- `submitClaimWithWebProof(...)`: Submit claims with WebProof validation

#### 🛡️ 4. InsuranceContract.sol [ENHANCED]
**Purpose**: Manages policy and funds with advanced Web3 integrations

**Key Features**:
- `createPolicy(...)`: Link hashed policy ID with total USDC coverage
- `approveClaim(...)`: Approves operations post-ZK validation
- `disburseFunds(...)`: Sends USDC payout to hospital
- `withdrawPayout()`: Hospital pulls escrowed USDC

**Integrations**:
- **Flare FTSO**: Real-time USD to USDC conversion for claims
- **ERC-7824**: Meta-transaction submission by insurer for `approveClaim()` (sponsored)
- **Removed**: Merit token system (no longer part of architecture)

#### 🌐 5. ERC7824Gateway.sol [NEW] (Nitrolite Abstract Account)
**Purpose**: Meta-transaction router for sponsored transactions

**Key Features**:
- `execute(ERC7824ForwardRequest req, bytes signature)`: Sponsored transaction execution
- **Nonce management** for replay protection
- **Gas sponsorship** for patient and hospital interactions
- **Batch operations** support for multiple contract calls

**Integration Points**:
- All contract interactions can route through this gateway
- Insurers can sponsor patient claim submissions
- Hospitals can have sponsored claim processing

#### 📥 6. ClaimProcessingContract.sol [ENHANCED]
**Purpose**: Advanced ZK proof verification with Web3 integrations

**Key Features**:
- `submitClaim(...)`: Hospital submits claim with multiple proof types
- `submitClaimWithWebProof(...)`: Claims with WebProof validation
- `submitClaimWithSponsoredTx(...)`: Claims via ERC-7824 sponsorship

**Process Flow**:
- Validates **ZK Proof** (procedure validation)
- Validates **WebProof** (patient portal verification)
- Converts USD to token using **Flare FTSO**
- Calls `InsuranceContract.submitClaim(...)`
- Supports **ERC-7824** sponsored transactions

---

## 🔐 ADVANCED PRIVACY-PRESERVING WORKFLOW

### Enhanced Claims Processing with Multiple Proof Types

#### 1. Hospital Multi-Proof Generation
- **WebProof**: Prove procedure validity from hospital system
- **ZK Proof**: Validate encrypted EHR contains covered procedure
- **MailProof**: Verify hospital domain ownership (registration)

#### 2. Real-Time Price Integration (Flare FTSO)
- Dynamic USD→USDC conversion for all claims
- Live oracle data for accurate payouts
- Support for multiple currency pairs

#### 3. Sponsored Transaction Flow (ERC-7824)
- Insurers sponsor patient claim submissions
- Hospitals get sponsored claim processing
- Seamless UX without gas fee barriers

#### 4. Advanced Authentication (thirdweb)
- Social login integration
- Wallet abstraction for users
- Session management for dApps

---

## 🎨 FRONTEND ARCHITECTURE

### 🧑‍💻 Tech Stack
- **Next.js 15** with App Router
- **thirdweb React SDK** for authentication
- **ERC-7824 Nitrolite Client** for abstract accounts
- **vlayer client + verifier SDK** for proof generation
- **IPFS / web3.storage** for encrypted EHR storage
- **Flare FTSO JS SDK** for price data

### 🔐 Authentication Flow (thirdweb)
```typescript
import { useUser, useLogin } from "@thirdweb-dev/react";

const { user } = useUser();
const login = useLogin();

const handleLogin = async () => {
  await login(); // Wallet or social login
};
```

### 💳 ERC-7824 Account Binding
```typescript
import { bindAccount } from "@erc7824/nitrolite";

await bindAccount(provider, {
  accountAddress: user.address,
  gatewayAddress: ERC_7824_GATEWAY,
  chainId: 11155111 // Sepolia
});
```

### 🔏 ZK Operation Proposal by Patient
```typescript
const webProof = await generateWebProof({
  url: "https://mychart.mountsinai.org",
  contentPath: "medicalRecords.recent[0].procedure",
  claim: "HIP-XYZ123"
});

const tx = await gateway.execute({
  req: {
    from: user.address,
    to: ClaimProcessing.address,
    data: ClaimProcessing.interface.encodeFunctionData("submitClaimWithWebProof", [...])
  },
  signature
});
```

---

## 🚧 CURRENT DEVELOPMENT PRIORITIES

### Immediate Next Steps (3-Week Sprint)

#### 1. ERC-7824 Gateway Implementation [HIGH PRIORITY]
- Abstract account setup and management
- Meta-transaction routing logic
- Gas sponsorship mechanisms
- Integration with existing contracts

#### 2. WebProof Integration [HIGH PRIORITY]
- vlayer WebProof SDK integration
- Patient portal proof generation
- Hospital system verification proofs
- Frontend WebProof interfaces

#### 3. Enhanced Claims Processing [HIGH PRIORITY]
- Multi-proof validation system
- Flare FTSO real-time integration
- Sponsored transaction support
- Advanced privacy preservation

#### 4. thirdweb Authentication [MEDIUM PRIORITY]
- Social login implementation
- Wallet abstraction layer
- Session management
- Account binding workflows

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### Flare FTSO Integration Pattern
```solidity
contract ClaimProcessingContract {
    IFlareOracle public flareOracle;
    
    function submitClaim(..., uint256 requestedAmountUSD) external onlyVerifiedHospital {
        // Get current USD/USDC rate from Flare FTSO
        uint256 rate = flareOracle.lzRead(
            chainId,
            "FTSO_USDC_USD", 
            "getPrice"
        );
        
        uint256 tokenAmount = requestedAmountUSD * 1e18 / rate;
        
        // Verify ZK proof
        require(zkVerifier.verifyProof(zkProof), "Invalid procedure proof");
        
        // Verify WebProof if provided
        if (webProof.length > 0) {
            require(webProofVerifier.verify(webProof), "Invalid web proof");
        }
        
        // Forward to insurance contract
        insuranceContract.submitClaim(
            patient,
            hospital, 
            procedureCodeHash,
            tokenAmount,
            encryptedEHRCID,
            ehrPREKey
        );
    }
}
```

### ERC-7824 Meta-Transaction Pattern
```solidity
contract ERC7824Gateway {
    mapping(address => uint256) public nonces;
    
    function execute(
        ERC7824ForwardRequest calldata req,
        bytes calldata signature
    ) external {
        require(nonces[req.from] == req.nonce, "Invalid nonce");
        require(verify(req, signature), "Invalid signature");
        
        nonces[req.from]++;
        
        (bool success, ) = req.to.call(req.data);
        require(success, "Execution failed");
    }
}
```

### vlayer WebProof Integration
```typescript
// Enhanced proof generation with multiple proof types
async function generateMultiProof(
    patientData: PatientData,
    organizationData: OrganizationData
) {
    const [webProof, mailProof] = await Promise.all([
        vlayer.generateWebProof({
            url: patientData.portalUrl,
            contentPath: "procedure.code",
            claim: patientData.procedureCode
        }),
        vlayer.generateMailProof({
            domain: organizationData.domain,
            emailAddress: organizationData.adminEmail,
            targetWallet: organizationData.address
        })
    ]);
    
    return {
        webProof: webProof.proof,
        mailProof: mailProof.proof,
        combinedHash: keccak256(webProof.proof + mailProof.proof)
    };
}
```

---

## 📦 Storage & Off-Chain Services

| Asset               | Location                                 |
| ------------------- | ---------------------------------------- |
| Encrypted EHR       | IPFS / web3.storage                      |
| PRE key             | On-chain (for later decryption)          |
| Domain/email proofs | Verified via vlayer SDK                  |
| Web proofs          | Generated from patient portals           |
| ZK proofs           | Generated off-chain, verified on-chain   |
| USD Price           | Flare FTSO, read live in ClaimProcessing |
| Session data        | thirdweb session management              |

---

## ✅ Integration Summary

| Component                 | Role                                         | Protocol                   |
| ------------------------- | -------------------------------------------- | -------------------------- |
| `RegistrationContract`    | Identity & role registration                 | MailProofs, thirdweb       |
| `PatientModule`           | EHR uploads, ZK operation proposal           | WebProofs, ERC-7824        |
| `OrganizationModule`      | Operation approvals, confirmations           | thirdweb login, WebProofs  |
| `InsuranceContract`       | Coverage logic, payout flow                  | FTSO, ERC-7824 sponsorship |
| `ClaimProcessingContract` | Multi-proof validation, claim forwarding     | ZK-SNARKs, WebProofs, FTSO |
| `ERC7824Gateway`          | Executes sponsored txs for abstract accounts | ERC-7824, Nitrolite        |

--- 
# Active Context - zkMed Privacy-Preserving Healthcare Platform

## 🎯 EXPANDED SCOPE: Full Healthcare Claims Processing Platform

### Current Status: Registration System COMPLETE → Claims Processing NEXT
**Registration Phase**: ✅ **PRODUCTION READY** (37/37 tests passing)  
**Claims Processing Phase**: 🚧 **DESIGN & IMPLEMENTATION PHASE**  
**Integration Target**: vlayer + Blockscout + Flare for maximum hackathon impact  

---

## 🏗️ EXPANDED CONTRACT ARCHITECTURE

### Phase 1: Registration System [COMPLETED] ✅
- **RegistrationContract.sol**: Privacy-preserving patient/organization registration with multi-owner system
- **EmailDomainProver.sol**: vlayer email domain verification
- **Multi-Owner Management**: Up to 10 owners with granular access controls
- **User Activation System**: Enable/disable users with batch operations
- **Status**: Production-ready, 100% test coverage (53/53 tests passing)

### Phase 2: Claims Processing System [CURRENT FOCUS] 🚧

#### ClaimProcessingContract.sol [NEW]
**Purpose**: Handle encrypted EHR submission with ZK proofs
**Key Features**:
- Encrypted EHR storage on IPFS
- Zero-knowledge proof verification (procedure code validation)
- Flare FTSO integration for USD→token conversion
- Forward validated claims to InsuranceContract

**Core Functions**:
```solidity
function submitClaim(
    address patient,
    bytes32 procedureCodeHash,  // Hash only, never plaintext
    uint256 requestedAmountUSD,
    string encryptedEHRCID,     // IPFS CID of encrypted medical record
    bytes ehrPREKey,            // Proxy re-encryption key for post-approval decryption
    bytes zkProof               // Proof that encrypted EHR contains valid covered procedure
) external onlyHospital
```

#### InsuranceContract.sol [NEW] 
**Purpose**: Policy management and claims approval
**Key Features**:
- On-chain policy storage (coverage amounts, usage tracking)
- Claims approval/rejection by insurers
- Hospital escrow and payout system
- Integration with MeritsToken for rewards

**Core Data Structures**:
```solidity
struct Policy {
    uint256 totalCoverage;      // e.g. $10,000
    uint256 usedCoverage;       // e.g. $2,000 already claimed
    address patientAddress;
    bytes32 policyIdHash;       // Hash of off-chain policy ID
    string policyMetadataCID;   // IPFS pointer to encrypted policy details
    bool isActive;
}

struct Claim {
    uint256 claimId;
    address patientAddress;
    address hospitalAddress;
    bytes32 procedureCodeHash;  // Never stores actual procedure text
    uint256 requestedAmount;    // In on-chain tokens
    string encryptedEHRCID;     // IPFS CID
    bytes ehrPREKey;            // For post-approval decryption
    ClaimStatus status;         // Submitted, Approved, Rejected
}
```

#### MeritsTokenContract.sol [NEW]
**Purpose**: ERC-20 reward token for successful claims
**Blockscout Integration**: 
- Mint merits for patients and hospitals on claim approval
- Frontend displays merit balances via Blockscout Merits API
- All transactions link to Blockscout Explorer

---

## 🔐 PRIVACY-PRESERVING CLAIMS WORKFLOW

### The Core Innovation: Insurance Without Revealing Procedures

**Problem Solved**: Patients can receive insurance coverage without insurers ever learning the exact medical procedure performed.

### Step-by-Step Privacy Flow:

#### 1. Hospital Encrypts Medical Data
- Hospital encrypts patient's EHR (Electronic Health Record) off-chain
- Uploads encrypted file to IPFS → `encryptedEHRCID`
- Generates `procedureCodeHash = keccak256("HIP-123")` (hash only)

#### 2. Zero-Knowledge Proof Generation (vlayer)
- Hospital creates ZK proof: "This encrypted EHR contains a procedure code that is covered by the patient's policy"
- **Critical**: Proof validates coverage WITHOUT revealing which procedure
- Insurer sees only: ✅ "Valid covered procedure" or ❌ "Invalid/uncovered"

#### 3. Real-Time Price Conversion (Flare FTSO)
- Hospital requests $1,200 for procedure
- ClaimProcessingContract calls Flare FTSO via `lzRead()`
- Gets current USD→USDC conversion rate
- Converts to exact on-chain token amount

#### 4. Claims Submission & Approval
- Insurer reviews ZK proof result + requested amount
- Approves based on: "Valid procedure ✅" + "Sufficient coverage ✅"
- **Never sees**: Actual procedure code, patient diagnosis, medical details

#### 5. Post-Approval Decryption (Proxy Re-Encryption)
- Only AFTER approval, contract releases `ehrPREKey`
- Hospital/auditor can decrypt EHR for record-keeping
- Insurer still cannot decrypt without additional keys

---

## 🎯 HACKATHON PRIZE STRATEGY

### Target Integrations & Prize Mapping

#### vlayer Integration → **Best use of vlayer Email Proofs** + **Most inspiring use of vlayer**
- **Email Proofs**: Organization domain verification (already completed)
- **ZK Proofs**: Medical procedure validation without data exposure
- **Innovation**: First privacy-preserving healthcare claims with vlayer

#### Flare Integration → **Flare FTSO Track** + **External Data Source Track**
- **FTSO**: Real-time USD→stablecoin price conversion for claims
- **FDC (Optional)**: Pull hospital license verification data
- **Use Case**: Dynamic claim amount calculation with real-world pricing

#### Blockscout Integration → **Best use of Blockscout Merits** + **Explorer Pool**
- **Merits Token**: Mint rewards for successful claims (patients + hospitals)
- **Explorer Links**: All transactions point to Blockscout instead of Etherscan
- **API Integration**: Frontend displays merit balances via Blockscout Merits API

---

## 🚧 CURRENT DEVELOPMENT PRIORITIES

### Immediate Next Steps (2-Week Sprint)

#### 1. ClaimProcessingContract Implementation [HIGH PRIORITY]
- ZK proof verification integration with vlayer
- Flare FTSO price oracle integration
- IPFS CID storage for encrypted EHRs
- Forward approved claims to InsuranceContract

#### 2. InsuranceContract Development [HIGH PRIORITY]  
- Policy creation and management
- Claims approval workflow
- Hospital escrow and payout system
- Integration with MeritsToken minting

#### 3. MeritsTokenContract [MEDIUM PRIORITY]
- ERC-20 implementation with mint functionality
- Role-based minting (only InsuranceContract can mint)
- Blockscout Merits API compatibility

#### 4. Frontend Integration [PARALLEL WORK]
- Claims submission interface for hospitals
- Policy management dashboard for insurers
- ZK proof status monitoring
- Blockscout merit balance display

---

## 🔧 TECHNICAL IMPLEMENTATION DETAILS

### Flare FTSO Integration Pattern
```solidity
contract ClaimProcessingContract {
    IFlareOracle public flareOracle;
    
    function submitClaim(..., uint256 requestedAmountUSD) external {
        // Get current USD/USDC rate from Flare FTSO
        uint256 rate = flareOracle.lzRead(
            chainId,
            "FTSO_USDC_USD", 
            "getPrice"
        );
        
        uint256 tokenAmount = requestedAmountUSD * 1e18 / rate;
        
        // Verify ZK proof
        require(zkVerifier.verifyProof(zkProof), "Invalid procedure proof");
        
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

### vlayer ZK Proof Integration
```typescript
// vlayer proof generation
async function generateProcedureProof(
    encryptedEHR: string,
    allowedProcedureCodes: string[],
    patientAddress: string
) {
    const proof = await vlayer.prove({
        circuit: "procedure_validation",
        inputs: {
            encryptedEHR,
            allowedCodes: allowedProcedureCodes,
            patientWallet: patientAddress
        }
    });
    
    return {
        proofBlob: proof.proof,
        procedureCodeHash: proof.outputs.procedureHash,
        isValid: proof.outputs.isValidProcedure
    };
}
```

### Blockscout Merits Integration
```solidity
contract MeritsTokenContract is ERC20 {
    function mintClaimRewards(
        address patient,
        address hospital,
        uint256 claimAmount
    ) external onlyInsuranceContract {
        uint256 patientMerits = calculatePatientMerits(claimAmount);
        uint256 hospitalMerits = calculateHospitalMerits(claimAmount);
        
        _mint(patient, patientMerits);
        _mint(hospital, hospitalMerits);
        
        emit MeritsMinted(patient, patientMerits);
        emit MeritsMinted(hospital, hospitalMerits);
    }
}
```

---

## 📊 SUCCESS METRICS FOR EXPANDED PLATFORM

### Technical Achievements Target
- [ ] ZK proof verification working end-to-end
- [ ] Flare FTSO price conversion accurate within 1%
- [ ] Encrypted EHR storage/retrieval via IPFS
- [ ] Merit token minting on claim approval
- [ ] 100% test coverage for new contracts

### Privacy Guarantees Target
- [ ] Zero medical data exposed on-chain
- [ ] Insurer approval without seeing procedure details
- [ ] Post-approval decryption working correctly
- [ ] Proxy re-encryption key security validated

### Integration Success Target
- [ ] vlayer email + ZK proofs working seamlessly
- [ ] Flare FTSO live price data integration
- [ ] Blockscout merit balances displaying correctly
- [ ] All transaction links pointing to Blockscout

---

## 🎉 EXPANDED VISION: zkMed Platform

**From**: Simple registration system  
**To**: Complete privacy-preserving healthcare claims platform

**Core Innovation**: Patients receive insurance coverage for medical procedures WITHOUT insurers ever learning what procedure was performed - only that it was valid and covered.

**Hackathon Impact**: Targets 6+ prize categories across vlayer, Flare, and Blockscout with substantial, innovative integrations.

**Next Phase**: Full-stack development of claims processing with ZK proofs, real-time oracles, and merit rewards system.

The registration system was just the foundation - now we build the revolutionary privacy-preserving claims platform! 🚀 
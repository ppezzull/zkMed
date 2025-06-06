# Claims Processing Implementation Plan

## 🎯 MISSION: Privacy-Preserving Healthcare Claims

**Revolutionary Goal**: Enable patients to receive insurance coverage for medical procedures WITHOUT insurers ever learning what procedure was performed.

**Core Innovation**: Cryptographic proof of procedure validity without data exposure.

---

## 🏗️ CONTRACT IMPLEMENTATION ROADMAP

### Contract 1: ClaimProcessingContract.sol [PRIORITY 1]

#### Purpose & Innovation
- **Core Function**: Validate medical claims through zero-knowledge proofs
- **Privacy Breakthrough**: Prove "procedure is covered" without revealing procedure
- **Real-World Integration**: Live USD→token price conversion via Flare FTSO

#### Implementation Plan

##### Phase 1.1: Basic Structure (Days 1-2)
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./interfaces/IVlayerVerifier.sol";
import "./interfaces/IFlareOracle.sol";
import "./interfaces/IInsuranceContract.sol";

contract ClaimProcessingContract {
    struct ClaimSubmission {
        address patient;
        address hospital;
        bytes32 procedureCodeHash;     // keccak256(procedure_code) only
        uint256 requestedAmountUSD;    // Amount in USD cents (e.g. 120000 = $1,200)
        string encryptedEHRCID;        // IPFS CID of encrypted medical record
        bytes ehrPREKey;               // Proxy re-encryption key for post-approval access
        bytes zkProof;                 // vlayer proof: "EHR contains valid covered procedure"
        uint256 timestamp;
    }
    
    struct ProcessedClaim {
        uint256 claimId;
        ClaimSubmission submission;
        uint256 convertedTokenAmount;   // USD amount converted to tokens
        uint256 usdcRate;              // Exchange rate used
        ClaimStatus status;            // Processing, Forwarded, Failed
        string processingNotes;
    }
    
    enum ClaimStatus { 
        Processing,    // ZK proof being verified
        Forwarded,     // Successfully sent to insurance contract
        Failed         // Verification failed
    }
    
    // State variables
    IVlayerVerifier public vlayerVerifier;
    IFlareOracle public flareOracle;
    IInsuranceContract public insuranceContract;
    
    mapping(uint256 => ProcessedClaim) public processedClaims;
    mapping(address => bool) public registeredHospitals;
    mapping(address => bool) public registeredPatients;
    
    uint256 public nextClaimId = 1;
    uint256 public constant PRICE_FRESHNESS_THRESHOLD = 300; // 5 minutes
    
    // Events
    event ClaimSubmitted(uint256 indexed claimId, address indexed patient, address indexed hospital);
    event ClaimProcessed(uint256 indexed claimId, uint256 tokenAmount, uint256 exchangeRate);
    event ClaimForwarded(uint256 indexed claimId, address insuranceContract);
    event ClaimFailed(uint256 indexed claimId, string reason);
}
```

##### Phase 1.2: vlayer ZK Proof Integration (Days 3-4)
```solidity
function submitClaim(ClaimSubmission memory submission) external {
    require(registeredHospitals[msg.sender], "Only registered hospitals");
    require(registeredPatients[submission.patient], "Patient not registered");
    require(submission.requestedAmountUSD > 0, "Invalid amount");
    require(bytes(submission.encryptedEHRCID).length > 0, "Missing EHR CID");
    
    uint256 claimId = nextClaimId++;
    
    // Step 1: Verify zero-knowledge proof with vlayer
    bool proofValid = vlayerVerifier.verifyProcedureProof(
        submission.zkProof,
        submission.procedureCodeHash,
        submission.patient,
        submission.encryptedEHRCID
    );
    
    if (!proofValid) {
        processedClaims[claimId] = ProcessedClaim({
            claimId: claimId,
            submission: submission,
            convertedTokenAmount: 0,
            usdcRate: 0,
            status: ClaimStatus.Failed,
            processingNotes: "ZK proof verification failed"
        });
        
        emit ClaimFailed(claimId, "Invalid procedure proof");
        return;
    }
    
    // Continue to price conversion...
    _processValidClaim(claimId, submission);
    
    emit ClaimSubmitted(claimId, submission.patient, submission.hospital);
}

function _processValidClaim(uint256 claimId, ClaimSubmission memory submission) internal {
    // Step 2: Get real-time USD/USDC rate from Flare FTSO
    (uint256 usdcRate, uint256 priceTimestamp) = flareOracle.getPrice("USD", "USDC");
    
    require(
        block.timestamp - priceTimestamp <= PRICE_FRESHNESS_THRESHOLD,
        "Price data too stale"
    );
    
    // Step 3: Convert USD to tokens (assuming 6 decimals for USDC)
    uint256 tokenAmount = (submission.requestedAmountUSD * 1e6) / usdcRate;
    
    // Step 4: Store processed claim
    processedClaims[claimId] = ProcessedClaim({
        claimId: claimId,
        submission: submission,
        convertedTokenAmount: tokenAmount,
        usdcRate: usdcRate,
        status: ClaimStatus.Processing,
        processingNotes: "Price converted, forwarding to insurance"
    });
    
    emit ClaimProcessed(claimId, tokenAmount, usdcRate);
    
    // Step 5: Forward to insurance contract
    _forwardToInsurance(claimId, tokenAmount);
}
```

##### Phase 1.3: Flare FTSO Price Oracle Integration (Day 5)
```solidity
interface IFlareOracle {
    function getPrice(string memory base, string memory quote) 
        external view returns (uint256 price, uint256 timestamp);
    
    function getPriceWithProof(string memory base, string memory quote)
        external view returns (uint256 price, uint256 timestamp, bytes memory proof);
}

function _forwardToInsurance(uint256 claimId, uint256 tokenAmount) internal {
    ProcessedClaim storage claim = processedClaims[claimId];
    
    try insuranceContract.submitClaim(
        claim.submission.patient,
        claim.submission.hospital,
        claim.submission.procedureCodeHash,
        tokenAmount,
        claim.submission.encryptedEHRCID,
        claim.submission.ehrPREKey
    ) {
        claim.status = ClaimStatus.Forwarded;
        claim.processingNotes = "Successfully forwarded to insurance";
        
        emit ClaimForwarded(claimId, address(insuranceContract));
    } catch Error(string memory reason) {
        claim.status = ClaimStatus.Failed;
        claim.processingNotes = string(abi.encodePacked("Insurance forwarding failed: ", reason));
        
        emit ClaimFailed(claimId, reason);
    }
}

// Price freshness validation
function isPriceDataFresh() external view returns (bool) {
    (, uint256 timestamp) = flareOracle.getPrice("USD", "USDC");
    return block.timestamp - timestamp <= PRICE_FRESHNESS_THRESHOLD;
}

// Emergency price override (admin only)
function forceProcessClaimWithCustomRate(
    uint256 claimId, 
    uint256 customRate
) external onlyAdmin {
    ProcessedClaim storage claim = processedClaims[claimId];
    require(claim.status == ClaimStatus.Failed, "Claim not in failed state");
    
    uint256 tokenAmount = (claim.submission.requestedAmountUSD * 1e6) / customRate;
    claim.convertedTokenAmount = tokenAmount;
    claim.usdcRate = customRate;
    claim.processingNotes = "Processed with admin override rate";
    
    _forwardToInsurance(claimId, tokenAmount);
}
```

---

### Contract 2: InsuranceContract.sol [PRIORITY 2]

#### Purpose & Innovation
- **Policy Management**: Track coverage without exposing personal data
- **Claims Approval**: Insurers approve based only on ZK proof results
- **Escrow System**: Secure hospital payments with merit rewards

#### Implementation Plan

##### Phase 2.1: Policy Management (Days 1-2)
```solidity
contract InsuranceContract {
    struct Policy {
        uint256 totalCoverage;         // Annual coverage limit in USD cents
        uint256 usedCoverage;          // Amount already claimed this period
        address patientAddress;        // Patient's wallet address
        bytes32 policyIdHash;          // keccak256(policy_number) - never store plaintext
        string policyMetadataCID;      // IPFS CID → encrypted policy details
        address insurerAddress;        // Which insurer issued this policy
        bool isActive;
        uint256 policyPeriodStart;     // Policy period start timestamp
        uint256 policyPeriodEnd;       // Policy period end timestamp
        uint256 createdAt;
    }
    
    struct Claim {
        uint256 claimId;
        address patientAddress;
        address hospitalAddress;
        bytes32 procedureCodeHash;      // Only hash of procedure, never plaintext
        uint256 requestedAmount;        // In USDC (6 decimals)
        string encryptedEHRCID;         // IPFS CID of encrypted medical record
        bytes ehrPREKey;                // Proxy re-encryption key for post-approval
        ClaimStatus status;
        uint256 submissionTimestamp;
        uint256 reviewTimestamp;
        address reviewerInsurer;        // Which insurer reviewed this claim
        string reviewNotes;             // Encrypted notes from insurer
    }
    
    enum ClaimStatus { 
        Submitted,     // Awaiting insurer review
        Approved,      // Insurer approved, payment authorized
        Rejected,      // Insurer rejected claim
        Paid           // Hospital has withdrawn payment
    }
    
    // State mappings
    mapping(address => Policy) public policies;
    mapping(uint256 => Claim) public claims;
    mapping(address => uint256) public hospitalEscrowBalance;
    mapping(address => bool) public registeredInsurers;
    mapping(address => uint256[]) public patientClaims;
    mapping(address => uint256[]) public hospitalClaims;
    
    uint256 public nextClaimId = 1;
    IMeritsToken public meritsToken;
    
    // Events
    event PolicyCreated(address indexed patient, address indexed insurer, uint256 totalCoverage);
    event ClaimSubmitted(uint256 indexed claimId, address indexed patient, address indexed hospital);
    event ClaimApproved(uint256 indexed claimId, uint256 amount, address indexed insurer);
    event ClaimRejected(uint256 indexed claimId, string reason, address indexed insurer);
    event PayoutWithdrawn(address indexed hospital, uint256 amount);
    event MeritsAwarded(address indexed recipient, uint256 amount, string reason);
}
```

##### Phase 2.2: Claims Processing & Approval (Days 3-4)
```solidity
function createPolicy(
    address patientAddress,
    string memory policyNumber,    // Will be hashed, never stored
    uint256 totalCoverageUSD,     // In USD cents
    string memory policyMetadataCID,
    uint256 policyDurationMonths
) external onlyRegisteredInsurer {
    require(policies[patientAddress].patientAddress == address(0), "Policy already exists");
    require(totalCoverageUSD > 0, "Invalid coverage amount");
    
    bytes32 policyIdHash = keccak256(abi.encodePacked(policyNumber, block.timestamp));
    
    policies[patientAddress] = Policy({
        totalCoverage: totalCoverageUSD,
        usedCoverage: 0,
        patientAddress: patientAddress,
        policyIdHash: policyIdHash,
        policyMetadataCID: policyMetadataCID,
        insurerAddress: msg.sender,
        isActive: true,
        policyPeriodStart: block.timestamp,
        policyPeriodEnd: block.timestamp + (policyDurationMonths * 30 days),
        createdAt: block.timestamp
    });
    
    emit PolicyCreated(patientAddress, msg.sender, totalCoverageUSD);
}

function submitClaim(
    address patient,
    address hospital,
    bytes32 procedureCodeHash,
    uint256 requestedAmount,      // In USDC tokens (6 decimals)
    string memory encryptedEHRCID,
    bytes memory ehrPREKey
) external onlyClaimProcessingContract {
    Policy storage policy = policies[patient];
    require(policy.isActive, "Policy not active");
    require(block.timestamp <= policy.policyPeriodEnd, "Policy expired");
    require(policy.usedCoverage + requestedAmount <= policy.totalCoverage, "Insufficient coverage");
    
    uint256 claimId = nextClaimId++;
    
    claims[claimId] = Claim({
        claimId: claimId,
        patientAddress: patient,
        hospitalAddress: hospital,
        procedureCodeHash: procedureCodeHash,
        requestedAmount: requestedAmount,
        encryptedEHRCID: encryptedEHRCID,
        ehrPREKey: ehrPREKey,
        status: ClaimStatus.Submitted,
        submissionTimestamp: block.timestamp,
        reviewTimestamp: 0,
        reviewerInsurer: address(0),
        reviewNotes: ""
    });
    
    // Track claims by patient and hospital
    patientClaims[patient].push(claimId);
    hospitalClaims[hospital].push(claimId);
    
    emit ClaimSubmitted(claimId, patient, hospital);
}

function approveClaim(uint256 claimId, string memory reviewNotes) external onlyRegisteredInsurer {
    Claim storage claim = claims[claimId];
    Policy storage policy = policies[claim.patientAddress];
    
    require(claim.status == ClaimStatus.Submitted, "Claim not in submitted state");
    require(policy.insurerAddress == msg.sender, "Not the policy insurer");
    require(policy.usedCoverage + claim.requestedAmount <= policy.totalCoverage, "Would exceed coverage");
    
    // Update policy usage
    policy.usedCoverage += claim.requestedAmount;
    
    // Credit hospital escrow
    hospitalEscrowBalance[claim.hospitalAddress] += claim.requestedAmount;
    
    // Update claim status
    claim.status = ClaimStatus.Approved;
    claim.reviewTimestamp = block.timestamp;
    claim.reviewerInsurer = msg.sender;
    claim.reviewNotes = reviewNotes;
    
    // Award merit points (Blockscout integration)
    _awardMerits(claim.patientAddress, claim.hospitalAddress, claim.requestedAmount);
    
    emit ClaimApproved(claimId, claim.requestedAmount, msg.sender);
}

function _awardMerits(address patient, address hospital, uint256 claimAmount) internal {
    // Convert USDC amount to merit points
    // Example: 10 merits per $100 claimed for patients, 5 for hospitals
    uint256 patientMerits = (claimAmount * 10) / (100 * 1e6);  // Divide by 100 USD in 6 decimals
    uint256 hospitalMerits = (claimAmount * 5) / (100 * 1e6);
    
    meritsToken.mintClaimRewards(patient, hospital, patientMerits, hospitalMerits);
    
    emit MeritsAwarded(patient, patientMerits, "SUCCESSFUL_CLAIM_PATIENT");
    emit MeritsAwarded(hospital, hospitalMerits, "SUCCESSFUL_CLAIM_HOSPITAL");
}
```

---

### Contract 3: MeritsTokenContract.sol [PRIORITY 3]

#### Purpose & Innovation
- **Incentive System**: Reward successful claims processing
- **Blockscout Integration**: Merit balances visible via Blockscout Merits API
- **Gamification**: Encourage proper use of the healthcare system

#### Implementation Plan

##### Phase 3.1: ERC-20 Merit Token (Days 1-2)
```solidity
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MeritsTokenContract is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    
    struct MeritTransaction {
        address recipient;
        uint256 amount;
        string reason;
        uint256 timestamp;
        uint256 associatedClaimId;  // Links back to the claim that generated merits
    }
    
    // Tracking for Blockscout integration
    mapping(address => MeritTransaction[]) public userMeritHistory;
    mapping(address => uint256) public lifetimeMeritsEarned;
    mapping(string => uint256) public meritsByCategory;  // Track different types of merit earnings
    
    uint256 public totalMeritsAwarded;
    uint256 public totalUniqueMeritRecipients;
    
    // Merit rate constants (can be updated by admin)
    uint256 public patientClaimMeritRate = 10;    // 10 merits per $100 claimed
    uint256 public hospitalProcessingMeritRate = 5; // 5 merits per $100 processed
    uint256 public insurerApprovalMeritRate = 2;  // 2 merits per $100 approved
    
    // Events for Blockscout tracking
    event MeritsMinted(address indexed recipient, uint256 amount, string reason, uint256 claimId);
    event MeritRatesUpdated(uint256 patientRate, uint256 hospitalRate, uint256 insurerRate);
    
    constructor() ERC20("zkMed Merits", "ZKMERITS") {
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    
    function mintClaimRewards(
        address patient,
        address hospital, 
        uint256 patientMerits,
        uint256 hospitalMerits
    ) external onlyRole(MINTER_ROLE) {
        require(patient != address(0) && hospital != address(0), "Invalid addresses");
        require(patientMerits > 0 && hospitalMerits > 0, "Invalid merit amounts");
        
        // Mint merits
        _mint(patient, patientMerits);
        _mint(hospital, hospitalMerits);
        
        // Track for first-time recipients
        if (lifetimeMeritsEarned[patient] == 0) {
            totalUniqueMeritRecipients++;
        }
        if (lifetimeMeritsEarned[hospital] == 0) {
            totalUniqueMeritRecipients++;
        }
        
        // Update lifetime totals
        lifetimeMeritsEarned[patient] += patientMerits;
        lifetimeMeritsEarned[hospital] += hospitalMerits;
        totalMeritsAwarded += patientMerits + hospitalMerits;
        
        // Update category tracking
        meritsByCategory["PATIENT_CLAIMS"] += patientMerits;
        meritsByCategory["HOSPITAL_PROCESSING"] += hospitalMerits;
        
        // Record transactions for history
        _recordMeritTransaction(patient, patientMerits, "SUCCESSFUL_CLAIM_PATIENT", 0);
        _recordMeritTransaction(hospital, hospitalMerits, "SUCCESSFUL_CLAIM_HOSPITAL", 0);
        
        emit MeritsMinted(patient, patientMerits, "PATIENT_CLAIM_REWARD", 0);
        emit MeritsMinted(hospital, hospitalMerits, "HOSPITAL_PROCESSING_REWARD", 0);
    }
    
    function _recordMeritTransaction(
        address recipient, 
        uint256 amount, 
        string memory reason,
        uint256 claimId
    ) internal {
        userMeritHistory[recipient].push(MeritTransaction({
            recipient: recipient,
            amount: amount,
            reason: reason,
            timestamp: block.timestamp,
            associatedClaimId: claimId
        }));
    }
}
```

##### Phase 3.2: Blockscout Merits API Integration (Days 3-4)
```solidity
// Blockscout Merits API compatibility functions
function getUserMerits(address user) external view returns (uint256) {
    return balanceOf(user);
}

function getUserMeritsHistory(address user) external view returns (MeritTransaction[] memory) {
    return userMeritHistory[user];
}

function getUserLifetimeMerits(address user) external view returns (uint256) {
    return lifetimeMeritsEarned[user];
}

// Additional analytics for Blockscout dashboard
function getGlobalMeritStats() external view returns (
    uint256 totalAwarded,
    uint256 uniqueRecipients,
    uint256 patientMerits,
    uint256 hospitalMerits,
    uint256 insurerMerits
) {
    return (
        totalMeritsAwarded,
        totalUniqueMeritRecipients,
        meritsByCategory["PATIENT_CLAIMS"],
        meritsByCategory["HOSPITAL_PROCESSING"],
        meritsByCategory["INSURER_APPROVALS"]
    );
}

function getTopMeritHolders(uint256 limit) external view returns (
    address[] memory holders,
    uint256[] memory balances
) {
    // Implementation for leaderboard functionality
    // Note: This would require additional tracking for efficiency
}

// Admin functions for merit rate adjustments
function updateMeritRates(
    uint256 newPatientRate,
    uint256 newHospitalRate,
    uint256 newInsurerRate
) external onlyRole(ADMIN_ROLE) {
    patientClaimMeritRate = newPatientRate;
    hospitalProcessingMeritRate = newHospitalRate;
    insurerApprovalMeritRate = newInsurerRate;
    
    emit MeritRatesUpdated(newPatientRate, newHospitalRate, newInsurerRate);
}

// Special merit awards for exceptional behavior
function awardSpecialMerits(
    address recipient,
    uint256 amount,
    string memory reason
) external onlyRole(ADMIN_ROLE) {
    _mint(recipient, amount);
    lifetimeMeritsEarned[recipient] += amount;
    totalMeritsAwarded += amount;
    
    _recordMeritTransaction(recipient, amount, reason, 0);
    emit MeritsMinted(recipient, amount, reason, 0);
}
```

---

## 🎯 HACKATHON INTEGRATION CHECKLIST

### vlayer Integration ✅ + 🚧
- [x] **Email Proofs**: Domain verification for organizations (completed)
- [ ] **ZK Medical Proofs**: Procedure validity without data exposure (in progress)
- [ ] **Proof Verification**: On-chain validation of medical claims
- [ ] **Circuit Design**: "Encrypted EHR contains covered procedure" circuit

### Flare Integration 🚧
- [ ] **FTSO Price Oracle**: Real-time USD→USDC conversion
- [ ] **Price Freshness**: Validation of price data timeliness
- [ ] **Fallback Mechanisms**: Admin override for stale price data
- [ ] **Multi-Currency Support**: Support for different stablecoins

### Blockscout Integration 🚧
- [ ] **Merit Token**: ERC-20 implementation with minting
- [ ] **Merits API**: Compatible with Blockscout Merits API
- [ ] **Explorer Links**: All transactions link to Blockscout
- [ ] **Analytics Dashboard**: Merit statistics and leaderboards

---

## 🚀 DEPLOYMENT & TESTING STRATEGY

### Testing Phases

#### Phase 1: Unit Testing (Parallel with implementation)
- ClaimProcessingContract function testing
- vlayer ZK proof mock integration
- Flare price oracle mock testing
- Merit token minting and tracking

#### Phase 2: Integration Testing
- End-to-end claims flow testing
- Real vlayer proof generation and verification
- Live Flare FTSO price data integration
- Blockscout API compatibility validation

#### Phase 3: End-to-End Validation
- Complete claims workflow with real medical data (test data)
- Privacy validation: ensure no medical PHI exposure
- Performance testing: gas optimization
- Security testing: edge cases and attack vectors

### Deployment Sequence
1. **MeritsTokenContract**: Deploy first (no dependencies)
2. **InsuranceContract**: Deploy second (depends on MeritsToken)
3. **ClaimProcessingContract**: Deploy third (depends on InsuranceContract)
4. **System Integration**: Wire all contracts together
5. **Testing & Validation**: Comprehensive system testing

---

## 📈 SUCCESS METRICS

### Technical Metrics
- [ ] ZK proof verification: >95% success rate
- [ ] Price oracle calls: <5 second latency
- [ ] Gas costs: Within target ranges
- [ ] Zero medical data leakage: 100% validation

### Privacy Metrics
- [ ] Insurers approve claims without seeing procedure details
- [ ] Medical records remain encrypted until post-approval
- [ ] Only hashes and proofs stored on-chain
- [ ] Patient identity preserved through commitments

### Integration Metrics
- [ ] vlayer proofs working seamlessly
- [ ] Flare price data accurate and timely
- [ ] Blockscout merit balances displaying correctly
- [ ] All transactions visible on Blockscout Explorer

**This implementation plan will deliver the world's first privacy-preserving healthcare claims system with multi-protocol integration!** 🚀 
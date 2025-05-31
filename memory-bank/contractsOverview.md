# zkMed Contracts Overview - Complete System Architecture

**Purpose**: Birds-eye view of every on-chain contract in the zkMed privacy-preserving healthcare claims system, organized by responsibilities and interactions.

---

## 🏗️ CONTRACT HIERARCHY & RESPONSIBILITIES

### 1. EmailDomainProver.sol (vlayer Prover)

**Role**: Off-chain ZK engine that vlayer uses to verify institutional control of email domains.

**Core Function**: Inspects incoming emails (captured by vlayer's notaries), extracts "From:" address, target wallet (from subject), and domain, then builds ZK-proof showing:
1. Sender's `From:` address belonged to approved admin addresses (`admin@mountsinai.org`, `info@...`, etc.)
2. `Subject:` contained correct target wallet (`"Register organization Mount Sinai for 0x1234..."`)
3. Domain (`mountsinai.org`) was consistent across email's "From:" and JSON data

**Key Functions**:
- `verifyDomainOwnership(UnverifiedEmail calldata) → (Proof, domain, emailHash, targetWallet)`
- `verifyOrganization(UnverifiedEmail calldata) → (Proof, OrganizationVerificationData)`
- `simpleDomainVerification(UnverifiedEmail calldata, address) → (Proof, domain, emailHash)`

**Privacy Guarantee**: Prevents anyone from impersonating `admin@mountsinai.org`. Only genuine admin-sent emails yield valid ZK-proofs.

---

### 2. RegistrationContract.sol (Main Verifier & Registry)

**Role**: Root of trust for all user identities (Patients, Hospitals, Insurers, Admins). Enforces vlayer proofs and records verified addresses, roles, domains, and timestamps.

**Primary Responsibilities**:

#### Patient Registration (Privacy-Preserving):
```solidity
registerPatient(bytes32 commitment)
```
- Stores keccak256-style commitment (secret ∥ address)
- Auto-verifies patient (no off-chain proof needed)

#### Organization Registration (Two Options):

**Two-Step Flow**:
1. `verifyDomainOwnership(Proof proof, bytes32 emailHash, address targetWallet, string domain)`
   - Checks vlayer proof from `EmailDomainProver.verifyDomainOwnership`
   - Marks `domainToAddress[domain] = msg.sender` and `usedEmailHashes[emailHash] = true`

2. `completeOrganizationRegistration(string name, string domain, Role role)`
   - Verifies provided domain was previously "reserved" by same address
   - Assigns `roles[msg.sender] = Role.Hospital` or `Role.Insurer`
   - Sets `organizations[msg.sender] = { name, domain, role, verified=true, emailHash }`

**Single-Step Flow**:
```solidity
registerOrganization(Proof proof, OrganizationVerificationData orgData, Role role)
```
- Validates `EmailDomainProver.verifyOrganization` in one shot (domain + targetWallet + emailHash)
- Immediately registers `organizations[msg.sender]` with `verified = true`

#### Legacy "Simple" Domain Flow (backwards compatibility):
```solidity
verifyAndStoreURL(Proof proof, string domain, bytes32 emailHash)
```
- Validates `EmailDomainProver.simpleDomainVerification`
- Reserves domain and `usedEmailHashes[emailHash] = true`
- Caller still needs `completeOrganizationRegistration(...)` to finalize

#### Admin Functions:
- `addAdmin(address)`, `removeAdmin(address)`
- `updateVerificationStatus(address, bool)` & `resetEmailHash(bytes32)` (emergency overrides)

**Key State Variables**:
- `mapping(address → Role) roles;`
- `mapping(address → bool) verified;`
- `mapping(address → Organization) organizations;`
- `mapping(string → address) domainToAddress;`
- `mapping(bytes32 → bool) usedEmailHashes;`
- `mapping(address → bytes32) patientCommitments; // for patients`

**Security Guarantee**: Only addresses with valid vlayer email proof can register organization roles. All domain verifications and replay protections on-chain. Patients remain private with only hashed commitments stored.

---

### 3. InsuranceContract.sol (Policy Ledger & Payout Manager)

**Role**: Holds every patient's active insurance policy, tracks coverage limits (in USDC tokens), logs incoming claims (post ZK verification), handles claim approvals, fund escrows, and stablecoin payouts to hospitals. Mints Merit tokens on approved claims.

**Primary Responsibilities**:

#### Policy Creation & Management (Only Insurer):
```solidity
createPolicy(address patient, string policyId, uint256 totalCoverageTokens, string metadataCID)
```
- Hashes `policyId` off-chain; stores as `bytes32 policyIdHash`
- Records `Policy { totalCoverage, usedCoverage=0, policyIdHash, metadataCID, isActive=true }`

```solidity
updatePolicyCoverage(address patient, uint256 newTotalCoverageTokens)
```
- Allows insurer to top-up or modify existing policy's `totalCoverage`

#### Claim Submission (Called by ClaimProcessingContract):
```solidity
submitClaim(address patient, address hospital, bytes32 procedureCodeHash, uint256 requestedUSDC, string encryptedEHRCID, bytes ehrPREKey)
```
- Checks `patientPolicies[patient].isActive == true`
- **Fetches USD→USDC price** from FTSOv2 (`ftsoV2.getCurrentPrice(USDC_USD)`), returns `uint256` with 8 decimals (`$1.00 → 100_000_000`)
- Computes `requestedTokens = (requestedUSDC * 1e8 * 1e18) / price` → yields 18-decimal USDC token amount
- Requires `usedCoverage + requestedTokens ≤ totalCoverage`
- Stores new `Claim { claimId, patient, hospital, procedureCodeHash, requestedUSDC, requestedTokens, encryptedEHRCID, ehrPREKey, status=Submitted }`

#### Claim Approval & Merits Minting (Only Insurer):
```solidity
approveClaim(uint256 claimId)
```
- Checks `claims[claimId].status == Submitted`
- Deducts: `patientPolicies[patient].usedCoverage += requestedTokens`
- Credits: `hospitalEscrow[hospital] += requestedTokens`
- Updates `claims[claimId].status = Approved`
- Mints Merits: `meritsToken.mint(patient, PATIENT_REWARD)` and `meritsToken.mint(hospital, HOSPITAL_REWARD)`

```solidity
rejectClaim(uint256 claimId, string reason)
```
- Sets `claims[claimId].status = Rejected`

#### Hospital Withdrawals (Only Hospital):
```solidity
withdrawPayout()
```
- Reads `uint256 amount = hospitalEscrow[msg.sender]`
- Requires `amount > 0`
- Sets `hospitalEscrow[msg.sender] = 0`
- Calls `stablecoin.transfer(msg.sender, amount)`

#### View & Audit Functions:
- `getPolicy(address patient) → Policy`
- `getClaim(uint256 claimId) → Claim`
- `getHospitalEscrow(address hospital) → uint256`

**Key State Variables**:
- `mapping(address → Policy) patientPolicies;`
- `mapping(uint256 → Claim) claims;`
- `mapping(address → uint256) hospitalEscrow;`
- `IERC20 public stablecoin; // USDC token on Sepolia (18 decimals)`
- `IFlareFtsoV2 public ftsoV2; // FTSOv2 oracle`
- `bytes32 public constant USDC_USD // keccak256("USDC/USD")`

**Critical Role**: Single source of truth for patient coverage remaining (in USDC tokens), claim statuses, payout guarantees without ETH volatility, and Merit minting tied to Blockscout Merits prize.

---

### 4. ClaimProcessingContract.sol (ZK Gatekeeper + Price Converter)

**Role**: On-chain "gatekeeper" for new claims. Verifies hospitals have produced valid zero-knowledge proof about patient's encrypted EHR ("this encrypted record corresponds to a covered CPT code"). Only after proof passes does it convert hospital's "$X" bill into USDC tokens using FTSOv2 and call `InsuranceContract.submitClaim(...)`.

**Primary Responsibilities**:

#### Constructor & Initialization:
```solidity
// Resolves FTSOv2 address via registry:
address ftsoAddr = registry.getContractAddressByName("FtsoV2");
ftsoV2 = IFlareFtsoV2(ftsoAddr);
stablecoin = IERC20(_stablecoinOnSepolia);
```
- References both `RegistrationContract` (to confirm caller is verified hospital) and `InsuranceContract` (to forward validated claims)

#### submitClaim(...) (Only Verified Hospital):
```solidity
function submitClaim(
    address patient,
    bytes32 procedureCodeHash,
    uint256 requestedUSD,
    string encryptedEHRCID,
    bytes ehrPREKey,
    bytes zkProof
) external onlyVerifiedHospital
```

**Process Flow**:
1. Checks via `RegistrationContract.getUserRole(msg.sender) == Role.Hospital && isUserVerified(msg.sender)`
2. Calls `Verifier.verifyZKProof(zkProof)` to ensure hospital's off-chain ZK-SNARK is valid ("encrypted EHR meets policy coverage rules")
3. Fetches price from `ftsoV2.getCurrentPrice(USDC_USD)`, computes `requestedTokens = (requestedUSD * 1e8 * 1e18) / price`
4. Checks coverage: `policy.usedCoverage + requestedTokens ≤ policy.totalCoverage`
5. Calls `insuranceContract.submitClaim(patient, hospital, procedureCodeHash, requestedUSDC, encryptedEHRCID, ehrPREKey)`
6. Emits `ClaimSubmitted(...)`

#### Pricing Responsibility:
- Lives on **Sepolia**, calls Sepolia-deployed FTSOv2
- Guarantees coverage check and payout instructions in `InsuranceContract` use *exact* USDC token amount from live, decentralized oracle

**Architectural Benefit**: Keeps `InsuranceContract` focused on policies, ledgers, and payouts—no ZK or oracle logic mixed in. Makes oracle logic easy to swap/upgrade in one place.

---

### 5. MeritsTokenContract.sol (ERC-20 Reward Token)

**Role**: Simple ERC-20 token (18 decimals) that only `InsuranceContract` can mint. On each claim approval, insurance contract allocates Merits to both patient and hospital to incentivize timely, fraud-free participation.

**Primary Responsibilities**:

#### ERC-20 Implementation:
- Inherits from OpenZeppelin's `ERC20` (`ERC20("zkMed Merits", "ZKM")`)
- Constructor takes `InsuranceContract` address and stores as `minter`

#### Minting (Only InsuranceContract):
```solidity
mint(address to, uint256 amount)
```
- `require(msg.sender == insuranceContract)`
- Called from `InsuranceContract.approveClaim(...)` to mint fixed Reward (e.g., 100 ZKM) to both patient and hospital

**Prize Track Integration**: Cornerstone for "Best use of Blockscout Merits" prize. Since Merits are on-chain ERC-20 that `InsuranceContract` mints, UI can point to Blockscout's "GetMeritsBalance" API endpoint for live balances.

---

### 6. (Optional) ExternalVerifier.sol or In-Contract FDC Logic

**Role**: Handles Flare Data Connector (FDC) Web2Json attestations so hospitals/insurers can prove (privacy-preserving) that particular JSON field (`data.0.isActive == true`) from remote Web2 API (hosted on Sepolia) is valid.

**Primary Responsibilities**:

#### FDC Interface & Registry Access:
```solidity
interface IFdcHub {
  function requestAttestation(bytes calldata requestBytes) external returns (uint256);
  function getAttestationProof(uint256 roundId, bytes calldata requestBytes)
    external view returns (bytes memory attestedData, bytes32[] memory merkleProof);
}
```
- Constructor calls `registry.getContractAddressByName("FdcHub")` to set `fdcHub`

#### Confirm Off-Chain Data (License Verification):
```solidity
confirmHospitalLicense(uint256 roundId, bytes calldata requestBytes, bytes calldata attestedData, bytes32[] calldata merkleProof)
```
- Calls `fdcHub.getAttestationProof(roundId, requestBytes)`
- Verifies `MerkleProof.verify(merkleProof, keccak256(attestedData), keccak256(requestBytes))`
- Decodes `attestedData` (should be `abi.encodePacked("true")`). If not `"true"`, revert
- Sets `isWeb2Verified[msg.sender] = true`

#### Interaction with RegistrationContract:
- Once `isWeb2Verified[msg.sender] == true` (and `isDomainVerified[msg.sender] == true` from vlayer), only then does `RegistrationContract.completeOrganizationRegistration(...)` succeed

**Privacy Benefit**: Extra layer of authoritative licensing verification (confirming hospital's license "isActive" from trusted Web2 API) without exposing full JSON on-chain. If hospital's API data changes (license expires), only fresh FDC attestation with `data.0.isActive == false` would prevent further registration/claims.

---

## 🔄 COMPLETE INTERACTION FLOW

```mermaid
flowchart LR
  subgraph Registration Layer
    A1[EmailDomainProver (vlayer)] -->|"admin@mountsinai.org"| R1[RegistrationContract.verifyDomainOwnership()]
    R1 --> R2[RegistrationContract.completeOrganizationRegistration()]
    A2[FDC Web2Json] -->|"data.0.isActive == true"| R1
  end

  subgraph Policy & Claims Layer
    R2 -->|Hospital / Insurer roles set| CPI[ClaimProcessingContract]
    R2 -->|Insurer role set|   IC[InsuranceContract]
    CPI -->|ZK proof + pricing via FTSOv2| IC.submitClaim()
    IC -->|Approvals & Merits| MT[MeritsTokenContract]
    IC -->|Escrow USDC payouts| U[HospitalWallet]
  end

  subgraph Off-Chain Components
    EHR[Encrypted EHR on IPFS]
    ZK[Zero-Knowledge Proof] 
    PRE[Proxy Re-Encryption Key]
    Price[FTSOv2 (live oracle on Flare Sepolia)]
    License[Web2 API: /api/v1/license?address=… on Sepolia]
  end

  CPI --> Price
  R1 --> License
  CPI --> EHR
  CPI --> ZK
  CPI --> PRE
  IC --> MT
  IC --> U
```

### Registration Layer:
Hospitals & Insurers must pass BOTH:
1. **vlayer EmailProof** via `EmailDomainProver.verifyDomainOwnership(...)` → stores `domainToAddress[domain]` & `usedEmailHashes[emailHash]`
2. **FDC Web2Json** via `confirmHospitalLicense(...)` → verifies `data.0.isActive == true`

Only then does `completeOrganizationRegistration(...)` in `RegistrationContract` mark them as `Role.Hospital` or `Role.Insurer` and `verified = true`.

### Policy & Claims Layer:
1. **Insurer** calls `InsuranceContract.createPolicy(patient, policyIdHash, totalCoverageTokens, metadataCID)`

2. **Hospital** submits claim:
   - Encrypts patient's EHR off-chain (AES-GCM), pins to IPFS (`encryptedEHRCID`), prepares PRE key
   - Generates **ZK-SNARK** ("Encrypted EHR contains covered procedure code")
   - Calls `ClaimProcessingContract.submitClaim(patient, hospital, procedureCodeHash, requestedUSD, encryptedEHRCID, ehrPREKey, zkProof)`
   - Inside: `ftsoV2.getCurrentPrice("USDC/USD")` converts `requestedUSD` to 18-decimal USDC token amount
   - Contract verifies coverage and forwards to `InsuranceContract.submitClaim(...)`

3. **Insurer** reviews and calls `InsuranceContract.approveClaim(claimId)`:
   - Deducts USDC token amount from patient's remaining coverage
   - Credits `hospitalEscrow[hospital]` with USDC tokens
   - Mints Merit tokens to both patient and hospital (`MeritsTokenContract.mint(...)`)

4. **Hospital** calls `InsuranceContract.withdrawPayout()` → safe `stablecoin.transfer(hospital, amount)` receives exactly `$X` worth of USDC on Sepolia

---

## 🏆 PRIZE TRACK MAPPING

### 1. "Best use of vlayer EmailProofs"
**Satisfied by**: `EmailDomainProver.sol` + `RegistrationContract.verifyDomainOwnership(...)` or `registerOrganization(...)`
**Demonstration**: Real, privacy-preserving email proof integration

### 2. "Best use of Flare FTSOv2"
**Satisfied by**: `ClaimProcessingContract.submitClaim(...)` calling `ftsoV2.getCurrentPrice("USDC/USD")` on Sepolia
**Innovation**: On-chain, block-latency price conversion—no external oracles required

### 3. "Best use of Flare Data Connector (FDC)"
**Satisfied by**: `confirmHospitalLicense(...)` or in-contract FDC logic
**Method**: Web2Json attestation (`https://sepolia.mountsinai.org/api/v1/license?address=… → data.0.isActive == true`), hash expected field, verify Merkle proof
**Benefit**: Prove hospital legitimacy without exposing raw JSON

### 4. "Best use of Blockscout Merits"
**Satisfied by**: `MeritsTokenContract.sol` + integration in `InsuranceContract.approveClaim(...)`
**Implementation**: Merit minting on claim approval, UI fetches `meritsToken.mint` events, displays real-time balances via Blockscout Merits API

### 5. "Best use of Blockscout Explorer"
**Implementation**: Every on-chain action yields `txHash`, frontend displays Blockscout links (`https://sepolia.blockscout.com/eth/tx/${txHash}`)
**Benefit**: Judges can see each transaction in Blockscout's UI

---

## 📊 COMPLETE CONTRACTS SUMMARY TABLE

| Contract Name | Primary Role | Key Functions | Prize Track Integration |
|---------------|--------------|---------------|------------------------|
| **EmailDomainProver.sol** | Off-chain vlayer ZK prover for email-domain ownership | `verifyDomainOwnership(...)`, `verifyOrganization(...)`, `simpleDomainVerification(...)` | vlayer EmailProofs |
| **RegistrationContract.sol** | Central registry & access control for all user types | `registerPatient(...)`, `verifyDomainOwnership(...)`, `registerOrganization(...)`, `confirmHospitalLicense(...)` | vlayer EmailProofs + Flare FDC |
| **ClaimProcessingContract.sol** | ZK proof gatekeeper + FTSOv2 price conversion | `submitClaim(...)` (verifies ZK, calls `ftsoV2.getCurrentPrice(...)`, forwards) | Flare FTSOv2 |
| **InsuranceContract.sol** | Policy ledger, coverage tracking, claim approval, escrow/payout, Merits minting | `createPolicy(...)`, `submitClaim(...)`, `approveClaim(...)`, `withdrawPayout(...)` | Blockscout Merits |
| **MeritsTokenContract.sol** | ERC-20 reward token (only `InsuranceContract` can mint) | `mint(address to, uint256 amount)` | Blockscout Merits + Explorer |
| **ExternalVerifier.sol** | FDC Web2Json attestation verifier (license checks) | `confirmHospitalLicense(roundId, requestBytes, attestedData, merkleProof)` | Flare Data Connector |

---

## 🎯 SYSTEM GUARANTEES

### Privacy Guarantees:
- **Zero Medical PHI on-chain**: Only hashes, proofs, and encrypted CIDs
- **Selective Disclosure**: Insurers approve without seeing medical details  
- **Post-Approval Access**: Controlled decryption via proxy re-encryption
- **Email Privacy**: Only domain ownership proven, never actual email addresses

### Financial Guarantees:
- **Exact USD Payouts**: Live FTSOv2 oracle ensures precise USDC conversion
- **Coverage Protection**: Cannot exceed policy limits
- **Hospital Security**: Escrow system guarantees payment for approved claims
- **No ETH Volatility**: All payouts in stable USDC tokens

### Technical Guarantees:
- **ZK Proof Verification**: Cryptographic validation of procedure coverage
- **Domain Verification**: vlayer email proofs prevent impersonation
- **License Verification**: FDC Web2Json confirms hospital legitimacy
- **Merit Incentives**: Automatic rewards for successful claims processing

**This architecture delivers the world's first privacy-preserving healthcare claims system with comprehensive multi-protocol integration, targeting 6+ hackathon prize categories with substantial, innovative implementations!** 🚀 
# zkMed Smart Contracts Export

This directory contains exported ABIs and TypeScript interfaces for zkMed smart contracts, ready for frontend integration.

## Files

- `RegistrationContract.json` - Main contract ABI  
- `RegistrationContract.ts` - TypeScript interface with usage examples
- `HealthSystemWebProofProver.json` - Italian health WebProof prover ABI
- `HealthSystemWebProofProver.ts` - TypeScript interface for WebProof prover
- `HealthSystemWebProofVerifier.json` - Italian health WebProof verifier ABI
- `HealthSystemWebProofVerifier.ts` - TypeScript interface for WebProof verifier
- `PatientModule.json` - Patient module ABI
- `PatientModule.ts` - TypeScript interface for patient operations
- `EmailDomainProver.json` - Email domain prover ABI
- `EmailDomainProver.ts` - TypeScript interface for email verification
- `deployment.json` - Comprehensive deployment addresses
- `config.ts` - Configuration and utility functions
- `index.ts` - Main export file

## Usage

### With viem

```typescript
import { getContract } from 'viem';
import { zkMedContracts, deployment } from './exports';

// Main registration contract
const registrationContract = getContract({
  address: zkMedContracts.registrationContract.address,
  abi: zkMedContracts.registrationContract.abi,
  client: publicClient,
});

// Italian health WebProof contracts for patient registration
const healthProver = getContract({
  address: zkMedContracts.healthSystemWebProofProver.address,
  abi: zkMedContracts.healthSystemWebProofProver.abi,
  client: publicClient,
});

const healthVerifier = getContract({
  address: zkMedContracts.healthSystemWebProofVerifier.address,
  abi: zkMedContracts.healthSystemWebProofVerifier.abi,
  client: publicClient,
});
```

### With thirdweb

```typescript
import { getContract } from "thirdweb";
import { zkMedContracts, anvilChain } from './exports';

// Main registration contract
const registrationContract = getContract({
  client,
  chain: anvilChain,
  address: zkMedContracts.registrationContract.address,
  abi: zkMedContracts.registrationContract.abi,
});

// Quick setup using helper functions
import { getPatientWebProofContracts } from './exports';
const patientContracts = getPatientWebProofContracts(client);
```

## Contract Addresses (Local Deployment)

- **RegistrationContract**: `0x67d269191c92Caf3cD7723F116c85e6E9bf55933`
- **HealthSystemWebProofProver**: `0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf`
- **HealthSystemWebProofVerifier**: `0x9d4454B023096f34B160D6B654540c56A1F81688`
- **PatientModule**: `0x7a2088a1bFc9d81c55368AE168C2C02570cB814F`
- **EmailDomainProver**: `0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f`

## Available Flows

### Patients use WebProofs from Italian health system
- **Contracts**: healthSystemWebProofProver, healthSystemWebProofVerifier, registrationContract
- **Endpoint**: `registerPatientWithWebProof`
- **Process**: 
  1. Patient authenticates with SPID/CIE on Salute Lazio portal
  2. vlayer generates WebProof from health portal response
  3. HealthSystemWebProofProver creates verification proof
  4. HealthSystemWebProofVerifier validates and registers patient
  5. Patient gains access to zkMed system with verified Italian health identity

### Organizations use domain MailProofs
- **Contracts**: emailDomainProver, registrationContract
- **Endpoint**: `registerOrganization`
- **Process**:
  1. Organization proves domain ownership via email verification
  2. EmailDomainProver creates MailProof for domain ownership
  3. RegistrationContract validates proof and registers organization
  4. Organization gains access to zkMed system as verified hospital/insurer

## Key Functions

### Patient Registration (WebProof)
```typescript
// Register patient with Italian health system WebProof
await registrationContract.write.registerPatientWithWebProof([
  patientAddress,
  commitment,
  patientId,
  taxCodeHash,
  regionalCode,
  homeAsl
]);
```

### Organization Registration (MailProof)
```typescript
// Register organization with email domain verification
await registrationContract.write.registerOrganization([
  proof,
  organizationData,
  role
]);
```

## Integration Steps

1. Copy this `exports` folder to your Next.js project
2. Install required dependencies (`viem` or `thirdweb`)
3. Import and use the contracts in your components
4. All zkMed functionality is available through these contracts!

## Privacy-Preserving Features

- **WebProofs**: Prove Italian health system registration without exposing sensitive data
- **MailProofs**: Verify organization domain ownership through email verification
- **Zero-Knowledge**: Patient commitments provide privacy-preserving authentication
- **Selective Disclosure**: Only necessary verification data is stored on-chain

## Development

Generated from zkMed smart contracts deployed at timestamp: 1748723062
Chain ID: 31337
Deployer: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266

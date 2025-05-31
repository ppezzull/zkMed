# zkMed RegistrationContract Export

This directory contains the simplified export for the zkMed RegistrationContract - the single entry point for all zkMed functionality.

## Why One Contract?

The RegistrationContract coordinates all zkMed functionality including:
- Patient registration and commitment management
- Organization registration with email domain verification
- Admin and owner management
- Role-based access control

By using only the RegistrationContract, your frontend integration is much simpler.

## Files

- `RegistrationContract.json` - Contract ABI
- `RegistrationContract.ts` - TypeScript interface with usage examples
- `deployment-local.json` - Local deployment address
- `config.ts` - Configuration and utility functions
- `index.ts` - Main export file
- `README.md` - This file

## Quick Start

### With Viem/Wagmi

```typescript
import { getContract } from 'viem';
import { RegistrationContractABI, localDeployment } from './exports';

const contract = getContract({
  address: localDeployment.registrationContract,
  abi: RegistrationContractABI,
  client: publicClient,
});

// Register a patient
await contract.write.registerPatient([commitmentHash]);

// Check user role
const role = await contract.read.roles([userAddress]);
```

### With Thirdweb

```typescript
import { getContract } from "thirdweb";
import { RegistrationContractABI, localDeployment } from './exports';

const contract = getContract({
  client,
  chain: defineChain(31337),
  address: localDeployment.registrationContract,
  abi: RegistrationContractABI,
});

// Register a patient
await contract.call("registerPatient", [commitmentHash]);

// Check user role  
const role = await contract.read("roles", [userAddress]);
```

### Quick Setup Helper

```typescript
import { getZkMedContract } from './exports';

const contract = await getZkMedContract(publicClient, 'local');
// Contract is ready to use!
```

## Contract Address (Local Deployment)

- **RegistrationContract**: Check deployment-local.json

## Key Functions

### Patient Registration
- `registerPatient(bytes32 commitment)` - Register as patient with health data commitment
- `verifyPatientCommitment(string secret)` - Verify patient's health data commitment

### Organization Registration  
- `registerOrganizationWithProof(...)` - Register organization with email domain proof

### View Functions
- `roles(address)` - Get user role (None, Patient, Hospital, Insurer, Admin)
- `isUserVerified(address)` - Check if user is verified
- `isUserActive(address)` - Check if user is active
- `getUserRegistration(address)` - Get complete user registration info

### Admin Functions
- `activateUser(address)` / `deactivateUser(address)` - Manage user status
- `addAdmin(address)` / `addOwner(address)` - Manage permissions

## Regenerating Exports

Run `make export-abis` from the backend directory to regenerate these files.

## Next Steps

1. Copy this exports folder to your Next.js frontend
2. Install viem or thirdweb for contract interaction
3. Import and use the RegistrationContract in your components
4. All zkMed functionality is available through this single contract!

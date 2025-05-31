# zkMed Contract Exports

This directory contains all the necessary files for frontend integration with zkMed smart contracts.

## Files

- `abis.json` - Combined ABIs for all contracts
- `contracts.ts` - TypeScript interfaces for all contracts  
- `deployments.ts` - Deployment configuration and addresses
- `index.ts` - Main export file for easy imports
- Individual ABI files for each contract

## Usage

### Basic Import
```typescript
import { 
  RegistrationContractABI, 
  LOCAL_DEPLOYMENT, 
  RegistrationContractContract 
} from './exports';

const contractAddress = LOCAL_DEPLOYMENT.contracts.registrationContract;
```

### With ethers.js
```typescript
import { ethers } from 'ethers';
import { RegistrationContractABI, LOCAL_DEPLOYMENT } from './exports';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const contract = new ethers.Contract(
  LOCAL_DEPLOYMENT.contracts.registrationContract,
  RegistrationContractABI,
  provider
);
```

### With wagmi/viem
```typescript
import { useContractRead } from 'wagmi';
import { RegistrationContractABI, LOCAL_DEPLOYMENT } from './exports';

const { data } = useContractRead({
  address: LOCAL_DEPLOYMENT.contracts.registrationContract,
  abi: RegistrationContractABI,
  functionName: 'isUserVerified',
  args: [address]
});
```

## Contracts

### Core System
- **RegistrationContract**: Main proxy contract
- **RegistrationStorage**: Centralized storage with access control

### Modules  
- **PatientModule**: Patient registration and commitments
- **OrganizationModule**: Organization registration with email verification
- **AdminModule**: Admin functions and batch operations

### Utilities
- **EmailDomainProver**: vlayer-based email domain verification

## Development

Regenerate exports after contract changes:
```bash
make export-abis
```

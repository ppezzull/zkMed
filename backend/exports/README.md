# zkMed Contract Exports

This directory contains auto-generated contract ABIs and TypeScript interfaces for the zkMed system.

## Files

### Contract ABIs
- `RegistrationContract.json` - ABI for RegistrationContract
- `RegistrationStorage.json` - ABI for RegistrationStorage
- `PatientModule.json` - ABI for PatientModule
- `OrganizationModule.json` - ABI for OrganizationModule
- `AdminModule.json` - ABI for AdminModule
- `EmailDomainProver.json` - ABI for EmailDomainProver

### TypeScript Interfaces  
- `RegistrationContract.ts` - TypeScript interface for RegistrationContract
- `RegistrationStorage.ts` - TypeScript interface for RegistrationStorage
- `PatientModule.ts` - TypeScript interface for PatientModule
- `OrganizationModule.ts` - TypeScript interface for OrganizationModule
- `AdminModule.ts` - TypeScript interface for AdminModule
- `EmailDomainProver.ts` - TypeScript interface for EmailDomainProver

### Deployment Info
- `deployment-local.json` - Local deployment addresses

### Configuration
- `config.ts` - Unified configuration file
- `README.md` - This file

## Usage

### With Viem/Wagmi

```typescript
import { getContract } from 'viem';
import { RegistrationContractABI } from './RegistrationContract';
import deploymentInfo from './deployment-local.json';

const registrationContract = getContract({
  address: deploymentInfo.registrationContract,
  abi: RegistrationContractABI,
  publicClient,
});
```

### With Thirdweb

```typescript
import { getContract } from "thirdweb";
import { RegistrationContractABI } from './RegistrationContract';
import deploymentInfo from './deployment-local.json';

const contract = getContract({
  client,
  chain: defineChain(31337),
  address: deploymentInfo.registrationContract,
  abi: RegistrationContractABI,
});
```

## Contract Addresses (Local Deployment)

$(if [ -f "/home/ppezz/Desktop/ETH/ETHPrague/zkMed/backend/deployments/local.json" ]; then cat "/home/ppezz/Desktop/ETH/ETHPrague/zkMed/backend/deployments/local.json" | jq -r 'to_entries[] | "- **(.key)**: (.value)"'; else echo "No local deployment found"; fi)

## Regenerating Exports

Run `make export-abis` from the backend directory to regenerate these files.

# zkMed Contract ABIs

This directory contains exported ABIs and TypeScript definitions for zkMed smart contracts.

## Files

- `index.ts` - Main export file with all ABIs and addresses
- `thirdweb-config.ts` - thirdweb configuration for Next.js
- `thirdweb-hooks.ts` - Custom hooks for contract interactions
- Individual contract files (`RegistrationContract.ts`, etc.)

## Usage in Next.js with thirdweb

```typescript
import { createThirdwebClient, getContract, defineChain } from 'thirdweb';
import { useReadContract } from 'thirdweb/react';
import { RegistrationContractABI, getContractAddress } from './exports';

const client = createThirdwebClient({ clientId: 'your-client-id' });

function MyComponent() {
  const contract = getContract({
    client,
    chain: defineChain(31337),
    address: getContractAddress(31337, 'RegistrationContract'),
    abi: RegistrationContractABI
  });

  const { data } = useReadContract({
    contract,
    method: 'isUserVerified',
    params: [userAddress]
  });
  
  return <div>User verified: {data ? 'Yes' : 'No'}</div>;
}
```

## Generated: 2025-05-31T01:54:51.718Z

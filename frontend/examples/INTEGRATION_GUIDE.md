# zkMed Integration Guide

Complete guide for integrating zkMed smart contracts into your Next.js application.

## Prerequisites

```bash
npm install thirdweb @thirdweb-dev/react @thirdweb-dev/sdk
```

## Quick Setup

### 1. Environment Configuration

Create `.env.local`:

```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_thirdweb_client_id
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://localhost:8545
NEXT_PUBLIC_REGISTRATION_CONTRACT=0x8A791620dd6260079BF849Dc5567aDC3F2FdC318
NEXT_PUBLIC_EMAIL_DOMAIN_PROVER=0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
```

### 2. ThirdWeb Provider Setup

```tsx
// app/providers.tsx
'use client';

import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider client={client}>
      {children}
    </ThirdwebProvider>
  );
}
```

### 3. Contract Configuration

```tsx
// lib/contracts.ts
import { getContract, defineChain } from 'thirdweb';
import { RegistrationContractABI } from './abis/RegistrationContract';
import { EmailDomainProverABI } from './abis/EmailDomainProver';

export const anvilChain = defineChain({
  id: 31337,
  name: 'Anvil Local',
  rpc: 'http://localhost:8545',
});

export function getRegistrationContract(client: any) {
  return getContract({
    client,
    chain: anvilChain,
    address: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    abi: RegistrationContractABI,
  });
}

export function getEmailDomainProverContract(client: any) {
  return getContract({
    client,
    chain: anvilChain,
    address: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
    abi: EmailDomainProverABI,
  });
}
```

## Core Operations

### User Registration

```tsx
import { useThirdwebClient, useSendTransaction } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { getRegistrationContract } from './lib/contracts';

function RegisterUser() {
  const client = useThirdwebClient();
  const { mutate: sendTransaction } = useSendTransaction();
  const registrationContract = getRegistrationContract(client);

  const registerAsPatient = () => {
    const transaction = prepareContractCall({
      contract: registrationContract,
      method: 'registerAsPatient',
      params: [],
    });

    sendTransaction(transaction);
  };

  return <button onClick={registerAsPatient}>Register as Patient</button>;
}
```

### Check User Role

```tsx
import { useReadContract, useThirdwebClient } from 'thirdweb/react';
import { getRegistrationContract } from './lib/contracts';

function UserRole({ address }: { address: string }) {
  const client = useThirdwebClient();
  const registrationContract = getRegistrationContract(client);

  const { data: userRole } = useReadContract({
    contract: registrationContract,
    method: 'getUserRole',
    params: [address],
  });

  const roles = ['Unregistered', 'Patient', 'Doctor', 'Organization', 'Admin'];
  
  return <span>Role: {roles[Number(userRole)] || 'Unknown'}</span>;
}
```

### Email Verification

```tsx
import { useThirdwebClient, useSendTransaction } from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { getEmailDomainProverContract } from './lib/contracts';

function EmailVerification() {
  const client = useThirdwebClient();
  const { mutate: sendTransaction } = useSendTransaction();
  const emailContract = getEmailDomainProverContract(client);

  const verifyEmail = (email: string, proof: string) => {
    const transaction = prepareContractCall({
      contract: emailContract,
      method: 'verifyEmailDomain',
      params: [email, userAddress, proof],
    });

    sendTransaction(transaction);
  };

  return (
    <button onClick={() => verifyEmail('doctor@hospital.com', vlayerProof)}>
      Verify Email
    </button>
  );
}
```

## Contract Methods

### RegistrationContract

**Read Methods:**
- `getUserRole(address)` - Get user's role (0-4)
- `isUserVerified(address)` - Check if user is verified
- `getRegistrationTime(address)` - Get registration timestamp
- `emailHashExists(string)` - Check if email hash exists

**Write Methods:**
- `registerAsPatient()` - Register as patient
- `registerAsDoctor()` - Register as doctor  
- `registerAsOrganization()` - Register as organization

### EmailDomainProver

**Read Methods:**
- `isDomainVerified(string)` - Check if domain is verified
- `getOrganizationByDomain(string)` - Get organization info
- `isEmailVerified(string)` - Check email verification status

**Write Methods:**
- `verifyEmailDomain(email, user, proof)` - Verify email with vlayer proof
- `verifyOrganization(domain, name, verifier, proof)` - Verify organization

## vlayer Integration

### Generate Email Proof

```typescript
// This is a simplified example - actual implementation varies
async function generateEmailProof(email: string) {
  const vlayerResponse = await fetch('/api/vlayer/prove-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  
  const { proof } = await vlayerResponse.json();
  return proof;
}
```

### Submit Verification

```typescript
async function submitEmailVerification(email: string, userAddress: string) {
  // 1. Generate vlayer proof
  const proof = await generateEmailProof(email);
  
  // 2. Submit to smart contract
  const transaction = prepareContractCall({
    contract: emailContract,
    method: 'verifyEmailDomain',
    params: [email, userAddress, proof],
  });
  
  await sendTransaction(transaction);
}
```

## Error Handling

```tsx
const { mutate: sendTransaction } = useSendTransaction();

sendTransaction(transaction, {
  onSuccess: (receipt) => {
    console.log('Transaction successful:', receipt);
  },
  onError: (error) => {
    console.error('Transaction failed:', error);
    // Handle specific errors
    if (error.message.includes('User already registered')) {
      alert('You are already registered!');
    }
  },
});
```

## Production Deployment

### Environment Variables

```env
# Production
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_production_client_id
NEXT_PUBLIC_CHAIN_ID=11155111  # Sepolia
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Contract addresses (update after deployment)
NEXT_PUBLIC_REGISTRATION_CONTRACT=0x...
NEXT_PUBLIC_EMAIL_DOMAIN_PROVER=0x...
```

### Chain Configuration

```typescript
// Update for production networks
export const chains = {
  sepolia: defineChain({
    id: 11155111,
    name: 'Sepolia',
    rpc: 'https://sepolia.infura.io/v3/YOUR_KEY',
  }),
  mainnet: defineChain({
    id: 1,
    name: 'Ethereum',
    rpc: 'https://mainnet.infura.io/v3/YOUR_KEY',
  }),
};
```

## Best Practices

1. **Error Handling**: Always wrap contract calls in try-catch blocks
2. **Loading States**: Show loading indicators during transactions
3. **Gas Estimation**: Consider gas costs for user experience
4. **Network Detection**: Handle network switching gracefully
5. **Rate Limiting**: Implement reasonable limits on contract calls

## Support

- Contract addresses: See deployment artifacts in `/backend/broadcast/`
- ABIs: Available in `/backend/exports/`
- Documentation: See `/memory-bank/registration.md`

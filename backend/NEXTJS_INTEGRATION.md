# Integrating vlayer Setup with Next.js

## 🚀 Next.js + vlayer Integration Guide

### 1. **Next.js Project Setup**

```bash
# In your zkMed root directory
npx create-next-app@latest frontend --typescript --tailwind --eslint --app
cd frontend

# Install blockchain dependencies
npm install ethers wagmi viem @wagmi/core @web3modal/wagmi
npm install @types/node
```

### 2. **Environment Configuration**

Create `frontend/.env.local`:
```bash
# vlayer Local Development Endpoints
NEXT_PUBLIC_ANVIL_L1_RPC=http://localhost:8545
NEXT_PUBLIC_ANVIL_L2_RPC=http://localhost:8546
NEXT_PUBLIC_VLAYER_PROVER_URL=http://localhost:3000
NEXT_PUBLIC_VLAYER_DNS_URL=http://localhost:3002

# Chain Configuration
NEXT_PUBLIC_L1_CHAIN_ID=31337
NEXT_PUBLIC_L2_CHAIN_ID=31338

# Contract Addresses (update after deployment)
NEXT_PUBLIC_REGISTRATION_CONTRACT=0x...
NEXT_PUBLIC_ZKMED_TOKEN_CONTRACT=0x...
```

### 3. **Wagmi Configuration**

Create `frontend/src/config/wagmi.ts`:
```typescript
import { createConfig, http } from 'wagmi'
import { localhost } from 'wagmi/chains'

// Define local chains
export const anvilL1 = {
  ...localhost,
  id: 31337,
  name: 'Anvil L1',
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] }
  }
} as const

export const anvilL2 = {
  ...localhost,
  id: 31338,
  name: 'Anvil L2 (Optimism)',
  rpcUrls: {
    default: { http: ['http://localhost:8546'] },
    public: { http: ['http://localhost:8546'] }
  }
} as const

export const config = createConfig({
  chains: [anvilL1, anvilL2],
  transports: {
    [anvilL1.id]: http(),
    [anvilL2.id]: http(),
  },
})
```

### 4. **vlayer Integration Service**

Create `frontend/src/services/vlayer.ts`:
```typescript
// vlayer proof generation service
export class VlayerService {
  private proverUrl: string;
  private dnsUrl: string;

  constructor() {
    this.proverUrl = process.env.NEXT_PUBLIC_VLAYER_PROVER_URL || 'http://localhost:3000';
    this.dnsUrl = process.env.NEXT_PUBLIC_VLAYER_DNS_URL || 'http://localhost:3002';
  }

  async generateEmailProof(email: string, domain: string) {
    try {
      const response = await fetch(`${this.proverUrl}/prove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'email_domain',
          email,
          domain
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Proof generation failed:', error);
      throw error;
    }
  }

  async verifyProof(proof: any) {
    // Integrate with your verification contract
    // This would call your smart contract's verify function
  }
}
```

### 5. **React Components Example**

Create `frontend/src/components/RegistrationForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { VlayerService } from '@/services/vlayer';

const vlayerService = new VlayerService();

export function RegistrationForm() {
  const [email, setEmail] = useState('');
  const [isGeneratingProof, setIsGeneratingProof] = useState(false);
  
  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleRegistration = async () => {
    try {
      setIsGeneratingProof(true);
      
      // Generate vlayer proof
      const proof = await vlayerService.generateEmailProof(email, 'hospital.com');
      
      // Submit to blockchain
      writeContract({
        address: process.env.NEXT_PUBLIC_REGISTRATION_CONTRACT as `0x${string}`,
        abi: registrationAbi,
        functionName: 'registerPatient',
        args: [email, proof.data, proof.signature]
      });
    } catch (error) {
      console.error('Registration failed:', error);
    } finally {
      setIsGeneratingProof(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleRegistration}
        disabled={isGeneratingProof || isConfirming}
        className="w-full mt-4 p-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {isGeneratingProof ? 'Generating Proof...' : 
         isConfirming ? 'Confirming...' : 
         'Register Patient'}
      </button>
    </div>
  );
}
```

### 6. **Development Workflow**

```bash
# Terminal 1: Start vlayer services
cd backend
make start-vlayer

# Terminal 2: Deploy contracts
cd backend
make dev-deploy

# Terminal 3: Start Next.js
cd frontend
npm run dev

# Terminal 4: Monitor vlayer (optional)
cd backend
make dashboard
```

### 7. **API Routes for Server-Side vlayer Integration**

Create `frontend/src/app/api/prove/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, domain } = await request.json();
    
    // Call vlayer service from server-side
    const response = await fetch('http://localhost:3000/prove', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email_domain', email, domain })
    });
    
    const proof = await response.json();
    return NextResponse.json(proof);
  } catch (error) {
    return NextResponse.json({ error: 'Proof generation failed' }, { status: 500 });
  }
}
```

### 8. **Real-time Status Component**

```typescript
'use client';

import { useEffect, useState } from 'react';

export function VlayerStatus() {
  const [status, setStatus] = useState({
    l1: false,
    l2: false,
    prover: false,
    dns: false
  });

  useEffect(() => {
    const checkServices = async () => {
      try {
        // Check L1
        const l1Response = await fetch('http://localhost:8545', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_chainId',
            params: [],
            id: 1
          })
        });
        
        setStatus(prev => ({
          ...prev,
          l1: l1Response.ok,
          l2: true, // Check L2 similarly
          prover: true, // Check prover
          dns: true // Check DNS
        }));
      } catch (error) {
        console.error('Service check failed:', error);
      }
    };

    checkServices();
    const interval = setInterval(checkServices, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 p-4 bg-gray-100 rounded">
      <div className={`px-2 py-1 rounded ${status.l1 ? 'bg-green-200' : 'bg-red-200'}`}>
        L1: {status.l1 ? '✅' : '❌'}
      </div>
      <div className={`px-2 py-1 rounded ${status.l2 ? 'bg-green-200' : 'bg-red-200'}`}>
        L2: {status.l2 ? '✅' : '❌'}
      </div>
      <div className={`px-2 py-1 rounded ${status.prover ? 'bg-green-200' : 'bg-red-200'}`}>
        Prover: {status.prover ? '✅' : '❌'}
      </div>
    </div>
  );
}
```

### 9. **Package.json Scripts**

Add to `frontend/package.json`:
```json
{
  "scripts": {
    "dev": "next dev",
    "dev:full": "concurrently \"cd ../backend && make start-vlayer\" \"npm run dev\"",
    "deploy:local": "cd ../backend && make dev-deploy",
    "health:check": "cd ../backend && make dev-health"
  }
}
```

### 10. **Complete Development Command**

```bash
# One command to start everything
npm run dev:full
```

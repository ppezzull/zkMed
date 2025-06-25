import { defineChain } from 'thirdweb/chains';

// Base RPC URL for server-side and fallback
const BASE_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8547';

// Define the local Mantle fork chain with a stable RPC initially
export const mantleFork = defineChain({
  id: 31337,
  name: "Anvil Mantle Fork",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT", 
    decimals: 18,
  },
  rpc: BASE_RPC_URL,
  testnet: true,
  blockExplorers: [],
});

// Create a client-side version that uses the proxy
export const getClientChain = () => {
  if (typeof window === 'undefined') {
    // Server-side: always use the direct RPC URL
    return defineChain({
      ...mantleFork,
      rpc: BASE_RPC_URL,
    });
  }
  
  // Client-side: use the RPC proxy
  return defineChain({
    ...mantleFork,
    rpc: `${window.location.origin}/api/rpc`,
  });
};
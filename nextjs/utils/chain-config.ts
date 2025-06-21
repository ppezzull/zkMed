import { defineChain } from 'thirdweb/chains';

// Base RPC URL for server-side and fallback
const BASE_RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || "http://host.docker.internal:8547";

// Define the local Mantle fork chain with a stable RPC initially
export const mantleFork = defineChain({
  id: 31339,
  name: "Anvil Mantle Fork",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT", 
    decimals: 18,
  },
  rpc: BASE_RPC_URL, // This will be overridden on the client-side by Thirdweb
  testnet: true,
  blockExplorers: [],
});

// Create a client-side version that uses the proxy
export const getClientChain = () => {
  if (typeof window === 'undefined') {
    return mantleFork;
  }
  
  return defineChain({
    ...mantleFork,
    rpc: `${window.location.origin}/api/rpc`,
  });
};

// For display purposes
export const DISPLAY_RPC_URL = BASE_RPC_URL;

// Contract configuration - will be updated after deployment
export const GREETING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GREETING_CONTRACT_ADDRESS || '0x922D6956C99E12DFeB3224DEA977D0939758A1Fe'; 
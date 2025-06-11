import { defineChain } from 'thirdweb/chains';

// Define the local Mantle fork chain (shared between client and server)
export const mantleFork = defineChain({
  id: 31339,
  name: "Anvil Mantle Fork",
  nativeCurrency: {
    name: "Mantle",
    symbol: "MNT", 
    decimals: 18,
  },
  rpc: process.env.NEXT_PUBLIC_RPC_URL || process.env.NEXT_PUBLIC_ANVIL_RPC_URL || "http://localhost:8547",
  testnet: true,
  blockExplorers: [],
});

// Contract configuration - will be updated after deployment
export const GREETING_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GREETING_CONTRACT_ADDRESS || '0x922D6956C99E12DFeB3224DEA977D0939758A1Fe'; 
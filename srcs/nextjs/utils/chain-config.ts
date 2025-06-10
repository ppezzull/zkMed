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
  rpc: "http://127.0.0.1:8547",
  testnet: true,
  blockExplorers: [],
});

// Contract configuration
export const GREETING_CONTRACT_ADDRESS = '0x922D6956C99E12DFeB3224DEA977D0939758A1Fe'; 
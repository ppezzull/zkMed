import { defineChain } from 'thirdweb/chains';

// Define the local Mantle fork chain with a stable RPC initially
export const mantleFork = defineChain({
  id: 31337,
  name: "Anvil Local",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: `http://${process.env.NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN}/api/rpc`, // This will be overridden on the client-side by Thirdweb
  testnet: true,
  blockExplorers: [],
});
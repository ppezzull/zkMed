'use client';

import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { defineChain } from 'thirdweb/chains';

// Create the thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here"
});

// Define the local Mantle fork chain
const mantleFork = defineChain({
  id: 31339,
  name: "Anvil Mantle Fork",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpc: "http://127.0.0.1:8547",
  testnet: true,
});

export default function ThirdwebProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      {children}
    </ThirdwebProvider>
  );
}

// Export the client and chain for use in components
export { client, mantleFork };

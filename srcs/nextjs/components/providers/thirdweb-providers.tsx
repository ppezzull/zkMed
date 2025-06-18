'use client';

import { ThirdwebProvider } from 'thirdweb/react';
import { createThirdwebClient } from 'thirdweb';
import { mantleFork, getClientChain } from '@/utils/chain-config';
import { VlayerProviders } from './vlayer-provider';

// Create the thirdweb client
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here"
});

export default function ThirdwebProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
      <VlayerProviders>
        {children}
      </VlayerProviders>
    </ThirdwebProvider>
  );
}

// Export the client and chains for use in components
export { client, mantleFork, getClientChain };

'use client';

import { ProofProvider } from "@vlayer/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig } from '@/lib/configs/wagmi-config';
import { WagmiProvider } from 'wagmi';

// Create query client
const queryClient = new QueryClient();

// Prover configuration
const proverConfig = {
  proverUrl: process.env.NEXT_PUBLIC_VLAYER_PROVER_URL || 'http://localhost:3000',
  token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN,
};

interface VlayerProviderProps {
  children: React.ReactNode;
}

export default function VlayerProvider({ children }: VlayerProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ProofProvider config={proverConfig}>
          {children}
        </ProofProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
} 
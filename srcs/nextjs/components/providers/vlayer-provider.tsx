'use client';

import { ProofProvider } from "@vlayer/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create query client
const queryClient = new QueryClient();

// Prover configuration
const proverConfig = {
  proverUrl: process.env.NEXT_PUBLIC_VLAYER_PROVER_URL || 'http://localhost:3001',
  token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN,
};

interface VlayerProvidersProps {
  children: React.ReactNode;
}

export function VlayerProviders({ children }: VlayerProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ProofProvider config={proverConfig}>
        {children}
      </ProofProvider>
    </QueryClientProvider>
  );
} 
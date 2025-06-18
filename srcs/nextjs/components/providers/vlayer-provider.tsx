'use client';

import { VlayerProvider } from '@vlayer/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mantleFork } from '@/utils/chain-config';

// Create query client
const queryClient = new QueryClient();

interface VlayerProvidersProps {
  children: React.ReactNode;
}

export function VlayerProviders({ children }: VlayerProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <VlayerProvider
        chain={mantleFork}
        url={process.env.NEXT_PUBLIC_VLAYER_PROVER_URL || 'http://localhost:3001'}
      >
        {children}
      </VlayerProvider>
    </QueryClientProvider>
  );
} 
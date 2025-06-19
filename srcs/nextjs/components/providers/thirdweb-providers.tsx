'use client';

import { ThirdwebProvider } from 'thirdweb/react';

export default function ThirdwebProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider>
        {children}
    </ThirdwebProvider>
  );
}
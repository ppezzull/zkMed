'use client';

import { useWallet } from '@/hooks/useWallet';
import DevClient from '@/components/dev/dev-client';

export default function DevPage() {
  const {
    // Wallet state
    isConnected,
    address,
    shortAddress,
    balance,
    isLoading,
    isFunding,
    isReady,
    
    // Wallet functions
    refreshBalance,
    fundWallet,
  } = useWallet();

  // Show loading state while hook is initializing
  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0066CC] mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Development Dashboard...
          </h2>
          <p className="text-gray-600">
            Initializing wallet connection and blockchain data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0066CC] mb-4">
            🛠️ Development Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Development tools and blockchain interaction components for zkMed platform testing
          </p>
        </div>

        {/* Dev Client Component with all data passed as props */}
        <DevClient
          isConnected={isConnected}
          address={address}
          shortAddress={shortAddress}
          balance={balance}
          isLoading={isLoading}
          isFunding={isFunding}
          refreshBalance={refreshBalance}
          fundWallet={fundWallet}
        />
      </div>
    </div>
  );
} 
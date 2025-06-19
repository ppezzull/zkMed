'use client';

import { toEther } from 'thirdweb/utils';
import ChainStats from './chain-stats';
import WalletConnect from '../wallet-connect';

interface DevClientProps {
  // Wallet state
  isConnected: boolean;
  address: string | null;
  shortAddress: string | null;
  balance: bigint;
  isLoading: boolean;
  isFunding: boolean;
  
  // Wallet functions
  refreshBalance: () => Promise<void>;
  fundWallet: (amount: string) => Promise<void>;
}

export default function DevClient({
  isConnected,
  address,
  shortAddress,
  balance,
  isLoading,
  isFunding,
  refreshBalance,
  fundWallet,
}: DevClientProps) {
  
  const handleFundWallet = async (amount: string) => {
    try {
      await fundWallet(amount);
    } catch (error) {
      console.error('Funding failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Network Stats */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          🌐 Network Information
        </h2>
        <ChainStats />
      </div>
      
      {/* Wallet Authentication */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          👛 Wallet Connection
        </h2>
        <WalletConnect />
      </div>

      {/* Wallet Funding (Local Development) */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          💰 Local Development Funding
        </h2>
        
        <div className="p-6 border rounded-xl bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            💰 Smart Wallet Funding (Local Anvil)
          </h3>
          
          {!isConnected ? (
            <div className="p-6 border rounded-xl bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                💰 Wallet Funding
              </h3>
              <p className="text-gray-600">
                Please connect your wallet to view balance and funding options.
              </p>
            </div>
          ) : (
            <>
              {/* Wallet Balance */}
              <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h4 className="font-medium text-emerald-800 mb-2">Current Balance</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-700 text-2xl font-bold">
                      {isLoading ? (
                        <span className="animate-pulse">Loading...</span>
                      ) : (
                        `${parseFloat(toEther(balance)).toFixed(4)} MNT`
                      )}
                    </p>
                    <p className="text-emerald-600 text-sm mt-1">
                      Address: {shortAddress}
                    </p>
                  </div>
                  <button
                    onClick={refreshBalance}
                    disabled={isLoading}
                    className="px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 transition-colors text-sm"
                  >
                    {isLoading ? '🔄' : '↻ Refresh'}
                  </button>
                </div>
              </div>

              {/* Funding Options */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 mb-3">Fund Your Wallet</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => handleFundWallet("0.1")}
                    disabled={isFunding}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isFunding ? 'Funding...' : '+ 0.1 MNT'}
                  </button>
                  
                  <button
                    onClick={() => handleFundWallet("0.5")}
                    disabled={isFunding}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isFunding ? 'Funding...' : '+ 0.5 MNT'}
                  </button>
                  
                  <button
                    onClick={() => handleFundWallet("1.0")}
                    disabled={isFunding}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isFunding ? 'Funding...' : '+ 1.0 MNT'}
                  </button>
                </div>

                <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    <span className="font-medium">⚠️ Local Development:</span> This uses Anvil's pre-funded account to send test MNT to your smart wallet for gas fees.
                  </p>
                  <p className="text-yellow-700 text-xs mt-1">
                    Funder Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Development Resources */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          📚 Development Resources
        </h2>
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Quick Start Resources</h3>
          <p className="text-gray-600 mb-6">
            Essential documentation and tools for zkMed platform development
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="https://portal.thirdweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              <div className="text-2xl">📚</div>
              <div>
                <h4 className="font-medium text-blue-800">thirdweb Docs</h4>
                <p className="text-sm text-blue-600">Smart wallet integration</p>
              </div>
            </a>
            <a
              href="https://docs.vlayer.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
            >
              <div className="text-2xl">🔍</div>
              <div>
                <h4 className="font-medium text-purple-800">vlayer Docs</h4>
                <p className="text-sm text-purple-600">Zero-knowledge proofs</p>
              </div>
            </a>
            <a
              href="https://docs.mantle.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
            >
              <div className="text-2xl">⛓️</div>
              <div>
                <h4 className="font-medium text-green-800">Mantle Docs</h4>
                <p className="text-sm text-green-600">L2 blockchain network</p>
              </div>
            </a>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Development Mode</h4>
            <p className="text-sm text-yellow-700">
              This page is for development and testing purposes. All transactions use testnet tokens 
              and smart contracts are deployed on Anvil local network.
            </p>
            <div>daje roma: {process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS}</div>
            <div>daje il porcode: {process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS}</div>
          </div>
        </div>
      </div>
    </div>
  );
} 
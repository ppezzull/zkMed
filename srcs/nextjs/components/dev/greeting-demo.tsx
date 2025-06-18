'use client';

import { useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useGreetingContract } from '@/hooks/useGreetingContract';

export default function GreetingDemo() {
  const account = useActiveAccount();
  const [newGreeting, setNewGreeting] = useState<string>('');
  
  const {
    greeting,
    userGreeting,
    totalGreetings,
    userGreetingCount,
    contractAddress,
    contractStatus,
    loading,
    txLoading,
    setGreeting,
    refreshData
  } = useGreetingContract();

  const handleSetGreeting = async () => {
    if (!newGreeting.trim()) return;

    try {
      await setGreeting(newGreeting);
      setNewGreeting('');
    } catch (error) {
      console.error('Failed to set greeting:', error);
      // You could add toast notification here
    }
  };

  if (!contractAddress) {
    return (
      <div className="p-6 border rounded-xl bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🎉 Greeting Contract Demo
        </h3>
        <div className="flex items-center gap-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading contract address...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-6 border rounded-xl bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          🎉 Greeting Contract Demo
        </h3>
        <p className="text-gray-600">
          Please connect your wallet to interact with the greeting contract.
        </p>
        <div className="mt-3 p-3 bg-blue-50 rounded-lg text-xs">
          <p><span className="font-medium">Contract:</span> {contractAddress}</p>
          <p><span className="font-medium">Status:</span> {contractStatus === 'deployed' ? '✅ Deployed' : '⚠️ Fallback'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
        🎉 Greeting Contract Demo
      </h3>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            contractStatus === 'deployed' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {contractStatus === 'deployed' ? '✅ Live Contract' : '⚠️ Fallback Mode'}
          </span>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading contract data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Current State */}
          <div className="space-y-4">
            {/* Current Global Greeting */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Current Global Greeting</h4>
              <p className="text-blue-700 text-lg font-medium">"{greeting || 'No greeting set'}"</p>
              <p className="text-blue-600 text-sm mt-1">
                Total greetings: {totalGreetings.toString()}
              </p>
            </div>

            {/* User's Personal Greeting */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800 mb-2">Your Personal Greeting</h4>
              <p className="text-green-700">
                {userGreeting || 'You haven\'t set a greeting yet'}
              </p>
              <p className="text-green-600 text-sm mt-1">
                Your greeting count: {userGreetingCount.toString()}
              </p>
            </div>
          </div>

          {/* Right Column - Interaction */}
          <div className="space-y-4">
            {/* Set New Greeting */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800 mb-3">Set New Greeting</h4>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newGreeting}
                  onChange={(e) => setNewGreeting(e.target.value)}
                  placeholder="Enter your greeting..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={txLoading}
                />
                <button
                  onClick={handleSetGreeting}
                  disabled={!newGreeting.trim() || txLoading}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {txLoading ? 'Sending Transaction...' : 'Set Greeting'}
                </button>
                <p className="text-purple-700 text-sm">
                  💡 Using smart wallet with meta-transactions (self-funded)
                </p>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={refreshData}
              disabled={loading}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400 transition-colors"
            >
              {loading ? 'Refreshing...' : '🔄 Refresh Data'}
            </button>
          </div>
        </div>
      )}
      
      {/* Contract Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <p><span className="font-medium">Contract:</span> {contractAddress}</p>
        <p><span className="font-medium">Network:</span> Anvil Mantle Fork (Chain ID: 31339)</p>
        <p><span className="font-medium">Status:</span> {contractStatus}</p>
        <p><span className="font-medium">ABI:</span> TypeChain generated from Solidity</p>
      </div>
    </div>
  );
} 
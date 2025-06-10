'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, getContract, sendAndConfirmTransaction } from 'thirdweb';
import { getGreeting, getTotalGreetings, getUserGreeting, getUserGreetingCount } from '@/utils/actions/greeting';
import { Greeting__factory } from '@/utils/types/contracts/factories/Greeting__factory';
import { mantleFork } from '@/utils/chain-config';
import { getGreetingContractAddress, getContractStatus } from '@/utils/contract-config';
import { client } from './providers/thirdweb-providers';

// Contract ABI
const GREETING_ABI = Greeting__factory.abi;

export default function GreetingDemo() {
  const account = useActiveAccount();
  
  const [greeting, setGreeting] = useState<string>('');
  const [userGreeting, setUserGreeting] = useState<string>('');
  const [totalGreetings, setTotalGreetings] = useState<bigint>(BigInt(0));
  const [userGreetingCount, setUserGreetingCount] = useState<bigint>(BigInt(0));
  const [newGreeting, setNewGreeting] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [contractStatus, setContractStatus] = useState<'deployed' | 'fallback'>('fallback');

  // Load contract address dynamically
  useEffect(() => {
    const loadContractInfo = async () => {
      try {
        const [address, status] = await Promise.all([
          getGreetingContractAddress(),
          getContractStatus()
        ]);
        setContractAddress(address);
        setContractStatus(status);
      } catch (error) {
        console.error('Error loading contract info:', error);
      }
    };
    
    loadContractInfo();
  }, []);

  // Fetch contract data
  const fetchData = async () => {
    if (!contractAddress) return;
    
    setLoading(true);
    try {
      const [greetingResult, totalResult] = await Promise.all([
        getGreeting(),
        getTotalGreetings(),
      ]);

      if (greetingResult.success) {
        setGreeting(greetingResult.data as string);
      }
      if (totalResult.success) {
        setTotalGreetings(totalResult.data as bigint);
      }

      if (account?.address) {
        const [userGreetingResult, userCountResult] = await Promise.all([
          getUserGreeting(account.address),
          getUserGreetingCount(account.address),
        ]);

        if (userGreetingResult.success) {
          setUserGreeting(userGreetingResult.data as string);
        }
        if (userCountResult.success) {
          setUserGreetingCount(userCountResult.data as bigint);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (contractAddress) {
    fetchData();
    }
  }, [account?.address, contractAddress]);

  const handleSetGreeting = async () => {
    if (!account || !newGreeting.trim() || !contractAddress) return;

    setTxLoading(true);
    try {
      const contract = getContract({
        client,
        chain: mantleFork,
        address: contractAddress,
        abi: GREETING_ABI,
      });

      const transaction = prepareContractCall({
        contract,
        method: "setGreeting",
        params: [newGreeting.trim()],
      });

      const result = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      console.log('Transaction successful:', result);
      setNewGreeting('');
      // Refresh data after successful transaction
      setTimeout(fetchData, 2000);
    } catch (error) {
      console.error('Transaction failed:', error);
    } finally {
      setTxLoading(false);
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
              onClick={fetchData}
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
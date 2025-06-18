'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { 
  prepareTransaction, 
  sendAndConfirmTransaction,
  getRpcClient
} from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { toEther, toWei } from 'thirdweb/utils';
import { getClientChain } from '@/utils/configs/chain-config';
import { client } from '../providers/thirdweb-providers';

export default function WalletFunding() {
  const account = useActiveAccount();
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(false);
  const [funding, setFunding] = useState(false);

  // Get the client-side chain configuration
  const clientChain = getClientChain();

  // Anvil's default pre-funded account private key
  const ANVIL_DEFAULT_PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

  // Fetch wallet balance
  const fetchBalance = async () => {
    if (!account?.address) return;

    setLoading(true);
    try {
      const rpc = getRpcClient({ client, chain: clientChain });
      const balanceHex = await rpc({
        method: 'eth_getBalance',
        params: [account.address, 'latest'],
      });
      setBalance(BigInt(balanceHex));
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();
  }, [account?.address]);

  const handleFundWallet = async (amount: string) => {
    if (!account?.address) return;

    setFunding(true);
    try {
      // Create account from Anvil's default private key
      const fundingAccount = privateKeyToAccount({ 
        client,
        privateKey: ANVIL_DEFAULT_PRIVATE_KEY 
      });

      // Prepare the funding transaction
      const transaction = prepareTransaction({
        client,
        chain: clientChain,
        to: account.address,
        value: toWei(amount),
      });

      // Send the funding transaction
      const result = await sendAndConfirmTransaction({
        transaction,
        account: fundingAccount,
      });

      console.log('Funding successful:', result);
      
      // Refresh balance after funding
      setTimeout(fetchBalance, 2000);
    } catch (error) {
      console.error('Funding failed:', error);
    } finally {
      setFunding(false);
    }
  };

  if (!account) {
    return (
      <div className="p-6 border rounded-xl bg-gray-50">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          💰 Wallet Funding
        </h3>
        <p className="text-gray-600">
          Please connect your wallet to view balance and funding options.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-xl bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        💰 Smart Wallet Funding (Local Anvil)
      </h3>
      
      {/* Wallet Balance */}
      <div className="mb-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
        <h4 className="font-medium text-emerald-800 mb-2">Current Balance</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-700 text-2xl font-bold">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${parseFloat(toEther(balance)).toFixed(4)} MNT`
              )}
            </p>
            <p className="text-emerald-600 text-sm mt-1">
              Address: {account.address.slice(0, 6)}...{account.address.slice(-4)}
            </p>
          </div>
          <button
            onClick={fetchBalance}
            disabled={loading}
            className="px-3 py-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:bg-gray-400 transition-colors text-sm"
          >
            {loading ? '🔄' : '↻ Refresh'}
          </button>
        </div>
      </div>

      {/* Funding Options */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-800 mb-3">Fund Your Wallet</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => handleFundWallet("0.1")}
            disabled={funding}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {funding ? 'Funding...' : '+ 0.1 MNT'}
          </button>
          
          <button
            onClick={() => handleFundWallet("0.5")}
            disabled={funding}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {funding ? 'Funding...' : '+ 0.5 MNT'}
          </button>
          
          <button
            onClick={() => handleFundWallet("1.0")}
            disabled={funding}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {funding ? 'Funding...' : '+ 1.0 MNT'}
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
    </div>
  );
} 
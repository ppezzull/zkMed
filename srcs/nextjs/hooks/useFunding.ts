'use client';

import { useActiveAccount } from 'thirdweb/react';
import { mantleFork } from '@/lib/configs/chain-config';
import { useCallback, useState, useEffect } from 'react';
import { 
  prepareTransaction, 
  sendAndConfirmTransaction,
  getRpcClient
} from 'thirdweb';
import { privateKeyToAccount } from 'thirdweb/wallets';
import { toWei } from 'thirdweb/utils';
import { client } from '@/utils/thirdweb/client';

export interface FundingState {
  balance: bigint;
  isLoading: boolean;
  isFunding: boolean;
  isReady: boolean;
  error: string | null;
}

export interface FundingActions {
  fetchBalance: () => Promise<void>;
  fundWallet: (amount: string) => Promise<void>;
  refreshBalance: () => Promise<void>;
}

export interface UseFundingReturn extends FundingState, FundingActions {
  client: typeof client;
  chain: typeof mantleFork;
}

export function useFunding(): UseFundingReturn {
  const account = useActiveAccount();

  // State management
  const [balance, setBalance] = useState<bigint>(BigInt(0));
  const [isLoading, setIsLoading] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch wallet balance
  const fetchBalance = useCallback(async () => {
    if (!account?.address) {
      setBalance(BigInt(0));
      setIsReady(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const rpc = getRpcClient({ client, chain: mantleFork });
      const balanceHex = await rpc({
        method: 'eth_getBalance',
        params: [account.address, 'latest'],
      });
      setBalance(BigInt(balanceHex));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch balance');
      setBalance(BigInt(0));
    } finally {
      setIsLoading(false);
      setIsReady(true);
    }
  }, [account?.address]);

  // Fund wallet with specified amount
  const fundWallet = useCallback(async (amount: string) => {
    if (!account?.address) {
      setError('No wallet connected');
      return;
    }

    setIsFunding(true);
    setError(null);
    try {
      // Create account from Anvil's default private key
      const fundingAccount = privateKeyToAccount({ 
        client,
        privateKey: process.env.EXAMPLES_TEST_PRIVATE_KEY as `0x${string}`
      });

      // Prepare the funding transaction
      const transaction = prepareTransaction({
        client,
        chain: mantleFork,
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
      setError(`Funding failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsFunding(false);
    }
  }, [account?.address, fetchBalance]);

  // Refresh balance manually
  const refreshBalance = useCallback(async () => {
    await fetchBalance();
  }, [fetchBalance]);

  // Effect to fetch balance when account changes
  useEffect(() => {
    setIsReady(false);
    setError(null);
    fetchBalance();
  }, [fetchBalance]);

  return {
    // State
    balance,
    isLoading,
    isFunding,
    isReady,
    error,
    
    // Actions
    fetchBalance,
    fundWallet,
    refreshBalance,
    
    // Configuration
    client,
    chain: mantleFork,
  };
}

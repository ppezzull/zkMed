'use client';

import { useState, useEffect, useCallback } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, getContract, sendAndConfirmTransaction, readContract } from 'thirdweb';
import { Greeting__factory } from '@/utils/types/examples/factories/Greeting__factory';
import { getClientChain } from '@/utils/configs/chain-config';
import { useContracts } from './useContracts';
import { client } from '../components/providers/thirdweb-providers';

// Contract ABI
const GREETING_ABI = Greeting__factory.abi;

export interface GreetingContractState {
  greeting: string;
  userGreeting: string;
  totalGreetings: bigint;
  userGreetingCount: bigint;
  contractAddress: string;
  contractStatus: 'deployed' | 'fallback';
  loading: boolean;
  txLoading: boolean;
}

export interface GreetingContractActions {
  fetchData: () => Promise<void>;
  setGreeting: (newGreeting: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

export function useGreetingContract(): GreetingContractState & GreetingContractActions {
  const account = useActiveAccount();
  const mantleFork = getClientChain();
  const { getGreetingAddress, getStatus } = useContracts();
  
  // State
  const [greeting, setGreetingState] = useState<string>('');
  const [userGreeting, setUserGreeting] = useState<string>('');
  const [totalGreetings, setTotalGreetings] = useState<bigint>(BigInt(0));
  const [userGreetingCount, setUserGreetingCount] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');
  const [contractStatus, setContractStatus] = useState<'deployed' | 'fallback'>('fallback');

  // Load contract address dynamically
  const loadContractInfo = useCallback(async () => {
    try {
      const address = getGreetingAddress();
      const status = getStatus();
      setContractAddress(address);
      setContractStatus(status);
    } catch (error) {
      console.error('Error loading contract info:', error);
    }
  }, [getGreetingAddress, getStatus]);

  // Fetch contract data
  const fetchData = useCallback(async () => {
    if (!contractAddress) return;
    
    setLoading(true);
    try {
      const contract = getContract({
        client,
        chain: mantleFork,
        address: contractAddress as `0x${string}`,
        abi: GREETING_ABI,
      });

      const [greetingResult, totalResult] = await Promise.all([
        readContract({
          contract,
          method: "getGreeting",
        }),
        readContract({
          contract, 
          method: "totalGreetings",
        }),
      ]);

      setGreetingState(greetingResult as string);
      setTotalGreetings(totalResult as bigint);

      if (account?.address) {
        const [userGreetingResult, userCountResult] = await Promise.all([
          readContract({
            contract,
            method: "getUserGreeting",
            params: [account.address as `0x${string}`],
          }),
          readContract({
            contract,
            method: "getUserGreetingCount", 
            params: [account.address as `0x${string}`],
          }),
        ]);

        setUserGreeting(userGreetingResult as string);
        setUserGreetingCount(userCountResult as bigint);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [contractAddress, account?.address, mantleFork]);

  // Set greeting transaction
  const setGreeting = useCallback(async (newGreeting: string) => {
    if (!account || !newGreeting.trim() || !contractAddress) {
      throw new Error('Missing required parameters for setting greeting');
    }

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
      
      // Refresh data after successful transaction
      setTimeout(fetchData, 2000);
    } catch (error) {
      console.error('Transaction failed:', error);
      throw error;
    } finally {
      setTxLoading(false);
    }
  }, [account, contractAddress, mantleFork, fetchData]);

  // Refresh data (alias for fetchData for better UX)
  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  // Effects
  useEffect(() => {
    loadContractInfo();
  }, [loadContractInfo]);

  useEffect(() => {
    if (contractAddress) {
      fetchData();
    }
  }, [fetchData, contractAddress]);

  return {
    // State
    greeting,
    userGreeting,
    totalGreetings,
    userGreetingCount,
    contractAddress,
    contractStatus,
    loading,
    txLoading,
    // Actions
    fetchData,
    setGreeting,
    refreshData,
  };
}

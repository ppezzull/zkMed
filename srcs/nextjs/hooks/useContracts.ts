'use client';

import { useState, useEffect, useCallback } from 'react';

interface ContractInfo {
  address: string;
  deployer: string;
}

interface ContractsResponse {
  chainId: number;
  rpcUrl: string;
  contracts: {
    Greeting: ContractInfo;
    HealthcareRegistration: ContractInfo;
    HealthcareRegistrationProver: ContractInfo;
  };
  timestamp: string;
  status: 'deployed' | 'fallback';
}

interface UseContractsState {
  contracts: ContractsResponse | null;
  loading: boolean;
  error: string | null;
  lastFetch: number;
}

interface UseContractsActions {
  refetch: () => Promise<void>;
  clearCache: () => void;
  getGreetingAddress: () => string;
  getHealthcareRegistrationAddress: () => string;
  getHealthcareRegistrationProverAddress: () => string;
  getStatus: () => 'deployed' | 'fallback';
}

// Cache duration: 30 seconds
const CACHE_DURATION = 30000;

/**
 * Get fallback contract configuration (client-side only)
 */
function getFallbackContractConfig(): ContractsResponse {
  return {
    chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337'),
    rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://host.docker.internal:8547',
    contracts: {
      Greeting: {
        address: process.env.NEXT_PUBLIC_GREETING_CONTRACT_ADDRESS || '0x922D6956C99E12DFeB3224DEA977D0939758A1Fe',
        deployer: 'fallback'
      },
      HealthcareRegistration: {
        address: process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS || '0x0000000000000000000000000000000000000000',
        deployer: 'fallback'
      },
      HealthcareRegistrationProver: {
        address: process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS || '0x0000000000000000000000000000000000000000',
        deployer: 'fallback'
      }
    },
    timestamp: new Date().toISOString(),
    status: 'fallback'
  };
}

/**
 * Custom hook for managing contract addresses (client-side only)
 */
export function useContracts(): UseContractsState & UseContractsActions {
  const [contracts, setContracts] = useState<ContractsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState(0);

  /**
   * Fetch contract addresses from API
   */
  const fetchContracts = useCallback(async (): Promise<void> => {
    const now = Date.now();
    
    // Return cached data if still valid and not forced
    if (contracts && (now - lastFetch) < CACHE_DURATION) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contracts');
      if (!response.ok) {
        throw new Error(`Failed to fetch contracts: ${response.status} ${response.statusText}`);
      }
      
      const data: ContractsResponse = await response.json();
      setContracts(data);
      setLastFetch(now);
    } catch (err) {
      console.error('Error fetching contract addresses:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      // Set fallback config on error
      const fallbackConfig = getFallbackContractConfig();
      setContracts(fallbackConfig);
      setLastFetch(now);
    } finally {
      setLoading(false);
    }
  }, [contracts, lastFetch]);

  /**
   * Force refetch contracts
   */
  const refetch = useCallback(async (): Promise<void> => {
    setLastFetch(0); // Reset cache
    await fetchContracts();
  }, [fetchContracts]);

  /**
   * Clear cache and reset state
   */
  const clearCache = useCallback((): void => {
    setContracts(null);
    setLastFetch(0);
    setError(null);
  }, []);

  /**
   * Get Greeting contract address
   */
  const getGreetingAddress = useCallback((): string => {
    return contracts?.contracts.Greeting.address || getFallbackContractConfig().contracts.Greeting.address;
  }, [contracts]);

  /**
   * Get HealthcareRegistration contract address
   */
  const getHealthcareRegistrationAddress = useCallback((): string => {
    return contracts?.contracts.HealthcareRegistration.address || getFallbackContractConfig().contracts.HealthcareRegistration.address;
  }, [contracts]);

  /**
   * Get HealthcareRegistrationProver contract address
   */
  const getHealthcareRegistrationProverAddress = useCallback((): string => {
    return contracts?.contracts.HealthcareRegistrationProver.address || getFallbackContractConfig().contracts.HealthcareRegistrationProver.address;
  }, [contracts]);

  /**
   * Get contract deployment status
   */
  const getStatus = useCallback((): 'deployed' | 'fallback' => {
    return contracts?.status || 'fallback';
  }, [contracts]);

  // Initial fetch on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchContracts();
    }
  }, [fetchContracts]);

  return {
    contracts,
    loading,
    error,
    lastFetch,
    refetch,
    clearCache,
    getGreetingAddress,
    getHealthcareRegistrationAddress,
    getHealthcareRegistrationProverAddress,
    getStatus
  };
}

export type { ContractsResponse, ContractInfo };

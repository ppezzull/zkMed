// Contract configuration utilities for dynamic address loading

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

// Cache for contract addresses to avoid repeated API calls
let contractCache: ContractsResponse | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Fetch contract addresses from the API
 */
export async function fetchContractAddresses(): Promise<ContractsResponse> {
  const now = Date.now();
  
  // Return cached data if still valid
  if (contractCache && (now - cacheTimestamp) < CACHE_DURATION) {
    return contractCache;
  }

  try {
    const response = await fetch('/api/contracts');
    if (!response.ok) {
      throw new Error(`Failed to fetch contracts: ${response.status}`);
    }
    
    const data = await response.json();
    contractCache = data;
    cacheTimestamp = now;
    
    return data;
  } catch (error) {
    console.error('Error fetching contract addresses:', error);
    
    // Return fallback configuration
    return {
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31339'),
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
}

/**
 * Get the Greeting contract address dynamically
 */
export async function getGreetingContractAddress(): Promise<string> {
  const contracts = await fetchContractAddresses();
  return contracts.contracts.Greeting.address;
}

/**
 * Get the HealthcareRegistration contract address dynamically
 */
export async function getHealthcareRegistrationContractAddress(): Promise<string> {
  const contracts = await fetchContractAddresses();
  return contracts.contracts.HealthcareRegistration.address;
}

/**
 * Get the HealthcareRegistrationProver contract address dynamically
 */
export async function getHealthcareRegistrationProverContractAddress(): Promise<string> {
  const contracts = await fetchContractAddresses();
  return contracts.contracts.HealthcareRegistrationProver.address;
}

/**
 * Get contract deployment status
 */
export async function getContractStatus(): Promise<'deployed' | 'fallback'> {
  const contracts = await fetchContractAddresses();
  return contracts.status;
}

/**
 * Clear the contract cache (useful for testing or force refresh)
 */
export function clearContractCache(): void {
  contractCache = null;
  cacheTimestamp = 0;
}

export type { ContractsResponse, ContractInfo };
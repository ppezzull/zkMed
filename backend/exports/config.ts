// Auto-generated configuration file for zkMed RegistrationContract
import { Chain } from 'viem';

export const zkMedContract = {
  abi: require('./RegistrationContract.json'),
  // Add addresses per network in your app
} as const;

export const supportedChains: Chain[] = [
  // Add your supported chains here
  // e.g., mainnet, sepolia, polygon, etc.
];

export const defaultChain = {
  id: 31337,
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
} as const;

// Load deployment addresses
export const loadDeployment = async (network: 'local' | 'testnet' | 'mainnet' = 'local') => {
  try {
    const deployment = require(`./deployment-${network}.json`);
    return deployment;
  } catch (error) {
    throw new Error(`Deployment for ${network} not found`);
  }
};

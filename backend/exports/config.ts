// Auto-generated configuration file
import { Chain } from 'viem';

export const contracts = {
  registrationcontract: {
    abi: require('./RegistrationContract.json'),
    // Add addresses per network in your app
  },
  registrationstorage: {
    abi: require('./RegistrationStorage.json'),
    // Add addresses per network in your app
  },
  patientmodule: {
    abi: require('./PatientModule.json'),
    // Add addresses per network in your app
  },
  organizationmodule: {
    abi: require('./OrganizationModule.json'),
    // Add addresses per network in your app
  },
  adminmodule: {
    abi: require('./AdminModule.json'),
    // Add addresses per network in your app
  },
  emaildomainprover: {
    abi: require('./EmailDomainProver.json'),
    // Add addresses per network in your app
  }
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

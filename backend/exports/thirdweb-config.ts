/**
 * Next.js thirdweb Configuration for zkMed Contracts
 * 
 * Usage in Next.js:
 * import { zkMedContracts } from '@/lib/contracts';
 * import { useReadContract } from 'thirdweb/react';
 * 
 * const { data } = useReadContract({
 *   contract: getContract({
 *     client,
 *     chain: defineChain(31337),
 *     address: zkMedContracts.registrationcontract.address[31337]
 *   }),
 *   method: 'isUserVerified',
 *   params: [address]
 * });
 */

import { RegistrationContractABI } from './RegistrationContract';
import { EmailDomainProverABI } from './EmailDomainProver';

export const zkMedContracts = {
  registrationcontract: {
    abi: RegistrationContractABI,
    address: {
      31337: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      11155111: '', // Sepolia
      1: ''         // Mainnet
    }
  },
  emaildomainprover: {
    abi: EmailDomainProverABI,
    address: {
      31337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
      11155111: '', // Sepolia
      1: ''         // Mainnet
    }
  }
} as const;

// Chain configurations for thirdweb
export const supportedChains = {
  anvil: {
    id: 31337,
    name: 'Anvil Local',
    rpc: 'http://localhost:8545'
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    rpc: 'https://sepolia.infura.io/v3/YOUR_KEY'
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpc: 'https://mainnet.infura.io/v3/YOUR_KEY'
  }
} as const;

export default zkMedContracts;

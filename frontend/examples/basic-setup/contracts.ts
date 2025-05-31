// Contract configuration for Next.js
// filepath: /lib/contracts.ts

import { getContract, defineChain } from 'thirdweb';
import { RegistrationContractABI } from './abis/RegistrationContract';
import { EmailDomainProverABI } from './abis/EmailDomainProver';

// Chain configuration
export const anvilChain = defineChain({
  id: 31337,
  name: 'Anvil Local',
  rpc: process.env.NEXT_PUBLIC_RPC_URL || 'http://localhost:8545',
});

// Contract addresses
export const CONTRACT_ADDRESSES = {
  registrationContract: process.env.NEXT_PUBLIC_REGISTRATION_CONTRACT as `0x${string}`,
  emailDomainProver: process.env.NEXT_PUBLIC_EMAIL_DOMAIN_PROVER as `0x${string}`,
};

// Contract factory functions
export function getRegistrationContract(client: any) {
  return getContract({
    client,
    chain: anvilChain,
    address: CONTRACT_ADDRESSES.registrationContract,
    abi: RegistrationContractABI,
  });
}

export function getEmailDomainProverContract(client: any) {
  return getContract({
    client,
    chain: anvilChain,
    address: CONTRACT_ADDRESSES.emailDomainProver,
    abi: EmailDomainProverABI,
  });
}

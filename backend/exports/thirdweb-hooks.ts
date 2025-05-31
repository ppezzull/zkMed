/**
 * thirdweb Hooks for zkMed Contracts
 * 
 * Custom hooks for interacting with zkMed smart contracts using thirdweb
 */

import {
  useReadContract,
  useSendTransaction,
  getContract,
  defineChain
} from 'thirdweb/react';
import { RegistrationContractABI } from './RegistrationContract';
import { EmailDomainProverABI } from './EmailDomainProver';
import { getContractAddress } from './index';


// RegistrationContract Hooks
export function useRegistrationContractRead(
  client: any,
  chainId: number,
  method: string,
  params?: readonly unknown[]
) {
  const contract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'RegistrationContract'),
    abi: RegistrationContractABI
  });

  return useReadContract({
    contract,
    method,
    params
  });
}

export function useRegistrationContractWrite(
  client: any,
  chainId: number
) {
  const contract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'RegistrationContract'),
    abi: RegistrationContractABI
  });

  return {
    contract,
    sendTransaction: useSendTransaction()
  };
}

// EmailDomainProver Hooks
export function useEmailDomainProverRead(
  client: any,
  chainId: number,
  method: string,
  params?: readonly unknown[]
) {
  const contract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'EmailDomainProver'),
    abi: EmailDomainProverABI
  });

  return useReadContract({
    contract,
    method,
    params
  });
}

export function useEmailDomainProverWrite(
  client: any,
  chainId: number
) {
  const contract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'EmailDomainProver'),
    abi: EmailDomainProverABI
  });

  return {
    contract,
    sendTransaction: useSendTransaction()
  };
}

// Convenience hooks for common operations
export function usePatientRegistration(client: any, chainId: number, userAddress?: string) {
  const registrationContract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'RegistrationContract'),
    abi: RegistrationContractABI
  });

  const { data: isRegistered } = useReadContract({
    contract: registrationContract,
    method: 'isUserVerified',
    params: userAddress ? [userAddress] : undefined
  });
  
  const { mutate: sendTransaction } = useSendTransaction();
  
  const registerPatient = async (commitment: string, emailHash: string) => {
    return sendTransaction({
      transaction: {
        to: getContractAddress(chainId, 'RegistrationContract'),
        data: registrationContract.interface.encodeFunctionData('registerPatient', [commitment, emailHash])
      }
    });
  };
  
  return {
    isRegistered,
    registerPatient,
    contract: registrationContract
  };
}

export function useOrganizationRegistration(client: any, chainId: number) {
  const registrationContract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'RegistrationContract'),
    abi: RegistrationContractABI
  });
  
  const { mutate: sendTransaction } = useSendTransaction();
  
  const registerOrganization = async (
    domain: string,
    organizationName: string,
    emailHash: string,
    targetWallet: string,
    role: number
  ) => {
    return sendTransaction({
      transaction: {
        to: getContractAddress(chainId, 'RegistrationContract'),
        data: registrationContract.interface.encodeFunctionData('registerOrganization', [
          domain,
          organizationName,
          emailHash,
          targetWallet,
          role
        ])
      }
    });
  };
  
  return {
    registerOrganization,
    contract: registrationContract
  };
}

// Example usage of zkMed contract types
// This file demonstrates how to use the generated TypeScript types

import { ethers } from 'ethers';
import {
  HealthcareRegistrationContract,
  HealthcareRegistrationProverContract,
  HealthcareRegistration__factory,
  HealthcareRegistrationProver__factory,
  getHealthcareRegistrationContractAddress,
  getHealthcareRegistrationProverContractAddress,
  type ContractConfig,
  type zkMedContracts
} from './index';

/**
 * Example: Create a Healthcare Registration contract instance
 */
export async function createHealthcareRegistrationContract(
  provider: ethers.Provider,
  signer?: ethers.Signer
): Promise<HealthcareRegistrationContract> {
  const address = await getHealthcareRegistrationContractAddress();
  
  if (signer) {
    return HealthcareRegistration__factory.connect(address, signer);
  } else {
    return HealthcareRegistration__factory.connect(address, provider);
  }
}

/**
 * Example: Create a Healthcare Registration Prover contract instance
 */
export async function createHealthcareRegistrationProverContract(
  provider: ethers.Provider,
  signer?: ethers.Signer
): Promise<HealthcareRegistrationProverContract> {
  const address = await getHealthcareRegistrationProverContractAddress();
  
  if (signer) {
    return HealthcareRegistrationProver__factory.connect(address, signer);
  } else {
    return HealthcareRegistrationProver__factory.connect(address, provider);
  }
}

/**
 * Example: Get all zkMed contract configurations
 */
export async function getzkMedContractConfigs(): Promise<zkMedContracts> {
  const [healthcareRegistrationAddress, healthcareProverAddress] = await Promise.all([
    getHealthcareRegistrationContractAddress(),
    getHealthcareRegistrationProverContractAddress()
  ]);

  return {
    healthcareRegistration: {
      address: healthcareRegistrationAddress,
      chainId: 31337, // This should be dynamic based on your network
      rpcUrl: 'http://localhost:8545' // This should be dynamic based on your network
    },
    healthcareRegistrationProver: {
      address: healthcareProverAddress,
      chainId: 31337,
      rpcUrl: 'http://localhost:8545'
    }
  };
}

/**
 * Example: Register a patient using typed contract
 */
export async function registerPatient(
  contract: HealthcareRegistrationContract,
  patientAddress: string
): Promise<ethers.ContractTransactionResponse> {
  return await contract.registerPatient(patientAddress);
}

/**
 * Example: Check if an address is a registered patient
 */
export async function isPatientRegistered(
  contract: HealthcareRegistrationContract,
  patientAddress: string
): Promise<boolean> {
  return await contract.isPatient(patientAddress);
}

/**
 * Example: Get registration stats
 */
export async function getRegistrationStats(
  contract: HealthcareRegistrationContract
): Promise<{
  totalUsers: bigint;
  patients: bigint;
  hospitals: bigint;
  insurers: bigint;
}> {
  const [totalUsers, patients, hospitals, insurers] = await contract.getRegistrationStats();
  return { totalUsers, patients, hospitals, insurers };
}

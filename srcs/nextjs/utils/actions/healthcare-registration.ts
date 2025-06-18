"use server";

import { readContract, createThirdwebClient } from "thirdweb";
import { 
  getHealthcareRegistrationContractAddress,
  getHealthcareRegistrationProverContractAddress 
} from '../contract-config';
import { HealthcareRegistration__factory } from '../types/zkMed/HealthcareRegistration/factories/HealthcareRegistration__factory';
import { HealthcareRegistrationProver__factory } from '../types/zkMed/HealthcareRegistrationProver/factories/HealthcareRegistrationProver__factory';
import { mantleFork } from '../chain-config';

// Create client for server-side calls
const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || "your-client-id-here"
});

// Contract ABIs
const HEALTHCARE_REGISTRATION_ABI = HealthcareRegistration__factory.abi;
const HEALTHCARE_REGISTRATION_PROVER_ABI = HealthcareRegistrationProver__factory.abi;

// Types for user roles and registration data
export enum UserType {
  PATIENT = 0,
  HOSPITAL = 1,
  INSURER = 2
}

export interface UserRecord {
  userType: UserType;
  walletAddress: string;
  domain: string;
  organizationName: string;
  emailHash: string;
  registrationTime: bigint;
  isActive: boolean;
}

export interface RegistrationStats {
  totalUsers: bigint;
  patients: bigint;
  hospitals: bigint;
  insurers: bigint;
}

/**
 * Check if a user is registered and get their role
 */
export async function getUserRole(userAddress: string): Promise<{
  isRegistered: boolean;
  userType?: UserType;
  record?: UserRecord;
}> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    
    const isRegistered = await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "isUserRegistered",
      params: [userAddress],
    });
    
    if (!isRegistered) {
      return { isRegistered: false };
    }

    const [record, userType] = await Promise.all([
      readContract({
        contract: {
          address: contractAddress as `0x${string}`,
          abi: HEALTHCARE_REGISTRATION_ABI,
          client,
          chain: mantleFork,
        },
        method: "getUserRecord",
        params: [userAddress],
      }),
      readContract({
        contract: {
          address: contractAddress as `0x${string}`,
          abi: HEALTHCARE_REGISTRATION_ABI,
          client,
          chain: mantleFork,
        },
        method: "getUserType",
        params: [userAddress],
      })
    ]);

    return {
      isRegistered: true,
      userType: Number(userType) as UserType,
      record: {
        userType: Number(record.userType) as UserType,
        walletAddress: record.walletAddress,
        domain: record.domain,
        organizationName: record.organizationName,
        emailHash: record.emailHash,
        registrationTime: record.registrationTime,
        isActive: record.isActive
      }
    };
  } catch (error) {
    console.error('Error getting user role:', error);
    return { isRegistered: false };
  }
}

/**
 * Check if user is a patient
 */
export async function isPatient(userAddress: string): Promise<boolean> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    return await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "isPatient",
      params: [userAddress],
    });
  } catch (error) {
    console.error('Error checking if user is patient:', error);
    return false;
  }
}

/**
 * Check if user is a hospital
 */
export async function isHospital(userAddress: string): Promise<boolean> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    return await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "isHospital",
      params: [userAddress],
    });
  } catch (error) {
    console.error('Error checking if user is hospital:', error);
    return false;
  }
}

/**
 * Check if user is an insurer
 */
export async function isInsurer(userAddress: string): Promise<boolean> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    return await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "isInsurer",
      params: [userAddress],
    });
  } catch (error) {
    console.error('Error checking if user is insurer:', error);
    return false;
  }
}

/**
 * Get registration statistics
 */
export async function getRegistrationStats(): Promise<RegistrationStats> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    const stats = await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "getRegistrationStats",
    });
    
    return {
      totalUsers: stats[0],
      patients: stats[1],
      hospitals: stats[2],
      insurers: stats[3]
    };
  } catch (error) {
    console.error('Error getting registration stats:', error);
    throw error;
  }
}

/**
 * Check if a domain is taken
 */
export async function isDomainTaken(domain: string): Promise<boolean> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    return await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "isDomainTaken",
      params: [domain],
    });
  } catch (error) {
    console.error('Error checking if domain is taken:', error);
    return false;
  }
}

/**
 * Get domain owner
 */
export async function getDomainOwner(domain: string): Promise<string> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    return await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "getDomainOwner",
      params: [domain],
    });
  } catch (error) {
    console.error('Error getting domain owner:', error);
    return '';
  }
}

/**
 * Validate hospital domain
 */
export async function validateHospitalDomain(domain: string): Promise<boolean> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    return await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "validateHospitalDomain",
      params: [domain],
    });
  } catch (error) {
    console.error('Error validating hospital domain:', error);
    return false;
  }
}

/**
 * Validate insurer domain
 */
export async function validateInsurerDomain(domain: string): Promise<boolean> {
  try {
    const contractAddress = await getHealthcareRegistrationContractAddress();
    return await readContract({
      contract: {
        address: contractAddress as `0x${string}`,
        abi: HEALTHCARE_REGISTRATION_ABI,
        client,
        chain: mantleFork,
      },
      method: "validateInsurerDomain",
      params: [domain],
    });
  } catch (error) {
    console.error('Error validating insurer domain:', error);
    return false;
  }
}

/**
 * Get the HealthcareRegistration contract address
 */
export async function getHealthcareRegistrationAddress(): Promise<string> {
  return await getHealthcareRegistrationContractAddress();
}

/**
 * Get the HealthcareRegistrationProver contract address
 */
export async function getHealthcareRegistrationProverAddress(): Promise<string> {
  return await getHealthcareRegistrationProverContractAddress();
} 
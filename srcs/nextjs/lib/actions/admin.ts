"use server";

import { 
  AdminRecord, 
  BaseRequest,
  AdminAccessRequest,
  RequestType,
  RegistrationStats
} from '@/utils/types/healthcare';
import { getContract, readContract } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';
import { HealthcareRegistration__factory } from '@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory';
import { client } from '@/utils/thirdweb/client';
import { mantleFork } from '../configs/chain-config';

// ======== Admin Record Functions ========

export async function getAdminRecord(address: string): Promise<AdminRecord | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use admins mapping directly
    const result = await readContract({
      contract,
      method: 'admins',
      params: [address]
    });
    
    // Parse the contract return tuple into AdminRecord interface
    // Contract returns: [bool isActive, AdminRole role, uint256 permissions, uint256 adminSince]
    const [isActive, role, permissions, adminSince] = result as readonly [boolean, number, bigint, bigint];
    
    return {
      isActive,
      role: role as any,
      permissions,
      adminSince
    };
  } catch (error) {
    console.error('Error fetching admin record:', error);
    return null;
  }
}

// ======== Admin Request Functions ========

export async function getAdminRequest(requestId: bigint): Promise<AdminAccessRequest | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use adminRequests mapping via getAdminRequest function
    const result = await readContract({
      contract,
      method: 'getAdminRequest',
      params: [requestId]
    });
    
    return result as AdminAccessRequest;
  } catch (error) {
    console.error('Error fetching admin request:', error);
    return null;
  }
}

export async function getPendingAdminRequests(): Promise<bigint[]> {
  try {
    const contract = getHealthcareContract();
    
    const result = await readContract({
      contract,
      method: 'getPendingRequestsByType',
      params: [RequestType.ADMIN_ACCESS]
    });
    
    return result as bigint[];
  } catch (error) {
    console.error('Error fetching pending admin requests:', error);
    return [];
  }
}

// ======== General Request Functions ========

export async function getRequestBase(requestId: bigint): Promise<BaseRequest | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use requests mapping directly via getRequestBase function
    const result = await readContract({
      contract,
      method: 'getRequestBase',
      params: [requestId]
    });
    
    return result as BaseRequest;
  } catch (error) {
    console.error('Error fetching request base:', error);
    return null;
  }
}

export async function getPendingRequests(): Promise<bigint[]> {
  try {
    const contract = getHealthcareContract();
    
    const result = await readContract({
      contract,
      method: 'getPendingRequests',
      params: []
    });
    
    return result as bigint[];
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    return [];
  }
}

export async function getPendingRequestsByType(requestType: RequestType): Promise<bigint[]> {
  try {
    const contract = getHealthcareContract();
    
    const result = await readContract({
      contract,
      method: 'getPendingRequestsByType',
      params: [requestType]
    });
    
    return result as bigint[];
  } catch (error) {
    console.error('Error fetching pending requests by type:', error);
    return [];
  }
}

// ======== Statistics Functions ========

export async function getRegistrationStats(): Promise<RegistrationStats> {
  try {
    const contract = getHealthcareContract();
    
    const result = await readContract({
      contract,
      method: 'getRegistrationStats',
      params: []
    });
    
    return {
      totalRegisteredUsers: BigInt(result[0]),
      totalPatients: BigInt(result[1]),
      totalHospitals: BigInt(result[2]),
      totalInsurers: BigInt(result[3])
    };
  } catch (error) {
    console.error('Error fetching registration stats:', error);
    
    // Return zero stats instead of throwing
    return {
      totalRegisteredUsers: BigInt(0),
      totalPatients: BigInt(0),
      totalHospitals: BigInt(0),
      totalInsurers: BigInt(0)
    };
  }
}

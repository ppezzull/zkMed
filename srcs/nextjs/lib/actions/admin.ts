"use server";

import { 
  AdminRecord, 
  BaseRequest,
  AdminAccessRequest,
  RequestType,
  RegistrationStats
} from '@/utils/types/healthcare';
import { readContract } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';

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
    const [isActive, role, permissions, adminSince] = result as [boolean, number, bigint, bigint];
    
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
    console.log('🔍 Starting to fetch registration stats...');
    console.log('RPC URL:', process.env.NEXT_PUBLIC_RPC_URL);
    console.log('Chain ID:', process.env.NEXT_PUBLIC_CHAIN_ID);
    
    const contract = getHealthcareContract();
    console.log('✅ Contract instance created');
    
    const result = await readContract({
      contract,
      method: 'getRegistrationStats',
      params: []
    });
    
    console.log('✅ Successfully fetched registration stats:', result);
    
    return {
      totalRegisteredUsers: BigInt(result[0]),
      totalPatients: BigInt(result[1]),
      totalHospitals: BigInt(result[2]),
      totalInsurers: BigInt(result[3])
    };
  } catch (error) {
    console.error('❌ Error fetching registration stats:', error);
    
    // Provide more specific error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('404') || error.message.includes('Not Found')) {
        console.error('🔴 RPC endpoint not found - check if Anvil is running on the correct port');
        console.error('Expected RPC URL:', process.env.NEXT_PUBLIC_RPC_URL);
      }
    }
    
    // Return zero stats instead of throwing
    return {
      totalRegisteredUsers: BigInt(0),
      totalPatients: BigInt(0),
      totalHospitals: BigInt(0),
      totalInsurers: BigInt(0)
    };
  }
}

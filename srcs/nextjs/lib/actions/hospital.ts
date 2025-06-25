"use server";

import { 
  OrganizationRecord, 
  OrganizationRegistrationRequest,
  BaseRecord,
  UserType
} from '@/utils/types/healthcare';
import { readContract } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';

// ======== Hospital Record Functions ========

export async function getHospitalRecord(address: string): Promise<OrganizationRecord | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use organizationRecords mapping directly
    const result = await readContract({
      contract,
      method: 'organizationRecords',
      params: [address]
    });
    
    // Parse the contract return tuple into OrganizationRecord interface
    // Contract returns: [BaseRecord, UserType, string domain, string organizationName]
    const [baseRecord, orgType, domain, organizationName] = result as [BaseRecord, number, string, string];
    
    // Only return if it's a hospital
    if (orgType !== UserType.HOSPITAL) {
      return null;
    }
    
    return {
      base: baseRecord,
      orgType: orgType as UserType,
      domain,
      organizationName
    };
  } catch (error) {
    console.error('Error fetching hospital record:', error);
    return null;
  }
}

// ======== Hospital Request Functions ========

export async function getHospitalRequest(requestId: bigint): Promise<OrganizationRegistrationRequest | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use organizationRequests mapping via getOrganizationRequest function
    const result = await readContract({
      contract,
      method: 'getOrganizationRequest',
      params: [requestId]
    });
    
    const orgRequest = result as OrganizationRegistrationRequest;
    
    // Only return if it's for a hospital
    if (orgRequest.orgType !== UserType.HOSPITAL) {
      return null;
    }
    
    return orgRequest;
  } catch (error) {
    console.error('Error fetching hospital request:', error);
    return null;
  }
}

// ======== Hospital Domain Validation Functions ========

export async function validateHospitalDomain(domain: string): Promise<boolean> {
  try {
    const contract = getHealthcareContract();
    
    const result = await readContract({
      contract,
      method: 'validateHospitalDomain',
      params: [domain]
    });
    
    return result as boolean;
  } catch (error) {
    console.error('Error validating hospital domain:', error);
    return false;
  }
}

export async function isDomainTaken(domain: string): Promise<boolean> {
  try {
    const contract = getHealthcareContract();
    
    // Use domainToUser mapping via isDomainTaken function
    const result = await readContract({
      contract,
      method: 'isDomainTaken',
      params: [domain]
    });
    
    return result as boolean;
  } catch (error) {
    console.error('Error checking if domain is taken:', error);
    return true; // Assume taken on error for safety
  }
}

export async function getDomainOwner(domain: string): Promise<string | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use domainToUser mapping via getDomainOwner function
    const result = await readContract({
      contract,
      method: 'getDomainOwner',
      params: [domain]
    });
    
    return result as string;
  } catch (error) {
    console.error('Error fetching domain owner:', error);
    return null;
  }
}

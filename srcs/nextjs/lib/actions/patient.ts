"use server";

import { 
  PatientRecord, 
  PatientRegistrationRequest,
  BaseRecord
} from '@/utils/types/healthcare';
import { readContract } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';

// ======== Patient Record Functions ========

export async function getPatientRecord(address: string): Promise<PatientRecord | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use patientRecords mapping directly
    const result = await readContract({
      contract,
      method: 'patientRecords',
      params: [address]
    });
    
    // Parse the contract return (BaseRecord) into PatientRecord interface
    const baseRecord = result as BaseRecord;
    
    return {
      base: baseRecord
    };
  } catch (error) {
    console.error('Error fetching patient record:', error);
    return null;
  }
}

// ======== Patient Request Functions ========

export async function getPatientRequest(requestId: bigint): Promise<PatientRegistrationRequest | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use patientRequests mapping via getPatientRequest function
    const result = await readContract({
      contract,
      method: 'getPatientRequest',
      params: [requestId]
    });
    
    return result as PatientRegistrationRequest;
  } catch (error) {
    console.error('Error fetching patient request:', error);
    return null;
  }
}

// ======== Email Validation Functions ========

export async function isEmailHashUsed(emailHash: `0x${string}`): Promise<boolean> {
  try {
    const contract = getHealthcareContract();
    
    // Use usedEmailHashes mapping directly
    const result = await readContract({
      contract,
      method: 'usedEmailHashes',
      params: [emailHash]
    });
    
    return result as boolean;
  } catch (error) {
    console.error('Error checking if email hash is used:', error);
    return true; // Assume used on error for safety
  }
}

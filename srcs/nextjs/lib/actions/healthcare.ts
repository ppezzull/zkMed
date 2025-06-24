import { 
  AdminRecord, 
  PatientRecord, 
  OrganizationRecord, 
  BaseRequest,
  PatientRegistrationRequest,
  OrganizationRegistrationRequest,
  AdminAccessRequest,
  RequestType,
  UserVerificationData,
  RegistrationStats,
  BaseRecord,
  UserType
} from '@/utils/types/healthcare';
import { getContract, readContract } from 'thirdweb';
import { client } from '@/utils/thirdweb/client';
import { getClientChain } from '@/lib/configs/chain-config';
import { HealthcareRegistration__factory } from '@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory';

// Get the healthcare contract instance
const getHealthcareContract = () => {
  const contractAddress = process.env.NEXT_PUBLIC_HEALTHCARE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Healthcare contract address not found');
  }

  return getContract({
    client,
    chain: getClientChain(),
    address: contractAddress as `0x${string}`,
    abi: HealthcareRegistration__factory.abi,
  });
};

// ======== User Verification Functions ========

export async function getUserVerificationData(address: string): Promise<UserVerificationData | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use userTypes mapping to check user type
    const userType = await readContract({
      contract,
      method: 'userTypes',
      params: [address]
    });
    
    // Check if user is registered and active
    const isActive = await readContract({
      contract,
      method: 'isUserRegistered',
      params: [address]
    });
    
    // Check if user is admin using admins mapping
    const adminRecord = await readContract({
      contract,
      method: 'admins',
      params: [address]
    });
    
    const isAdmin = adminRecord[0]; // isActive field from AdminRecord
    
    // Get domain info for organizations using organizationRecords mapping
    let domain, organizationName;
    if (userType === 1 || userType === 2) { // HOSPITAL or INSURER
      try {
        const orgRecord = await readContract({
          contract,
          method: 'organizationRecords',
          params: [address]
        });
        domain = orgRecord[2]; // domain field
        organizationName = orgRecord[3]; // organizationName field
      } catch (error) {
        // User might not be an organization
      }
    }
    
    return {
      userType: Number(userType),
      isActive: Boolean(isActive),
      isAdmin: Boolean(isAdmin),
      adminRole: isAdmin ? Number(adminRecord[1]) : undefined, // role field
      permissions: isAdmin ? BigInt(adminRecord[2]) : undefined, // permissions field
      domain,
      organizationName
    };
  } catch (error) {
    console.error('Error fetching user verification data:', error);
    return null;
  }
}

// ======== Record Fetching Functions ========

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

export async function getOrganizationRecord(address: string): Promise<OrganizationRecord | null> {
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
    
    return {
      base: baseRecord,
      orgType: orgType as UserType,
      domain,
      organizationName
    };
  } catch (error) {
    console.error('Error fetching organization record:', error);
    return null;
  }
}

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
    return {
      totalRegisteredUsers: BigInt(0),
      totalPatients: BigInt(0),
      totalHospitals: BigInt(0),
      totalInsurers: BigInt(0)
    };
  }
}

// ======== Request Management Functions ========

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

export async function getOrganizationRequest(requestId: bigint): Promise<OrganizationRegistrationRequest | null> {
  try {
    const contract = getHealthcareContract();
    
    // Use organizationRequests mapping via getOrganizationRequest function
    const result = await readContract({
      contract,
      method: 'getOrganizationRequest',
      params: [requestId]
    });
    
    return result as OrganizationRegistrationRequest;
  } catch (error) {
    console.error('Error fetching organization request:', error);
    return null;
  }
}

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

// ======== Domain Validation Functions ========

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

export async function validateInsurerDomain(domain: string): Promise<boolean> {
  try {
    const contract = getHealthcareContract();
    
    const result = await readContract({
      contract,
      method: 'validateInsurerDomain',
      params: [domain]
    });
    
    return result as boolean;
  } catch (error) {
    console.error('Error validating insurer domain:', error);
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
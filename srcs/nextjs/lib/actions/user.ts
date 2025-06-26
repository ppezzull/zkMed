"use server";

import { 
  UserVerificationData,
  UserType
} from '@/utils/types/healthcare';
import { readContract } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';

// ======== User Verification Functions ========

export async function getUserVerificationData(address: string): Promise<UserVerificationData | null> {
  try {
    const contract = getHealthcareContract();
    
    // First check if user is registered to avoid reversion
    const isRegistered = await readContract({
      contract,
      method: 'isUserRegistered',
      params: [address]
    });
    
    // Set default values
    let userType = null;
    let isActive = Boolean(isRegistered);
    let isAdmin = false;
    let adminRole;
    let permissions;
    let domain;
    let organizationName;
    
    // Only proceed with other calls if the user is registered
    if (isRegistered) {
      // Now it's safe to call userTypes
      try {
        userType = await readContract({
          contract,
          method: 'getUserType',
          params: [address]
        });
      } catch (err) {
        console.error('Error fetching user type:', err);
      }
      
      // Check if user is admin using admins mapping
      try {
        const adminRecord = await readContract({
          contract,
          method: 'admins',
          params: [address]
        });
        
        isAdmin = Boolean(adminRecord[0]); // isActive field from AdminRecord
        if (isAdmin) {
          adminRole = Number(adminRecord[1]); // role field
          permissions = BigInt(adminRecord[2]); // permissions field
        }
      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
      
      // Get domain info for organizations
      if (userType === 1 || userType === 2) { // HOSPITAL or INSURER
        try {
          const orgRecord = await readContract({
            contract,
            method: 'getOrganizationRecord',
            params: [address]
          });
          domain = orgRecord.domain;
          organizationName = orgRecord.organizationName;
        } catch (err) {
          console.error('Error fetching organization data:', err);
        }
      }
    }
    
    return {
      userType: userType !== null ? Number(userType) as UserType : null,
      isActive,
      isAdmin,
      adminRole,
      permissions,
      domain,
      organizationName
    };
  } catch (error) {
    console.error('Error fetching user verification data:', error);
    return {
      userType: null,
      isActive: false,
      isAdmin: false,
      adminRole: undefined,
      permissions: undefined,
      domain: undefined,
      organizationName: undefined
    };
  }
}

export async function isUserRegistered(address: string): Promise<boolean> {
  try {
    const contract = getHealthcareContract();
    
    const result = await readContract({
      contract,
      method: 'isUserRegistered',
      params: [address]
    });
    
    return result as boolean;
  } catch (error) {
    console.error('Error checking if user is registered:', error);
    return false;
  }
}

export async function getUserType(address: string): Promise<UserType | null> {
  try {
    const contract = getHealthcareContract();
    
    // First check if user is registered to avoid reversion
    const isRegistered = await isUserRegistered(address);
    if (!isRegistered) {
      return null;
    }
    
    const result = await readContract({
      contract,
      method: 'userTypes',
      params: [address]
    });
    
    return Number(result) as UserType;
  } catch (error) {
    console.error('Error fetching user type:', error);
    return null;
  }
}

// Custom zkMed React Hooks
// filepath: /hooks/useZkMed.ts

import { 
  useReadContract, 
  useSendTransaction, 
  useActiveAccount,
  useThirdwebClient 
} from 'thirdweb/react';
import { prepareContractCall } from 'thirdweb';
import { getRegistrationContract, getEmailDomainProverContract } from '../lib/contracts';

// Types
export interface UserInfo {
  role: number;
  isVerified: boolean;
  registrationTime: bigint;
  address: string;
}

export interface OrganizationInfo {
  name: string;
  domain: string;
  verifier: string;
  isVerified: boolean;
}

// Main zkMed Hook
export function useZkMed() {
  const client = useThirdwebClient();
  const account = useActiveAccount();
  const { mutate: sendTransaction } = useSendTransaction();
  
  const registrationContract = getRegistrationContract(client);
  const emailContract = getEmailDomainProverContract(client);

  // User Registration Functions
  const registerAsPatient = () => {
    const transaction = prepareContractCall({
      contract: registrationContract,
      method: 'registerAsPatient',
      params: [],
    });
    return sendTransaction(transaction);
  };

  const registerAsDoctor = () => {
    const transaction = prepareContractCall({
      contract: registrationContract,
      method: 'registerAsDoctor',
      params: [],
    });
    return sendTransaction(transaction);
  };

  const registerAsOrganization = () => {
    const transaction = prepareContractCall({
      contract: registrationContract,
      method: 'registerAsOrganization',
      params: [],
    });
    return sendTransaction(transaction);
  };

  // Email Verification
  const verifyEmail = (email: string, proof: string) => {
    if (!account?.address) throw new Error('No wallet connected');
    
    const transaction = prepareContractCall({
      contract: emailContract,
      method: 'verifyEmailDomain',
      params: [email, account.address, proof],
    });
    return sendTransaction(transaction);
  };

  // Organization Verification
  const verifyOrganization = (domain: string, name: string, proof: string) => {
    if (!account?.address) throw new Error('No wallet connected');
    
    const transaction = prepareContractCall({
      contract: emailContract,
      method: 'verifyOrganization',
      params: [domain, name, account.address, proof],
    });
    return sendTransaction(transaction);
  };

  return {
    // Registration functions
    registerAsPatient,
    registerAsDoctor,
    registerAsOrganization,
    
    // Verification functions
    verifyEmail,
    verifyOrganization,
    
    // Contract instances (for custom operations)
    contracts: {
      registration: registrationContract,
      emailDomain: emailContract,
    },
    
    // Account info
    account,
    isConnected: !!account,
  };
}

// User Info Hook
export function useUserInfo(address?: string) {
  const client = useThirdwebClient();
  const account = useActiveAccount();
  const targetAddress = address || account?.address;
  
  const registrationContract = getRegistrationContract(client);

  const { data: userRole, isLoading: roleLoading } = useReadContract({
    contract: registrationContract,
    method: 'getUserRole',
    params: targetAddress ? [targetAddress] : undefined,
  });

  const { data: isVerified, isLoading: verifiedLoading } = useReadContract({
    contract: registrationContract,
    method: 'isUserVerified',
    params: targetAddress ? [targetAddress] : undefined,
  });

  const { data: registrationTime, isLoading: timeLoading } = useReadContract({
    contract: registrationContract,
    method: 'getRegistrationTime',
    params: targetAddress ? [targetAddress] : undefined,
  });

  const userInfo: UserInfo | null = targetAddress && userRole !== undefined ? {
    role: Number(userRole),
    isVerified: isVerified || false,
    registrationTime: registrationTime || BigInt(0),
    address: targetAddress,
  } : null;

  return {
    userInfo,
    isLoading: roleLoading || verifiedLoading || timeLoading,
    refetch: () => {
      // Trigger refetch of all queries
    },
  };
}

// Email Verification Hook
export function useEmailVerification(email?: string) {
  const client = useThirdwebClient();
  
  const emailContract = getEmailDomainProverContract(client);

  const { data: isEmailVerified } = useReadContract({
    contract: emailContract,
    method: 'isEmailVerified',
    params: email ? [email] : undefined,
  });

  const { data: emailHashExists } = useReadContract({
    contract: emailContract,
    method: 'emailHashExists',
    params: email ? [email] : undefined,
  });

  return {
    isEmailVerified: isEmailVerified || false,
    emailHashExists: emailHashExists || false,
    domain: email ? email.split('@')[1] : '',
  };
}

// Organization Info Hook
export function useOrganizationInfo(domain?: string) {
  const client = useThirdwebClient();
  
  const emailContract = getEmailDomainProverContract(client);

  const { data: isDomainVerified } = useReadContract({
    contract: emailContract,
    method: 'isDomainVerified',
    params: domain ? [domain] : undefined,
  });

  const { data: orgData } = useReadContract({
    contract: emailContract,
    method: 'getOrganizationByDomain',
    params: domain ? [domain] : undefined,
  });

  const organizationInfo: OrganizationInfo | null = domain && orgData ? {
    name: orgData.name || '',
    domain: domain,
    verifier: orgData.verifier || '',
    isVerified: isDomainVerified || false,
  } : null;

  return {
    organizationInfo,
    isDomainVerified: isDomainVerified || false,
  };
}

// Role Helper Hook
export function useRoleHelpers() {
  const getRoleName = (role: number): string => {
    const roles = ['Unregistered', 'Patient', 'Doctor', 'Organization', 'Admin'];
    return roles[role] || 'Unknown';
  };

  const getRoleColor = (role: number): string => {
    const colors = {
      0: 'bg-gray-100 text-gray-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800',
      3: 'bg-purple-100 text-purple-800',
      4: 'bg-red-100 text-red-800',
    };
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getRolePermissions = (role: number): string[] => {
    const permissions = {
      0: ['No permissions - please register'],
      1: ['View medical records', 'Book appointments', 'Access patient portal'],
      2: ['View patient records', 'Create medical records', 'Prescribe medications', 'Access doctor portal'],
      3: ['Manage organization data', 'Verify staff members', 'Access organization portal'],
      4: ['Full system access', 'Manage all users', 'System administration'],
    };
    return permissions[role as keyof typeof permissions] || ['Unknown role'];
  };

  const canRegister = (role: number): boolean => role === 0;
  const isPatient = (role: number): boolean => role === 1;
  const isDoctor = (role: number): boolean => role === 2;
  const isOrganization = (role: number): boolean => role === 3;
  const isAdmin = (role: number): boolean => role === 4;

  return {
    getRoleName,
    getRoleColor,
    getRolePermissions,
    canRegister,
    isPatient,
    isDoctor,
    isOrganization,
    isAdmin,
  };
}

// vlayer Integration Hook (placeholder for actual implementation)
export function useVlayerProof() {
  const generateEmailProof = async (email: string): Promise<string> => {
    // This would integrate with the actual vlayer API
    // For now, returning a placeholder
    console.log('Generating vlayer proof for:', email);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return '0x1234567890abcdef...'; // Placeholder proof
  };

  const generateOrganizationProof = async (domain: string): Promise<string> => {
    console.log('Generating organization proof for:', domain);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return '0xabcdef1234567890...'; // Placeholder proof
  };

  return {
    generateEmailProof,
    generateOrganizationProof,
  };
}

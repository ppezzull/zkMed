'use client';

import { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { getContract, prepareContractCall, sendTransaction, readContract } from 'thirdweb';
import { client } from '@/utils/thirdweb/client';
import { getClientChain } from '@/lib/configs/chain-config';
import { 
  AdminRole, 
  AdminRecord, 
  AdminAccessRequest,
  RequestType,
  BaseRequest
} from '@/utils/types/healthcare';
import { HealthcareRegistration__factory } from '@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory';
import { getHealthcareRegistrationAddress } from '@/lib/addresses';

interface UseAdminState {
  isLoading: boolean;
  error: string | null;
  isRequestingAccess: boolean;
  isProcessingRequest: boolean;
}

interface UseAdminReturn extends UseAdminState {
  // Admin management
  requestAdminAccess: (role: AdminRole, reason: string) => Promise<void>;
  approveRequest: (requestId: bigint) => Promise<void>;
  rejectRequest: (requestId: bigint, reason: string) => Promise<void>;
  addAdmin: (adminAddress: string, role: AdminRole) => Promise<void>;
  updateAdminPermissions: (adminAddress: string, permissions: bigint) => Promise<void>;
  deactivateUser: (userAddress: string) => Promise<void>;
  
  // Data fetching
  fetchAdminRecord: (address: string) => Promise<AdminRecord | null>;
  fetchPendingAdminRequests: () => Promise<bigint[]>;
  fetchAdminRequest: (requestId: bigint) => Promise<AdminAccessRequest | null>;
  fetchRequestBase: (requestId: bigint) => Promise<BaseRequest | null>;
}

const getHealthcareContract = () => {
  const contractAddress = getHealthcareRegistrationAddress();
  if (!contractAddress) {
    throw new Error('Healthcare contract address not configured');
  }

  return getContract({
    client,
    chain: getClientChain(),
    address: contractAddress as `0x${string}`,
    abi: HealthcareRegistration__factory.abi,
  });
};

export function useAdmin(): UseAdminReturn {
  const account = useActiveAccount();
  const [state, setState] = useState<UseAdminState>({
    isLoading: false,
    error: null,
    isRequestingAccess: false,
    isProcessingRequest: false,
  });

  const requestAdminAccess = useCallback(async (role: AdminRole, reason: string) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isRequestingAccess: true, error: null }));
    
    try {
      const contract = getHealthcareContract();
      
      const transaction = prepareContractCall({
        contract,
        method: 'requestAdminAccess',
        params: [role, reason]
      });
      
      await sendTransaction({
        transaction,
        account,
      });
      
      setState(prev => ({ ...prev, isRequestingAccess: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isRequestingAccess: false, 
        error: error?.message || 'Failed to request admin access' 
      }));
    }
  }, [account]);

  const approveRequest = useCallback(async (requestId: bigint) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isProcessingRequest: true, error: null }));
    
    try {
      const contract = getHealthcareContract();
      
      const transaction = prepareContractCall({
        contract,
        method: 'approveRequest',
        params: [requestId]
      });

      await sendTransaction({
        transaction,
        account,
      });
      
      setState(prev => ({ ...prev, isProcessingRequest: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isProcessingRequest: false, 
        error: error?.message || 'Failed to approve request' 
      }));
    }
  }, [account]);

  const rejectRequest = useCallback(async (requestId: bigint, reason: string) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isProcessingRequest: true, error: null }));
    
    try {
      const contract = getHealthcareContract();
      
      const transaction = prepareContractCall({
        contract,
        method: 'rejectRequest',
        params: [requestId, reason]
      });

      await sendTransaction({
        transaction,
        account,
      });
      
      setState(prev => ({ ...prev, isProcessingRequest: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isProcessingRequest: false, 
        error: error?.message || 'Failed to reject request' 
      }));
    }
  }, [account]);

  const addAdmin = useCallback(async (adminAddress: string, role: AdminRole) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const contract = getHealthcareContract();
      
      const transaction = prepareContractCall({
        contract,
        method: 'addAdmin',
        params: [adminAddress, role]
      });
      
      await sendTransaction({
        transaction,
        account,
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error?.message || 'Failed to add admin' 
      }));
    }
  }, [account]);

  const updateAdminPermissions = useCallback(async (adminAddress: string, permissions: bigint) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const contract = getHealthcareContract();
      
      const transaction = prepareContractCall({
        contract,
        method: 'updateAdminPermissions',
        params: [adminAddress, permissions]
      });
      
      await sendTransaction({
        transaction,
        account,
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error?.message || 'Failed to update admin permissions' 
      }));
    }
  }, [account]);

  const deactivateUser = useCallback(async (userAddress: string) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const contract = getHealthcareContract();
      
      const transaction = prepareContractCall({
        contract,
        method: 'deactivateUser',
        params: [userAddress]
      });
      
      await sendTransaction({
        transaction,
        account,
      });
      
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error?.message || 'Failed to deactivate user' 
      }));
    }
  }, [account]);

  const fetchAdminRecord = useCallback(async (address: string): Promise<AdminRecord | null> => {
    try {
      const contract = getHealthcareContract();
      
      const result = await readContract({
        contract,
        method: 'admins',
        params: [address]
      });
      
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
  }, []);

  const fetchPendingAdminRequests = useCallback(async (): Promise<bigint[]> => {
    try {
      const contract = getHealthcareContract();
      
      const result = await readContract({
        contract,
        method: 'getPendingRequestsByType',
        params: [2] // RequestType.ADMIN_ACCESS = 2
      });
      
      return result as bigint[];
    } catch (error) {
      console.error('Error fetching pending admin requests:', error);
      return [];
    }
  }, []);

  const fetchAdminRequest = useCallback(async (requestId: bigint): Promise<AdminAccessRequest | null> => {
    try {
      const contract = getHealthcareContract();
      
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
  }, []);

  const fetchRequestBase = useCallback(async (requestId: bigint): Promise<BaseRequest | null> => {
    try {
      const contract = getHealthcareContract();
      
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
  }, []);

  return {
    ...state,
    requestAdminAccess,
    approveRequest,
    rejectRequest,
    addAdmin,
    updateAdminPermissions,
    deactivateUser,
    fetchAdminRecord,
    fetchPendingAdminRequests,
    fetchAdminRequest,
    fetchRequestBase,
  };
} 
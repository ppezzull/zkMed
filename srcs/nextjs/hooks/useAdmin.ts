'use client';

import { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, sendTransaction } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';
import { AdminRole } from '@/utils/types/healthcare';

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
}

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

  return {
    ...state,
    requestAdminAccess,
    approveRequest,
    rejectRequest,
    addAdmin,
    updateAdminPermissions,
    deactivateUser,
  };
} 
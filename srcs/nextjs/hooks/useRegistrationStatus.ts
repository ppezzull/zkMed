'use client';

import { useState, useEffect, useCallback } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useRouter } from 'next/navigation';
import { getUserVerificationData } from '@/lib/actions/user';
import { UserType, UserVerificationData } from '@/utils/types/healthcare';
import { getUserDashboardPath } from '@/utils/thirdweb/middleware';

interface UseRegistrationStatusState {
  isLoading: boolean;
  isRegistered: boolean;
  userType: UserType | null;
  verificationData: UserVerificationData | null;
  error: string | null;
}

interface UseRegistrationStatusReturn extends UseRegistrationStatusState {
  checkRegistration: () => Promise<void>;
  redirectToDashboard: () => void;
  requiresRegistration: () => boolean;
}

export function useRegistrationStatus(): UseRegistrationStatusReturn {
  const account = useActiveAccount();
  const router = useRouter();
  
  const [state, setState] = useState<UseRegistrationStatusState>({
    isLoading: false,
    isRegistered: false,
    userType: null,
    verificationData: null,
    error: null,
  });

  const checkRegistration = useCallback(async () => {
    if (!account?.address) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRegistered: false,
        userType: null,
        verificationData: null,
        error: null,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const verification = await getUserVerificationData(account.address);
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        isRegistered: Boolean(verification?.isActive && verification.userType !== null),
        userType: verification?.userType || null,
        verificationData: verification,
        error: null,
      }));
    } catch (error) {
      console.error('Error checking registration:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to check registration',
      }));
    }
  }, [account?.address]);

  const redirectToDashboard = useCallback(() => {
    if (state.verificationData?.isActive && state.userType !== null && account?.address) {
      const dashboardPath = getUserDashboardPath(
        state.userType, 
        state.verificationData.isAdmin, 
        account.address
      );
      router.push(dashboardPath);
    }
  }, [state.verificationData, state.userType, account?.address, router]);

  const requiresRegistration = useCallback(() => {
    return !state.isRegistered && !!account?.address;
  }, [state.isRegistered, account?.address]);

  // Auto-check registration when account changes
  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  return {
    ...state,
    checkRegistration,
    redirectToDashboard,
    requiresRegistration,
  };
} 
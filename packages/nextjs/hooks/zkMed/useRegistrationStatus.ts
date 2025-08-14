"use client";

import { useCallback, useEffect, useState } from "react";
import { UserType, UserVerificationData } from "~~/types/healthcare";
import { getUserVerificationData } from "~~/utils/actions/user";
import { getUserDashboardPath } from "~~/utils/scaffold-eth/common";

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

export function useRegistrationStatus(mockWalletAddress?: string): UseRegistrationStatusReturn {
  // For demo purposes, we can accept a mock wallet address
  const account = mockWalletAddress ? { address: mockWalletAddress } : null;

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
      console.error("Error checking registration:", error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Failed to check registration",
      }));
    }
  }, [account?.address]);

  const redirectToDashboard = useCallback(() => {
    if (state.verificationData?.isActive && state.userType !== null) {
      const dashboardPath = getUserDashboardPath(state.userType, state.verificationData.isAdmin);
      // For demo purposes, we'll just log the redirect instead of actually redirecting
      console.log("Would redirect to:", dashboardPath);
      window.location.href = dashboardPath;
    }
  }, [state.verificationData, state.userType]);

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

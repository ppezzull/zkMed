"use client";

import { useCallback, useState } from "react";
import { mockGetPendingRequestsByTypeDetailed } from "~~/lib/mock-data";
import { AdminRole, RequestType } from "~~/types/healthcare";

interface UseAdminState {
  isLoading: boolean;
  error: string | null;
  isRequestingAccess: boolean;
  isProcessingRequest: boolean;
}

interface UseAdminReturn extends UseAdminState {
  // Admin management
  requestAdminAccess: (role: AdminRole, reason: string) => Promise<void>;
  approveRequest: () => Promise<void>;
  rejectRequest: (reason: string) => Promise<void>;
  addAdmin: (adminAddress: string, role: AdminRole) => Promise<void>;
  updateAdminPermissions: (adminAddress: string, permissions: bigint) => Promise<void>;
  deactivateUser: (userAddress: string) => Promise<void>;
  // Mock data functions
  fetchRequestBase: () => Promise<any>;
  fetchAdminRequest: () => Promise<any>;
}

export function useAdmin(): UseAdminReturn {
  const [state, setState] = useState<UseAdminState>({
    isLoading: false,
    error: null,
    isRequestingAccess: false,
    isProcessingRequest: false,
  });

  const requestAdminAccess = useCallback(async (role: AdminRole, reason: string) => {
    setState(prev => ({ ...prev, isRequestingAccess: true, error: null }));

    try {
      // Mock implementation - just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Mock: Admin access requested", { role, reason });
      setState(prev => ({ ...prev, isRequestingAccess: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isRequestingAccess: false,
        error: error?.message || "Failed to request admin access",
      }));
    }
  }, []);

  const approveRequest = useCallback(async () => {
    setState(prev => ({ ...prev, isProcessingRequest: true, error: null }));

    try {
      // Mock implementation - just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Mock: Request approved");
      setState(prev => ({ ...prev, isProcessingRequest: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isProcessingRequest: false,
        error: error?.message || "Failed to approve request",
      }));
    }
  }, []);

  const rejectRequest = useCallback(async (reason: string) => {
    setState(prev => ({ ...prev, isProcessingRequest: true, error: null }));

    try {
      // Mock implementation - just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Mock: Request rejected", { reason });
      setState(prev => ({ ...prev, isProcessingRequest: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isProcessingRequest: false,
        error: error?.message || "Failed to reject request",
      }));
    }
  }, []);

  const addAdmin = useCallback(async (adminAddress: string, role: AdminRole) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock implementation - just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Mock: Admin added", { adminAddress, role });
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Failed to add admin",
      }));
    }
  }, []);

  const updateAdminPermissions = useCallback(async (adminAddress: string, permissions: bigint) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock implementation - just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Mock: Admin permissions updated", { adminAddress, permissions });
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Failed to update admin permissions",
      }));
    }
  }, []);

  const deactivateUser = useCallback(async (userAddress: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Mock implementation - just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Mock: User deactivated", userAddress);
      setState(prev => ({ ...prev, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error?.message || "Failed to deactivate user",
      }));
    }
  }, []);

  const fetchRequestBase = useCallback(async () => {
    // Mock implementation - return dummy data for now
    await new Promise(resolve => setTimeout(resolve, 100));
    return {
      requester: "0x1234567890123456789012345678901234567890",
      requestTime: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
    };
  }, []);

  const fetchAdminRequest = useCallback(async () => {
    // Mock implementation - return dummy data for now
    await new Promise(resolve => setTimeout(resolve, 100));
    const adminRequests = await mockGetPendingRequestsByTypeDetailed(RequestType.ADMIN_ACCESS);
    return (
      adminRequests[0] || {
        base: {
          requester: "0x1234567890123456789012345678901234567890",
          requestTime: BigInt(Date.now() - 24 * 60 * 60 * 1000),
        },
        reason: "Need admin access for testing",
      }
    );
  }, []);

  return {
    ...state,
    requestAdminAccess,
    approveRequest,
    rejectRequest,
    addAdmin,
    updateAdminPermissions,
    deactivateUser,
    fetchRequestBase,
    fetchAdminRequest,
  };
}

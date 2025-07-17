"use client";

import { useCallback, useMemo, useState } from "react";

// import { UserType } from '~~/types/healthcare';

interface UseHospitalState {
  isLoading: boolean;
  error: string | null;
  isRegistering: boolean;
  isGeneratingProof: boolean;
  registrationStep: string;
}

interface RegistrationStatus {
  isLoading: boolean;
  error: string | null;
  checkRegistration: () => Promise<void>;
}

interface UseHospitalReturn extends UseHospitalState {
  // Registration
  registerHospital: (
    emlContent: string,
    walletAddress: string,
    organizationName: string,
    domain: string,
  ) => Promise<void>;

  // Registration status from centralized hook
  registrationStatus: RegistrationStatus;
}

export function useHospital(): UseHospitalReturn {
  const [state, setState] = useState<UseHospitalState>({
    isLoading: false,
    error: null,
    isRegistering: false,
    isGeneratingProof: false,
    registrationStep: "",
  });

  const registrationStatus: RegistrationStatus = useMemo(
    () => ({
      isLoading: false,
      error: null,
      checkRegistration: async () => {
        // Mock implementation
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log("Mock: Checking hospital registration status");
      },
    }),
    [],
  );

  const registerHospital = useCallback(
    async (emlContent: string, walletAddress: string, organizationName: string, domain: string) => {
      setState(prev => ({
        ...prev,
        isRegistering: true,
        error: null,
        registrationStep: "Starting hospital registration...",
      }));

      try {
        // 1. Generate hospital proof using vlayer
        setState(prev => ({ ...prev, registrationStep: "Generating email proof..." }));
        await new Promise(resolve => setTimeout(resolve, 1500));

        // 2. Extract registration data from proof
        setState(prev => ({ ...prev, registrationStep: "Extracting registration data..." }));
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 3. Validate registration data matches smart contract requirements
        setState(prev => ({ ...prev, registrationStep: "Validating registration data..." }));
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 4. Submit proof to smart contract for verification and registration
        setState(prev => ({ ...prev, registrationStep: "Verifying proof on-chain..." }));
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 5. Refresh registration status
        await registrationStatus.checkRegistration();

        setState(prev => ({
          ...prev,
          isRegistering: false,
          registrationStep: "Hospital registration completed successfully!",
        }));

        console.log("Mock: Hospital registration completed", {
          emlContent,
          walletAddress,
          organizationName,
          domain,
        });
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          isRegistering: false,
          error: error?.message || "Failed to register hospital",
          registrationStep: "",
        }));
      }
    },
    [registrationStatus],
  );

  return {
    ...state,
    registerHospital,
    registrationStatus,
  };
}

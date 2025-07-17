"use client";

import { useCallback, useMemo, useState } from "react";

// import { UserType } from '~~/types/healthcare';

interface UseInsuranceState {
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

interface UseInsuranceReturn extends UseInsuranceState {
  // Registration
  registerInsurance: (
    emlContent: string,
    walletAddress: string,
    organizationName: string,
    domain: string,
  ) => Promise<void>;

  // Registration status from centralized hook
  registrationStatus: RegistrationStatus;
}

export function useInsurance(): UseInsuranceReturn {
  const [state, setState] = useState<UseInsuranceState>({
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
        console.log("Mock: Checking insurance registration status");
      },
    }),
    [],
  );

  const registerInsurance = useCallback(
    async (emlContent: string, walletAddress: string, organizationName: string, domain: string) => {
      setState(prev => ({
        ...prev,
        isRegistering: true,
        error: null,
        registrationStep: "Starting insurance registration...",
      }));

      try {
        // 1. Generate insurance proof using vlayer
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
          registrationStep: "Insurance registration completed successfully!",
        }));

        console.log("Mock: Insurance registration completed", {
          emlContent,
          walletAddress,
          organizationName,
          domain,
        });
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          isRegistering: false,
          error: error?.message || "Failed to register insurance",
          registrationStep: "",
        }));
      }
    },
    [registrationStatus],
  );

  return {
    ...state,
    registerInsurance,
    registrationStatus,
  };
}

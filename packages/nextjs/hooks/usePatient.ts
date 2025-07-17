"use client";

import { useCallback, useMemo, useState } from "react";

// import { UserType } from '~~/types/healthcare';

interface UsePatientState {
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

interface UsePatientReturn extends UsePatientState {
  // Registration
  registerPatient: (emlContent: string, walletAddress: string) => Promise<void>;

  // Registration status from centralized hook
  registrationStatus: RegistrationStatus;
}

export function usePatient(): UsePatientReturn {
  const [state, setState] = useState<UsePatientState>({
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
        console.log("Mock: Checking registration status");
      },
    }),
    [],
  );

  const registerPatient = useCallback(
    async (emlContent: string, walletAddress: string) => {
      setState(prev => ({
        ...prev,
        isRegistering: true,
        error: null,
        registrationStep: "Starting patient registration...",
      }));

      try {
        // 1. Generate patient proof using vlayer
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
          registrationStep: "Registration completed successfully!",
        }));

        console.log("Mock: Patient registration completed", { emlContent, walletAddress });
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          isRegistering: false,
          error: error?.message || "Failed to register patient",
          registrationStep: "",
        }));
      }
    },
    [registrationStatus],
  );

  return {
    ...state,
    registerPatient,
    registrationStatus,
  };
}

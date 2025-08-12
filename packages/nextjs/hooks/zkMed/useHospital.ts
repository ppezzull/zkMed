"use client";

import { useCallback, useMemo, useState } from "react";
import { useProver } from "./useProver";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

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

  const { generateOrganizationProof, proof, previewRegistrationData } = useProver();
  const { writeContractAsync: writeCore } = useScaffoldWriteContract({ contractName: "zkMedCore" });

  const registerHospital = useCallback(
    async (emlContent: string, walletAddress: string, organizationName: string, domain: string) => {
      setState(prev => ({
        ...prev,
        isRegistering: true,
        error: null,
        registrationStep: "Starting hospital registration...",
      }));

      try {
        // 1) Generate org proof via vlayer
        setState(prev => ({ ...prev, registrationStep: "Generating email proof..." }));
        await generateOrganizationProof(emlContent);

        // 2) Build registration data (HOSPITAL role=0)
        setState(prev => ({ ...prev, registrationStep: "Submitting on-chain registration..." }));
        const reg = previewRegistrationData(proof);
        const data = {
          requestedRole: 0,
          walletAddress,
          domain,
          organizationName,
          emailHash: (reg?.emailHash as `0x${string}`) || "0x",
        } as any;

        await writeCore({
          functionName: "registerHospital",
          args: [proof as any, data],
        });

        // 5. Refresh registration status
        await registrationStatus.checkRegistration();

        setState(prev => ({
          ...prev,
          isRegistering: false,
          registrationStep: "Hospital registration completed successfully!",
        }));

        console.log("Hospital registration completed", {
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
    [generateOrganizationProof, proof, previewRegistrationData, writeCore, registrationStatus],
  );

  return {
    ...state,
    registerHospital,
    registrationStatus,
  };
}

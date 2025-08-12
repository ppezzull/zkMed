"use client";

import { useCallback, useMemo, useState } from "react";
import { useProver } from "./useProver";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

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

  const { generateOrganizationProof, proof, previewRegistrationData } = useProver();
  const { writeContractAsync: writeCore } = useScaffoldWriteContract({ contractName: "zkMedCore" });

  const registerInsurance = useCallback(
    async (emlContent: string, walletAddress: string, organizationName: string, domain: string) => {
      setState(prev => ({
        ...prev,
        isRegistering: true,
        error: null,
        registrationStep: "Starting insurance registration...",
      }));

      try {
        // 1) Generate org proof via vlayer
        setState(prev => ({ ...prev, registrationStep: "Generating email proof..." }));
        await generateOrganizationProof(emlContent);

        // 2) Build registration data (INSURER role=1)
        setState(prev => ({ ...prev, registrationStep: "Submitting on-chain registration..." }));
        const reg = previewRegistrationData(proof);
        const data = {
          requestedRole: 1,
          walletAddress,
          domain,
          organizationName,
          emailHash: (reg?.emailHash as `0x${string}`) || "0x",
        } as any;
        await writeCore({
          functionName: "registerInsurer",
          args: [proof as any, data],
        });

        // 5. Refresh registration status
        await registrationStatus.checkRegistration();

        setState(prev => ({
          ...prev,
          isRegistering: false,
          registrationStep: "Insurance registration completed successfully!",
        }));

        console.log("Insurance registration completed", {
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
    [generateOrganizationProof, proof, previewRegistrationData, writeCore, registrationStatus],
  );

  return {
    ...state,
    registerInsurance,
    registrationStatus,
  };
}

"use client";

import { useCallback, useMemo, useState } from "react";
import { useProver } from "./useProver";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import deployedContracts from "~~/contracts/deployedContracts";

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

  const { generatePatientProof, proof } = useProver();

  const { writeContractAsync: writeCore } = useScaffoldWriteContract({ contractName: "zkMedCore" });

  const registerPatient = useCallback(
    async (emlContent: string, walletAddress: string) => {
      setState(prev => ({
        ...prev,
        isRegistering: true,
        error: null,
        registrationStep: "Starting patient registration...",
      }));

      try {
        // 1) Generate patient proof via vlayer
        setState(prev => ({ ...prev, registrationStep: "Generating email proof..." }));
        await generatePatientProof(emlContent);

        // 2) Submit proof + data to core
        setState(prev => ({ ...prev, registrationStep: "Submitting on-chain registration..." }));
        const data = {
          walletAddress,
          emailHash: (proof?.outputs?.[1]?.emailHash as `0x${string}`) || "0x",
        } as any;
        await writeCore({
          functionName: "registerPatient",
          args: [proof as any, data],
        });

        // 5. Refresh registration status
        await registrationStatus.checkRegistration();

        setState(prev => ({
          ...prev,
          isRegistering: false,
          registrationStep: "Registration completed successfully!",
        }));

        console.log("Patient registration completed", { emlContent, walletAddress });
      } catch (error: any) {
        setState(prev => ({
          ...prev,
          isRegistering: false,
          error: error?.message || "Failed to register patient",
          registrationStep: "",
        }));
      }
    },
    [generatePatientProof, proof, writeCore, registrationStatus],
  );

  return {
    ...state,
    registerPatient,
    registrationStatus,
  };
}

"use client";

import { useCallback, useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

interface RegistrationData {
  requestedRole: number; // Changed from string to number (enum)
  walletAddress: string;
  domain: string;
  organizationName: string;
  emailHash: string;
}

interface UseVerifierState {
  isLoading: boolean;
  error: string | null;
  isVerifying: boolean;
  verificationStep: string;
  lastVerificationResult: any;
}

interface UseVerifierReturn extends UseVerifierState {
  // Verification methods
  verifyPatientProof: (proof: any) => Promise<any>;
  verifyOrganizationProof: (proof: any) => Promise<any>;

  // State management
  resetVerificationState: () => void;
}

export function useVerifier(): UseVerifierReturn {
  const [state, setState] = useState<UseVerifierState>({
    isLoading: false,
    error: null,
    isVerifying: false,
    verificationStep: "",
    lastVerificationResult: null,
  });

  // Single core contract for all registrations
  const { writeContractAsync: writeCore, isMining: isCoreMining } = useScaffoldWriteContract({
    contractName: "zkMedCore",
  });

  const verifyPatientProof = useCallback(
    async (proof: any) => {
      setState(prev => ({
        ...prev,
        isVerifying: true,
        error: null,
        verificationStep: "Verifying patient proof...",
      }));

      try {
        console.log("🔍 DEBUG - Starting patient proof verification");
        console.log("🔍 DEBUG - Full proof structure:", proof);

        // Extract proof data - vlayer returns the proof directly
        let proofForContract, registrationData;

        if (Array.isArray(proof)) {
          // If proof is an array: [proofObject, registrationData]
          proofForContract = proof[0];
          registrationData = proof[1] as RegistrationData;
        } else if (proof.outputs && Array.isArray(proof.outputs)) {
          // If proof has outputs array structure
          proofForContract = proof;
          registrationData = proof.outputs[1] as RegistrationData;
        } else {
          throw new Error("Invalid proof structure");
        }

        console.log("🔍 DEBUG - Parsed registration data:", registrationData);
        console.log("🔍 DEBUG - Parsed proof object:", proofForContract);

        if (!proofForContract || !registrationData) {
          throw new Error("Invalid proof structure - missing proof or registration data");
        }

        console.log("🔍 DEBUG - Calling core.registerPatient...");
        const result = await writeCore({
          functionName: "registerPatient",
          args: [proofForContract, registrationData],
        });

        console.log("🔍 DEBUG - Transaction result:", result);
        setState(prev => ({
          ...prev,
          isVerifying: false,
          verificationStep: "Patient proof verified successfully!",
          lastVerificationResult: result,
        }));

        return result;
      } catch (error: any) {
        console.error("🔍 DEBUG - Error in patient proof verification:", error);
        setState(prev => ({
          ...prev,
          isVerifying: false,
          error: error?.message || "Failed to verify patient proof",
          verificationStep: "",
        }));
        return null;
      }
    },
    [writeCore],
  );

  const verifyOrganizationProof = useCallback(
    async (proof: any) => {
      setState(prev => ({
        ...prev,
        isVerifying: true,
        error: null,
        verificationStep: "Verifying organization proof...",
      }));

      try {
        console.log("🔍 DEBUG - Starting organization proof verification");
        console.log("🔍 DEBUG - Full proof structure:", proof);

        // Extract proof data - vlayer returns the proof directly
        let proofForContract, extractedRegistrationData;

        if (Array.isArray(proof)) {
          // If proof is an array: [proofObject, registrationData]
          proofForContract = proof[0];
          extractedRegistrationData = proof[1] as RegistrationData;
        } else if (proof.outputs && Array.isArray(proof.outputs)) {
          // If proof has outputs array structure
          proofForContract = proof;
          extractedRegistrationData = proof.outputs[1] as RegistrationData;
        } else {
          throw new Error("Invalid proof structure");
        }

        console.log("🔍 DEBUG - Parsed registration data:", extractedRegistrationData);
        console.log("🔍 DEBUG - Parsed proof object:", proofForContract);

        if (!proofForContract || !extractedRegistrationData) {
          throw new Error("Invalid proof structure - missing proof or registration data");
        }

        // Determine which registration method to call based on role
        // UserType enum: PATIENT = 0, HOSPITAL = 1, INSURER = 2
        const isHospital = extractedRegistrationData.requestedRole === 0;

        console.log("🔍 DEBUG - Organization type:", isHospital ? "HOSPITAL" : "INSURER");

        let result;
        if (isHospital) {
          console.log("🔍 DEBUG - Calling core.registerHospital");
          result = await writeCore({
            functionName: "registerHospital",
            args: [proofForContract, extractedRegistrationData],
          });
        } else {
          console.log("🔍 DEBUG - Calling core.registerInsurer");
          result = await writeCore({
            functionName: "registerInsurer",
            args: [proofForContract, extractedRegistrationData],
          });
        }

        console.log("🔍 DEBUG - Transaction result:", result);
        setState(prev => ({
          ...prev,
          isVerifying: false,
          verificationStep: "Organization proof verified successfully!",
          lastVerificationResult: result,
        }));

        return result;
      } catch (error: any) {
        console.error("🔍 DEBUG - Error in organization proof verification:", error);
        setState(prev => ({
          ...prev,
          isVerifying: false,
          error: error?.message || "Failed to verify organization proof",
          verificationStep: "",
        }));
        return null;
      }
    },
    [writeCore],
  );

  const resetVerificationState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isVerifying: false,
      verificationStep: "",
      lastVerificationResult: null,
    });
  }, []);

  // Update loading state based on mining states
  const isLoading = state.isLoading || isCoreMining;

  return {
    ...state,
    isLoading,
    isVerifying: state.isVerifying || isCoreMining,
    verifyPatientProof,
    verifyOrganizationProof,
    resetVerificationState,
  };
}

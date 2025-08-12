"use client";

import { useCallback, useEffect, useState } from "react";
import { useCallProver, useWaitForProvingResult } from "@vlayer/react";
import { preverifyEmail } from "@vlayer/sdk";
import deployedContracts from "~~/contracts/deployedContracts";

interface RegistrationData {
  requestedRole: number; // Changed from string to number (enum)
  walletAddress: string;
  domain: string;
  organizationName: string;
  emailHash: string;
}

interface UseProverState {
  isLoading: boolean;
  error: string | null;
  isGeneratingProof: boolean;
  currentStep: string;
}

interface UseProverReturn extends UseProverState {
  // Proof generation
  generatePatientProof: (emlContent: string) => Promise<any>;
  generateOrganizationProof: (emlContent: string) => Promise<any>;

  // Current proof data
  proofHash: string | undefined;
  proof: any;

  // Utilities
  previewRegistrationData: (proof: any) => RegistrationData | null;
  validateProofStructure: (proof: any) => boolean;
}

export function useProver(): UseProverReturn {
  const [state, setState] = useState<UseProverState>({
    isLoading: false,
    error: null,
    isGeneratingProof: false,
    currentStep: "Ready",
  });

  const updateState = useCallback((updates: Partial<UseProverState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID ? Number(process.env.NEXT_PUBLIC_CHAIN_ID) : 31337;
  const patientProverDef = (deployedContracts as any)[CHAIN_ID]?.zkMedPatientProver;
  const orgProverDef = (deployedContracts as any)[CHAIN_ID]?.zkMedOrganizationProver;

  // Patient proof generation
  const {
    callProver: callPatientProver,
    isPending: isPatientProving,
    error: patientCallError,
    data: patientProofHash,
  } = useCallProver({
    address: (patientProverDef?.address || process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS) as `0x${string}`,
    proverAbi: patientProverDef?.abi,
    functionName: "provePatientEmail",
    gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT || 1000000),
    chainId: CHAIN_ID,
  });

  // Organization proof generation
  const {
    callProver: callOrganizationProver,
    isPending: isOrganizationProving,
    error: orgCallError,
    data: orgProofHash,
  } = useCallProver({
    address: (orgProverDef?.address || process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS) as `0x${string}`,
    proverAbi: orgProverDef?.abi,
    functionName: "proveOrganizationDomain",
    gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT || 1000000),
    chainId: CHAIN_ID,
  });

  // Active proof hash (either patient or organization)
  const activeProofHash = patientProofHash || orgProofHash;

  const { data: proof, isPending: isWaitingForResult, error: waitingError } = useWaitForProvingResult(activeProofHash);

  // Generate patient proof
  const generatePatientProof = useCallback(
    async (emlContent: string) => {
      // Add debugging logs
      console.log("🔍 DEBUG - generatePatientProof called:");
      console.log("🔍 DEBUG - EML content preview:", emlContent?.substring(0, 100));
      console.log("🔍 DEBUG - EML content length:", emlContent?.length);
      console.log("🔍 DEBUG - Is Nexthoop email?", emlContent?.includes("nexthoop.it"));
      console.log("🔍 DEBUG - Is Gmail email?", emlContent?.includes("gmail.com"));

      updateState({
        isGeneratingProof: true,
        isLoading: true,
        error: null,
        currentStep: "Preparing patient proof...",
      });

      try {
        updateState({ currentStep: "Preverifying email..." });

        // Preverify the email using vlayer SDK
        const preverifiedEmail = await preverifyEmail({
          mimeEmail: emlContent,
          dnsResolverUrl: process.env.NEXT_PUBLIC_DNS_SERVICE_URL || "http://localhost:3002",
          token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN!,
        });

        console.log("🔍 DEBUG - Email preverified successfully:", preverifiedEmail);

        updateState({ currentStep: "Generating cryptographic proof..." });

        // Structure the UnverifiedEmail parameter according to the contract ABI
        const unverifiedEmail = {
          email: preverifiedEmail.email,
          dnsRecord: {
            name: preverifiedEmail.dnsRecord.name,
            recordType: Number(preverifiedEmail.dnsRecord.type), // Convert to uint8
            data: preverifiedEmail.dnsRecord.data,
            ttl: Number(preverifiedEmail.dnsRecord.ttl), // Convert bigint to uint64
          },
          verificationData: {
            validUntil: Number(preverifiedEmail.verificationData.validUntil), // Convert bigint to uint64
            signature: preverifiedEmail.verificationData.signature, // Already bytes format
            pubKey: preverifiedEmail.verificationData.pubKey, // Already bytes format
          },
        };

        console.log("🔍 DEBUG - Structured UnverifiedEmail:", unverifiedEmail);

        // Call the vlayer prover with single tuple parameter (not array)
        await callPatientProver(unverifiedEmail as any);

        updateState({
          currentStep: "Waiting for proof result...",
          isGeneratingProof: false,
        });

        // Don't return proof immediately - it will be available via useWaitForProvingResult
        return patientProofHash;
      } catch (error: any) {
        console.log("🔍 DEBUG - Error in generatePatientProof:", error);
        updateState({
          isGeneratingProof: false,
          error: error?.message || "Failed to generate patient proof",
          currentStep: "",
        });
        throw error;
      }
    },
    [callPatientProver, patientProofHash],
  );

  // Generate organization proof
  const generateOrganizationProof = useCallback(
    async (emlContent: string) => {
      // Add debugging logs
      console.log("🔍 DEBUG - generateOrganizationProof called:");
      console.log("🔍 DEBUG - EML content preview:", emlContent?.substring(0, 100));
      console.log("🔍 DEBUG - EML content length:", emlContent?.length);
      console.log("🔍 DEBUG - Is Nexthoop email?", emlContent?.includes("nexthoop.it"));
      console.log("🔍 DEBUG - Is Gmail email?", emlContent?.includes("gmail.com"));

      updateState({
        isGeneratingProof: true,
        isLoading: true,
        error: null,
        currentStep: "Preparing organization proof...",
      });

      try {
        updateState({ currentStep: "Preverifying email..." });

        // Preverify the email using vlayer SDK
        const preverifiedEmail = await preverifyEmail({
          mimeEmail: emlContent,
          dnsResolverUrl: process.env.NEXT_PUBLIC_DNS_SERVICE_URL || "http://localhost:3002",
          token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN!,
        });

        console.log("🔍 DEBUG - Email preverified successfully:", preverifiedEmail);

        updateState({ currentStep: "Generating cryptographic proof..." });

        // Structure the UnverifiedEmail parameter according to the contract ABI
        const unverifiedEmail = {
          email: preverifiedEmail.email,
          dnsRecord: {
            name: preverifiedEmail.dnsRecord.name,
            recordType: Number(preverifiedEmail.dnsRecord.type), // Convert to uint8
            data: preverifiedEmail.dnsRecord.data,
            ttl: Number(preverifiedEmail.dnsRecord.ttl), // Convert bigint to uint64
          },
          verificationData: {
            validUntil: Number(preverifiedEmail.verificationData.validUntil), // Convert bigint to uint64
            signature: preverifiedEmail.verificationData.signature, // Already bytes format
            pubKey: preverifiedEmail.verificationData.pubKey, // Already bytes format
          },
        };

        console.log("🔍 DEBUG - Structured UnverifiedEmail:", unverifiedEmail);

        // Call the vlayer prover with single tuple parameter (not array)
        await callOrganizationProver(unverifiedEmail as any);

        updateState({
          currentStep: "Waiting for proof result...",
          isGeneratingProof: false,
        });

        // Don't return proof immediately - it will be available via useWaitForProvingResult
        return orgProofHash;
      } catch (error: any) {
        console.log("🔍 DEBUG - Error in generateOrganizationProof:", error);
        updateState({
          isGeneratingProof: false,
          error: error?.message || "Failed to generate organization proof",
          currentStep: "",
        });
        throw error;
      }
    },
    [callOrganizationProver, orgProofHash],
  );

  // Preview registration data from proof
  const previewRegistrationData = useCallback((proof: any): RegistrationData | null => {
    try {
      if (!proof || !proof.outputs || !proof.outputs[1]) {
        return null;
      }

      const registrationData = proof.outputs[1];

      return {
        requestedRole: registrationData.requestedRole,
        walletAddress: registrationData.walletAddress,
        domain: registrationData.domain || "",
        organizationName: registrationData.organizationName || "",
        emailHash: registrationData.emailHash,
      };
    } catch (error) {
      console.error("Error parsing registration data:", error);
      return null;
    }
  }, []);

  // Validate proof structure
  const validateProofStructure = useCallback((proof: any): boolean => {
    try {
      if (!proof) return false;

      // Check basic proof structure
      if (!proof.seal || !proof.callGuestId || typeof proof.length !== "number") {
        return false;
      }

      // Check outputs array
      if (!proof.outputs || !Array.isArray(proof.outputs) || proof.outputs.length < 2) {
        return false;
      }

      // Check registration data in outputs[1]
      const registrationData = proof.outputs[1];
      if (!registrationData || typeof registrationData !== "object") {
        return false;
      }

      // Check required fields
      const requiredFields = ["requestedRole", "walletAddress", "emailHash"];
      for (const field of requiredFields) {
        if (!(field in registrationData)) {
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Error validating proof structure:", error);
      return false;
    }
  }, []);

  // Update loading state based on sub-hooks
  const isLoading = isPatientProving || isOrganizationProving || isWaitingForResult || state.isGeneratingProof;

  // Update error state based on sub-hooks
  const error = state.error || patientCallError?.message || orgCallError?.message || waitingError?.message || null;

  // Handle when proof becomes available (like in useEmailProofVerification.ts)
  useEffect(() => {
    if (proof) {
      console.log("🔍 DEBUG - Proof received:", proof);
      updateState({
        currentStep: "Proof generated successfully!",
        isLoading: false,
        error: null,
      });
    }
  }, [proof]);

  // Handle waiting errors
  useEffect(() => {
    if (waitingError) {
      console.log("🔍 DEBUG - Waiting error:", waitingError);
      updateState({
        currentStep: "",
        isLoading: false,
        error: waitingError.message || "Failed to wait for proof result",
      });
    }
  }, [waitingError]);

  return {
    ...state,
    isLoading,
    error,
    generatePatientProof,
    generateOrganizationProof,
    proofHash: activeProofHash ? String(activeProofHash) : undefined,
    proof,
    previewRegistrationData,
    validateProofStructure,
  };
}

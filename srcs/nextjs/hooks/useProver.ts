'use client';

import { useState, useCallback } from 'react';
import { useCallProver, useWaitForProvingResult } from '@vlayer/react';
import type { RegistrationData } from '@/utils/types/healthcare';
import { HealthcareRegistrationProver__factory } from '@/utils/types/HealthcareRegistrationProver/factories/HealthcareRegistrationProver__factory';

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
    currentStep: 'Ready'
  });

  const updateState = useCallback((updates: Partial<UseProverState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Patient proof generation
  const {
    callProver: callPatientProver,
    isPending: isPatientProving,
    error: patientCallError,
    data: patientProofHash
  } = useCallProver({
    address: process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS as `0x${string}`,
    proverAbi: HealthcareRegistrationProver__factory.abi,
    functionName: 'provePatientEmail',
    gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT || 1000000),
  });

  // Organization proof generation
  const {
    callProver: callOrganizationProver,
    isPending: isOrganizationProving,
    error: orgCallError,
    data: orgProofHash
  } = useCallProver({
    address: process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS as `0x${string}`,
    proverAbi: HealthcareRegistrationProver__factory.abi,
    functionName: 'proveOrganizationDomain',
    gasLimit: Number(process.env.NEXT_PUBLIC_GAS_LIMIT || 1000000),
  });

  // Active proof hash (either patient or organization)
  const activeProofHash = patientProofHash || orgProofHash;
  
  const {
    data: proof,
    isPending: isWaitingForResult,
    error: waitingError,
  } = useWaitForProvingResult(activeProofHash);

  // Generate patient proof
  const generatePatientProof = useCallback(async (emlContent: string) => {
    updateState({ 
      isGeneratingProof: true, 
      isLoading: true, 
      error: null,
      currentStep: 'Preparing patient proof...'
    });

    try {
      updateState({ currentStep: 'Parsing email content...' });
      
      // Parse the email content
      const unverifiedEmail = parseEmailContent(emlContent);
      
      updateState({ currentStep: 'Generating cryptographic proof...' });
      
      // Call the vlayer prover
      await callPatientProver([unverifiedEmail]);
      
      updateState({ 
        currentStep: 'Proof generated successfully!',
        isGeneratingProof: false 
      });
      
      return proof;
    } catch (error: any) {
      updateState({ 
        isGeneratingProof: false,
        error: error?.message || 'Failed to generate patient proof',
        currentStep: ''
      });
      throw error;
    }
  }, [callPatientProver, proof]);

  // Generate organization proof
  const generateOrganizationProof = useCallback(async (emlContent: string) => {
    updateState({ 
      isGeneratingProof: true, 
      isLoading: true, 
      error: null,
      currentStep: 'Preparing organization proof...'
    });

    try {
      updateState({ currentStep: 'Parsing email content...' });
      
      // Parse the email content
      const unverifiedEmail = parseEmailContent(emlContent);
      
      updateState({ currentStep: 'Generating cryptographic proof...' });
      
      // Call the vlayer prover
      await callOrganizationProver([unverifiedEmail]);
      
      updateState({ 
        currentStep: 'Proof generated successfully!',
        isGeneratingProof: false 
      });
      
      return proof;
    } catch (error: any) {
      updateState({ 
        isGeneratingProof: false,
        error: error?.message || 'Failed to generate organization proof',
        currentStep: ''
      });
      throw error;
    }
  }, [callOrganizationProver, proof]);

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
        domain: registrationData.domain || '',
        organizationName: registrationData.organizationName || '',
        emailHash: registrationData.emailHash,
      };
    } catch (error) {
      console.error('Error parsing registration data:', error);
      return null;
    }
  }, []);

  // Validate proof structure
  const validateProofStructure = useCallback((proof: any): boolean => {
    try {
      if (!proof) return false;
      
      // Check basic proof structure
      if (!proof.seal || !proof.callGuestId || typeof proof.length !== 'number') {
        return false;
      }
      
      // Check outputs array
      if (!proof.outputs || !Array.isArray(proof.outputs) || proof.outputs.length < 2) {
        return false;
      }
      
      // Check registration data in outputs[1]
      const registrationData = proof.outputs[1];
      if (!registrationData || typeof registrationData !== 'object') {
        return false;
      }
      
      // Check required fields
      const requiredFields = ['requestedRole', 'walletAddress', 'emailHash'];
      for (const field of requiredFields) {
        if (!(field in registrationData)) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating proof structure:', error);
      return false;
    }
  }, []);

  // Helper function to parse email content
  const parseEmailContent = (emlContent: string) => {
    // TODO: Implement proper EML parsing
    // For now, return a mock structure based on the expected format
    return {
      email: emlContent,
      dnsRecord: {
        name: "",
        recordType: 0,
        data: "",
        ttl: 0,
      },
      verificationData: {
        validUntil: 0,
        signature: "0x",
        pubKey: "0x",
      },
    };
  };

  // Update loading state based on sub-hooks
  const isLoading = isPatientProving || isOrganizationProving || isWaitingForResult || state.isGeneratingProof;
  
  // Update error state based on sub-hooks
  const error = state.error || patientCallError?.message || orgCallError?.message || waitingError?.message || null;

  return {
    ...state,
    isLoading,
    error,
    generatePatientProof,
    generateOrganizationProof,
    proofHash: activeProofHash ? String(activeProofHash) : undefined,
    proof,
    previewRegistrationData,
    validateProofStructure
  };
} 
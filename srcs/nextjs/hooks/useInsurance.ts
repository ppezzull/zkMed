'use client';

import React, { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useCallProver, useWaitForProvingResult } from '@vlayer/react';
import { prepareContractCall, sendTransaction } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';
import { useProver } from './useProver';
import { useVerifier } from './useVerifier';

interface UseInsuranceState {
  isLoading: boolean;
  error: string | null;
  isRegistering: boolean;
  isGeneratingProof: boolean;
  registrationStep: string;
}

interface UseInsuranceReturn extends UseInsuranceState {
  // Registration
  registerInsurer: (emlContent: string, organizationName: string, walletAddress: string) => Promise<void>;
}

export function useInsurance(): UseInsuranceReturn {
  const account = useActiveAccount();
  const prover = useProver();
  const verifier = useVerifier();
  
  const [state, setState] = useState<UseInsuranceState>({
    isLoading: false,
    error: null,
    isRegistering: false,
    isGeneratingProof: false,
    registrationStep: '',
  });

  const registerInsurer = useCallback(async (emlContent: string, organizationName: string, walletAddress: string) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isRegistering: true, 
      error: null,
      registrationStep: 'Starting insurance registration...'
    }));

    try {
      // Generate organization proof
      setState(prev => ({ ...prev, registrationStep: 'Generating domain proof...' }));
      const proofResult = await prover.generateOrganizationProof(emlContent);
      
      if (!proofResult || !prover.validateProofStructure(proofResult)) {
        throw new Error('Invalid proof generated');
      }

      // Get registration data
      const registrationData = prover.previewRegistrationData(proofResult);
      if (!registrationData) {
        throw new Error('Could not extract registration data from proof');
      }

      // Verify proof
      setState(prev => ({ ...prev, registrationStep: 'Verifying proof on-chain...' }));
      const verificationResult = await verifier.verifyOrganizationProof(proofResult, registrationData);
      
      if (!verificationResult) {
        throw new Error('Proof verification failed');
      }

      setState(prev => ({ 
        ...prev, 
        isRegistering: false,
        registrationStep: 'Registration completed successfully!'
      }));

    } catch (error: any) {
      setState(prev => ({ 
        ...prev, 
        isRegistering: false,
        error: error?.message || 'Failed to register insurance company',
        registrationStep: ''
      }));
    }
  }, [account, prover, verifier]);

  // Update loading states based on sub-hooks
  const isLoading = state.isLoading || prover.isLoading || verifier.isLoading;
  const isGeneratingProof = state.isGeneratingProof || prover.isGeneratingProof;
  const error = state.error || prover.error || verifier.error;

  return {
    ...state,
    isLoading,
    isGeneratingProof,
    error,
    registerInsurer,
  };
}
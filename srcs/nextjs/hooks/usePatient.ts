'use client';

import { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useProver } from './useProver';
import { useVerifier } from './useVerifier';

// Import the prover specs (will need to be updated with actual imports)
// import proverSpec from '@/contracts/HealthcareRegistrationProver.json';

interface UsePatientState {
  isLoading: boolean;
  error: string | null;
  isRegistering: boolean;
  isGeneratingProof: boolean;
  registrationStep: string;
}

interface UsePatientReturn extends UsePatientState {
  // Registration
  registerPatient: (emlContent: string, walletAddress: string) => Promise<void>;
}

export function usePatient(): UsePatientReturn {
  const account = useActiveAccount();
  const prover = useProver();
  const verifier = useVerifier();
  
  const [state, setState] = useState<UsePatientState>({
    isLoading: false,
    error: null,
    isRegistering: false,
    isGeneratingProof: false,
    registrationStep: '',
  });

  const registerPatient = useCallback(async (emlContent: string, walletAddress: string) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isRegistering: true, 
      error: null,
      registrationStep: 'Starting patient registration...'
    }));

    try {
      // Generate patient proof
      setState(prev => ({ ...prev, registrationStep: 'Generating email proof...' }));
      const proofResult = await prover.generatePatientProof(emlContent);
      
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
      const verificationResult = await verifier.verifyPatientProof(proofResult, registrationData);
      
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
        error: error?.message || 'Failed to register patient',
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
    registerPatient,
  };
}
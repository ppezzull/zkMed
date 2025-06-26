'use client';

import { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useProver } from './useProver';
import { useVerifier } from './useVerifier';
import { useRegistrationStatus } from './useRegistrationStatus';
import { RegistrationData, UserType } from '@/utils/types/healthcare';

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
  
  // Registration status from centralized hook
  registrationStatus: ReturnType<typeof useRegistrationStatus>;
}

export function usePatient(): UsePatientReturn {
  const account = useActiveAccount();
  const prover = useProver();
  const verifier = useVerifier();
  const registrationStatus = useRegistrationStatus();
  
  const [state, setState] = useState<UsePatientState>({
    isLoading: false,
    error: null,
    isRegistering: false,
    isGeneratingProof: false,
    registrationStep: '',
  });

  const registerPatient = useCallback(async (emlContent: string, walletAddress: string) => {
    if (!account || account.address.toLowerCase() !== walletAddress.toLowerCase()) {
      setState(prev => ({ ...prev, error: 'Wallet address mismatch' }));
      return;
    }

    setState(prev => ({ 
      ...prev, 
      isRegistering: true, 
      error: null,
      registrationStep: 'Starting patient registration...'
    }));

    try {
      // 1. Generate patient proof using vlayer
      setState(prev => ({ ...prev, registrationStep: 'Generating email proof...' }));
      const proofResult = await prover.generatePatientProof(emlContent);
      
      if (!proofResult || !prover.validateProofStructure(proofResult)) {
        throw new Error('Invalid proof generated');
      }

      // 2. Extract registration data from proof
      const registrationData = prover.previewRegistrationData(proofResult);
      if (!registrationData) {
        throw new Error('Could not extract registration data from proof');
      }

      // 3. Validate registration data matches smart contract requirements
      if (registrationData.requestedRole !== UserType.PATIENT) {
        throw new Error('Invalid role for patient registration');
      }

      if (registrationData.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
        throw new Error('Wallet address in proof does not match connected wallet');
      }

      // 4. Submit proof to smart contract for verification and registration
      setState(prev => ({ ...prev, registrationStep: 'Verifying proof on-chain...' }));
      const verificationResult = await verifier.verifyPatientProof(proofResult, registrationData);
      
      if (!verificationResult) {
        throw new Error('Proof verification failed');
      }

      // 5. Refresh registration status
      await registrationStatus.checkRegistration();

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
  }, [account, prover, verifier, registrationStatus]);

  // Update loading states based on sub-hooks
  const isLoading = state.isLoading || prover.isLoading || verifier.isLoading || registrationStatus.isLoading;
  const isGeneratingProof = state.isGeneratingProof || prover.isGeneratingProof;
  const error = state.error || prover.error || verifier.error || registrationStatus.error;

  return {
    ...state,
    isLoading,
    isGeneratingProof,
    error,
    registerPatient,
    registrationStatus,
  };
}
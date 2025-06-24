'use client';

import React, { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useCallProver, useWaitForProvingResult } from '@vlayer/react';
import { prepareContractCall, sendTransaction, getContract, readContract } from 'thirdweb';
import { client } from '@/utils/thirdweb/client';
import { getClientChain } from '@/lib/configs/chain-config';
import { 
  PatientRecord, 
  RegistrationData, 
  UserType,
  ProofData,
  BaseRecord
} from '@/utils/types/healthcare';
import { 
  getPatientRecord,
  getUserVerificationData
} from '@/lib/actions/healthcare';
import { HealthcareRegistration__factory } from '@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory';
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
  
  // Data fetching
  fetchPatientRecord: (address: string) => Promise<PatientRecord | null>;
  fetchUserVerification: (address: string) => Promise<any>;
}

const getHealthcareContract = () => {
  const contractAddress = process.env.NEXT_PUBLIC_HEALTHCARE_CONTRACT_ADDRESS;
  if (!contractAddress) {
    throw new Error('Healthcare contract address not found');
  }

  return getContract({
    client,
    chain: getClientChain(),
    address: contractAddress as `0x${string}`,
    abi: HealthcareRegistration__factory.abi,
  });
};

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

  const fetchPatientRecord = useCallback(async (address: string): Promise<PatientRecord | null> => {
    try {
      const contract = getHealthcareContract();
      
      // Use the patientRecords mapping directly
      const result = await readContract({
        contract,
        method: 'patientRecords',
        params: [address]
      });
      
      // Parse the contract return (BaseRecord) into PatientRecord interface
      const baseRecord = result as BaseRecord;
      
      return {
        base: baseRecord
      };
    } catch (error) {
      console.error('Error fetching patient record:', error);
      return null;
    }
  }, []);

  const fetchUserVerification = useCallback(async (address: string): Promise<any> => {
    try {
      const contract = getHealthcareContract();
      
      // Use userTypes mapping to get user type
      const userType = await readContract({
        contract,
        method: 'userTypes',
        params: [address]
      });
      
      // Check if user is registered and active
      const isRegistered = await readContract({
        contract,
        method: 'isUserRegistered',
        params: [address]
      });
      
      return { userType, isRegistered };
    } catch (error) {
      console.error('Error fetching user verification:', error);
      return null;
    }
  }, []);

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
    fetchPatientRecord,
    fetchUserVerification,
  };
} 
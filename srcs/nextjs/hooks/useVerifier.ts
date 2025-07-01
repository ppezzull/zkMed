'use client';

import { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, sendTransaction } from 'thirdweb';
import { getHealthcareContract } from '@/lib/utils';
import { RegistrationData, UserType } from '@/utils/types/healthcare';

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
  const account = useActiveAccount();
  
  const [state, setState] = useState<UseVerifierState>({
    isLoading: false,
    error: null,
    isVerifying: false,
    verificationStep: '',
    lastVerificationResult: null,
  });

  const verifyPatientProof = useCallback(async (proof: any) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      isVerifying: true, 
      error: null,
      verificationStep: 'Verifying patient proof...'
    }));

    // The prover returns an array: [proofObject, registrationData]
    const proofForContract = proof[0]; // Proof calldata
    const registrationData = proof[1] as RegistrationData;

    try {
      console.log("🔍 DEBUG - Starting patient proof verification");
      console.log("🔍 DEBUG - Full proof structure:", proof);
      console.log("🔍 DEBUG - Parsed registration data (proof[1]):", registrationData);
      console.log("🔍 DEBUG - Parsed proof object (proof[0]):", proofForContract);
      
      if (!proofForContract || !registrationData) {
        throw new Error('Invalid proof structure - missing proof or registration data');
      }
      
      const contract = getHealthcareContract();
      
      const transaction = prepareContractCall({
        contract,
        method: 'registerPatient',
        params: [proofForContract, registrationData]
      });
      
      console.log("🔍 DEBUG - Sending transaction...");
      const result = await sendTransaction({
        transaction,
        account,
      });

      console.log("🔍 DEBUG - Transaction result:", result);
      setState(prev => ({ 
        ...prev, 
        isVerifying: false,
        verificationStep: 'Patient proof verified successfully!',
        lastVerificationResult: result
      }));

      return result;
    } catch (error: any) {
      console.error("🔍 DEBUG - Error in patient proof verification:", error);
      setState(prev => ({ 
        ...prev, 
        isVerifying: false,
        error: error?.message || 'Failed to verify patient proof',
        verificationStep: ''
      }));
      return null;
    }
  }, [account]);

  const verifyOrganizationProof = useCallback(async (proof: any) => {
    if (!account) {
      setState(prev => ({ ...prev, error: 'Wallet not connected' }));
      return null;
    }

    setState(prev => ({ 
      ...prev, 
      isVerifying: true, 
      error: null,
      verificationStep: 'Verifying organization proof...'
    }));

    // The prover returns an array: [proofObject, registrationData]
    const proofForContract = proof[0]; // Proof calldata
    const extractedRegistrationData = proof[1] as RegistrationData;

    try {
      console.log("🔍 DEBUG - Starting organization proof verification");
      console.log("🔍 DEBUG - Full proof structure:", proof);
      console.log("🔍 DEBUG - Parsed registration data (proof[1]):", extractedRegistrationData);
      console.log("🔍 DEBUG - Parsed proof object (proof[0]):", proofForContract);
      console.log("🔍 DEBUG - Account address:", account?.address);
      console.log("🔍 DEBUG - Registration wallet:", extractedRegistrationData?.walletAddress);
      
      if (!proofForContract || !extractedRegistrationData) {
        throw new Error('Invalid proof structure - missing proof or registration data');
      }
      
      const contract = getHealthcareContract();
      
      // Choose the correct registration method based on organization type
      const method = extractedRegistrationData.requestedRole === UserType.HOSPITAL 
        ? 'registerHospital' 
        : 'registerInsurer';
      
      console.log("🔍 DEBUG - Using method:", method);
      
      const transaction = prepareContractCall({
        contract,
        method,
        params: [proofForContract, extractedRegistrationData]
      });
      
      console.log("🔍 DEBUG - Sending transaction...");
      const result = await sendTransaction({
        transaction,
        account,
      });

      console.log("🔍 DEBUG - Transaction result:", result);
      setState(prev => ({ 
        ...prev, 
        isVerifying: false,
        verificationStep: 'Organization proof verified successfully!',
        lastVerificationResult: result
      }));

      return result;
    } catch (error: any) {
      console.error("🔍 DEBUG - Error in organization proof verification:", error);
      setState(prev => ({ 
        ...prev, 
        isVerifying: false,
        error: error?.message || 'Failed to verify organization proof',
        verificationStep: ''
      }));
      return null;
    }
  }, [account]);

  const resetVerificationState = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      isVerifying: false,
      verificationStep: '',
      lastVerificationResult: null,
    });
  }, []);

  return {
    ...state,
    verifyPatientProof,
    verifyOrganizationProof,
    resetVerificationState,
  };
} 
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
  verifyPatientProof: (proof: any, registrationData: RegistrationData) => Promise<any>;
  verifyOrganizationProof: (proof: any, registrationData: RegistrationData) => Promise<any>;
  
  // Utilities
  validateProofBeforeVerification: (proof: any, registrationData: RegistrationData) => boolean;
  extractVerificationData: (result: any) => any;
  
  // State management
  resetVerificationState: () => void;
}

// Helper function to convert RegistrationData to contract-compatible format
const toContractRegistrationData = (data: RegistrationData) => ({
  requestedRole: data.requestedRole,
  walletAddress: data.walletAddress,
  domain: data.domain,
  organizationName: data.organizationName,
  emailHash: data.emailHash.startsWith('0x') ? data.emailHash as `0x${string}` : `0x${data.emailHash}` as `0x${string}`
});

export function useVerifier(): UseVerifierReturn {
  const account = useActiveAccount();
  
  const [state, setState] = useState<UseVerifierState>({
    isLoading: false,
    error: null,
    isVerifying: false,
    verificationStep: '',
    lastVerificationResult: null,
  });

  const verifyPatientProof = useCallback(async (proof: any, registrationData: RegistrationData) => {
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

    try {
      console.log("🔍 DEBUG - Starting patient proof verification");
      console.log("🔍 DEBUG - Proof received:", proof);
      console.log("🔍 DEBUG - Registration data:", registrationData);
      
      const contract = getHealthcareContract();
      
      // Convert to contract-compatible format
      const contractData = toContractRegistrationData(registrationData);
      console.log("🔍 DEBUG - Contract data:", contractData);
      
      // Extract the actual proof object from vlayer result
      // vlayer returns [Proof, RegistrationData], but we only need the Proof part
      const proofObject = Array.isArray(proof) ? proof[0] : proof;
      console.log("🔍 DEBUG - Extracted proof object:", proofObject);
      
      const transaction = prepareContractCall({
        contract,
        method: 'registerPatient',
        params: [contractData, proofObject]
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

  const verifyOrganizationProof = useCallback(async (proof: any, registrationData: RegistrationData) => {
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

    try {
      console.log("🔍 DEBUG - Starting organization proof verification");
      console.log("🔍 DEBUG - Proof received:", proof);
      console.log("🔍 DEBUG - Registration data:", registrationData);
      
      const contract = getHealthcareContract();
      
      // Choose the correct registration method based on organization type
      const method = registrationData.requestedRole === UserType.HOSPITAL 
        ? 'registerHospital' 
        : 'registerInsurer';
      
      console.log("🔍 DEBUG - Using method:", method);
      
      // Convert to contract-compatible format
      const contractData = toContractRegistrationData(registrationData);
      console.log("🔍 DEBUG - Contract data:", contractData);
      
      // Extract the actual proof object from vlayer result
      // vlayer returns [Proof, RegistrationData], but we only need the Proof part
      const proofObject = Array.isArray(proof) ? proof[0] : proof;
      console.log("🔍 DEBUG - Extracted proof object:", proofObject);
      
      const transaction = prepareContractCall({
        contract,
        method,
        params: [contractData, proofObject]
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

  const validateProofBeforeVerification = useCallback((proof: any, registrationData: RegistrationData): boolean => {
    try {
      console.log("🔍 DEBUG - Validating proof before verification:");
      console.log("🔍 DEBUG - Proof:", proof);
      console.log("🔍 DEBUG - Registration data:", registrationData);
      
      // Basic validation
      if (!proof || !registrationData) {
        console.log("🔍 DEBUG - Missing proof or registration data");
        return false;
      }

      // Check registration data has required fields
      if (!registrationData.walletAddress || !registrationData.emailHash) {
        console.log("🔍 DEBUG - Missing required registration data fields");
        return false;
      }

      console.log("🔍 DEBUG - Basic proof validation passed");
      return true;
    } catch (error) {
      console.error('🔍 DEBUG - Error validating proof before verification:', error);
      return false;
    }
  }, []);

  const extractVerificationData = useCallback((result: any) => {
    try {
      if (!result) return null;
      
      // Extract meaningful data from transaction result
      return {
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
        status: result.status
      };
    } catch (error) {
      console.error('Error extracting verification data:', error);
      return null;
    }
  }, []);

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
    validateProofBeforeVerification,
    extractVerificationData,
    resetVerificationState,
  };
} 
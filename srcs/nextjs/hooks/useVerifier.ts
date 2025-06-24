'use client';

import { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, sendTransaction, getContract } from 'thirdweb';
import { client } from '@/utils/thirdweb/client';
import { getClientChain } from '@/lib/configs/chain-config';
import { RegistrationData, UserType } from '@/utils/types/healthcare';
import { HealthcareRegistration__factory } from '@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory';
import { getHealthcareRegistrationAddress } from '@/lib/addresses';

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

const getHealthcareContract = () => {
  const contractAddress = getHealthcareRegistrationAddress();
  if (!contractAddress) {
    throw new Error('Healthcare contract address not configured');
  }

  return getContract({
    client,
    chain: getClientChain(),
    address: contractAddress as `0x${string}`,
    abi: HealthcareRegistration__factory.abi,
  });
};

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
      const contract = getHealthcareContract();
      
      // Convert to contract-compatible format
      const contractData = toContractRegistrationData(registrationData);
      
      const transaction = prepareContractCall({
        contract,
        method: 'registerPatient',
        params: [contractData, proof]
      });
      
      const result = await sendTransaction({
        transaction,
        account,
      });

      setState(prev => ({ 
        ...prev, 
        isVerifying: false,
        verificationStep: 'Patient proof verified successfully!',
        lastVerificationResult: result
      }));

      return result;
    } catch (error: any) {
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
      const contract = getHealthcareContract();
      
      // Choose the correct registration method based on organization type
      const method = registrationData.requestedRole === UserType.HOSPITAL 
        ? 'registerHospital' 
        : 'registerInsurer';
      
      // Convert to contract-compatible format
      const contractData = toContractRegistrationData(registrationData);
      
      const transaction = prepareContractCall({
        contract,
        method,
        params: [contractData, proof]
      });
      
      const result = await sendTransaction({
        transaction,
        account,
      });

      setState(prev => ({ 
        ...prev, 
        isVerifying: false,
        verificationStep: 'Organization proof verified successfully!',
        lastVerificationResult: result
      }));

      return result;
    } catch (error: any) {
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
      // Basic validation
      if (!proof || !registrationData) {
        return false;
      }

      // Check proof structure
      if (!proof.seal || !proof.callGuestId || typeof proof.length !== 'number') {
        return false;
      }

      // Check registration data
      if (!registrationData.walletAddress || !registrationData.emailHash) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error validating proof before verification:', error);
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
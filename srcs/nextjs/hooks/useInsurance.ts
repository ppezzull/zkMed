'use client';

import React, { useCallback, useState } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useCallProver, useWaitForProvingResult } from '@vlayer/react';
import { prepareContractCall, sendTransaction, getContract, readContract } from 'thirdweb';
import { client } from '@/utils/thirdweb/client';
import { getClientChain } from '@/lib/configs/chain-config';
import { 
  OrganizationRecord, 
  RegistrationData, 
  UserType,
  RequestType,
  BaseRecord
} from '@/utils/types/healthcare';
import { 
  getOrganizationRecord,
  getUserVerificationData,
  validateInsurerDomain,
  isDomainTaken,
  getPendingRequestsByType
} from '@/lib/actions/healthcare';
import { HealthcareRegistration__factory } from '@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory';
import { getHealthcareRegistrationAddress } from '@/lib/addresses';
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
  
  // Domain validation
  checkDomainAvailability: (domain: string) => Promise<boolean>;
  validateDomain: (domain: string) => Promise<boolean>;
  
  // Data fetching
  fetchInsuranceRecord: (address: string) => Promise<OrganizationRecord | null>;
  fetchUserVerification: (address: string) => Promise<any>;
  fetchPendingInsuranceRequests: () => Promise<bigint[]>;
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

  const checkDomainAvailability = useCallback(async (domain: string): Promise<boolean> => {
    try {
      const contract = getHealthcareContract();
      
      // Use the domainToUser mapping to check availability
      const result = await readContract({
        contract,
        method: 'isDomainTaken',
        params: [domain]
      });
      
      return !result; // Return true if available (not taken)
    } catch (error) {
      console.error('Error checking domain availability:', error);
      return false;
    }
  }, []);

  const validateDomain = useCallback(async (domain: string): Promise<boolean> => {
    try {
      const contract = getHealthcareContract();
      
      const result = await readContract({
        contract,
        method: 'validateInsurerDomain',
        params: [domain]
      });
      
      return result as boolean;
    } catch (error) {
      console.error('Error validating domain:', error);
      return false;
    }
  }, []);

  const fetchInsuranceRecord = useCallback(async (address: string): Promise<OrganizationRecord | null> => {
    try {
      const contract = getHealthcareContract();
      
      // Use the organizationRecords mapping directly
      const result = await readContract({
        contract,
        method: 'organizationRecords',
        params: [address]
      });
      
      // Parse the contract return tuple into OrganizationRecord interface
      // Contract returns: [BaseRecord, UserType, string domain, string organizationName]
      const [baseRecord, orgType, domain, organizationName] = result as [BaseRecord, number, string, string];
      
      return {
        base: baseRecord,
        orgType: orgType as UserType,
        domain,
        organizationName
      };
    } catch (error) {
      console.error('Error fetching insurance record:', error);
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

  const fetchPendingInsuranceRequests = useCallback(async (): Promise<bigint[]> => {
    try {
      const contract = getHealthcareContract();
      
      const result = await readContract({
        contract,
        method: 'getPendingRequestsByType',
        params: [1] // RequestType.ORG_REGISTRATION = 1
      });
      
      return result as bigint[];
    } catch (error) {
      console.error('Error fetching pending insurance requests:', error);
      return [];
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
    registerInsurer,
    checkDomainAvailability,
    validateDomain,
    fetchInsuranceRecord,
    fetchUserVerification,
    fetchPendingInsuranceRequests,
  };
} 
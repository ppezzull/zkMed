import { useState, useEffect, useCallback, useRef } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, getContract, sendAndConfirmTransaction, readContract } from 'thirdweb';
import { preverifyEmail } from '@vlayer/sdk';
import { useCallProver, useWaitForProvingResult } from '@vlayer/react';
import { UserType, UserRecord } from '@/utils/types/healthcare';
import { HealthcareRegistration__factory } from '@/utils/types/HealthcareRegistration/factories/HealthcareRegistration__factory';
import { HealthcareRegistrationProver__factory } from '@/utils/types/HealthcareRegistrationProver/factories/HealthcareRegistrationProver__factory';
import { getClientChain } from '@/lib/configs/chain-config';
import client from '@/utils/thirdwebClient';
import { getContractAddresses } from '@/lib/contracts/addresses';
import { keccak256, toBytes } from 'viem';

// Registration step enum
enum RegistrationStep {
  IDLE = "Choose your role",
  PATIENT_EMAIL_COLLECT = "Enter your email address",
  PATIENT_REGISTERING = "Registering patient...",
  ORG_SEND_EMAIL = "Send verification email",
  ORG_EMAIL_SENT = "Email sent, check inbox",
  ORG_COLLECT_EMAIL = "Paste email content",
  ORG_PROVING = "Generating proof...",
  ORG_WAITING_PROOF = "Waiting for proof...",
  ORG_REGISTERING = "Registering organization...",
  SUCCESS = "Registration successful!",
  ERROR = "Registration failed"
}

export interface RegistrationState {
  currentStep: RegistrationStep;
  userRole: UserType | null;
  userRecord: UserRecord | null;
  isRegistered: boolean;
  loading: boolean;
  txLoading: boolean;
  error: string | null;
  txHash: string | null;
  organizationType: 'HOSPITAL' | 'INSURER' | null;
  organizationName: string;
  walletAddress: string;
  uniqueEmail: string;
  patientEmail: string;
}

export interface RegistrationActions {
  checkUserRole: () => Promise<void>;
  registerPatient: (email?: string) => Promise<void>;
  setOrganizationType: (type: 'HOSPITAL' | 'INSURER') => void;
  setOrganizationName: (name: string) => void;
  generateUniqueEmail: () => void;
  startOrganizationRegistration: (emlContent: string) => Promise<void>;
  setPatientEmail: (email: string) => void;
  reset: () => void;
}

export function useHealthcareRegistration(): RegistrationState & RegistrationActions {
  // Thirdweb account
  const account = useActiveAccount();
  const chain = getClientChain();
  const { 
    healthcareRegistration: healthcareRegistrationAddress, 
    healthcareRegistrationProver: healthcareRegistrationProverAddress 
  } = getContractAddresses();

  // State
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.IDLE);
  const [userRole, setUserRole] = useState<UserType | null>(null);
  const [userRecord, setUserRecord] = useState<UserRecord | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [organizationType, setOrganizationType] = useState<'HOSPITAL' | 'INSURER' | null>(null);
  const [organizationName, setOrganizationName] = useState('');
  const [uniqueEmail, setUniqueEmail] = useState('');
  const [patientEmail, setPatientEmail] = useState('');

  // Ref to prevent duplicate calls
  const isCheckingRole = useRef(false);

  // Vlayer prover hooks
  const {
    callProver,
    data: proofHash,
    error: proverError,
  } = useCallProver({
    address: healthcareRegistrationProverAddress as `0x${string}`,
    proverAbi: HealthcareRegistrationProver__factory.abi,
    functionName: "main",
    chainId: chain.id,
  });

  const { data: proof, error: provingError } = useWaitForProvingResult(proofHash);

  // Check user role
  const checkUserRole = useCallback(async () => {
    if (!account?.address || isCheckingRole.current) return;
    
    isCheckingRole.current = true;
    setLoading(true);
    try {      
      const contract = getContract({
        client,
        chain,
        address: healthcareRegistrationAddress as `0x${string}`,
        abi: HealthcareRegistration__factory.abi,
      });

      const isRegistered = await readContract({
        contract,
        method: "isUserRegistered",
        params: [account.address as `0x${string}`]
      });

      setIsRegistered(isRegistered as boolean);

      if (isRegistered) {
        console.log('User is registered, fetching user record...');
        const recordResult = await readContract({
          contract,
          method: "getUserRecord",
          params: [account.address as `0x${string}`]
        });

        console.log('Raw record result:', recordResult);
        const record = recordResult as UserRecord;
        console.log('Parsed record:', record);
        console.log('User type from record:', record.userType);
        
        setUserRole(record.userType);
        setUserRecord(record);
      } else {
        console.log('User is not registered');
        setUserRole(null);
        setUserRecord(null);
      }
    } catch (err) {
      console.error('Error checking user role:', err);
      setError('Failed to check user role');
    } finally {
      setLoading(false);
      isCheckingRole.current = false;
    }
  }, [account?.address, chain, healthcareRegistrationAddress]);

  // Helper function to hash email
  const hashEmail = useCallback((email: string): `0x${string}` => {
    return keccak256(toBytes(email.toLowerCase().trim()));
  }, []);

  // Register patient
  const registerPatient = useCallback(async (email?: string) => {
    if (!account?.address) {
      setError('No wallet connected');
      return;
    }

    const emailToUse = email || patientEmail;
    if (!emailToUse) {
      setError('Email address is required');
      return;
    }

    try {
      setCurrentStep(RegistrationStep.PATIENT_REGISTERING);
      setTxLoading(true);
      setError(null);
      
      // Create contract with manual ABI to work around type mismatch
      const manualAbi = [
        {
          "type": "function",
          "name": "registerPatient",
          "inputs": [
            {"name": "patientWallet", "type": "address"},
            {"name": "patientEmailHash", "type": "bytes32"}
          ],
          "outputs": [],
          "stateMutability": "nonpayable"
        }
      ] as const;

      const contract = getContract({
        client,
        chain,
        address: healthcareRegistrationAddress as `0x${string}`,
        abi: manualAbi,
      });

      // Hash the email address
      const emailHash = hashEmail(emailToUse);

      const transaction = prepareContractCall({
        contract,
        method: "registerPatient",
        params: [account.address as `0x${string}`, emailHash],
      });

      const result = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      setTxHash(result.transactionHash);
      setCurrentStep(RegistrationStep.SUCCESS);
      
      // Refresh data after successful transaction - removed setTimeout to prevent infinite loops

    } catch (err) {
      console.error('Error registering patient:', err);
      setError('Failed to register patient');
      setCurrentStep(RegistrationStep.ERROR);
    } finally {
      setTxLoading(false);
    }
  }, [account, chain, healthcareRegistrationAddress, patientEmail, hashEmail]);

  // Generate unique email for organization registration
  const generateUniqueEmail = useCallback(() => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const email = `${randomId}-${timestamp}@proving.vlayer.xyz`;
    setUniqueEmail(email);
    setCurrentStep(RegistrationStep.ORG_SEND_EMAIL);
  }, []);

  // Start organization registration with email proof
  const startOrganizationRegistration = useCallback(async (emlContent: string) => {
    if (!account?.address || !organizationType || !organizationName) {
      setError('Missing registration information');
      return;
    }

    try {
      setCurrentStep(RegistrationStep.ORG_PROVING);
      setLoading(true);
      setError(null);

      // Preverify email
      const email = await preverifyEmail({
        mimeEmail: emlContent,
        dnsResolverUrl: process.env.NEXT_PUBLIC_DNS_SERVICE_URL || 'http://localhost:8080',
        token: process.env.NEXT_PUBLIC_VLAYER_API_TOKEN || '',
      });

      setCurrentStep(RegistrationStep.ORG_WAITING_PROOF);
      
      // Call prover with just the email parameter
      await callProver([email]);

    } catch (err) {
      console.error('Error starting organization registration:', err);
      setError('Failed to generate proof');
      setCurrentStep(RegistrationStep.ERROR);
      setLoading(false);
    }
  }, [account?.address, organizationType, organizationName, callProver]);

  // Register organization when proof is ready
  const registerOrganization = useCallback(async () => {
    if (!proof || !account?.address || !organizationType) return;

    try {
      setCurrentStep(RegistrationStep.ORG_REGISTERING);
      setTxLoading(true);
      
      const functionName = organizationType === 'HOSPITAL' 
        ? 'registerHospitalWithMailProof' 
        : 'registerInsurerWithMailProof';

      const contract = getContract({
        client,
        chain,
        address: healthcareRegistrationAddress as `0x${string}`,
        abi: HealthcareRegistration__factory.abi,
      });

      // Assuming proof is an array where [0] is the proof and [1] is the registration data
      const [proofData, registrationData] = Array.isArray(proof) ? proof : [proof, undefined];

      const transaction = prepareContractCall({
        contract,
        method: functionName,
        params: [registrationData, proofData], // registrationData, proof
      });

      const result = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      setTxHash(result.transactionHash);
      setCurrentStep(RegistrationStep.SUCCESS);
      setLoading(false);
      
      // Refresh data after successful transaction - removed setTimeout to prevent infinite loops

    } catch (err) {
      console.error('Error registering organization:', err);
      setError('Failed to register organization');
      setCurrentStep(RegistrationStep.ERROR);
      setLoading(false);
    } finally {
      setTxLoading(false);
    }
  }, [proof, account, organizationType, chain, healthcareRegistrationAddress]);

  // Reset state
  const reset = useCallback(() => {
    setCurrentStep(RegistrationStep.IDLE);
    setUserRole(null);
    setUserRecord(null);
    setIsRegistered(false);
    setLoading(false);
    setTxLoading(false);
    setError(null);
    setTxHash(null);
    setOrganizationType(null);
    setOrganizationName('');
    setUniqueEmail('');
    setPatientEmail('');
  }, []);

  // Effects
  useEffect(() => {
    if (account?.address) {
      checkUserRole();
    }
  }, [account?.address, healthcareRegistrationAddress, chain.id]);

  useEffect(() => {
    if (proof && currentStep === RegistrationStep.ORG_WAITING_PROOF) {
      registerOrganization();
    }
  }, [proof, currentStep, registerOrganization]);

  useEffect(() => {
    if (proverError) {
      setError(proverError.message);
      setCurrentStep(RegistrationStep.ERROR);
      setLoading(false);
    }
  }, [proverError]);

  useEffect(() => {
    if (provingError) {
      setError(provingError.message);
      setCurrentStep(RegistrationStep.ERROR);
      setLoading(false);
    }
  }, [provingError]);

  // Refresh user data after successful registration
  useEffect(() => {
    if (currentStep === RegistrationStep.SUCCESS && account?.address) {
      const timer = setTimeout(() => {
        checkUserRole();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentStep, account?.address]);

  // Generate subject line for email
  const getEmailSubject = () => {
    if (!organizationType || !organizationName || !account?.address) return '';
    return `Register organization ${organizationName} as ${organizationType} with wallet: ${account.address}`;
  };

  return {
    // State
    currentStep,
    userRole,
    userRecord,
    isRegistered,
    loading,
    txLoading,
    error,
    txHash,
    organizationType,
    organizationName,
    walletAddress: account?.address || '',
    uniqueEmail,
    patientEmail,
    
    // Actions
    checkUserRole,
    registerPatient,
    setOrganizationType,
    setOrganizationName,
    generateUniqueEmail,
    startOrganizationRegistration,
    setPatientEmail,
    reset,
  };
} 
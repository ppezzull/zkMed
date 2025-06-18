import { useState, useEffect, useCallback } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { prepareContractCall, getContract, sendAndConfirmTransaction } from 'thirdweb';
import { preverifyEmail } from '@vlayer/sdk';
import { useCallProver, useWaitForProvingResult } from '@vlayer/react';
import { getUserRole } from '@/utils/actions/healthcare-registration';
import { UserType, UserRecord } from '@/utils/types/healthcare';
import { getHealthcareRegistrationAddress, getHealthcareRegistrationProverAddress } from '@/utils/actions/healthcare-registration';
import { HealthcareRegistration__factory } from '@/utils/types/zkMed/HealthcareRegistration/factories/HealthcareRegistration__factory';
import { HealthcareRegistrationProver__factory } from '@/utils/types/zkMed/HealthcareRegistrationProver/factories/HealthcareRegistrationProver__factory';
import { getClientChain } from '@/utils/chain-config';
import { client } from '@/components/providers/thirdweb-providers';

// Registration step enum
enum RegistrationStep {
  IDLE = "Choose your role",
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
}

export interface RegistrationActions {
  checkUserRole: () => Promise<void>;
  registerPatient: () => Promise<void>;
  setOrganizationType: (type: 'HOSPITAL' | 'INSURER') => void;
  setOrganizationName: (name: string) => void;
  generateUniqueEmail: () => void;
  startOrganizationRegistration: (emlContent: string) => Promise<void>;
  reset: () => void;
}

export function useHealthcareRegistration(): RegistrationState & RegistrationActions {
  // Thirdweb account
  const account = useActiveAccount();
  const chain = getClientChain();

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
  const [proverAddress, setProverAddress] = useState<string>('');

  // Load prover address
  useEffect(() => {
    const loadProverAddress = async () => {
      try {
        const address = await getHealthcareRegistrationProverAddress();
        setProverAddress(address);
      } catch (err) {
        console.error('Error loading prover address:', err);
      }
    };
    loadProverAddress();
  }, []);

  // Vlayer prover hooks
  const {
    callProver,
    data: proofHash,
    error: proverError,
  } = useCallProver({
    address: proverAddress as `0x${string}`,
    proverAbi: HealthcareRegistrationProver__factory.abi,
    functionName: "main",
    chainId: chain.id,
  });

  const { data: proof, error: provingError } = useWaitForProvingResult(proofHash);

  // Check user role
  const checkUserRole = useCallback(async () => {
    if (!account?.address) return;
    
    setLoading(true);
    try {
      const roleData = await getUserRole(account.address);
      setIsRegistered(roleData.isRegistered);
      setUserRole(roleData.userType || null);
      setUserRecord(roleData.record || null);
    } catch (err) {
      console.error('Error checking user role:', err);
      setError('Failed to check user role');
    } finally {
      setLoading(false);
    }
  }, [account?.address]);

  // Register patient
  const registerPatient = useCallback(async () => {
    if (!account?.address) {
      setError('No wallet connected');
      return;
    }

    try {
      setCurrentStep(RegistrationStep.PATIENT_REGISTERING);
      setTxLoading(true);
      setError(null);

      const contractAddress = await getHealthcareRegistrationAddress();
      
      const contract = getContract({
        client,
        chain,
        address: contractAddress,
        abi: HealthcareRegistration__factory.abi,
      });

      const transaction = prepareContractCall({
        contract,
        method: "registerPatient",
        params: [account.address],
      });

      const result = await sendAndConfirmTransaction({
        transaction,
        account,
      });

      setTxHash(result.transactionHash);
      setCurrentStep(RegistrationStep.SUCCESS);
      
      // Refresh data after successful transaction
      setTimeout(checkUserRole, 2000);

    } catch (err) {
      console.error('Error registering patient:', err);
      setError('Failed to register patient');
      setCurrentStep(RegistrationStep.ERROR);
    } finally {
      setTxLoading(false);
    }
  }, [account, chain, checkUserRole]);

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
      
      const contractAddress = await getHealthcareRegistrationAddress();
      const functionName = organizationType === 'HOSPITAL' 
        ? 'registerHospitalWithMailProof' 
        : 'registerInsurerWithMailProof';

      const contract = getContract({
        client,
        chain,
        address: contractAddress,
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
      
      // Refresh data after successful transaction
      setTimeout(checkUserRole, 2000);

    } catch (err) {
      console.error('Error registering organization:', err);
      setError('Failed to register organization');
      setCurrentStep(RegistrationStep.ERROR);
      setLoading(false);
    } finally {
      setTxLoading(false);
    }
  }, [proof, account, organizationType, chain, checkUserRole]);

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
  }, []);

  // Effects
  useEffect(() => {
    if (account?.address) {
      checkUserRole();
    }
  }, [account?.address, checkUserRole]);

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
    
    // Actions
    checkUserRole,
    registerPatient,
    setOrganizationType,
    setOrganizationName,
    generateUniqueEmail,
    startOrganizationRegistration,
    reset,
  };
} 
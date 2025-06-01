// Auto-generated configuration file for zkMed
import type { Chain } from 'viem';
import deployment from './deployment.json';
import { CONTRACT_ADDRESSES } from './addresses';

// Import all contract ABIs
import { RegistrationContractABI } from './RegistrationContract';
import { HealthSystemWebProofProverABI } from './HealthSystemWebProofProver';
import { HealthSystemWebProofVerifierABI } from './HealthSystemWebProofVerifier';
import { PatientModuleABI } from './PatientModule';
import { EmailDomainProverABI } from './EmailDomainProver';

export const zkMedContracts = {
  registrationContract: {
    address: CONTRACT_ADDRESSES.REGISTRATION_CONTRACT,
    abi: RegistrationContractABI,
  },
  patientModule: {
    address: CONTRACT_ADDRESSES.PATIENT_MODULE,
    abi: PatientModuleABI,
  },
  emailDomainProver: {
    address: CONTRACT_ADDRESSES.EMAIL_DOMAIN_PROVER,
    abi: EmailDomainProverABI,
  },
  // Additional modules
  registrationStorage: {
    address: CONTRACT_ADDRESSES.REGISTRATION_STORAGE,
    abi: null, // ABI not exported yet
  },
  organizationModule: {
    address: CONTRACT_ADDRESSES.ORGANIZATION_MODULE,
    abi: null, // ABI not exported yet
  },
  adminModule: {
    address: CONTRACT_ADDRESSES.ADMIN_MODULE,
    abi: null, // ABI not exported yet
  },
  // WebProof contracts (may not be deployed)
  healthSystemWebProofProver: {
    address: CONTRACT_ADDRESSES.HEALTH_SYSTEM_WEBPROOF_PROVER,
    abi: HealthSystemWebProofProverABI,
  },
  healthSystemWebProofVerifier: {
    address: CONTRACT_ADDRESSES.HEALTH_SYSTEM_WEBPROOF_VERIFIER,
    abi: HealthSystemWebProofVerifierABI,
  },
} as const;

export const flows = {
  // Patient registration with Italian health system WebProof
  patientWebProof: {
    description: "Register patients using Italian health system WebProof",
    contracts: {
      prover: zkMedContracts.healthSystemWebProofProver,
      verifier: zkMedContracts.healthSystemWebProofVerifier,
      registration: zkMedContracts.registrationContract,
    },
    method: "registerPatientWithWebProof",
    requiredData: ["webProof", "commitment", "patientId", "taxCodeHash", "regionalCode", "homeAsl"]
  },
  
  // Organization registration with email domain MailProof
  organizationMailProof: {
    description: "Register organizations using email domain MailProof",
    contracts: {
      prover: zkMedContracts.emailDomainProver,
      registration: zkMedContracts.registrationContract,
    },
    method: "registerOrganization",
    requiredData: ["proof", "organizationData", "role"]
  }
} as const;

export const supportedChains: Chain[] = [
  // Add your supported chains here
  // e.g., mainnet, sepolia, polygon, etc.
];

export const anvilChain = {
  id: 31337,
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
} as const;

export { deployment, CONTRACT_ADDRESSES };

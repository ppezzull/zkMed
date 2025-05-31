// Auto-generated configuration file for zkMed
import { Chain } from 'viem';
import deployment from './deployment.json';

// Import all contract ABIs
import { RegistrationContractABI } from './RegistrationContract';
import { HealthSystemWebProofProverABI } from './HealthSystemWebProofProver';
import { HealthSystemWebProofVerifierABI } from './HealthSystemWebProofVerifier';
import { PatientModuleABI } from './PatientModule';
import { EmailDomainProverABI } from './EmailDomainProver';

export const zkMedContracts = {
  registrationContract: {
    address: deployment.contracts.registrationContract as `0x${string}`,
    abi: RegistrationContractABI,
  },
  healthSystemWebProofProver: {
    address: deployment.contracts.healthSystemWebProofProver as `0x${string}`,
    abi: HealthSystemWebProofProverABI,
  },
  healthSystemWebProofVerifier: {
    address: deployment.contracts.healthSystemWebProofVerifier as `0x${string}`,
    abi: HealthSystemWebProofVerifierABI,
  },
  patientModule: {
    address: deployment.contracts.patientModule as `0x${string}`,
    abi: PatientModuleABI,
  },
  emailDomainProver: {
    address: deployment.contracts.emailDomainProver as `0x${string}`,
    abi: EmailDomainProverABI,
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

export { deployment };

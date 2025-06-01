// Auto-generated index file for zkMed contracts
export type { 
    RegistrationContractContract,
    RegistrationContractEvents,
    RegistrationContractAddress 
} from './RegistrationContract';

export type { 
    HealthSystemWebProofProverContract,
    HealthSystemWebProofProverEvents,
    HealthSystemWebProofProverAddress 
} from './HealthSystemWebProofProver';

export type { 
    HealthSystemWebProofVerifierContract,
    HealthSystemWebProofVerifierEvents,
    HealthSystemWebProofVerifierAddress 
} from './HealthSystemWebProofVerifier';

export type { 
    PatientModuleContract,
    PatientModuleEvents,
    PatientModuleAddress 
} from './PatientModule';

export type { 
    EmailDomainProverContract,
    EmailDomainProverEvents,
    EmailDomainProverAddress 
} from './EmailDomainProver';

// Export contract addresses (recommended)
export { 
    CONTRACT_ADDRESSES, 
    CHAIN_CONFIG,
    REGISTRATION_CONTRACT,
    PATIENT_MODULE,
    EMAIL_DOMAIN_PROVER,
    REGISTRATION_STORAGE,
    ORGANIZATION_MODULE,
    ADMIN_MODULE,
    HEALTH_SYSTEM_WEBPROOF_PROVER,
    HEALTH_SYSTEM_WEBPROOF_VERIFIER,
} from './addresses';

// Export contract configurations
export { zkMedContracts, flows, anvilChain } from './config';

// Re-export deployment for convenience
export { default as deployment } from './deployment.json';

// Re-export ABIs for convenience
export { RegistrationContractABI } from './RegistrationContract';
export { HealthSystemWebProofProverABI } from './HealthSystemWebProofProver';
export { HealthSystemWebProofVerifierABI } from './HealthSystemWebProofVerifier';
export { PatientModuleABI } from './PatientModule';
export { EmailDomainProverABI } from './EmailDomainProver';

// Quick setup functions
export const getRegistrationContract = (client: any) => ({
  address: zkMedContracts.registrationContract.address,
  abi: zkMedContracts.registrationContract.abi,
  client
});

export const getPatientWebProofContracts = (client: any) => ({
  prover: {
    address: zkMedContracts.healthSystemWebProofProver.address,
    abi: zkMedContracts.healthSystemWebProofProver.abi,
    client
  },
  verifier: {
    address: zkMedContracts.healthSystemWebProofVerifier.address,
    abi: zkMedContracts.healthSystemWebProofVerifier.abi,
    client
  },
  registration: {
    address: zkMedContracts.registrationContract.address,
    abi: zkMedContracts.registrationContract.abi,
    client
  }
});

export const getOrganizationMailProofContracts = (client: any) => ({
  prover: {
    address: zkMedContracts.emailDomainProver.address,
    abi: zkMedContracts.emailDomainProver.abi,
    client
  },
  registration: {
    address: zkMedContracts.registrationContract.address,
    abi: zkMedContracts.registrationContract.abi,
    client
  }
});

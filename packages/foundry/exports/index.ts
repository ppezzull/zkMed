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

export { zkMedContracts, flows, anvilChain } from './config';

// Re-export deployment for convenience
export { default as deployment } from './deployment.json';

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

// Main types index - Re-export all contract types for easy importing
export * from './zkMed/index';
export * as ExampleTypes from './examples/index';

// Convenience re-exports for the most commonly used types
export type {
  HealthcareRegistrationContract,
  HealthcareRegistrationProverContract,
  ContractConfig,
  zkMedContracts
} from './zkMed/index';

export {
  HealthcareRegistration__factory,
  HealthcareRegistrationProver__factory,
  getHealthcareRegistrationContractAddress,
  getHealthcareRegistrationProverContractAddress
} from './zkMed/index';

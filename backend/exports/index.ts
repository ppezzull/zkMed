// zkMed Contract Exports
// Easy imports for frontend applications

export * from './contracts';
export * from './deployments';

// Import all ABIs as JSON
import * as ABIs from './abis.json';
export { ABIs };

// Individual ABI imports
import RegistrationContractABI from './RegistrationContract.json';
export { RegistrationContractABI };
import RegistrationStorageABI from './RegistrationStorage.json';
export { RegistrationStorageABI };
import PatientModuleABI from './PatientModule.json';
export { PatientModuleABI };
import OrganizationModuleABI from './OrganizationModule.json';
export { OrganizationModuleABI };
import AdminModuleABI from './AdminModule.json';
export { AdminModuleABI };
import EmailDomainProverABI from './EmailDomainProver.json';
export { EmailDomainProverABI };

// Contract addresses from local deployment
export { LOCAL_DEPLOYMENT, getDeployment } from './deployments';

// Usage example:
// import { RegistrationContractABI, LOCAL_DEPLOYMENT } from './exports';
// const contractAddress = LOCAL_DEPLOYMENT.contracts.registrationContract;

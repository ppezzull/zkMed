// zkMed RegistrationContract - Simplified Export
export { RegistrationContractABI } from './RegistrationContract';
export type { 
  RegistrationContractContract, 
  RegistrationContractEvents, 
  RegistrationContractAddress 
} from './RegistrationContract';
export { zkMedContract, defaultChain, loadDeployment } from './config';

// Re-export deployment for convenience
export { default as localDeployment } from './deployment-local.json';

// Quick setup function
export const getZkMedContract = async (client: any, network: 'local' | 'testnet' | 'mainnet' = 'local') => {
  const { RegistrationContractABI } = await import('./RegistrationContract');
  const deployment = await import(`./deployment-${network}.json`);
  
  return {
    address: deployment.registrationContract,
    abi: RegistrationContractABI,
    client
  };
};

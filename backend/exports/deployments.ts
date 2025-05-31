// Generated deployment configuration

export interface DeploymentConfig {
  chainId: number;
  deployer: string;
  contracts: {
    registrationContract: string;
    registrationStorage: string;
    patientModule: string;
    organizationModule: string;
    adminModule: string;
    emailDomainProver: string;
  };
  timestamp: number;
}

export const LOCAL_DEPLOYMENT: DeploymentConfig = {
  chainId: 31337,
  deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  contracts: {
    emailDomainProver: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    registrationContract: "0x0165878A594ca255338adfa4d48449f69242Eb8F",
    registrationStorage: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    patientModule: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
    organizationModule: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    adminModule: "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707",
  },
  timestamp: 1748696390
};

// Helper function to get deployment by chain ID
export function getDeployment(chainId: number): DeploymentConfig | null {
  switch (chainId) {
    case 31337:
      return LOCAL_DEPLOYMENT;
    default:
      return null;
  }
}

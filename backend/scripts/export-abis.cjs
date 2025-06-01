#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Change OUTPUT_DIR to point to frontend/contracts
const OUTPUT_DIR = path.join(__dirname, '..', '..', 'frontend', 'contracts');
const OUT_DIR = path.join(__dirname, '..', 'out');
const DEPLOYMENTS_DIR = path.join(__dirname, '..', 'deployments');

// Export all contracts needed for frontend integration
const CONTRACTS = [
    'RegistrationContract',
    'HealthSystemWebProofProver', 
    'HealthSystemWebProofVerifier',
    'PatientModule',
    'EmailDomainProver'
];

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📤 Exporting zkMed contracts for frontend integration...');
console.log(`📁 Output directory: ${OUTPUT_DIR}`);

// Read actual deployment addresses
function getDeploymentAddresses() {
    try {
        const localDeploymentFile = path.join(DEPLOYMENTS_DIR, 'local.json');
        if (fs.existsSync(localDeploymentFile)) {
            const deploymentData = JSON.parse(fs.readFileSync(localDeploymentFile, 'utf8'));
            console.log('✅ Found local deployment file with actual addresses');
            return deploymentData;
        }
    } catch (error) {
        console.warn('⚠️ Could not read deployment file, using fallback addresses');
    }
    
    // Fallback addresses if deployment file not found
    return {
        chainId: 31337,
        deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        registrationContract: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        patientModule: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
        emailDomainProver: "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
        timestamp: Math.floor(Date.now() / 1000)
    };
}

// Export contract ABIs
CONTRACTS.forEach(contractName => {
    try {
        const contractDir = path.join(OUT_DIR, `${contractName}.sol`);
        const contractFile = path.join(contractDir, `${contractName}.json`);
        
        if (fs.existsSync(contractFile)) {
            const contractData = JSON.parse(fs.readFileSync(contractFile, 'utf8'));
            const abi = contractData.abi;
            
            // Write ABI file
            const abiFile = path.join(OUTPUT_DIR, `${contractName}.json`);
            fs.writeFileSync(abiFile, JSON.stringify(abi, null, 2));
            
            // Generate TypeScript interface
            const tsInterface = generateTypeScriptInterface(contractName, abi);
            const tsFile = path.join(OUTPUT_DIR, `${contractName}.ts`);
            fs.writeFileSync(tsFile, tsInterface);
            
            console.log(`✅ Exported ${contractName}`);
        } else {
            console.log(`⚠️  ${contractName} not found in out/ directory`);
        }
    } catch (error) {
        console.error(`❌ Error exporting ${contractName}:`, error.message);
    }
});

// Get actual deployment addresses
const actualDeployment = getDeploymentAddresses();

// Create comprehensive deployment addresses with actual deployed contracts
const deploymentInfo = {
    chainId: actualDeployment.chainId || 31337,
    deployer: actualDeployment.deployer || "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    contracts: {
        // Use actual deployed addresses
        registrationContract: actualDeployment.registrationContract || "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        patientModule: actualDeployment.patientModule || "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
        emailDomainProver: actualDeployment.emailDomainProver || "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
        
        // Additional modules if they exist
        registrationStorage: actualDeployment.registrationStorage,
        organizationModule: actualDeployment.organizationModule,
        adminModule: actualDeployment.adminModule,
        
        // Italian Health System WebProof contracts (may not be deployed yet)
        healthSystemWebProofProver: actualDeployment.healthSystemWebProofProver || "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf",
        healthSystemWebProofVerifier: actualDeployment.healthSystemWebProofVerifier || "0x9d4454B023096f34B160D6B654540c56A1F81688"
    },
    flows: {
        patients: {
            description: "Patients use WebProofs from Italian health system",
            contracts: ["healthSystemWebProofProver", "healthSystemWebProofVerifier", "registrationContract"],
            endpoint: "registerPatientWithWebProof"
        },
        organizations: {
            description: "Organizations use domain MailProofs",
            contracts: ["emailDomainProver", "registrationContract"],
            endpoint: "registerOrganization"
        }
    },
    deployedAt: actualDeployment.timestamp,
    exportedAt: Math.floor(Date.now() / 1000)
};

// Write comprehensive deployment file
const deploymentPath = path.join(OUTPUT_DIR, 'deployment.json');
fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
console.log('✅ Exported deployment info with actual contract addresses');

// Also create a simple addresses file for easy import
const addressesOnly = {
    REGISTRATION_CONTRACT: deploymentInfo.contracts.registrationContract,
    PATIENT_MODULE: deploymentInfo.contracts.patientModule,
    EMAIL_DOMAIN_PROVER: deploymentInfo.contracts.emailDomainProver,
    REGISTRATION_STORAGE: deploymentInfo.contracts.registrationStorage,
    ORGANIZATION_MODULE: deploymentInfo.contracts.organizationModule,
    ADMIN_MODULE: deploymentInfo.contracts.adminModule,
    HEALTH_SYSTEM_WEBPROOF_PROVER: deploymentInfo.contracts.healthSystemWebProofProver,
    HEALTH_SYSTEM_WEBPROOF_VERIFIER: deploymentInfo.contracts.healthSystemWebProofVerifier,
};

const addressesPath = path.join(OUTPUT_DIR, 'addresses.ts');
const addressesContent = `// Auto-generated contract addresses from backend deployment
export const CONTRACT_ADDRESSES = ${JSON.stringify(addressesOnly, null, 2)} as const;

export const CHAIN_CONFIG = {
  chainId: ${deploymentInfo.chainId},
  name: 'Anvil Local',
  rpcUrl: 'http://127.0.0.1:8545',
} as const;

// Export individual addresses for convenience
export const {
  REGISTRATION_CONTRACT,
  PATIENT_MODULE,
  EMAIL_DOMAIN_PROVER,
  REGISTRATION_STORAGE,
  ORGANIZATION_MODULE,
  ADMIN_MODULE,
  HEALTH_SYSTEM_WEBPROOF_PROVER,
  HEALTH_SYSTEM_WEBPROOF_VERIFIER,
} = CONTRACT_ADDRESSES;
`;

fs.writeFileSync(addressesPath, addressesContent);
console.log('✅ Exported simplified addresses.ts file');

// Generate simplified TypeScript configuration
const configContent = generateConfigFile(deploymentInfo);
fs.writeFileSync(path.join(OUTPUT_DIR, 'config.ts'), configContent);

// Generate simplified index file
const indexContent = generateIndexFile();
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);

// Generate README
const readmeContent = generateReadme(deploymentInfo);
fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readmeContent);

console.log('\n🎉 Export completed successfully!');
console.log(`📁 Files exported to: ${OUTPUT_DIR}`);
console.log('\n📋 Contract Addresses Exported:');
Object.entries(deploymentInfo.contracts).forEach(([name, address]) => {
    if (address) {
        console.log(`   • ${name}: ${address}`);
    }
});
console.log('\n📋 Next steps:');
console.log('1. Import contracts in your Next.js app:');
console.log("   import { RegistrationContractABI } from '@/contracts/RegistrationContract'");
console.log("   import { CONTRACT_ADDRESSES } from '@/contracts/addresses'");
console.log('2. Use deployment addresses from contracts/deployment.json');
console.log('3. Connect with thirdweb or viem for contract interactions');
console.log('\n🏥 Available flows:');
console.log('   • Patients: WebProof registration via Italian health system');
console.log('   • Organizations: MailProof registration via email domain verification');

function generateTypeScriptInterface(contractName, abi) {
    const functionSignatures = abi
        .filter(item => item.type === 'function')
        .map(func => {
            const inputs = func.inputs.map(input => `${input.name}: ${mapSolidityType(input.type)}`).join(', ');
            const outputs = func.outputs.map(output => mapSolidityType(output.type)).join(' | ');
            const returnType = outputs || 'void';
            return `  ${func.name}(${inputs}): Promise<${returnType}>;`;
        })
        .join('\n');
    
    const events = abi
        .filter(item => item.type === 'event')
        .map(event => {
            const inputs = event.inputs.map(input => `${input.name}: ${mapSolidityType(input.type)}`).join(', ');
            return `  ${event.name}: { ${inputs} };`;
        })
        .join('\n');

    return `// Auto-generated TypeScript interface for ${contractName}
export const ${contractName}ABI = ${JSON.stringify(abi, null, 2)} as const;

export interface ${contractName}Contract {
${functionSignatures}
}

export interface ${contractName}Events {
${events}
}

export type ${contractName}Address = \`0x\${string}\`;

// Usage example with viem:
// const contract = getContract({
//   address: deployment.contracts.${contractName.charAt(0).toLowerCase() + contractName.slice(1)},
//   abi: ${contractName}ABI,
//   client: publicClient,
// });

// Usage example with thirdweb:
// const contract = getContract({
//   client,
//   chain: defineChain(31337),
//   address: deployment.contracts.${contractName.charAt(0).toLowerCase() + contractName.slice(1)},
//   abi: ${contractName}ABI,
// });
`;
}

function mapSolidityType(solidityType) {
    const typeMap = {
        'uint256': 'bigint',
        'uint8': 'number',
        'uint16': 'number', 
        'uint32': 'number',
        'int256': 'bigint',
        'address': 'string',
        'bool': 'boolean',
        'bytes': 'string',
        'bytes32': 'string',
        'string': 'string'
    };
    
    // Handle arrays
    if (solidityType.includes('[]')) {
        const baseType = solidityType.replace('[]', '');
        return `${mapSolidityType(baseType)}[]`;
    }
    
    // Handle fixed-size arrays
    const arrayMatch = solidityType.match(/^(.+)\[(\d+)\]$/);
    if (arrayMatch) {
        const baseType = arrayMatch[1];
        return `${mapSolidityType(baseType)}[]`;
    }
    
    return typeMap[solidityType] || 'any';
}

function generateConfigFile(deploymentInfo) {
    return `// Auto-generated configuration file for zkMed
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
  id: ${deploymentInfo.chainId},
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
} as const;

export { deployment, CONTRACT_ADDRESSES };
`;
}

function generateIndexFile() {
    return `// Auto-generated index file for zkMed contracts
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
`;
}

function generateReadme(deploymentInfo) {
    return `# zkMed Smart Contracts Export

This directory contains exported ABIs and TypeScript interfaces for zkMed smart contracts, ready for frontend integration.

## Files

- \`RegistrationContract.json\` - Main contract ABI  
- \`RegistrationContract.ts\` - TypeScript interface with usage examples
- \`HealthSystemWebProofProver.json\` - Italian health WebProof prover ABI
- \`HealthSystemWebProofProver.ts\` - TypeScript interface for WebProof prover
- \`HealthSystemWebProofVerifier.json\` - Italian health WebProof verifier ABI
- \`HealthSystemWebProofVerifier.ts\` - TypeScript interface for WebProof verifier
- \`PatientModule.json\` - Patient module ABI
- \`PatientModule.ts\` - TypeScript interface for patient operations
- \`EmailDomainProver.json\` - Email domain prover ABI
- \`EmailDomainProver.ts\` - TypeScript interface for email verification
- \`deployment.json\` - Comprehensive deployment info with all addresses
- \`addresses.ts\` - Simple contract addresses export (recommended)
- \`config.ts\` - Configuration and utility functions
- \`index.ts\` - Main export file

## Quick Start

### Import Contract Addresses (Recommended)

\`\`\`typescript
import { CONTRACT_ADDRESSES, REGISTRATION_CONTRACT } from '@/contracts/addresses';

// Use specific address
const regAddress = REGISTRATION_CONTRACT;

// Or use the full object
const allAddresses = CONTRACT_ADDRESSES;
\`\`\`

### Import Full Contract with ABI

\`\`\`typescript
import { getContract } from "thirdweb";
import { RegistrationContractABI } from '@/contracts/RegistrationContract';
import { CONTRACT_ADDRESSES } from '@/contracts/addresses';
import { client } from '@/lib/client';
import { localChain } from '@/lib/contracts';

// Main registration contract
const registrationContract = getContract({
  client,
  chain: localChain,
  address: CONTRACT_ADDRESSES.REGISTRATION_CONTRACT,
  abi: RegistrationContractABI,
});
\`\`\`

## Contract Addresses (Auto-Generated from Backend)

${Object.entries(deploymentInfo.contracts)
  .filter(([name, address]) => address)
  .map(([name, address]) => `- **${name}**: \`${address}\``)
  .join('\n')}

## Available Flows

### ${deploymentInfo.flows.patients.description}
- **Contracts**: ${deploymentInfo.flows.patients.contracts.join(', ')}
- **Endpoint**: \`${deploymentInfo.flows.patients.endpoint}\`

### ${deploymentInfo.flows.organizations.description}
- **Contracts**: ${deploymentInfo.flows.organizations.contracts.join(', ')}
- **Endpoint**: \`${deploymentInfo.flows.organizations.endpoint}\`

## Integration

This directory is automatically generated by the backend export script and should be imported directly in your Next.js frontend.

**Deployment Info:**
- Deployed at: ${new Date(deploymentInfo.deployedAt * 1000).toISOString()}
- Exported at: ${new Date(deploymentInfo.exportedAt * 1000).toISOString()}
- Chain ID: ${deploymentInfo.chainId}
- Deployer: ${deploymentInfo.deployer}
`;
} 
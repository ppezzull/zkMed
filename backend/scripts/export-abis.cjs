#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'exports');
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

// Create comprehensive deployment addresses with Italian Health contracts
const deploymentInfo = {
    chainId: 31337,
    deployer: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    contracts: {
        // Main system contracts
        registrationContract: "0x67d269191c92Caf3cD7723F116c85e6E9bf55933",
        patientModule: "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F",
        emailDomainProver: "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f",
        
        // Italian Health System WebProof contracts
        healthSystemWebProofProver: "0x8f86403A4DE0BB5791fa46B8e795C547942fE4Cf",
        healthSystemWebProofVerifier: "0x9d4454B023096f34B160D6B654540c56A1F81688"
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
    timestamp: Math.floor(Date.now() / 1000)
};

// Write comprehensive deployment file
const deploymentPath = path.join(OUTPUT_DIR, 'deployment.json');
fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
console.log('✅ Exported comprehensive deployment info');

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
console.log('\n📋 Next steps:');
console.log('1. Import contracts in your Next.js app:');
console.log("   import { zkMedContracts } from './exports'");
console.log('2. Use deployment addresses from exports/deployment.json');
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
    address: deployment.contracts.registrationContract as \`0x\${string}\`,
    abi: RegistrationContractABI,
  },
  healthSystemWebProofProver: {
    address: deployment.contracts.healthSystemWebProofProver as \`0x\${string}\`,
    abi: HealthSystemWebProofProverABI,
  },
  healthSystemWebProofVerifier: {
    address: deployment.contracts.healthSystemWebProofVerifier as \`0x\${string}\`,
    abi: HealthSystemWebProofVerifierABI,
  },
  patientModule: {
    address: deployment.contracts.patientModule as \`0x\${string}\`,
    abi: PatientModuleABI,
  },
  emailDomainProver: {
    address: deployment.contracts.emailDomainProver as \`0x\${string}\`,
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
  id: ${deploymentInfo.chainId},
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
} as const;

export { deployment };
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
- \`deployment.json\` - Comprehensive deployment addresses
- \`config.ts\` - Configuration and utility functions
- \`index.ts\` - Main export file

## Usage

### With viem

\`\`\`typescript
import { getContract } from 'viem';
import { zkMedContracts, deployment } from './exports';

// Main registration contract
const registrationContract = getContract({
  address: zkMedContracts.registrationContract.address,
  abi: zkMedContracts.registrationContract.abi,
  client: publicClient,
});

// Italian health WebProof contracts for patient registration
const healthProver = getContract({
  address: zkMedContracts.healthSystemWebProofProver.address,
  abi: zkMedContracts.healthSystemWebProofProver.abi,
  client: publicClient,
});

const healthVerifier = getContract({
  address: zkMedContracts.healthSystemWebProofVerifier.address,
  abi: zkMedContracts.healthSystemWebProofVerifier.abi,
  client: publicClient,
});
\`\`\`

### With thirdweb

\`\`\`typescript
import { getContract } from "thirdweb";
import { zkMedContracts, anvilChain } from './exports';

// Main registration contract
const registrationContract = getContract({
  client,
  chain: anvilChain,
  address: zkMedContracts.registrationContract.address,
  abi: zkMedContracts.registrationContract.abi,
});

// Quick setup using helper functions
import { getPatientWebProofContracts } from './exports';
const patientContracts = getPatientWebProofContracts(client);
\`\`\`

## Contract Addresses (Local Deployment)

- **RegistrationContract**: \`${deploymentInfo.contracts.registrationContract}\`
- **HealthSystemWebProofProver**: \`${deploymentInfo.contracts.healthSystemWebProofProver}\`
- **HealthSystemWebProofVerifier**: \`${deploymentInfo.contracts.healthSystemWebProofVerifier}\`
- **PatientModule**: \`${deploymentInfo.contracts.patientModule}\`
- **EmailDomainProver**: \`${deploymentInfo.contracts.emailDomainProver}\`

## Available Flows

### ${deploymentInfo.flows.patients.description}
- **Contracts**: ${deploymentInfo.flows.patients.contracts.join(', ')}
- **Endpoint**: \`${deploymentInfo.flows.patients.endpoint}\`
- **Process**: 
  1. Patient authenticates with SPID/CIE on Salute Lazio portal
  2. vlayer generates WebProof from health portal response
  3. HealthSystemWebProofProver creates verification proof
  4. HealthSystemWebProofVerifier validates and registers patient
  5. Patient gains access to zkMed system with verified Italian health identity

### ${deploymentInfo.flows.organizations.description}
- **Contracts**: ${deploymentInfo.flows.organizations.contracts.join(', ')}
- **Endpoint**: \`${deploymentInfo.flows.organizations.endpoint}\`
- **Process**:
  1. Organization proves domain ownership via email verification
  2. EmailDomainProver creates MailProof for domain ownership
  3. RegistrationContract validates proof and registers organization
  4. Organization gains access to zkMed system as verified hospital/insurer

## Key Functions

### Patient Registration (WebProof)
\`\`\`typescript
// Register patient with Italian health system WebProof
await registrationContract.write.registerPatientWithWebProof([
  patientAddress,
  commitment,
  patientId,
  taxCodeHash,
  regionalCode,
  homeAsl
]);
\`\`\`

### Organization Registration (MailProof)
\`\`\`typescript
// Register organization with email domain verification
await registrationContract.write.registerOrganization([
  proof,
  organizationData,
  role
]);
\`\`\`

## Integration Steps

1. Copy this \`exports\` folder to your Next.js project
2. Install required dependencies (\`viem\` or \`thirdweb\`)
3. Import and use the contracts in your components
4. All zkMed functionality is available through these contracts!

## Privacy-Preserving Features

- **WebProofs**: Prove Italian health system registration without exposing sensitive data
- **MailProofs**: Verify organization domain ownership through email verification
- **Zero-Knowledge**: Patient commitments provide privacy-preserving authentication
- **Selective Disclosure**: Only necessary verification data is stored on-chain

## Development

Generated from zkMed smart contracts deployed at timestamp: ${deploymentInfo.timestamp}
Chain ID: ${deploymentInfo.chainId}
Deployer: ${deploymentInfo.deployer}
`;
} 
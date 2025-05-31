#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'exports');
const OUT_DIR = path.join(__dirname, '..', 'out');
const DEPLOYMENTS_DIR = path.join(__dirname, '..', 'deployments');

// Only export the main RegistrationContract - it coordinates all modules
const CONTRACTS = [
    'RegistrationContract'
];

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📤 Exporting RegistrationContract ABI and deployment info...');

// Export RegistrationContract ABI
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

// Export simplified deployment addresses (only RegistrationContract)
if (fs.existsSync(DEPLOYMENTS_DIR)) {
    const deploymentFiles = fs.readdirSync(DEPLOYMENTS_DIR).filter(f => f.endsWith('.json'));
    deploymentFiles.forEach(file => {
        try {
            const deploymentPath = path.join(DEPLOYMENTS_DIR, file);
            const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
            
            // Create simplified deployment with only RegistrationContract
            const simplifiedDeployment = {
                chainId: deployment.chainId,
                deployer: deployment.deployer,
                registrationContract: deployment.registrationContract,
                timestamp: deployment.timestamp
            };
            
            const outputPath = path.join(OUTPUT_DIR, `deployment-${file}`);
            fs.writeFileSync(outputPath, JSON.stringify(simplifiedDeployment, null, 2));
            console.log(`✅ Exported simplified deployment: ${file}`);
        } catch (error) {
            console.error(`❌ Error processing deployment ${file}:`, error.message);
        }
    });
} else {
    console.log('⚠️  No deployments directory found');
}

// Generate simplified TypeScript configuration
const configContent = generateConfigFile();
fs.writeFileSync(path.join(OUTPUT_DIR, 'config.ts'), configContent);

// Generate simplified index file
const indexContent = generateIndexFile();
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.ts'), indexContent);

// Generate README
const readmeContent = generateReadme();
fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readmeContent);

console.log('\n🎉 Export completed successfully!');
console.log(`📁 Files exported to: ${OUTPUT_DIR}`);
console.log('\n📋 Next steps:');
console.log('1. Import RegistrationContract in your Next.js app:');
console.log("   import { RegistrationContract } from './exports'");
console.log('2. Use deployment address from exports/deployment-local.json');
console.log('3. Connect with thirdweb or viem for contract interactions');

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
//   address: "0x...", // from deployment-local.json
//   abi: ${contractName}ABI,
//   client: publicClient,
// });

// Usage example with thirdweb:
// const contract = getContract({
//   client,
//   chain: defineChain(31337),
//   address: "0x...", // from deployment-local.json
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

function generateConfigFile() {
    return `// Auto-generated configuration file for zkMed RegistrationContract
import { Chain } from 'viem';

export const zkMedContract = {
  abi: require('./RegistrationContract.json'),
  // Add addresses per network in your app
} as const;

export const supportedChains: Chain[] = [
  // Add your supported chains here
  // e.g., mainnet, sepolia, polygon, etc.
];

export const defaultChain = {
  id: 31337,
  name: 'Anvil Local',
  network: 'anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://localhost:8545'] },
    public: { http: ['http://localhost:8545'] },
  },
} as const;

// Load deployment addresses
export const loadDeployment = async (network: 'local' | 'testnet' | 'mainnet' = 'local') => {
  try {
    const deployment = require(\`./deployment-\${network}.json\`);
    return deployment;
  } catch (error) {
    throw new Error(\`Deployment for \${network} not found\`);
  }
};
`;
}

function generateIndexFile() {
    return `// zkMed RegistrationContract - Simplified Export
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
  const deployment = await import(\`./deployment-\${network}.json\`);
  
  return {
    address: deployment.registrationContract,
    abi: RegistrationContractABI,
    client
  };
};
`;
}

function generateReadme() {
    return `# zkMed RegistrationContract Export

This directory contains the simplified export for the zkMed RegistrationContract - the single entry point for all zkMed functionality.

## Why One Contract?

The RegistrationContract coordinates all zkMed functionality including:
- Patient registration and commitment management
- Organization registration with email domain verification
- Admin and owner management
- Role-based access control

By using only the RegistrationContract, your frontend integration is much simpler.

## Files

- \`RegistrationContract.json\` - Contract ABI
- \`RegistrationContract.ts\` - TypeScript interface with usage examples
- \`deployment-local.json\` - Local deployment address
- \`config.ts\` - Configuration and utility functions
- \`index.ts\` - Main export file
- \`README.md\` - This file

## Quick Start

### With Viem/Wagmi

\`\`\`typescript
import { getContract } from 'viem';
import { RegistrationContractABI, localDeployment } from './exports';

const contract = getContract({
  address: localDeployment.registrationContract,
  abi: RegistrationContractABI,
  client: publicClient,
});

// Register a patient
await contract.write.registerPatient([commitmentHash]);

// Check user role
const role = await contract.read.roles([userAddress]);
\`\`\`

### With Thirdweb

\`\`\`typescript
import { getContract } from "thirdweb";
import { RegistrationContractABI, localDeployment } from './exports';

const contract = getContract({
  client,
  chain: defineChain(31337),
  address: localDeployment.registrationContract,
  abi: RegistrationContractABI,
});

// Register a patient
await contract.call("registerPatient", [commitmentHash]);

// Check user role  
const role = await contract.read("roles", [userAddress]);
\`\`\`

### Quick Setup Helper

\`\`\`typescript
import { getZkMedContract } from './exports';

const contract = await getZkMedContract(publicClient, 'local');
// Contract is ready to use!
\`\`\`

## Contract Address (Local Deployment)

- **RegistrationContract**: ${process.env.NODE_ENV !== 'production' ? 'Check deployment-local.json' : 'TBD'}

## Key Functions

### Patient Registration
- \`registerPatient(bytes32 commitment)\` - Register as patient with health data commitment
- \`verifyPatientCommitment(string secret)\` - Verify patient's health data commitment

### Organization Registration  
- \`registerOrganizationWithProof(...)\` - Register organization with email domain proof

### View Functions
- \`roles(address)\` - Get user role (None, Patient, Hospital, Insurer, Admin)
- \`isUserVerified(address)\` - Check if user is verified
- \`isUserActive(address)\` - Check if user is active
- \`getUserRegistration(address)\` - Get complete user registration info

### Admin Functions
- \`activateUser(address)\` / \`deactivateUser(address)\` - Manage user status
- \`addAdmin(address)\` / \`addOwner(address)\` - Manage permissions

## Regenerating Exports

Run \`make export-abis\` from the backend directory to regenerate these files.

## Next Steps

1. Copy this exports folder to your Next.js frontend
2. Install viem or thirdweb for contract interaction
3. Import and use the RegistrationContract in your components
4. All zkMed functionality is available through this single contract!
`;
} 
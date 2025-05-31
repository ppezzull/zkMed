#!/usr/bin/env node

/**
 * zkMed Contract ABI Export Script for Factory Pattern
 * 
 * This script exports contract ABIs and generates TypeScript interfaces
 * for seamless Next.js frontend integration with the factory-deployed contracts.
 * 
 * Features:
 * - Exports all contract ABIs as TypeScript interfaces
 * - Generates deployment configuration from local.json
 * - Creates type-safe contract interaction helpers
 * - Supports both local and production deployments
 * - Generates thirdweb-compatible hooks and configurations
 */

const fs = require('fs');
const path = require('path');

// Configuration
const FORGE_OUT_DIR = './out';
const EXPORTS_DIR = './exports';
const DEPLOYMENTS_DIR = './deployments';

// Contract names to export (without RegistrationFactory)
const CONTRACTS = [
    'RegistrationContract',
    'RegistrationStorage', 
    'PatientModule',
    'OrganizationModule',
    'AdminModule',
    'EmailDomainProver'
];

function ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
}

function readJsonFile(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        console.warn(`Warning: Could not read ${filePath}:`, error.message);
        return null;
    }
}

function extractABI(contractPath) {
    const artifactPath = path.join(FORGE_OUT_DIR, contractPath);
    const artifact = readJsonFile(artifactPath);
    return artifact ? artifact.abi : null;
}

function generateTypeScriptInterface(contractName, abi) {
    if (!abi) return '';
    
    let tsInterface = `// Generated TypeScript interface for ${contractName}\n\n`;
    
    // Extract function signatures
    const functions = abi.filter(item => item.type === 'function');
    const events = abi.filter(item => item.type === 'event');
    
    // Generate function interface
    if (functions.length > 0) {
        tsInterface += `export interface ${contractName}Functions {\n`;
        functions.forEach(func => {
            const inputs = func.inputs.map(input => `${input.name}: ${mapSolidityToTS(input.type)}`).join(', ');
            const outputs = func.outputs && func.outputs.length > 0 
                ? `: Promise<${func.outputs.length === 1 ? mapSolidityToTS(func.outputs[0].type) : 'any[]'}>`
                : ': Promise<void>';
            tsInterface += `  ${func.name}(${inputs})${outputs};\n`;
        });
        tsInterface += `}\n\n`;
    }
    
    // Generate events interface
    if (events.length > 0) {
        tsInterface += `export interface ${contractName}Events {\n`;
        events.forEach(event => {
            const inputs = event.inputs.map(input => `${input.name}: ${mapSolidityToTS(input.type)}`).join(', ');
            tsInterface += `  ${event.name}: { ${inputs} };\n`;
        });
        tsInterface += `}\n\n`;
    }
    
    // Generate main contract interface
    tsInterface += `export interface ${contractName}Contract {\n`;
    tsInterface += `  address: string;\n`;
    tsInterface += `  abi: any[];\n`;
    if (functions.length > 0) {
        tsInterface += `  functions: ${contractName}Functions;\n`;
    }
    if (events.length > 0) {
        tsInterface += `  events: ${contractName}Events;\n`;
    }
    tsInterface += `}\n`;
    
    return tsInterface;
}

function mapSolidityToTS(solidityType) {
    if (solidityType.includes('uint') || solidityType.includes('int')) {
        return 'number | string';
    }
    if (solidityType === 'bool') {
        return 'boolean';
    }
    if (solidityType === 'string') {
        return 'string';
    }
    if (solidityType === 'address') {
        return 'string';
    }
    if (solidityType.includes('bytes')) {
        return 'string';
    }
    if (solidityType.includes('[]')) {
        return `${mapSolidityToTS(solidityType.replace('[]', ''))}[]`;
    }
    return 'any';
}

function generateDeploymentConfig() {
    const localDeployment = readJsonFile(path.join(DEPLOYMENTS_DIR, 'local.json'));
    
    let config = `// Generated deployment configuration\n\n`;
    config += `export interface DeploymentConfig {\n`;
    config += `  chainId: number;\n`;
    config += `  deployer: string;\n`;
    config += `  contracts: {\n`;
    
    CONTRACTS.forEach(contract => {
        const key = contract.charAt(0).toLowerCase() + contract.slice(1);
        config += `    ${key}: string;\n`;
    });
    
    config += `  };\n`;
    config += `  timestamp: number;\n`;
    config += `}\n\n`;
    
    if (localDeployment) {
        config += `export const LOCAL_DEPLOYMENT: DeploymentConfig = {\n`;
        config += `  chainId: ${localDeployment.chainId || 31337},\n`;
        config += `  deployer: "${localDeployment.deployer || ''}",\n`;
        config += `  contracts: {\n`;
        config += `    emailDomainProver: "${localDeployment.emailDomainProver || ''}",\n`;
        config += `    registrationContract: "${localDeployment.registrationContract || ''}",\n`;
        config += `    registrationStorage: "${localDeployment.registrationStorage || ''}",\n`;
        config += `    patientModule: "${localDeployment.patientModule || ''}",\n`;
        config += `    organizationModule: "${localDeployment.organizationModule || ''}",\n`;
        config += `    adminModule: "${localDeployment.adminModule || ''}",\n`;
        config += `  },\n`;
        config += `  timestamp: ${localDeployment.timestamp || Date.now()}\n`;
        config += `};\n\n`;
    }
    
    config += `// Helper function to get deployment by chain ID\n`;
    config += `export function getDeployment(chainId: number): DeploymentConfig | null {\n`;
    config += `  switch (chainId) {\n`;
    config += `    case 31337:\n`;
    config += `      return LOCAL_DEPLOYMENT;\n`;
    config += `    default:\n`;
    config += `      return null;\n`;
    config += `  }\n`;
    config += `}\n`;
    
    return config;
}

function main() {
    console.log('🚀 Starting ABI export process...');
    
    // Ensure directories exist
    ensureDirectoryExists(EXPORTS_DIR);
    
    // Contract file mappings (updated for actual build output structure)
    const contractPaths = {
        'RegistrationContract': 'RegistrationContract.sol/RegistrationContract.json',
        'RegistrationStorage': 'RegistrationStorage.sol/RegistrationStorage.json',
        'PatientModule': 'PatientModule.sol/PatientModule.json',
        'OrganizationModule': 'OrganizationModule.sol/OrganizationModule.json',
        'AdminModule': 'AdminModule.sol/AdminModule.json',
        'EmailDomainProver': 'EmailDomainProver.sol/EmailDomainProver.json'
    };
    
    let allABIs = {};
    let allInterfaces = '';
    
    // Process each contract
    for (const [contractName, contractPath] of Object.entries(contractPaths)) {
        console.log(`📄 Processing ${contractName}...`);
        
        const abi = extractABI(contractPath);
        if (abi) {
            allABIs[contractName] = abi;
            
            // Generate individual ABI file
            fs.writeFileSync(
                path.join(EXPORTS_DIR, `${contractName}.json`), 
                JSON.stringify(abi, null, 2)
            );
            
            // Generate TypeScript interface
            const tsInterface = generateTypeScriptInterface(contractName, abi);
            allInterfaces += tsInterface + '\n\n';
            
            console.log(`✅ ${contractName} exported successfully`);
        } else {
            console.warn(`⚠️  Could not extract ABI for ${contractName}`);
        }
    }
    
    // Write combined ABIs file
    fs.writeFileSync(
        path.join(EXPORTS_DIR, 'abis.json'), 
        JSON.stringify(allABIs, null, 2)
    );
    
    // Write TypeScript interfaces
    const tsContent = `// Generated TypeScript interfaces for zkMed contracts\n// Generated at: ${new Date().toISOString()}\n\n${allInterfaces}`;
    fs.writeFileSync(path.join(EXPORTS_DIR, 'contracts.ts'), tsContent);
    
    // Generate deployment configuration
    const deploymentConfig = generateDeploymentConfig();
    fs.writeFileSync(path.join(EXPORTS_DIR, 'deployments.ts'), deploymentConfig);
    
    // Generate index file for easy imports
    const indexContent = `// zkMed Contract Exports\n// Easy imports for frontend applications\n\n` +
        `export * from './contracts';\n` +
        `export * from './deployments';\n\n` +
        `// Import all ABIs as JSON\n` +
        `import * as ABIs from './abis.json';\nexport { ABIs };\n\n` +
        `// Individual ABI imports\n` +
        CONTRACTS.map(contract => 
            `import ${contract}ABI from './${contract}.json';\nexport { ${contract}ABI };`
        ).join('\n') + '\n\n' +
        `// Contract addresses from local deployment\n` +
        `export { LOCAL_DEPLOYMENT, getDeployment } from './deployments';\n\n` +
        `// Usage example:\n` +
        `// import { RegistrationContractABI, LOCAL_DEPLOYMENT } from './exports';\n` +
        `// const contractAddress = LOCAL_DEPLOYMENT.contracts.registrationContract;\n`;
    
    fs.writeFileSync(path.join(EXPORTS_DIR, 'index.ts'), indexContent);
    
    // Generate README
    const readmeContent = `# zkMed Contract Exports

This directory contains all the necessary files for frontend integration with zkMed smart contracts.

## Files

- \`abis.json\` - Combined ABIs for all contracts
- \`contracts.ts\` - TypeScript interfaces for all contracts  
- \`deployments.ts\` - Deployment configuration and addresses
- \`index.ts\` - Main export file for easy imports
- Individual ABI files for each contract

## Usage

### Basic Import
\`\`\`typescript
import { 
  RegistrationContractABI, 
  LOCAL_DEPLOYMENT, 
  RegistrationContractContract 
} from './exports';

const contractAddress = LOCAL_DEPLOYMENT.contracts.registrationContract;
\`\`\`

### With ethers.js
\`\`\`typescript
import { ethers } from 'ethers';
import { RegistrationContractABI, LOCAL_DEPLOYMENT } from './exports';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545');
const contract = new ethers.Contract(
  LOCAL_DEPLOYMENT.contracts.registrationContract,
  RegistrationContractABI,
  provider
);
\`\`\`

### With wagmi/viem
\`\`\`typescript
import { useContractRead } from 'wagmi';
import { RegistrationContractABI, LOCAL_DEPLOYMENT } from './exports';

const { data } = useContractRead({
  address: LOCAL_DEPLOYMENT.contracts.registrationContract,
  abi: RegistrationContractABI,
  functionName: 'isUserVerified',
  args: [address]
});
\`\`\`

## Contracts

### Core System
- **RegistrationContract**: Main proxy contract
- **RegistrationStorage**: Centralized storage with access control

### Modules  
- **PatientModule**: Patient registration and commitments
- **OrganizationModule**: Organization registration with email verification
- **AdminModule**: Admin functions and batch operations

### Utilities
- **EmailDomainProver**: vlayer-based email domain verification

## Development

Regenerate exports after contract changes:
\`\`\`bash
make export-abis
\`\`\`
`;
    
    fs.writeFileSync(path.join(EXPORTS_DIR, 'README.md'), readmeContent);
    
    console.log('\n🎉 ABI export completed successfully!');
    console.log('\n📁 Generated files:');
    console.log('├── abis.json (combined ABIs)');
    console.log('├── contracts.ts (TypeScript interfaces)');
    console.log('├── deployments.ts (deployment config)');
    console.log('├── index.ts (main exports)');
    console.log('├── README.md (documentation)');
    
    CONTRACTS.forEach(contract => {
        console.log(`├── ${contract}.json`);
    });
    
    console.log('\n🚀 Ready for frontend integration!');
    console.log('Import from: ./exports/');
}

if (require.main === module) {
    main();
}

module.exports = { main };

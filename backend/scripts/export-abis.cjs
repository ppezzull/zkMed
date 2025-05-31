#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, '..', 'exports');
const OUT_DIR = path.join(__dirname, '..', 'out');
const DEPLOYMENTS_DIR = path.join(__dirname, '..', 'deployments');

// Contract names to export
const CONTRACTS = [
    'RegistrationContract',
    'RegistrationStorage', 
    'PatientModule',
    'OrganizationModule',
    'AdminModule',
    'EmailDomainProver'
];

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📤 Exporting contract ABIs and deployment info...');

// Export ABIs
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

// Export deployment addresses
if (fs.existsSync(DEPLOYMENTS_DIR)) {
    const deploymentFiles = fs.readdirSync(DEPLOYMENTS_DIR).filter(f => f.endsWith('.json'));
    deploymentFiles.forEach(file => {
        const deploymentPath = path.join(DEPLOYMENTS_DIR, file);
        const outputPath = path.join(OUTPUT_DIR, `deployment-${file}`);
        fs.copyFileSync(deploymentPath, outputPath);
        console.log(`✅ Exported deployment: ${file}`);
    });
} else {
    console.log('⚠️  No deployments directory found');
}

// Generate combined TypeScript configuration
const configContent = generateConfigFile();
fs.writeFileSync(path.join(OUTPUT_DIR, 'config.ts'), configContent);

// Generate README
const readmeContent = generateReadme();
fs.writeFileSync(path.join(OUTPUT_DIR, 'README.md'), readmeContent);

console.log('\n🎉 Export completed successfully!');
console.log(`📁 Files exported to: ${OUTPUT_DIR}`);
console.log('\n📋 Next steps:');
console.log('1. Import contracts in your Next.js app:');
console.log("   import { RegistrationContract } from './exports/RegistrationContract'");
console.log('2. Use deployment addresses from exports/deployment-local.json');
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

// Usage example:
// const contract = getContract({
//   address: "${contractName.toLowerCase()}Address",
//   abi: ${contractName}ABI,
//   client: publicClient,
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
    return `// Auto-generated configuration file
import { Chain } from 'viem';

export const contracts = {
${CONTRACTS.map(name => `  ${name.toLowerCase()}: {
    abi: require('./${name}.json'),
    // Add addresses per network in your app
  }`).join(',\n')}
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
`;
}

function generateReadme() {
    return `# zkMed Contract Exports

This directory contains auto-generated contract ABIs and TypeScript interfaces for the zkMed system.

## Files

### Contract ABIs
${CONTRACTS.map(name => `- \`${name}.json\` - ABI for ${name}`).join('\n')}

### TypeScript Interfaces  
${CONTRACTS.map(name => `- \`${name}.ts\` - TypeScript interface for ${name}`).join('\n')}

### Deployment Info
- \`deployment-local.json\` - Local deployment addresses

### Configuration
- \`config.ts\` - Unified configuration file
- \`README.md\` - This file

## Usage

### With Viem/Wagmi

\`\`\`typescript
import { getContract } from 'viem';
import { RegistrationContractABI } from './RegistrationContract';
import deploymentInfo from './deployment-local.json';

const registrationContract = getContract({
  address: deploymentInfo.registrationContract,
  abi: RegistrationContractABI,
  publicClient,
});
\`\`\`

### With Thirdweb

\`\`\`typescript
import { getContract } from "thirdweb";
import { RegistrationContractABI } from './RegistrationContract';
import deploymentInfo from './deployment-local.json';

const contract = getContract({
  client,
  chain: defineChain(31337),
  address: deploymentInfo.registrationContract,
  abi: RegistrationContractABI,
});
\`\`\`

## Contract Addresses (Local Deployment)

$(if [ -f "${DEPLOYMENTS_DIR}/local.json" ]; then cat "${DEPLOYMENTS_DIR}/local.json" | jq -r 'to_entries[] | "- **\(.key)**: \(.value)"'; else echo "No local deployment found"; fi)

## Regenerating Exports

Run \`make export-abis\` from the backend directory to regenerate these files.
`;
} 
/**
 * ABI Exporter for Next.js Integration
 * 
 * This script extracts contract ABIs from Foundry build artifacts
 * and exports them in formats suitable for Next.js applications
 */

import fs from 'fs';
import path from 'path';

// Configuration
const OUT_DIR = './out';
const EXPORT_DIR = './exports';
const CONTRACTS_TO_EXPORT = [
  'RegistrationContract',
  'EmailDomainProver'
];

/**
 * Extract ABI from Foundry build artifact
 */
function extractABI(contractName) {
  try {
    const artifactPath = path.join(OUT_DIR, `${contractName}.sol`, `${contractName}.json`);
    
    if (!fs.existsSync(artifactPath)) {
      throw new Error(`Artifact not found: ${artifactPath}`);
    }
    
    const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
    
    return {
      abi: artifact.abi,
      bytecode: artifact.bytecode?.object || artifact.bytecode,
      contractName
    };
  } catch (error) {
    console.error(`Failed to extract ABI for ${contractName}:`, error.message);
    return null;
  }
}

/**
 * Create TypeScript exports
 */
function createTypeScriptExports(contracts) {
  const exports = [];
  
  contracts.forEach(contract => {
    if (!contract) return;
    
    exports.push(`
// ${contract.contractName} Contract
export const ${contract.contractName}ABI = ${JSON.stringify(contract.abi, null, 2)} as const;

export const ${contract.contractName}Bytecode = "${contract.bytecode}";
`);
  });
  
  // Create the main export file
  const content = `/**
 * zkMed Contract ABIs and Bytecode
 * 
 * Auto-generated from Foundry build artifacts
 * Generated at: ${new Date().toISOString()}
 */

${exports.join('\n')}

// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  // Local development (Anvil L1)
  31337: {
    RegistrationContract: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    EmailDomainProver: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
  },
  // Sepolia testnet
  11155111: {
    RegistrationContract: '', // Add after deployment
    EmailDomainProver: ''     // Add after deployment
  },
  // Ethereum mainnet
  1: {
    RegistrationContract: '', // Add after deployment
    EmailDomainProver: ''     // Add after deployment
  }
} as const;

// Type definitions for thirdweb
export type ContractAddresses = typeof CONTRACT_ADDRESSES;
export type SupportedChainId = keyof ContractAddresses;

// Helper to get contract address by chain ID
export function getContractAddress(
  chainId: SupportedChainId,
  contractName: keyof ContractAddresses[SupportedChainId]
): string {
  const address = CONTRACT_ADDRESSES[chainId]?.[contractName];
  if (!address) {
    throw new Error(\`Contract \${contractName} not deployed on chain \${chainId}\`);
  }
  return address;
}

// thirdweb contract configurations
export const registrationContractConfig = {
  address: getContractAddress,
  abi: RegistrationContractABI,
} as const;

export const emailDomainProverConfig = {
  address: getContractAddress,
  abi: EmailDomainProverABI,
} as const;
`;
  
  return content;
}

/**
 * Create individual ABI files for specific frameworks
 */
function createIndividualABIFiles(contracts) {
  contracts.forEach(contract => {
    if (!contract) return;
    
    // Create JSON file
    const jsonPath = path.join(EXPORT_DIR, `${contract.contractName}.json`);
    fs.writeFileSync(jsonPath, JSON.stringify(contract.abi, null, 2));
    
    // Create TypeScript file
    const tsPath = path.join(EXPORT_DIR, `${contract.contractName}.ts`);
    const tsContent = `/**
 * ${contract.contractName} ABI
 * Auto-generated from Foundry build artifacts
 */

export const ${contract.contractName}ABI = ${JSON.stringify(contract.abi, null, 2)} as const;

export default ${contract.contractName}ABI;
`;
    fs.writeFileSync(tsPath, tsContent);
    
    console.log(`✅ Exported ${contract.contractName} ABI to ${jsonPath} and ${tsPath}`);
  });
}

/**
 * Create Next.js specific exports for thirdweb
 */
function createNextJSConfig(contracts) {
  // Define contract addresses for reference
  const contractAddresses = {
    31337: {
      RegistrationContract: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
      EmailDomainProver: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
    }
  };

  const contractConfigs = contracts
    .filter(Boolean)
    .map(contract => {
      return `  ${contract.contractName.toLowerCase()}: {
    abi: ${contract.contractName}ABI,
    address: {
      31337: '${contractAddresses[31337]?.[contract.contractName] || ''}',
      11155111: '', // Sepolia
      1: ''         // Mainnet
    }
  }`;
    })
    .join(',\n');

  const content = `/**
 * Next.js thirdweb Configuration for zkMed Contracts
 * 
 * Usage in Next.js:
 * import { zkMedContracts } from '@/lib/contracts';
 * import { useReadContract } from 'thirdweb/react';
 * 
 * const { data } = useReadContract({
 *   contract: getContract({
 *     client,
 *     chain: defineChain(31337),
 *     address: zkMedContracts.registrationcontract.address[31337]
 *   }),
 *   method: 'isUserVerified',
 *   params: [address]
 * });
 */

${contracts.filter(Boolean).map(c => `import { ${c.contractName}ABI } from './${c.contractName}';`).join('\n')}

export const zkMedContracts = {
${contractConfigs}
} as const;

// Chain configurations for thirdweb
export const supportedChains = {
  anvil: {
    id: 31337,
    name: 'Anvil Local',
    rpc: 'http://localhost:8545'
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia',
    rpc: 'https://sepolia.infura.io/v3/YOUR_KEY'
  },
  ethereum: {
    id: 1,
    name: 'Ethereum',
    rpc: 'https://mainnet.infura.io/v3/YOUR_KEY'
  }
} as const;

export default zkMedContracts;
`;

  const configPath = path.join(EXPORT_DIR, 'thirdweb-config.ts');
  fs.writeFileSync(configPath, content);
  console.log(`✅ Created thirdweb configuration at ${configPath}`);
}

/**
 * Create thirdweb hooks
 */
function createThirdwebHooks(contracts) {
  const hooks = contracts
    .filter(Boolean)
    .map(contract => {
      const contractNameLower = contract.contractName.toLowerCase();
      
      return `
// ${contract.contractName} Hooks
export function use${contract.contractName}Read(
  client: any,
  chainId: number,
  method: string,
  params?: readonly unknown[]
) {
  const contract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, '${contract.contractName}'),
    abi: ${contract.contractName}ABI
  });

  return useReadContract({
    contract,
    method,
    params
  });
}

export function use${contract.contractName}Write(
  client: any,
  chainId: number
) {
  const contract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, '${contract.contractName}'),
    abi: ${contract.contractName}ABI
  });

  return {
    contract,
    sendTransaction: useSendTransaction()
  };
}`;
    })
    .join('\n');

  const content = `/**
 * thirdweb Hooks for zkMed Contracts
 * 
 * Custom hooks for interacting with zkMed smart contracts using thirdweb
 */

import {
  useReadContract,
  useSendTransaction,
  getContract,
  defineChain
} from 'thirdweb/react';
${contracts.filter(Boolean).map(c => `import { ${c.contractName}ABI } from './${c.contractName}';`).join('\n')}
import { getContractAddress } from './index';

${hooks}

// Convenience hooks for common operations
export function usePatientRegistration(client: any, chainId: number, userAddress?: string) {
  const registrationContract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'RegistrationContract'),
    abi: RegistrationContractABI
  });

  const { data: isRegistered } = useReadContract({
    contract: registrationContract,
    method: 'isUserVerified',
    params: userAddress ? [userAddress] : undefined
  });
  
  const { mutate: sendTransaction } = useSendTransaction();
  
  const registerPatient = async (commitment: string, emailHash: string) => {
    return sendTransaction({
      transaction: {
        to: getContractAddress(chainId, 'RegistrationContract'),
        data: registrationContract.interface.encodeFunctionData('registerPatient', [commitment, emailHash])
      }
    });
  };
  
  return {
    isRegistered,
    registerPatient,
    contract: registrationContract
  };
}

export function useOrganizationRegistration(client: any, chainId: number) {
  const registrationContract = getContract({
    client,
    chain: defineChain(chainId),
    address: getContractAddress(chainId, 'RegistrationContract'),
    abi: RegistrationContractABI
  });
  
  const { mutate: sendTransaction } = useSendTransaction();
  
  const registerOrganization = async (
    domain: string,
    organizationName: string,
    emailHash: string,
    targetWallet: string,
    role: number
  ) => {
    return sendTransaction({
      transaction: {
        to: getContractAddress(chainId, 'RegistrationContract'),
        data: registrationContract.interface.encodeFunctionData('registerOrganization', [
          domain,
          organizationName,
          emailHash,
          targetWallet,
          role
        ])
      }
    });
  };
  
  return {
    registerOrganization,
    contract: registrationContract
  };
}
`;

  const hooksPath = path.join(EXPORT_DIR, 'thirdweb-hooks.ts');
  fs.writeFileSync(hooksPath, content);
  console.log(`✅ Created thirdweb hooks at ${hooksPath}`);
}

/**
 * Main export function
 */
async function exportABIs() {
  console.log('🚀 Starting ABI export for Next.js integration...');
  
  // Create export directory
  if (!fs.existsSync(EXPORT_DIR)) {
    fs.mkdirSync(EXPORT_DIR, { recursive: true });
  }
  
  // Check if contracts are built
  if (!fs.existsSync(OUT_DIR)) {
    console.error('❌ Build artifacts not found. Run "forge build" first.');
    process.exit(1);
  }
  
  // Extract ABIs
  console.log('📄 Extracting ABIs from build artifacts...');
  const contracts = CONTRACTS_TO_EXPORT.map(extractABI);
  
  const validContracts = contracts.filter(Boolean);
  if (validContracts.length === 0) {
    console.error('❌ No valid contracts found to export.');
    process.exit(1);
  }
  
  console.log(`✅ Found ${validContracts.length} contracts to export`);
  
  // Create exports
  console.log('📝 Creating export files...');
  
  // 1. Main TypeScript export file
  const mainExport = createTypeScriptExports(contracts);
  fs.writeFileSync(path.join(EXPORT_DIR, 'index.ts'), mainExport);
  console.log('✅ Created main export file: exports/index.ts');
  
  // 2. Individual ABI files
  createIndividualABIFiles(contracts);
  
  // 3. Next.js specific configuration
  createNextJSConfig(contracts);
  
  // 4. thirdweb hooks
  createThirdwebHooks(contracts);
  
  // 5. Create README
  const readmeContent = `# zkMed Contract ABIs

This directory contains exported ABIs and TypeScript definitions for zkMed smart contracts.

## Files

- \`index.ts\` - Main export file with all ABIs and addresses
- \`thirdweb-config.ts\` - thirdweb configuration for Next.js
- \`thirdweb-hooks.ts\` - Custom hooks for contract interactions
- Individual contract files (\`RegistrationContract.ts\`, etc.)

## Usage in Next.js with thirdweb

\`\`\`typescript
import { createThirdwebClient, getContract, defineChain } from 'thirdweb';
import { useReadContract } from 'thirdweb/react';
import { RegistrationContractABI, getContractAddress } from './exports';

const client = createThirdwebClient({ clientId: 'your-client-id' });

function MyComponent() {
  const contract = getContract({
    client,
    chain: defineChain(31337),
    address: getContractAddress(31337, 'RegistrationContract'),
    abi: RegistrationContractABI
  });

  const { data } = useReadContract({
    contract,
    method: 'isUserVerified',
    params: [userAddress]
  });
  
  return <div>User verified: {data ? 'Yes' : 'No'}</div>;
}
\`\`\`

## Generated: ${new Date().toISOString()}
`;
  
  fs.writeFileSync(path.join(EXPORT_DIR, 'README.md'), readmeContent);
  
  console.log('\n🎉 ABI export completed successfully!');
  console.log('\nFiles created:');
  console.log('- exports/index.ts (Main export)');
  console.log('- exports/thirdweb-config.ts (thirdweb config)');
  console.log('- exports/thirdweb-hooks.ts (Custom hooks)');
  console.log('- exports/README.md (Documentation)');
  validContracts.forEach(contract => {
    console.log(`- exports/${contract.contractName}.ts`);
    console.log(`- exports/${contract.contractName}.json`);
  });
  
  console.log('\n📋 Next steps:');
  console.log('1. Copy the exports/ directory to your Next.js project');
  console.log('2. Update contract addresses after deployment');
  console.log('3. Install thirdweb: npm install thirdweb');
  console.log('4. Import and use in your components');
}

// Run the export
exportABIs().catch(console.error);

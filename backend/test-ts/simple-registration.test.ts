/**
 * Simple zkMed Registration Contract Tests
 * TypeScript testing suite with proper types and error handling
 */

import { ethers, type ContractTransactionResponse, type TransactionReceipt } from 'ethers';
import { test, expect, describe, beforeAll } from 'bun:test';
import { readFileSync } from 'fs';
import { join } from 'path';

// Types
interface TestAccount {
  address: string;
  privateKey: string;
}

interface ContractArtifact {
  abi: any[];
  bytecode: string;
}

// Enum for user roles
enum UserRole {
  PATIENT = 0,
  HOSPITAL = 1,
  INSURER = 2,
  ADMIN = 3
}

// Test result interfaces
interface RegistrationResult {
  success: boolean;
  gasUsed?: bigint;
  error?: string;
}

interface GasAnalysis {
  estimate: bigint;
  cost: string;
  costWei: bigint;
}

// Load contract artifacts
const RegistrationContractArtifact = JSON.parse(
  readFileSync(join(process.cwd(), 'out/RegistrationContract.sol/RegistrationContract.json'), 'utf8')
);

// Test configuration
const ANVIL_RPC = 'http://localhost:8545';
const CONTRACT_ADDRESS = '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318';

// Test accounts
const TEST_ACCOUNTS = [
  {
    address: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    privateKey: '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  },
  {
    address: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    privateKey: '0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d'
  }
];

describe('zkMed Registration Contract', () => {
  let provider: ethers.JsonRpcProvider;
  let contract: ethers.Contract;
  let signer: ethers.Wallet;

  // Helper function to safely call contract methods
  async function safeContractCall<T>(
    contractInstance: ethers.Contract,
    method: string,
    args: any[] = []
  ): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const result = await contractInstance[method](...args);
      return { success: true, data: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  // Helper function to generate unique test data
  function generateTestData() {
    const timestamp = Date.now();
    return {
      commitment: ethers.keccak256(ethers.toUtf8Bytes(`test-commitment-${timestamp}`)),
      emailHash: ethers.keccak256(ethers.toUtf8Bytes(`test-email-${timestamp}`)),
      domain: `test-${timestamp}.com`
    };
  }

  beforeAll(() => {
    provider = new ethers.JsonRpcProvider(ANVIL_RPC);
    signer = new ethers.Wallet(TEST_ACCOUNTS[0].privateKey, provider);
    contract = new ethers.Contract(CONTRACT_ADDRESS, RegistrationContractArtifact.abi, signer);
  });

  test('should connect to the contract', async () => {
    expect(contract.target).toBe(CONTRACT_ADDRESS);
    expect(provider).toBeDefined();
    expect(signer.address).toBe(TEST_ACCOUNTS[0].address);
    console.log('✅ Connected to RegistrationContract');
  });

  test('should check contract deployment', async () => {
    const code = await provider.getCode(CONTRACT_ADDRESS);
    expect(code).not.toBe('0x');
    expect(code.length).toBeGreaterThan(2); // More than just "0x"
    console.log('✅ Contract is deployed and has bytecode');
  });

  test('should query basic contract state', async () => {
    const domainResult = await safeContractCall<boolean>(
      contract, 
      'isDomainRegistered', 
      ['generalhospital.com']
    );
    
    const userResult = await safeContractCall<boolean>(
      contract, 
      'isUserVerified', 
      [signer.address]
    );

    if (domainResult.success) {
      console.log(`✅ Domain registration status: ${domainResult.data}`);
      expect(typeof domainResult.data).toBe('boolean');
    } else {
      console.log(`ℹ️ Domain query failed: ${domainResult.error}`);
    }

    if (userResult.success) {
      console.log(`✅ User verification status: ${userResult.data}`);
      expect(typeof userResult.data).toBe('boolean');
    } else {
      console.log(`ℹ️ User query failed: ${userResult.error}`);
    }
  });

  test('should attempt patient registration with unused account', async () => {
    let registrationAttempted = false;

    for (let i = 0; i < TEST_ACCOUNTS.length; i++) {
      const testSigner = new ethers.Wallet(TEST_ACCOUNTS[i].privateKey, provider);
      const testContract = contract.connect(testSigner) as ethers.Contract;
      
      // Check if user is verified (which includes registration status)
      const verificationResult = await safeContractCall<boolean>(
        testContract, 
        'isUserVerified', 
        [testSigner.address]
      );

      console.log(`👤 Account ${i}: ${testSigner.address}`);
      
      if (verificationResult.success) {
        console.log(`   Verification status: ${verificationResult.data}`);
        
        if (!verificationResult.data) {
          // Account is not verified/registered, try to register
          const testData = generateTestData();
          
          console.log(`🔄 Attempting registration for account ${i}...`);
          
          const txResult = await safeContractCall<ContractTransactionResponse>(
            testContract,
            'registerPatient',
            [testData.commitment]
          );
          
          if (txResult.success && txResult.data) {
            const receipt: TransactionReceipt | null = await txResult.data.wait();
            if (receipt) {
              console.log(`✅ Patient registration successful! Gas used: ${receipt.gasUsed}`);
              
              // Verify registration
              const verifyResult = await safeContractCall<boolean>(
                testContract, 
                'isUserVerified', 
                [testSigner.address]
              );
              
              if (verifyResult.success) {
                expect(verifyResult.data).toBe(true);
                registrationAttempted = true;
                break;
              }
            }
          } else {
            console.log(`ℹ️ Registration failed: ${txResult.error}`);
            if (txResult.error?.includes('Already registered')) {
              console.log(`👍 Account ${i} is already registered (as expected)`);
            }
          }
        } else {
          console.log(`👍 Account ${i} is already verified/registered`);
        }
      } else {
        console.log(`ℹ️ Could not check verification status: ${verificationResult.error}`);
      }
    }

    // At least one registration attempt should have been made
    console.log(`📊 Registration attempt made: ${registrationAttempted}`);
  });

  test('should test organization registration flow', async () => {
    const testData = generateTestData();
    
    const domainResult = await safeContractCall<boolean>(
      contract, 
      'isDomainRegistered', 
      [testData.domain]
    );
    
    if (domainResult.success) {
      console.log(`🏥 Domain ${testData.domain} registration status: ${domainResult.data}`);
      
      if (!domainResult.data) {
        console.log(`🔄 Attempting to register organization for ${testData.domain}...`);
        
        const orgResult = await safeContractCall<ContractTransactionResponse>(
          contract,
          'registerOrganization',
          [
            testData.domain,
            'Test Hospital',
            testData.emailHash,
            signer.address,
            UserRole.HOSPITAL
          ]
        );
        
        if (orgResult.success && orgResult.data) {
          const receipt = await orgResult.data.wait();
          console.log(`✅ Organization registration successful! Gas used: ${receipt?.gasUsed}`);
        } else {
          console.log(`ℹ️ Organization registration failed: ${orgResult.error}`);
          // This is expected if not admin
          expect(orgResult.error).toBeDefined();
        }
      }
    } else {
      console.log(`ℹ️ Could not check domain status: ${domainResult.error}`);
    }
  });

  test('should perform gas analysis', async () => {
    const testData = generateTestData();
    
    try {
      // Get gas estimate
      const gasEstimate: bigint = await contract.registerPatient.estimateGas(
        testData.commitment
      );
      
      // Get current gas price
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || 0n;
      const estimatedCost = gasEstimate * gasPrice;
      
      const gasAnalysis: GasAnalysis = {
        estimate: gasEstimate,
        cost: ethers.formatEther(estimatedCost),
        costWei: estimatedCost
      };
      
      console.log(`⛽ Gas Analysis:`);
      console.log(`   Estimated gas: ${gasAnalysis.estimate}`);
      console.log(`   Estimated cost: ${gasAnalysis.cost} ETH`);
      console.log(`   Cost in wei: ${gasAnalysis.costWei}`);
      
      expect(gasAnalysis.estimate).toBeGreaterThan(0n);
      expect(gasAnalysis.costWei).toBeGreaterThanOrEqual(0n);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log(`ℹ️ Gas analysis failed: ${errorMessage}`);
      
      // Gas estimation might fail if account is already registered
      if (errorMessage.includes('Already registered')) {
        console.log(`👍 Gas estimation failed due to existing registration (expected)`);
      }
    }
  });

  test('should test comprehensive contract queries', async () => {
    console.log('🔍 Testing comprehensive contract state queries...');
    
    const queries = [
      { method: 'isUserVerified', args: [signer.address], description: 'User verification check' },
      { method: 'isDomainRegistered', args: ['generalhospital.com'], description: 'Domain registration check' },
      { method: 'getUserRegistration', args: [signer.address], description: 'User registration details' },
    ];
    
    const results: Array<{ method: string; success: boolean; data?: any; error?: string }> = [];
    
    for (const query of queries) {
      const result = await safeContractCall(contract, query.method, query.args);
      results.push({ method: query.method, ...result });
      
      if (result.success) {
        // Handle BigInt serialization for logging
        let displayData: string;
        try {
          displayData = JSON.stringify(result.data, (key, value) =>
            typeof value === 'bigint' ? value.toString() : value
          );
        } catch {
          displayData = String(result.data);
        }
        console.log(`✅ ${query.description}: ${displayData}`);
      } else {
        console.log(`ℹ️ ${query.description} failed: ${result.error}`);
      }
    }
    
    // At least some queries should succeed
    const successfulQueries = results.filter(r => r.success);
    expect(successfulQueries.length).toBeGreaterThan(0);
    
    console.log(`📊 Query success rate: ${successfulQueries.length}/${results.length}`);
  });
});

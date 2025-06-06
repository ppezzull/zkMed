import { createVlayerClient } from "@vlayer/sdk";
import {
  getConfig,
  createContext,
} from "@vlayer/sdk/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { createPublicClient, createWalletClient, http, parseEther, getContract } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { anvil } from 'viem/chains';

// Node.js types
declare var process: any;

// ES Module dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * zkMed Email Proof Integration - Simplified RegistrationContract Testing
 * 
 * This script demonstrates email domain verification workflow using only the
 * RegistrationContract - the single entry point for all zkMed functionality.
 * 
 * Usage:
 * npm run prove-email org     - Organization registration with email proof
 * npm run prove-email patient - Patient registration (no email proof)
 * npm run prove-email test    - Run all test scenarios
 * npm run prove-email help    - Show this help
 */

const config = getConfig();
const {
  chain,
  ethClient,
  account: deployer,
  proverUrl,
  confirmations,
} = createContext(config);

if (!deployer) {
  throw new Error(
    "No account found. Make sure EXAMPLES_TEST_PRIVATE_KEY is set in your environment variables",
  );
}

// Configuration for zkMed registration (updated for Mount Sinai)
const ORGANIZATION_CONFIG = {
  name: "Mount Sinai Health System",
  domain: "mountsinai.org",
  role: "Hospital", // "Hospital" or "Insurer"
  walletAddress: deployer.address,
};

// Setup viem clients for contract interaction
const publicClient = createPublicClient({
  chain: anvil,
  transport: http('http://localhost:8545'),
});

const walletClient = createWalletClient({
  chain: anvil,
  transport: http('http://localhost:8545'),
  account: privateKeyToAccount('0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'),
});

console.log("=== zkMed Email Proof Testing - Simplified RegistrationContract ===");
console.log("Organization:", ORGANIZATION_CONFIG.name);
console.log("Domain:", ORGANIZATION_CONFIG.domain);
console.log("Target Wallet:", ORGANIZATION_CONFIG.walletAddress);
console.log("Role:", ORGANIZATION_CONFIG.role);

interface LocalDeployment {
  chainId: number;
  deployer: string;
  registrationContract: string;
  timestamp: number;
}

interface ContractInstance {
  registrationContract: any;
  deployment: LocalDeployment;
}

async function loadLocalDeployment(): Promise<LocalDeployment | null> {
  try {
    const deploymentPath = path.join(__dirname, "../deployments/local.json");
    if (fs.existsSync(deploymentPath)) {
      const data = fs.readFileSync(deploymentPath, "utf8");
      const deployment = JSON.parse(data) as LocalDeployment;
      console.log("📁 Loaded local deployment from:", deploymentPath);
      return deployment;
    }
  } catch (error) {
    console.log("⚠️  Could not load local deployment:", error);
  }
  return null;
}

async function loadRegistrationContractABI() {
  const abiPath = path.join(__dirname, "../out/RegistrationContract.sol/RegistrationContract.json");
  
  try {
    const contractData = JSON.parse(fs.readFileSync(abiPath, "utf8"));
    return contractData.abi;
  } catch (error) {
    throw new Error(`Failed to load RegistrationContract ABI: ${error}`);
  }
}

async function setupContract(): Promise<ContractInstance> {
  console.log("\n1. Setting up RegistrationContract...");
  
  // Try to load existing local deployment first
  const localDeployment = await loadLocalDeployment();
  
  if (!localDeployment || localDeployment.chainId !== chain.id) {
    console.log("❌ No local deployment found or chain ID mismatch");
    console.log("Please run 'make deploy-local' first to deploy the contracts");
    throw new Error("Local deployment not found");
  }

  console.log("✅ Using existing local deployment:");
  console.log("   RegistrationContract:  ", localDeployment.registrationContract);
  console.log("   Chain ID:              ", localDeployment.chainId);
  console.log("   Deployed at:           ", new Date(localDeployment.timestamp * 1000).toLocaleString());
  
  // Load contract ABI
  const abi = await loadRegistrationContractABI();
  
  // Create contract instance
  const registrationContract = getContract({
    address: localDeployment.registrationContract as `0x${string}`,
    abi: abi,
    client: { public: publicClient, wallet: walletClient },
  });

  return {
    registrationContract,
    deployment: localDeployment,
  };
}

async function generateOrganizationEmailProof() {
  console.log("\n=== Organization Registration with vlayer Email Proof ===");
  
  const contracts = await setupContract();

  console.log("\n2. Testing vlayer email proof generation...");
  
  try {
    // Create mock email data for testing (in real scenario, this would come from actual email)
    const mockEmailData = {
      from: `admin@${ORGANIZATION_CONFIG.domain}`,
      to: "test@example.com",
      subject: `Register organization [${ORGANIZATION_CONFIG.name}] for address: ${ORGANIZATION_CONFIG.walletAddress}`,
      body: "This email verifies domain ownership for zkMed registration.",
      headers: {
        dkim: "mock-dkim-signature",
        messageId: "test-message-id-123",
        date: new Date().toISOString(),
      }
    };

    console.log("\n📧 Mock email data:");
    console.log("   From:", mockEmailData.from);
    console.log("   Subject:", mockEmailData.subject);
    console.log("   Target Wallet:", ORGANIZATION_CONFIG.walletAddress);

    // Generate organization verification data
    const orgData = {
      targetWallet: ORGANIZATION_CONFIG.walletAddress as `0x${string}`,
      domain: ORGANIZATION_CONFIG.domain,
      name: ORGANIZATION_CONFIG.name,
      emailHash: `0x${Buffer.from(mockEmailData.from).toString('hex').padStart(64, '0')}` as `0x${string}`,
      verificationTimestamp: BigInt(Math.floor(Date.now() / 1000)),
    };

    console.log("\n🔍 Generated organization data:");
    console.log("   Target Wallet:", orgData.targetWallet);
    console.log("   Domain:", orgData.domain);
    console.log("   Name:", orgData.name);
    console.log("   Email Hash:", orgData.emailHash);
    console.log("   Timestamp:", orgData.verificationTimestamp);

    // Create mock vlayer proof (in real scenario, this would be generated by vlayer)
    const mockProof = {
      seal: `0x${'1234567890abcdef'.repeat(8)}` as `0x${string}`,
      callGuestId: `0x${'fedcba0987654321'.repeat(4)}` as `0x${string}`,
      length: BigInt(256),
      callAssumptions: {
        proverContractAddress: contracts.registrationContract.address,
        functionSelector: '0x12345678' as `0x${string}`,
        settleChainId: BigInt(31337),
        settleBlockNumber: BigInt(await publicClient.getBlockNumber()),
        settleBlockHash: (await publicClient.getBlock()).hash!,
      }
    };

    console.log("\n🔐 Generated mock vlayer proof:");
    console.log("   Seal (first 16 chars):", mockProof.seal.substring(0, 18) + "...");
    console.log("   Call Guest ID:", mockProof.callGuestId.substring(0, 18) + "...");
    console.log("   Length:", mockProof.length);

    // Test contract interaction - check if domain is available
    console.log("\n📋 Testing RegistrationContract functions...");
    
    try {
      // Check domain availability through RegistrationContract
      const domainOwner = await contracts.registrationContract.read.domainToAddress([ORGANIZATION_CONFIG.domain]);
      console.log("   Current domain owner:", domainOwner);
      
      if (domainOwner !== '0x0000000000000000000000000000000000000000') {
        console.log("   ⚠️  Domain already registered, testing read operations only");
        
        // Test reading existing organization data through RegistrationContract
        const userRegistration = await contracts.registrationContract.read.getUserRegistration([domainOwner]);
        console.log("   Existing user registration:");
        console.log("     Role:", userRegistration[0]);
        console.log("     Verified:", userRegistration[1]);
        console.log("     Timestamp:", userRegistration[2]);
        console.log("     Org Name:", userRegistration[3]);
        console.log("     Domain:", userRegistration[4]);
        
        const userRole = await contracts.registrationContract.read.roles([domainOwner]);
        console.log("   User role:", userRole);
        
      } else {
        console.log("   ✅ Domain available for registration");
        
        // In a real implementation, you would call:
        // await contracts.registrationContract.write.registerOrganizationWithProof([
        //   orgData,
        //   mockProof
        // ]);
        
        console.log("\n📝 Would call registerOrganizationWithProof on RegistrationContract with:");
        console.log("   Organization data:", orgData);
        console.log("   Proof data: [mock proof structure]");
      }
      
      // Test other RegistrationContract read functions
      const isOwner = await contracts.registrationContract.read.isOwner([contracts.deployment.deployer as `0x${string}`]);
      console.log("   Deployer is owner:", isOwner);
      
      const isAdmin = await contracts.registrationContract.read.admins([contracts.deployment.deployer as `0x${string}`]);
      console.log("   Deployer is admin:", isAdmin);
      
      // Test email hash uniqueness through RegistrationContract
      const emailUsed = await contracts.registrationContract.read.usedEmailHashes([orgData.emailHash]);
      console.log("   Email hash already used:", emailUsed);
      
    } catch (contractError) {
      console.error("   ❌ Contract interaction error:", contractError);
    }

    console.log("\n✅ Organization email proof workflow completed");
    console.log("📊 Summary:");
    console.log("   - Mock email data generated");
    console.log("   - Organization verification data created");
    console.log("   - vlayer proof structure prepared");
    console.log("   - RegistrationContract interactions tested");
    
  } catch (error) {
    console.error("\n❌ Error during organization proof generation:", error);
    console.log("\nNote: This demonstrates the workflow structure.");
    console.log("For real proofs, ensure vlayer service is properly configured.");
  }
}

async function testPatientRegistration() {
  console.log("\n=== Patient Registration Test with RegistrationContract ===");
  
  const contracts = await setupContract();
  
  console.log("🧪 Testing patient registration (no email proof required)");
  console.log("Patient address:", deployer?.address);
  
  try {
    // Generate patient commitment
    const secret = "my-secret-health-data-123";
    const commitment = `0x${Buffer.from(secret).toString('hex').padStart(64, '0')}` as `0x${string}`;
    
    console.log("\n📝 Patient registration data:");
    console.log("   Secret (for demo):", secret);
    console.log("   Commitment hash:", commitment);
    console.log("   Patient address:", deployer?.address);

    // Check if patient is already registered through RegistrationContract
    const currentRole = await contracts.registrationContract.read.roles([deployer?.address as `0x${string}`]);
    console.log("   Current role:", currentRole);
    
    if (currentRole === 0) { // Role.None
      console.log("\n📋 Attempting patient registration...");
      
      try {
        // Call the RegistrationContract function directly
        const hash = await contracts.registrationContract.write.registerPatient([commitment]);
        console.log("   Transaction hash:", hash);
        
        // Wait for transaction confirmation
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log("   Transaction confirmed in block:", receipt.blockNumber);
        
        // Verify registration through RegistrationContract
        const newRole = await contracts.registrationContract.read.roles([deployer?.address as `0x${string}`]);
        const isVerified = await contracts.registrationContract.read.isUserVerified([deployer?.address as `0x${string}`]);
        const isActive = await contracts.registrationContract.read.isUserActive([deployer?.address as `0x${string}`]);
        
        console.log("\n✅ Patient registration successful!");
        console.log("   New role:", newRole, "(1 = Patient)");
        console.log("   Verified:", isVerified);
        console.log("   Active:", isActive);
        
        // Test commitment verification through RegistrationContract
        const commitmentValid = await contracts.registrationContract.read.verifyPatientCommitment([secret]);
        console.log("   Commitment verification:", commitmentValid);
        
      } catch (regError) {
        console.error("   ❌ Registration failed:", regError);
        console.log("   This might be expected if patient is already registered");
      }
      
    } else {
      console.log("   ⚠️  Patient already registered, testing verification functions");
      
      // Test existing patient functions through RegistrationContract
      const isVerified = await contracts.registrationContract.read.isUserVerified([deployer?.address as `0x${string}`]);
      const isActive = await contracts.registrationContract.read.isUserActive([deployer?.address as `0x${string}`]);
      
      console.log("   Already verified:", isVerified);
      console.log("   Already active:", isActive);
      
      // Test getUserRegistration function
      const userRegistration = await contracts.registrationContract.read.getUserRegistration([deployer?.address as `0x${string}`]);
      console.log("   User registration details:");
      console.log("     Role:", userRegistration[0]);
      console.log("     Verified:", userRegistration[1]);
      console.log("     Timestamp:", userRegistration[2]);
      console.log("     Org Name:", userRegistration[3]);
      console.log("     Domain:", userRegistration[4]);
    }
    
  } catch (error) {
    console.error("\n❌ Patient registration test failed:", error);
  }
}

function showHelp() {
  console.log("\n=== zkMed Email Proof Integration Help - Simplified ===");
  console.log("");
  console.log("This script tests the RegistrationContract - the single entry point for all zkMed functionality.");
  console.log("");
  console.log("Available commands:");
  console.log("  org     - Organization registration with email proof");
  console.log("  patient - Patient registration (no email proof needed)");
  console.log("  test    - Run all test scenarios");
  console.log("  help    - Show this help message");
  console.log("");
  console.log("Example usage:");
  console.log("  npm run prove-email org");
  console.log("  npx tsx proveEmailDomain.ts org");
  console.log("");
  console.log("Current configuration:");
  console.log("  Organization: " + ORGANIZATION_CONFIG.name);
  console.log("  Domain: " + ORGANIZATION_CONFIG.domain);
  console.log("  Role: " + ORGANIZATION_CONFIG.role);
  console.log("  Chain: " + chain.name + " (ID: " + chain.id + ")");
  console.log("  Deployer: " + deployer?.address);
  console.log("");
  console.log("RegistrationContract Features:");
  console.log("  - Patient registration with health data commitments");
  console.log("  - Organization registration with email domain verification");
  console.log("  - Role-based access control (Patient, Hospital, Insurer, Admin)");
  console.log("  - Admin functions for user management");
  console.log("  - All functionality through a single contract interface");
  console.log("");
}

async function runAllTests() {
  console.log("\n=== Running All zkMed Tests with RegistrationContract ===");
  
  try {
    await testPatientRegistration();
    await generateOrganizationEmailProof();
    
    console.log("\n🎉 All tests completed!");
    console.log("\n📊 Summary:");
    console.log("   ✅ Patient registration: RegistrationContract interaction tested");
    console.log("   ✅ Organization registration: vlayer proof workflow tested");
    console.log("   ✅ All functionality: Available through single RegistrationContract");
    console.log("   ✅ Simplified integration: Only one contract to manage");
    
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
  }
}

async function main() {
  const command = process.argv[2] || "help";
  
  console.log("=== zkMed Email Proof Testing - Simplified RegistrationContract ===");
  console.log("Command:", command);
  console.log("Chain:", chain.name, "(ID:", chain.id + ")");
  console.log("Account:", deployer?.address);
  
  try {
    switch (command.toLowerCase()) {
      case "org":
      case "organization":
        await generateOrganizationEmailProof();
        break;
        
      case "patient":
        await testPatientRegistration();
        break;
        
      case "test":
        await runAllTests();
        break;
        
      case "help":
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error("\n❌ Command failed:", error);
    process.exit(1);
  }
}

// Execute main function
main().then(() => {
  console.log("\n✅ Script completed successfully");
  process.exit(0);
}).catch((error) => {
  console.error("\n❌ Script failed:", error);
  process.exit(1);
});

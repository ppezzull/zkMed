import { createVlayerClient } from "@vlayer/sdk";
import {
  getConfig,
  createContext,
} from "@vlayer/sdk/config";
import fs from "fs";
import path from "path";

// Node.js types
declare var process: any;

/**
 * zkMed Email Proof Integration with Direct Module Deployment
 * 
 * This script demonstrates the complete email domain verification workflow
 * for organization registration in the zkMed system using direct module deployment.
 * 
 * Usage:
 * npm run prove-email org     - Organization registration with email proof
 * npm run prove-email patient - Patient registration (no email proof)
 * npm run prove-email simple  - Simple domain verification test
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

console.log("=== zkMed Email Proof Generation with Direct Module Deployment ===");
console.log("Organization:", ORGANIZATION_CONFIG.name);
console.log("Domain:", ORGANIZATION_CONFIG.domain);
console.log("Target Wallet:", ORGANIZATION_CONFIG.walletAddress);
console.log("Role:", ORGANIZATION_CONFIG.role);

interface LocalDeployment {
  chainId: number;
  deployer: string;
  emailDomainProver: string;
  registrationContract: string;
  registrationStorage: string;
  patientModule: string;
  organizationModule: string;
  adminModule: string;
  timestamp: number;
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

async function deployOrLoadContracts() {
  console.log("\n1. Setting up contracts...");
  
  // Try to load existing local deployment first
  const localDeployment = await loadLocalDeployment();
  
  if (localDeployment && localDeployment.chainId === chain.id) {
    console.log("✅ Using existing local deployment:");
    console.log("   EmailDomainProver:     ", localDeployment.emailDomainProver);
    console.log("   RegistrationContract:  ", localDeployment.registrationContract);
    console.log("   RegistrationStorage:   ", localDeployment.registrationStorage);
    console.log("   PatientModule:         ", localDeployment.patientModule);
    console.log("   OrganizationModule:    ", localDeployment.organizationModule);
    console.log("   AdminModule:           ", localDeployment.adminModule);
    console.log("   Chain ID:              ", localDeployment.chainId);
    console.log("   Deployed at:           ", new Date(localDeployment.timestamp * 1000).toLocaleString());
    
    return {
      emailDomainProver: localDeployment.emailDomainProver,
      registrationContract: localDeployment.registrationContract,
      isLocalDeployment: true
    };
  }
  
  console.log("❌ No local deployment found or chain ID mismatch");
  console.log("Please run 'make deploy-local' first to deploy the contracts");
  throw new Error("Local deployment not found");
}

async function generateOrganizationEmailProof() {
  console.log("\n=== Organization Registration with Email Proof ===");
  
  const vlayer = createVlayerClient({
    url: proverUrl,
    token: config.token,
  });

  const contracts = await deployOrLoadContracts();

  console.log("\n2. Email Instructions:");
  console.log("=" + "=".repeat(60));
  console.log("TO COMPLETE DOMAIN VERIFICATION FOR MOUNT SINAI:");
  console.log("1. Send an email FROM: admin@" + ORGANIZATION_CONFIG.domain);
  console.log("2. TO: Any email address (preferably a test email)");
  console.log("3. SUBJECT: Register organization [" + ORGANIZATION_CONFIG.name + "] for address: " + ORGANIZATION_CONFIG.walletAddress);
  console.log("4. BODY: This email verifies domain ownership for zkMed registration.");
  console.log("=" + "=".repeat(60));
  
  // Wait for user confirmation
  console.log("\nPress Enter after sending the email to continue...");
  await new Promise<void>(resolve => {
    process.stdin.once('data', () => resolve());
  });

  try {
    console.log("\n3. Generating vlayer email proof...");
    console.log("This may take 15-30 seconds...");
    
    // For now, we'll just show what would happen since we can't generate real proofs without vlayer setup
    console.log("\n⚠️  Note: This demo shows the workflow structure.");
    console.log("To generate real proofs, you need:");
    console.log("1. vlayer service running");
    console.log("2. Valid email proof");
    console.log("3. Proper vlayer SDK configuration");
    
    console.log("\n📧 Email verification workflow would:");
    console.log("   1. Parse email headers and content");
    console.log("   2. Verify DKIM signatures");
    console.log("   3. Extract domain from 'From' field");
    console.log("   4. Generate zero-knowledge proof");
    console.log("   5. Submit proof to smart contract");
    
    console.log("\n✅ Organization would be registered with:");
    console.log("   Name:", ORGANIZATION_CONFIG.name);
    console.log("   Domain:", ORGANIZATION_CONFIG.domain);
    console.log("   Role:", ORGANIZATION_CONFIG.role);
    console.log("   Wallet:", ORGANIZATION_CONFIG.walletAddress);
    
  } catch (error) {
    console.error("\n❌ Error during proof generation:", error);
    console.log("\nThis is expected in demo mode without full vlayer setup.");
  }
}

async function testPatientRegistration() {
  console.log("\n=== Patient Registration Test ===");
  
  const contracts = await deployOrLoadContracts();
  
  console.log("🧪 Testing patient registration (no email proof required)");
  console.log("Patient address:", deployer?.address);
  
  // For a real implementation, this would call the smart contract
  console.log("\n📋 Patient registration workflow:");
  console.log("   1. Generate commitment hash from secret");
  console.log("   2. Call registerPatient(commitment)");
  console.log("   3. Patient role assigned automatically");
  console.log("   4. Patient can later prove commitment with secret");
  
  console.log("\n✅ Patient registration completed (simulated)");
}

async function generateSimpleDomainProof() {
  console.log("\n=== Simple Domain Verification Test ===");
  
  const contracts = await deployOrLoadContracts();
  
  console.log("🔍 Testing simple domain verification");
  console.log("Domain:", ORGANIZATION_CONFIG.domain);
  
  console.log("\n📋 Simple verification workflow:");
  console.log("   1. Submit email proof");
  console.log("   2. Extract domain from email");
  console.log("   3. Verify domain ownership");
  console.log("   4. Store verification result");
  
  console.log("\n✅ Domain verification completed (simulated)");
}

function showHelp() {
  console.log("\n=== zkMed Email Proof Integration Help ===");
  console.log("");
  console.log("Available commands:");
  console.log("  org     - Organization registration with email proof");
  console.log("  patient - Patient registration (no email proof needed)");
  console.log("  simple  - Simple domain verification test");
  console.log("  test    - Run all test scenarios");
  console.log("  help    - Show this help message");
  console.log("");
  console.log("Example usage:");
  console.log("  npm run prove-email org");
  console.log("  node proveEmailDomain.js org");
  console.log("");
  console.log("Current configuration:");
  console.log("  Organization: " + ORGANIZATION_CONFIG.name);
  console.log("  Domain: " + ORGANIZATION_CONFIG.domain);
  console.log("  Role: " + ORGANIZATION_CONFIG.role);
  console.log("  Chain: " + chain.name + " (ID: " + chain.id + ")");
  console.log("  Deployer: " + deployer?.address);
  console.log("");
}

async function runAllTests() {
  console.log("\n=== Running All zkMed Tests ===");
  
  try {
    await testPatientRegistration();
    await generateSimpleDomainProof();
    await generateOrganizationEmailProof();
    
    console.log("\n🎉 All tests completed!");
    console.log("\n📊 Summary:");
    console.log("   ✅ Patient registration: Simulated");
    console.log("   ✅ Domain verification: Simulated");
    console.log("   ✅ Organization registration: Workflow demonstrated");
    
  } catch (error) {
    console.error("\n❌ Test suite failed:", error);
  }
}

async function main() {
  const command = process.argv[2] || "help";
  
  console.log("=== zkMed Email Proof Integration with Direct Module Deployment ===");
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
        
      case "simple":
        await generateSimpleDomainProof();
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

if (require.main === module) {
  main().then(() => {
    console.log("\n✅ Script completed successfully");
    process.exit(0);
  }).catch((error) => {
    console.error("\n❌ Script failed:", error);
    process.exit(1);
  });
}

import { createVlayerClient } from "@vlayer/sdk";
import {
  getConfig,
  createContext,
  deployVlayerContracts,
  waitForContractDeploy,
} from "@vlayer/sdk/config";

// Node.js types
declare var process: any;

// Note: After building with forge, these should import from the out/ directory
// For now, we'll use type assertions to handle the import structure
import emailDomainProverSpec from "../out/EmailDomainProver.sol/EmailDomainProver.json"
import registrationContractSpec from "../out/RegistrationContract.sol/RegistrationContract.json"

/**
 * zkMed Email Proof Integration
 * 
 * This script demonstrates the complete email domain verification workflow
 * for organization registration in the zkMed system.
 * 
 * Usage:
 * 1. Organization admin sends email with required format from admin@domain.com
 * 2. Run this script to generate vlayer proof
 * 3. Submit proof to RegistrationContract for verification
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

// Configuration for zkMed registration
const ORGANIZATION_CONFIG = {
  name: "General Hospital",
  domain: "generalhospital.com",
  role: "Hospital", // "Hospital" or "Insurer"
  walletAddress: deployer.address,
};

console.log("=== zkMed Email Proof Generation ===");
console.log("Organization:", ORGANIZATION_CONFIG.name);
console.log("Domain:", ORGANIZATION_CONFIG.domain);
console.log("Target Wallet:", ORGANIZATION_CONFIG.walletAddress);
console.log("Role:", ORGANIZATION_CONFIG.role);

async function generateEmailProof() {
  console.log("\n1. Setting up vlayer client...");
  
  const vlayer = createVlayerClient({
    url: proverUrl,
    token: config.token,
  });

  // Deploy contracts if needed (for testing)
  console.log("\n2. Deploying contracts for testing...");
  
  const { prover: emailProverAddress, verifier: registrationContractAddress } = await deployVlayerContracts({
    proverSpec: emailDomainProverSpec,
    verifierSpec: registrationContractSpec,
    proverArgs: [], // EmailDomainProver has no constructor args
    verifierArgs: [], // We'll set the prover address later
  });

  console.log("EmailDomainProver deployed at:", emailProverAddress);
  console.log("RegistrationContract deployed at:", registrationContractAddress);

  console.log("\n3. Email Instructions:");
  console.log("=" + "=".repeat(50));
  console.log("TO COMPLETE DOMAIN VERIFICATION:");
  console.log("1. Send an email FROM: admin@" + ORGANIZATION_CONFIG.domain);
  console.log("2. TO: Any email address (preferably a test email)");
  console.log("3. SUBJECT: Register organization [" + ORGANIZATION_CONFIG.name + "] for address: " + ORGANIZATION_CONFIG.walletAddress);
  console.log("4. BODY: This email verifies domain ownership for zkMed registration.");
  console.log("=" + "=".repeat(50));
  
  // Wait for user confirmation
  console.log("\nPress Enter after sending the email to continue...");
  await new Promise<void>(resolve => {
    process.stdin.once('data', () => resolve());
  });

  try {
    console.log("\n4. Generating vlayer email proof...");
    console.log("This may take 15-30 seconds...");
    
    // Generate proof for organization registration
    const hash = await vlayer.prove({
      address: emailProverAddress,
      proverAbi: emailDomainProverSpec.abi,
      functionName: "verifyOrganization",
      args: [/* unverifiedEmail - vlayer will provide this automatically */],
      chainId: chain.id,
      gasLimit: config.gasLimit,
    });

    console.log("Proof generation initiated, hash:", hash);
    
    // Wait for proof result
    const result = await vlayer.waitForProvingResult({ hash });
    const [proof, organizationData] = result as [any, any];
    
    console.log("\n5. Proof generated successfully!");
    console.log("Proof:", proof);
    console.log("Organization Data:", organizationData);

    // Verify the proof on-chain
    console.log("\n6. Submitting proof for on-chain verification...");
    
    const roleEnum = ORGANIZATION_CONFIG.role === "Hospital" ? 1 : 2; // Role.Hospital = 1, Role.Insurer = 2
    
    const gas = await ethClient.estimateContractGas({
      address: registrationContractAddress,
      abi: registrationContractSpec.abi,
      functionName: "registerOrganization",
      args: [proof, organizationData, roleEnum],
      account: deployer!,
      blockTag: "pending",
    });

    const verificationHash = await ethClient.writeContract({
      address: registrationContractAddress,
      abi: registrationContractSpec.abi,
      functionName: "registerOrganization",
      args: [proof, organizationData, roleEnum],
      account: deployer!,
      gas,
    });

    const receipt = await ethClient.waitForTransactionReceipt({
      hash: verificationHash,
      confirmations,
      retryCount: 60,
      retryDelay: 1000,
    });

    console.log("\n7. Registration completed!");
    console.log("Transaction hash:", verificationHash);
    console.log("Transaction status:", receipt.status === 'success' ? 'SUCCESS' : 'FAILED');
    console.log("Gas used:", receipt.gasUsed.toString());
    
    if (receipt.status === 'success') {
      console.log("\n✓ Organization successfully registered!");
      console.log("✓ Domain ownership verified:", ORGANIZATION_CONFIG.domain);
      console.log("✓ Email hash recorded for replay protection");
      console.log("✓ Role assigned:", ORGANIZATION_CONFIG.role);
    }

  } catch (error) {
    console.error("\n❌ Error during proof generation or verification:");
    console.error(error);
    
    // Provide helpful troubleshooting
    console.log("\nTroubleshooting:");
    console.log("1. Ensure the email was sent from admin@" + ORGANIZATION_CONFIG.domain);
    console.log("2. Check that the subject line exactly matches the required format");
    console.log("3. Verify the wallet address in the email matches:", ORGANIZATION_CONFIG.walletAddress);
    console.log("4. Make sure vlayer devnet is running (bun run devnet:up)");
    console.log("5. Check VLAYER_ENV is set correctly");
  }
}

// Alternative simplified domain verification
async function generateSimpleDomainProof() {
  console.log("\n=== Alternative: Simple Domain Verification ===");
  
  const vlayer = createVlayerClient({
    url: proverUrl,
    token: config.token,
  });

  try {
    console.log("Generating simple domain ownership proof...");
    
    // Deploy contracts for simple verification
    const { prover: emailProverAddress } = await deployVlayerContracts({
      proverSpec: emailDomainProverSpec,
      verifierSpec: registrationContractSpec,
      proverArgs: [],
      verifierArgs: [],
    });
    
    const hash = await vlayer.prove({
      address: emailProverAddress,
      proverAbi: emailDomainProverSpec.abi,
      functionName: "simpleDomainVerification",
      args: [/* unverifiedEmail, targetWallet */],
      chainId: chain.id,
      gasLimit: config.gasLimit,
    });

    const result = await vlayer.waitForProvingResult({ hash });
    const [proof, domain, emailHash] = result as [any, string, string];
    
    console.log("Simple domain proof generated:");
    console.log("Domain:", domain);
    console.log("Email hash:", emailHash);
    
  } catch (error) {
    console.error("Simple domain proof failed:", error);
  }
}

// Main execution
async function main() {
  console.log("Starting zkMed email proof integration...");
  
  // Choose verification method
  const useFullRegistration = process.argv.includes('--full');
  
  if (useFullRegistration) {
    await generateEmailProof();
  } else {
    console.log("Use --full flag for complete organization registration");
    console.log("Running simple domain verification...");
    await generateSimpleDomainProof();
  }
}

main().catch(console.error);

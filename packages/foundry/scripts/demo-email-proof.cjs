#!/usr/bin/env node

/**
 * zkMed Email Proof Demonstration Script
 * 
 * This script demonstrates the email domain verification workflow
 * for Mount Sinai organization registration without requiring full vlayer setup.
 */

const fs = require('fs');
const path = require('path');

// Configuration for Mount Sinai
const ORGANIZATION_CONFIG = {
  name: "Mount Sinai Health System",
  domain: "mountsinai.org",
  role: "Hospital",
  adminEmail: "admin@mountsinai.org"
};

function loadLocalDeployment() {
  try {
    const deploymentPath = path.join(__dirname, "../deployments/local.json");
    if (fs.existsSync(deploymentPath)) {
      const data = fs.readFileSync(deploymentPath, "utf8");
      const deployment = JSON.parse(data);
      console.log("📁 Loaded local deployment from:", deploymentPath);
      return deployment;
    }
  } catch (error) {
    console.log("⚠️  Could not load local deployment:", error.message);
  }
  return null;
}

function showDeploymentInfo() {
  console.log("=== zkMed Email Proof Demonstration ===");
  console.log("Organization:", ORGANIZATION_CONFIG.name);
  console.log("Domain:", ORGANIZATION_CONFIG.domain);
  console.log("Admin Email:", ORGANIZATION_CONFIG.adminEmail);
  console.log("Role:", ORGANIZATION_CONFIG.role);
  console.log("");
  
  const deployment = loadLocalDeployment();
  
  if (deployment) {
    console.log("✅ Smart contracts deployed on local Anvil:");
    console.log("   Chain ID:              ", deployment.chainId);
    console.log("   EmailDomainProver:     ", deployment.emailDomainProver);
    console.log("   RegistrationContract:  ", deployment.registrationContract);
    console.log("   RegistrationStorage:   ", deployment.registrationStorage);
    console.log("   PatientModule:         ", deployment.patientModule);
    console.log("   OrganizationModule:    ", deployment.organizationModule);
    console.log("   AdminModule:           ", deployment.adminModule);
    console.log("   Deployed at:           ", new Date(deployment.timestamp * 1000).toLocaleString());
    console.log("");
    return deployment;
  } else {
    console.log("❌ No local deployment found");
    console.log("Please run 'make deploy-local' first to deploy the contracts");
    return null;
  }
}

function demonstrateEmailWorkflow() {
  console.log("=== Email Domain Verification Workflow ===");
  console.log("");
  
  console.log("📧 STEP 1: Email Preparation");
  console.log("To verify domain ownership for Mount Sinai Health System:");
  console.log("");
  console.log("FROM:    " + ORGANIZATION_CONFIG.adminEmail);
  console.log("TO:      any-email@example.com (test email)");
  console.log("SUBJECT: Register organization [" + ORGANIZATION_CONFIG.name + "] for zkMed");
  console.log("BODY:    This email verifies domain ownership for zkMed registration.");
  console.log("");
  
  console.log("🔐 STEP 2: Zero-Knowledge Proof Generation");
  console.log("The vlayer system would:");
  console.log("   1. Parse the email headers and content");
  console.log("   2. Verify DKIM signatures from mountsinai.org");
  console.log("   3. Extract the domain from the 'From' field");
  console.log("   4. Generate a zero-knowledge proof of domain ownership");
  console.log("   5. Create verification data without revealing email content");
  console.log("");
  
  console.log("⛓️  STEP 3: On-Chain Verification");
  console.log("The smart contract would:");
  console.log("   1. Receive the zero-knowledge proof");
  console.log("   2. Verify the proof using the EmailDomainProver");
  console.log("   3. Extract the verified domain (mountsinai.org)");
  console.log("   4. Register the organization with Hospital role");
  console.log("   5. Store the registration in RegistrationStorage");
  console.log("   6. Emit OrganizationRegistered event");
  console.log("");
  
  console.log("✅ STEP 4: Registration Complete");
  console.log("Mount Sinai Health System would be registered with:");
  console.log("   • Verified domain: mountsinai.org");
  console.log("   • Role: Hospital");
  console.log("   • Status: Verified and Active");
  console.log("   • Timestamp: " + new Date().toLocaleString());
  console.log("");
}

function showContractInteraction(deployment) {
  if (!deployment) return;
  
  console.log("=== Smart Contract Integration ===");
  console.log("");
  
  console.log("📋 Contract Functions Used:");
  console.log("1. EmailDomainProver.verifyOrganization(proof, orgData)");
  console.log("   - Verifies the zero-knowledge email proof");
  console.log("   - Extracts domain and organization data");
  console.log("");
  
  console.log("2. RegistrationContract.registerOrganization(proof, orgData, role)");
  console.log("   - Calls EmailDomainProver for verification");
  console.log("   - Delegates to OrganizationModule for registration");
  console.log("   - Updates RegistrationStorage with verified data");
  console.log("");
  
  console.log("3. OrganizationModule.registerOrganization(proof, orgData, role)");
  console.log("   - Handles organization-specific registration logic");
  console.log("   - Validates domain uniqueness");
  console.log("   - Sets up organization profile");
  console.log("");
  
  console.log("📊 Storage Updates:");
  console.log("   • roles[address] = Role.Hospital");
  console.log("   • verified[address] = true");
  console.log("   • activeUsers[address] = true");
  console.log("   • organizationNames[address] = 'Mount Sinai Health System'");
  console.log("   • organizationDomains[address] = 'mountsinai.org'");
  console.log("   • domainToAddress['mountsinai.org'] = address");
  console.log("   • registrationTimestamps[address] = block.timestamp");
  console.log("");
}

function showNextSteps() {
  console.log("=== Next Steps for Full Implementation ===");
  console.log("");
  
  console.log("🔧 To enable real email verification:");
  console.log("1. Set up vlayer environment variables:");
  console.log("   - CHAIN_NAME=anvil");
  console.log("   - JSON_RPC_URL=http://localhost:8545");
  console.log("   - PROVER_URL=http://localhost:3000");
  console.log("   - VLAYER_ENV=local");
  console.log("   - EXAMPLES_TEST_PRIVATE_KEY=0xac0974...");
  console.log("");
  
  console.log("2. Start vlayer prover service:");
  console.log("   vlayer serve");
  console.log("");
  
  console.log("3. Send actual email from admin@mountsinai.org");
  console.log("");
  
  console.log("4. Run the full proof generation:");
  console.log("   npm run prove-email org");
  console.log("");
  
  console.log("🌐 Frontend Integration:");
  console.log("1. Export ABIs: make export-abis");
  console.log("2. Import contracts from backend/exports/");
  console.log("3. Use deployment addresses from deployments/local.json");
  console.log("4. Connect with ethers.js or wagmi/viem");
  console.log("");
  
  console.log("📱 User Experience:");
  console.log("• Organizations send verification email");
  console.log("• System generates proof automatically");
  console.log("• Registration completes on-chain");
  console.log("• Users can immediately access zkMed features");
  console.log("");
}

function main() {
  const command = process.argv[2] || "demo";
  
  switch (command.toLowerCase()) {
    case "demo":
    case "org":
    case "organization":
      const deployment = showDeploymentInfo();
      demonstrateEmailWorkflow();
      showContractInteraction(deployment);
      showNextSteps();
      break;
      
    case "info":
      showDeploymentInfo();
      break;
      
    case "help":
    default:
      console.log("zkMed Email Proof Demonstration");
      console.log("");
      console.log("Usage: node demo-email-proof.js [command]");
      console.log("");
      console.log("Commands:");
      console.log("  demo, org  - Show complete email verification workflow");
      console.log("  info       - Show deployment information only");
      console.log("  help       - Show this help message");
      console.log("");
      break;
  }
}

if (require.main === module) {
  main();
} 
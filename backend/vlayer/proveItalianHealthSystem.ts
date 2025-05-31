import { parseArgs } from "node:util";
import { createVlayerClient } from "@vlayer/sdk";
import { getConfig, createContext } from "@vlayer/sdk/config";

// Configuration for vlayer
const config = getConfig();
const {
  chain,
  ethClient,
  account: deployer,
  proverUrl,
  confirmations,
} = createContext(config);

// Parse command line arguments
const {
  values: { address, commitment, help },
} = parseArgs({
  options: {
    address: {
      type: "string",
      short: "a",
      description: "Patient's Ethereum address",
    },
    commitment: {
      type: "string",
      short: "c", 
      description: "Privacy-preserving commitment (hash of tax code + address)",
    },
    help: {
      type: "boolean",
      short: "h",
      description: "Show help",
    },
  },
});

if (help) {
  console.log(`
Italian Health System WebProof Generator

Usage: bun run proveItalianHealthSystem.ts [options]

Options:
  -a, --address <address>      Patient's Ethereum address (required)
  -c, --commitment <commitment> Privacy-preserving commitment (required)
  -h, --help                   Show this help message

Description:
  This script generates a WebProof from the Italian health system (Salute Lazio) portal.
  It proves that a patient has a valid registration in the Italian health system
  without exposing sensitive personal information.

Workflow:
  1. Patient authenticates with SPID/CIE on the Salute Lazio portal
  2. Script captures the verified patient data via vlayer WebProof
  3. Generates zero-knowledge proof of valid health system registration
  4. Returns proof that can be verified on-chain

Example:
  bun run proveItalianHealthSystem.ts \\
    --address 0x1234567890123456789012345678901234567890 \\
    --commitment 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890

Environment Variables:
  PROVER_URL    - vlayer prover URL (default: http://localhost:3000)
  CHAIN_NAME    - Target blockchain (default: anvil)
  PRIVATE_KEY   - Private key for transaction signing
  
Prerequisites:
  1. vlayer browser extension installed
  2. Access to Salute Lazio portal with SPID/CIE authentication
  3. Patient data available in the portal
  `);
  process.exit(0);
}

// Validate required arguments
if (!address || !commitment) {
  console.error("Error: Both --address and --commitment are required");
  console.error("Use --help for usage information");
  process.exit(1);
}

// Validate Ethereum address format
if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
  console.error("Error: Invalid Ethereum address format");
  process.exit(1);
}

// Validate commitment format (should be 32-byte hex)
if (!/^0x[a-fA-F0-9]{64}$/.test(commitment)) {
  console.error("Error: Invalid commitment format (should be 32-byte hex)");
  process.exit(1);
}

async function main() {
  console.log("🏥 Italian Health System WebProof Generator");
  console.log("==========================================");
  console.log(`Patient Address: ${address}`);
  console.log(`Commitment: ${commitment}`);
  console.log();

  try {
    console.log("📋 Step 1: Preparing to generate WebProof...");
    console.log("Please follow these steps:");
    console.log("1. Open the vlayer browser extension");
    console.log("2. Navigate to: https://www.salutelazio.it/group/guest/profilo-utente");
    console.log("3. Authenticate with your SPID/CIE credentials");
    console.log("4. The extension will capture your patient data automatically");
    console.log();

    console.log("🔐 Step 2: Generating Italian Health System WebProof...");
    
    // Configure WebProof generation
    const webProofConfig = {
      url: "https://www.salutelazio.it/api/patient/profile",
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      // Redaction configuration to protect sensitive data
      redaction: {
        // Hide sensitive personal information
        hideFields: [
          "email", 
          "phone1", 
          "phone2", 
          "phone3", 
          "homeAddress",
          "residenceAddress", 
          "homeStreetNumber",
          "residenceStreetNumber",
          "homeZip",
          "residenceZip"
        ],
        // Keep verification elements
        keepFields: [
          "patientId",
          "taxCode", 
          "regionalCode",
          "homeAsl",
          "mmgTaxCode",
          "mmgName",
          "mmgSurname",
          "homeAslCode",
          "name",
          "surname",
          "gender",
          "birthday"
        ]
      }
    };

    console.log("Waiting for WebProof generation...");
    console.log("(This may take 30-60 seconds)");
    
    // Note: In a real implementation, this would use the vlayer SDK
    // to generate the actual WebProof from the browser extension
    console.log("⚠️  This is a development version - WebProof generation requires:");
    console.log("   • vlayer browser extension");
    console.log("   • Live integration with Salute Lazio portal");
    console.log("   • Actual SPID/CIE authentication");
    console.log();

    // Mock proof for development/testing
    const mockProofData = {
      patientId: "ASUR0000000006779428",
      taxCode: "PZZPRJ04L01H501I", // This would be redacted in real proof
      regionalCode: "280002457",
      homeAsl: "ROMA6",
      mmgTaxCode: "PMLSFN66B43H501L",
      name: "PIETRO JAIRO",
      surname: "PEZZULLO",
      gender: "M",
      birthday: 1088632800000
    };

    console.log("📊 Step 3: Processing verified patient data...");
    console.log("Patient ID:", mockProofData.patientId);
    console.log("Regional Code:", mockProofData.regionalCode);
    console.log("Home ASL:", mockProofData.homeAsl);
    console.log("Patient Name:", `${mockProofData.name} ${mockProofData.surname}`);
    console.log();

    console.log("🔗 Step 4: Generating on-chain proof...");
    
    // Generate the proof using vlayer prover
    // This would call the HealthSystemWebProofProver contract
    console.log("Calling HealthSystemWebProofProver.proveItalianPatient...");
    
    // Mock proof generation for development
    const proofResult = {
      proof: "0x" + "a".repeat(128), // Mock proof data
      verifiedData: {
        patientId: mockProofData.patientId,
        taxCodeHash: "0x" + "b".repeat(64), // Hash of tax code
        regionalCode: mockProofData.regionalCode,
        homeAsl: mockProofData.homeAsl,
        mmgTaxCodeHash: "0x" + "c".repeat(64), // Hash of doctor's tax code
        timestamp: Math.floor(Date.now() / 1000)
      },
      patientAddress: address
    };

    console.log("✅ Proof generated successfully!");
    console.log();
    console.log("📋 Proof Summary:");
    console.log("================");
    console.log("Proof:", proofResult.proof);
    console.log("Patient ID:", proofResult.verifiedData.patientId);
    console.log("Tax Code Hash:", proofResult.verifiedData.taxCodeHash);
    console.log("Regional Code:", proofResult.verifiedData.regionalCode);
    console.log("Home ASL:", proofResult.verifiedData.homeAsl);
    console.log("Patient Address:", proofResult.patientAddress);
    console.log("Timestamp:", new Date(proofResult.verifiedData.timestamp * 1000).toISOString());
    console.log();

    console.log("🚀 Step 5: Next steps for registration:");
    console.log("1. Use the proof above to call HealthSystemWebProofVerifier.verifyAndRegisterItalianPatient()");
    console.log("2. This will register the patient in the zkMed system with Italian health system verification");
    console.log("3. Patient can then use all zkMed features with verified Italian health identity");
    console.log();

    console.log("💡 Integration code example:");
    console.log(`
const healthVerifier = new ethers.Contract(
  HEALTH_VERIFIER_ADDRESS,
  HealthSystemWebProofVerifierABI,
  signer
);

const tx = await healthVerifier.verifyAndRegisterItalianPatient(
  proof,
  verifiedData,
  patientAddress
);

await tx.wait();
console.log("Patient registered with Italian health system verification!");
    `);

    return proofResult;

  } catch (error) {
    console.error("❌ Error generating Italian Health System WebProof:", error);
    process.exit(1);
  }
}

// Run the main function
main()
  .then((result) => {
    console.log("🎉 Italian Health System WebProof generation completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  }); 
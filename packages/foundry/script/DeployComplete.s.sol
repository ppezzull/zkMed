// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "../contracts/zkMed/zkMedCore.sol";
import "../contracts/zkMed/provers/zkMedRegistrationProver.sol";
import "../contracts/zkMed/provers/zkMedPaymentPlanProver.sol";
import "../contracts/zkMed/users/zkMedPatient.sol";
import "../contracts/zkMed/users/zkMedHospital.sol";
import "../contracts/zkMed/users/zkMedInsurer.sol";
import "../contracts/zkMed/users/zkMedAdmin.sol";
import "../contracts/zkMed/zkMedLinkPay.sol";

/**
 * @title Complete zkMed Deployment
 * @notice Deploys the entire zkMed ecosystem including LinkPay automation
 */
contract DeployComplete is Script {
    
    // Mock addresses for Base Sepolia
    address constant MOCK_USDC = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;  // Base Sepolia USDC
    address constant MOCK_TREASURY = 0xa235DC00B1d7501b919e27C2968999d4bCA5Bc3e; // Use deployer as treasury
    uint256 constant PAYMENT_INTERVAL = 30 days;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        require(deployerPrivateKey != 0, "DEPLOYER_PRIVATE_KEY not set");
        
        console.log("=== zkMed Complete Deployment ===");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Network: Base Sepolia");
        
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy zkMedCore first
        zkMedCore core = new zkMedCore();
        console.log("+ zkMedCore deployed at:", address(core));

        // 2. Deploy the provers
        zkMedRegistrationProver registrationProver = new zkMedRegistrationProver();
        console.log("+ zkMedRegistrationProver deployed at:", address(registrationProver));

        zkMedPaymentPlanProver paymentPlanProver = new zkMedPaymentPlanProver();
        console.log("+ zkMedPaymentPlanProver deployed at:", address(paymentPlanProver));

        // 3. Deploy LinkPay contract with core address
        zkMedLinkPay linkPay = new zkMedLinkPay(
            PAYMENT_INTERVAL,
            address(core),      // zkMedCore
            address(0),         // zkMedPatient - will be set after deployment
            MOCK_USDC,          // Payment token 
            MOCK_TREASURY       // Treasury address
        );
        console.log("+ zkMedLinkPay deployed at:", address(linkPay));

        // 4. Deploy user contracts with LinkPay address
        zkMedPatient patientContract = new zkMedPatient(
            address(core),
            address(registrationProver),
            address(paymentPlanProver),
            address(linkPay)  // LinkPay contract address
        );
        console.log("+ zkMedPatient deployed at:", address(patientContract));

        zkMedHospital hospitalContract = new zkMedHospital(
            address(core),
            address(registrationProver)
        );
        console.log("+ zkMedHospital deployed at:", address(hospitalContract));
        zkMedInsurer insurerContract = new zkMedInsurer(
            address(core),
            address(registrationProver)
        );
        console.log("+ zkMedInsurer deployed at:", address(insurerContract));

        zkMedAdmin adminContract = new zkMedAdmin(address(core));
        console.log("+ zkMedAdmin deployed at:", address(adminContract));

        // 5. Update LinkPay with patient contract address
        linkPay.updateZkMedContracts(address(core), address(patientContract));
        console.log("+ LinkPay updated with patient contract address");

        // 6. Set user contract addresses in core
        core.setUserContracts(
            address(patientContract),
            address(hospitalContract),
            address(insurerContract),
            address(adminContract)
        );
        console.log("+ Set user contract addresses in zkMedCore");

        vm.stopBroadcast();

        // Display deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("Network: Base Sepolia (Chain ID: 84532)");
        console.log("");
        console.log("Core Contracts:");
        console.log("  zkMedCore:           ", address(core));
        console.log("  zkMedLinkPay:        ", address(linkPay));
        console.log("");
        console.log("Prover Contracts:");
        console.log("  RegistrationProver:  ", address(registrationProver));
        console.log("  PaymentPlanProver:   ", address(paymentPlanProver));
        console.log("");
        console.log("User Contracts:");
        console.log("  Patient:             ", address(patientContract));
        console.log("  Hospital:            ", address(hospitalContract));
        console.log("  Insurer:             ", address(insurerContract));
        console.log("  Admin:               ", address(adminContract));
        console.log("");
        console.log("Configuration:");
        console.log("  Payment Token (USDC):", MOCK_USDC);
        console.log("  Treasury:            ", MOCK_TREASURY);
        console.log("  Payment Interval:    ", PAYMENT_INTERVAL, "seconds (30 days)");
        console.log("");
        console.log("Next Steps:");
        console.log("1. Register LinkPay with Chainlink Automation");
        console.log("2. Fund LinkPay automation subscription");
        console.log("3. Update frontend contract addresses");
        console.log("4. Test the complete workflow");
    }
} 
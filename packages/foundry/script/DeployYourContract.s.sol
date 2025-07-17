// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../contracts/zkMed/zkMedCore.sol";
import "../contracts/zkMed/zkMedPaymentHistory.sol";
import "../contracts/zkMed/provers/zkMedRegistrationProver.sol";
import "../contracts/zkMed/provers/zkMedPaymentPlanProver.sol";
import "../contracts/zkMed/users/zkMedPatient.sol";
import "../contracts/zkMed/users/zkMedHospital.sol";
import "../contracts/zkMed/users/zkMedInsurer.sol";
import "../contracts/zkMed/users/zkMedAdmin.sol";

contract DeployYourContract is Script {
    error InvalidPrivateKey(string);

    function run() external {
        uint256 deployerPrivateKey = setupLocalhostEnv();
        if (deployerPrivateKey == 0) {
            revert InvalidPrivateKey(
                "You don't have a deployer account. Make sure you have set DEPLOYER_PRIVATE_KEY in .env or use `yarn generate` to generate a new random account"
            );
        }
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy zkMedCore first (simplified, no dependencies)
        zkMedCore core = new zkMedCore();
        console.logString("zkMedCore deployed at:");
        console.logAddress(address(core));

        // 2. Deploy the provers
        zkMedRegistrationProver registrationProver = new zkMedRegistrationProver();
        console.logString("zkMedRegistrationProver deployed at:");
        console.logAddress(address(registrationProver));

        zkMedPaymentPlanProver paymentPlanProver = new zkMedPaymentPlanProver();
        console.logString("zkMedPaymentPlanProver deployed at:");
        console.logAddress(address(paymentPlanProver));

        // 3. Deploy user contracts with core and prover addresses
        zkMedPatient patientContract = new zkMedPatient(
            address(core),
            address(registrationProver),
            address(paymentPlanProver)
        );
        console.logString("zkMedPatient deployed at:");
        console.logAddress(address(patientContract));

        zkMedHospital hospitalContract = new zkMedHospital(
            address(core),
            address(registrationProver)
        );
        console.logString("zkMedHospital deployed at:");
        console.logAddress(address(hospitalContract));

        zkMedInsurer insurerContract = new zkMedInsurer(
            address(core),
            address(registrationProver)
        );
        console.logString("zkMedInsurer deployed at:");
        console.logAddress(address(insurerContract));

        zkMedAdmin adminContract = new zkMedAdmin(address(core));
        console.logString("zkMedAdmin deployed at:");
        console.logAddress(address(adminContract));

        // 4. Get payment history contract address and authorize core contract
        zkMedPaymentHistory paymentHistory = core.paymentHistoryContract();
        console.logString("Payment History Contract deployed at:");
        console.logAddress(address(paymentHistory));
        
        // The payment history contract is owned by zkMedCore, so we need to authorize from zkMedCore
        // This is already done in the zkMedCore constructor, so no additional authorization needed here
        console.logString("Payment history contract automatically authorized by zkMedCore");

        // 5. Set user contract addresses in core (this also authorizes them)
        core.setUserContracts(
            address(patientContract),
            address(hospitalContract),
            address(insurerContract),
            address(adminContract)
        );
        console.logString("Set user contract addresses in zkMedCore");

        console.logString("=== Deployment Summary ===");
        console.logString("Core Contract:");
        console.logAddress(address(core));
        console.logString("Payment History Contract:");
        console.logAddress(address(paymentHistory));
        console.logString("Registration Prover:");
        console.logAddress(address(registrationProver));
        console.logString("Payment Plan Prover:");
        console.logAddress(address(paymentPlanProver));
        console.logString("Patient Contract:");
        console.logAddress(address(patientContract));
        console.logString("Hospital Contract:");
        console.logAddress(address(hospitalContract));
        console.logString("Insurer Contract:");
        console.logAddress(address(insurerContract));
        console.logString("Admin Contract:");
        console.logAddress(address(adminContract));

        vm.stopBroadcast();

        /**
         * This function generates the file containing the contracts Abi definitions.
         * These definitions are used to derive the types needed in the custom scaffold-eth hooks, for example.
         * This function should be called last.
         */
        exportDeployments();
    }

    function setupLocalhostEnv() internal returns (uint256 forkId) {
        // This function is called only when the deployment is made to localhost
        // You can skip it if you are not deploying to localhost
        string memory localhostRpcUrl = "http://localhost:8545";
        return vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
    }

    function exportDeployments() internal {
        // Add deployment export logic here if needed
        // This would typically write deployment info to a file for frontend consumption
    }
}

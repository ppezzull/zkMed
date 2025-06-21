// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "../src/zkMed/HealthcareRegistration.sol";
import "../src/zkMed/HealthcareRegistrationProver.sol";

contract DeployHealthcareRegistration is Script {
    function run() external {
        // Use default Anvil private key for local development
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        // First deploy the HealthcareRegistrationProver contract
        HealthcareRegistrationProver prover = new HealthcareRegistrationProver();
        console.log("HealthcareRegistrationProver deployed to:", address(prover));

        // Then deploy the HealthcareRegistration contract with the prover address
        HealthcareRegistration healthcareRegistration = new HealthcareRegistration(address(prover));
        console.log("HealthcareRegistration contract deployed to:", address(healthcareRegistration));
        console.log("Owner:", healthcareRegistration.owner());
        console.log("Prover address:", healthcareRegistration.emailDomainProver());

        // Log initial statistics
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = 
            healthcareRegistration.getRegistrationStats();
        console.log("Initial stats - Total users:", totalUsers);
        console.log("Initial stats - Patients:", patients);
        console.log("Initial stats - Hospitals:", hospitals);
        console.log("Initial stats - Insurers:", insurers);

        // Verify the deployer is set as super admin
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions) = 
            healthcareRegistration.admins(vm.addr(deployerPrivateKey));
        console.log("Deployer admin status - Active:", isActive);
        console.log("Deployer admin role (2=SUPER_ADMIN):", uint256(role));
        console.log("Deployer permissions:", permissions);

        // Example: Register a demo patient to test the new function
        address demoPatient = vm.addr(1); // First test account
        bytes32 demoEmailHash = keccak256(abi.encodePacked("demo.patient@zkmed.com"));
        
        console.log("Registering demo patient:", demoPatient);
        console.log("Demo patient email hash:", vm.toString(demoEmailHash));
        
        healthcareRegistration.registerPatient(demoPatient, demoEmailHash);
        console.log("Demo patient registered successfully!");
        
        // Verify registration
        bool isRegistered = healthcareRegistration.isUserRegistered(demoPatient);
        bool isPatient = healthcareRegistration.isPatient(demoPatient);
        console.log("Demo patient is registered:", isRegistered);
        console.log("Demo patient is patient type:", isPatient);
        
        // Log updated statistics
        (totalUsers, patients, hospitals, insurers) = healthcareRegistration.getRegistrationStats();
        console.log("Updated stats - Total users:", totalUsers);
        console.log("Updated stats - Patients:", patients);
        console.log("Updated stats - Hospitals:", hospitals);
        console.log("Updated stats - Insurers:", insurers);

        vm.stopBroadcast();
    }
}

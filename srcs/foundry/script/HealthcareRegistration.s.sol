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

        // Get admin record for deployer
        address deployer = vm.addr(deployerPrivateKey);
        
        // Use getAdminType() function to check if deployer is an admin
        try healthcareRegistration.getAdminType(deployer) returns (HealthcareRegistration.AdminRole role) {
            console.log("Deployer admin role (2=SUPER_ADMIN):", uint256(role));
            console.log("Deployer is a registered admin");
        } catch {
            console.log("Deployer is not registered as an admin");
        }

        // Check if deployer address has super admin permissions
        // Note: We don't directly access the AdminRecord struct anymore
        bool isDeployerSuperAdmin = (healthcareRegistration.getAdminType(deployer) == 
                                     HealthcareRegistration.AdminRole.SUPER_ADMIN);
        console.log("Deployer is super admin:", isDeployerSuperAdmin);

        console.log("Deployment complete. You can now interact with the HealthcareRegistration contract.");
        vm.stopBroadcast();
    }
}

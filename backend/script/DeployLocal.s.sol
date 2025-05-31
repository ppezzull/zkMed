// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "forge-std/console.sol";
import "../src/zkMed/RegistrationContract.sol";
import "../src/zkMed/modules/RegistrationStorage.sol";
import "../src/zkMed/modules/PatientModule.sol";
import "../src/zkMed/modules/OrganizationModule.sol";
import "../src/zkMed/modules/AdminModule.sol";
import "../src/zkMed/EmailDomainProver.sol";

contract DeployLocal is Script {
    
    function run() external {
        // Use the private key passed via command line (default Anvil account #0)
        // If PRIVATE_KEY env var exists, use it, otherwise use default
        uint256 deployerPrivateKey;
        try vm.envUint("PRIVATE_KEY") returns (uint256 envKey) {
            deployerPrivateKey = envKey;
        } catch {
            // Default to Anvil account #0 private key
            deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        }
        
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("=== zkMed Local Deployment (Direct Module Deployment) ===");
        console.log("Deployer:", deployer);
        console.log("Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy EmailDomainProver first
        console.log("\n1. Deploying EmailDomainProver...");
        EmailDomainProver emailDomainProver = new EmailDomainProver();
        console.log("   EmailDomainProver deployed at:", address(emailDomainProver));
        
        // Deploy RegistrationStorage
        console.log("\n2. Deploying RegistrationStorage...");
        RegistrationStorage storageContract = new RegistrationStorage();
        console.log("   RegistrationStorage deployed at:", address(storageContract));
        
        // Deploy modules
        console.log("\n3. Deploying modules...");
        PatientModule patientModule = new PatientModule(address(storageContract));
        console.log("   PatientModule deployed at:", address(patientModule));
        
        OrganizationModule organizationModule = new OrganizationModule(address(storageContract), address(emailDomainProver));
        console.log("   OrganizationModule deployed at:", address(organizationModule));
        
        AdminModule adminModule = new AdminModule(address(storageContract));
        console.log("   AdminModule deployed at:", address(adminModule));
        
        // Deploy main registration contract with module addresses
        console.log("\n4. Deploying RegistrationContract with module addresses...");
        RegistrationContract registrationContract = new RegistrationContract(
            address(emailDomainProver),
            address(storageContract),
            address(patientModule),
            address(organizationModule),
            address(adminModule)
        );
        console.log("   RegistrationContract deployed at:", address(registrationContract));
        
        vm.stopBroadcast();
        
        // Initialize system
        console.log("\n5. Initializing system...");
        _initializeSystem(
            registrationContract,
            storageContract,
            patientModule,
            organizationModule,
            adminModule,
            deployer
        );
        
        // Verification
        console.log("\n=== DEPLOYMENT VERIFICATION ===");
        console.log("EmailDomainProver:     ", address(emailDomainProver));
        console.log("RegistrationStorage:   ", address(storageContract));
        console.log("PatientModule:         ", address(patientModule));
        console.log("OrganizationModule:    ", address(organizationModule));
        console.log("AdminModule:           ", address(adminModule));
        console.log("RegistrationContract:  ", address(registrationContract));
        
        // Verify contracts have code
        require(address(emailDomainProver).code.length > 0, "EmailDomainProver deployment failed");
        require(address(storageContract).code.length > 0, "RegistrationStorage deployment failed");
        require(address(patientModule).code.length > 0, "PatientModule deployment failed");
        require(address(organizationModule).code.length > 0, "OrganizationModule deployment failed");
        require(address(adminModule).code.length > 0, "AdminModule deployment failed");
        require(address(registrationContract).code.length > 0, "RegistrationContract deployment failed");
        
        console.log("\n=== CONTRACT SIZES ===");
        console.log("EmailDomainProver:     ", address(emailDomainProver).code.length, "bytes");
        console.log("RegistrationStorage:   ", address(storageContract).code.length, "bytes");
        console.log("PatientModule:         ", address(patientModule).code.length, "bytes");
        console.log("OrganizationModule:    ", address(organizationModule).code.length, "bytes");
        console.log("AdminModule:           ", address(adminModule).code.length, "bytes");
        console.log("RegistrationContract:  ", address(registrationContract).code.length, "bytes");
        
        // Verify size limits (24,576 bytes for EIP-170)
        require(address(emailDomainProver).code.length <= 24576, "EmailDomainProver exceeds size limit");
        require(address(storageContract).code.length <= 24576, "RegistrationStorage exceeds size limit");
        require(address(patientModule).code.length <= 24576, "PatientModule exceeds size limit");
        require(address(organizationModule).code.length <= 24576, "OrganizationModule exceeds size limit");
        require(address(adminModule).code.length <= 24576, "AdminModule exceeds size limit");
        require(address(registrationContract).code.length <= 24576, "RegistrationContract exceeds size limit");
        
        console.log("\n[SUCCESS] All contracts within size limits!");
        
        // Test basic functionality
        console.log("\n=== FUNCTIONALITY TEST ===");
        _testFunctionality(registrationContract, storageContract, patientModule, organizationModule, adminModule, deployer);
        
        console.log("\n[SUCCESS] LOCAL DEPLOYMENT SUCCESSFUL!");
        console.log("Saving deployment info to deployments/local.json");
        
        // Generate and save JSON
        _saveDeploymentInfo(
            address(registrationContract),
            address(storageContract),
            address(patientModule),
            address(organizationModule),
            address(adminModule),
            address(emailDomainProver),
            deployer
        );
        
        console.log("\nNEXT STEPS:");
        console.log("1. Run: make export-abis");
        console.log("2. Start your Next.js frontend");
        console.log("3. Import contracts from backend/exports/");
        console.log("4. Use addresses from deployments/local.json");
    }
    
    function _initializeSystem(
        RegistrationContract registrationContract,
        RegistrationStorage storageContract,
        PatientModule patientModule,
        OrganizationModule organizationModule,
        AdminModule adminModule,
        address deployer
    ) internal {
        vm.startBroadcast();
        
        // Initialize modules
        patientModule.initialize(address(registrationContract));
        organizationModule.initialize(address(registrationContract));
        adminModule.initialize(address(registrationContract));
        
        // Authorize modules in storage
        storageContract.authorizeModule(address(patientModule));
        storageContract.authorizeModule(address(organizationModule));
        storageContract.authorizeModule(address(adminModule));
        storageContract.authorizeModule(address(registrationContract));
        
        // Set up initial owner (deployer) before transferring ownership
        storageContract.setOwner(deployer, true);
        storageContract.setActiveUser(deployer, true);
        storageContract.setAdmin(deployer, true);
        storageContract.setRole(deployer, RegistrationStorage.Role.Admin);
        storageContract.setVerified(deployer, true);
        storageContract.setRegistrationTimestamp(deployer, block.timestamp);
        
        // Transfer storage ownership to registration contract
        storageContract.transferOwnership(address(registrationContract));
        
        vm.stopBroadcast();
    }
    
    function _testFunctionality(
        RegistrationContract registrationContract,
        RegistrationStorage storageContract,
        PatientModule patientModule,
        OrganizationModule organizationModule,
        AdminModule adminModule,
        address deployer
    ) internal view {
        // Verify deployer is owner and admin
        require(registrationContract.isOwner(deployer), "Deployer not set as owner");
        require(registrationContract.admins(deployer), "Deployer not set as admin");
        console.log("[SUCCESS] Deployer ownership and admin status verified");
        
        // Verify modules are initialized
        require(patientModule.core() == address(registrationContract), "PatientModule not initialized");
        require(organizationModule.core() == address(registrationContract), "OrganizationModule not initialized");
        require(adminModule.core() == address(registrationContract), "AdminModule not initialized");
        console.log("[SUCCESS] All modules properly initialized");
        
        // Verify storage authorization
        require(storageContract.authorizedModules(address(patientModule)), "PatientModule not authorized");
        require(storageContract.authorizedModules(address(organizationModule)), "OrganizationModule not authorized");
        require(storageContract.authorizedModules(address(adminModule)), "AdminModule not authorized");
        require(storageContract.authorizedModules(address(registrationContract)), "RegistrationContract not authorized");
        console.log("[SUCCESS] All modules properly authorized in storage");
    }
    
    function _saveDeploymentInfo(
        address registrationContract,
        address storageContract,
        address patientModule,
        address organizationModule,
        address adminModule,
        address emailDomainProver,
        address deployer
    ) internal {
        // Generate JSON in parts to avoid stack too deep
        string memory part1 = string(abi.encodePacked(
            '{\n',
            '  "chainId": ', vm.toString(block.chainid), ',\n',
            '  "deployer": "', vm.toString(deployer), '",\n',
            '  "emailDomainProver": "', vm.toString(emailDomainProver), '",\n'
        ));
        
        string memory part2 = string(abi.encodePacked(
            '  "registrationContract": "', vm.toString(registrationContract), '",\n',
            '  "registrationStorage": "', vm.toString(storageContract), '",\n',
            '  "patientModule": "', vm.toString(patientModule), '",\n'
        ));
        
        string memory part3 = string(abi.encodePacked(
            '  "organizationModule": "', vm.toString(organizationModule), '",\n',
            '  "adminModule": "', vm.toString(adminModule), '",\n',
            '  "timestamp": ', vm.toString(block.timestamp), '\n',
            '}'
        ));
        
        string memory json = string(abi.encodePacked(part1, part2, part3));
        
        // Write to file (Note: This requires write permissions)
        try vm.writeFile("deployments/local.json", json) {
            console.log("[SUCCESS] Deployment info saved to deployments/local.json");
        } catch {
            console.log("[WARNING] Could not write to deployments/local.json (check permissions)");
            console.log("Deployment JSON:");
            console.log(json);
        }
    }
} 
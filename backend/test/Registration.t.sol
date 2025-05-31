// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/zkMed/RegistrationContract.sol";
import "../src/zkMed/modules/RegistrationStorage.sol";
import "../src/zkMed/modules/PatientModule.sol";
import "../src/zkMed/modules/OrganizationModule.sol";
import "../src/zkMed/modules/AdminModule.sol";
import "../src/zkMed/EmailDomainProver.sol";

contract RegistrationContractTest is Test {
    
    EmailDomainProver emailDomainProver;
    RegistrationStorage storageContract;
    PatientModule patientModule;
    OrganizationModule organizationModule;
    AdminModule adminModule;
    RegistrationContract registrationContract;
    
    // Test addresses
    address patient = address(0x1);
    address hospital = address(0x2);
    address insurer = address(0x3);
    address admin = address(0x4);
    address deployer = address(this);
    
    function setUp() public {
        // Deploy EmailDomainProver first
        emailDomainProver = new EmailDomainProver();
        
        // Deploy RegistrationStorage
        storageContract = new RegistrationStorage();
        
        // Deploy modules
        patientModule = new PatientModule(address(storageContract));
        organizationModule = new OrganizationModule(address(storageContract), address(emailDomainProver));
        adminModule = new AdminModule(address(storageContract));
        
        // Deploy main registration contract with module addresses
        registrationContract = new RegistrationContract(
            address(emailDomainProver),
            address(storageContract),
            address(patientModule),
            address(organizationModule),
            address(adminModule)
        );
        
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
        
        // ALSO set the RegistrationContract as an owner since modules check for this
        storageContract.setOwner(address(registrationContract), true);
        storageContract.setAdmin(address(registrationContract), true);
        
        // Transfer storage ownership to registration contract
        storageContract.transferOwnership(address(registrationContract));
        
        // IMPORTANT: Now that storage is owned by registration contract, 
        // we need to set up the deployer in the registration contract itself
        // The registration contract should now manage the storage and set up initial admin
        
        // At this point, the registration contract owns the storage, 
        // but we need to initialize the deployer as admin in the registration contract's view
        // This should happen automatically via the storage state we set up above
        
        console.log("=== DEPLOYED SYSTEM ===");
        console.log("EmailDomainProver:     ", address(emailDomainProver));
        console.log("RegistrationStorage:   ", address(storageContract));
        console.log("PatientModule:         ", address(patientModule));
        console.log("OrganizationModule:    ", address(organizationModule));
        console.log("AdminModule:           ", address(adminModule));
        console.log("RegistrationContract:  ", address(registrationContract));
        
        // Verify the deployer setup worked
        console.log("Deployer in storage - owner:", storageContract.owners(deployer));
        console.log("Deployer in storage - admin:", storageContract.admins(deployer));
        console.log("Deployer via contract - owner:", registrationContract.isOwner(deployer));
        console.log("Deployer via contract - admin:", registrationContract.admins(deployer));
    }
    
    function testModuleDeployment() public {
        // Verify all contracts were deployed
        assertTrue(address(emailDomainProver) != address(0), "EmailDomainProver not deployed");
        assertTrue(address(storageContract) != address(0), "RegistrationStorage not deployed");
        assertTrue(address(patientModule) != address(0), "PatientModule not deployed");
        assertTrue(address(organizationModule) != address(0), "OrganizationModule not deployed");
        assertTrue(address(adminModule) != address(0), "AdminModule not deployed");
        assertTrue(address(registrationContract) != address(0), "RegistrationContract not deployed");
        
        // Verify contracts have code
        assertTrue(address(registrationContract).code.length > 0, "RegistrationContract has no code");
        assertTrue(address(storageContract).code.length > 0, "RegistrationStorage has no code");
        assertTrue(address(patientModule).code.length > 0, "PatientModule has no code");
        assertTrue(address(organizationModule).code.length > 0, "OrganizationModule has no code");
        assertTrue(address(adminModule).code.length > 0, "AdminModule has no code");
    }
    
    function testModuleInitialization() public {
        // Verify modules are properly initialized
        assertEq(patientModule.core(), address(registrationContract), "PatientModule not initialized");
        assertEq(organizationModule.core(), address(registrationContract), "OrganizationModule not initialized");
        assertEq(adminModule.core(), address(registrationContract), "AdminModule not initialized");
    }
    
    function testStorageAuthorization() public {
        // Verify modules are authorized in storage
        assertTrue(storageContract.authorizedModules(address(patientModule)), "PatientModule not authorized");
        assertTrue(storageContract.authorizedModules(address(organizationModule)), "OrganizationModule not authorized");
        assertTrue(storageContract.authorizedModules(address(adminModule)), "AdminModule not authorized");
        assertTrue(storageContract.authorizedModules(address(registrationContract)), "RegistrationContract not authorized");
    }
    
    function testOwnershipSetup() public {
        // Verify initial owner setup
        assertEq(storageContract.owner(), address(registrationContract), "Storage ownership not transferred");
        assertTrue(registrationContract.isOwner(deployer), "Deployer not set as owner");
        assertTrue(registrationContract.admins(deployer), "Deployer not set as admin");
        assertEq(uint256(registrationContract.roles(deployer)), uint256(RegistrationContract.Role.Admin), "Deployer role not set");
    }
    
    function testPatientRegistration() public {
        vm.startPrank(patient);
        
        bytes32 commitment = keccak256(abi.encodePacked("secret", patient));
        
        // Register patient
        registrationContract.registerPatient(commitment);
        
        // Verify registration
        assertEq(uint256(registrationContract.roles(patient)), uint256(RegistrationContract.Role.Patient), "Patient role not set");
        assertTrue(registrationContract.isUserVerified(patient), "Patient not verified");
        assertTrue(registrationContract.isUserActive(patient), "Patient not active");
        
        // Verify commitment
        assertTrue(registrationContract.verifyPatientCommitment("secret"), "Commitment verification failed");
        assertFalse(registrationContract.verifyPatientCommitment("wrong_secret"), "Wrong commitment should fail");
        
        // Check storage state
        assertEq(uint256(storageContract.roles(patient)), uint256(RegistrationStorage.Role.Patient), "Storage role not set");
        assertEq(storageContract.patientCommitments(patient), commitment, "Commitment not stored");
        
        vm.stopPrank();
    }
    
    function testAdminFunctions() public {
        // Register a patient first
        vm.prank(patient);
        registrationContract.registerPatient(keccak256(abi.encodePacked("secret", patient)));
        
        vm.startPrank(deployer);
        
        // Test user deactivation
        registrationContract.deactivateUser(patient);
        assertFalse(registrationContract.isUserActive(patient), "User should be deactivated");
        
        // Test user reactivation
        registrationContract.activateUser(patient);
        assertTrue(registrationContract.isUserActive(patient), "User should be reactivated");
        
        // Test adding new admin
        registrationContract.addAdmin(admin);
        assertTrue(registrationContract.admins(admin), "Admin should be added");
        
        // Test adding new owner
        registrationContract.addOwner(hospital);
        assertTrue(registrationContract.isOwner(hospital), "Owner should be added");
        
        vm.stopPrank();
    }
    
    function testBatchOperations() public {
        // Register multiple patients
        address[] memory patients = new address[](3);
        patients[0] = address(0x10);
        patients[1] = address(0x11);
        patients[2] = address(0x12);
        
        for (uint i = 0; i < patients.length; i++) {
            vm.prank(patients[i]);
            registrationContract.registerPatient(keccak256(abi.encodePacked("secret", patients[i])));
        }
        
        vm.startPrank(deployer);
        
        // Test batch deactivation
        registrationContract.batchDeactivateUsers(patients);
        for (uint i = 0; i < patients.length; i++) {
            assertFalse(registrationContract.isUserActive(patients[i]), "User should be deactivated");
        }
        
        // Test batch reactivation
        registrationContract.batchActivateUsers(patients);
        for (uint i = 0; i < patients.length; i++) {
            assertTrue(registrationContract.isUserActive(patients[i]), "User should be reactivated");
        }
        
        vm.stopPrank();
    }
    
    function testViewFunctions() public {
        // Register a patient
        vm.prank(patient);
        registrationContract.registerPatient(keccak256(abi.encodePacked("secret", patient)));
        
        // Test getUserRegistration
        (
            RegistrationContract.Role role,
            bool isVerified,
            uint256 timestamp,
            string memory orgName,
            string memory domain
        ) = registrationContract.getUserRegistration(patient);
        
        assertEq(uint256(role), uint256(RegistrationContract.Role.Patient), "Wrong role returned");
        assertTrue(isVerified, "Should be verified");
        assertTrue(timestamp > 0, "Timestamp should be set");
        assertEq(bytes(orgName).length, 0, "Patient should have no org name");
        assertEq(bytes(domain).length, 0, "Patient should have no domain");
        
        // Test other view functions
        assertTrue(registrationContract.isUserVerified(patient), "isUserVerified should return true");
        assertTrue(registrationContract.isUserActive(patient), "isUserActive should return true");
        
        address[] memory owners = registrationContract.getOwners();
        assertTrue(owners.length > 0, "Should have owners");
        assertEq(owners[0], deployer, "First owner should be deployer");
    }
    
    function testCompatibilityMappings() public {
        // Test that all compatibility mappings work
        assertTrue(registrationContract.owners(deployer), "owners mapping should work");
        assertTrue(registrationContract.admins(deployer), "admins mapping should work");
        assertEq(registrationContract.admin(), registrationContract.owner(), "admin should equal owner");
        
        // Register a patient and test mappings
        vm.prank(patient);
        registrationContract.registerPatient(keccak256(abi.encodePacked("secret", patient)));
        
        assertEq(uint256(registrationContract.roles(patient)), uint256(RegistrationContract.Role.Patient), "roles mapping should work");
        assertTrue(registrationContract.verified(patient), "verified mapping should work");
        assertTrue(registrationContract.activeUsers(patient), "activeUsers mapping should work");
        assertTrue(registrationContract.registrationTimestamps(patient) > 0, "registrationTimestamps should work");
        assertTrue(registrationContract.patientCommitments(patient) != bytes32(0), "patientCommitments should work");
    }
    
    function testBytecodeSize() public {
        // Verify all contracts are under size limits
        uint256 registrationSize = address(registrationContract).code.length;
        uint256 storageSize = address(storageContract).code.length;
        uint256 patientSize = address(patientModule).code.length;
        uint256 orgSize = address(organizationModule).code.length;
        uint256 adminSize = address(adminModule).code.length;
        
        console.log("=== CONTRACT SIZES ===");
        console.log("RegistrationContract:", registrationSize);
        console.log("RegistrationStorage: ", storageSize);
        console.log("PatientModule:       ", patientSize);
        console.log("OrganizationModule:  ", orgSize);
        console.log("AdminModule:         ", adminSize);
        
        // Runtime size limit is 24,576 bytes (EIP-170)
        assertTrue(registrationSize <= 24576, "RegistrationContract too large");
        assertTrue(storageSize <= 24576, "RegistrationStorage too large");
        assertTrue(patientSize <= 24576, "PatientModule too large");
        assertTrue(orgSize <= 24576, "OrganizationModule too large");
        assertTrue(adminSize <= 24576, "AdminModule too large");
        
        // Log success
        console.log("All contracts within size limits!");
    }
    
    function testMultipleDeployments() public {
        // Deploy a second independent system
        RegistrationStorage storageContract2 = new RegistrationStorage();
        PatientModule patientModule2 = new PatientModule(address(storageContract2));
        OrganizationModule organizationModule2 = new OrganizationModule(address(storageContract2), address(emailDomainProver));
        AdminModule adminModule2 = new AdminModule(address(storageContract2));
        
        RegistrationContract registrationContract2 = new RegistrationContract(
            address(emailDomainProver),
            address(storageContract2),
            address(patientModule2),
            address(organizationModule2),
            address(adminModule2)
        );
        
        // Initialize second system
        patientModule2.initialize(address(registrationContract2));
        organizationModule2.initialize(address(registrationContract2));
        adminModule2.initialize(address(registrationContract2));
        
        storageContract2.authorizeModule(address(patientModule2));
        storageContract2.authorizeModule(address(organizationModule2));
        storageContract2.authorizeModule(address(adminModule2));
        storageContract2.authorizeModule(address(registrationContract2));
        
        storageContract2.setOwner(deployer, true);
        storageContract2.setActiveUser(deployer, true);
        storageContract2.setAdmin(deployer, true);
        storageContract2.setRole(deployer, RegistrationStorage.Role.Admin);
        storageContract2.setVerified(deployer, true);
        storageContract2.setRegistrationTimestamp(deployer, block.timestamp);
        
        storageContract2.transferOwnership(address(registrationContract2));
        
        // Verify systems are independent
        assertTrue(address(registrationContract) != address(registrationContract2), "Systems should be independent");
        assertTrue(address(storageContract) != address(storageContract2), "Storage should be independent");
        assertTrue(address(patientModule) != address(patientModule2), "Modules should be independent");
        
        // Verify both systems work
        vm.prank(patient);
        registrationContract.registerPatient(keccak256(abi.encodePacked("secret1", patient)));
        
        vm.prank(hospital);
        registrationContract2.registerPatient(keccak256(abi.encodePacked("secret2", hospital)));
        
        // Verify registrations are isolated
        assertEq(uint256(registrationContract.roles(patient)), uint256(RegistrationContract.Role.Patient), "Patient should be registered in system1");
        assertEq(uint256(registrationContract.roles(hospital)), uint256(RegistrationContract.Role.None), "Hospital should not be registered in system1");
        
        assertEq(uint256(registrationContract2.roles(hospital)), uint256(RegistrationContract.Role.Patient), "Hospital should be registered in system2");
        assertEq(uint256(registrationContract2.roles(patient)), uint256(RegistrationContract.Role.None), "Patient should not be registered in system2");
    }
} 
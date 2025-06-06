// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../src/zkMed/HealthSystemWebProofProver.sol";
import "../src/zkMed/HealthSystemWebProofVerifier.sol";
import "../src/zkMed/RegistrationContract.sol";
import "../src/zkMed/modules/RegistrationStorage.sol";
import "../src/zkMed/modules/PatientModule.sol";
import "../src/zkMed/modules/OrganizationModule.sol";
import "../src/zkMed/modules/AdminModule.sol";
import "../src/zkMed/EmailDomainProver.sol";

/// @title ItalianHealthWebProofTest
/// @notice Test suite for Italian health system WebProof integration
contract ItalianHealthWebProofTest is Test {
    
    // Contract instances
    HealthSystemWebProofProver public healthProver;
    HealthSystemWebProofVerifier public healthVerifier;
    RegistrationContract public registrationContract;
    RegistrationStorage public registrationStorage;
    PatientModule public patientModule;
    OrganizationModule public organizationModule;
    AdminModule public adminModule;
    address public emailDomainProver;
    
    // Test accounts
    address public deployer;
    address public patient1;
    address public patient2;
    address public owner1;
    address public owner2;
    
    // Test data based on the provided Italian health system response
    string constant PATIENT_ID_1 = "ASUR0000000006779428";
    string constant TAX_CODE_1 = "PZZPRJ04L01H501I";
    string constant REGIONAL_CODE_1 = "280002457";
    string constant HOME_ASL_1 = "ROMA6";
    string constant MMG_TAX_CODE_1 = "PMLSFN66B43H501L";
    
    string constant PATIENT_ID_2 = "ASUR0000000006779429";
    string constant TAX_CODE_2 = "RSSMRA85M15H501X";
    string constant REGIONAL_CODE_2 = "280002458";
    string constant HOME_ASL_2 = "ROMA5";
    
    // Events to test
    event ItalianPatientVerified(
        address indexed patient,
        string patientId,
        bytes32 taxCodeHash,
        string regionalCode,
        string homeAsl,
        uint256 timestamp
    );
    
    event PatientRegisteredWithWebProof(
        address indexed patient,
        string patientId,
        string homeAsl
    );
    
    function setUp() public {
        // Set up test accounts
        deployer = address(this);
        patient1 = makeAddr("patient1");
        patient2 = makeAddr("patient2");
        owner1 = makeAddr("owner1");
        owner2 = makeAddr("owner2");
        
        // Deploy contracts
        deployContracts();
        
        // Initialize contracts
        initializeContracts();
    }
    
    function deployContracts() internal {
        // Deploy storage
        registrationStorage = new RegistrationStorage();
        
        // Deploy EmailDomainProver first (required for OrganizationModule)
        emailDomainProver = address(new EmailDomainProver());
        
        // Deploy modules
        patientModule = new PatientModule(address(registrationStorage));
        
        // Deploy other required modules for RegistrationContract
        organizationModule = new OrganizationModule(address(registrationStorage), emailDomainProver);
        adminModule = new AdminModule(address(registrationStorage));
        
        // Deploy registration contract with all required parameters
        registrationContract = new RegistrationContract(
            emailDomainProver,
            address(registrationStorage),
            address(patientModule),
            address(organizationModule),
            address(adminModule)
        );
        
        // Deploy health proof contracts
        healthProver = new HealthSystemWebProofProver();
        healthVerifier = new HealthSystemWebProofVerifier(
            address(healthProver),
            address(registrationContract)
        );
    }
    
    function initializeContracts() internal {
        // Initialize modules
        patientModule.initialize(address(registrationContract));
        
        // Initialize ALL modules (this was missing!)
        organizationModule.initialize(address(registrationContract));
        adminModule.initialize(address(registrationContract));
        
        // Authorize modules in storage
        registrationStorage.authorizeModule(address(patientModule));
        registrationStorage.authorizeModule(address(organizationModule));
        registrationStorage.authorizeModule(address(adminModule));
        registrationStorage.authorizeModule(address(registrationContract));
        
        // Set up initial owner (deployer) before transferring ownership
        registrationStorage.setOwner(deployer, true);
        registrationStorage.setActiveUser(deployer, true);
        registrationStorage.setAdmin(deployer, true);
        registrationStorage.setRole(deployer, RegistrationStorage.Role.Admin);
        registrationStorage.setVerified(deployer, true);
        registrationStorage.setRegistrationTimestamp(deployer, block.timestamp);
        
        // ALSO set the RegistrationContract as an owner since modules check for this
        registrationStorage.setOwner(address(registrationContract), true);
        registrationStorage.setAdmin(address(registrationContract), true);
        
        // Transfer storage ownership to registration contract
        registrationStorage.transferOwnership(address(registrationContract));
        
        // Now the deployer should be able to add owners since it's in the owners mapping
        // Add test owners through the registration contract
        vm.prank(deployer);
        registrationContract.addOwner(owner1);
        
        vm.prank(deployer);
        registrationContract.addOwner(owner2);
        
        // Set up authorization for the health verifier to register patients
        // The health verifier needs to be able to call registerPatientWithWebProof
        vm.prank(deployer);
        registrationStorage.setOwner(address(healthVerifier), true);
    }
    
    // ============ HELPER FUNCTIONS ============
    
    function generateTaxCodeHash(string memory taxCode) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(taxCode));
    }
    
    function generateCommitment(string memory taxCode, address patient) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(taxCode, patient));
    }
    
    function createVerifiedPatientData(
        string memory patientId,
        string memory taxCode,
        string memory regionalCode,
        string memory homeAsl
    ) internal view returns (HealthSystemWebProofProver.VerifiedPatientData memory) {
        return HealthSystemWebProofProver.VerifiedPatientData({
            patientId: patientId,
            taxCodeHash: generateTaxCodeHash(taxCode),
            regionalCode: regionalCode,
            homeAsl: homeAsl,
            mmgTaxCodeHash: generateTaxCodeHash(MMG_TAX_CODE_1),
            timestamp: block.timestamp
        });
    }
    
    // ============ BASIC FUNCTIONALITY TESTS ============
    
    function testHealthProverContract() public {
        // Test basic prover contract functionality
        assertEq(
            healthProver.SALUTE_LAZIO_PROFILE_URL(),
            "https://www.salutelazio.it/group/guest/profilo-utente"
        );
    }
    
    function testHealthVerifierContract() public {
        // Test basic verifier contract setup
        assertEq(healthVerifier.prover(), address(healthProver));
        assertEq(address(healthVerifier.registrationContract()), address(registrationContract));
        assertFalse(healthVerifier.verifiedItalianPatients(patient1));
    }
    
    function testGenerateCommitment() public {
        bytes32 commitment1 = healthProver.generateCommitment(TAX_CODE_1, patient1);
        bytes32 commitment2 = healthProver.generateCommitment(TAX_CODE_2, patient2);
        bytes32 commitment3 = healthProver.generateCommitment(TAX_CODE_1, patient2); // Same tax code, different address
        
        // Different tax codes should produce different commitments
        assertNotEq(commitment1, commitment2);
        
        // Same tax code with different addresses should produce different commitments
        assertNotEq(commitment1, commitment3);
        
        // Same inputs should produce same commitment
        bytes32 commitment1Duplicate = healthProver.generateCommitment(TAX_CODE_1, patient1);
        assertEq(commitment1, commitment1Duplicate);
    }
    
    // ============ WEBPROOF VERIFICATION TESTS ============
    
    function testPatientRegistrationWithWebProof() public {
        // Create test data
        bytes32 commitment = generateCommitment(TAX_CODE_1, patient1);
        bytes32 taxCodeHash = generateTaxCodeHash(TAX_CODE_1);
        
        // Mock the verification process by calling the registration function directly
        // In a real scenario, this would be called by the verifier after validating the WebProof
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment,
            PATIENT_ID_1,
            taxCodeHash,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
        
        // Verify patient is registered
        assertEq(uint8(registrationContract.roles(patient1)), uint8(RegistrationStorage.Role.Patient));
        assertTrue(registrationContract.verified(patient1));
        assertTrue(registrationContract.activeUsers(patient1));
        
        // Verify Italian health data is stored
        assertTrue(patientModule.hasItalianHealthVerification(patient1));
        
        (
            string memory storedPatientId,
            bytes32 storedTaxCodeHash,
            string memory storedRegionalCode,
            string memory storedHomeAsl,
            uint256 verificationTimestamp
        ) = patientModule.getItalianHealthData(patient1);
        
        assertEq(storedPatientId, PATIENT_ID_1);
        assertEq(storedTaxCodeHash, taxCodeHash);
        assertEq(storedRegionalCode, REGIONAL_CODE_1);
        assertEq(storedHomeAsl, HOME_ASL_1);
        assertGt(verificationTimestamp, 0);
    }
    
    function testPatientLookupFunctions() public {
        // Register a patient first
        bytes32 commitment = generateCommitment(TAX_CODE_1, patient1);
        bytes32 taxCodeHash = generateTaxCodeHash(TAX_CODE_1);
        
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment,
            PATIENT_ID_1,
            taxCodeHash,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
        
        // Test lookup by patient ID
        address foundByPatientId = patientModule.getPatientByHealthId(PATIENT_ID_1);
        assertEq(foundByPatientId, patient1);
        
        // Test lookup by tax code hash
        address foundByTaxCode = patientModule.getPatientByTaxCodeHash(taxCodeHash);
        assertEq(foundByTaxCode, patient1);
        
        // Test non-existent lookups
        address notFound1 = patientModule.getPatientByHealthId("NONEXISTENT");
        address notFound2 = patientModule.getPatientByTaxCodeHash(bytes32(0));
        assertEq(notFound1, address(0));
        assertEq(notFound2, address(0));
    }
    
    function testDuplicateRegistrationPrevention() public {
        bytes32 commitment1 = generateCommitment(TAX_CODE_1, patient1);
        bytes32 taxCodeHash = generateTaxCodeHash(TAX_CODE_1);
        
        // Register patient1
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment1,
            PATIENT_ID_1,
            taxCodeHash,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
        
        // Try to register with same patient ID - should fail
        bytes32 commitment2 = generateCommitment(TAX_CODE_2, patient2);
        vm.prank(address(healthVerifier));
        vm.expectRevert("Patient ID already used");
        registrationContract.registerPatientWithWebProof(
            patient2,
            commitment2,
            PATIENT_ID_1, // Same patient ID
            generateTaxCodeHash(TAX_CODE_2),
            REGIONAL_CODE_2,
            HOME_ASL_2
        );
        
        // Try to register with same tax code - should fail
        vm.prank(address(healthVerifier));
        vm.expectRevert("Tax code already used");
        registrationContract.registerPatientWithWebProof(
            patient2,
            commitment2,
            PATIENT_ID_2,
            taxCodeHash, // Same tax code hash
            REGIONAL_CODE_2,
            HOME_ASL_2
        );
    }
    
    // ============ ENHANCED PATIENT MODULE TESTS ============
    
    function testUploadEncryptedEHR() public {
        // Register patient first
        bytes32 commitment = generateCommitment(TAX_CODE_1, patient1);
        bytes32 taxCodeHash = generateTaxCodeHash(TAX_CODE_1);
        
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment,
            PATIENT_ID_1,
            taxCodeHash,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
        
        // Test EHR upload
        string memory ipfsCid = "QmTzQ1JRkWErjCTWJZxxVAktdNyNDtPCabyW9xREEZK9FQ";
        bytes memory preKey = abi.encodePacked("test-pre-encryption-key");
        
        vm.prank(patient1);
        vm.expectEmit(true, true, false, true);
        emit PatientModule.EHRUploaded(patient1, ipfsCid, block.timestamp);
        patientModule.uploadEncryptedEHR(ipfsCid, preKey);
    }
    
    function testProposeOperation() public {
        // Register patient first
        bytes32 commitment = generateCommitment(TAX_CODE_1, patient1);
        bytes32 taxCodeHash = generateTaxCodeHash(TAX_CODE_1);
        
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment,
            PATIENT_ID_1,
            taxCodeHash,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
        
        // Test operation proposal
        bytes memory webProof = abi.encodePacked("mock-webproof-data");
        bytes32 procedureHash = keccak256(abi.encodePacked("HIP-REPLACEMENT-001"));
        uint256 estimatedCost = 15000 * 1e6; // 15,000 USDC
        
        vm.prank(patient1);
        vm.expectEmit(true, true, false, true);
        emit PatientModule.OperationProposed(patient1, procedureHash, estimatedCost, block.timestamp);
        patientModule.proposeOperation(webProof, procedureHash, estimatedCost);
    }
    
    // ============ ACCESS CONTROL TESTS ============
    
    function testOnlyVerifierCanRegister() public {
        bytes32 commitment = generateCommitment(TAX_CODE_1, patient1);
        bytes32 taxCodeHash = generateTaxCodeHash(TAX_CODE_1);
        
        // Non-verifier should not be able to register patients
        vm.prank(patient1);
        vm.expectRevert("Not an owner"); // Should revert due to onlyOwners modifier
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment,
            PATIENT_ID_1,
            taxCodeHash,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
    }
    
    function testUnregisteredPatientCannotUseFeatures() public {
        string memory ipfsCid = "QmTzQ1JRkWErjCTWJZxxVAktdNyNDtPCabyW9xREEZK9FQ";
        bytes memory preKey = abi.encodePacked("test-pre-encryption-key");
        
        // Unregistered patient should not be able to upload EHR
        vm.prank(patient1);
        vm.expectRevert("Not a registered patient");
        patientModule.uploadEncryptedEHR(ipfsCid, preKey);
        
        // Unregistered patient should not be able to propose operations
        bytes memory webProof = abi.encodePacked("mock-webproof-data");
        bytes32 procedureHash = keccak256(abi.encodePacked("HIP-REPLACEMENT-001"));
        uint256 estimatedCost = 15000 * 1e6;
        
        vm.prank(patient1);
        vm.expectRevert("Not a registered patient");
        patientModule.proposeOperation(webProof, procedureHash, estimatedCost);
    }
    
    // ============ INTEGRATION TESTS ============
    
    function testFullItalianPatientFlow() public {
        // 1. Create commitment and verification data
        bytes32 commitment = generateCommitment(TAX_CODE_1, patient1);
        HealthSystemWebProofProver.VerifiedPatientData memory verifiedData = createVerifiedPatientData(
            PATIENT_ID_1,
            TAX_CODE_1,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
        
        // 2. Simulate WebProof verification and registration
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment,
            verifiedData.patientId,
            verifiedData.taxCodeHash,
            verifiedData.regionalCode,
            verifiedData.homeAsl
        );
        
        // 3. Verify patient can use system features
        assertTrue(patientModule.hasItalianHealthVerification(patient1));
        assertEq(uint8(registrationContract.roles(patient1)), uint8(RegistrationStorage.Role.Patient));
        
        // 4. Test EHR upload
        string memory ipfsCid = "QmTzQ1JRkWErjCTWJZxxVAktdNyNDtPCabyW9xREEZK9FQ";
        bytes memory preKey = abi.encodePacked("test-pre-encryption-key");
        
        vm.prank(patient1);
        patientModule.uploadEncryptedEHR(ipfsCid, preKey);
        
        // 5. Test operation proposal
        bytes memory webProof = abi.encodePacked("mock-webproof-data");
        bytes32 procedureHash = keccak256(abi.encodePacked("HIP-REPLACEMENT-001"));
        uint256 estimatedCost = 15000 * 1e6;
        
        vm.prank(patient1);
        patientModule.proposeOperation(webProof, procedureHash, estimatedCost);
        
        // Verify all data is correctly stored and accessible
        (
            string memory storedPatientId,
            bytes32 storedTaxCodeHash,
            string memory storedRegionalCode,
            string memory storedHomeAsl,
            uint256 verificationTimestamp
        ) = patientModule.getItalianHealthData(patient1);
        
        assertEq(storedPatientId, PATIENT_ID_1);
        assertEq(storedTaxCodeHash, verifiedData.taxCodeHash);
        assertEq(storedRegionalCode, REGIONAL_CODE_1);
        assertEq(storedHomeAsl, HOME_ASL_1);
        assertGt(verificationTimestamp, 0);
    }
    
    function testMultiplePatientRegistrations() public {
        // Register first patient
        bytes32 commitment1 = generateCommitment(TAX_CODE_1, patient1);
        bytes32 taxCodeHash1 = generateTaxCodeHash(TAX_CODE_1);
        
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient1,
            commitment1,
            PATIENT_ID_1,
            taxCodeHash1,
            REGIONAL_CODE_1,
            HOME_ASL_1
        );
        
        // Register second patient
        bytes32 commitment2 = generateCommitment(TAX_CODE_2, patient2);
        bytes32 taxCodeHash2 = generateTaxCodeHash(TAX_CODE_2);
        
        vm.prank(address(healthVerifier));
        registrationContract.registerPatientWithWebProof(
            patient2,
            commitment2,
            PATIENT_ID_2,
            taxCodeHash2,
            REGIONAL_CODE_2,
            HOME_ASL_2
        );
        
        // Verify both patients are registered correctly
        assertTrue(patientModule.hasItalianHealthVerification(patient1));
        assertTrue(patientModule.hasItalianHealthVerification(patient2));
        
        // Verify lookup functions work for both
        assertEq(patientModule.getPatientByHealthId(PATIENT_ID_1), patient1);
        assertEq(patientModule.getPatientByHealthId(PATIENT_ID_2), patient2);
        assertEq(patientModule.getPatientByTaxCodeHash(taxCodeHash1), patient1);
        assertEq(patientModule.getPatientByTaxCodeHash(taxCodeHash2), patient2);
    }
} 
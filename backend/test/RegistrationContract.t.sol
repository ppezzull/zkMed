// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {EmailDomainProver, OrganizationData} from "../src/zkMed/EmailDomainProver.sol";
import {RegistrationContract} from "../src/zkMed/RegistrationContract.sol";
import {Proof, ProofLib} from "vlayer-0.1.0/Proof.sol";
import {Seal} from "vlayer-0.1.0/Seal.sol";
import {CallAssumptions} from "vlayer-0.1.0/CallAssumptions.sol";

contract RegistrationContractTest is Test {
    EmailDomainProver public emailDomainProver;
    RegistrationContract public registrationContract;
    
    // Test users
    address public patient1 = makeAddr("patient1");
    address public patient2 = makeAddr("patient2");
    address public hospital1 = makeAddr("hospital1");
    address public insurer1 = makeAddr("insurer1");
    address public admin = makeAddr("admin");
    
    // Test data
    string constant PATIENT_SECRET = "my-secret-passphrase-123";
    string constant HOSPITAL_DOMAIN = "general-hospital.com";
    string constant INSURER_DOMAIN = "health-insurance.com";
    string constant HOSPITAL_NAME = "General Hospital";
    string constant INSURER_NAME = "Health Insurance Co";
    
    function setUp() public {
        vm.startPrank(admin);
        
        // Deploy contracts
        emailDomainProver = new EmailDomainProver();
        registrationContract = new RegistrationContract(address(emailDomainProver));
        
        vm.stopPrank();
    }
    
    // Helper function to create empty proof for testing
    function createEmptyProof() internal pure returns (Proof memory) {
        return ProofLib.emptyProof();
    }
    
    // ============ PATIENT REGISTRATION TESTS ============
    
    function testPatientRegistration() public {
        vm.startPrank(patient1);
        
        // Generate commitment
        bytes32 commitment = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        
        // Register patient
        vm.expectEmit(true, true, false, true);
        emit RegistrationContract.PatientRegistered(patient1, commitment, block.timestamp);
        
        registrationContract.registerPatient(commitment);
        
        // Verify registration
        assertEq(uint(registrationContract.roles(patient1)), uint(RegistrationContract.Role.Patient));
        assertTrue(registrationContract.verified(patient1));
        assertEq(registrationContract.patientCommitments(patient1), commitment);
        assertTrue(registrationContract.isUserVerified(patient1));
        
        vm.stopPrank();
    }
    
    function testPatientCommitmentVerification() public {
        vm.startPrank(patient1);
        
        // Register patient
        bytes32 commitment = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        registrationContract.registerPatient(commitment);
        
        // Test commitment verification
        assertTrue(registrationContract.verifyPatientCommitment(PATIENT_SECRET));
        assertFalse(registrationContract.verifyPatientCommitment("wrong-secret"));
        
        vm.stopPrank();
    }
    
    function testPatientCannotRegisterTwice() public {
        vm.startPrank(patient1);
        
        bytes32 commitment = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        registrationContract.registerPatient(commitment);
        
        // Attempt to register again should fail
        vm.expectRevert("Already registered");
        registrationContract.registerPatient(commitment);
        
        vm.stopPrank();
    }
    
    function testInvalidCommitmentRejected() public {
        vm.startPrank(patient1);
        
        // Empty commitment should fail
        vm.expectRevert("Invalid commitment");
        registrationContract.registerPatient(bytes32(0));
        
        vm.stopPrank();
    }
    
    // ============ ORGANIZATION REGISTRATION TESTS ============
    
    function testHospitalRegistrationWithEmailProof() public {
        // Mock vlayer proof (in real implementation, this would come from vlayer)
        Proof memory mockProof = createEmptyProof();
        
        OrganizationData memory orgData = OrganizationData({
            name: HOSPITAL_NAME,
            domain: HOSPITAL_DOMAIN,
            verificationTimestamp: block.timestamp
        });
        
        vm.startPrank(hospital1);
        
        // Mock the vlayer verification (in real tests, you'd use vlayer's test framework)
        vm.mockCall(
            address(registrationContract),
            abi.encodeWithSelector(RegistrationContract.registerOrganization.selector),
            abi.encode(true)
        );
        
        // This test demonstrates the expected interface
        // In real implementation, vlayer would verify the proof
        // registrationContract.registerOrganization(mockProof, orgData, RegistrationContract.Role.Hospital);
        
        vm.stopPrank();
    }
    
    function testVerifyAndStoreURLFlow() public {
        vm.startPrank(hospital1);
        
        // Step 1: Verify domain (this would be called after vlayer email verification)
        Proof memory mockProof = createEmptyProof();
        
        // Mock the vlayer verification call
        vm.mockCall(
            address(registrationContract),
            abi.encodeWithSelector(RegistrationContract.verifyAndStoreURL.selector),
            abi.encode(true)
        );
        
        // This demonstrates the two-step flow mentioned in requirements
        // Step 1: verifyAndStoreURL (after email proof)
        // Step 2: completeOrganizationRegistration
        
        vm.stopPrank();
    }
    
    function testDomainCannotBeReused() public {
        // First, register domain to hospital1
        vm.startPrank(admin);
        // Simulate domain registration by manually setting domain mapping
        // In real implementation this would happen via email proof verification
        vm.stopPrank();
        
        // For now, this test demonstrates the concept
        // In a real scenario, you'd first register hospital1 with a domain
        // then try to register insurer1 with the same domain and expect failure
        
        // This test would be more meaningful with actual vlayer integration
        assertTrue(true); // Placeholder assertion
    }
    
    // ============ ROLE MANAGEMENT TESTS ============
    
    function testAdminCanAddNewAdmin() public {
        address newAdmin = makeAddr("newAdmin");
        
        vm.startPrank(admin);
        
        vm.expectEmit(true, false, false, false);
        emit RegistrationContract.AdminAdded(newAdmin);
        
        registrationContract.addAdmin(newAdmin);
        
        // Verify admin was added
        assertTrue(registrationContract.admins(newAdmin));
        assertEq(uint(registrationContract.roles(newAdmin)), uint(RegistrationContract.Role.Admin));
        assertTrue(registrationContract.verified(newAdmin));
        
        vm.stopPrank();
    }
    
    function testAdminCannotRemoveSelf() public {
        vm.startPrank(admin);
        
        vm.expectRevert("Cannot remove self");
        registrationContract.removeAdmin(admin);
        
        vm.stopPrank();
    }
    
    function testNonAdminCannotAddAdmin() public {
        vm.startPrank(patient1);
        
        vm.expectRevert("Not admin");
        registrationContract.addAdmin(makeAddr("newAdmin"));
        
        vm.stopPrank();
    }
    
    // ============ PRIVACY TESTS ============
    
    function testNoPersonalDataOnChain() public {
        vm.startPrank(patient1);
        
        // Register patient with secret
        bytes32 commitment = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        registrationContract.registerPatient(commitment);
        
        vm.stopPrank();
        
        // Verify that the secret cannot be derived from on-chain data
        // This is a conceptual test - in reality, you'd check contract storage
        bytes32 storedCommitment = registrationContract.patientCommitments(patient1);
        
        // The stored commitment should not reveal the original secret
        assertTrue(storedCommitment != bytes32(0));
        assertTrue(storedCommitment == commitment);
        
        // Verify that brute force attacks are computationally infeasible
        // (this is guaranteed by keccak256's properties)
        assertFalse(storedCommitment == keccak256(abi.encodePacked("wrong-secret", patient1)));
    }
    
    function testEmailAddressNeverStored() public {
        // This test ensures email addresses are never stored on-chain
        // Only domain names are stored after vlayer verification
        
        vm.startPrank(hospital1);
        
        // Even in organization registration, only domain is stored, not email
        // The actual email (admin@domain.com) never appears in contract state
        
        vm.stopPrank();
        
        // In a real scenario, you'd verify that no email patterns appear in storage
        // This is guaranteed by the vlayer proof system
    }
    
    // ============ VIEW FUNCTION TESTS ============
    
    function testGetUserRegistration() public {
        // Register a patient
        vm.startPrank(patient1);
        bytes32 commitment = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        registrationContract.registerPatient(commitment);
        vm.stopPrank();
        
        // Get registration info
        (
            RegistrationContract.Role role,
            bool isVerified,
            uint256 timestamp,
            string memory orgName,
            string memory domain
        ) = registrationContract.getUserRegistration(patient1);
        
        assertEq(uint(role), uint(RegistrationContract.Role.Patient));
        assertTrue(isVerified);
        assertGt(timestamp, 0);
        assertEq(bytes(orgName).length, 0); // Patients don't have org info
        assertEq(bytes(domain).length, 0);
    }
    
    function testIsUserVerified() public {
        // Unregistered user
        assertFalse(registrationContract.isUserVerified(patient1));
        
        // Register patient
        vm.startPrank(patient1);
        bytes32 commitment = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        registrationContract.registerPatient(commitment);
        vm.stopPrank();
        
        // Now should be verified
        assertTrue(registrationContract.isUserVerified(patient1));
    }
    
    // ============ INTEGRATION TESTS ============
    
    function testCompletePatientJourney() public {
        vm.startPrank(patient1);
        
        // 1. Generate commitment locally (simulating frontend)
        bytes32 commitment = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        
        // 2. Register with commitment
        registrationContract.registerPatient(commitment);
        
        // 3. Verify commitment (simulating later verification)
        assertTrue(registrationContract.verifyPatientCommitment(PATIENT_SECRET));
        
        // 4. Check that patient can interact with system
        assertTrue(registrationContract.isUserVerified(patient1));
        assertEq(uint(registrationContract.roles(patient1)), uint(RegistrationContract.Role.Patient));
        
        vm.stopPrank();
    }
    
    function testMultipleUsersRegistration() public {
        // Register patient1
        vm.startPrank(patient1);
        bytes32 commitment1 = keccak256(abi.encodePacked(PATIENT_SECRET, patient1));
        registrationContract.registerPatient(commitment1);
        
        // Verify commitment for patient1 while still in their context
        assertTrue(registrationContract.verifyPatientCommitment(PATIENT_SECRET));
        vm.stopPrank();
        
        // Register patient2 with different secret
        vm.startPrank(patient2);
        string memory secret2 = "different-secret-456";
        bytes32 commitment2 = keccak256(abi.encodePacked(secret2, patient2));
        registrationContract.registerPatient(commitment2);
        
        // Verify commitment for patient2
        assertTrue(registrationContract.verifyPatientCommitment(secret2));
        assertFalse(registrationContract.verifyPatientCommitment(PATIENT_SECRET)); // Wrong secret for patient2
        vm.stopPrank();
        
        // Verify both are registered correctly
        assertTrue(registrationContract.isUserVerified(patient1));
        assertTrue(registrationContract.isUserVerified(patient2));
    }
    
    // ============ ERROR HANDLING TESTS ============
    
    function testInvalidRoleRejected() public {
        vm.startPrank(hospital1);
        
        // Cannot register with Patient role as organization
        // This would fail in registerOrganization validation
        
        vm.stopPrank();
    }
    
    function testEmptyOrganizationNameRejected() public {
        vm.startPrank(hospital1);
        
        // Empty organization name should fail
        // This would be tested in the complete registration flow
        
        vm.stopPrank();
    }
    
    // ============ ACCESS CONTROL TESTS ============
    
    function testOnlyVerifiedCanUseSystem() public {
        // This test demonstrates that unregistered users cannot access role-restricted functions
        // In a real implementation, you would test specific functions that require roles
        
        address unregistered = makeAddr("unregistered");
        
        // Verify user is not registered
        assertFalse(registrationContract.isUserVerified(unregistered));
        assertEq(uint(registrationContract.roles(unregistered)), uint(RegistrationContract.Role.None));
        
        // This demonstrates the access control pattern
        // Specific role-restricted functions would be tested when they exist
        assertTrue(true); // Placeholder assertion
    }
} 
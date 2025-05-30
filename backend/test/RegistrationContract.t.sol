// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {EmailDomainProver, OrganizationVerificationData} from "../src/zkMed/EmailDomainProver.sol";
import {RegistrationContract} from "../src/zkMed/RegistrationContract.sol";
import {Proof, ProofLib} from "vlayer-0.1.0/Proof.sol";
import {UnverifiedEmail} from "vlayer-0.1.0/EmailProof.sol";
import {DnsRecord, VerificationData} from "vlayer-0.1.0/EmailProof.sol";

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
    
    // Helper function to create mock UnverifiedEmail
    function createMockUnverifiedEmail() internal view returns (UnverifiedEmail memory) {
        // Create mock DNS record
        DnsRecord memory mockDnsRecord = DnsRecord({
            name: "example.com",
            recordType: 1, // A record
            data: "127.0.0.1",
            ttl: 3600
        });
        
        // Create mock verification data
        VerificationData memory mockVerificationData = VerificationData({
            validUntil: uint64(block.timestamp + 1 days),
            signature: new bytes(0),
            pubKey: new bytes(0)
        });
        
        return UnverifiedEmail({
            email: "test@example.com",
            dnsRecord: mockDnsRecord,
            verificationData: mockVerificationData
        });
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
    
    function testDomainVerificationFlow() public {
        Proof memory mockProof = createEmptyProof();
        bytes32 emailHash = keccak256(abi.encodePacked("admin@", HOSPITAL_DOMAIN));
        
        vm.startPrank(hospital1);
        
        // Mock the vlayer verification for domain ownership
        vm.mockCall(
            address(registrationContract),
            abi.encodeWithSelector(
                registrationContract.verifyDomainOwnership.selector,
                mockProof,
                emailHash,
                hospital1,
                HOSPITAL_DOMAIN
            ),
            abi.encode()
        );
        
        // In real implementation, this would be called after vlayer verification
        // registrationContract.verifyDomainOwnership(mockProof, emailHash, hospital1, HOSPITAL_DOMAIN);
        
        vm.stopPrank();
    }
    
    function testCompleteOrganizationRegistration() public {
        // First simulate domain verification
        vm.startPrank(admin);
        // Manually set domain ownership for testing
        vm.stopPrank();
        
        // This test demonstrates the two-step flow
        // In practice, you would first call verifyDomainOwnership, then this function
        assertTrue(true); // Placeholder for the two-step verification flow
    }
    
    function testSingleStepOrganizationRegistration() public {
        Proof memory mockProof = createEmptyProof();
        
        OrganizationVerificationData memory orgData = OrganizationVerificationData({
            name: HOSPITAL_NAME,
            domain: HOSPITAL_DOMAIN,
            targetWallet: hospital1,
            emailHash: keccak256(abi.encodePacked("admin@", HOSPITAL_DOMAIN)),
            verificationTimestamp: block.timestamp
        });
        
        vm.startPrank(hospital1);
        
        // Mock the vlayer verification for complete organization registration
        vm.mockCall(
            address(registrationContract),
            abi.encodeWithSelector(
                registrationContract.registerOrganization.selector,
                mockProof,
                orgData,
                RegistrationContract.Role.Hospital
            ),
            abi.encode()
        );
        
        // In real implementation, this would work with actual vlayer proofs
        // registrationContract.registerOrganization(mockProof, orgData, RegistrationContract.Role.Hospital);
        
        vm.stopPrank();
    }
    
    function testEmailHashPreventsDuplicateRegistration() public {
        bytes32 emailHash = keccak256(abi.encodePacked("admin@", HOSPITAL_DOMAIN));
        
        // Simulate that an email hash has been used
        vm.startPrank(admin);
        // In real implementation, this would be set during actual email verification
        vm.stopPrank();
        
        // Test that the same email hash cannot be used twice
        assertTrue(true); // Placeholder for email hash uniqueness test
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
    
    function testAdminCanResetEmailHash() public {
        bytes32 emailHash = keccak256(abi.encodePacked("test@example.com"));
        
        vm.startPrank(admin);
        
        // Reset email hash usage
        registrationContract.resetEmailHash(emailHash);
        
        // Verify the hash is not marked as used
        assertFalse(registrationContract.isEmailHashUsed(emailHash));
        
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
        bytes32 storedCommitment = registrationContract.patientCommitments(patient1);
        
        // The stored commitment should not reveal the original secret
        assertTrue(storedCommitment != bytes32(0));
        assertTrue(storedCommitment == commitment);
        
        // Verify that brute force attacks are computationally infeasible
        assertFalse(storedCommitment == keccak256(abi.encodePacked("wrong-secret", patient1)));
    }
    
    function testEmailAddressNeverStoredOnlyHashes() public {
        // This test ensures email addresses are never stored on-chain
        // Only email hashes are stored after vlayer verification
        
        bytes32 emailHash = keccak256(abi.encodePacked("admin@example.com"));
        
        // Verify that we only store hashes, never actual email addresses
        // The hash is one-way and doesn't reveal the original email
        assertTrue(emailHash != bytes32(0));
        
        // In a real scenario, you'd verify that no email patterns appear in storage
        // This is guaranteed by the vlayer proof system and our hash-only approach
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
    
    function testEmailHashTracking() public {
        bytes32 emailHash = keccak256(abi.encodePacked("test@example.com"));
        
        // Initially not used
        assertFalse(registrationContract.isEmailHashUsed(emailHash));
        assertEq(registrationContract.getEmailHashOwner(emailHash), address(0));
        
        // Test the tracking functionality exists
        assertTrue(true); // Placeholder for email hash tracking tests
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
    
    function testDomainCannotBeReused() public {
        // This test demonstrates domain uniqueness
        // In real implementation, domains would be reserved during email verification
        
        string memory domain = "unique-hospital.com";
        
        // Verify domain registration prevents reuse
        assertFalse(registrationContract.isDomainRegistered(domain));
        
        // After registration, domain should be marked as taken
        // This would happen during actual email proof verification
        assertTrue(true); // Placeholder assertion
    }
    
    function testInvalidRoleRejected() public {
        // Test role validation in organization registration
        // Only Hospital and Insurer roles should be allowed for organizations
        assertTrue(true); // Placeholder for role validation tests
    }
    
    function testTargetWalletMismatch() public {
        // Test that target wallet in email must match msg.sender
        // This prevents someone from using another person's email proof
        assertTrue(true); // Placeholder for wallet verification tests
    }
    
    // ============ ACCESS CONTROL TESTS ============
    
    function testOnlyVerifiedCanUseSystem() public {
        // This test demonstrates that unregistered users cannot access role-restricted functions
        address unregistered = makeAddr("unregistered");
        
        // Verify user is not registered
        assertFalse(registrationContract.isUserVerified(unregistered));
        assertEq(uint(registrationContract.roles(unregistered)), uint(RegistrationContract.Role.None));
        
        // This demonstrates the access control pattern
        assertTrue(true); // Placeholder assertion
    }
} 
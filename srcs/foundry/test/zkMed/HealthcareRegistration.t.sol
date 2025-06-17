// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {HealthcareRegistration} from "../../src/zkMed/HealthcareRegistration.sol";
import {HealthcareRegistrationProver} from "../../src/zkMed/HealthcareRegistrationProver.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";

// Mock prover for testing
contract MockHealthcareRegistrationProver {
    // Same structure as the actual prover's return data
    struct RegistrationData {
        HealthcareRegistrationProver.UserType requestedRole;
        address walletAddress;
        string domain;
        string organizationName;
        bytes32 emailHash;
    }

    function verifyHospitalRegistration(bytes calldata) external pure returns (bool, RegistrationData memory) {
        RegistrationData memory data = RegistrationData({
            requestedRole: HealthcareRegistrationProver.UserType.HOSPITAL,
            walletAddress: address(0xABCD),
            domain: "hospital.com",
            organizationName: "Test Hospital",
            emailHash: keccak256("test@hospital.com")
        });
        return (true, data);
    }

    function verifyInsurerRegistration(bytes calldata) external pure returns (bool, RegistrationData memory) {
        RegistrationData memory data = RegistrationData({
            requestedRole: HealthcareRegistrationProver.UserType.INSURER,
            walletAddress: address(0x1234),  // Fixed: using valid hex characters
            domain: "insurer.com",
            organizationName: "Test Insurer",
            emailHash: keccak256("test@insurer.com")
        });
        return (true, data);
    }
}

contract HealthcareRegistrationTest is Test {
    HealthcareRegistration public registration;
    MockHealthcareRegistrationProver public mockProver;
    
    address public admin;
    address public patient1;
    address public patient2;
    address public hospital1;
    address public insurer1;
    address public mockHospitalWallet;
    address public mockInsurerWallet;
    
    function setUp() public {
        admin = address(this);
        patient1 = vm.addr(1);
        patient2 = vm.addr(2);
        hospital1 = vm.addr(3);
        insurer1 = vm.addr(4);
        mockHospitalWallet = address(0xABCD); // Matches mock prover response
        mockInsurerWallet = address(0x1234); // Fixed: using valid hex characters
        
        mockProver = new MockHealthcareRegistrationProver();
        registration = new HealthcareRegistration(address(mockProver));
    }

    // ======== Patient Registration Tests ========

    function test_registerPatient() public {
        registration.registerPatient(patient1);
        
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isUserRegistered(patient1));
        assertEq(uint256(registration.getUserType(patient1)), uint256(HealthcareRegistration.UserType.PATIENT));
        
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 1);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_registerMultiplePatients() public {
        registration.registerPatient(patient1);
        registration.registerPatient(patient2);
        
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isPatient(patient2));
        
        (uint256 totalUsers, uint256 patients,,) = registration.getRegistrationStats();
        assertEq(totalUsers, 2);
        assertEq(patients, 2);
    }

    function test_revertPatientAlreadyRegistered() public {
        registration.registerPatient(patient1);
        
        vm.expectRevert("Patient already registered");
        registration.registerPatient(patient1);
    }

    function test_revertInvalidPatientAddress() public {
        vm.expectRevert("Invalid patient address");
        registration.registerPatient(address(0));
    }

    function test_revertRegisterPatientNotAdmin() public {
        vm.prank(patient1);
        vm.expectRevert("Not an admin");
        registration.registerPatient(patient2);
    }

    // ======== Hospital Registration Tests ========

    function test_registerHospital() public {
        // Create mock proof
        bytes memory mockProof = abi.encode("mock hospital registration proof");
        
        // Register hospital using mock proof
        registration.registerHospital(mockProof);
        
        // Verify hospital was properly registered
        assertTrue(registration.isHospital(mockHospitalWallet));
        assertTrue(registration.isUserRegistered(mockHospitalWallet));
        assertEq(uint256(registration.getUserType(mockHospitalWallet)), uint256(HealthcareRegistration.UserType.HOSPITAL));
        
        // Verify domain is registered to hospital
        string memory domain = "hospital.com";
        assertTrue(registration.isDomainTaken(domain));
        assertEq(registration.getDomainOwner(domain), mockHospitalWallet);
        
        // Verify domain validates as hospital domain
        assertTrue(registration.validateHospitalDomain(domain));
        assertFalse(registration.validateInsurerDomain(domain));
        
        // Check registration stats
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 0);
        assertEq(hospitals, 1);
        assertEq(insurers, 0);
    }

    function test_hospitalRecord() public {
        // Register hospital
        bytes memory mockProof = abi.encode("mock hospital registration proof");
        registration.registerHospital(mockProof);
        
        // Check hospital record details
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(mockHospitalWallet);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.HOSPITAL));
        assertEq(record.walletAddress, mockHospitalWallet);
        assertEq(record.domain, "hospital.com");
        assertEq(record.organizationName, "Test Hospital");
        assertTrue(record.isActive);
        assertTrue(record.registrationTime > 0);
    }

    // ======== Insurer Registration Tests ========

    function test_registerInsurer() public {
        // Create mock proof
        bytes memory mockProof = abi.encode("mock insurer registration proof");
        
        // Register insurer using mock proof
        registration.registerInsurer(mockProof);
        
        // Verify insurer was properly registered
        assertTrue(registration.isInsurer(mockInsurerWallet));
        assertTrue(registration.isUserRegistered(mockInsurerWallet));
        assertEq(uint256(registration.getUserType(mockInsurerWallet)), uint256(HealthcareRegistration.UserType.INSURER));
        
        // Verify domain is registered to insurer
        string memory domain = "insurer.com";
        assertTrue(registration.isDomainTaken(domain));
        assertEq(registration.getDomainOwner(domain), mockInsurerWallet);
        
        // Verify domain validates as insurer domain
        assertTrue(registration.validateInsurerDomain(domain));
        assertFalse(registration.validateHospitalDomain(domain));
        
        // Check registration stats
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 1);
    }

    function test_insurerRecord() public {
        // Register insurer
        bytes memory mockProof = abi.encode("mock insurer registration proof");
        registration.registerInsurer(mockProof);
        
        // Check insurer record details
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(mockInsurerWallet);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.INSURER));
        assertEq(record.walletAddress, mockInsurerWallet);
        assertEq(record.domain, "insurer.com");
        assertEq(record.organizationName, "Test Insurer");
        assertTrue(record.isActive);
        assertTrue(record.registrationTime > 0);
    }

    // ======== Domain Validation Tests ========

    function test_isDomainTaken() public {
        // Initially, no domains are taken
        string memory hospitalDomain = "hospital.com";
        string memory insurerDomain = "insurer.com";
        
        assertFalse(registration.isDomainTaken(hospitalDomain));
        assertFalse(registration.isDomainTaken(insurerDomain));
        
        // Register hospital
        bytes memory mockHospitalProof = abi.encode("mock hospital registration proof");
        registration.registerHospital(mockHospitalProof);
        
        // Verify hospital domain is now taken
        assertTrue(registration.isDomainTaken(hospitalDomain));
        assertFalse(registration.isDomainTaken(insurerDomain));
        
        // Register insurer
        bytes memory mockInsurerProof = abi.encode("mock insurer registration proof");
        registration.registerInsurer(mockInsurerProof);
        
        // Verify both domains are now taken
        assertTrue(registration.isDomainTaken(hospitalDomain));
        assertTrue(registration.isDomainTaken(insurerDomain));
    }

    function test_domainOwnership() public {
        string memory hospitalDomain = "hospital.com";
        string memory insurerDomain = "insurer.com";
        
        // Initially, domains have no owner
        assertEq(registration.getDomainOwner(hospitalDomain), address(0));
        assertEq(registration.getDomainOwner(insurerDomain), address(0));
        
        // Register hospital and insurer
        bytes memory mockHospitalProof = abi.encode("mock hospital registration proof");
        registration.registerHospital(mockHospitalProof);
        
        bytes memory mockInsurerProof = abi.encode("mock insurer registration proof");
        registration.registerInsurer(mockInsurerProof);
        
        // Verify correct domain ownership
        assertEq(registration.getDomainOwner(hospitalDomain), mockHospitalWallet);
        assertEq(registration.getDomainOwner(insurerDomain), mockInsurerWallet);
    }

    function test_validateHospitalDomain() public {
        string memory hospitalDomain = "hospital.com";
        string memory insurerDomain = "insurer.com";
        string memory unknownDomain = "unknown.com";
        
        // Initially, no domains are valid
        assertFalse(registration.validateHospitalDomain(hospitalDomain));
        assertFalse(registration.validateHospitalDomain(insurerDomain));
        assertFalse(registration.validateHospitalDomain(unknownDomain));
        
        // Register hospital
        bytes memory mockHospitalProof = abi.encode("mock hospital registration proof");
        registration.registerHospital(mockHospitalProof);
        
        // Only hospital domain should be valid
        assertTrue(registration.validateHospitalDomain(hospitalDomain));
        assertFalse(registration.validateHospitalDomain(insurerDomain));
        assertFalse(registration.validateHospitalDomain(unknownDomain));
    }

    function test_validateInsurerDomain() public {
        string memory hospitalDomain = "hospital.com";
        string memory insurerDomain = "insurer.com";
        string memory unknownDomain = "unknown.com";
        
        // Initially, no domains are valid
        assertFalse(registration.validateInsurerDomain(hospitalDomain));
        assertFalse(registration.validateInsurerDomain(insurerDomain));
        assertFalse(registration.validateInsurerDomain(unknownDomain));
        
        // Register insurer
        bytes memory mockInsurerProof = abi.encode("mock insurer registration proof");
        registration.registerInsurer(mockInsurerProof);
        
        // Only insurer domain should be valid
        assertTrue(registration.validateInsurerDomain(insurerDomain));
        assertFalse(registration.validateInsurerDomain(hospitalDomain));
        assertFalse(registration.validateInsurerDomain(unknownDomain));
    }

    function test_domainCaseSensitivity() public {
        // Register hospital with lowercase domain
        bytes memory mockHospitalProof = abi.encode("mock hospital registration proof");
        registration.registerHospital(mockHospitalProof);
        
        // Domain validation should ignore case
        assertTrue(registration.validateHospitalDomain("hospital.com"));
        assertTrue(registration.validateHospitalDomain("HOSPITAL.COM"));
        assertTrue(registration.validateHospitalDomain("Hospital.Com"));
        
        // Domain lookup should also ignore case
        assertTrue(registration.isDomainTaken("hospital.com"));
        assertTrue(registration.isDomainTaken("HOSPITAL.COM"));
        assertTrue(registration.isDomainTaken("Hospital.Com"));
    }

    function test_deactivateUser() public {
        // Register hospital
        bytes memory mockHospitalProof = abi.encode("mock hospital registration proof");
        registration.registerHospital(mockHospitalProof);
        
        // Verify hospital is active
        assertTrue(registration.isUserRegistered(mockHospitalWallet));
        assertTrue(registration.validateHospitalDomain("hospital.com"));
        
        // Deactivate hospital
        registration.deactivateUser(mockHospitalWallet);
        
        // Verify hospital is no longer active but domain remains taken
        assertFalse(registration.isUserRegistered(mockHospitalWallet));
        assertTrue(registration.isDomainTaken("hospital.com"));
        
        // Validate domain should now fail
        assertFalse(registration.validateHospitalDomain("hospital.com"));
        
        // Get user record should still show hospital but inactive
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(mockHospitalWallet);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.HOSPITAL));
        assertFalse(record.isActive);
    }

    // ======== Admin Management Tests ========

    function test_addAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.BASIC));
        assertEq(permissions, 1);
    }

    function test_addModeratorAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.MODERATOR);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.MODERATOR));
        assertEq(permissions, 255);
    }

    function test_addSuperAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.SUPER_ADMIN);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.SUPER_ADMIN));
        assertEq(permissions, type(uint256).max);
    }

    function test_revertAddAdminAlreadyAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        vm.expectRevert("Already an admin");
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.MODERATOR);
    }

    function test_revertAddAdminInvalidAddress() public {
        vm.expectRevert("Invalid admin address");
        registration.addAdmin(address(0), HealthcareRegistration.AdminRole.BASIC);
    }

    function test_revertAddAdminNotSuperAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        vm.prank(patient1);
        vm.expectRevert("Not a super admin");
        registration.addAdmin(patient2, HealthcareRegistration.AdminRole.BASIC);
    }

    function test_updateAdminPermissions() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        uint256 newPermissions = 100;
        registration.updateAdminPermissions(patient1, newPermissions);
        
        (,, uint256 permissions) = registration.admins(patient1);
        assertEq(permissions, newPermissions);
    }

    function test_revertUpdatePermissionsNotAdmin() public {
        vm.expectRevert("Not an admin");
        registration.updateAdminPermissions(patient1, 100);
    }

    // ======== Integration Tests ========

    function test_completePatientFlow() public {
        // Register patient
        registration.registerPatient(patient1);
        
        // Verify all state is correct
        assertTrue(registration.isUserRegistered(patient1));
        assertTrue(registration.isPatient(patient1));
        assertFalse(registration.isHospital(patient1));
        assertFalse(registration.isInsurer(patient1));
        
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(patient1);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.PATIENT));
        assertTrue(record.isActive);
    }

    function test_adminHierarchy() public {
        // Super admin (deployer) can add other admins
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.MODERATOR);
        
        // Moderator cannot add super admins or other moderators (only super admin can)
        vm.prank(patient1);
        vm.expectRevert("Not a super admin");
        registration.addAdmin(patient2, HealthcareRegistration.AdminRole.SUPER_ADMIN);
        
        // But moderator can register patients (has admin rights)
        vm.prank(patient1);
        registration.registerPatient(patient2);
        assertTrue(registration.isPatient(patient2));
    }

    function test_getRegistrationStats() public {
        // Initial state
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 0);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
        
        // After registering patients
        registration.registerPatient(patient1);
        registration.registerPatient(patient2);
        
        (totalUsers, patients, hospitals, insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 2);
        assertEq(patients, 2);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    // ======== Security and Edge Cases ========

    function test_revertRegisterPatientTwice() public {
        registration.registerPatient(patient1);
        
        vm.expectRevert("Patient already registered");
        registration.registerPatient(patient1);
    }

    function test_ownershipFunctions() public {
        // Contract deployer should be owner and super admin
        assertEq(registration.owner(), address(this));
        
        (bool isActive, HealthcareRegistration.AdminRole role,) = registration.admins(address(this));
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.SUPER_ADMIN));
    }
}

// Custom mock prover that returns the same domain for both hospital and insurer
contract MockSameDomainProver {
    // Same structure as the actual prover's return data
    struct RegistrationData {
        HealthcareRegistrationProver.UserType requestedRole;
        address walletAddress;
        string domain;
        string organizationName;
        bytes32 emailHash;
    }

    function verifyHospitalRegistration(bytes calldata) external pure returns (bool, RegistrationData memory) {
        RegistrationData memory data = RegistrationData({
            requestedRole: HealthcareRegistrationProver.UserType.HOSPITAL,
            walletAddress: address(0x1111),
            domain: "same-domain.com",
            organizationName: "Test Hospital",
            emailHash: keccak256("test@hospital.com")
        });
        return (true, data);
    }

    function verifyInsurerRegistration(bytes calldata) external pure returns (bool, RegistrationData memory) {
        RegistrationData memory data = RegistrationData({
            requestedRole: HealthcareRegistrationProver.UserType.INSURER,
            walletAddress: address(0x2222),
            domain: "same-domain.com",  // Same domain as hospital
            organizationName: "Test Insurer",
            emailHash: keccak256("test@insurer.com")
        });
        return (true, data);
    }
}
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test} from "forge-std/Test.sol";
import {HealthcareRegistration} from "../../src/zkMed/HealthcareRegistration.sol";
import {HealthcareRegistrationProver} from "../../src/zkMed/HealthcareRegistrationProver.sol";

contract HealthcareRegistrationTest is Test {
    HealthcareRegistration public registration;
    HealthcareRegistrationProver public prover;
    
    address public admin;
    address public patient1;
    address public patient2;
    address public hospital1;
    address public insurer1;
    
    // Sample email hashes for testing
    bytes32 public emailHash1;
    bytes32 public emailHash2;
    bytes32 public emailHash3;
    
    function setUp() public {
        admin = address(this);
        patient1 = vm.addr(1);
        patient2 = vm.addr(2);
        hospital1 = vm.addr(3);
        insurer1 = vm.addr(4);
        
        // Generate sample email hashes
        emailHash1 = keccak256(abi.encodePacked("patient1@example.com"));
        emailHash2 = keccak256(abi.encodePacked("patient2@example.com"));
        emailHash3 = keccak256(abi.encodePacked("patient3@example.com"));
        
        prover = new HealthcareRegistrationProver();
        registration = new HealthcareRegistration(address(prover));
    }

    // ======== Patient Registration Tests ========

    function test_registerPatient() public {
        registration.registerPatient(patient1, emailHash1);
        
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isUserRegistered(patient1));
        assertEq(uint256(registration.getUserType(patient1)), uint256(HealthcareRegistration.UserType.PATIENT));
        
        // Verify email hash is stored
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(patient1);
        assertEq(record.emailHash, emailHash1);
        
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 1);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_registerMultiplePatients() public {
        registration.registerPatient(patient1, emailHash1);
        registration.registerPatient(patient2, emailHash2);
        
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isPatient(patient2));
        assertTrue(registration.isUserRegistered(patient1));
        assertTrue(registration.isUserRegistered(patient2));
        
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 2);
        assertEq(patients, 2);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_revertPatientAlreadyRegistered() public {
        registration.registerPatient(patient1, emailHash1);
        vm.expectRevert("Patient already registered");
        registration.registerPatient(patient1, emailHash2);
    }

    function test_revertEmailAlreadyUsed() public {
        registration.registerPatient(patient1, emailHash1);
        vm.expectRevert("Email already used");
        registration.registerPatient(patient2, emailHash1);
    }

    function test_revertInvalidPatientAddress() public {
        vm.expectRevert("Invalid patient address");
        registration.registerPatient(address(0), emailHash1);
    }

    function test_revertRegisterPatientNotAdmin() public {
        vm.prank(patient1);
        vm.expectRevert("Not an admin");
        registration.registerPatient(patient2, emailHash1);
    }

    function test_deactivatePatient() public {
        registration.registerPatient(patient1, emailHash1);
        
        // Verify patient is registered and active
        assertTrue(registration.isUserRegistered(patient1));
        assertTrue(registration.isPatient(patient1));
        
        // Deactivate the patient
        registration.deactivateUser(patient1);
        
        // Verify patient is deactivated
        assertFalse(registration.isUserRegistered(patient1));
        assertFalse(registration.isPatient(patient1));
        
        // Check that the record still exists but is inactive
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(patient1);
        assertFalse(record.isActive);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.PATIENT));
    }

    // ======== Admin Management Tests ========

    function test_addAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        (bool isActive, HealthcareRegistration.AdminRole role,) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.BASIC));
    }

    function test_addModeratorAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.MODERATOR);
        
        (bool isActive, HealthcareRegistration.AdminRole role,) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.MODERATOR));
    }

    function test_addSuperAdmin() public {
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.SUPER_ADMIN);
        
        (bool isActive, HealthcareRegistration.AdminRole role,) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.SUPER_ADMIN));
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
        
        uint256 newPermissions = 123;
        registration.updateAdminPermissions(patient1, newPermissions);
        
        (,, uint256 permissions) = registration.admins(patient1);
        assertEq(permissions, newPermissions);
    }

    function test_revertUpdatePermissionsNotAdmin() public {
        vm.prank(patient1);
        vm.expectRevert("Not a super admin");
        registration.updateAdminPermissions(patient2, 123);
    }

    // ======== View Function Tests ========

    function test_nonExistentUserRecord() public {
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(patient1);
        assertEq(record.walletAddress, address(0));
        assertEq(record.domain, "");
        assertEq(record.organizationName, "");
        assertEq(record.emailHash, bytes32(0));
        assertEq(record.registrationTime, 0);
        assertFalse(record.isActive);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.PATIENT));
    }

    function test_emptyDomain() public {
        assertFalse(registration.isDomainTaken(""));
        assertEq(registration.getDomainOwner(""), address(0));
        assertFalse(registration.validateHospitalDomain(""));
        assertFalse(registration.validateInsurerDomain(""));
    }

    function test_initialStats() public {
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 0);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_domainValidation() public {
        // Test unregistered domains - should return false since they're not registered
        assertFalse(registration.validateHospitalDomain("hospital.com"));
        assertFalse(registration.validateInsurerDomain("insurance.co.uk"));
        
        // Test empty domain
        assertFalse(registration.validateHospitalDomain(""));
        assertFalse(registration.validateInsurerDomain(""));
        
        // Test very short domain
        assertFalse(registration.validateHospitalDomain("abc"));
        assertFalse(registration.validateInsurerDomain("xyz"));
    }

    // ======== Email Hash Validation Tests ========

    function test_emailHashUniqueness() public {
        // Test that each email hash can only be used once
        registration.registerPatient(patient1, emailHash1);
        
        // Try to register another patient with the same email hash
        vm.expectRevert("Email already used");
        registration.registerPatient(patient2, emailHash1);
    }

    function test_emailHashStored() public {
        registration.registerPatient(patient1, emailHash1);
        
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(patient1);
        assertEq(record.emailHash, emailHash1);
        assertEq(record.walletAddress, patient1);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.PATIENT));
        assertTrue(record.isActive);
        assertGt(record.registrationTime, 0);
    }
}
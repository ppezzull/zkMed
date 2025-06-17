// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {HealthcareRegistration} from "../../src/zkMed/HealthcareRegistration.sol";

contract HealthcareRegistrationTest is Test {
    HealthcareRegistration public registration;
    address public mockProver;
    
    address public admin;
    address public patient1;
    address public patient2;
    address public hospital1;
    address public insurer1;
    
    function setUp() public {
        admin = address(this);
        patient1 = vm.addr(1);
        patient2 = vm.addr(2);
        hospital1 = vm.addr(3);
        insurer1 = vm.addr(4);
        
        mockProver = address(0x999); // Mock prover address
        registration = new HealthcareRegistration(mockProver);
    }

    // Helper function removed - not needed for basic registration tests

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
    // Note: Hospital registration with MailProof requires vlayer integration
    // These tests focus on the verification contract functionality

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

    // ======== Domain Validation Tests ========

    function test_isDomainTaken() public {
        // Initially no domains are taken
        assertFalse(registration.isDomainTaken("test.com"));
        
        // After registration, domain should be taken
        // This would require a successful hospital/insurer registration
        // For now, we test the mapping directly
        assertEq(registration.getDomainOwner("test.com"), address(0));
    }

    function test_validateHospitalDomain() public {
        // Should return false for non-existent domain
        assertFalse(registration.validateHospitalDomain("nonexistent.com"));
    }

    function test_validateInsurerDomain() public {
        // Should return false for non-existent domain
        assertFalse(registration.validateInsurerDomain("nonexistent.com"));
    }

    // ======== User Record Tests ========

    function test_getUserRecord() public {
        registration.registerPatient(patient1);
        
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(patient1);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.PATIENT));
        assertEq(record.walletAddress, patient1);
        assertEq(record.domain, "");
        assertEq(record.organizationName, "");
        assertTrue(record.isActive);
        assertTrue(record.registrationTime > 0);
    }

    function test_revertGetUserTypeNotRegistered() public {
        vm.expectRevert("User not registered");
        registration.getUserType(patient1);
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

    // ======== Edge Cases and Security Tests ========

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
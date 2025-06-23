// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test} from "forge-std/Test.sol";
import {HealthcareRegistration} from "../../src/zkMed/HealthcareRegistration.sol";
import {HealthcareRegistrationProver} from "../../src/zkMed/HealthcareRegistrationProver.sol";

contract HealthcareRegistrationTest is Test {
    HealthcareRegistration public registration;
    HealthcareRegistrationProver public prover;
    
    address public admin;
    address public hospital1;
    address public insurer1;
    address public user1;
    address public user2;
    
    function setUp() public {
        admin = address(this);
        user1 = vm.addr(1);
        user2 = vm.addr(2);
        hospital1 = vm.addr(3);
        insurer1 = vm.addr(4);
        
        prover = new HealthcareRegistrationProver();
        registration = new HealthcareRegistration(address(prover));
    }

    // ======== Admin Management Tests ========

    function test_addAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        
        (bool isActive, HealthcareRegistration.AdminRole role,) = registration.admins(user1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.BASIC));
    }

    function test_addModeratorAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.MODERATOR);
        
        (bool isActive, HealthcareRegistration.AdminRole role,) = registration.admins(user1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.MODERATOR));
    }

    function test_addSuperAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.SUPER_ADMIN);
        
        (bool isActive, HealthcareRegistration.AdminRole role,) = registration.admins(user1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.SUPER_ADMIN));
    }

    function test_revertAddAdminAlreadyAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        vm.expectRevert("Already an admin");
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.MODERATOR);
    }

    function test_revertAddAdminInvalidAddress() public {
        vm.expectRevert("Invalid admin address");
        registration.addAdmin(address(0), HealthcareRegistration.AdminRole.BASIC);
    }

    function test_revertAddAdminNotSuperAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        
        vm.prank(user1);
        vm.expectRevert("Not a super admin");
        registration.addAdmin(user2, HealthcareRegistration.AdminRole.BASIC);
    }

    function test_updateAdminPermissions() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        
        uint256 newPermissions = 123;
        registration.updateAdminPermissions(user1, newPermissions);
        
        (,, uint256 permissions) = registration.admins(user1);
        assertEq(permissions, newPermissions);
    }

    function test_revertUpdatePermissionsNotAdmin() public {
        vm.prank(user1);
        vm.expectRevert("Not a super admin");
        registration.updateAdminPermissions(user2, 123);
    }

    // ======== View Function Tests ========

    function test_nonExistentUserRecord() public view{
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(user1);
        assertEq(record.walletAddress, address(0));
        assertEq(record.domain, "");
        assertEq(record.organizationName, "");
        assertEq(record.emailHash, bytes32(0));
        assertEq(record.registrationTime, 0);
        assertFalse(record.isActive);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.PATIENT));
    }

    function test_emptyDomain() public view {
        assertFalse(registration.isDomainTaken(""));
        assertEq(registration.getDomainOwner(""), address(0));
        assertFalse(registration.validateHospitalDomain(""));
        assertFalse(registration.validateInsurerDomain(""));
    }

    function test_initialStats() public view {
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 0);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_domainValidation() public view {
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
}
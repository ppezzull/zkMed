// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../../contracts/zkMed/zkMedCore.sol";
import "../../contracts/zkMed/provers/zkMedRegistrationProver.sol";
import "../../contracts/zkMed/provers/zkMedPaymentPlanProver.sol";
import "../../contracts/zkMed/users/zkMedAdmin.sol";

contract zkMedCoreTest is Test {
    zkMedCore public core;
    zkMedRegistrationProver public prover;
    zkMedPaymentPlanProver public paymentPlanProver;
    zkMedAdmin public adminContract;
    
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
        
        prover = new zkMedRegistrationProver();
        core = new zkMedCore();
        paymentPlanProver = new zkMedPaymentPlanProver();
        adminContract = new zkMedAdmin(address(core));
        
        // Set the user contracts in the core so modifiers pass - use address(0) for non-essential contracts
        core.setUserContracts(address(0), address(0), address(0), address(adminContract));
        // Authorize the admin contract to call core functions
        core.authorizeContract(address(adminContract));
    }

    // ======== Admin Management Tests ========

    function test_addAdmin() public {
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.BASIC);
        
        zkMedAdmin.AdminRecord memory adminRecord = adminContract.getAdminRecord(user1);
        assertTrue(adminRecord.isActive);
        assertEq(uint256(adminRecord.role), uint256(zkMedAdmin.AdminRole.BASIC));
        assertEq(adminRecord.permissions, 1); // Basic permissions should be 1
        assertGt(adminRecord.adminSince, 0);
    }

    function test_addModeratorAdmin() public {
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.MODERATOR);
        
        zkMedAdmin.AdminRecord memory adminRecord = adminContract.getAdminRecord(user1);
        assertTrue(adminRecord.isActive);
        assertEq(uint256(adminRecord.role), uint256(zkMedAdmin.AdminRole.MODERATOR));
        assertEq(adminRecord.permissions, 255); // Moderate permissions should be 255
    }

    function test_addSuperAdmin() public {
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.SUPER_ADMIN);
        
        zkMedAdmin.AdminRecord memory adminRecord = adminContract.getAdminRecord(user1);
        assertTrue(adminRecord.isActive);
        assertEq(uint256(adminRecord.role), uint256(zkMedAdmin.AdminRole.SUPER_ADMIN));
        assertEq(adminRecord.permissions, type(uint256).max); // Super admin gets all permissions
    }

    function test_revertAddAdminAlreadyAdmin() public {
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.BASIC);
        vm.expectRevert("Address is already an admin");
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.MODERATOR);
    }

    function test_revertAddAdminInvalidAddress() public {
        vm.expectRevert("Invalid admin address");
        adminContract.addAdmin(address(0), zkMedAdmin.AdminRole.BASIC);
    }

    function test_revertAddAdminNotSuperAdmin() public {
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.BASIC);
        
        vm.prank(user1);
        vm.expectRevert("Not a super admin");
        adminContract.addAdmin(user2, zkMedAdmin.AdminRole.BASIC);
    }

    function test_updateAdminPermissions() public {
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.BASIC);
        
        uint256 newPermissions = 123;
        adminContract.updateAdminPermissions(user1, newPermissions);
        
        zkMedAdmin.AdminRecord memory adminRecord = adminContract.getAdminRecord(user1);
        assertEq(adminRecord.permissions, newPermissions);
    }

    function test_revertUpdatePermissionsNotAdmin() public {
        vm.prank(user1);
        vm.expectRevert("Not a super admin");
        adminContract.updateAdminPermissions(user2, 123);
    }

    function test_getAdminType() public {
        adminContract.addAdmin(user1, zkMedAdmin.AdminRole.MODERATOR);
        
        zkMedAdmin.AdminRole role = adminContract.getAdminType(user1);
        assertEq(uint256(role), uint256(zkMedAdmin.AdminRole.MODERATOR));
    }

    function test_revertGetAdminTypeNotAdmin() public {
        vm.expectRevert("Admin not registered");
        adminContract.getAdminType(user1);
    }

    // ======== View Function Tests ========

    function test_validateHospitalDomain() public view {
        // Since hospital contract is address(0), should return false
        assertFalse(core.validateHospitalDomain("xyz"));
    }

    function test_validateInsurerDomain() public view {
        // Since insurer contract is address(0), should return false
        assertFalse(core.validateInsurerDomain("xyz"));
    }

    function test_getRole() public view {
        (string memory role, bool isActive) = core.getRole(user1);
        assertEq(role, "UNREGISTERED");
        assertFalse(isActive);
    }

    function test_isUserRegistered() public view {
        assertFalse(core.isUserRegistered(user1));
    }

    function test_contractHasSuperAdminOnDeploy() public view {
        // The deployer (this contract) should be a super admin
        zkMedAdmin.AdminRecord memory adminRecord = adminContract.getAdminRecord(address(this));
        assertTrue(adminRecord.isActive);
        assertEq(uint256(adminRecord.role), uint256(zkMedAdmin.AdminRole.SUPER_ADMIN));
        assertEq(adminRecord.permissions, type(uint256).max);
        assertGt(adminRecord.adminSince, 0);
    }

    function test_getRegistrationStats() public view {
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = core.getRegistrationStats();
        // All should be 0 since user contracts are address(0)
        assertEq(totalUsers, 0);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_contractAuthorization() public {
        address testContract = makeAddr("testContract");
        
        // Should not be authorized initially
        assertFalse(core.authorizedContracts(testContract));
        
        // Authorize the contract
        core.authorizeContract(testContract);
        assertTrue(core.authorizedContracts(testContract));
        
        // Revoke authorization
        core.revokeContractAuthorization(testContract);
        assertFalse(core.authorizedContracts(testContract));
    }
}

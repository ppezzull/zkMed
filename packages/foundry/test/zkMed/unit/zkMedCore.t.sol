// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Test} from "forge-std/Test.sol";
import {zkMedCore} from "../../../contracts/zkMed/core/zkMedCore.sol";
import {MockUSDC} from "../../../contracts/zkMed/mocks/MockUSDC.sol";
import {AdminLib} from "../../../contracts/zkMed/libraries/AdminLib.sol";

contract zkMedCoreTest is Test {
    // Mirror contract events for expectEmit
    event PatientRegistered(address indexed patient);
    event HospitalRegistered(address indexed hospital, string domain, bytes32 emailHash, string organizationName);
    event InsurerRegistered(address indexed insurer, string domain, bytes32 emailHash, string organizationName);
    event AdminAdded(address indexed admin, AdminLib.AdminRole role);
    event AdminDeactivated(address indexed admin);

    MockUSDC public mockUSDC;
    zkMedCore public core;

    address public superAdmin;
    address public addrModerator;
    address public addrBasic;
    address public addrOther;
    address public addrPatient;
    address public addrHospital;
    address public addrInsurer;

    bytes32 private constant EMAIL1 = keccak256("a@a.test");
    bytes32 private constant EMAIL2 = keccak256("b@b.test");
    bytes32 private constant EMAIL3 = keccak256("c@c.test");

    function setUp() public {
        superAdmin = address(this);
        addrModerator = vm.addr(1);
        addrBasic = vm.addr(2);
        addrOther = vm.addr(9);
        addrPatient = vm.addr(3);
        addrHospital = vm.addr(4);
        addrInsurer = vm.addr(5);

        mockUSDC = new MockUSDC();
        core = new zkMedCore(address(mockUSDC));
    }

    // Helpers
    function _addBasic(address who) internal {
        vm.prank(superAdmin);
        core.addAdmin(who, AdminLib.AdminRole.BASIC);
    }

    function _addModerator(address who) internal {
        vm.prank(superAdmin);
        core.addAdmin(who, AdminLib.AdminRole.MODERATOR);
    }

    // Constructor / basic state
    function test_constructor_setsUSDC_andInitialSuperAdmin() public view {
        assertEq(address(core.usdc()), address(mockUSDC));
        assertTrue(core.isAdmin(superAdmin));
    }

    // Admin: addAdmin
    function test_addAdmin_bySuperAdmin_basic_succeeds_andEvent() public {
        vm.expectEmit(true, true, true, true);
        emit AdminAdded(addrBasic, AdminLib.AdminRole.BASIC);
        vm.prank(superAdmin);
        core.addAdmin(addrBasic, AdminLib.AdminRole.BASIC);
        assertTrue(core.isAdmin(addrBasic));
    }

    function test_addAdmin_onlyAdmin_guard() public {
        vm.prank(addrOther);
        vm.expectRevert(zkMedCore.NotAdmin.selector);
        core.addAdmin(addrBasic, AdminLib.AdminRole.BASIC);
    }

    function test_addAdmin_cannotAddSelf() public {
        vm.prank(superAdmin);
        vm.expectRevert(zkMedCore.CannotAddSelf.selector);
        core.addAdmin(superAdmin, AdminLib.AdminRole.BASIC);
    }

    function test_addAdmin_invalidAddress() public {
        vm.prank(superAdmin);
        vm.expectRevert(zkMedCore.InvalidAdminAddress.selector);
        core.addAdmin(address(0), AdminLib.AdminRole.BASIC);
    }

    function test_addAdmin_cannotAddSuperAdminRole() public {
        vm.prank(superAdmin);
        vm.expectRevert(zkMedCore.SuperAdminCannotBeAdded.selector);
        core.addAdmin(addrBasic, AdminLib.AdminRole.SUPER_ADMIN);
    }

    function test_addAdmin_moderator_requiresSuperAdmin() public {
        _addBasic(addrBasic);
        vm.prank(addrBasic);
        vm.expectRevert(zkMedCore.SuperAdminOnly.selector);
        core.addAdmin(addrModerator, AdminLib.AdminRole.MODERATOR);
    }

    // Admin: deactivateAdmin
    function test_deactivateAdmin_bySuperAdmin_succeeds_andEvent() public {
        _addBasic(addrBasic);
        assertTrue(core.isAdmin(addrBasic));
        vm.expectEmit(true, true, true, true);
        emit AdminDeactivated(addrBasic);
        vm.prank(superAdmin);
        core.deactivateAdmin(addrBasic);
        assertFalse(core.isAdmin(addrBasic));
    }

    function test_deactivateAdmin_onlyAdmin_guard() public {
        _addBasic(addrBasic);
        vm.prank(addrOther);
        vm.expectRevert(zkMedCore.NotAdmin.selector);
        core.deactivateAdmin(addrBasic);
    }

    function test_deactivateAdmin_cannotDeactivateSelf() public {
        _addBasic(addrBasic);
        vm.prank(addrBasic);
        vm.expectRevert(zkMedCore.CannotDeactivateSelf.selector);
        core.deactivateAdmin(addrBasic);
    }

    function test_deactivateAdmin_invalidAddress() public {
        vm.prank(superAdmin);
        vm.expectRevert(zkMedCore.InvalidAdminAddress.selector);
        core.deactivateAdmin(address(0));
    }

    function test_deactivateAdmin_superAdminCannotBeDeactivated() public {
        _addBasic(addrBasic);
        vm.prank(addrBasic);
        vm.expectRevert(zkMedCore.SuperAdminCannotBeDeactivated.selector);
        core.deactivateAdmin(superAdmin);
    }

    function test_deactivateAdmin_moderator_requiresSuperAdmin() public {
        _addModerator(addrModerator);
        _addBasic(addrBasic);
        vm.prank(addrBasic);
        vm.expectRevert(zkMedCore.SuperAdminOnly.selector);
        core.deactivateAdmin(addrModerator);
    }

    function test_deactivateAdmin_superAdmin_canDeactivateModerator() public {
        _addModerator(addrModerator);
        vm.prank(superAdmin);
        core.deactivateAdmin(addrModerator);
        assertFalse(core.isAdmin(addrModerator));
    }

    // Patient registration
    function test_registerPatient_success_andEvent() public {
        vm.expectEmit(true, true, true, true);
        emit PatientRegistered(addrPatient);
        core.registerPatient(addrPatient, EMAIL1);
        assertTrue(core.isPatientRegistered(addrPatient));
    }

    function test_registerPatient_revertsOnInvalidAddress() public {
        vm.expectRevert(bytes("invalid patient"));
        core.registerPatient(address(0), EMAIL1);
    }

    function test_registerPatient_revertsOnInvalidEmail() public {
        vm.expectRevert(bytes("invalid email"));
        core.registerPatient(addrPatient, bytes32(0));
    }

    function test_registerPatient_revertsOnDuplicateAndEmailUsed() public {
        core.registerPatient(addrPatient, EMAIL1);
        vm.expectRevert(bytes("already registered"));
        core.registerPatient(addrPatient, EMAIL2);

        address another = vm.addr(99);
        vm.expectRevert(bytes("email used"));
        core.registerPatient(another, EMAIL1);
    }

    // Hospital registration + activation lifecycle
    function test_registerHospital_success_andEvent() public {
        vm.expectEmit(true, true, true, true);
        emit HospitalRegistered(addrHospital, "hospital.test", EMAIL1, "HospOrg");
        core.registerHospital(addrHospital, EMAIL1, "hospital.test", "HospOrg");
        assertTrue(core.isHospitalRegistered(addrHospital));
        (string memory role, bool isActive) = core.getRole(addrHospital);
        assertEq(role, "HOSPITAL");
        assertFalse(isActive);
    }

    function test_registerHospital_revertsOnInvalidsAndDuplicates() public {
        vm.expectRevert(bytes("invalid hospital"));
        core.registerHospital(address(0), EMAIL1, "d1", "o1");

        vm.expectRevert(bytes("invalid email"));
        core.registerHospital(addrHospital, bytes32(0), "d1", "o1");

        vm.expectRevert(bytes("invalid domain"));
        core.registerHospital(addrHospital, EMAIL1, "", "o1");

        vm.expectRevert(bytes("invalid org"));
        core.registerHospital(addrHospital, EMAIL1, "d1", "");

        core.registerHospital(addrHospital, EMAIL1, "d1", "o1");
        vm.expectRevert(bytes("already registered"));
        core.registerHospital(addrHospital, EMAIL2, "d2", "o2");

        address other = vm.addr(55);
        vm.expectRevert(bytes("domain used"));
        core.registerHospital(other, EMAIL2, "d1", "o2");

        vm.expectRevert(bytes("email used"));
        core.registerHospital(other, EMAIL1, "d3", "o3");
    }

    function test_activateHospital_onlyAdmin_andLifecycle() public {
        core.registerHospital(addrHospital, EMAIL1, "d-hosp", "o-hosp");

        // Non admin cannot activate
        vm.prank(addrOther);
        vm.expectRevert(zkMedCore.NotAdmin.selector);
        core.activateHospital(addrHospital);

        // Admin can activate
        _addBasic(addrBasic);
        vm.prank(addrBasic);
        core.activateHospital(addrHospital);
        ( , bool isActive1) = core.getRole(addrHospital);
        assertTrue(isActive1);

        // Admin can deactivate
        vm.prank(addrBasic);
        core.deactivateHospital(addrHospital);
        ( , bool isActive2) = core.getRole(addrHospital);
        assertFalse(isActive2);
    }

    // Insurer registration + known library behavior
    function test_registerInsurer_success_andEvent_butNotActive() public {
        vm.expectEmit(true, true, true, true);
        emit InsurerRegistered(addrInsurer, "ins.test", EMAIL2, "InsOrg");
        core.registerInsurer(addrInsurer, EMAIL2, "ins.test", "InsOrg");
        assertEq(core.getTotalInsurers(), 1);
        assertFalse(core.isInsurerRegistered(addrInsurer));
        (string memory role, bool isActive) = core.getRole(addrInsurer);
        assertEq(role, "UNREGISTERED");
        assertFalse(isActive);
    }

    function test_registerInsurer_revertsOnInvalidsAndDuplicates() public {
        vm.expectRevert(bytes("invalid insurer"));
        core.registerInsurer(address(0), EMAIL1, "d1", "o1");

        vm.expectRevert(bytes("invalid email"));
        core.registerInsurer(addrInsurer, bytes32(0), "d1", "o1");

        vm.expectRevert(bytes("invalid domain"));
        core.registerInsurer(addrInsurer, EMAIL1, "", "o1");

        vm.expectRevert(bytes("invalid org"));
        core.registerInsurer(addrInsurer, EMAIL1, "d1", "");

        core.registerInsurer(addrInsurer, EMAIL1, "d1", "o1");
        vm.expectRevert(bytes("already registered"));
        core.registerInsurer(addrInsurer, EMAIL2, "d2", "o2");

        address other = vm.addr(77);
        vm.expectRevert(bytes("domain used"));
        core.registerInsurer(other, EMAIL2, "d1", "o2");

        vm.expectRevert(bytes("email used"));
        core.registerInsurer(other, EMAIL1, "d3", "o3");
    }

    function test_activateInsurer_reverts_notRegistered_dueToLibrary() public {
        core.registerInsurer(addrInsurer, EMAIL1, "d-ins", "o-ins");
        _addBasic(addrBasic);
        vm.prank(addrBasic);
        vm.expectRevert(bytes("not registered"));
        core.activateInsurer(addrInsurer);
    }

    function test_deactivateInsurer_reverts_notRegistered_dueToLibrary() public {
        core.registerInsurer(addrInsurer, EMAIL1, "d-ins", "o-ins");
        _addBasic(addrBasic);
        vm.prank(addrBasic);
        vm.expectRevert(bytes("not registered"));
        core.deactivateInsurer(addrInsurer);
    }


    // Views and stats
    function test_views_and_stats_flow() public {
        // Initially
        assertEq(core.getTotalPatients(), 0);
        assertEq(core.getTotalHospitals(), 0);
        assertEq(core.getTotalInsurers(), 0);

        // Register entities
        core.registerPatient(addrPatient, EMAIL1);
        core.registerHospital(addrHospital, EMAIL2, "domH", "orgH");
        core.registerInsurer(addrInsurer, EMAIL3, "domI", "orgI");

        // Totals and stats
        assertEq(core.getTotalPatients(), 1);
        assertEq(core.getTotalHospitals(), 1);
        assertEq(core.getTotalInsurers(), 1);

        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = core.getRegistrationStats();
        assertEq(totalUsers, 3);
        assertEq(patients, 1);
        assertEq(hospitals, 1);
        assertEq(insurers, 1);

        // Role and registration checks
        assertTrue(core.isPatientRegistered(addrPatient));
        assertTrue(core.isHospitalRegistered(addrHospital));
        assertFalse(core.isInsurerRegistered(addrInsurer));

        (string memory roleP, bool activeP) = core.getRole(addrPatient);
        assertEq(roleP, "PATIENT");
        assertTrue(activeP);

        (string memory roleH, bool activeH) = core.getRole(addrHospital);
        assertEq(roleH, "HOSPITAL");
        assertFalse(activeH);

        (string memory roleI, bool activeI) = core.getRole(addrInsurer);
        assertEq(roleI, "UNREGISTERED");
        assertFalse(activeI);

        assertTrue(core.isUserRegistered(addrPatient));
        assertTrue(core.isUserRegistered(addrHospital));
        assertFalse(core.isUserRegistered(addrInsurer));
        assertFalse(core.isUserRegistered(addrOther));
    }
}

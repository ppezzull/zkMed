// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Test} from "forge-std/Test.sol";
import {zkMedCore} from "../../../contracts/zkMed/core/zkMedCore.sol";
import {MockUSDC} from "../../../contracts/zkMed/mocks/MockUSDC.sol";
import {AdminLib} from "../../../contracts/zkMed/libraries/AdminLib.sol";
import {HospitalLib} from "../../../contracts/zkMed/libraries/HospitalLib.sol";
import {InsurerLib} from "../../../contracts/zkMed/libraries/InsurerLib.sol";
import {PatientLib} from "../../../contracts/zkMed/libraries/PatientLib.sol";

contract zkMedCoreTest is Test {
    MockUSDC public mockUSDC;
    zkMedCore public core;

    address public superAdmin;
    address public moderator;
    address public basic;
    address public patient;
    address public hospital;
    address public insurance;

    function setUp() public {
        superAdmin = address(this);
        moderator = vm.addr(1);
        basic = vm.addr(2);
        patient = vm.addr(3);
        hospital = vm.addr(4);
        insurance = vm.addr(5);

        mockUSDC = new MockUSDC();
        core = new zkMedCore(address(mockUSDC));
    }

    function test_addAdmin() public {
        vm.prank(superAdmin);
        core.addAdmin(moderator, AdminLib.AdminRole.MODERATOR);
        assertEq(core.isAdmin(moderator), true);
    }

    function test_deactivateAdmin() public {
        vm.prank(superAdmin);
        core.addAdmin(moderator, AdminLib.AdminRole.MODERATOR);
        vm.prank(moderator);
        core.deactivateAdmin(moderator);
        assertEq(core.isAdmin(moderator), false);
    }

    function test_deactivateUser() public {
        vm.prank(superAdmin);
        core.deactivateUser(patient);
        assertEq(core.isPatientRegistered(patient), false);
    }

    function test_getRegistrationStats() public {
    }
}
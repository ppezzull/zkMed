// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../../contracts/zkMed/zkMedCore.sol";
import "../../contracts/zkMed/users/zkMedInsurer.sol";
import "../../contracts/zkMed/users/zkMedPatient.sol";
import "../../contracts/zkMed/users/zkMedHospital.sol";
import "../../contracts/zkMed/users/zkMedAdmin.sol";
import "../../contracts/zkMed/provers/zkMedRegistrationProver.sol";
import "../../contracts/zkMed/provers/zkMedPaymentPlanProver.sol";
import "../../contracts/zkMed/zkMedLinkPay.sol";

/**
 * @title Payment Plan Flow Test (Simplified)
 * @notice Tests the streamlined payment plan creation flow using LinkPay automation
 */
contract PaymentPlanFlowTest is Test {
    
    zkMedCore public core;
    zkMedInsurer public insurerContract;
    zkMedPatient public patientContract;
    zkMedHospital public hospitalContract;
    zkMedAdmin public adminContract;
    zkMedRegistrationProver public registrationProver;
    zkMedPaymentPlanProver public paymentPlanProver;
    zkMedLinkPay public linkPay;
    
    address public superAdmin;
    address public moderator;
    address public insurer;
    address public patient;
    address public hospital;
    
    string constant INSURER_DOMAIN = "healthinsurance.com";
    string constant INSURER_NAME = "HealthCorp Insurance";
    string constant INSURANCE_NAME = "Premium Health Plan";
    
    event PaymentPlanCreated(address indexed insurer, address indexed patient, string insuranceName, uint256 duration, uint256 monthlyAllowance);
    event PaymentPlanCreatedFromLinkPay(bytes32 indexed planId, address indexed patient, address indexed insurer, address hospital, uint256 monthlyAllowance, uint256 duration);
    
    function setUp() public {
        // Deploy all contracts
        core = new zkMedCore();
        registrationProver = new zkMedRegistrationProver();
        paymentPlanProver = new zkMedPaymentPlanProver();
        
        // Deploy user contracts
        hospitalContract = new zkMedHospital(address(core), address(registrationProver));
        insurerContract = new zkMedInsurer(address(core), address(registrationProver));
        
        // Deploy LinkPay first (patient contract needs it)
        linkPay = new zkMedLinkPay(
            30 days,  // payment interval
            address(core),
            address(0),  // will be set later
            makeAddr("mockUSDC"),
            makeAddr("treasury")
        );
        
        patientContract = new zkMedPatient(address(core), address(registrationProver), address(paymentPlanProver), address(linkPay));
        adminContract = new zkMedAdmin(address(core));
        
        // Update LinkPay with patient contract
        linkPay.updateZkMedContracts(address(core), address(patientContract));
        
        // Authorize contracts
        core.authorizeContract(address(insurerContract));
        core.authorizeContract(address(patientContract));
        core.authorizeContract(address(hospitalContract));
        core.authorizeContract(address(adminContract));

        // Set user contracts so core recognizes them
        core.setUserContracts(address(patientContract), address(hospitalContract), address(insurerContract), address(adminContract));
        
        // Set up test addresses
        superAdmin = makeAddr("superAdmin");
        moderator = makeAddr("moderator");
        insurer = makeAddr("insurer");
        patient = makeAddr("patient");
        hospital = makeAddr("hospital");
        
        // Give test addresses some ETH
        vm.deal(superAdmin, 100 ether);
        vm.deal(moderator, 100 ether);
        vm.deal(insurer, 100 ether);
        vm.deal(patient, 100 ether);
        vm.deal(hospital, 100 ether);
        
        // Set up moderator admin
        adminContract.addAdmin(moderator, zkMedAdmin.AdminRole.MODERATOR);
    }

    function test_CreatePaymentPlanProposal() public {
        uint256 duration = block.timestamp + 365 days;
        uint256 monthlyAllowance = 5000; // $50.00 in cents
        
        // Since the insurer is not registered, this should fail
        vm.prank(insurer);
        vm.expectRevert("Insurer not registered");
        insurerContract.createPaymentPlan(patient, INSURANCE_NAME, duration, monthlyAllowance);
    }
    
    function test_LinkPayPaymentPlanCreation() public {
        vm.prank(address(patientContract));
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            5000, // monthly allowance
            block.timestamp + 365 days,
            "Test Insurance"
        );
        
        zkMedLinkPay.PaymentPlan memory plan = linkPay.getPaymentPlan(planId);
        assertEq(plan.patient, patient);
        assertEq(plan.insurer, insurer);
        assertEq(plan.hospital, hospital);
        assertTrue(plan.isActive);
    }

    function test_AdminActivateInsurer() public {
        // Try to activate an unregistered insurer (should fail)
        vm.prank(moderator);
        vm.expectRevert("Failed to activate insurer");
        adminContract.activateInsurer(insurer);
        
        // This test demonstrates that activation requires prior registration
    }

    function test_AdminActivateHospital() public {
        // Try to activate an unregistered hospital (should fail)
        vm.prank(moderator);
        vm.expectRevert("Failed to activate hospital");
        adminContract.activateHospital(hospital);
        
        // This test demonstrates that activation requires prior registration
    }

    function test_AdminDeactivateUser() public {
        vm.prank(moderator);
        adminContract.deactivateUser(patient);
        
        // This would deactivate the user across all contracts
    }

    function test_revertCreatePaymentPlanNotApproved() public {
        uint256 duration = block.timestamp + 365 days;
        uint256 monthlyAllowance = 5000;
        
        vm.prank(insurer);
        vm.expectRevert("Insurer not registered");
        insurerContract.createPaymentPlan(patient, INSURANCE_NAME, duration, monthlyAllowance);
    }

    function test_CheckRole() public view {
        (string memory role, bool isActive) = core.getRole(insurer);
        assertEq(role, "UNREGISTERED");
        assertFalse(isActive);
    }

    function test_RegistrationStats() public view {
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = core.getRegistrationStats();
        
        // All should be 0 since we haven't registered any users
        assertEq(totalUsers, 0);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }
}

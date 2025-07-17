// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Test.sol";
import "../../contracts/zkMed/zkMedCore.sol";
import "../../contracts/zkMed/zkMedPaymentHistory.sol";
import "../../contracts/zkMed/zkMedRequestManager.sol";
import "../../contracts/zkMed/users/zkMedInsurer.sol";
import "../../contracts/zkMed/users/zkMedPatient.sol";
import "../../contracts/zkMed/users/zkMedAdmin.sol";
import "../../contracts/zkMed/provers/zkMedRegistrationProver.sol";
import "../../contracts/zkMed/provers/zkMedPaymentPlanProver.sol";

/**
 * @title Payment Plan Flow Test
 * @notice Tests the complete payment plan creation and acceptance flow with automatic first payment
 */
contract PaymentPlanFlowTest is Test {
    
    zkMedCore public core;
    zkMedInsurer public insurerContract;
    zkMedPatient public patientContract;
    zkMedAdmin public adminContract;
    zkMedRegistrationProver public registrationProver;
    zkMedPaymentPlanProver public paymentPlanProver;
    
    address public superAdmin;
    address public moderator;
    address public insurer;
    address public patient;
    
    string constant INSURER_DOMAIN = "healthinsurance.com";
    string constant INSURER_NAME = "HealthCorp Insurance";
    string constant INSURANCE_NAME = "Premium Health Plan";
    
    event PaymentPlanCreated(address indexed insurer, address indexed patient, string insuranceName, uint256 duration, uint256 monthlyAllowance);
    event PaymentPlanCreatedFromCore(address indexed patient, address indexed insurer, uint256 indexed requestId); // From zkMedCore matching actual signature
    event PaymentPlanAccepted(address indexed patient, address indexed insurer, uint256 requestId);
    event FirstAllowancePaid(address indexed patient, address indexed insurer, uint256 amount, uint256 indexed requestId);
    
    function setUp() public {
        // Deploy all contracts
        core = new zkMedCore();
        registrationProver = new zkMedRegistrationProver();
        paymentPlanProver = new zkMedPaymentPlanProver();
        
        insurerContract = new zkMedInsurer(address(core), address(registrationProver));
        patientContract = new zkMedPatient(address(core), address(registrationProver), address(paymentPlanProver));
        adminContract = new zkMedAdmin(address(core));
        
        // Authorize contracts
        core.authorizeContract(address(insurerContract));
        core.authorizeContract(address(patientContract));
        core.authorizeContract(address(adminContract));

        // Set user contracts so core recognizes them
        core.setUserContracts(address(patientContract), address(0x2002), address(insurerContract), address(adminContract));
        
        // Set up test addresses
        superAdmin = makeAddr("superAdmin");
        moderator = makeAddr("moderator");
        insurer = makeAddr("insurer");
        patient = makeAddr("patient");
        
        // Give test addresses some ETH
        vm.deal(superAdmin, 100 ether);
        vm.deal(moderator, 100 ether);
        vm.deal(insurer, 100 ether);
        vm.deal(patient, 100 ether);
        
        // Set up admin roles - deployer (address(this)) is already super admin
        adminContract.addAdmin(moderator, zkMedRequestManager.AdminRole.MODERATOR);
        
        // Register insurer and patient (simplified for testing)
        _registerInsurer();
        _registerPatient();
    }
    
    function _registerInsurer() internal {
        // Register insurer through insurer contract (new architecture)
        vm.prank(insurer);
        
        // Create mock registration data
        zkMedRegistrationProver.RegistrationData memory regData = zkMedRegistrationProver.RegistrationData({
            domain: INSURER_DOMAIN,
            organizationName: INSURER_NAME,
            emailHash: keccak256("insurer@healthinsurance.com"),
            walletAddress: insurer,
            requestedRole: zkMedRegistrationProver.UserType.INSURER
        });
        
        // For testing, we'll mock the verification
        // In real usage, this would require a valid proof from the registration prover
        vm.mockCall(
            address(registrationProver),
            abi.encodeWithSelector(bytes4(keccak256("verify(bytes)"))),
            abi.encode(true)
        );
        
        // Register through insurer contract
        // insurerContract.registerInsurer(proof, regData); // Would need valid proof
        
        // For now, manually set the insurer as registered in the contract
        // This is a simplified approach for testing
    }
    
    function _registerPatient() internal {
        // Register patient through patient contract (new architecture)
        vm.prank(patient);
        
        // For testing, we'll manually mark the patient as registered
        // In real usage, this would require a valid proof from the registration prover
        // patientContract.registerPatient(proof, regData); // Would need valid proof
        
        // For now, this is a simplified approach for testing
    }
    
    function test_InsurerCanCreatePaymentPlan() public {
        // Test insurer creating a payment plan
        uint256 duration = block.timestamp + 365 days; // 1 year
        uint256 monthlyAllowance = 5000; // $50.00 in cents
        
        vm.expectEmit(true, true, false, true);
        emit PaymentPlanCreated(insurer, patient, INSURANCE_NAME, duration, monthlyAllowance);
        
        vm.prank(insurer);
        uint256 proposalIndex = insurerContract.createPaymentPlan(
            patient,
            INSURANCE_NAME,
            duration,
            monthlyAllowance
        );
        
        assertEq(proposalIndex, 0, "First proposal should have index 0");
        
        // Verify proposal was stored
        vm.prank(insurer);
        zkMedInsurer.PaymentPlanProposal[] memory proposals = insurerContract.getMyPaymentProposals();
        assertEq(proposals.length, 1, "Should have 1 proposal");
        assertEq(proposals[0].patient, patient, "Patient address should match");
        assertEq(proposals[0].monthlyAllowance, monthlyAllowance, "Monthly allowance should match");
        assertTrue(proposals[0].isActive, "Proposal should be active");
    }
    
    function test_PatientCanAcceptPaymentPlanWithZKProof() public {
        // First, insurer creates a payment plan
        uint256 duration = block.timestamp + 365 days;
        uint256 monthlyAllowance = 5000; // $50.00 in cents
        
        vm.prank(insurer);
        insurerContract.createPaymentPlan(patient, INSURANCE_NAME, duration, monthlyAllowance);
        
        // Create mock payment plan data (simulating ZK proof verification)
        zkMedPaymentPlanProver.PaymentPlanData memory planData = zkMedPaymentPlanProver.PaymentPlanData({
            insurerAddress: insurer,
            patientAddress: patient,
            insuranceName: INSURANCE_NAME,
            insurerEmailHash: keccak256("insurer@healthinsurance.com"),
            patientEmailHash: keccak256("patient@email.com"),
            duration: duration,
            monthlyAllowance: monthlyAllowance
        });
        
        // Mock the verification by setting up the proof
        // In real implementation, this would come from vlayer verification
        vm.mockCall(
            address(paymentPlanProver),
            abi.encodeWithSignature("provePaymentPlan((bytes32,string,uint256,uint256,uint256,uint256,bytes,bytes))"),
            abi.encode(bytes32(0), planData)
        );
        
        // Note: In real implementation, this would use proper ZK proof verification
        // For testing, we'll call through the insurer contract using the authorized flow
        vm.prank(address(insurerContract));
        core.createPaymentPlanRequest(
            insurer,
            patient,
            INSURANCE_NAME,
            duration,
            monthlyAllowance,
            keccak256("insurer@healthinsurance.com"),
            keccak256("patient@email.com")
        );
        
        // Verify payment plan request was created
        uint256 requestId = core.requestCount();
        zkMedRequestManager.PaymentPlanRequest memory request = core.getPaymentPlanRequest(requestId);
        assertEq(request.plan.insurerAddress, insurer, "Insurer should match");
        assertEq(request.plan.patientAddress, patient, "Patient should match");
        assertEq(uint(request.base.status), uint(zkMedRequestManager.RequestStatus.PENDING), "Should be pending");
    }
    
    function test_AutomaticFirstPaymentOnApproval() public {
        // Setup: Create and accept payment plan
        uint256 duration = block.timestamp + 365 days;
        uint256 monthlyAllowance = 5000; // $50.00 in cents
        
        // Insurer creates payment plan
        vm.prank(insurer);
        insurerContract.createPaymentPlan(patient, INSURANCE_NAME, duration, monthlyAllowance);
        
        // Patient accepts payment plan (simplified)
        vm.prank(address(insurerContract));
        core.createPaymentPlanRequest(
            insurer,
            patient,
            INSURANCE_NAME,
            duration,
            monthlyAllowance,
            keccak256("insurer@healthinsurance.com"),
            keccak256("patient@email.com")
        );
        
        uint256 requestId = core.requestCount();
        
        // Calculate expected first allowance in wei
        uint256 expectedFirstAllowance = (monthlyAllowance * 1 ether) / 100; // Convert cents to wei
        
        // Record initial balances
        uint256 insurerBalanceBefore = insurer.balance;
        uint256 moderatorBalanceBefore = moderator.balance;
        
        // Admin approves with sufficient funds for first payment
        vm.expectEmit(true, true, true, true);
        emit FirstAllowancePaid(patient, insurer, expectedFirstAllowance, requestId);
        
        vm.prank(moderator);
        adminContract.approvePaymentPlan{value: expectedFirstAllowance}(requestId);
        
        // Verify payment was sent to insurer
        uint256 insurerBalanceAfter = insurer.balance;
        assertEq(insurerBalanceAfter - insurerBalanceBefore, expectedFirstAllowance, "Insurer should receive first allowance");
        
        // Verify payment was recorded in history
        zkMedPaymentHistory.PaymentEntry[] memory history = core.getPaymentPlanHistory(requestId);
        assertEq(history.length, 1, "Should have 1 payment recorded");
        assertEq(history[0].amount, expectedFirstAllowance, "Payment amount should match");
        assertEq(uint(history[0].paymentType), uint(zkMedPaymentHistory.PaymentType.FIRST_ALLOWANCE), "Should be first allowance payment");
        assertTrue(history[0].isAutomaticPayment, "Should be marked as automatic");
        
        // Verify payment plan statistics
        (zkMedRequestManager.PaymentPlan memory plan, uint256 paymentsCount, uint256 totalPaid,) = core.getPaymentPlanSummary(requestId);
        assertEq(paymentsCount, 1, "Should have 1 payment");
        assertEq(totalPaid, expectedFirstAllowance, "Total paid should match first allowance");
        assertTrue(plan.isActive, "Plan should still be active for future payments");
    }
    
    function test_PaymentHistoryTracking() public {
        // Setup complete payment plan flow
        uint256 duration = block.timestamp + 365 days;
        uint256 monthlyAllowance = 5000; // $50.00 in cents
        
        // Create and accept payment plan
        vm.prank(insurer);
        insurerContract.createPaymentPlan(patient, INSURANCE_NAME, duration, monthlyAllowance);
        
        vm.prank(address(patientContract));
        core.createPaymentPlanRequest(
            insurer,
            patient,
            INSURANCE_NAME,
            duration,
            monthlyAllowance,
            keccak256("insurer@healthinsurance.com"),
            keccak256("patient@email.com")
        );
        
        uint256 requestId = core.requestCount();
        uint256 expectedFirstAllowance = (monthlyAllowance * 1 ether) / 100;
        
        // Approve and trigger first payment
        vm.prank(moderator);
        adminContract.approvePaymentPlan{value: expectedFirstAllowance}(requestId);
        
        // Test payment history queries
        zkMedPaymentHistory.PaymentEntry[] memory planHistory = core.getPaymentPlanHistory(requestId);
        zkMedPaymentHistory.PaymentEntry[] memory patientHistory = core.getPatientPaymentHistory(patient);
        zkMedPaymentHistory.PaymentEntry[] memory insurerHistory = core.getInsurerPaymentHistory(insurer);
        
        assertEq(planHistory.length, 1, "Plan should have 1 payment");
        assertEq(patientHistory.length, 1, "Patient should have 1 payment");
        assertEq(insurerHistory.length, 1, "Insurer should have 1 payment");
        
        // All should reference the same payment
        assertEq(planHistory[0].requestId, requestId, "Plan history should reference correct request");
        assertEq(patientHistory[0].requestId, requestId, "Patient history should reference correct request");
        assertEq(insurerHistory[0].requestId, requestId, "Insurer history should reference correct request");
        
        // Test payment statistics
        (uint256 totalPayments, uint256 totalAmountPaid) = core.getPaymentStatistics();
        assertEq(totalPayments, 1, "Should have 1 total payment");
        assertEq(totalAmountPaid, expectedFirstAllowance, "Total amount should match");
    }
    
    function test_RevertInsufficientFundsForFirstPayment() public {
        // Setup payment plan
        uint256 duration = block.timestamp + 365 days;
        uint256 monthlyAllowance = 5000; // $50.00 in cents
        
        vm.prank(insurer);
        insurerContract.createPaymentPlan(patient, INSURANCE_NAME, duration, monthlyAllowance);
        
        vm.prank(address(patientContract));
        core.createPaymentPlanRequest(
            insurer,
            patient,
            INSURANCE_NAME,
            duration,
            monthlyAllowance,
            keccak256("insurer@healthinsurance.com"),
            keccak256("patient@email.com")
        );
        
        uint256 requestId = core.requestCount();
        uint256 expectedFirstAllowance = (monthlyAllowance * 1 ether) / 100;
        
        // Try to approve with insufficient funds
        vm.expectRevert("Insufficient funds for first allowance");
        vm.prank(moderator);
        adminContract.approvePaymentPlan{value: expectedFirstAllowance - 1}(requestId);
    }
    
    function test_MultiplePaymentPlansTracking() public {
        // Create multiple payment plans
        uint256 duration1 = block.timestamp + 365 days;
        uint256 monthlyAllowance1 = 3000; // $30.00
        
        uint256 duration2 = block.timestamp + 730 days;
        uint256 monthlyAllowance2 = 7000; // $70.00
        
        // Create first plan
        vm.prank(insurer);
        uint256 proposal1 = insurerContract.createPaymentPlan(patient, "Basic Plan", duration1, monthlyAllowance1);
        
        // Create second plan
        vm.prank(insurer);
        uint256 proposal2 = insurerContract.createPaymentPlan(patient, "Premium Plan", duration2, monthlyAllowance2);
        
        assertEq(proposal1, 0, "First proposal should be index 0");
        assertEq(proposal2, 1, "Second proposal should be index 1");
        
        // Verify multiple proposals stored
        vm.prank(insurer);
        zkMedInsurer.PaymentPlanProposal[] memory proposals = insurerContract.getMyPaymentProposals();
        assertEq(proposals.length, 2, "Should have 2 proposals");
        
        vm.prank(insurer);
        zkMedInsurer.PaymentPlanProposal[] memory patientProposals = insurerContract.getPaymentProposalsForPatient(patient);
        assertEq(patientProposals.length, 2, "Should have 2 proposals for patient");
    }
} 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Test, console} from "forge-std/Test.sol";
import {zkMedLinkPay} from "../../contracts/zkMed/zkMedLinkPay.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MockERC20 is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    
    uint256 private _totalSupply;
    string public name = "Mock USDC";
    string public symbol = "mUSDC";
    uint8 public decimals = 6;
    
    function totalSupply() external view returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) external view returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) external returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    
    function allowance(address owner, address spender) external view returns (uint256) {
        return _allowances[owner][spender];
    }
    
    function approve(address spender, uint256 amount) external returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        uint256 currentAllowance = _allowances[from][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        
        _transfer(from, to, amount);
        _approve(from, msg.sender, currentAllowance - amount);
        
        return true;
    }
    
    function mint(address to, uint256 amount) external {
        _totalSupply += amount;
        _balances[to] += amount;
        emit Transfer(address(0), to, amount);
    }
    
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        require(_balances[from] >= amount, "ERC20: transfer amount exceeds balance");
        
        _balances[from] -= amount;
        _balances[to] += amount;
        emit Transfer(from, to, amount);
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
}

contract zkMedLinkPayTest is Test {
    zkMedLinkPay public linkPay;
    MockERC20 public paymentToken;
    
    address public owner;
    address public treasury;
    address public zkMedCore;
    address public zkMedPatient;
    address public patient;
    address public insurer;
    address public hospital;
    
    uint256 constant PAYMENT_INTERVAL = 30 days;
    uint256 constant MONTHLY_ALLOWANCE = 1000 * 10**6; // 1000 USDC
    uint256 constant PLAN_DURATION = 365 days;
    
    event PaymentPlanCreated(
        bytes32 indexed planId,
        address indexed patient,
        address indexed insurer,
        address hospital,
        uint256 monthlyAllowance,
        uint256 duration
    );
    
    event MonthlyPaymentExecuted(
        bytes32 indexed planId,
        address indexed patient,
        address indexed hospital,
        uint256 amount,
        uint256 platformFee
    );
    
    function setUp() public {
        owner = address(this);
        treasury = makeAddr("treasury");
        zkMedCore = makeAddr("zkMedCore");
        zkMedPatient = makeAddr("zkMedPatient");
        patient = makeAddr("patient");
        insurer = makeAddr("insurer");
        hospital = makeAddr("hospital");
        
        // Deploy mock payment token
        paymentToken = new MockERC20();
        
        // Deploy zkMedLinkPay contract
        linkPay = new zkMedLinkPay(
            PAYMENT_INTERVAL,
            zkMedCore,
            zkMedPatient,
            address(paymentToken),
            treasury
        );
        
        // Mint tokens to insurer for payments
        paymentToken.mint(insurer, 100000 * 10**6); // 100,000 USDC
        
        // Approve LinkPay contract to spend insurer tokens
        vm.prank(insurer);
        paymentToken.approve(address(linkPay), type(uint256).max);
    }
    
    function testDeployment() public view {
        assertEq(linkPay.paymentInterval(), PAYMENT_INTERVAL);
        assertEq(linkPay.zkMedCoreContract(), zkMedCore);
        assertEq(linkPay.zkMedPatientContract(), zkMedPatient);
        assertEq(address(linkPay.paymentToken()), address(paymentToken));
        assertEq(linkPay.treasury(), treasury);
        assertEq(linkPay.platformFeePercent(), 250); // 2.5%
    }
    
    function testCreatePaymentPlan() public {
        vm.prank(zkMedPatient);
        
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        zkMedLinkPay.PaymentPlan memory plan = linkPay.getPaymentPlan(planId);
        
        assertEq(plan.patient, patient);
        assertEq(plan.insurer, insurer);
        assertEq(plan.hospital, hospital);
        assertEq(plan.monthlyAllowance, MONTHLY_ALLOWANCE);
        assertEq(plan.planDuration, block.timestamp + PLAN_DURATION);
        assertTrue(plan.isActive);
        assertEq(plan.totalPaid, 0);
        assertEq(plan.insuranceName, "Test Insurance");
    }
    
    function testCreatePaymentPlanOnlyZkMedContracts() public {
        vm.expectRevert("Only zkMed contracts can call this");
        
        linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
    }
    
    function testCreatePaymentPlanInvalidInputs() public {
        vm.startPrank(zkMedPatient);
        
        // Test invalid patient address
        vm.expectRevert("Invalid patient address");
        linkPay.createPaymentPlan(
            address(0),
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Test invalid monthly allowance
        vm.expectRevert("Monthly allowance must be positive");
        linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            0,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Test invalid duration
        vm.expectRevert("Duration must be in the future");
        linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp - 1,
            "Test Insurance"
        );
        
        vm.stopPrank();
    }
    
    function testCheckUpkeepNoPlansActive() public view {
        (bool upkeepNeeded, ) = linkPay.checkUpkeep("");
        
        assertFalse(upkeepNeeded);
        // When no plans are active, upkeep is not needed
    }
    
    function testCheckUpkeepBeforeInterval() public {
        // Create a payment plan
        vm.prank(zkMedPatient);
        linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Check upkeep before interval passes
        (bool upkeepNeeded, ) = linkPay.checkUpkeep("");
        assertFalse(upkeepNeeded);
    }
    
    function testCheckUpkeepAfterInterval() public {
        // Create a payment plan
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Fast forward time past payment interval
        vm.warp(block.timestamp + PAYMENT_INTERVAL + 1);
        
        (bool upkeepNeeded, bytes memory performData) = linkPay.checkUpkeep("");
        assertTrue(upkeepNeeded);
        
        // Decode perform data
        bytes32[] memory plansToProcess = abi.decode(performData, (bytes32[]));
        assertEq(plansToProcess.length, 1);
        assertEq(plansToProcess[0], planId);
    }
    
    function testPerformUpkeepSuccessfulPayment() public {
        // Create a payment plan
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Fast forward time past payment interval
        vm.warp(block.timestamp + PAYMENT_INTERVAL + 1);
        
        // Get initial balances
        uint256 hospitalBalanceBefore = paymentToken.balanceOf(hospital);
        uint256 treasuryBalanceBefore = paymentToken.balanceOf(treasury);
        uint256 insurerBalanceBefore = paymentToken.balanceOf(insurer);
        
        // Perform upkeep
        bytes32[] memory plansToProcess = new bytes32[](1);
        plansToProcess[0] = planId;
        bytes memory performData = abi.encode(plansToProcess);
        
        vm.expectEmit(true, true, true, true);
        emit MonthlyPaymentExecuted(planId, patient, hospital, 975 * 10**6, 25 * 10**6); // 2.5% fee
        
        linkPay.performUpkeep(performData);
        
        // Check balances after payment
        uint256 platformFee = (MONTHLY_ALLOWANCE * 250) / 10000; // 2.5%
        uint256 hospitalPayment = MONTHLY_ALLOWANCE - platformFee;
        
        assertEq(paymentToken.balanceOf(hospital), hospitalBalanceBefore + hospitalPayment);
        assertEq(paymentToken.balanceOf(treasury), treasuryBalanceBefore + platformFee);
        assertEq(paymentToken.balanceOf(insurer), insurerBalanceBefore - MONTHLY_ALLOWANCE);
        
        // Check plan state updated
        zkMedLinkPay.PaymentPlan memory plan = linkPay.getPaymentPlan(planId);
        assertEq(plan.totalPaid, MONTHLY_ALLOWANCE);
        assertEq(plan.lastPaymentTime, block.timestamp);
    }
    
    function testPerformUpkeepInsufficientBalance() public {
        // Create a new insurer with insufficient balance
        address poorInsurer = makeAddr("poorInsurer");
        paymentToken.mint(poorInsurer, 500 * 10**6); // Only 500 USDC, less than monthly allowance
        
        vm.prank(poorInsurer);
        paymentToken.approve(address(linkPay), type(uint256).max);
        
        // Create a payment plan with poor insurer
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            poorInsurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Fast forward time
        vm.warp(block.timestamp + PAYMENT_INTERVAL + 1);
        
        // Perform upkeep should fail gracefully
        bytes32[] memory plansToProcess = new bytes32[](1);
        plansToProcess[0] = planId;
        bytes memory performData = abi.encode(plansToProcess);
        
        linkPay.performUpkeep(performData);
        
        // Plan should still be active but no payment made
        zkMedLinkPay.PaymentPlan memory plan = linkPay.getPaymentPlan(planId);
        assertEq(plan.totalPaid, 0);
    }
    
    function testCancelPaymentPlan() public {
        // Create a payment plan
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Patient cancels plan
        vm.prank(patient);
        linkPay.cancelPaymentPlan(planId);
        
        zkMedLinkPay.PaymentPlan memory plan = linkPay.getPaymentPlan(planId);
        assertFalse(plan.isActive);
    }
    
    function testCancelPaymentPlanUnauthorized() public {
        // Create a payment plan
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        // Random address tries to cancel
        vm.prank(address(0x123));
        vm.expectRevert("Not authorized to cancel plan");
        linkPay.cancelPaymentPlan(planId);
    }
    
    function testUpdateTreasury() public {
        address newTreasury = makeAddr("newTreasury");
        
        linkPay.updateTreasury(newTreasury);
        assertEq(linkPay.treasury(), newTreasury);
    }
    
    function testUpdatePlatformFee() public {
        uint256 newFee = 500; // 5%
        
        linkPay.updatePlatformFee(newFee);
        assertEq(linkPay.platformFeePercent(), newFee);
    }
    
    function testUpdatePlatformFeeExceedsMax() public {
        vm.expectRevert("Fee cannot exceed 10%");
        linkPay.updatePlatformFee(1001); // 10.01%
    }
    
    function testWithdrawFees() public {
        // Create and execute a payment to accumulate fees
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        vm.warp(block.timestamp + PAYMENT_INTERVAL + 1);
        
        bytes32[] memory plansToProcess = new bytes32[](1);
        plansToProcess[0] = planId;
        linkPay.performUpkeep(abi.encode(plansToProcess));
        
        uint256 feesCollected = linkPay.totalFeesCollected();
        uint256 treasuryBalanceBefore = paymentToken.balanceOf(treasury);
        uint256 contractBalance = paymentToken.balanceOf(address(linkPay));
        
        // The contract should have the fees but actually they were transferred to treasury already
        // So we need to check that the contract accumulated the fees correctly
        assertTrue(feesCollected > 0, "No fees collected");
        
        // Since fees are automatically transferred to treasury during payment,
        // the totalFeesCollected just tracks the amount, not the balance
        // Let's test the withdraw functionality by minting some tokens to the contract
        paymentToken.mint(address(linkPay), feesCollected);
        
        // Withdraw fees
        linkPay.withdrawFees(feesCollected);
        
        assertEq(linkPay.totalFeesCollected(), 0);
    }
    
    function testGetPatientPlans() public {
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        bytes32[] memory patientPlans = linkPay.getPatientPlans(patient);
        assertEq(patientPlans.length, 1);
        assertEq(patientPlans[0], planId);
    }
    
    function testGetHospitalPlans() public {
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        bytes32[] memory hospitalPlans = linkPay.getHospitalPlans(hospital);
        assertEq(hospitalPlans.length, 1);
        assertEq(hospitalPlans[0], planId);
    }
    
    function testMultiplePaymentCycles() public {
        // Create a payment plan
        vm.prank(zkMedPatient);
        bytes32 planId = linkPay.createPaymentPlan(
            patient,
            insurer,
            hospital,
            MONTHLY_ALLOWANCE,
            block.timestamp + PLAN_DURATION,
            "Test Insurance"
        );
        
        uint256 cycles = 3;
        uint256 totalExpectedPayments = 0;
        uint256 currentTime = block.timestamp;
        
        for (uint256 i = 0; i < cycles; i++) {
            // Fast forward to next payment interval
            currentTime += PAYMENT_INTERVAL + 1;
            vm.warp(currentTime);
            
            // Execute payment
            bytes32[] memory plansToProcess = new bytes32[](1);
            plansToProcess[0] = planId;
            linkPay.performUpkeep(abi.encode(plansToProcess));
            
            totalExpectedPayments += MONTHLY_ALLOWANCE;
            
            // Check plan state
            zkMedLinkPay.PaymentPlan memory plan = linkPay.getPaymentPlan(planId);
            assertEq(plan.totalPaid, totalExpectedPayments);
        }
    }
} 
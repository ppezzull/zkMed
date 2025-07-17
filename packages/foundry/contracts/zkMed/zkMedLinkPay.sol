// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {AutomationCompatibleInterface} from "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title zkMed Link Pay - Automated Payment Contract
 * @notice Handles automated monthly payments for zkMed payment plans using Chainlink Automation
 * @dev Integrates with zkMedPatient contract for payment plan management
 */
contract zkMedLinkPay is AutomationCompatibleInterface, ReentrancyGuard, Ownable {
    
    // ======== Data Structures ========
    
    struct PaymentPlan {
        address patient;
        address insurer;
        address hospital;
        uint256 monthlyAllowance;
        uint256 planDuration;        // End timestamp
        uint256 lastPaymentTime;
        uint256 totalPaid;
        bool isActive;
        string insuranceName;
        bytes32 planId;
    }
    
    struct PaymentRecord {
        address patient;
        address hospital;
        uint256 amount;
        uint256 timestamp;
        bytes32 planId;
        bool successful;
    }
    
    // ======== State Variables ========
    
    // Automation settings
    uint256 public immutable paymentInterval;  // 30 days in seconds
    uint256 public lastUpkeepTime;
    
    // Contract integrations
    address public zkMedCoreContract;
    address public zkMedPatientContract;
    IERC20 public paymentToken;  // USDC or similar stablecoin
    
    // Payment plan storage
    mapping(bytes32 => PaymentPlan) public paymentPlans;
    mapping(address => bytes32[]) public patientPlans;
    mapping(address => bytes32[]) public hospitalPlans;
    bytes32[] public activePlans;
    
    // Payment history
    PaymentRecord[] public paymentHistory;
    mapping(bytes32 => uint256[]) public planPaymentHistory;
    
    // Treasury and fees
    address public treasury;
    uint256 public platformFeePercent = 250;  // 2.5% in basis points
    uint256 public totalFeesCollected;
    
    // ======== Events ========
    
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
    
    event PaymentPlanCanceled(bytes32 indexed planId, address indexed patient);
    event PaymentFailed(bytes32 indexed planId, address indexed patient, string reason);
    event TreasuryUpdated(address indexed newTreasury);
    event PlatformFeeUpdated(uint256 newFeePercent);
    
    // ======== Constructor ========
    
    constructor(
        uint256 _paymentInterval,
        address _zkMedCore,
        address _zkMedPatient,
        address _paymentToken,
        address _treasury
    ) Ownable(msg.sender) {
        paymentInterval = _paymentInterval;
        zkMedCoreContract = _zkMedCore;
        zkMedPatientContract = _zkMedPatient;
        paymentToken = IERC20(_paymentToken);
        treasury = _treasury;
        lastUpkeepTime = block.timestamp;
    }
    
    // ======== Modifiers ========
    
    modifier onlyZkMedContracts() {
        require(
            msg.sender == zkMedCoreContract || msg.sender == zkMedPatientContract,
            "Only zkMed contracts can call this"
        );
        _;
    }
    
    modifier validPlan(bytes32 planId) {
        require(paymentPlans[planId].isActive, "Payment plan not active");
        require(paymentPlans[planId].planDuration > block.timestamp, "Payment plan expired");
        _;
    }
    
    // ======== Chainlink Automation Functions ========
    
    /**
     * @dev Chainlink Automation check function
     * @return upkeepNeeded True if upkeep is needed
     * @return performData Encoded data for performUpkeep
     */
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        upkeepNeeded = (block.timestamp - lastUpkeepTime) > paymentInterval;
        
        if (upkeepNeeded) {
            // Find plans that need payment
            bytes32[] memory plansToProcess = new bytes32[](activePlans.length);
            uint256 count = 0;
            
            for (uint256 i = 0; i < activePlans.length; i++) {
                bytes32 planId = activePlans[i];
                PaymentPlan storage plan = paymentPlans[planId];
                
                if (plan.isActive && 
                    plan.planDuration > block.timestamp &&
                    (block.timestamp - plan.lastPaymentTime) >= paymentInterval) {
                    plansToProcess[count] = planId;
                    count++;
                }
            }
            
            // Resize array to actual count
            bytes32[] memory finalPlans = new bytes32[](count);
            for (uint256 i = 0; i < count; i++) {
                finalPlans[i] = plansToProcess[i];
            }
            
            performData = abi.encode(finalPlans);
            upkeepNeeded = count > 0;
        }
    }
    
    /**
     * @dev Chainlink Automation perform function
     * @param performData Encoded plan IDs to process
     */
    function performUpkeep(bytes calldata performData) external override nonReentrant {
        if ((block.timestamp - lastUpkeepTime) > paymentInterval) {
            lastUpkeepTime = block.timestamp;
            
            bytes32[] memory plansToProcess = abi.decode(performData, (bytes32[]));
            
            for (uint256 i = 0; i < plansToProcess.length; i++) {
                _executeMonthlyPayment(plansToProcess[i]);
            }
        }
    }
    
    // ======== Payment Plan Management ========
    
    /**
     * @dev Create a new payment plan (called by zkMedPatient)
     * @param patient Patient address
     * @param insurer Insurer address
     * @param hospital Hospital address receiving payments
     * @param monthlyAllowance Monthly payment amount
     * @param duration Plan duration in seconds
     * @param insuranceName Name of insurance provider
     */
    function createPaymentPlan(
        address patient,
        address insurer,
        address hospital,
        uint256 monthlyAllowance,
        uint256 duration,
        string memory insuranceName
    ) external onlyZkMedContracts returns (bytes32 planId) {
        require(patient != address(0), "Invalid patient address");
        require(insurer != address(0), "Invalid insurer address");
        require(hospital != address(0), "Invalid hospital address");
        require(monthlyAllowance > 0, "Monthly allowance must be positive");
        require(duration > block.timestamp, "Duration must be in the future");
        
        planId = keccak256(abi.encodePacked(patient, insurer, hospital, block.timestamp));
        
        paymentPlans[planId] = PaymentPlan({
            patient: patient,
            insurer: insurer,
            hospital: hospital,
            monthlyAllowance: monthlyAllowance,
            planDuration: duration,
            lastPaymentTime: block.timestamp,
            totalPaid: 0,
            isActive: true,
            insuranceName: insuranceName,
            planId: planId
        });
        
        patientPlans[patient].push(planId);
        hospitalPlans[hospital].push(planId);
        activePlans.push(planId);
        
        emit PaymentPlanCreated(planId, patient, insurer, hospital, monthlyAllowance, duration);
        
        return planId;
    }
    
    /**
     * @dev Cancel a payment plan
     * @param planId Plan ID to cancel
     */
    function cancelPaymentPlan(bytes32 planId) external {
        PaymentPlan storage plan = paymentPlans[planId];
        require(plan.isActive, "Plan not active");
        require(
            msg.sender == plan.patient || 
            msg.sender == plan.insurer || 
            msg.sender == owner(),
            "Not authorized to cancel plan"
        );
        
        plan.isActive = false;
        _removeFromActivePlans(planId);
        
        emit PaymentPlanCanceled(planId, plan.patient);
    }
    
    // ======== Payment Execution ========
    
    /**
     * @dev Execute monthly payment for a specific plan
     * @param planId Plan ID to process
     */
    function _executeMonthlyPayment(bytes32 planId) internal validPlan(planId) {
        PaymentPlan storage plan = paymentPlans[planId];
        
        // Check if payment is due
        if ((block.timestamp - plan.lastPaymentTime) < paymentInterval) {
            return;
        }
        
        uint256 paymentAmount = plan.monthlyAllowance;
        uint256 platformFee = (paymentAmount * platformFeePercent) / 10000;
        uint256 hospitalPayment = paymentAmount - platformFee;
        
        // Check insurer balance
        if (paymentToken.balanceOf(plan.insurer) < paymentAmount) {
            emit PaymentFailed(planId, plan.patient, "Insufficient insurer balance");
            return;
        }
        
        // Check allowance
        if (paymentToken.allowance(plan.insurer, address(this)) < paymentAmount) {
            emit PaymentFailed(planId, plan.patient, "Insufficient allowance");
            return;
        }
        
        try paymentToken.transferFrom(plan.insurer, plan.hospital, hospitalPayment) {
            // Transfer platform fee to treasury
            if (platformFee > 0) {
                paymentToken.transferFrom(plan.insurer, treasury, platformFee);
                totalFeesCollected += platformFee;
            }
            
            // Update plan state
            plan.lastPaymentTime = block.timestamp;
            plan.totalPaid += paymentAmount;
            
            // Record payment
            PaymentRecord memory record = PaymentRecord({
                patient: plan.patient,
                hospital: plan.hospital,
                amount: paymentAmount,
                timestamp: block.timestamp,
                planId: planId,
                successful: true
            });
            
            paymentHistory.push(record);
            planPaymentHistory[planId].push(paymentHistory.length - 1);
            
            emit MonthlyPaymentExecuted(planId, plan.patient, plan.hospital, hospitalPayment, platformFee);
            
        } catch {
            emit PaymentFailed(planId, plan.patient, "Transfer failed");
        }
        
        // Check if plan has expired
        if (block.timestamp >= plan.planDuration) {
            plan.isActive = false;
            _removeFromActivePlans(planId);
        }
    }
    
    /**
     * @dev Manual payment execution (emergency function)
     * @param planId Plan ID to process
     */
    function executePaymentManual(bytes32 planId) external onlyOwner {
        _executeMonthlyPayment(planId);
    }
    
    // ======== View Functions ========
    
    /**
     * @dev Get payment plan details
     * @param planId Plan ID
     * @return PaymentPlan struct
     */
    function getPaymentPlan(bytes32 planId) external view returns (PaymentPlan memory) {
        return paymentPlans[planId];
    }
    
    /**
     * @dev Get patient's payment plans
     * @param patient Patient address
     * @return Array of plan IDs
     */
    function getPatientPlans(address patient) external view returns (bytes32[] memory) {
        return patientPlans[patient];
    }
    
    /**
     * @dev Get hospital's payment plans
     * @param hospital Hospital address
     * @return Array of plan IDs
     */
    function getHospitalPlans(address hospital) external view returns (bytes32[] memory) {
        return hospitalPlans[hospital];
    }
    
    /**
     * @dev Get total number of active plans
     * @return uint256 Number of active plans
     */
    function getActivePlansCount() external view returns (uint256) {
        return activePlans.length;
    }
    
    /**
     * @dev Get payment history for a plan
     * @param planId Plan ID
     * @return Array of payment record indices
     */
    function getPlanPaymentHistory(bytes32 planId) external view returns (uint256[] memory) {
        return planPaymentHistory[planId];
    }
    
    /**
     * @dev Get payment record by index
     * @param index Payment record index
     * @return PaymentRecord struct
     */
    function getPaymentRecord(uint256 index) external view returns (PaymentRecord memory) {
        require(index < paymentHistory.length, "Invalid payment record index");
        return paymentHistory[index];
    }
    
    // ======== Admin Functions ========
    
    /**
     * @dev Update treasury address
     * @param newTreasury New treasury address
     */
    function updateTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "Invalid treasury address");
        treasury = newTreasury;
        emit TreasuryUpdated(newTreasury);
    }
    
    /**
     * @dev Update platform fee percentage
     * @param newFeePercent New fee percentage in basis points (max 1000 = 10%)
     */
    function updatePlatformFee(uint256 newFeePercent) external onlyOwner {
        require(newFeePercent <= 1000, "Fee cannot exceed 10%");
        platformFeePercent = newFeePercent;
        emit PlatformFeeUpdated(newFeePercent);
    }
    
    /**
     * @dev Update zkMed contract addresses
     * @param newCore New zkMedCore address
     * @param newPatient New zkMedPatient address
     */
    function updateZkMedContracts(address newCore, address newPatient) external onlyOwner {
        require(newCore != address(0) && newPatient != address(0), "Invalid contract addresses");
        zkMedCoreContract = newCore;
        zkMedPatientContract = newPatient;
    }
    
    /**
     * @dev Emergency withdrawal of accumulated fees
     * @param amount Amount to withdraw
     */
    function withdrawFees(uint256 amount) external onlyOwner {
        require(amount <= totalFeesCollected, "Amount exceeds collected fees");
        require(paymentToken.transfer(treasury, amount), "Transfer failed");
        totalFeesCollected -= amount;
    }
    
    // ======== Internal Helper Functions ========
    
    /**
     * @dev Remove plan from active plans array
     * @param planId Plan ID to remove
     */
    function _removeFromActivePlans(bytes32 planId) internal {
        for (uint256 i = 0; i < activePlans.length; i++) {
            if (activePlans[i] == planId) {
                activePlans[i] = activePlans[activePlans.length - 1];
                activePlans.pop();
                break;
            }
        }
    }
}

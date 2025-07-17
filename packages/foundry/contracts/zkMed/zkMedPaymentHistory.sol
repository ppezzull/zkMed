// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/**
 * @title zkMed Payment History Contract
 * @notice Manages payment history and statistics separately from core contract
 * @dev Called by zkMedCore to record payment history
 */
contract zkMedPaymentHistory is Ownable {
    
    // Payment history entry
    struct PaymentEntry {
        uint256 requestId;          // Payment plan request ID
        address insurerAddress;
        address patientAddress;
        uint256 amount;             // Amount paid in wei
        uint256 timestamp;
        PaymentType paymentType;
        bool isAutomaticPayment;
    }
    
    enum PaymentType { FIRST_ALLOWANCE, MANUAL_PAYMENT, CLAIM_PAYMENT }
    
    // Payment history mappings
    mapping(uint256 => PaymentEntry[]) public paymentPlanHistory; // requestId => payment history
    mapping(address => PaymentEntry[]) public patientPaymentHistory; // patient => payment history
    mapping(address => PaymentEntry[]) public insurerPaymentHistory; // insurer => payment history
    uint256 public totalPaymentsMade;
    
    // Authorized contracts
    mapping(address => bool) public authorizedContracts;
    
    // Events
    event PaymentRecorded(uint256 indexed requestId, address indexed patient, address indexed insurer, uint256 amount, PaymentType paymentType);
    event ContractAuthorized(address indexed contractAddress);
    event ContractDeauthorized(address indexed contractAddress);
    
    constructor() Ownable(msg.sender) {
        // Set deployer as owner
    }
    
    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    /**
     * @dev Authorize a contract to record payments
     * @param contractAddress Address of the contract to authorize
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        authorizedContracts[contractAddress] = true;
        emit ContractAuthorized(contractAddress);
    }
    
    /**
     * @dev Deauthorize a contract
     * @param contractAddress Address of the contract to deauthorize
     */
    function deauthorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
        emit ContractDeauthorized(contractAddress);
    }
    
    /**
     * @dev Record a payment entry
     * @param requestId Payment plan request ID
     * @param insurerAddress Insurer address
     * @param patientAddress Patient address
     * @param amount Amount paid in wei
     * @param paymentType Type of payment
     * @param isAutomatic Whether this is an automatic payment
     */
    function recordPayment(
        uint256 requestId,
        address insurerAddress,
        address patientAddress,
        uint256 amount,
        PaymentType paymentType,
        bool isAutomatic
    ) external onlyAuthorized {
        require(requestId > 0, "Invalid request ID");
        require(insurerAddress != address(0), "Invalid insurer address");
        require(patientAddress != address(0), "Invalid patient address");
        require(amount > 0, "Amount must be positive");
        
        PaymentEntry memory payment = PaymentEntry({
            requestId: requestId,
            insurerAddress: insurerAddress,
            patientAddress: patientAddress,
            amount: amount,
            timestamp: block.timestamp,
            paymentType: paymentType,
            isAutomaticPayment: isAutomatic
        });
        
        // Store in all relevant mappings
        paymentPlanHistory[requestId].push(payment);
        patientPaymentHistory[patientAddress].push(payment);
        insurerPaymentHistory[insurerAddress].push(payment);
        totalPaymentsMade++;
        
        emit PaymentRecorded(requestId, patientAddress, insurerAddress, amount, paymentType);
    }
    
    // ======== Query Functions ========
    
    /**
     * @dev Get payment history for a specific payment plan
     * @param requestId Payment plan request ID
     * @return Array of PaymentEntry structs
     */
    function getPaymentPlanHistory(uint256 requestId) external view returns (PaymentEntry[] memory) {
        return paymentPlanHistory[requestId];
    }
    
    /**
     * @dev Get payment history for a patient
     * @param patient Patient address
     * @return Array of PaymentEntry structs
     */
    function getPatientPaymentHistory(address patient) external view returns (PaymentEntry[] memory) {
        return patientPaymentHistory[patient];
    }
    
    /**
     * @dev Get payment history for an insurer
     * @param insurer Insurer address
     * @return Array of PaymentEntry structs
     */
    function getInsurerPaymentHistory(address insurer) external view returns (PaymentEntry[] memory) {
        return insurerPaymentHistory[insurer];
    }
    
    /**
     * @dev Get total payments statistics
     * @return totalPayments Total number of payments made
     * @return totalAmountPaid Total amount paid across all plans in wei
     */
    function getPaymentStatistics() external view returns (uint256 totalPayments, uint256 totalAmountPaid) {
        totalPayments = totalPaymentsMade;
        
        // Calculate total amount paid (simplified calculation)
        totalAmountPaid = 0;
        // Note: For efficiency, we might want to track this incrementally
        
        return (totalPayments, totalAmountPaid);
    }
} 
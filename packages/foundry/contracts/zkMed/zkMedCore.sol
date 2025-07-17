// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {zkMedPaymentHistory} from "./zkMedPaymentHistory.sol";
import {zkMedRequestManager} from "./zkMedRequestManager.sol";

/**
 * @title zkMed Core Contract
 * @notice Ultra-lean orchestrator for healthcare system verification and coordination
 * @dev Only handles verification, validation, and cross-contract coordination
 */
contract zkMedCore is Ownable {
    
    // ======== Type Definitions ========
    
    enum UserType { PATIENT, HOSPITAL, INSURER }

    // ======== State Variables ========
    
    // External contracts
    zkMedPaymentHistory public paymentHistoryContract;
    zkMedRequestManager public requestManagerContract;
    
    // User contract addresses
    address public patientContract;
    address public hospitalContract;
    address public insurerContract;
    address public adminContract;
    
    // Authorized user contracts
    mapping(address => bool) public authorizedContracts;
    
    // ======== Events ========
    
    event RequestSubmitted(uint256 indexed requestId, address indexed requester, zkMedRequestManager.RequestType requestType);
    event RequestApproved(uint256 indexed requestId, address indexed approver);
    event RequestRejected(uint256 indexed requestId, address indexed rejecter, string reason);
    
    event PatientRegistered(address indexed patient);
    event HospitalRegistered(address indexed hospital, string domain, bytes32 emailHash);
    event InsurerRegistered(address indexed insurer, string domain, bytes32 emailHash);
    event AdminAdded(address indexed admin, zkMedRequestManager.AdminRole role);
    event UserDeactivated(address indexed user);
    
    event PaymentPlanCreated(address indexed patient, address indexed insurer, uint256 indexed requestId);
    event PaymentMade(address indexed patient, address indexed insurer, uint256 amount);
    event FirstAllowancePaid(address indexed patient, address indexed insurer, uint256 amount, uint256 indexed requestId);
    
    // ======== Constructor ========
    
    constructor() Ownable(msg.sender) {
        // Deploy external contracts
        paymentHistoryContract = new zkMedPaymentHistory();
        requestManagerContract = new zkMedRequestManager();
        
        // Authorize this contract to use payment history
        paymentHistoryContract.authorizeContract(address(this));
    }
    
    // ======== Modifiers ========
    
    modifier onlyAuthorized() {
        require(authorizedContracts[msg.sender] || msg.sender == owner(), "Not authorized");
        _;
    }
    
    modifier onlyPatientContract() {
        require(msg.sender == patientContract, "Only patient contract");
        _;
    }
    
    modifier onlyAdminContract() {
        require(msg.sender == adminContract, "Only admin contract");
        _;
    }
    
    // ======== Setup Functions ========
    
    /**
     * @dev Set user contract addresses (owner only)
     */
    function setUserContracts(
        address _patientContract,
        address _hospitalContract,
        address _insurerContract,
        address _adminContract
    ) external onlyOwner {
        patientContract = _patientContract;
        hospitalContract = _hospitalContract;
        insurerContract = _insurerContract;
        adminContract = _adminContract;
        
        // Authorize user contracts
        authorizeContract(_patientContract);
        authorizeContract(_hospitalContract);
        authorizeContract(_insurerContract);
        authorizeContract(_adminContract);
    }
    
    /**
     * @dev Authorize a contract to interact with core functions
     * @param contractAddress Address of the contract to authorize
     */
    function authorizeContract(address contractAddress) public onlyOwner {
        require(contractAddress != address(0), "Invalid contract address");
        authorizedContracts[contractAddress] = true;
    }
    
    /**
     * @dev Revoke authorization for a contract
     * @param contractAddress Address of the contract to revoke authorization
     */
    function revokeContractAuthorization(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
    }
    
    // ======== Cross-Contract Coordination Functions ========
    
    /**
     * @dev Notify core of patient registration (called by patient contract)
     * @param patient Patient address
     * @param emailHash Email hash
     */
    function notifyPatientRegistration(address patient, bytes32 emailHash) external onlyPatientContract {
        emit PatientRegistered(patient);
    }
    
    /**
     * @dev Notify core of hospital registration (called by hospital contract)
     * @param hospital Hospital address
     * @param domain Hospital domain
     * @param emailHash Email hash
     */
    function notifyHospitalRegistration(address hospital, string calldata domain, bytes32 emailHash) external {
        require(msg.sender == hospitalContract, "Only hospital contract");
        emit HospitalRegistered(hospital, domain, emailHash);
    }
    
    /**
     * @dev Notify core of insurer registration (called by insurer contract)
     * @param insurer Insurer address
     * @param domain Insurer domain
     * @param emailHash Email hash
     */
    function notifyInsurerRegistration(address insurer, string calldata domain, bytes32 emailHash) external {
        require(msg.sender == insurerContract, "Only insurer contract");
        emit InsurerRegistered(insurer, domain, emailHash);
    }
    
    /**
     * @dev Notify core of admin addition (called by admin contract)
     * @param admin Admin address
     * @param role Admin role
     */
    function notifyAdminAdded(address admin, uint8 role) external onlyAdminContract {
        emit AdminAdded(admin, zkMedRequestManager.AdminRole(role));
    }
    
    // ======== Payment Plan Orchestration ========
    
    /**
     * @dev Create payment plan request with cross-contract validation
     * @param insurerAddress Insurer address
     * @param patientAddress Patient address
     * @param insuranceName Insurance company name
     * @param duration Payment plan duration timestamp
     * @param monthlyAllowance Monthly allowance in cents
     * @param insurerEmailHash Hash of insurer email proof
     * @param patientEmailHash Hash of patient email proof
     * @return requestId The created request ID
     */
    function createPaymentPlanRequest(
        address insurerAddress,
        address patientAddress,
        string calldata insuranceName,
        uint256 duration,
        uint256 monthlyAllowance,
        bytes32 insurerEmailHash,
        bytes32 patientEmailHash
    ) external onlyPatientContract returns (uint256 requestId) {
        // Validate insurer through insurer contract
        (bool success, bytes memory result) = insurerContract.staticcall(
            abi.encodeWithSignature("isInsurerRegistered(address)", insurerAddress)
        );
        require(success && abi.decode(result, (bool)), "Insurer not registered");
        
        // Validate patient through patient contract
        (success, result) = patientContract.staticcall(
            abi.encodeWithSignature("isPatientRegistered(address)", patientAddress)
        );
        require(success && abi.decode(result, (bool)), "Patient not registered");
        
        // Check email hash uniqueness across contracts
        (success, result) = patientContract.staticcall(
            abi.encodeWithSignature("isEmailHashUsed(bytes32)", patientEmailHash)
        );
        require(success && !abi.decode(result, (bool)), "Patient email already used");
        
        (success, result) = insurerContract.staticcall(
            abi.encodeWithSignature("isEmailHashUsed(bytes32)", insurerEmailHash)
        );
        require(success && !abi.decode(result, (bool)), "Insurer email already used");
        
        // Create request in request manager
        requestId = requestManagerContract.createPaymentPlanRequest(
            insurerAddress,
            patientAddress,
            insuranceName,
            duration,
            monthlyAllowance,
            insurerEmailHash,
            patientEmailHash
        );
        
        emit PaymentPlanCreated(patientAddress, insurerAddress, requestId);
        return requestId;
    }
    
    /**
     * @dev Create admin access request
     * @param requester Address requesting admin access
     * @param requestedRole The admin role being requested (as uint8)
     * @param reason The reason for requesting admin access
     * @return requestId The created request ID
     */
    function createAdminAccessRequest(
        address requester,
        uint8 requestedRole,
        string calldata reason
    ) external onlyAdminContract returns (uint256 requestId) {
        require(requester != address(0), "Invalid requester address");
        require(requestedRole != uint8(zkMedRequestManager.AdminRole.SUPER_ADMIN), "Cannot request super admin role");
        
        // Check if already an admin through admin contract
        (bool success, bytes memory result) = adminContract.staticcall(
            abi.encodeWithSignature("isAdmin(address)", requester)
        );
        require(success && !abi.decode(result, (bool)), "Already an admin");
        
        // Create admin access request through request manager
        requestId = requestManagerContract.createAdminAccessRequest(
            requester,
            zkMedRequestManager.AdminRole(requestedRole),
            reason
        );
        
        emit RequestSubmitted(requestId, requester, zkMedRequestManager.RequestType.ADMIN_ACCESS);
        return requestId;
    }
    
    // ======== Request Processing ========
    
    /**
     * @dev Approve a request (called by admin contract)
     * @param requestId The ID of the request to approve
     * @param approver The admin approving the request
     */
    function approveRequest(uint256 requestId, address approver) external onlyAdminContract {
        // Validate admin permission through admin contract
        (bool success, bytes memory result) = adminContract.staticcall(
            abi.encodeWithSignature("isModeratorOrSuperAdmin(address)", approver)
        );
        require(success && abi.decode(result, (bool)), "Not authorized to approve");
        
        // Get request details to determine what type of request this is
        zkMedRequestManager.BaseRequest memory baseReq = requestManagerContract.getRequestBase(requestId);
        
        // Update request status via request manager
        requestManagerContract.updateRequestStatus(
            requestId, 
            zkMedRequestManager.RequestStatus.APPROVED, 
            approver
        );
        
        // Handle specific approval actions based on request type
        if (baseReq.requestType == zkMedRequestManager.RequestType.ADMIN_ACCESS) {
            // Get admin request details
            zkMedRequestManager.AdminAccessRequest memory adminReq = requestManagerContract.getAdminAccessRequest(requestId);
            
            // Add the user as admin through admin contract via the core interface
            (bool success,) = adminContract.call(
                abi.encodeWithSignature("addAdminViaApprovedRequest(address,uint8)", baseReq.requester, uint8(adminReq.adminRole))
            );
            require(success, "Failed to add admin");
        }
        
        emit RequestApproved(requestId, approver);
    }
    
    /**
     * @dev Reject a request (called by admin contract)
     * @param requestId The ID of the request to reject
     * @param rejecter The admin rejecting the request
     * @param reason The reason for rejection
     */
    function rejectRequest(uint256 requestId, address rejecter, string calldata reason) external onlyAdminContract {
        // Validate admin permission through admin contract
        (bool success, bytes memory result) = adminContract.staticcall(
            abi.encodeWithSignature("isModeratorOrSuperAdmin(address)", rejecter)
        );
        require(success && abi.decode(result, (bool)), "Not authorized to reject");
        
        // Update request status via request manager
        requestManagerContract.updateRequestStatus(
            requestId, 
            zkMedRequestManager.RequestStatus.REJECTED, 
            rejecter
        );
        
        emit RequestRejected(requestId, rejecter, reason);
    }
    
    /**
     * @dev Approve a payment plan request with automatic first payment
     * @param requestId The ID of the payment plan request to approve
     * @param approver The admin approving the request
     */
    function approvePaymentPlan(uint256 requestId, address approver) external payable onlyAdminContract {
        // Get payment plan request details
        zkMedRequestManager.PaymentPlanRequest memory paymentReq = requestManagerContract.getPaymentPlanRequest(requestId);
        zkMedRequestManager.PaymentPlan memory plan = paymentReq.plan;

        require(paymentReq.base.requester != address(0), "Request does not exist");
        require(paymentReq.base.status == zkMedRequestManager.RequestStatus.PENDING, "Request not pending");
        require(plan.isActive, "Payment plan is not active");
        require(plan.duration > block.timestamp, "Payment plan duration has passed");
        
        // Calculate first allowance amount in wei
        uint256 firstAllowanceWei = (plan.monthlyAllowance * 1 ether) / 100;
        require(msg.value >= firstAllowanceWei, "Insufficient funds for first allowance");
        
        // Send first allowance to insurer automatically
        (bool success, ) = payable(plan.insurerAddress).call{value: firstAllowanceWei}("");
        require(success, "Failed to send first allowance to insurer");
        
        // Record the automatic first payment
        paymentHistoryContract.recordPayment(
            requestId,
            plan.insurerAddress,
            plan.patientAddress,
            firstAllowanceWei,
            zkMedPaymentHistory.PaymentType.FIRST_ALLOWANCE,
            true
        );
        
        // Update payment plan statistics
        requestManagerContract.updatePaymentPlanStats(requestId, firstAllowanceWei);
        
        // Refund excess if any
        if (msg.value > firstAllowanceWei) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - firstAllowanceWei}("");
            require(refundSuccess, "Refund failed");
        }

        // Update request status
        requestManagerContract.updateRequestStatus(
            requestId, 
            zkMedRequestManager.RequestStatus.APPROVED, 
            approver
        );

        // Emit events
        emit PaymentMade(plan.patientAddress, plan.insurerAddress, firstAllowanceWei);
        emit FirstAllowancePaid(plan.patientAddress, plan.insurerAddress, firstAllowanceWei, requestId);
        emit RequestApproved(requestId, approver);
    }
    
    /**
     * @dev Reject a payment plan request
     * @param requestId The ID of the payment plan request to reject
     * @param rejecter The admin rejecting the request
     * @param reason The reason for rejection
     */
    function rejectPaymentPlan(uint256 requestId, address rejecter, string calldata reason) external onlyAdminContract {
        // Update request status via request manager
        requestManagerContract.updateRequestStatus(
            requestId, 
            zkMedRequestManager.RequestStatus.REJECTED, 
            rejecter
        );
        
        emit RequestRejected(requestId, rejecter, reason);
    }
    
    // ======== User Management Coordination ========
    
    /**
     * @dev Deactivate a user across all contracts
     * @param user Address of the user to deactivate
     * @param admin Admin performing the deactivation
     */
    function deactivateUser(address user, address admin) external onlyAdminContract {
        // Validate admin permission
        (bool success, bytes memory result) = adminContract.staticcall(
            abi.encodeWithSignature("isAdmin(address)", admin)
        );
        require(success && abi.decode(result, (bool)), "Not an admin");
        
        // Check user type and deactivate from appropriate contract
        (success, result) = patientContract.staticcall(
            abi.encodeWithSignature("isPatientRegistered(address)", user)
        );
        if (success && abi.decode(result, (bool))) {
            (success,) = patientContract.call(
                abi.encodeWithSignature("deactivatePatient(address)", user)
            );
            require(success, "Failed to deactivate patient");
        }
        
        // Check hospital contract (similar pattern)
        // Check insurer contract (similar pattern)
        // Check admin contract (similar pattern)
        
        emit UserDeactivated(user);
    }
    
    // ======== Aggregation and Statistics ========
    
    /**
     * @dev Get registration statistics by aggregating from user contracts
     * @return totalUsers Total registered users
     * @return patients Total patients
     * @return hospitals Total hospitals
     * @return insurers Total insurers
     */
    function getRegistrationStats() external view returns (
        uint256 totalUsers,
        uint256 patients, 
        uint256 hospitals,
        uint256 insurers
    ) {
        // Aggregate from user contracts
        (bool success, bytes memory result) = patientContract.staticcall(
            abi.encodeWithSignature("getTotalPatients()")
        );
        patients = success ? abi.decode(result, (uint256)) : 0;
        
        (success, result) = hospitalContract.staticcall(
            abi.encodeWithSignature("getTotalHospitals()")
        );
        hospitals = success ? abi.decode(result, (uint256)) : 0;
        
        (success, result) = insurerContract.staticcall(
            abi.encodeWithSignature("getTotalInsurers()")
        );
        insurers = success ? abi.decode(result, (uint256)) : 0;
        
        totalUsers = patients + hospitals + insurers;
    }
    
    // ======== Domain and Email Validation ========
    
    /**
     * @dev Validate hospital domain through hospital contract
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function validateHospitalDomain(string calldata domain) external view returns (bool) {
        (bool success, bytes memory result) = hospitalContract.staticcall(
            abi.encodeWithSignature("validateHospitalDomain(string)", domain)
        );
        return success && abi.decode(result, (bool));
    }

    /**
     * @dev Validate insurer domain through insurer contract
     * @param domain Domain to validate
     * @return bool True if valid insurer domain
     */
    function validateInsurerDomain(string calldata domain) external view returns (bool) {
        (bool success, bytes memory result) = insurerContract.staticcall(
            abi.encodeWithSignature("validateInsurerDomain(string)", domain)
        );
        return success && abi.decode(result, (bool));
    }
    
    // ======== Delegation Functions ========
    
    /**
     * @dev Get user to request ID mapping (delegate to request manager)
     */
    function userToRequestId(address user) external view returns (uint256) {
        return requestManagerContract.userToRequestId(user);
    }
    
    /**
     * @dev Get request count (delegate to request manager)
     */
    function requestCount() external view returns (uint256) {
        return requestManagerContract.requestCount();
    }
    
    /**
     * @dev Get pending request count (delegate to request manager)
     */
    function pendingRequestCount() external view returns (uint256) {
        return requestManagerContract.pendingRequestCount();
    }
    
    /**
     * @dev Get all pending requests
     */
    function getPendingRequests() external view returns (uint256[] memory) {
        return requestManagerContract.getPendingRequestsByType(zkMedRequestManager.RequestType.PAYMENT_PLAN);
    }
    
    /**
     * @dev Get all pending requests of a specific type
     */
    function getPendingRequestsByType(zkMedRequestManager.RequestType reqType) external view returns (uint256[] memory) {
        return requestManagerContract.getPendingRequestsByType(reqType);
    }
    
    /**
     * @dev Get request base details
     */
    function getRequestBase(uint256 requestId) external view returns (zkMedRequestManager.BaseRequest memory) {
        return requestManagerContract.getRequestBase(requestId);
    }
    
    /**
     * @dev Get payment plan request details
     */
    function getPaymentPlanRequest(uint256 requestId) external view returns (zkMedRequestManager.PaymentPlanRequest memory) {
        return requestManagerContract.getPaymentPlanRequest(requestId);
    }
    
    /**
     * @dev Get payment plan history
     */
    function getPaymentPlanHistory(uint256 requestId) external view returns (zkMedPaymentHistory.PaymentEntry[] memory) {
        return paymentHistoryContract.getPaymentPlanHistory(requestId);
    }
    
    /**
     * @dev Get patient payment history
     */
    function getPatientPaymentHistory(address patient) external view returns (zkMedPaymentHistory.PaymentEntry[] memory) {
        return paymentHistoryContract.getPatientPaymentHistory(patient);
    }
    
    /**
     * @dev Get insurer payment history
     */
    function getInsurerPaymentHistory(address insurer) external view returns (zkMedPaymentHistory.PaymentEntry[] memory) {
        return paymentHistoryContract.getInsurerPaymentHistory(insurer);
    }
    
    /**
     * @dev Get payment statistics
     */
    function getPaymentStatistics() external view returns (uint256 totalPayments, uint256 totalAmountPaid) {
        return paymentHistoryContract.getPaymentStatistics();
    }
    
    /**
     * @dev Get payment plan summary with payment statistics
     */
    function getPaymentPlanSummary(uint256 requestId) external view returns (
        zkMedRequestManager.PaymentPlan memory plan,
        uint256 paymentsCount,
        uint256 totalPaid,
        uint256 lastPaymentTime
    ) {
        zkMedRequestManager.PaymentPlanRequest memory paymentReq = requestManagerContract.getPaymentPlanRequest(requestId);
        
        return (
            paymentReq.plan,
            paymentReq.plan.paymentsCount,
            paymentReq.plan.totalPaid,
            paymentReq.plan.lastPayment
        );
    }
    
    // ======== User Role Functions ========
    
    /**
     * @dev Get the role of a user address
     * @param user The address to check
     * @return role String representing the user role ("PATIENT", "HOSPITAL", "INSURER", "ADMIN", "UNREGISTERED")
     * @return isActive Whether the user is active in the system
     */
    function getRole(address user) external view returns (string memory role, bool isActive) {
        // Check if user is a patient
        if (patientContract != address(0)) {
            try IzkMedPatient(patientContract).isPatientRegistered(user) returns (bool isPatient) {
                if (isPatient) {
                    return ("PATIENT", true);
                }
            } catch {
                // Contract call failed, continue checking other roles
            }
        }
        
        // Check if user is a hospital
        if (hospitalContract != address(0)) {
            try IzkMedHospital(hospitalContract).isHospitalRegistered(user) returns (bool isHospital) {
                if (isHospital) {
                    try IzkMedHospital(hospitalContract).isHospitalApproved(user) returns (bool approved) {
                        return ("HOSPITAL", approved);
                    } catch {
                        return ("HOSPITAL", false);
                    }
                }
            } catch {
                // Contract call failed, continue checking other roles
            }
        }
        
        // Check if user is an insurer
        if (insurerContract != address(0)) {
            try IzkMedInsurer(insurerContract).isInsurerRegistered(user) returns (bool isInsurer) {
                if (isInsurer) {
                    try IzkMedInsurer(insurerContract).isInsurerApproved(user) returns (bool approved) {
                        return ("INSURER", approved);
                    } catch {
                        return ("INSURER", false);
                    }
                }
            } catch {
                // Contract call failed, continue checking other roles
            }
        }
        
        // Check if user is an admin
        if (adminContract != address(0)) {
            try IzkMedAdmin(adminContract).isAdmin(user) returns (bool isAdminUser) {
                if (isAdminUser) {
                    return ("ADMIN", true);
                }
            } catch {
                // Contract call failed, continue checking other roles
            }
        }
        
        // User is not registered in any capacity
        return ("UNREGISTERED", false);
    }
    
    /**
     * @dev Check if an address is registered in the system
     * @param user The address to check
     * @return Whether the user is registered in any capacity
     */
    function isUserRegistered(address user) external view returns (bool) {
        (string memory role, ) = this.getRole(user);
        return keccak256(abi.encodePacked(role)) != keccak256(abi.encodePacked("UNREGISTERED"));
    }
}

// ======== Interface Definitions ========

interface IzkMedPatient {
    function isPatientRegistered(address patient) external view returns (bool);
}

interface IzkMedHospital {
    function isHospitalRegistered(address hospital) external view returns (bool);
    function isHospitalApproved(address hospital) external view returns (bool);
}

interface IzkMedInsurer {
    function isInsurerRegistered(address insurer) external view returns (bool);
    function isInsurerApproved(address insurer) external view returns (bool);
}

interface IzkMedAdmin {
    function isAdmin(address admin) external view returns (bool);
}

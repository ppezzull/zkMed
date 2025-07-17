// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/**
 * @title zkMed Request Manager Contract
 * @notice Manages all types of requests separately from core contract
 * @dev Called by zkMedCore to handle request storage and management
 */
contract zkMedRequestManager is Ownable {
    
    enum RequestStatus { PENDING, APPROVED, REJECTED }
    enum RequestType { PATIENT_REGISTRATION, ORG_REGISTRATION, ADMIN_ACCESS, PAYMENT_PLAN }
    enum UserType { PATIENT, HOSPITAL, INSURER }
    enum AdminRole { BASIC, MODERATOR, SUPER_ADMIN }

    // Base request structure with common fields
    struct BaseRequest {
        address requester;
        RequestType requestType;
        RequestStatus status;
        uint256 requestTime;
        address processedBy;
        uint256 processedTime;
    }
    
    // Patient registration request
    struct PatientRegistrationRequest {
        BaseRequest base;
        bytes32 emailHash;
    }
    
    // Organization registration request
    struct OrganizationRegistrationRequest {
        BaseRequest base;
        UserType orgType;
        string domain;
        string organizationName;
        bytes32 emailHash;
    }
    
    // Admin access request
    struct AdminAccessRequest {
        BaseRequest base;
        AdminRole adminRole;
        string reason;
    }

    // Payment plan structure
    struct PaymentPlan {
        address insurerAddress;
        address patientAddress;
        string insuranceName;
        uint256 duration;           // Timestamp like 01/01/2027
        uint256 monthlyAllowance;   // Monthly allowance in cents
        bool isActive;
        uint256 createdAt;
        uint256 lastPayment;        // Timestamp of last payment
        uint256 totalPaid;          // Total amount paid in wei
        uint256 paymentsCount;      // Number of payments made
    }

    // Payment plan request
    struct PaymentPlanRequest {
        BaseRequest base;
        PaymentPlan plan;
        bytes32 insurerEmailHash;
        bytes32 patientEmailHash;
    }
    
    // ======== State Variables ========
    
    // Authorized contracts
    mapping(address => bool) public authorizedContracts;
    
    // Request mappings
    mapping(uint256 => BaseRequest) public requests;
    mapping(uint256 => PatientRegistrationRequest) public patientRequests;
    mapping(uint256 => OrganizationRegistrationRequest) public organizationRequests;
    mapping(uint256 => AdminAccessRequest) public adminRequests;
    mapping(uint256 => PaymentPlanRequest) public paymentPlanRequests;
    
    mapping(address => uint256) public userToRequestId;
    uint256 public requestCount;
    uint256 public pendingRequestCount;

    // Payment plan mappings
    mapping(address => PaymentPlan[]) public patientPaymentPlans;
    mapping(bytes32 => bool) public processedPaymentPlans; // Track processed payment emails
    
    // Events
    event RequestSubmitted(uint256 indexed requestId, address indexed requester, RequestType requestType);
    event RequestApproved(uint256 indexed requestId, address indexed approver);
    event RequestRejected(uint256 indexed requestId, address indexed rejecter, string reason);
    event PaymentPlanCreated(address indexed patient, address indexed insurer, uint256 indexed requestId);
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
     * @dev Authorize a contract to manage requests
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
    
    // ======== Request Management Functions ========
    
    /**
     * @dev Create a patient registration request
     */
    function createPatientRegistrationRequest(
        address patient,
        bytes32 emailHash
    ) external onlyAuthorized returns (uint256 requestId) {
        require(patient != address(0), "Invalid patient address");
        require(emailHash != bytes32(0), "Invalid email hash");
        
        requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = patient;
        baseReq.requestType = RequestType.PATIENT_REGISTRATION;
        baseReq.status = RequestStatus.PENDING;
        baseReq.requestTime = block.timestamp;
        
        PatientRegistrationRequest storage patientReq = patientRequests[requestId];
        patientReq.base = baseReq;
        patientReq.emailHash = emailHash;
        
        userToRequestId[patient] = requestId;
        pendingRequestCount++;
        
        emit RequestSubmitted(requestId, patient, RequestType.PATIENT_REGISTRATION);
        return requestId;
    }
    
    /**
     * @dev Create an organization registration request
     */
    function createOrganizationRegistrationRequest(
        address organization,
        UserType orgType,
        string calldata domain,
        string calldata organizationName,
        bytes32 emailHash
    ) external onlyAuthorized returns (uint256 requestId) {
        require(organization != address(0), "Invalid organization address");
        require(orgType == UserType.HOSPITAL || orgType == UserType.INSURER, "Invalid organization type");
        require(bytes(domain).length > 0, "Domain cannot be empty");
        require(bytes(organizationName).length > 0, "Organization name cannot be empty");
        require(emailHash != bytes32(0), "Invalid email hash");
        
        requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = organization;
        baseReq.requestType = RequestType.ORG_REGISTRATION;
        baseReq.status = RequestStatus.PENDING;
        baseReq.requestTime = block.timestamp;
        
        OrganizationRegistrationRequest storage orgReq = organizationRequests[requestId];
        orgReq.base = baseReq;
        orgReq.orgType = orgType;
        orgReq.domain = domain;
        orgReq.organizationName = organizationName;
        orgReq.emailHash = emailHash;
        
        userToRequestId[organization] = requestId;
        pendingRequestCount++;
        
        emit RequestSubmitted(requestId, organization, RequestType.ORG_REGISTRATION);
        return requestId;
    }
    
    /**
     * @dev Create a payment plan request
     */
    function createPaymentPlanRequest(
        address insurerAddress,
        address patientAddress,
        string calldata insuranceName,
        uint256 duration,
        uint256 monthlyAllowance,
        bytes32 insurerEmailHash,
        bytes32 patientEmailHash
    ) external onlyAuthorized returns (uint256 requestId) {
        require(patientAddress != address(0), "Invalid patient address");
        require(insurerAddress != address(0), "Invalid insurer address");
        require(duration > block.timestamp, "Duration must be in the future");
        require(monthlyAllowance > 0, "Monthly allowance must be positive");
        require(!processedPaymentPlans[insurerEmailHash], "Payment plan already processed");
        require(!processedPaymentPlans[patientEmailHash], "Payment plan already processed");

        requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = patientAddress; // Patient is the requester
        baseReq.requestType = RequestType.PAYMENT_PLAN;
        baseReq.status = RequestStatus.PENDING;
        baseReq.requestTime = block.timestamp;
        
        PaymentPlanRequest storage paymentReq = paymentPlanRequests[requestId];
        paymentReq.base = baseReq;
        paymentReq.plan = PaymentPlan({
            insurerAddress: insurerAddress,
            patientAddress: patientAddress,
            insuranceName: insuranceName,
            duration: duration,
            monthlyAllowance: monthlyAllowance,
            isActive: true,
            createdAt: block.timestamp,
            lastPayment: block.timestamp,
            totalPaid: 0,
            paymentsCount: 0
        });
        paymentReq.insurerEmailHash = insurerEmailHash;
        paymentReq.patientEmailHash = patientEmailHash;

        patientPaymentPlans[patientAddress].push(PaymentPlan({
            insurerAddress: insurerAddress,
            patientAddress: patientAddress,
            insuranceName: insuranceName,
            duration: duration,
            monthlyAllowance: monthlyAllowance,
            isActive: true,
            createdAt: block.timestamp,
            lastPayment: block.timestamp,
            totalPaid: 0,
            paymentsCount: 0
        }));

        // Mark email hashes as processed
        processedPaymentPlans[insurerEmailHash] = true;
        processedPaymentPlans[patientEmailHash] = true;

        pendingRequestCount++;
        emit RequestSubmitted(requestId, patientAddress, RequestType.PAYMENT_PLAN);
        emit PaymentPlanCreated(patientAddress, insurerAddress, requestId);
        return requestId;
    }
    
    // ======== Request Status Management ========
    
    /**
     * @dev Update request status
     */
    function updateRequestStatus(
        uint256 requestId,
        RequestStatus newStatus,
        address processedBy
    ) external onlyAuthorized {
        require(requests[requestId].requester != address(0), "Request does not exist");
        require(requests[requestId].status == RequestStatus.PENDING, "Request not pending");
        
        requests[requestId].status = newStatus;
        requests[requestId].processedBy = processedBy;
        requests[requestId].processedTime = block.timestamp;
        pendingRequestCount--;
        
        if (newStatus == RequestStatus.APPROVED) {
            emit RequestApproved(requestId, processedBy);
        } else if (newStatus == RequestStatus.REJECTED) {
            emit RequestRejected(requestId, processedBy, "");
        }
    }
    
    /**
     * @dev Update payment plan statistics
     */
    function updatePaymentPlanStats(
        uint256 requestId,
        uint256 amount
    ) external onlyAuthorized {
        require(requests[requestId].requestType == RequestType.PAYMENT_PLAN, "Not a payment plan request");
        
        PaymentPlanRequest storage paymentReq = paymentPlanRequests[requestId];
        paymentReq.plan.totalPaid += amount;
        paymentReq.plan.paymentsCount++;
        paymentReq.plan.lastPayment = block.timestamp;
        
        // Update in patient's payment plans array
        PaymentPlan[] storage patientPlans = patientPaymentPlans[paymentReq.plan.patientAddress];
        for (uint256 i = 0; i < patientPlans.length; i++) {
            if (patientPlans[i].insurerAddress == paymentReq.plan.insurerAddress &&
                patientPlans[i].createdAt == paymentReq.plan.createdAt) {
                patientPlans[i].totalPaid += amount;
                patientPlans[i].paymentsCount++;
                patientPlans[i].lastPayment = block.timestamp;
                break;
            }
        }
    }
    
    // ======== Query Functions ========
    
    /**
     * @dev Get base request details by ID
     */
    function getRequestBase(uint256 requestId) external view returns (BaseRequest memory) {
        return requests[requestId];
    }
    
    /**
     * @dev Get patient request details by ID
     */
    function getPatientRequest(uint256 requestId) external view returns (PatientRegistrationRequest memory) {
        require(requests[requestId].requestType == RequestType.PATIENT_REGISTRATION, "Not a patient request");
        return patientRequests[requestId];
    }
    
    /**
     * @dev Get organization request details by ID
     */
    function getOrganizationRequest(uint256 requestId) external view returns (OrganizationRegistrationRequest memory) {
        require(requests[requestId].requestType == RequestType.ORG_REGISTRATION, "Not an organization request");
        return organizationRequests[requestId];
    }
    
    /**
     * @dev Get payment plan request details by ID
     */
    function getPaymentPlanRequest(uint256 requestId) external view returns (PaymentPlanRequest memory) {
        require(requests[requestId].requestType == RequestType.PAYMENT_PLAN, "Not a payment plan request");
        return paymentPlanRequests[requestId];
    }

    /**
     * @dev Get all payment plans for a patient
     */
    function getPatientPaymentPlans(address patient) external view returns (PaymentPlan[] memory) {
        return patientPaymentPlans[patient];
    }
    
    /**
     * @dev Get pending requests by type
     */
    function getPendingRequestsByType(RequestType reqType) external view returns (uint256[] memory) {
        // First count how many pending requests of this type exist
        uint256 count = 0;
        for (uint256 i = 1; i <= requestCount; i++) {
            if (requests[i].status == RequestStatus.PENDING && requests[i].requestType == reqType) {
                count++;
            }
        }
        
        // Now populate the array
        uint256[] memory pendingReqs = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= requestCount; i++) {
            if (requests[i].status == RequestStatus.PENDING && requests[i].requestType == reqType) {
                pendingReqs[index] = i;
                index++;
                
                // Exit early if we've found all matching requests
                if (index == count) break;
            }
        }
        
        return pendingReqs;
    }
} 
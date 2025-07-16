// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {zkMedDomainProver} from "./provers/zkMedDomainProver.sol";
import {zkMedInvitationProver} from "./provers/zkMedInvitationProver.sol";

/**
 * @title zkMed Healthcare Registration Contract
 * @notice Manages healthcare stakeholder registration using MailProof domain verification
 * @dev Integrates with vlayer EmailDomainProver for cryptographic email verification
 */
contract zkMedCore is Verifier, Ownable {
    
    // ======== Type Definitions ========
    
    enum UserType { PATIENT, HOSPITAL, INSURER }
    enum AdminRole { BASIC, MODERATOR, SUPER_ADMIN }
    enum RequestStatus { PENDING, APPROVED, REJECTED }
    enum RequestType { PATIENT_REGISTRATION, ORG_REGISTRATION, ADMIN_ACCESS, INVITATION }

    // Base record with common fields for all users
    struct BaseRecord {
        address walletAddress;
        bytes32 emailHash;       // Cryptographic proof of email ownership
        uint256 registrationTime;
        bool isActive;
        uint256 requestId;       // Reference to the request that created this user
    }
    
    // Specialized record for patients
    struct PatientRecord {
        BaseRecord base;
        // Patient-specific fields can be added here
        // For example: string medicalId;
    }
    
    // Specialized record for organizations (hospitals and insurers)
    struct OrganizationRecord {
        BaseRecord base;
        UserType orgType;        // HOSPITAL or INSURER
        string domain;
        string organizationName;
        // Organization-specific fields can be added here
        // For example: uint256 verificationLevel;
    }
    
    // Specialized record for admins
    struct AdminRecord {
        bool isActive;
        AdminRole role;
        uint256 permissions;
        uint256 adminSince;      // Timestamp when admin was appointed
    }

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
    
    // Payment plan structure for patient invitations
    struct PaymentPlan {
        uint256 duration;           // Timestamp like 01/01/2027
        uint256 monthlyAllowance;   // Monthly allowance in cents (e.g., 4000 = $40.00)
        bool isActive;              // Whether the plan is currently active
        uint256 createdAt;          // When the plan was created
        address insurerAddress;     // Which insurer created this plan
    }
    
    // Invitation request
    struct InvitationRequest {
        BaseRequest base;
        address senderAddress;      // Insurance company address
        address recipientAddress;   // Patient or hospital address
        zkMedInvitationProver.RecipientType recipientType;
        string insuranceName;
        bytes32 senderEmailHash;
        bytes32 recipientEmailHash;
        PaymentPlan paymentPlan;    // Only populated for patient invitations
        bool hasPaymentPlan;        // True if invitation includes payment plan
    }
    
    // ======== State Variables ========
    
    address public emailDomainProver;
    
    // User records
    mapping(address => UserType) public userTypes;
    mapping(address => PatientRecord) public patientRecords;
    mapping(address => OrganizationRecord) public organizationRecords;
    mapping(address => AdminRecord) public admins;
    
    // Domain and email tracking
    mapping(string => address) public domainToUser;
    mapping(bytes32 => bool) public usedEmailHashes;
    
    // Request mappings
    mapping(uint256 => BaseRequest) public requests;
    mapping(uint256 => PatientRegistrationRequest) public patientRequests;
    mapping(uint256 => OrganizationRegistrationRequest) public organizationRequests;
    mapping(uint256 => AdminAccessRequest) public adminRequests;
    mapping(uint256 => InvitationRequest) public invitationRequests;
    
    mapping(address => uint256) public userToRequestId;
    uint256 public requestCount;
    uint256 public pendingRequestCount;
    
    // Invitation and payment plan mappings
    mapping(address => PaymentPlan[]) public patientPaymentPlans;
    mapping(address => mapping(address => bool)) public insurerPatientInvitations; // insurer => patient => invited
    mapping(bytes32 => bool) public processedInvitations; // Track processed invitation emails
    
    address public invitationProver;
    
    // Statistics
    uint256 public totalRegisteredUsers;
    uint256 public totalPatients;
    uint256 public totalHospitals;
    uint256 public totalInsurers;
    
    // ======== Events ========
    
    event RequestSubmitted(uint256 indexed requestId, address indexed requester, RequestType requestType);
    event RequestApproved(uint256 indexed requestId, address indexed approver);
    event RequestRejected(uint256 indexed requestId, address indexed rejecter, string reason);
    
    event PatientRegistered(address indexed patient);
    event HospitalRegistered(address indexed hospital, string domain, bytes32 emailHash);
    event InsurerRegistered(address indexed insurer, string domain, bytes32 emailHash);
    event AdminAdded(address indexed admin, AdminRole role);
    event UserDeactivated(address indexed user);
    
    event InvitationSent(address indexed insurer, address indexed recipient, uint256 indexed requestId);
    event PaymentPlanCreated(address indexed patient, address indexed insurer, uint256 duration, uint256 monthlyAllowance);
    
    // ======== Constructor ========
    
    constructor(address _emailDomainProver, address _invitationProver) Ownable(msg.sender) {
        emailDomainProver = _emailDomainProver;
        invitationProver = _invitationProver;
        
        // Set deployer as super admin
        admins[msg.sender] = AdminRecord({
            isActive: true,
            role: AdminRole.SUPER_ADMIN,
            permissions: type(uint256).max,
            adminSince: block.timestamp
        });
    }
    
    // ======== Modifiers ========
    
    modifier onlyAdmin() {
        require(admins[msg.sender].isActive, "Not an admin");
        _;
    }
    
    modifier onlySuperAdmin() {
        require(
            admins[msg.sender].isActive && 
            admins[msg.sender].role == AdminRole.SUPER_ADMIN, 
            "Not a super admin"
        );
        _;
    }

    modifier onlyModeratorOrSuperAdmin() {
        require(
            admins[msg.sender].isActive && 
            (admins[msg.sender].role == AdminRole.SUPER_ADMIN || 
             admins[msg.sender].role == AdminRole.MODERATOR), 
            "Not a moderator or super admin"
        );
        _;
    }
    
    modifier notRegistered() {
        require(
            userTypes[msg.sender] == UserType(0) && !_isUserActive(msg.sender), 
            "User already registered"
        );
        _;
    }
    
    // ======== Admin Request System ========

    /**
     * @dev Submit a request for admin access
     * @param requestedRole The admin role being requested
     * @param reason The reason for requesting admin access
     */
    function requestAdminAccess(AdminRole requestedRole, string calldata reason) external {
        require(requestedRole != AdminRole.SUPER_ADMIN, "Cannot request super admin role");
        require(!admins[msg.sender].isActive, "Already an admin");
        require(
            userToRequestId[msg.sender] == 0 || 
            requests[userToRequestId[msg.sender]].status != RequestStatus.PENDING, 
            "Already have pending request"
        );
        
        uint256 requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = msg.sender;
        baseReq.requestType = RequestType.ADMIN_ACCESS;
        baseReq.status = RequestStatus.PENDING;
        baseReq.requestTime = block.timestamp;
        
        AdminAccessRequest storage adminReq = adminRequests[requestId];
        adminReq.base = baseReq;
        adminReq.adminRole = requestedRole;
        adminReq.reason = reason;
        
        userToRequestId[msg.sender] = requestId;
        pendingRequestCount++;
        
        emit RequestSubmitted(requestId, msg.sender, RequestType.ADMIN_ACCESS);
    }
    
    /**
     * @dev Approve any type of request
     * @param requestId The ID of the request to approve
     */
    function approveRequest(uint256 requestId) external onlyModeratorOrSuperAdmin {
        BaseRequest storage baseReq = requests[requestId];
        
        require(baseReq.requester != address(0), "Request does not exist");
        require(baseReq.status == RequestStatus.PENDING, "Request not pending");
        
        // Handle based on request type
        if (baseReq.requestType == RequestType.ADMIN_ACCESS) {
            AdminAccessRequest storage adminReq = adminRequests[requestId];
            
            // Moderators can only approve basic admin requests
            if (admins[msg.sender].role == AdminRole.MODERATOR) {
                require(adminReq.adminRole == AdminRole.BASIC, "Moderators can only approve basic admin requests");
            }
            
            // Set permissions based on role
            uint256 permissions = 0;
            if (adminReq.adminRole == AdminRole.BASIC) {
                permissions = 1; // Basic permissions
            } else if (adminReq.adminRole == AdminRole.MODERATOR) {
                permissions = 255; // Moderate permissions
            }
            
            // Create the admin
            admins[baseReq.requester] = AdminRecord({
                isActive: true,
                role: adminReq.adminRole,
                permissions: permissions,
                adminSince: block.timestamp
            });
            
            emit AdminAdded(baseReq.requester, adminReq.adminRole);
        }
        else if (baseReq.requestType == RequestType.ORG_REGISTRATION) {
            // Organization was already created during registration, just need to update status
            // No additional action needed as the organization is already registered
        }
        else if (baseReq.requestType == RequestType.INVITATION) {
            // Invitations are typically auto-approved, but manual approval might be needed for special cases
            // No additional action needed as the invitation was already processed
        }
        // For PATIENT_REGISTRATION, nothing additional is needed as they're auto-approved
        
        // Update the request status
        baseReq.status = RequestStatus.APPROVED;
        baseReq.processedBy = msg.sender;
        baseReq.processedTime = block.timestamp;
        pendingRequestCount--;
        
        emit RequestApproved(requestId, msg.sender);
    }
    
    /**
     * @dev Reject any type of request
     * @param requestId The ID of the request to reject
     * @param reason The reason for rejection
     */
    function rejectRequest(uint256 requestId, string calldata reason) external onlyModeratorOrSuperAdmin {
        BaseRequest storage baseReq = requests[requestId];
        
        require(baseReq.requester != address(0), "Request does not exist");
        require(baseReq.status == RequestStatus.PENDING, "Request not pending");
        
        // Handle based on request type
        if (baseReq.requestType == RequestType.ADMIN_ACCESS) {
            AdminAccessRequest storage adminReq = adminRequests[requestId];
            
            // Moderators can only process basic admin requests
            if (admins[msg.sender].role == AdminRole.MODERATOR) {
                require(adminReq.adminRole == AdminRole.BASIC, "Moderators can only process basic admin requests");
            }
        }
        else if (baseReq.requestType == RequestType.ORG_REGISTRATION) {
            // Deactivate the organization that was registered
            address orgAddress = baseReq.requester;
            OrganizationRecord storage record = organizationRecords[orgAddress];
            
            // Mark as inactive
            record.base.isActive = false;
            
            // Reduce total counts
            if (record.orgType == UserType.HOSPITAL) {
                totalHospitals--;
            } else if (record.orgType == UserType.INSURER) {
                totalInsurers--;
            }
            
            totalRegisteredUsers--;
        }
        else if (baseReq.requestType == RequestType.INVITATION) {
            // For invitation rejections, we might need to deactivate payment plans
            InvitationRequest storage inviteReq = invitationRequests[requestId];
            
            if (inviteReq.hasPaymentPlan && inviteReq.recipientType == zkMedInvitationProver.RecipientType.PATIENT) {
                // Deactivate the most recent payment plan for this patient from this insurer
                PaymentPlan[] storage plans = patientPaymentPlans[inviteReq.recipientAddress];
                for (uint256 i = plans.length; i > 0; i--) {
                    if (plans[i-1].insurerAddress == inviteReq.senderAddress && plans[i-1].isActive) {
                        plans[i-1].isActive = false;
                        break;
                    }
                }
            }
            
            // Remove invitation mapping
            insurerPatientInvitations[inviteReq.senderAddress][inviteReq.recipientAddress] = false;
        }
        
        // Update the request status
        baseReq.status = RequestStatus.REJECTED;
        baseReq.processedBy = msg.sender;
        baseReq.processedTime = block.timestamp;
        pendingRequestCount--;
        
        emit RequestRejected(requestId, msg.sender, reason);
    }
    
    // ======== Patient Registration ========
    
    /**
     * @dev Register a patient with email verification proof
     * @param registrationData Data structure containing registration information
     */
    function registerPatient(
        Proof calldata,
        zkMedDomainProver.RegistrationData calldata registrationData
    ) 
        external 
        notRegistered
        onlyVerified(
            emailDomainProver, 
            zkMedDomainProver.provePatientEmail.selector
        )
    {
        // Validate registration data
        require(registrationData.walletAddress != address(0), "Invalid patient address");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        require(registrationData.requestedRole == zkMedDomainProver.UserType.PATIENT, 
                "Not a patient registration");

        // Create a patient registration request (auto-approved)
        uint256 requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = msg.sender;
        baseReq.requestType = RequestType.PATIENT_REGISTRATION;
        baseReq.status = RequestStatus.APPROVED; // Auto-approved
        baseReq.requestTime = block.timestamp;
        baseReq.processedTime = block.timestamp;
        
        PatientRegistrationRequest storage patientReq = patientRequests[requestId];
        patientReq.base = baseReq;
        patientReq.emailHash = registrationData.emailHash;

        // Create patient record
        BaseRecord memory baseRec = BaseRecord({
            walletAddress: msg.sender,
            emailHash: registrationData.emailHash,
            registrationTime: block.timestamp,
            isActive: true,
            requestId: requestId
        });
        
        patientRecords[msg.sender] = PatientRecord({
            base: baseRec
            // Additional patient-specific fields can be added here
        });
        
        // Update mappings
        userTypes[msg.sender] = UserType.PATIENT;
        usedEmailHashes[registrationData.emailHash] = true;
        userToRequestId[msg.sender] = requestId;
        totalRegisteredUsers++;
        totalPatients++;

        emit PatientRegistered(msg.sender);
        emit RequestSubmitted(requestId, msg.sender, RequestType.PATIENT_REGISTRATION);
        emit RequestApproved(requestId, address(0)); // Auto-approved
    }
    
    // ======== Hospital Registration with MailProof ========
    
    /**
     * @dev Register a hospital using MailProof domain verification
     * @param registrationData Data structure containing registration information
     */
    function registerHospital(
        Proof calldata, 
        zkMedDomainProver.RegistrationData calldata registrationData
    ) 
        external 
        notRegistered
        onlyVerified(
            emailDomainProver, 
            zkMedDomainProver.proveOrganizationDomain.selector
        )
    {
        // Verify this is a hospital registration
        require(registrationData.requestedRole == zkMedDomainProver.UserType.HOSPITAL, 
                "Not a hospital registration");
        
        // Validate the registration data
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        require(domainToUser[registrationData.domain] == address(0), "Domain already registered");
        require(_isValidHospitalDomain(registrationData.domain), "Invalid hospital domain");
        
        // Create organization registration request
        uint256 requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = msg.sender;
        baseReq.requestType = RequestType.ORG_REGISTRATION;
        baseReq.status = RequestStatus.PENDING;
        baseReq.requestTime = block.timestamp;
        
        OrganizationRegistrationRequest storage orgReq = organizationRequests[requestId];
        orgReq.base = baseReq;
        orgReq.orgType = UserType.HOSPITAL;
        orgReq.domain = registrationData.domain;
        orgReq.organizationName = registrationData.organizationName;
        orgReq.emailHash = registrationData.emailHash;
        
        // Create hospital record
        BaseRecord memory baseRec = BaseRecord({
            walletAddress: msg.sender,
            emailHash: registrationData.emailHash,
            registrationTime: block.timestamp,
            isActive: true,
            requestId: requestId
        });
        
        organizationRecords[msg.sender] = OrganizationRecord({
            base: baseRec,
            orgType: UserType.HOSPITAL,
            domain: registrationData.domain,
            organizationName: registrationData.organizationName
            // Additional hospital-specific fields can be added here
        });
        
        // Update mappings
        userTypes[msg.sender] = UserType.HOSPITAL;
        domainToUser[registrationData.domain] = msg.sender;
        usedEmailHashes[registrationData.emailHash] = true;
        userToRequestId[msg.sender] = requestId;
        totalRegisteredUsers++;
        totalHospitals++;
        pendingRequestCount++;
        
        emit HospitalRegistered(msg.sender, registrationData.domain, registrationData.emailHash);
        emit RequestSubmitted(requestId, msg.sender, RequestType.ORG_REGISTRATION);
    }
    
    // ======== Insurer Registration with MailProof ========
    
    /**
     * @dev Register an insurance company using MailProof domain verification
     * @param registrationData Data structure containing registration information
     */
    function registerInsurer(
        Proof calldata,
        zkMedDomainProver.RegistrationData calldata registrationData
    ) 
        external 
        notRegistered
        onlyVerified(
            emailDomainProver, 
            zkMedDomainProver.proveOrganizationDomain.selector
        )
    {
        // Verify this is an insurer registration
        require(registrationData.requestedRole == zkMedDomainProver.UserType.INSURER, 
                "Not an insurer registration");
        
        // Validate the registration data
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        require(domainToUser[registrationData.domain] == address(0), "Domain already registered");
        require(_isValidInsurerDomain(registrationData.domain), "Invalid insurer domain");
        
        // Create organization registration request
        uint256 requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = msg.sender;
        baseReq.requestType = RequestType.ORG_REGISTRATION;
        baseReq.status = RequestStatus.PENDING;
        baseReq.requestTime = block.timestamp;
        
        OrganizationRegistrationRequest storage orgReq = organizationRequests[requestId];
        orgReq.base = baseReq;
        orgReq.orgType = UserType.INSURER;
        orgReq.domain = registrationData.domain;
        orgReq.organizationName = registrationData.organizationName;
        orgReq.emailHash = registrationData.emailHash;
        
        // Create insurer record
        BaseRecord memory baseRec = BaseRecord({
            walletAddress: msg.sender,
            emailHash: registrationData.emailHash,
            registrationTime: block.timestamp,
            isActive: true,
            requestId: requestId
        });
        
        organizationRecords[msg.sender] = OrganizationRecord({
            base: baseRec,
            orgType: UserType.INSURER,
            domain: registrationData.domain,
            organizationName: registrationData.organizationName
            // Additional insurer-specific fields can be added here
        });
        
        // Update mappings
        userTypes[msg.sender] = UserType.INSURER;
        domainToUser[registrationData.domain] = msg.sender;
        usedEmailHashes[registrationData.emailHash] = true;
        userToRequestId[msg.sender] = requestId;
        totalRegisteredUsers++;
        totalInsurers++;
        pendingRequestCount++;
        
        emit InsurerRegistered(msg.sender, registrationData.domain, registrationData.emailHash);
        emit RequestSubmitted(requestId, msg.sender, RequestType.ORG_REGISTRATION);
    }
    
    // ======== Invitation Processing ========
    
    /**
     * @dev Process an invitation from an insurance company to a patient or hospital
     * @param invitationData Data structure containing invitation information
     */
    function processInvitation(
        Proof calldata,
        zkMedInvitationProver.InvitationData calldata invitationData
    ) 
        external 
        onlyVerified(
            invitationProver, 
            zkMedInvitationProver.proveInvitation.selector
        )
    {
        // Check that the invitation hasn't been processed before
        bytes32 invitationHash = keccak256(abi.encodePacked(
            invitationData.senderEmailHash, 
            invitationData.recipientEmailHash
        ));
        require(!processedInvitations[invitationHash], "Invitation already processed");
        
        // Validate sender (already done in prover, but double-check)
        require(userTypes[invitationData.senderAddress] == UserType.INSURER, "Sender must be an insurer");
        require(isOrganizationApproved(invitationData.senderAddress), "Sender must be approved");
        
        // Validate recipient based on type
        if (invitationData.recipientType == zkMedInvitationProver.RecipientType.HOSPITAL) {
            require(userTypes[invitationData.recipientAddress] == UserType.HOSPITAL, "Recipient must be a hospital");
            require(isOrganizationApproved(invitationData.recipientAddress), "Hospital must be approved");
        } else {
            // For patients, the recipientAddress might need to be provided by the caller
            // since we can't directly map email to patient address in the prover
            require(msg.sender == invitationData.recipientAddress || _isUserActive(invitationData.recipientAddress), "Invalid patient recipient");
            require(userTypes[invitationData.recipientAddress] == UserType.PATIENT, "Recipient must be a patient");
        }
        
        // Create invitation request
        uint256 requestId = ++requestCount;
        
        BaseRequest storage baseReq = requests[requestId];
        baseReq.requester = invitationData.senderAddress;
        baseReq.requestType = RequestType.INVITATION;
        baseReq.status = RequestStatus.APPROVED; // Invitations are auto-approved if validation passes
        baseReq.requestTime = block.timestamp;
        baseReq.processedTime = block.timestamp;
        
        InvitationRequest storage inviteReq = invitationRequests[requestId];
        inviteReq.base = baseReq;
        inviteReq.senderAddress = invitationData.senderAddress;
        inviteReq.recipientAddress = invitationData.recipientAddress;
        inviteReq.recipientType = invitationData.recipientType;
        inviteReq.insuranceName = invitationData.insuranceName;
        inviteReq.senderEmailHash = invitationData.senderEmailHash;
        inviteReq.recipientEmailHash = invitationData.recipientEmailHash;
        inviteReq.hasPaymentPlan = invitationData.hasPaymentPlan;
        
        // If it's a patient invitation with payment plan, create the payment plan
        if (invitationData.recipientType == zkMedInvitationProver.RecipientType.PATIENT && invitationData.hasPaymentPlan) {
            PaymentPlan memory newPlan = PaymentPlan({
                duration: invitationData.paymentPlan.duration,
                monthlyAllowance: invitationData.paymentPlan.monthlyAllowance,
                isActive: true,
                createdAt: block.timestamp,
                insurerAddress: invitationData.senderAddress
            });
            
            patientPaymentPlans[invitationData.recipientAddress].push(newPlan);
            inviteReq.paymentPlan = newPlan;
            
            emit PaymentPlanCreated(
                invitationData.recipientAddress, 
                invitationData.senderAddress, 
                newPlan.duration, 
                newPlan.monthlyAllowance
            );
        }
        
        // Mark invitation as processed
        processedInvitations[invitationHash] = true;
        insurerPatientInvitations[invitationData.senderAddress][invitationData.recipientAddress] = true;
        
        emit InvitationSent(invitationData.senderAddress, invitationData.recipientAddress, requestId);
        emit RequestSubmitted(requestId, invitationData.senderAddress, RequestType.INVITATION);
        emit RequestApproved(requestId, address(0)); // Auto-approved
    }
    
    // ======== Admin Management ========
    
    /**
     * @dev Add a new admin with specified role
     * @param newAdmin Address of the new admin
     * @param role Admin role to assign
     */
    function addAdmin(address newAdmin, AdminRole role) external onlySuperAdmin {
        require(!admins[newAdmin].isActive, "Already an admin");
        require(newAdmin != address(0), "Invalid admin address");
        
        // Set permissions based on role
        uint256 permissions = 0;
        if (role == AdminRole.BASIC) {
            permissions = 1; // Basic permissions
        } else if (role == AdminRole.MODERATOR) {
            permissions = 255; // Moderate permissions
        } else if (role == AdminRole.SUPER_ADMIN) {
            permissions = type(uint256).max; // Full permissions
        }
        
        admins[newAdmin] = AdminRecord({
            isActive: true,
            role: role,
            permissions: permissions,
            adminSince: block.timestamp
        });
        
        emit AdminAdded(newAdmin, role);
    }
    
    /**
     * @dev Update admin permissions
     * @param admin Address of the admin
     * @param permissions New permission bitmask
     */
    function updateAdminPermissions(address admin, uint256 permissions) external onlySuperAdmin {
        require(admins[admin].isActive, "Not an admin");
        admins[admin].permissions = permissions;
    }

    /**
     * @dev Deactivate a user (admin only)
     * @param user Address of the user to deactivate
     */
    function deactivateUser(address user) external onlyAdmin {
        require(_isUserActive(user), "User not registered or already inactive");
        
        UserType userType = userTypes[user];
        
        // Deactivate the user based on their type
        if (userType == UserType.PATIENT) {
            patientRecords[user].base.isActive = false;
            totalPatients--;
        } else if (userType == UserType.HOSPITAL || userType == UserType.INSURER) {
            organizationRecords[user].base.isActive = false;
            
            if (userType == UserType.HOSPITAL) {
                totalHospitals--;
            } else {
                totalInsurers--;
            }
        }
        
        totalRegisteredUsers--;
        
        emit UserDeactivated(user);
    }
    
    // ======== Domain Validation ========

    /**
     * @dev Validate if a hospital domain is registered and active
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function validateHospitalDomain(string calldata domain) external view returns (bool) {
        address hospitalAddress = domainToUser[domain];
        if (hospitalAddress == address(0) || 
            userTypes[hospitalAddress] != UserType.HOSPITAL || 
            !organizationRecords[hospitalAddress].base.isActive) {
            return false;
        }
        
        uint256 requestId = organizationRecords[hospitalAddress].base.requestId;
        return requests[requestId].status == RequestStatus.APPROVED;
    }

    /**
     * @dev Validate if an insurer domain is registered and active
     * @param domain Domain to validate
     * @return bool True if valid insurer domain
     */
    function validateInsurerDomain(string calldata domain) external view returns (bool) {
        address insurerAddress = domainToUser[domain];
        if (insurerAddress == address(0) || 
            userTypes[insurerAddress] != UserType.INSURER || 
            !organizationRecords[insurerAddress].base.isActive) {
            return false;
        }
        
        uint256 requestId = organizationRecords[insurerAddress].base.requestId;
        return requests[requestId].status == RequestStatus.APPROVED;
    }
    
    // ======== Internal Functions ========
    
    /**
     * @dev Check if domain is valid for hospital registration
     * @param domain Domain to check
     * @return bool True if valid hospital domain
     */
    function _isValidHospitalDomain(string memory domain) internal pure returns (bool) {
        // Basic domain validation - can be enhanced with specific hospital TLDs
        bytes memory domainBytes = bytes(domain);
        return domainBytes.length > 3 && domainBytes.length < 253;
    }
    
    /**
     * @dev Check if domain is valid for insurer registration
     * @param domain Domain to check  
     * @return bool True if valid insurer domain
     */
    function _isValidInsurerDomain(string memory domain) internal pure returns (bool) {
        // Basic domain validation - can be enhanced with specific insurance TLDs
        bytes memory domainBytes = bytes(domain);
        return domainBytes.length > 3 && domainBytes.length < 253;
    }
    
    /**
     * @dev Check if a user is active based on their type
     * @param user User address to check
     * @return bool True if the user is active
     */
    function _isUserActive(address user) internal view returns (bool) {
        UserType userType = userTypes[user];
        
        if (userType == UserType.PATIENT) {
            return patientRecords[user].base.isActive;
        } else if (userType == UserType.HOSPITAL || userType == UserType.INSURER) {
            return organizationRecords[user].base.isActive;
        }
        
        return false;
    }
    
    // ======== View Functions ========
    
    /**
     * @dev Check if an organization is registered and approved
     * @param organization Organization address to check
     * @return bool True if organization is approved
     */
    function isOrganizationApproved(address organization) public view returns (bool) {
        UserType userType = userTypes[organization];
        if (userType != UserType.HOSPITAL && userType != UserType.INSURER) {
            return false;
        }
        
        if (!organizationRecords[organization].base.isActive) {
            return false;
        }
        
        uint256 requestId = organizationRecords[organization].base.requestId;
        return requests[requestId].status == RequestStatus.APPROVED;
    }
    
    /**
     * @dev Get patient record for an address
     * @param patient Patient address
     * @return PatientRecord struct
     */
    function getPatientRecord(address patient) external view returns (PatientRecord memory) {
        require(userTypes[patient] == UserType.PATIENT, "Not a patient");
        return patientRecords[patient];
    }
    
    /**
     * @dev Get organization record for an address
     * @param organization Organization address
     * @return OrganizationRecord struct
     */
    function getOrganizationRecord(address organization) external view returns (OrganizationRecord memory) {
        require(
            userTypes[organization] == UserType.HOSPITAL || 
            userTypes[organization] == UserType.INSURER, 
            "Not an organization"
        );
        return organizationRecords[organization];
    }

    /**
     * @dev Get request details by ID
     * @param requestId Request ID
     * @return BaseRequest struct
     */
    function getRequestBase(uint256 requestId) external view returns (BaseRequest memory) {
        return requests[requestId];
    }
    
    /**
     * @dev Get patient request details by ID
     * @param requestId Request ID
     * @return PatientRegistrationRequest struct
     */
    function getPatientRequest(uint256 requestId) external view returns (PatientRegistrationRequest memory) {
        require(requests[requestId].requestType == RequestType.PATIENT_REGISTRATION, "Not a patient request");
        return patientRequests[requestId];
    }
    
    /**
     * @dev Get organization request details by ID
     * @param requestId Request ID
     * @return OrganizationRegistrationRequest struct
     */
    function getOrganizationRequest(uint256 requestId) external view returns (OrganizationRegistrationRequest memory) {
        require(requests[requestId].requestType == RequestType.ORG_REGISTRATION, "Not an organization request");
        return organizationRequests[requestId];
    }
    
    /**
     * @dev Get admin request details by ID
     * @param requestId Request ID
     * @return AdminAccessRequest struct
     */
    function getAdminRequest(uint256 requestId) external view returns (AdminAccessRequest memory) {
        require(requests[requestId].requestType == RequestType.ADMIN_ACCESS, "Not an admin request");
        return adminRequests[requestId];
    }
    
    /**
     * @dev Get invitation request details by ID
     * @param requestId Request ID
     * @return InvitationRequest struct
     */
    function getInvitationRequest(uint256 requestId) external view returns (InvitationRequest memory) {
        require(requests[requestId].requestType == RequestType.INVITATION, "Not an invitation request");
        return invitationRequests[requestId];
    }
    
    /**
     * @dev Get all payment plans for a patient
     * @param patient Patient address
     * @return PaymentPlan[] Array of payment plans
     */
    function getPatientPaymentPlans(address patient) external view returns (PaymentPlan[] memory) {
        require(userTypes[patient] == UserType.PATIENT, "Not a patient");
        return patientPaymentPlans[patient];
    }
    
    /**
     * @dev Get active payment plans for a patient
     * @param patient Patient address
     * @return PaymentPlan[] Array of active payment plans
     */
    function getActivePaymentPlans(address patient) external view returns (PaymentPlan[] memory) {
        require(userTypes[patient] == UserType.PATIENT, "Not a patient");
        PaymentPlan[] memory allPlans = patientPaymentPlans[patient];
        
        // Count active plans
        uint256 activeCount = 0;
        for (uint256 i = 0; i < allPlans.length; i++) {
            if (allPlans[i].isActive && allPlans[i].duration > block.timestamp) {
                activeCount++;
            }
        }
        
        // Create array with active plans
        PaymentPlan[] memory activePlans = new PaymentPlan[](activeCount);
        uint256 index = 0;
        for (uint256 i = 0; i < allPlans.length; i++) {
            if (allPlans[i].isActive && allPlans[i].duration > block.timestamp) {
                activePlans[index] = allPlans[i];
                index++;
            }
        }
        
        return activePlans;
    }
    
    /**
     * @dev Check if an insurer has invited a patient
     * @param insurer Insurer address
     * @param patient Patient address
     * @return bool True if invitation exists
     */
    function hasInsurerInvitedPatient(address insurer, address patient) external view returns (bool) {
        return insurerPatientInvitations[insurer][patient];
    }
    
    /**
     * @dev Check if user is registered and active
     * @param user User address
     * @return bool True if user is registered and active
     */
    function isUserRegistered(address user) external view returns (bool) {
        return _isUserActive(user);
    }
    
    /**
     * @dev Get user type
     * @param user User address
     * @return UserType enum value
     */
    function getUserType(address user) external view returns (UserType) {
        require(_isUserActive(user), "User not registered or inactive");
        return userTypes[user];
    }

    /**
     * @dev Get admin type
     * @param user Admin address
     * @return AdminRole enum value
     */
    function getAdminType(address user) external view returns (AdminRole) {
        require(admins[user].isActive, "Admin not registered");
        return admins[user].role;
    }

    /**
     * @dev Check if domain is already taken
     * @param domain Domain to check
     * @return bool True if domain is taken
     */
    function isDomainTaken(string calldata domain) external view returns (bool) {
        return domainToUser[domain] != address(0);
    }
    
    /**
     * @dev Get domain owner address
     * @param domain Domain to query
     * @return address Owner of the domain
     */
    function getDomainOwner(string calldata domain) external view returns (address) {
        return domainToUser[domain];
    }
    
    /**
     * @dev Get registration statistics
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
        return (totalRegisteredUsers, totalPatients, totalHospitals, totalInsurers);
    }
    
    /**
     * @dev Get all pending requests
     * @return pendingReqs Array of pending request IDs
     */
    function getPendingRequests() external view returns (uint256[] memory) {
        uint256[] memory pendingReqs = new uint256[](pendingRequestCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= requestCount; i++) {
            if (requests[i].status == RequestStatus.PENDING) {
                pendingReqs[index] = i;
                index++;
                
                // Exit early if we've found all pending requests
                if (index == pendingRequestCount) break;
            }
        }
        
        return pendingReqs;
    }
    
    /**
     * @dev Get all pending requests of a specific type
     * @param reqType The type of requests to filter for
     * @return pendingReqs Array of pending request IDs of the specified type
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

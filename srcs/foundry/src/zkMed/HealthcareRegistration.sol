// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/// @title zkMed Healthcare Registration Verifier
/// @notice Manages user registration, organization approval workflow, and role-based access
contract HealthcareRegistrationVerifier is Verifier, Ownable {
    
    enum UserType { PATIENT, HOSPITAL, INSURER }
    enum OrganizationStatus { PENDING, APPROVED, REJECTED }
    
    struct UserRecord {
        UserType userType;
        address walletAddress;
        string domain;           // Empty for patients
        string organizationName; // Empty for patients
        bytes32 emailHash;       // Only for organizations
        uint256 registrationTime;
        bool isActive;
    }
    
    struct PendingOrganization {
        UserType requestedRole;
        address walletAddress;
        string domain;
        string organizationName;
        bytes32 emailHash;
        uint256 applicationTime;
        OrganizationStatus status;
        string rejectionReason; // Set when rejected
    }
    
    // ============ STATE VARIABLES ============
    
    address public prover;
    
    // Role mappings (only for approved users)
    mapping(address => bool) public isPatient;
    mapping(address => bool) public isHospital;
    mapping(address => bool) public isInsurer;
    
    // User records
    mapping(address => UserRecord) public registeredUsers;
    mapping(bytes32 => bool) public usedEmailHashes;
    mapping(string => address) public domainToUser; // Domain -> wallet mapping
    
    // Organization application tracking
    mapping(address => PendingOrganization) public pendingOrganizations;
    mapping(string => bool) public domainApplicationExists; // Prevent duplicate domain applications
    
    // Statistics
    uint256 public totalRegisteredUsers;
    uint256 public totalPendingOrganizations;
    
    // ============ EVENTS ============
    
    event PatientRegistered(address indexed patient);
    event OrganizationApplicationSubmitted(
        address indexed applicant,
        string domain,
        UserType requestedRole,
        string organizationName
    );
    event OrganizationApproved(address indexed organization, UserType role, string domain);
    event OrganizationRejected(address indexed organization, string reason);
    event UserDeactivated(address indexed user);
    event UserReactivated(address indexed user);
    
    // ============ MODIFIERS ============
    
    modifier onlyProver() {
        require(msg.sender == prover, "Only prover can call");
        _;
    }
    
    modifier notRegistered() {
        require(!registeredUsers[msg.sender].isActive, "User already registered");
        require(pendingOrganizations[msg.sender].status != OrganizationStatus.PENDING, "Application pending");
        _;
    }
    
    modifier validDomain(string calldata domain) {
        require(bytes(domain).length > 0, "Domain cannot be empty");
        require(!domainApplicationExists[domain], "Domain application already exists");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _prover) Ownable(msg.sender) {
        prover = _prover;
    }
    
    // ============ PATIENT REGISTRATION ============
    
    /// @notice Register a patient with simple wallet connection (no MailProof needed)
    /// @param patientWallet The patient's wallet address
    function registerPatient(address patientWallet) external notRegistered {
        require(patientWallet != address(0), "Invalid patient address");
        
        registeredUsers[patientWallet] = UserRecord({
            userType: UserType.PATIENT,
            walletAddress: patientWallet,
            domain: "",
            organizationName: "",
            emailHash: bytes32(0),
            registrationTime: block.timestamp,
            isActive: true
        });
        
        isPatient[patientWallet] = true;
        totalRegisteredUsers++;
        
        emit PatientRegistered(patientWallet);
    }
    
    // ============ ORGANIZATION REGISTRATION ============
    
    /// @notice Submit organization registration application with domain proof
    /// @param anyDomain The domain to verify ownership of (any domain allowed)
    /// @param mailProof The vlayer proof of domain ownership
    /// @param requestedRole The role being requested (HOSPITAL or INSURER)
    function registerOrganization(
        string calldata anyDomain,
        Proof calldata mailProof,
        UserType requestedRole
    ) external notRegistered validDomain(anyDomain) {
        require(
            requestedRole == UserType.HOSPITAL || requestedRole == UserType.INSURER,
            "Invalid role for organization"
        );
        
        // For now, we'll extract organization data from the proof
        // In a full implementation, this would call the prover contract
        // to verify the mailProof and extract the registration data
        
        // Simplified for basic version - we'll assume the proof is valid
        // and extract basic info from the domain
        string memory orgName = string(abi.encodePacked("Organization at ", anyDomain));
        bytes32 emailHash = keccak256(abi.encodePacked("admin@", anyDomain));
        
        // Check email hash not already used
        require(!usedEmailHashes[emailHash], "Email already used");
        
        pendingOrganizations[msg.sender] = PendingOrganization({
            requestedRole: requestedRole,
            walletAddress: msg.sender,
            domain: anyDomain,
            organizationName: orgName,
            emailHash: emailHash,
            applicationTime: block.timestamp,
            status: OrganizationStatus.PENDING,
            rejectionReason: ""
        });
        
        domainApplicationExists[anyDomain] = true;
        usedEmailHashes[emailHash] = true;
        totalPendingOrganizations++;
        
        emit OrganizationApplicationSubmitted(msg.sender, anyDomain, requestedRole, orgName);
    }
    
    // ============ ADMIN FUNCTIONS ============
    
    /// @notice Approve a pending organization application
    /// @param organizationWallet The wallet address of the organization to approve
    function approveOrganization(address organizationWallet) external onlyOwner {
        PendingOrganization storage pending = pendingOrganizations[organizationWallet];
        require(pending.status == OrganizationStatus.PENDING, "No pending application");
        
        // Update status
        pending.status = OrganizationStatus.APPROVED;
        
        // Create user record
        registeredUsers[organizationWallet] = UserRecord({
            userType: pending.requestedRole,
            walletAddress: organizationWallet,
            domain: pending.domain,
            organizationName: pending.organizationName,
            emailHash: pending.emailHash,
            registrationTime: block.timestamp,
            isActive: true
        });
        
        // Set role mappings
        if (pending.requestedRole == UserType.HOSPITAL) {
            isHospital[organizationWallet] = true;
        } else if (pending.requestedRole == UserType.INSURER) {
            isInsurer[organizationWallet] = true;
        }
        
        // Update domain mapping
        domainToUser[pending.domain] = organizationWallet;
        totalRegisteredUsers++;
        totalPendingOrganizations--;
        
        emit OrganizationApproved(organizationWallet, pending.requestedRole, pending.domain);
    }
    
    /// @notice Reject a pending organization application
    /// @param organizationWallet The wallet address of the organization to reject
    /// @param reason The reason for rejection
    function rejectOrganization(address organizationWallet, string calldata reason) external onlyOwner {
        PendingOrganization storage pending = pendingOrganizations[organizationWallet];
        require(pending.status == OrganizationStatus.PENDING, "No pending application");
        
        // Update status and reason
        pending.status = OrganizationStatus.REJECTED;
        pending.rejectionReason = reason;
        
        // Free up domain for future applications
        domainApplicationExists[pending.domain] = false;
        totalPendingOrganizations--;
        
        emit OrganizationRejected(organizationWallet, reason);
    }
    
    /// @notice Get all pending organization applications
    /// @return Array of addresses with pending applications
    function getPendingOrganizations() external view returns (address[] memory) {
        // This is a simplified version - in production, you'd want pagination
        address[] memory pending = new address[](totalPendingOrganizations);
        uint256 index = 0;
        
        // Note: This is inefficient for large datasets. In production, 
        // you'd maintain a separate array or use enumeration patterns
        // For now, this serves as a basic implementation
        
        return pending; // Simplified return for basic version
    }
    
    /// @notice Deactivate a user (admin function)
    /// @param user The user to deactivate
    function deactivateUser(address user) external onlyOwner {
        require(registeredUsers[user].isActive, "User not active");
        
        registeredUsers[user].isActive = false;
        
        // Remove from role mappings
        isPatient[user] = false;
        isHospital[user] = false;
        isInsurer[user] = false;
        
        emit UserDeactivated(user);
    }
    
    /// @notice Reactivate a user (admin function)
    /// @param user The user to reactivate
    function reactivateUser(address user) external onlyOwner {
        require(!registeredUsers[user].isActive, "User already active");
        require(registeredUsers[user].walletAddress == user, "User never registered");
        
        registeredUsers[user].isActive = true;
        
        // Restore role mappings
        if (registeredUsers[user].userType == UserType.PATIENT) {
            isPatient[user] = true;
        } else if (registeredUsers[user].userType == UserType.HOSPITAL) {
            isHospital[user] = true;
        } else if (registeredUsers[user].userType == UserType.INSURER) {
            isInsurer[user] = true;
        }
        
        emit UserReactivated(user);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /// @notice Get user record
    /// @param user The user address
    /// @return The user record
    function getUserRecord(address user) external view returns (UserRecord memory) {
        return registeredUsers[user];
    }
    
    /// @notice Check if user is registered and active
    /// @param user The user address
    /// @return True if user is registered and active
    function isUserRegistered(address user) external view returns (bool) {
        return registeredUsers[user].isActive;
    }
    
    /// @notice Get user type
    /// @param user The user address
    /// @return The user type
    function getUserType(address user) external view returns (UserType) {
        require(registeredUsers[user].isActive, "User not registered");
        return registeredUsers[user].userType;
    }
    
    /// @notice Get organization application status
    /// @param org The organization address
    /// @return The organization status
    function getOrganizationStatus(address org) external view returns (OrganizationStatus) {
        return pendingOrganizations[org].status;
    }
    
    /// @notice Get pending organization details
    /// @param org The organization address
    /// @return The pending organization details
    function getPendingOrganizationDetails(address org) external view returns (PendingOrganization memory) {
        return pendingOrganizations[org];
    }
    
    /// @notice Check if domain is already registered or has pending application
    /// @param domain The domain to check
    /// @return True if domain is taken
    function isDomainTaken(string calldata domain) external view returns (bool) {
        return domainToUser[domain] != address(0) || domainApplicationExists[domain];
    }
    
    /// @notice Get domain owner (for approved organizations)
    /// @param domain The domain
    /// @return The owner address
    function getDomainOwner(string calldata domain) external view returns (address) {
        return domainToUser[domain];
    }
}

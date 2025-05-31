// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {EmailDomainProver, OrganizationVerificationData} from "./EmailDomainProver.sol";

contract RegistrationContract is Verifier, Ownable {
    
    // ============ TYPES ============
    
    enum Role { None, Patient, Hospital, Insurer, Admin }
    
    struct Organization {
        string name;
        string domain;
        Role role;
        uint256 registrationTimestamp;
        bool verified;
        bytes32 emailHash; // Hash of the verified email address
    }
    
    struct PackedRegistration {
        address user;           // 20 bytes
        uint32 timestamp;       // 4 bytes
        Role role;              // 1 byte
        bool verified;          // 1 byte
        // Total: 26 bytes < 32 bytes (1 storage slot)
    }
    
    // ============ STATE VARIABLES ============
    
    address public emailDomainProver;
    
    // Multiple owners system
    mapping(address => bool) public owners;
    address[] public ownersList;
    uint256 public constant MAX_OWNERS = 10;
    
    // User activation system
    mapping(address => bool) public activeUsers;
    mapping(address => uint256) public deactivationTimestamp;
    
    // Patient commitments mapping (address => commitment hash)
    mapping(address => bytes32) public patientCommitments;
    
    // Organization details mapping
    mapping(address => Organization) public organizations;
    
    // Role assignments mapping
    mapping(address => Role) public roles;
    
    // Verification status mapping
    mapping(address => bool) public verified;
    
    // Domain to address mapping (prevents domain reuse)
    mapping(string => address) public domainToAddress;
    
    // Email hash to address mapping (prevents email reuse)
    mapping(bytes32 => address) public emailHashToAddress;
    
    // Tracks used email hashes to prevent replay attacks
    mapping(bytes32 => bool) public usedEmailHashes;
    
    // Registration timestamps
    mapping(address => uint256) public registrationTimestamps;
    
    // Legacy admin mapping for backward compatibility
    mapping(address => bool) public admins;
    
    // ============ EVENTS ============
    
    event PatientRegistered(
        address indexed patient,
        bytes32 indexed commitment,
        uint256 timestamp
    );
    
    event OrganizationRegistered(
        address indexed organization,
        string indexed domain,
        string name,
        Role role,
        uint256 timestamp
    );
    
    event EmailProofVerified(
        address indexed organization,
        string domain,
        bytes32 emailHash,
        uint256 timestamp
    );
    
    event DomainVerified(
        address indexed user,
        string domain,
        bytes32 emailHash,
        uint256 timestamp
    );
    
    event RoleAssigned(
        address indexed user,
        Role role,
        uint256 timestamp
    );
    
    event VerificationStatusChanged(
        address indexed user,
        bool verified,
        uint256 timestamp
    );
    
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    
    // New events for multiple owners and user activation
    event OwnerAdded(address indexed newOwner, address indexed addedBy);
    event OwnerRemoved(address indexed removedOwner, address indexed removedBy);
    event UserActivated(address indexed user, address indexed activatedBy);
    event UserDeactivated(address indexed user, address indexed deactivatedBy);
    event OwnershipTransferRequested(address indexed currentOwner, address indexed newOwner);
    
    // ============ MODIFIERS ============
    
    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Unauthorized role");
        require(verified[msg.sender], "Address not verified");
        require(activeUsers[msg.sender], "User deactivated");
        _;
    }
    
    modifier onlyOwners() {
        require(owners[msg.sender], "Not an owner");
        _;
    }
    
    modifier onlyAdminOrOwner() {
        require(admins[msg.sender] || owners[msg.sender], "Not admin or owner");
        _;
    }
    
    modifier onlyActiveUser() {
        require(activeUsers[msg.sender], "User deactivated");
        _;
    }
    
    modifier notRegistered() {
        require(roles[msg.sender] == Role.None, "Already registered");
        _;
    }
    
    modifier validCommitment(bytes32 _commitment) {
        require(_commitment != bytes32(0), "Invalid commitment");
        _;
    }
    
    modifier validDomain(string calldata _domain) {
        require(bytes(_domain).length > 0, "Domain cannot be empty");
        require(domainToAddress[_domain] == address(0), "Domain already registered");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _emailDomainProver) Ownable(msg.sender) {
        emailDomainProver = _emailDomainProver;
        
        // Set up initial owner
        owners[msg.sender] = true;
        ownersList.push(msg.sender);
        activeUsers[msg.sender] = true;
        
        // Backward compatibility - also set as admin
        admins[msg.sender] = true;
        
        // Register as admin role
        roles[msg.sender] = Role.Admin;
        verified[msg.sender] = true;
        registrationTimestamps[msg.sender] = block.timestamp;
        
        emit RoleAssigned(msg.sender, Role.Admin, block.timestamp);
        emit OwnerAdded(msg.sender, msg.sender);
    }
    
    // ============ PATIENT REGISTRATION ============
    
    /// @notice Register a patient with a privacy-preserving commitment
    /// @param _commitment Hash of secret passphrase + address (keccak256(abi.encodePacked(secret, msg.sender)))
    function registerPatient(bytes32 _commitment) 
        external 
        notRegistered 
        validCommitment(_commitment) 
    {
        require(patientCommitments[msg.sender] == bytes32(0), "Patient already has commitment");
        
        // Store commitment and assign role
        patientCommitments[msg.sender] = _commitment;
        roles[msg.sender] = Role.Patient;
        verified[msg.sender] = true; // Patients are auto-verified upon registration
        activeUsers[msg.sender] = true; // Patients are auto-activated upon registration
        registrationTimestamps[msg.sender] = block.timestamp;
        
        emit PatientRegistered(msg.sender, _commitment, block.timestamp);
        emit RoleAssigned(msg.sender, Role.Patient, block.timestamp);
    }
    
    /// @notice Verify a patient's commitment with their secret passphrase
    /// @param _secret The secret passphrase used in the original commitment
    /// @return bool True if the commitment is valid
    function verifyPatientCommitment(string memory _secret) external view returns (bool) {
        require(roles[msg.sender] == Role.Patient, "Not a registered patient");
        require(activeUsers[msg.sender], "User deactivated");
        
        bytes32 computedCommitment = keccak256(abi.encodePacked(_secret, msg.sender));
        return patientCommitments[msg.sender] == computedCommitment;
    }
    
    // ============ ORGANIZATION REGISTRATION ============
    
    /// @notice Verify domain ownership using vlayer email proof
    /// @param emailHash Hash of the verified email address
    /// @param targetWallet The wallet address from the email subject
    /// @param domain The verified domain
    function verifyDomainOwnership(
        Proof calldata /* proof */,
        bytes32 emailHash,
        address targetWallet,
        string calldata domain
    ) external 
        notRegistered
        validDomain(domain)
        onlyVerified(emailDomainProver, EmailDomainProver.verifyDomainOwnership.selector)
    {
        require(targetWallet == msg.sender, "Target wallet mismatch");
        require(!usedEmailHashes[emailHash], "Email hash already used");
        
        // Mark email as used and reserve domain
        usedEmailHashes[emailHash] = true;
        domainToAddress[domain] = msg.sender;
        emailHashToAddress[emailHash] = msg.sender;
        
        emit DomainVerified(msg.sender, domain, emailHash, block.timestamp);
    }
    
    /// @notice Complete organization registration after domain verification
    /// @param organizationName The name of the organization
    /// @param domain The pre-verified domain
    /// @param _role The organization role (Hospital or Insurer)
    function completeOrganizationRegistration(
        string calldata organizationName,
        string calldata domain,
        Role _role
    ) external notRegistered {
        require(domainToAddress[domain] == msg.sender, "Domain not verified for this address");
        require(_role == Role.Hospital || _role == Role.Insurer, "Invalid organization role");
        require(bytes(organizationName).length > 0, "Organization name cannot be empty");
        
        // Get the email hash for this domain verification
        bytes32 emailHash = bytes32(0);
        // Find the email hash associated with this address and domain
        // In a more complex implementation, you might store this mapping directly
        
        // Register the organization
        organizations[msg.sender] = Organization({
            name: organizationName,
            domain: domain,
            role: _role,
            registrationTimestamp: block.timestamp,
            verified: true,
            emailHash: emailHash
        });
        
        // Assign role and verification
        roles[msg.sender] = _role;
        verified[msg.sender] = true;
        activeUsers[msg.sender] = true; // Auto-activate organizations upon registration
        registrationTimestamps[msg.sender] = block.timestamp;
        
        emit OrganizationRegistered(
            msg.sender,
            domain,
            organizationName,
            _role,
            block.timestamp
        );
        emit RoleAssigned(msg.sender, _role, block.timestamp);
    }
    
    /// @notice Single-step organization registration with complete email proof
    /// @param orgData Complete organization verification data
    /// @param _role The organization role (Hospital or Insurer)
    function registerOrganization(
        Proof calldata /* proof */,
        OrganizationVerificationData calldata orgData,
        Role _role
    ) external 
        notRegistered
        validDomain(orgData.domain)
        onlyVerified(emailDomainProver, EmailDomainProver.verifyOrganization.selector)
    {
        require(orgData.targetWallet == msg.sender, "Target wallet mismatch");
        require(_role == Role.Hospital || _role == Role.Insurer, "Invalid organization role");
        require(bytes(orgData.name).length > 0, "Organization name cannot be empty");
        require(!usedEmailHashes[orgData.emailHash], "Email hash already used");
        
        // Mark email as used
        usedEmailHashes[orgData.emailHash] = true;
        
        // Register the organization
        organizations[msg.sender] = Organization({
            name: orgData.name,
            domain: orgData.domain,
            role: _role,
            registrationTimestamp: block.timestamp,
            verified: true,
            emailHash: orgData.emailHash
        });
        
        // Assign role and verification status
        roles[msg.sender] = _role;
        verified[msg.sender] = true;
        activeUsers[msg.sender] = true; // Auto-activate organizations upon registration
        registrationTimestamps[msg.sender] = block.timestamp;
        
        // Reserve the domain and email
        domainToAddress[orgData.domain] = msg.sender;
        emailHashToAddress[orgData.emailHash] = msg.sender;
        
        emit OrganizationRegistered(
            msg.sender,
            orgData.domain,
            orgData.name,
            _role,
            block.timestamp
        );
        emit RoleAssigned(msg.sender, _role, block.timestamp);
        emit EmailProofVerified(msg.sender, orgData.domain, orgData.emailHash, block.timestamp);
    }
    
    /// @notice Simple domain verification for backward compatibility
    /// @param domain The verified domain
    /// @param emailHash Hash of the verified email
    function verifyAndStoreURL(
        Proof calldata /* proof */,
        string calldata domain,
        bytes32 emailHash
    ) external 
        notRegistered
        validDomain(domain)
        onlyVerified(emailDomainProver, EmailDomainProver.simpleDomainVerification.selector)
    {
        require(!usedEmailHashes[emailHash], "Email hash already used");
        
        // Mark email as used and reserve domain
        usedEmailHashes[emailHash] = true;
        domainToAddress[domain] = msg.sender;
        emailHashToAddress[emailHash] = msg.sender;
        
        emit DomainVerified(msg.sender, domain, emailHash, block.timestamp);
    }
    
    // ============ OWNER MANAGEMENT FUNCTIONS ============
    
    /// @notice Add a new owner (only existing owners)
    function addOwner(address _newOwner) external onlyOwners {
        require(_newOwner != address(0), "Invalid owner address");
        require(!owners[_newOwner], "Already an owner");
        require(ownersList.length < MAX_OWNERS, "Maximum owners reached");
        
        owners[_newOwner] = true;
        ownersList.push(_newOwner);
        activeUsers[_newOwner] = true;
        
        // If not already registered, register as admin
        if (roles[_newOwner] == Role.None) {
            roles[_newOwner] = Role.Admin;
            verified[_newOwner] = true;
            registrationTimestamps[_newOwner] = block.timestamp;
            emit RoleAssigned(_newOwner, Role.Admin, block.timestamp);
        }
        
        // Also add to legacy admin mapping for compatibility
        admins[_newOwner] = true;
        
        emit OwnerAdded(_newOwner, msg.sender);
        emit AdminAdded(_newOwner);
    }
    
    /// @notice Remove an owner (only existing owners, cannot remove self)
    function removeOwner(address _owner) external onlyOwners {
        require(_owner != msg.sender, "Cannot remove self");
        require(owners[_owner], "Not an owner");
        require(ownersList.length > 1, "Cannot remove last owner");
        
        owners[_owner] = false;
        
        // Remove from owners list
        for (uint256 i = 0; i < ownersList.length; i++) {
            if (ownersList[i] == _owner) {
                ownersList[i] = ownersList[ownersList.length - 1];
                ownersList.pop();
                break;
            }
        }
        
        // Remove from legacy admin mapping
        admins[_owner] = false;
        
        emit OwnerRemoved(_owner, msg.sender);
        emit AdminRemoved(_owner);
    }
    
    /// @notice Get all current owners
    function getOwners() external view returns (address[] memory) {
        return ownersList;
    }
    
    /// @notice Check if address is an owner
    function isOwner(address _address) external view returns (bool) {
        return owners[_address];
    }
    
    // ============ USER ACTIVATION FUNCTIONS ============
    
    /// @notice Activate a user (only owners)
    function activateUser(address _user) external onlyOwners {
        require(roles[_user] != Role.None, "User not registered");
        require(!activeUsers[_user], "User already active");
        
        activeUsers[_user] = true;
        deactivationTimestamp[_user] = 0; // Reset deactivation timestamp
        
        emit UserActivated(_user, msg.sender);
    }
    
    /// @notice Deactivate a user (only owners)
    function deactivateUser(address _user) external onlyOwners {
        require(roles[_user] != Role.None, "User not registered");
        require(activeUsers[_user], "User already inactive");
        require(!owners[_user], "Cannot deactivate an owner");
        
        activeUsers[_user] = false;
        deactivationTimestamp[_user] = block.timestamp;
        
        emit UserDeactivated(_user, msg.sender);
    }
    
    /// @notice Batch activate users (only owners)
    function batchActivateUsers(address[] calldata _users) external onlyOwners {
        for (uint256 i = 0; i < _users.length; i++) {
            if (roles[_users[i]] != Role.None && !activeUsers[_users[i]]) {
                activeUsers[_users[i]] = true;
                deactivationTimestamp[_users[i]] = 0;
                emit UserActivated(_users[i], msg.sender);
            }
        }
    }
    
    /// @notice Batch deactivate users (only owners)
    function batchDeactivateUsers(address[] calldata _users) external onlyOwners {
        for (uint256 i = 0; i < _users.length; i++) {
            if (roles[_users[i]] != Role.None && activeUsers[_users[i]] && !owners[_users[i]]) {
                activeUsers[_users[i]] = false;
                deactivationTimestamp[_users[i]] = block.timestamp;
                emit UserDeactivated(_users[i], msg.sender);
            }
        }
    }
    
    // ============ LEGACY ADMIN FUNCTIONS (Backward Compatibility) ============
    
    /// @notice Add a new admin (legacy function for backward compatibility)
    function addAdmin(address _newAdmin) external onlyAdminOrOwner {
        require(_newAdmin != address(0), "Invalid admin address");
        require(!admins[_newAdmin], "Already an admin");
        
        admins[_newAdmin] = true;
        activeUsers[_newAdmin] = true;
        
        // If not already registered, register as admin
        if (roles[_newAdmin] == Role.None) {
            roles[_newAdmin] = Role.Admin;
            verified[_newAdmin] = true;
            registrationTimestamps[_newAdmin] = block.timestamp;
            emit RoleAssigned(_newAdmin, Role.Admin, block.timestamp);
        }
        
        emit AdminAdded(_newAdmin);
    }
    
    /// @notice Remove an admin (legacy function for backward compatibility)
    function removeAdmin(address _admin) external onlyAdminOrOwner {
        require(_admin != msg.sender, "Cannot remove self");
        require(admins[_admin], "Not an admin");
        require(!owners[_admin], "Cannot remove owner via admin function");
        
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    
    /// @notice Emergency function to update verification status
    function updateVerificationStatus(address _user, bool _verified) external onlyAdminOrOwner {
        require(roles[_user] != Role.None, "User not registered");
        
        verified[_user] = _verified;
        emit VerificationStatusChanged(_user, _verified, block.timestamp);
    }
    
    /// @notice Emergency function to reset email hash usage (admin/owner only)
    function resetEmailHash(bytes32 _emailHash) external onlyAdminOrOwner {
        usedEmailHashes[_emailHash] = false;
    }

    // Production Note: Test helper function removed for production deployment
    // setDomainOwnershipForTesting() was removed to ensure production security
    
    // ============ VIEW FUNCTIONS ============
    
    /// @notice Get user's complete registration information
    function getUserRegistration(address _user) external view returns (
        Role role,
        bool isVerified,
        uint256 timestamp,
        string memory organizationName,
        string memory domain
    ) {
        role = roles[_user];
        isVerified = verified[_user];
        timestamp = registrationTimestamps[_user];
        
        if (role == Role.Hospital || role == Role.Insurer) {
            organizationName = organizations[_user].name;
            domain = organizations[_user].domain;
        }
    }
    
    /// @notice Check if an address is registered and verified
    function isUserVerified(address _user) external view returns (bool) {
        return roles[_user] != Role.None && verified[_user];
    }
    
    /// @notice Check if an address is active (registered, verified, and not deactivated)
    function isUserActive(address _user) external view returns (bool) {
        return roles[_user] != Role.None && verified[_user] && activeUsers[_user];
    }
    
    /// @notice Get user activation status and deactivation timestamp
    function getUserActivationStatus(address _user) external view returns (
        bool isActive,
        uint256 deactivatedAt
    ) {
        isActive = activeUsers[_user];
        deactivatedAt = deactivationTimestamp[_user];
    }
    
    /// @notice Get organization details
    function getOrganization(address _organization) external view returns (Organization memory) {
        require(
            roles[_organization] == Role.Hospital || roles[_organization] == Role.Insurer,
            "Address is not an organization"
        );
        return organizations[_organization];
    }
    
    /// @notice Check if a domain is already registered
    function isDomainRegistered(string calldata _domain) external view returns (bool) {
        return domainToAddress[_domain] != address(0);
    }
    
    /// @notice Get address associated with a domain
    function getDomainOwner(string calldata _domain) external view returns (address) {
        return domainToAddress[_domain];
    }
    
    /// @notice Check if an email hash has been used
    function isEmailHashUsed(bytes32 _emailHash) external view returns (bool) {
        return usedEmailHashes[_emailHash];
    }
    
    /// @notice Get address associated with an email hash
    function getEmailHashOwner(bytes32 _emailHash) external view returns (address) {
        return emailHashToAddress[_emailHash];
    }
} 
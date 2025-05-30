// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {EmailDomainProver, OrganizationVerificationData} from "./EmailDomainProver.sol";

contract RegistrationContract is Verifier {
    
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
    address public admin;
    
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
    
    // Admin control for emergency functions
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
    
    // ============ MODIFIERS ============
    
    modifier onlyRole(Role _role) {
        require(roles[msg.sender] == _role, "Unauthorized role");
        require(verified[msg.sender], "Address not verified");
        _;
    }
    
    modifier onlyAdmin() {
        require(admins[msg.sender] || msg.sender == admin, "Not admin");
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
    
    constructor(address _emailDomainProver) {
        emailDomainProver = _emailDomainProver;
        admin = msg.sender;
        admins[msg.sender] = true;
        
        // Register admin
        roles[msg.sender] = Role.Admin;
        verified[msg.sender] = true;
        registrationTimestamps[msg.sender] = block.timestamp;
        
        emit RoleAssigned(msg.sender, Role.Admin, block.timestamp);
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
        registrationTimestamps[msg.sender] = block.timestamp;
        
        emit PatientRegistered(msg.sender, _commitment, block.timestamp);
        emit RoleAssigned(msg.sender, Role.Patient, block.timestamp);
    }
    
    /// @notice Verify a patient's commitment with their secret passphrase
    /// @param _secret The secret passphrase used in the original commitment
    /// @return bool True if the commitment is valid
    function verifyPatientCommitment(string memory _secret) external view returns (bool) {
        require(roles[msg.sender] == Role.Patient, "Not a registered patient");
        
        bytes32 computedCommitment = keccak256(abi.encodePacked(_secret, msg.sender));
        return patientCommitments[msg.sender] == computedCommitment;
    }
    
    // ============ ORGANIZATION REGISTRATION ============
    
    /// @notice Verify domain ownership using vlayer email proof
    /// @param proof The vlayer proof from EmailDomainProver.verifyDomainOwnership
    /// @param emailHash Hash of the verified email address
    /// @param targetWallet The wallet address from the email subject
    /// @param domain The verified domain
    function verifyDomainOwnership(
        Proof calldata proof,
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
    /// @param proof The vlayer proof from EmailDomainProver.verifyOrganization
    /// @param orgData Complete organization verification data
    /// @param _role The organization role (Hospital or Insurer)
    function registerOrganization(
        Proof calldata proof,
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
    /// @param proof The vlayer proof from EmailDomainProver.simpleDomainVerification
    /// @param domain The verified domain
    /// @param emailHash Hash of the verified email
    function verifyAndStoreURL(
        Proof calldata proof,
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
    
    // ============ ADMIN FUNCTIONS ============
    
    /// @notice Add a new admin (only existing admins)
    function addAdmin(address _newAdmin) external onlyAdmin {
        require(_newAdmin != address(0), "Invalid admin address");
        require(!admins[_newAdmin], "Already an admin");
        
        admins[_newAdmin] = true;
        
        // If not already registered, register as admin
        if (roles[_newAdmin] == Role.None) {
            roles[_newAdmin] = Role.Admin;
            verified[_newAdmin] = true;
            registrationTimestamps[_newAdmin] = block.timestamp;
            emit RoleAssigned(_newAdmin, Role.Admin, block.timestamp);
        }
        
        emit AdminAdded(_newAdmin);
    }
    
    /// @notice Remove an admin (only existing admins, cannot remove self)
    function removeAdmin(address _admin) external onlyAdmin {
        require(_admin != msg.sender, "Cannot remove self");
        require(admins[_admin], "Not an admin");
        
        admins[_admin] = false;
        emit AdminRemoved(_admin);
    }
    
    /// @notice Emergency function to update verification status
    function updateVerificationStatus(address _user, bool _verified) external onlyAdmin {
        require(roles[_user] != Role.None, "User not registered");
        
        verified[_user] = _verified;
        emit VerificationStatusChanged(_user, _verified, block.timestamp);
    }
    
    /// @notice Emergency function to reset email hash usage (admin only)
    function resetEmailHash(bytes32 _emailHash) external onlyAdmin {
        usedEmailHashes[_emailHash] = false;
    }
    
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
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

/// @title RegistrationStorage
/// @notice Shared storage contract for all registration modules
contract RegistrationStorage {
    
    enum Role { None, Patient, Hospital, Insurer, Admin }
    
    struct Organization {
        string name;
        string domain;
        Role role;
        uint256 registrationTimestamp;
        bool verified;
        bytes32 emailHash;
    }
    
    // ============ ACCESS CONTROL ============
    mapping(address => bool) public authorizedModules;
    address public owner;
    
    modifier onlyAuthorized() {
        require(authorizedModules[msg.sender] || msg.sender == owner, "Unauthorized");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }
    
    // ============ CORE STATE VARIABLES ============
    
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
    
    // Admin mappings
    mapping(address => bool) public admins;
    mapping(address => bool) public owners;
    address[] public ownersList;
    
    // ============ CONSTRUCTOR ============
    
    constructor() {
        owner = msg.sender;
        authorizedModules[msg.sender] = true;
    }
    
    // ============ ACCESS CONTROL FUNCTIONS ============
    
    function authorizeModule(address _module) external onlyOwner {
        authorizedModules[_module] = true;
    }
    
    function revokeModule(address _module) external onlyOwner {
        authorizedModules[_module] = false;
    }
    
    function transferOwnership(address _newOwner) external onlyOwner {
        require(_newOwner != address(0), "Invalid owner");
        owner = _newOwner;
        authorizedModules[_newOwner] = true;
    }
    
    // ============ STATE MANAGEMENT FUNCTIONS ============
    
    function setRole(address _user, Role _role) external onlyAuthorized {
        roles[_user] = _role;
    }
    
    function setVerified(address _user, bool _verified) external onlyAuthorized {
        verified[_user] = _verified;
    }
    
    function setActiveUser(address _user, bool _active) external onlyAuthorized {
        activeUsers[_user] = _active;
        if (!_active) {
            deactivationTimestamp[_user] = block.timestamp;
        } else {
            deactivationTimestamp[_user] = 0;
        }
    }
    
    function setRegistrationTimestamp(address _user, uint256 _timestamp) external onlyAuthorized {
        registrationTimestamps[_user] = _timestamp;
    }
    
    function setPatientCommitment(address _patient, bytes32 _commitment) external onlyAuthorized {
        patientCommitments[_patient] = _commitment;
    }
    
    function setOrganization(address _org, Organization memory _organization) external onlyAuthorized {
        organizations[_org] = _organization;
    }
    
    function setDomainToAddress(string calldata _domain, address _address) external onlyAuthorized {
        domainToAddress[_domain] = _address;
    }
    
    function setEmailHashToAddress(bytes32 _emailHash, address _address) external onlyAuthorized {
        emailHashToAddress[_emailHash] = _address;
    }
    
    function setUsedEmailHash(bytes32 _emailHash, bool _used) external onlyAuthorized {
        usedEmailHashes[_emailHash] = _used;
    }
    
    function setAdmin(address _admin, bool _isAdmin) external onlyAuthorized {
        admins[_admin] = _isAdmin;
    }
    
    function setOwner(address _owner, bool _isOwner) external onlyAuthorized {
        owners[_owner] = _isOwner;
        if (_isOwner) {
            ownersList.push(_owner);
        } else {
            // Remove from owners list
            for (uint256 i = 0; i < ownersList.length; i++) {
                if (ownersList[i] == _owner) {
                    ownersList[i] = ownersList[ownersList.length - 1];
                    ownersList.pop();
                    break;
                }
            }
        }
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getOwners() external view returns (address[] memory) {
        return ownersList;
    }
    
    function isUserVerified(address _user) external view returns (bool) {
        return roles[_user] != Role.None && verified[_user];
    }
    
    function isUserActive(address _user) external view returns (bool) {
        return roles[_user] != Role.None && verified[_user] && activeUsers[_user];
    }
} 
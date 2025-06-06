// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./IRegistrationModule.sol";
import "./RegistrationStorage.sol";

/// @title AdminModule
/// @notice Handles admin/owner management and user activation
contract AdminModule is IRegistrationModule {
    
    RegistrationStorage public immutable storageContract;
    address public core;
    uint256 public constant MAX_OWNERS = 10;
    
    // ============ EVENTS ============
    
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event OwnerAdded(address indexed newOwner, address indexed addedBy);
    event OwnerRemoved(address indexed removedOwner, address indexed removedBy);
    event UserActivated(address indexed user, address indexed activatedBy);
    event UserDeactivated(address indexed user, address indexed deactivatedBy);
    event VerificationStatusChanged(
        address indexed user,
        bool verified,
        uint256 timestamp
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyCore() {
        require(msg.sender == core, "Only core contract");
        _;
    }
    
    modifier onlyOwners() {
        require(storageContract.owners(msg.sender), "Not an owner");
        _;
    }
    
    modifier onlyAdminOrOwner() {
        require(storageContract.admins(msg.sender) || storageContract.owners(msg.sender), "Not admin or owner");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _storage) {
        storageContract = RegistrationStorage(_storage);
    }
    
    // ============ INITIALIZATION ============
    
    function initialize(address _core) external override {
        require(core == address(0), "Already initialized");
        core = _core;
    }
    
    // ============ OWNER MANAGEMENT FUNCTIONS ============
    
    /// @notice Add a new owner (only existing owners)
    function addOwner(address _newOwner) external onlyOwners {
        require(_newOwner != address(0), "Invalid owner address");
        require(!storageContract.owners(_newOwner), "Already an owner");
        address[] memory ownersList = storageContract.getOwners();
        require(ownersList.length < MAX_OWNERS, "Maximum owners reached");
        
        storageContract.setOwner(_newOwner, true);
        storageContract.setActiveUser(_newOwner, true);
        
        // If not already registered, register as admin
        if (storageContract.roles(_newOwner) == RegistrationStorage.Role.None) {
            storageContract.setRole(_newOwner, RegistrationStorage.Role.Admin);
            storageContract.setVerified(_newOwner, true);
            storageContract.setRegistrationTimestamp(_newOwner, block.timestamp);
        }
        
        // Also add to legacy admin mapping for compatibility
        storageContract.setAdmin(_newOwner, true);
        
        emit OwnerAdded(_newOwner, msg.sender);
        emit AdminAdded(_newOwner);
    }
    
    /// @notice Remove an owner (only existing owners, cannot remove self)
    function removeOwner(address _owner) external onlyOwners {
        require(_owner != msg.sender, "Cannot remove self");
        require(storageContract.owners(_owner), "Not an owner");
        address[] memory ownersList = storageContract.getOwners();
        require(ownersList.length > 1, "Cannot remove last owner");
        
        storageContract.setOwner(_owner, false);
        storageContract.setAdmin(_owner, false);
        
        emit OwnerRemoved(_owner, msg.sender);
        emit AdminRemoved(_owner);
    }
    
    // ============ USER ACTIVATION FUNCTIONS ============
    
    /// @notice Activate a user (only owners)
    function activateUser(address _user) external onlyOwners {
        require(storageContract.roles(_user) != RegistrationStorage.Role.None, "User not registered");
        require(!storageContract.activeUsers(_user), "User already active");
        
        storageContract.setActiveUser(_user, true);
        
        emit UserActivated(_user, msg.sender);
    }
    
    /// @notice Deactivate a user (only owners)
    function deactivateUser(address _user) external onlyOwners {
        require(storageContract.roles(_user) != RegistrationStorage.Role.None, "User not registered");
        require(storageContract.activeUsers(_user), "User already inactive");
        require(!storageContract.owners(_user), "Cannot deactivate an owner");
        
        storageContract.setActiveUser(_user, false);
        
        emit UserDeactivated(_user, msg.sender);
    }
    
    /// @notice Batch activate users (only owners)
    function batchActivateUsers(address[] calldata _users) external onlyOwners {
        for (uint256 i = 0; i < _users.length; i++) {
            if (storageContract.roles(_users[i]) != RegistrationStorage.Role.None && !storageContract.activeUsers(_users[i])) {
                storageContract.setActiveUser(_users[i], true);
                emit UserActivated(_users[i], msg.sender);
            }
        }
    }
    
    /// @notice Batch deactivate users (only owners)
    function batchDeactivateUsers(address[] calldata _users) external onlyOwners {
        for (uint256 i = 0; i < _users.length; i++) {
            if (storageContract.roles(_users[i]) != RegistrationStorage.Role.None && 
                storageContract.activeUsers(_users[i]) && 
                !storageContract.owners(_users[i])) {
                storageContract.setActiveUser(_users[i], false);
                emit UserDeactivated(_users[i], msg.sender);
            }
        }
    }
    
    // ============ LEGACY ADMIN FUNCTIONS ============
    
    /// @notice Add a new admin (legacy function for backward compatibility)
    function addAdmin(address _newAdmin) external onlyAdminOrOwner {
        require(_newAdmin != address(0), "Invalid admin address");
        require(!storageContract.admins(_newAdmin), "Already an admin");
        
        storageContract.setAdmin(_newAdmin, true);
        storageContract.setActiveUser(_newAdmin, true);
        
        // If not already registered, register as admin
        if (storageContract.roles(_newAdmin) == RegistrationStorage.Role.None) {
            storageContract.setRole(_newAdmin, RegistrationStorage.Role.Admin);
            storageContract.setVerified(_newAdmin, true);
            storageContract.setRegistrationTimestamp(_newAdmin, block.timestamp);
        }
        
        emit AdminAdded(_newAdmin);
    }
    
    /// @notice Remove an admin (legacy function for backward compatibility)
    function removeAdmin(address _admin) external onlyAdminOrOwner {
        require(_admin != msg.sender, "Cannot remove self");
        require(storageContract.admins(_admin), "Not an admin");
        require(!storageContract.owners(_admin), "Cannot remove owner via admin function");
        
        storageContract.setAdmin(_admin, false);
        emit AdminRemoved(_admin);
    }
    
    /// @notice Emergency function to update verification status
    function updateVerificationStatus(address _user, bool _verified) external onlyAdminOrOwner {
        require(storageContract.roles(_user) != RegistrationStorage.Role.None, "User not registered");
        
        storageContract.setVerified(_user, _verified);
        emit VerificationStatusChanged(_user, _verified, block.timestamp);
    }
    
    /// @notice Emergency function to reset email hash usage (admin/owner only)
    function resetEmailHash(bytes32 _emailHash) external onlyAdminOrOwner {
        storageContract.setUsedEmailHash(_emailHash, false);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /// @notice Get all current owners
    function getOwners() external view returns (address[] memory) {
        return storageContract.getOwners();
    }
    
    /// @notice Check if address is an owner
    function isOwner(address _address) external view returns (bool) {
        return storageContract.owners(_address);
    }
    
    /// @notice Get user activation status and deactivation timestamp
    function getUserActivationStatus(address _user) external view returns (
        bool isActive,
        uint256 deactivatedAt
    ) {
        return (storageContract.activeUsers(_user), storageContract.deactivationTimestamp(_user));
    }
} 
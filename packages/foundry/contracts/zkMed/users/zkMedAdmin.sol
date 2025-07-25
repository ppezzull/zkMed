// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

/**
 * @title zkMed Admin Contract
 * @notice Handles admin registration, data storage, and administrative functions
 * @dev Manages own admin data and communicates with zkMedCore for verification only
 */
contract zkMedAdmin {
    
    // ======== Type Definitions ========

    enum AdminRole { BASIC, MODERATOR, SUPER_ADMIN }

    // ======== Data Structures ========
    
    // Admin record structure
    struct AdminRecord {
        bool isActive;
        AdminRole role;
        uint256 permissions;
        uint256 adminSince;
    }
    
    // ======== State Variables ========
    
    address public zkMedCoreContract;
    
    // Admin data storage
    mapping(address => AdminRecord) public admins;
    uint256 public totalAdmins;
    
    // ======== Events ========
    
    event AdminAdded(address indexed admin, AdminRole role);
    event AdminPermissionsUpdated(address indexed admin, uint256 newPermissions);
    event AdminDeactivated(address indexed admin);
    
    // ======== Constructor ========
    
    constructor(address _zkMedCore) {
        zkMedCoreContract = _zkMedCore;
        
        // Set deployer as super admin
        admins[msg.sender] = AdminRecord({
            isActive: true,
            role: AdminRole.SUPER_ADMIN,
            permissions: type(uint256).max,
            adminSince: block.timestamp
        });
        totalAdmins = 1;
        
        emit AdminAdded(msg.sender, AdminRole.SUPER_ADMIN);
    }
    
    // ======== Modifiers ========
    
    modifier onlyCore() {
        require(msg.sender == zkMedCoreContract, "Only zkMedCore can call this");
        _;
    }
    
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

    // ======== Admin Management Functions ========
    
    /**
     * @dev Add a new admin with specified role (super admin only)
     * @param adminAddress Address to add as admin
     * @param role Admin role to assign
     */
    function addAdmin(address adminAddress, AdminRole role) external onlySuperAdmin {
        require(adminAddress != address(0), "Invalid admin address");
        require(!admins[adminAddress].isActive, "Address is already an admin");
        
        uint256 permissions;
        if (role == AdminRole.BASIC) {
            permissions = 1; // Basic permissions
        } else if (role == AdminRole.MODERATOR) {
            permissions = 255; // Moderate permissions
        } else if (role == AdminRole.SUPER_ADMIN) {
            permissions = type(uint256).max; // All permissions
        }
        
        admins[adminAddress] = AdminRecord({
            isActive: true,
            role: role,
            permissions: permissions,
            adminSince: block.timestamp
        });
        
        totalAdmins++;
        
        // Notify zkMedCore
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("addAdmin(address,uint8)", adminAddress, uint8(role))
        );
        require(success, "Failed to notify core");
        
        emit AdminAdded(adminAddress, role);
    }
    
    /**
     * @dev Update admin permissions (super admin only)
     * @param adminAddress Address of admin to update
     * @param newPermissions New permission level
     */
    function updateAdminPermissions(address adminAddress, uint256 newPermissions) external onlySuperAdmin {
        require(admins[adminAddress].isActive, "Admin not registered");
        
        admins[adminAddress].permissions = newPermissions;
        
        emit AdminPermissionsUpdated(adminAddress, newPermissions);
    }
    
    /**
     * @dev Deactivate an admin (super admin only)
     * @param adminAddress Address of admin to deactivate
     */
    function deactivateAdmin(address adminAddress) external onlySuperAdmin {
        require(admins[adminAddress].isActive, "Admin not active");
        require(adminAddress != msg.sender, "Cannot deactivate yourself");
        
        admins[adminAddress].isActive = false;
        totalAdmins--;
        
        emit AdminDeactivated(adminAddress);
    }

    // ======== Hospital & Insurer Activation Functions ========
    
    /**
     * @dev Activate a registered hospital (moderator+ only)
     * @param hospitalAddress Address of the hospital to activate
     */
    function activateHospital(address hospitalAddress) external onlyModeratorOrSuperAdmin {
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("activateHospital(address)", hospitalAddress)
        );
        require(success, "Failed to activate hospital");
    }
    
    /**
     * @dev Activate a registered insurer (moderator+ only)
     * @param insurerAddress Address of the insurer to activate
     */
    function activateInsurer(address insurerAddress) external onlyModeratorOrSuperAdmin {
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("activateInsurer(address)", insurerAddress)
        );
        require(success, "Failed to activate insurer");
    }
    
    /**
     * @dev Deactivate any user (moderator+ only)
     * @param userAddress Address of the user to deactivate
     */
    function deactivateUser(address userAddress) external onlyModeratorOrSuperAdmin {
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("deactivateUser(address)", userAddress)
        );
        require(success, "Failed to deactivate user");
    }

    // ======== View Functions ========
    
    /**
     * @dev Check if an address is an admin
     * @param adminAddress Address to check
     * @return bool True if the address is an active admin
     */
    function isAdmin(address adminAddress) external view returns (bool) {
        return admins[adminAddress].isActive;
    }
    
    /**
     * @dev Check if an address is a moderator or super admin
     * @param adminAddress Address to check
     * @return bool True if the address is a moderator or super admin
     */
    function isModeratorOrSuperAdmin(address adminAddress) external view returns (bool) {
        return admins[adminAddress].isActive && 
               (admins[adminAddress].role == AdminRole.MODERATOR || 
                admins[adminAddress].role == AdminRole.SUPER_ADMIN);
    }
    
    /**
     * @dev Get admin type for a given address
     * @param adminAddress Address to check
     * @return AdminRole The role of the admin
     */
    function getAdminType(address adminAddress) external view returns (AdminRole) {
        require(admins[adminAddress].isActive, "Admin not registered");
        return admins[adminAddress].role;
    }
    
    /**
     * @dev Get admin record for a given address
     * @param adminAddress Address to check
     * @return AdminRecord The complete admin record
     */
    function getAdminRecord(address adminAddress) external view returns (AdminRecord memory) {
        return admins[adminAddress];
    }
}
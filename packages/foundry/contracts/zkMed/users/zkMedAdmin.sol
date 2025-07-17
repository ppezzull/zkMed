// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {zkMedRequestManager} from "../zkMedRequestManager.sol";

/**
 * @title zkMed Admin Contract
 * @notice Handles admin registration, data storage, and administrative functions
 * @dev Manages own admin data and communicates with zkMedCore for verification only
 */
contract zkMedAdmin {
    
    // ======== Data Structures ========
    
    // Admin record structure
    struct AdminRecord {
        bool isActive;
        zkMedRequestManager.AdminRole role;
        uint256 permissions;
        uint256 adminSince;
    }
    
    // ======== State Variables ========
    
    address public zkMedCoreContract;
    
    // Admin data storage
    mapping(address => AdminRecord) public admins;
    uint256 public totalAdmins;
    
    // ======== Events ========
    
    event AdminAdded(address indexed admin, zkMedRequestManager.AdminRole role);
    event AdminAccessRequested(address indexed requester, zkMedRequestManager.AdminRole requestedRole, uint256 indexed requestId);
    event RequestApprovedByAdmin(uint256 indexed requestId, address indexed admin);
    event RequestRejectedByAdmin(uint256 indexed requestId, address indexed admin, string reason);
    event UserDeactivatedByAdmin(address indexed user, address indexed admin);
    event AdminPermissionsUpdated(address indexed admin, uint256 newPermissions);
    
    // ======== Constructor ========
    
    constructor(address _zkMedCore) {
        zkMedCoreContract = _zkMedCore;
        
        // Set deployer as super admin
        admins[msg.sender] = AdminRecord({
            isActive: true,
            role: zkMedRequestManager.AdminRole.SUPER_ADMIN,
            permissions: type(uint256).max,
            adminSince: block.timestamp
        });
        totalAdmins = 1;
        
        emit AdminAdded(msg.sender, zkMedRequestManager.AdminRole.SUPER_ADMIN);
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
            admins[msg.sender].role == zkMedRequestManager.AdminRole.SUPER_ADMIN, 
            "Not a super admin"
        );
        _;
    }
    
    modifier onlyModeratorOrSuperAdmin() {
        require(
            admins[msg.sender].isActive && 
            (admins[msg.sender].role == zkMedRequestManager.AdminRole.SUPER_ADMIN || 
             admins[msg.sender].role == zkMedRequestManager.AdminRole.MODERATOR), 
            "Not a moderator or super admin"
        );
        _;
    }
    
    modifier notAdmin() {
        require(!admins[msg.sender].isActive, "Already an admin");
        _;
    }
    
    // ======== Admin Management Functions ========
    
    /**
     * @dev Add a new admin with specified role (super admin only)
     * @param newAdmin Address of the new admin
     * @param role Admin role to assign
     */
    function addAdmin(address newAdmin, zkMedRequestManager.AdminRole role) external onlySuperAdmin {
        require(newAdmin != address(0), "Invalid admin address");
        require(newAdmin != msg.sender, "Cannot add self as admin");
        require(!admins[newAdmin].isActive, "Address is already an admin");
        
        // Set permissions based on role
        uint256 permissions = 0;
        if (role == zkMedRequestManager.AdminRole.BASIC) {
            permissions = 1; // Basic permissions
        } else if (role == zkMedRequestManager.AdminRole.MODERATOR) {
            permissions = 255; // Moderate permissions
        } else if (role == zkMedRequestManager.AdminRole.SUPER_ADMIN) {
            permissions = type(uint256).max; // Full permissions
        }
        
        admins[newAdmin] = AdminRecord({
            isActive: true,
            role: role,
            permissions: permissions,
            adminSince: block.timestamp
        });
        totalAdmins++;
        
        // Notify zkMedCore for cross-system coordination
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("notifyAdminAdded(address,uint8)", newAdmin, uint8(role))
        );
        require(success, "Failed to notify core contract");
        
        emit AdminAdded(newAdmin, role);
    }
    
    /**
     * @dev Update admin permissions (super admin only)
     * @param admin Address of the admin
     * @param permissions New permission bitmask
     */
    function updateAdminPermissions(address admin, uint256 permissions) external onlySuperAdmin {
        require(admin != address(0), "Invalid admin address");
        require(admins[admin].isActive, "Target is not an admin");
        
        admins[admin].permissions = permissions;
        emit AdminPermissionsUpdated(admin, permissions);
    }
    
    /**
     * @dev Request admin access with proper validation
     * @param requestedRole The admin role being requested
     * @param reason The reason for requesting admin access
     */
    function requestAdminAccess(
        zkMedRequestManager.AdminRole requestedRole, 
        string calldata reason
    ) external notAdmin {
        require(requestedRole != zkMedRequestManager.AdminRole.SUPER_ADMIN, "Cannot request super admin role");
        require(bytes(reason).length > 0, "Reason cannot be empty");
        require(bytes(reason).length <= 500, "Reason too long");
        
        // Call zkMedCore to create admin access request
        (bool success, bytes memory result) = zkMedCoreContract.call(
            abi.encodeWithSignature(
                "createAdminAccessRequest(address,uint8,string)",
                msg.sender,
                uint8(requestedRole),
                reason
            )
        );
        require(success, "Failed to create admin access request");
        
        uint256 requestId = abi.decode(result, (uint256));
        emit AdminAccessRequested(msg.sender, requestedRole, requestId);
    }
    
    // ======== Request Management Functions ========
    
    /**
     * @dev Approve any type of request with enhanced validation
     * @param requestId The ID of the request to approve
     */
    function approveRequest(uint256 requestId) external onlyModeratorOrSuperAdmin {
        // Call zkMedCore to approve request with validation
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("approveRequest(uint256,address)", requestId, msg.sender)
        );
        require(success, "Failed to approve request");
        
        emit RequestApprovedByAdmin(requestId, msg.sender);
    }
    
    /**
     * @dev Reject any type of request with enhanced validation
     * @param requestId The ID of the request to reject
     * @param reason The reason for rejection
     */
    function rejectRequest(uint256 requestId, string calldata reason) external onlyModeratorOrSuperAdmin {
        require(bytes(reason).length > 0, "Rejection reason cannot be empty");
        require(bytes(reason).length <= 500, "Rejection reason too long");
        
        // Call zkMedCore to reject request with validation
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("rejectRequest(uint256,address,string)", requestId, msg.sender, reason)
        );
        require(success, "Failed to reject request");
        
        emit RequestRejectedByAdmin(requestId, msg.sender, reason);
    }
    
    /**
     * @dev Approve a payment plan request with validation and automatic first payment
     * @param requestId The ID of the payment plan request to approve
     */
    function approvePaymentPlan(uint256 requestId) external payable onlyModeratorOrSuperAdmin {
        // Call zkMedCore to approve payment plan with validation
        (bool success,) = zkMedCoreContract.call{value: msg.value}(
            abi.encodeWithSignature("approvePaymentPlan(uint256,address)", requestId, msg.sender)
        );
        require(success, "Failed to approve payment plan");
        
        emit RequestApprovedByAdmin(requestId, msg.sender);
    }
    
    /**
     * @dev Reject a payment plan request with validation
     * @param requestId The ID of the payment plan request to reject
     * @param reason The reason for rejection
     */
    function rejectPaymentPlan(uint256 requestId, string calldata reason) external onlyModeratorOrSuperAdmin {
        require(bytes(reason).length > 0, "Rejection reason cannot be empty");
        require(bytes(reason).length <= 500, "Rejection reason too long");
        
        // Call zkMedCore to reject payment plan with validation
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("rejectPaymentPlan(uint256,address,string)", requestId, msg.sender, reason)
        );
        require(success, "Failed to reject payment plan");
        
        emit RequestRejectedByAdmin(requestId, msg.sender, reason);
    }
    
    /**
     * @dev Deactivate a user (admin only)
     * @param user Address of the user to deactivate
     */
    function deactivateUser(address user) external onlyAdmin {
        require(user != address(0), "Invalid user address");
        require(user != msg.sender, "Cannot deactivate self");
        
        // Call zkMedCore to deactivate user
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("deactivateUser(address,address)", user, msg.sender)
        );
        require(success, "Failed to deactivate user");
        
        emit UserDeactivatedByAdmin(user, msg.sender);
    }
    
    // ======== View Functions ========
    
    /**
     * @dev Check if an address is an admin
     * @param admin Address to check
     * @return bool True if active admin
     */
    function isAdmin(address admin) external view returns (bool) {
        return admins[admin].isActive;
    }
    
    /**
     * @dev Check if caller is an admin
     * @return bool True if caller is an active admin
     */
    function amIAdmin() external view returns (bool) {
        return admins[msg.sender].isActive;
    }
    
    /**
     * @dev Check if caller is a super admin
     * @return bool True if caller is an active super admin
     */
    function isSuperAdmin() external view returns (bool) {
        return admins[msg.sender].isActive && 
               admins[msg.sender].role == zkMedRequestManager.AdminRole.SUPER_ADMIN;
    }
    
    /**
     * @dev Check if caller is a moderator or super admin
     * @return bool True if caller is an active moderator or super admin
     */
    function isModeratorOrSuperAdmin() external view returns (bool) {
        return admins[msg.sender].isActive && 
               (admins[msg.sender].role == zkMedRequestManager.AdminRole.SUPER_ADMIN || 
                admins[msg.sender].role == zkMedRequestManager.AdminRole.MODERATOR);
    }
    
    /**
     * @dev Get admin details for caller
     * @return isActive Whether the admin is active
     * @return role The admin's role
     * @return permissions The admin's permissions bitmask
     * @return adminSince Timestamp when admin was appointed
     */
    function getMyAdminDetails() external view onlyAdmin returns (
        bool isActive,
        zkMedRequestManager.AdminRole role,
        uint256 permissions,
        uint256 adminSince
    ) {
        AdminRecord memory record = admins[msg.sender];
        return (record.isActive, record.role, record.permissions, record.adminSince);
    }
    
    /**
     * @dev Get admin record
     * @param admin Admin address
     * @return AdminRecord struct
     */
    function getAdminRecord(address admin) external view returns (AdminRecord memory) {
        require(admins[admin].isActive, "Admin not registered");
        return admins[admin];
    }
    
    /**
     * @dev Get admin type
     * @param admin Admin address
     * @return AdminRole enum value
     */
    function getAdminType(address admin) external view returns (zkMedRequestManager.AdminRole) {
        require(admins[admin].isActive, "Admin not registered");
        return admins[admin].role;
    }
    
    /**
     * @dev Get total number of admins
     * @return uint256 Total admins
     */
    function getTotalAdmins() external view returns (uint256) {
        return totalAdmins;
    }
    
    // ======== Core Interface Functions ========
    
    /**
     * @dev Deactivate an admin (only callable by zkMedCore)
     * @param admin Admin address to deactivate
     */
    function deactivateAdmin(address admin) external onlyCore {
        require(admins[admin].isActive, "Admin not registered");
        admins[admin].isActive = false;
        totalAdmins--;
    }
    
    // ======== Request Query Functions (delegated to core) ========
    
    /**
     * @dev Get all pending requests
     * @return Array of pending request IDs
     */
    function getPendingRequests() external view onlyAdmin returns (uint256[] memory) {
        (bool success, bytes memory result) = zkMedCoreContract.staticcall(
            abi.encodeWithSignature("getPendingRequests()")
        );
        require(success, "Failed to get pending requests");
        return abi.decode(result, (uint256[]));
    }
    
    /**
     * @dev Get pending requests by type
     * @param reqType The type of requests to filter for
     * @return Array of pending request IDs of the specified type
     */
    function getPendingRequestsByType(
        zkMedRequestManager.RequestType reqType
    ) external view onlyAdmin returns (uint256[] memory) {
        (bool success, bytes memory result) = zkMedCoreContract.staticcall(
            abi.encodeWithSignature("getPendingRequestsByType(uint8)", uint8(reqType))
        );
        require(success, "Failed to get pending requests by type");
        return abi.decode(result, (uint256[]));
    }
    
    /**
     * @dev Get registration statistics
     * @return totalUsers Total registered users
     * @return patients Total patients
     * @return hospitals Total hospitals
     * @return insurers Total insurers
     */
    function getRegistrationStats() external view onlyAdmin returns (
        uint256 totalUsers,
        uint256 patients, 
        uint256 hospitals,
        uint256 insurers
    ) {
        (bool success, bytes memory result) = zkMedCoreContract.staticcall(
            abi.encodeWithSignature("getRegistrationStats()")
        );
        require(success, "Failed to get registration stats");
        return abi.decode(result, (uint256, uint256, uint256, uint256));
    }
} 
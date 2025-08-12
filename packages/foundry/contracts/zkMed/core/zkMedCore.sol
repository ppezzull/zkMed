// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {PatientLib} from "../libraries/PatientLib.sol";
import {HospitalLib} from "../libraries/HospitalLib.sol";
import {InsurerLib} from "../libraries/InsurerLib.sol";
import {AdminLib} from "../libraries/AdminLib.sol";

/**
 * @title zkMed Core Contract  
 * @notice Ultra-lean orchestrator for healthcare system verification and coordination
 * @dev Only handles verification, validation, and cross-contract coordination
 */
contract zkMedCore is Ownable {    
    // ======== Centralized user storage ========
    using PatientLib for PatientLib.PatientState;
    using HospitalLib for HospitalLib.HospitalState;
    using InsurerLib for InsurerLib.InsurerState;
    using AdminLib for AdminLib.AdminState;
    PatientLib.PatientState private patientsState;
    HospitalLib.HospitalState private hospitalsState;
    InsurerLib.InsurerState private insurersState;
    AdminLib.AdminState private adminsState;
    
    // ======== Events ========
    event PatientRegistered(address indexed patient);
    event HospitalRegistered(address indexed hospital, string domain, bytes32 emailHash, string organizationName);
    event InsurerRegistered(address indexed insurer, string domain, bytes32 emailHash, string organizationName);
    event AdminAdded(address indexed admin, AdminLib.AdminRole role);
    event AdminDeactivated(address indexed admin);
    event UserDeactivated(address indexed user);
    
    event PaymentPlanCreated(address indexed patient, address indexed insurer, uint256 indexed planId);
    event PaymentMade(address indexed patient, address indexed insurer, uint256 amount);

    // ======== Custom Errors ========
    error NotAdmin();
    error NotModerator();
    error CannotAddSelf();
    error SuperAdminOnly();
    error SuperAdminCannotBeAdded();
    error SuperAdminCannotBeDeactivated();
    error CannotDeactivateSelf();
    error InvalidAdminAddress();

    // ======== External Variables ========
    address public organizationProver;
    address public patientProver;
    address public paymentPlanProver;
    address public claimProver;
    ERC20 public usdc;

    // ======== Constructor ========
    constructor(
        address _organizationProver,
        address _patientProver,
        address _paymentPlanProver,
        address _claimProver,
        address _usdc
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = ERC20(_usdc);
        adminsState.addAdmin(msg.sender, AdminLib.AdminRole.SUPER_ADMIN);
        emit AdminAdded(msg.sender, AdminLib.AdminRole.SUPER_ADMIN);
    }

    // ======== Modifiers ========
    modifier onlyAdmin() {
        if (!isAdmin(msg.sender)) revert NotAdmin();
        _;
    }

    modifier onlyModerator() {
        if (_roleOf(msg.sender) < AdminLib.AdminRole.MODERATOR) revert NotModerator();
        _;
    }

    // ======== Internal Helpers ========
    function _roleOf(address account) private view returns (AdminLib.AdminRole) {
        return adminsState.records[account].role;
    }

    function _isSuperAdmin(address account) private view returns (bool) {
        return _roleOf(account) == AdminLib.AdminRole.SUPER_ADMIN;
    }

    // ======== Register Functions ========
    
    /**
     * @dev Register a patient
     * @param patient Address of the patient
     * @param emailHash Email hash of the patient
     */
    function registerPatient(address patient, bytes32 emailHash) external {
        patientsState.register(patient, emailHash);
        emit PatientRegistered(patient);
    }

    /**
     * @dev Register a hospital
     * @param hospital Address of the hospital
     * @param emailHash Email hash of the hospital
     * @param domain Domain of the hospital
     * @param organizationName Organization name of the hospital
     */
    function registerHospital(
        address hospital, 
        bytes32 emailHash, 
        string calldata domain, 
        string calldata organizationName
    ) external {
        hospitalsState.register(hospital, emailHash, domain, organizationName);
        emit HospitalRegistered(hospital, domain, emailHash, organizationName);
    }

    /**
     * @dev Register an insurer
     * @param insurer Address of the insurer
     * @param emailHash Email hash of the insurer
     * @param domain Domain of the insurer
     * @param organizationName Organization name of the insurer
     */
    function registerInsurer(
        address insurer, 
        bytes32 emailHash, 
        string calldata domain, 
        string calldata organizationName
    ) external {
        insurersState.register(insurer, emailHash, domain, organizationName);
        emit InsurerRegistered(insurer, domain, emailHash, organizationName);
    }

    // ======== Admin Management ========
    
    /**
     * @dev Add admin through authorization (called by admin contract)
     * @param admin Address to add as admin
     * @param role Admin role as uint8
     */
    function addAdmin(address admin, AdminLib.AdminRole role) external onlyAdmin {
        if (admin == msg.sender) revert CannotAddSelf();
        if (admin == address(0)) revert InvalidAdminAddress();
        if (role == AdminLib.AdminRole.SUPER_ADMIN) revert SuperAdminCannotBeAdded();
        if (role == AdminLib.AdminRole.MODERATOR) {
            if (!_isSuperAdmin(msg.sender)) revert SuperAdminOnly();
        }
        adminsState.addAdmin(admin, role);
        emit AdminAdded(admin, role);
    }

    /**
     * @dev Deactivate admin through authorization (called by admin contract)
     * @param admin Address to deactivate
     */
    function deactivateAdmin(address admin) external onlyAdmin {
        if (admin == msg.sender) revert CannotDeactivateSelf();
        if (admin == address(0)) revert InvalidAdminAddress();
        if (_isSuperAdmin(admin)) revert SuperAdminCannotBeDeactivated();
        if (_roleOf(admin) == AdminLib.AdminRole.MODERATOR) {
            if (!_isSuperAdmin(msg.sender)) revert SuperAdminOnly();
        }
        adminsState.deactivate(admin);
        emit AdminDeactivated(admin);
    }

    /**
     * @dev Check if an address is an admin
     * @param admin Address to check
     * @return bool True if admin
     */
    function isAdmin(address admin) public view returns (bool) {
        return adminsState.isAdmin(admin);
    }

    // ======== Organization Activation (Admin Only) ========
    
    /**
     * @dev Activate a registered hospital (admin only)
     * @param hospitalAddress Address of the hospital to activate
     */
    function activateHospital(address hospitalAddress) external onlyAdmin {
        HospitalLib.setActive(hospitalsState, hospitalAddress);
    }
    
    /**
     * @dev Activate a registered insurer (admin only)
     * @param insurerAddress Address of the insurer to activate
     */
    function activateInsurer(address insurerAddress) external onlyAdmin {
        InsurerLib.setActive(insurersState, insurerAddress);
    }

    // ======== User Management Coordination ========
    
    function deactivateHospital(address hospital) external onlyAdmin {
        HospitalLib.deactivate(hospitalsState, hospital);
    }

    function deactivateInsurer(address insurer) external onlyAdmin {
        InsurerLib.deactivate(insurersState, insurer);
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
        patients = patientsState.total;
        hospitals = hospitalsState.total;
        insurers = insurersState.total;
        totalUsers = patients + hospitals + insurers;
    }

    // ======== User Views ========

    function getTotalPatients() external view returns (uint256) {
        return patientsState.total;
    }

    function isPatientRegistered(address patient) external view returns (bool) {
        return patientsState.isRegistered(patient);
    }

    function getTotalHospitals() external view returns (uint256) {
        return hospitalsState.total;
    }

    function isHospitalRegistered(address hospital) external view returns (bool) {
        return hospitalsState.isRegistered(hospital);
    }

    function getTotalInsurers() external view returns (uint256) {
        return insurersState.total;
    }

    function isInsurerRegistered(address insurer) external view returns (bool) {
        return insurersState.isRegistered(insurer);
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
        if (patientsState.isRegistered(user)) {
            return ("PATIENT", true);
        }
        
        // Check if user is a hospital
        if (hospitalsState.isRegistered(user)) {
            return ("HOSPITAL", hospitalsState.records[user].isActive);
        }
        
        // Check if user is an insurer
        if (insurersState.isRegistered(user)) {
            return ("INSURER", insurersState.records[user].isActive);
        }
        
        // Check if user is an admin
        if (user == owner() || adminsState.isAdmin(user)) {
            return ("ADMIN", true);
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

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {ERC20} from "openzeppelin-contracts/token/ERC20/ERC20.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {AdminLib} from "../libraries/AdminLib.sol";
import {IPatientRegistry} from "../interfaces/IPatientRegistry.sol";
import {IHospitalRegistry} from "../interfaces/IHospitalRegistry.sol";
import {IInsurerRegistry} from "../interfaces/IInsurerRegistry.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {zkMedOrganizationProver} from "../provers/zkMedOrganizationProver.sol";
import {zkMedPatientProver} from "../provers/zkMedPatientProver.sol";

/**
 * @title zkMed Core Contract  
 * @notice Ultra-lean orchestrator for healthcare system verification and coordination
 * @dev Only handles verification, validation, and cross-contract coordination
 */
contract zkMedCore is Ownable {
    // ======== External registries ========
    using AdminLib for AdminLib.AdminState;
    IPatientRegistry public patientRegistry;
    IHospitalRegistry public hospitalRegistry;
    IInsurerRegistry public insurerRegistry;
    AdminLib.AdminState private adminsState;
    
    // ======== Events ========
     event PatientRegistered(zkMedPatientProver.PatientRegistrationData data);
     event HospitalRegistered(zkMedOrganizationProver.OrganizationRegistrationData data);
     event InsurerRegistered(zkMedOrganizationProver.OrganizationRegistrationData data);
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
    ERC20 public usdc;

    // ======== Constructor ========
    constructor(
        address _usdc,
        address _patientRegistry,
        address _hospitalRegistry,
        address _insurerRegistry
    ) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_patientRegistry != address(0), "Invalid patient registry");
        require(_hospitalRegistry != address(0), "Invalid hospital registry");
        require(_insurerRegistry != address(0), "Invalid insurer registry");
        usdc = ERC20(_usdc);
        patientRegistry = IPatientRegistry(_patientRegistry);
        hospitalRegistry = IHospitalRegistry(_hospitalRegistry);
        insurerRegistry = IInsurerRegistry(_insurerRegistry);
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
     * @param proof Proof of the patient
     * @param data Data of the patient
     */
    function registerPatient(
        Proof memory proof,
        zkMedPatientProver.PatientRegistrationData memory data
    ) external {
        patientRegistry.register(proof, data);
        emit PatientRegistered(data);
    }

    /**
     * @dev Register a hospital
     * @param proof Proof of the hospital
     * @param data Data of the hospital
     */
    function registerHospital(
        Proof memory proof,
        zkMedOrganizationProver.OrganizationRegistrationData memory data
    ) external {
        hospitalRegistry.register(proof, data);
        emit HospitalRegistered(data);
    }

    /**
     * @dev Register an insurer
     * @param proof Proof of the insurer
     * @param data Data of the insurer
     */
    function registerInsurer(
        Proof memory proof,
        zkMedOrganizationProver.OrganizationRegistrationData memory data
    ) external {
        insurerRegistry.register(proof, data);
        emit InsurerRegistered(data);
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
        hospitalRegistry.setActive(hospitalAddress);
    }
    
    /**
     * @dev Activate a registered insurer (admin only)
     * @param insurerAddress Address of the insurer to activate
     */
    function activateInsurer(address insurerAddress) external onlyAdmin {
        insurerRegistry.setActive(insurerAddress);
    }

    // ======== User Management Coordination ========
    
    function deactivateHospital(address hospital) external onlyAdmin {
        hospitalRegistry.deactivate(hospital);
    }

    function deactivateInsurer(address insurer) external onlyAdmin {
        insurerRegistry.deactivate(insurer);
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
        patients = patientRegistry.getTotal();
        hospitals = hospitalRegistry.getTotal();
        insurers = insurerRegistry.getTotal();
        totalUsers = patients + hospitals + insurers;
    }

    // ======== User Views ========

    function getTotalPatients() external view returns (uint256) {
        return patientRegistry.getTotal();
    }

    function isPatientRegistered(address patient) external view returns (bool) {
        return patientRegistry.isRegistered(patient);
    }

    function getTotalHospitals() external view returns (uint256) {
        return hospitalRegistry.getTotal();
    }

    function isHospitalRegistered(address hospital) external view returns (bool) {
        return hospitalRegistry.isRegistered(hospital);
    }

    function getTotalInsurers() external view returns (uint256) {
        return insurerRegistry.getTotal();
    }

    function isInsurerRegistered(address insurer) external view returns (bool) {
        return insurerRegistry.isRegistered(insurer);
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
        if (patientRegistry.isRegistered(user)) {
            return ("PATIENT", true);
        }
        
        // Check if user is a hospital
        if (hospitalRegistry.isRegistered(user)) {
            return ("HOSPITAL", hospitalRegistry.isActive(user));
        }
        
        // Check if user is an insurer
        if (insurerRegistry.isRegistered(user)) {
            return ("INSURER", insurerRegistry.isActive(user));
        }
        
        // Check if user is an admin
        if (user == owner() || adminsState.isAdmin(user)) {
            return ("ADMIN", true);
        }
        
        // User is not registered in any capacity
        return ("UNREGISTERED", false);
    }

    // No extra helpers needed; registries expose `isActive`
    
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

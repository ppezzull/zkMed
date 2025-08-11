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
    // ======== State Variables ========

    ERC20 public usdc;
    
    // Centralized user storage (moved from user contracts)
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
    event UserDeactivated(address indexed user);
    
    event PaymentPlanCreated(address indexed patient, address indexed insurer, uint256 indexed planId);
    event PaymentMade(address indexed patient, address indexed insurer, uint256 amount);
    event LinkPayContractUpdated(address indexed linkPayAddress);

    // ======== Constructor ========

    constructor(address _usdc) Ownable(msg.sender) {
        require(_usdc != address(0), "Invalid USDC address");
        usdc = ERC20(_usdc);
        // Set deployer as SUPER_ADMIN (role = 2) with full permissions
        adminsState.addAdmin(msg.sender, AdminLib.AdminRole.SUPER_ADMIN, type(uint256).max);
        emit AdminAdded(msg.sender, AdminLib.AdminRole.SUPER_ADMIN);
    }

    // ======== Register Functions (Core API) ========

    function registerPatient(address patient, bytes32 emailHash) external onlyOwner {
        patientsState.register(patient, emailHash);
        emit PatientRegistered(patient);
    }

    function registerHospital(address hospital, bytes32 emailHash, string calldata domain, string calldata organizationName) external onlyOwner {
        hospitalsState.register(hospital, emailHash, domain, organizationName);
        emit HospitalRegistered(hospital, domain, emailHash, organizationName);
    }

    function registerInsurer(address insurer, bytes32 emailHash, string calldata domain, string calldata organizationName) external onlyOwner {
        insurersState.register(insurer, emailHash, domain, organizationName);
        emit InsurerRegistered(insurer, domain, emailHash, organizationName);
    }

    // ======== Admin Management ========
    
    /**
     * @dev Add admin through authorization (called by admin contract)
     * @param admin Address to add as admin
     * @param role Admin role as uint8
     */
    function addAdmin(address admin, AdminLib.AdminRole role) external onlyOwner {
        // Basic role permissions mapping; can be extended
        uint256 perms = role == AdminLib.AdminRole.BASIC ? 1 : (role == AdminLib.AdminRole.MODERATOR ? 255 : type(uint256).max);
        adminsState.addAdmin(admin, role, perms);
        emit AdminAdded(admin, AdminLib.AdminRole(role));
    }

    function deactivateAdmin(address admin) external onlyOwner {
        adminsState.deactivate(admin);
    }

    function isAdmin(address admin) external view returns (bool) {
        return adminsState.isAdmin(admin);
    }

    // ======== Link Pay Integration ========
    
    /**
     * @dev Update link pay contract address in patient contract
     * @param linkPayAddress New LinkPay contract address
     */
    function updatePatientLinkPayContract(address linkPayAddress) external onlyOwner {
        require(linkPayAddress != address(0), "Invalid LinkPay address");
        emit LinkPayContractUpdated(linkPayAddress);
    }

    // ======== Organization Activation (Admin Only) ========
    
    /**
     * @dev Activate a registered hospital (admin only)
     * @param hospitalAddress Address of the hospital to activate
     */
    function activateHospital(address hospitalAddress) external onlyOwner {
        HospitalLib.setActive(hospitalsState, hospitalAddress, true, true);
    }
    
    /**
     * @dev Activate a registered insurer (admin only)
     * @param insurerAddress Address of the insurer to activate
     */
    function activateInsurer(address insurerAddress) external onlyOwner {
        InsurerLib.setActive(insurersState, insurerAddress, true, true);
    }

    // ======== User Management Coordination ========
    
    /**
     * @dev Deactivate a user across all contracts
     * @param user Address of the user to deactivate
     */
    function deactivateUser(address user) external onlyOwner {
        PatientLib.deactivate(patientsState, user);
        HospitalLib.setActive(hospitalsState, user, false, false);
        InsurerLib.setActive(insurersState, user, false, false);
        emit UserDeactivated(user);
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

    // ======== Domain and Email Validation ========
    
    /**
     * @dev Validate hospital domain through hospital contract
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function validateHospitalDomain(string calldata domain) external view returns (bool) {
        address hospital = hospitalsState.domainToHospital[domain];
        return hospital != address(0) && hospitalsState.records[hospital].isActive;
    }

    /**
     * @dev Validate insurer domain through insurer contract
     * @param domain Domain to validate
     * @return bool True if valid insurer domain
     */
    function validateInsurerDomain(string calldata domain) external view returns (bool) {
        address insurer = insurersState.domainToInsurer[domain];
        return insurer != address(0) && insurersState.records[insurer].isActive;
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
            bool approved = hospitalsState.records[user].isApproved;
            return ("HOSPITAL", approved);
        }
        
        // Check if user is an insurer
        if (insurersState.isRegistered(user)) {
            bool approved = insurersState.records[user].isApproved;
            return ("INSURER", approved);
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

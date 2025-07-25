// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";

/**
 * @title zkMed Core Contract  
 * @notice Ultra-lean orchestrator for healthcare system verification and coordination
 * @dev Only handles verification, validation, and cross-contract coordination
 */
contract zkMedCore is Ownable {
    
    // ======== Type Definitions ========
    
    enum UserType { PATIENT, HOSPITAL, INSURER }

    // ======== State Variables ========
    
    // User contract addresses
    address public patientContract;
    address public hospitalContract;
    address public insurerContract;
    address public adminContract;
    
    // Authorized user contracts
    mapping(address => bool) public authorizedContracts;
    
    // ======== Events ========
    
    event PatientRegistered(address indexed patient);
    event HospitalRegistered(address indexed hospital, string domain, bytes32 emailHash);
    event InsurerRegistered(address indexed insurer, string domain, bytes32 emailHash);
    event AdminAdded(address indexed admin, uint8 role);
    event UserDeactivated(address indexed user);
    
    event PaymentPlanCreated(address indexed patient, address indexed insurer, uint256 indexed planId);
    event PaymentMade(address indexed patient, address indexed insurer, uint256 amount);
    event LinkPayContractUpdated(address indexed linkPayAddress);

    // ======== Modifiers ========
    
    modifier onlyPatientContract() {
        require(msg.sender == patientContract, "Only patient contract");
        _;
    }
    
    modifier onlyHospitalContract() {
        require(msg.sender == hospitalContract, "Only hospital contract");
        _;
    }
    
    modifier onlyInsurerContract() {
        require(msg.sender == insurerContract, "Only insurer contract");
        _;
    }
    
    modifier onlyAdminContract() {
        require(msg.sender == adminContract, "Only admin contract");
        _;
    }
    
    modifier onlyAuthorizedContracts() {
        require(authorizedContracts[msg.sender], "Not authorized");
        _;
    }

    // ======== Constructor ========
    
    constructor() Ownable(msg.sender) {
        // No external contracts to deploy anymore
    }

    // ======== Contract Management ========
    
    /**
     * @dev Set user contract addresses (owner only)
     * @param _patientContract Address of the patient contract
     * @param _hospitalContract Address of the hospital contract
     * @param _insurerContract Address of the insurer contract
     * @param _adminContract Address of the admin contract
     */
    function setUserContracts(
        address _patientContract,
        address _hospitalContract,
        address _insurerContract,
        address _adminContract
    ) external onlyOwner {
        patientContract = _patientContract;
        hospitalContract = _hospitalContract;
        insurerContract = _insurerContract;
        adminContract = _adminContract;
        
        // Auto-authorize all user contracts
        if (_patientContract != address(0)) authorizedContracts[_patientContract] = true;
        if (_hospitalContract != address(0)) authorizedContracts[_hospitalContract] = true;
        if (_insurerContract != address(0)) authorizedContracts[_insurerContract] = true;
        if (_adminContract != address(0)) authorizedContracts[_adminContract] = true;
    }
    
    /**
     * @dev Authorize a contract to interact with core functions
     * @param contractAddress Address to authorize
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = true;
    }
    
    /**
     * @dev Revoke authorization for a contract
     * @param contractAddress Address to revoke authorization from
     */
    function revokeContractAuthorization(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
    }

    // ======== User Registration Notifications ========
    
    /**
     * @dev Notify of patient registration (called by patient contract)
     * @param patient Address of the registered patient
     */
    function notifyPatientRegistration(address patient) external onlyPatientContract {
        emit PatientRegistered(patient);
    }
    
    /**
     * @dev Notify of hospital registration (called by hospital contract)  
     * @param hospital Address of the registered hospital
     * @param domain Hospital domain
     * @param emailHash Hash of the hospital email
     */
    function notifyHospitalRegistration(
        address hospital,
        string calldata domain,
        bytes32 emailHash
    ) external onlyHospitalContract {
        emit HospitalRegistered(hospital, domain, emailHash);
    }
    
    /**
     * @dev Notify of insurer registration (called by insurer contract)
     * @param insurer Address of the registered insurer
     * @param domain Insurer domain
     * @param emailHash Hash of the insurer email
     */
    function notifyInsurerRegistration(
        address insurer,
        string calldata domain,
        bytes32 emailHash
    ) external onlyInsurerContract {
        emit InsurerRegistered(insurer, domain, emailHash);
    }

    // ======== Admin Management ========
    
    /**
     * @dev Add admin through authorization (called by admin contract)
     * @param admin Address to add as admin
     * @param role Admin role as uint8
     */
    function addAdmin(address admin, uint8 role) external onlyAdminContract {
        emit AdminAdded(admin, role);
    }

    // ======== Link Pay Integration ========
    
    /**
     * @dev Update link pay contract address in patient contract
     * @param linkPayAddress New LinkPay contract address
     */
    function updatePatientLinkPayContract(address linkPayAddress) external onlyAdminContract {
        require(linkPayAddress != address(0), "Invalid LinkPay address");
        require(patientContract != address(0), "Patient contract not set");
        
        (bool success,) = patientContract.call(
            abi.encodeWithSignature("updateLinkPayContract(address)", linkPayAddress)
        );
        require(success, "Failed to update LinkPay in patient contract");
        
        emit LinkPayContractUpdated(linkPayAddress);
    }

    // ======== Organization Activation (Admin Only) ========
    
    /**
     * @dev Activate a registered hospital (admin only)
     * @param hospitalAddress Address of the hospital to activate
     */
    function activateHospital(address hospitalAddress) external onlyAdminContract {
        require(hospitalContract != address(0), "Hospital contract not set");
        
        (bool success,) = hospitalContract.call(
            abi.encodeWithSignature("activateByAdmin(address)", hospitalAddress)
        );
        require(success, "Failed to activate hospital");
    }
    
    /**
     * @dev Activate a registered insurer (admin only)
     * @param insurerAddress Address of the insurer to activate
     */
    function activateInsurer(address insurerAddress) external onlyAdminContract {
        require(insurerContract != address(0), "Insurer contract not set");
        
        (bool success,) = insurerContract.call(
            abi.encodeWithSignature("activateByAdmin(address)", insurerAddress)
        );
        require(success, "Failed to activate insurer");
    }

    // ======== User Management Coordination ========
    
    /**
     * @dev Deactivate a user across all contracts
     * @param user Address of the user to deactivate
     */
    function deactivateUser(address user) external onlyAdminContract {
        // Try to deactivate from all possible contracts
        if (patientContract != address(0)) {
            (bool success,) = patientContract.call(
                abi.encodeWithSignature("deactivateByAdmin(address)", user)
            );
            // Don't require success as user might not be in this contract
        }
        
        if (hospitalContract != address(0)) {
            (bool success,) = hospitalContract.call(
                abi.encodeWithSignature("deactivateByAdmin(address)", user)
            );
        }
        
        if (insurerContract != address(0)) {
            (bool success,) = insurerContract.call(
                abi.encodeWithSignature("deactivateByAdmin(address)", user)
            );
        }
        
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
        // Aggregate from user contracts
        if (patientContract != address(0)) {
            (bool success, bytes memory result) = patientContract.staticcall(
                abi.encodeWithSignature("totalPatients()")
            );
            patients = success ? abi.decode(result, (uint256)) : 0;
        }
        
        if (hospitalContract != address(0)) {
            (bool success, bytes memory result) = hospitalContract.staticcall(
                abi.encodeWithSignature("totalHospitals()")
            );
            hospitals = success ? abi.decode(result, (uint256)) : 0;
        }
        
        if (insurerContract != address(0)) {
            (bool success, bytes memory result) = insurerContract.staticcall(
                abi.encodeWithSignature("totalInsurers()")
            );
            insurers = success ? abi.decode(result, (uint256)) : 0;
        }
        
        totalUsers = patients + hospitals + insurers;
    }

    // ======== Domain and Email Validation ========
    
    /**
     * @dev Validate hospital domain through hospital contract
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function validateHospitalDomain(string calldata domain) external view returns (bool) {
        if (hospitalContract == address(0)) return false;
        
        (bool success, bytes memory result) = hospitalContract.staticcall(
            abi.encodeWithSignature("validateHospitalDomain(string)", domain)
        );
        return success && abi.decode(result, (bool));
    }

    /**
     * @dev Validate insurer domain through insurer contract
     * @param domain Domain to validate
     * @return bool True if valid insurer domain
     */
    function validateInsurerDomain(string calldata domain) external view returns (bool) {
        if (insurerContract == address(0)) return false;
        
        (bool success, bytes memory result) = insurerContract.staticcall(
            abi.encodeWithSignature("validateInsurerDomain(string)", domain)
        );
        return success && abi.decode(result, (bool));
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
        if (patientContract != address(0)) {
            (bool success, bytes memory result) = patientContract.staticcall(
                abi.encodeWithSignature("isPatientRegistered(address)", user)
            );
            if (success && abi.decode(result, (bool))) {
                return ("PATIENT", true);
            }
        }
        
        // Check if user is a hospital
        if (hospitalContract != address(0)) {
            (bool success, bytes memory result) = hospitalContract.staticcall(
                abi.encodeWithSignature("isHospitalRegistered(address)", user)
            );
            if (success && abi.decode(result, (bool))) {
                (bool success2, bytes memory result2) = hospitalContract.staticcall(
                    abi.encodeWithSignature("isHospitalApproved(address)", user)
                );
                bool approved = success2 && abi.decode(result2, (bool));
                return ("HOSPITAL", approved);
            }
        }
        
        // Check if user is an insurer
        if (insurerContract != address(0)) {
            (bool success, bytes memory result) = insurerContract.staticcall(
                abi.encodeWithSignature("isInsurerRegistered(address)", user)
            );
            if (success && abi.decode(result, (bool))) {
                (bool success2, bytes memory result2) = insurerContract.staticcall(
                    abi.encodeWithSignature("isInsurerApproved(address)", user)
                );
                bool approved = success2 && abi.decode(result2, (bool));
                return ("INSURER", approved);
            }
        }
        
        // Check if user is an admin
        if (adminContract != address(0)) {
            (bool success, bytes memory result) = adminContract.staticcall(
                abi.encodeWithSignature("isAdmin(address)", user)
            );
            if (success && abi.decode(result, (bool))) {
                return ("ADMIN", true);
            }
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

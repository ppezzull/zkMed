// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {HealthcareRegistrationProver} from "./HealthcareRegistrationProver.sol";

/**
 * @title zkMed Healthcare Registration Contract
 * @notice Manages healthcare stakeholder registration using MailProof domain verification
 * @dev Integrates with vlayer EmailDomainProver for cryptographic email verification
 */
contract HealthcareRegistration is Verifier, Ownable {
    
    // ======== Type Definitions ========
    
    enum UserType { PATIENT, HOSPITAL, INSURER }
    enum AdminRole { BASIC, MODERATOR, SUPER_ADMIN }
    
    struct UserRecord {
        UserType userType;
        address walletAddress;
        string domain;           // Empty for patients
        string organizationName; // Empty for patients  
        bytes32 emailHash;       // Cryptographic proof of email ownership
        uint256 registrationTime;
        bool isActive;
    }
    struct Admin {
        bool isActive;
        AdminRole role;
        uint256 permissions;
    }
    
    // ======== State Variables ========
    
    address public emailDomainProver; // Address of EmailDomainProver contract
    
    // User mappings
    mapping(address => UserRecord) public registeredUsers;
    mapping(address => bool) public isPatient;
    mapping(address => bool) public isHospital; 
    mapping(address => bool) public isInsurer;
    
    // Domain and email tracking
    mapping(string => address) public domainToUser;
    mapping(bytes32 => bool) public usedEmailHashes;
    
    // Admin system
    mapping(address => Admin) public admins;
    
    // Statistics
    uint256 public totalRegisteredUsers;
    uint256 public totalPatients;
    uint256 public totalHospitals;
    uint256 public totalInsurers;
    
    // ======== Events ========
    
    event PatientRegistered(address indexed patient);
    event HospitalRegistered(address indexed hospital, string domain, bytes32 emailHash);
    event InsurerRegistered(address indexed insurer, string domain, bytes32 emailHash);
    event AdminAdded(address indexed admin, AdminRole role);
    event UserDeactivated(address indexed user);
    
    // ======== Constructor ========
    
    constructor(address _emailDomainProver) Ownable(msg.sender) {
        emailDomainProver = _emailDomainProver;
        
        // Set deployer as super admin
        admins[msg.sender] = Admin(true, AdminRole.SUPER_ADMIN, type(uint256).max);
    }
    
    // ======== Modifiers ========
    
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
    
    modifier notRegistered() {
        require(!registeredUsers[msg.sender].isActive, "User already registered");
        _;
    }
    
    // ======== Patient Registration ========
    
    /**
     * @dev Register a patient with simple wallet connection (thirdweb integration)
     * @param patientWallet Address of the patient to register
     * @param patientEmailHash Hash of the patient's email address
     */
    function registerPatient(address patientWallet, bytes32 patientEmailHash) external notRegistered {
        require(patientWallet != address(0), "Invalid patient address");
        require(!registeredUsers[patientWallet].isActive, "Patient already registered");
        require(!usedEmailHashes[patientEmailHash], "Email already used");
        
        registeredUsers[patientWallet] = UserRecord({
            userType: UserType.PATIENT,
            walletAddress: patientWallet,
            domain: "",
            organizationName: "",
            emailHash: patientEmailHash,
            registrationTime: block.timestamp,
            isActive: true
        });
        
        isPatient[patientWallet] = true;
        usedEmailHashes[patientEmailHash] = true;
        totalRegisteredUsers++;
        totalPatients++;
        
        emit PatientRegistered(patientWallet);
    }
    
    // ======== Hospital Registration with MailProof ========
    
    /**
     * @dev Register a hospital using MailProof domain verification
     * @param registrationData Data structure containing registration information
     */
    function registerHospitalWithMailProof(
        HealthcareRegistrationProver.RegistrationData calldata registrationData,
        Proof calldata 
    ) 
        external 
        notRegistered
        onlyVerified(emailDomainProver, HealthcareRegistrationProver.main.selector)
    {
        // Verify this is a hospital registration
        require(registrationData.requestedRole == HealthcareRegistrationProver.UserType.HOSPITAL, 
                "Not a hospital registration");
        
        // Validate the registration data
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        require(domainToUser[registrationData.domain] == address(0), "Domain already registered");
        require(_isValidHospitalDomain(registrationData.domain), "Invalid hospital domain");
        
        // Create hospital record
        registeredUsers[msg.sender] = UserRecord({
            userType: UserType.HOSPITAL,
            walletAddress: msg.sender,
            domain: registrationData.domain,
            organizationName: registrationData.organizationName,
            emailHash: registrationData.emailHash,
            registrationTime: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        isHospital[msg.sender] = true;
        domainToUser[registrationData.domain] = msg.sender;
        usedEmailHashes[registrationData.emailHash] = true;
        totalRegisteredUsers++;
        totalHospitals++;
        
        emit HospitalRegistered(msg.sender, registrationData.domain, registrationData.emailHash);
    }
    
    // ======== Insurer Registration with MailProof ========
    
    /**
     * @dev Register an insurance company using MailProof domain verification
     * @param registrationData Data structure containing registration information
     */
    function registerInsurerWithMailProof(
        HealthcareRegistrationProver.RegistrationData calldata registrationData,
        Proof calldata
    ) 
        external 
        notRegistered
        onlyVerified(emailDomainProver, HealthcareRegistrationProver.main.selector)
    {
        // Verify this is an insurer registration
        require(registrationData.requestedRole == HealthcareRegistrationProver.UserType.INSURER, 
                "Not an insurer registration");
        
        // Validate the registration data
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        require(domainToUser[registrationData.domain] == address(0), "Domain already registered");
        require(_isValidInsurerDomain(registrationData.domain), "Invalid insurer domain");
        
        // Create insurer record
        registeredUsers[msg.sender] = UserRecord({
            userType: UserType.INSURER,
            walletAddress: msg.sender,
            domain: registrationData.domain,
            organizationName: registrationData.organizationName, 
            emailHash: registrationData.emailHash,
            registrationTime: block.timestamp,
            isActive: true
        });
        
        // Update mappings
        isInsurer[msg.sender] = true;
        domainToUser[registrationData.domain] = msg.sender;
        usedEmailHashes[registrationData.emailHash] = true;
        totalRegisteredUsers++;
        totalInsurers++;
        
        emit InsurerRegistered(msg.sender, registrationData.domain, registrationData.emailHash);
    }
    
    // ======== Admin Management ========
    
    /**
     * @dev Add a new admin with specified role
     * @param newAdmin Address of the new admin
     * @param role Admin role to assign
     */
    function addAdmin(address newAdmin, AdminRole role) external onlySuperAdmin {
        require(!admins[newAdmin].isActive, "Already an admin");
        require(newAdmin != address(0), "Invalid admin address");
        
        // Set permissions based on role
        uint256 permissions = 0;
        if (role == AdminRole.BASIC) {
            permissions = 1; // Basic permissions
        } else if (role == AdminRole.MODERATOR) {
            permissions = 255; // Moderate permissions
        } else if (role == AdminRole.SUPER_ADMIN) {
            permissions = type(uint256).max; // Full permissions
        }
        
        admins[newAdmin] = Admin(true, role, permissions);
        emit AdminAdded(newAdmin, role);
    }
    
    /**
     * @dev Update admin permissions
     * @param admin Address of the admin
     * @param permissions New permission bitmask
     */
    function updateAdminPermissions(address admin, uint256 permissions) external onlySuperAdmin {
        require(admins[admin].isActive, "Not an admin");
        admins[admin].permissions = permissions;
    }

    /**
     * @dev Deactivate a user (admin only)
     * @param user Address of the user to deactivate
     */
    function deactivateUser(address user) external onlyAdmin {
        require(registeredUsers[user].isActive, "User not registered");
        
        // Deactivate the user
        registeredUsers[user].isActive = false;
        
        // Update user type mappings
        if (isPatient[user]) {
            isPatient[user] = false;
            totalPatients--;
        } else if (isHospital[user]) {
            isHospital[user] = false;
            totalHospitals--;
        } else if (isInsurer[user]) {
            isInsurer[user] = false;
            totalInsurers--;
        }
        
        totalRegisteredUsers--;
        
        emit UserDeactivated(user);
    }
    
    // ======== Domain Validation ========
    
    /**
     * @dev Validate if a hospital domain is registered and active
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function validateHospitalDomain(string calldata domain) external view returns (bool) {
        address hospitalAddress = domainToUser[domain];
        return hospitalAddress != address(0) && 
               isHospital[hospitalAddress] && 
               registeredUsers[hospitalAddress].isActive;
    }
    
    /**
     * @dev Validate if an insurer domain is registered and active
     * @param domain Domain to validate
     * @return bool True if valid insurer domain
     */
    function validateInsurerDomain(string calldata domain) external view returns (bool) {
        address insurerAddress = domainToUser[domain];
        return insurerAddress != address(0) && 
               isInsurer[insurerAddress] && 
               registeredUsers[insurerAddress].isActive;
    }
    
    // ======== Internal Functions ========
    
    /**
     * @dev Check if domain is valid for hospital registration
     * @param domain Domain to check
     * @return bool True if valid hospital domain
     */
    function _isValidHospitalDomain(string memory domain) internal pure returns (bool) {
        // Basic domain validation - can be enhanced with specific hospital TLDs
        bytes memory domainBytes = bytes(domain);
        return domainBytes.length > 3 && domainBytes.length < 253;
    }
    
    /**
     * @dev Check if domain is valid for insurer registration
     * @param domain Domain to check  
     * @return bool True if valid insurer domain
     */
    function _isValidInsurerDomain(string memory domain) internal pure returns (bool) {
        // Basic domain validation - can be enhanced with specific insurance TLDs
        bytes memory domainBytes = bytes(domain);
        return domainBytes.length > 3 && domainBytes.length < 253;
    }
    
    // ======== View Functions ========
    
    /**
     * @dev Get user record for an address
     * @param user User address
     * @return UserRecord struct
     */
    function getUserRecord(address user) external view returns (UserRecord memory) {
        return registeredUsers[user];
    }
    
    /**
     * @dev Check if user is registered and active
     * @param user User address
     * @return bool True if user is registered
     */
    function isUserRegistered(address user) external view returns (bool) {
        return registeredUsers[user].isActive;
    }
    
    /**
     * @dev Get user type
     * @param user User address
     * @return UserType enum value
     */
    function getUserType(address user) external view returns (UserType) {
        require(registeredUsers[user].isActive, "User not registered");
        return registeredUsers[user].userType;
    }
    
    /**
     * @dev Check if domain is already taken
     * @param domain Domain to check
     * @return bool True if domain is taken
     */
    function isDomainTaken(string calldata domain) external view returns (bool) {
        return domainToUser[domain] != address(0);
    }
    
    /**
     * @dev Get domain owner address
     * @param domain Domain to query
     * @return address Owner of the domain
     */
    function getDomainOwner(string calldata domain) external view returns (address) {
        return domainToUser[domain];
    }
    
    /**
     * @dev Get registration statistics
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
        return (totalRegisteredUsers, totalPatients, totalHospitals, totalInsurers);
    }
}

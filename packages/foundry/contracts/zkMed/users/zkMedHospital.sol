// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {zkMedCore} from "../zkMedCore.sol";
import {zkMedRegistrationProver} from "../provers/zkMedRegistrationProver.sol";

/**
 * @title zkMed Hospital Contract
 * @notice Handles hospital-specific functions including domain-verified registration
 * @dev Self-contained contract that manages hospital data and coordinates with zkMedCore
 */
contract zkMedHospital is Verifier {
    
    // ======== Type Definitions ========
    
    struct BaseRecord {
        address userAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
    }

    struct OrganizationRecord {
        BaseRecord base;
        string domain;
        string organizationName;
        bool isApproved;
    }
    
    // ======== State Variables ========
    
    zkMedCore public zkMedCoreContract;
    address public registrationProver;
    
    // Hospital data storage
    mapping(address => OrganizationRecord) public hospitalRecords;
    mapping(bytes32 => bool) public usedEmailHashes;
    mapping(string => address) public domainToHospital;
    uint256 public totalHospitals;
    
    // ======== Events ========
    
    event HospitalRegisteredLocal(address indexed hospital, string domain, uint256 requestId);
    event PaymentReceived(address indexed hospital, address indexed insurer, uint256 amount);
    
    // ======== Modifiers ========
    
    modifier notRegistered() {
        require(!isHospitalRegistered(msg.sender), "Hospital already registered");
        _;
    }
    
    modifier onlyRegisteredHospital() {
        require(isHospitalRegistered(msg.sender), "Hospital not registered");
        _;
    }
    
    modifier onlyZkMedCore() {
        require(msg.sender == address(zkMedCoreContract), "Only zkMedCore");
        _;
    }
    
    // ======== Constructor ========
    
    constructor(address _zkMedCore, address _registrationProver) {
        zkMedCoreContract = zkMedCore(_zkMedCore);
        registrationProver = _registrationProver;
    }
    
    // ======== Registration Functions ========

    /**
     * @dev Register as a hospital using domain verification
     * @param registrationData Data from the registration prover
     */
    function registerHospital(
        Proof calldata,
        zkMedRegistrationProver.RegistrationData calldata registrationData
    ) 
        external 
        notRegistered
        onlyVerified(
            registrationProver, 
            zkMedRegistrationProver.proveOrganizationDomain.selector
        )
    {
        require(bytes(registrationData.organizationName).length > 0, "Organization name required");
        require(bytes(registrationData.domain).length > 0, "Domain required");
        require(registrationData.emailHash != bytes32(0), "Email hash required");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        require(domainToHospital[registrationData.domain] == address(0), "Domain already registered");
        require(_isValidHospitalDomain(registrationData.domain), "Invalid hospital domain");
        
        // Store hospital data locally - inactive by default, requires admin activation
        hospitalRecords[msg.sender] = OrganizationRecord({
            base: BaseRecord({
                userAddress: msg.sender,
                emailHash: registrationData.emailHash,
                registrationTime: block.timestamp,
                isActive: false  // Changed: hospitals start inactive and need admin approval
            }),
            domain: registrationData.domain,
            organizationName: registrationData.organizationName,
            isApproved: false
        });
        
        usedEmailHashes[registrationData.emailHash] = true;
        domainToHospital[registrationData.domain] = msg.sender;
        totalHospitals++;
        
        // Notify zkMedCore of registration
        zkMedCoreContract.notifyHospitalRegistration(
            msg.sender,
            registrationData.domain,
            registrationData.emailHash
        );
        
        emit HospitalRegisteredLocal(msg.sender, registrationData.domain, 0);
    }

    // ======== Payment Functions ========

    /**
     * @dev Receive payment from insurer for services
     * @param insurer Address of the paying insurer
     * @param amount Amount being paid
     */
    function receivePayment(address insurer, uint256 amount) external payable onlyRegisteredHospital {
        require(amount > 0, "Payment amount must be greater than 0");
        require(msg.value >= amount, "Insufficient payment sent");
        
        emit PaymentReceived(msg.sender, insurer, amount);
    }
    
    // ======== Admin Functions ========
    
    /**
     * @dev Activate a hospital (called by zkMedCore via admin)
     * @param hospitalAddress Address of the hospital to activate
     */
    function activateByAdmin(address hospitalAddress) external onlyZkMedCore {
        require(hospitalRecords[hospitalAddress].base.userAddress != address(0), "Hospital not registered");
        require(!hospitalRecords[hospitalAddress].base.isActive, "Hospital already active");
        
        hospitalRecords[hospitalAddress].base.isActive = true;
        hospitalRecords[hospitalAddress].isApproved = true;
    }
    
    /**
     * @dev Deactivate a hospital (called by zkMedCore via admin)
     * @param hospitalAddress Address of the hospital to deactivate
     */
    function deactivateByAdmin(address hospitalAddress) external onlyZkMedCore {
        require(hospitalRecords[hospitalAddress].base.userAddress != address(0), "Hospital not registered");
        require(hospitalRecords[hospitalAddress].base.isActive, "Hospital already inactive");
        
        hospitalRecords[hospitalAddress].base.isActive = false;
        hospitalRecords[hospitalAddress].isApproved = false;
    }
    
    // ======== View Functions ========

    /**
     * @dev Check if a hospital is registered
     * @param hospital Address to check
     * @return bool True if hospital is registered
     */
    function isHospitalRegistered(address hospital) public view returns (bool) {
        return hospitalRecords[hospital].base.userAddress != address(0) && 
               hospitalRecords[hospital].base.isActive;
    }

    /**
     * @dev Check if a hospital is approved
     * @param hospital Address to check
     * @return bool True if hospital is approved
     */
    function isHospitalApproved(address hospital) external view returns (bool) {
        return isHospitalRegistered(hospital) && hospitalRecords[hospital].isApproved;
    }

    /**
     * @dev Get hospital record
     * @param hospital Address of the hospital
     * @return record Hospital's organization record
     */
    function getHospitalRecord(address hospital) external view returns (OrganizationRecord memory record) {
        require(isHospitalRegistered(hospital), "Hospital not registered");
        return hospitalRecords[hospital];
    }

    /**
     * @dev Get total number of registered hospitals
     * @return uint256 Total hospitals
     */
    function getTotalHospitals() external view returns (uint256) {
        return totalHospitals;
    }

    /**
     * @dev Check if email hash is already used
     * @param emailHash Email hash to check
     * @return bool True if email hash is used
     */
    function isEmailHashUsed(bytes32 emailHash) external view returns (bool) {
        return usedEmailHashes[emailHash];
    }

    /**
     * @dev Validate hospital domain format
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function validateHospitalDomain(string calldata domain) external pure returns (bool) {
        return _isValidHospitalDomain(domain);
    }

    /**
     * @dev Get hospital address by domain
     * @param domain Domain to look up
     * @return address Hospital address for the domain
     */
    function getHospitalByDomain(string calldata domain) external view returns (address) {
        return domainToHospital[domain];
    }

    /**
     * @dev Get all approved hospitals (limit to first 100 for gas efficiency)
     * @return hospitals Array of approved hospital addresses
     * @return domains Array of corresponding domains
     * @return count Total number of approved hospitals
     */
    function getApprovedHospitals() external view returns (
        address[] memory hospitals,
        string[] memory domains,
        uint256 count
    ) {
        // Count approved hospitals first
        uint256 approvedCount = 0;
        // Note: In production, you'd want to maintain a separate mapping for approved hospitals
        // For now, this is a simplified implementation
        
        hospitals = new address[](0);
        domains = new string[](0);
        count = approvedCount;
    }

    // ======== Admin Functions ========

    /**
     * @dev Approve a hospital (called by zkMedCore)
     * @param hospital Address of hospital to approve
     */
    function approveHospital(address hospital) external onlyZkMedCore {
        require(isHospitalRegistered(hospital), "Hospital not registered");
        hospitalRecords[hospital].isApproved = true;
    }

    /**
     * @dev Deactivate a hospital (called by zkMedCore)
     * @param hospital Address of hospital to deactivate
     */
    function deactivateHospital(address hospital) external onlyZkMedCore {
        require(isHospitalRegistered(hospital), "Hospital not registered");
        hospitalRecords[hospital].base.isActive = false;
    }

    // ======== Internal Functions ========

    /**
     * @dev Validate hospital domain format
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function _isValidHospitalDomain(string memory domain) internal pure returns (bool) {
        bytes memory domainBytes = bytes(domain);
        if (domainBytes.length < 4) return false;
        
        // Check for common hospital domain patterns
        if (_contains(domain, ".hospital.") || 
            _contains(domain, ".health.") ||
            _contains(domain, ".med.") ||
            _contains(domain, "hospital.") ||
            _contains(domain, "health.") ||
            _contains(domain, "medical.")) {
            return true;
        }
        
        return false;
    }

    /**
     * @dev Check if string contains substring
     * @param str String to search in
     * @param substr Substring to search for
     * @return bool True if substring found
     */
    function _contains(string memory str, string memory substr) internal pure returns (bool) {
        bytes memory strBytes = bytes(str);
        bytes memory substrBytes = bytes(substr);
        
        if (substrBytes.length > strBytes.length) return false;
        
        for (uint i = 0; i <= strBytes.length - substrBytes.length; i++) {
            bool found = true;
            for (uint j = 0; j < substrBytes.length; j++) {
                if (strBytes[i + j] != substrBytes[j]) {
                    found = false;
                    break;
                }
            }
            if (found) return true;
        }
        return false;
    }
} 
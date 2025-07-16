// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {zkMedDomainProver} from "../provers/zkMedDomainProver.sol";
import {IzkMedCore} from "../interfaces/IzkMedCore.sol";

/**
 * @title zkMedHospital
 * @notice Handles hospital registration and hospital-specific functionality
 * @dev Verifier contract for hospital domain verification
 */
contract zkMedHospital is Verifier {
    
    // ======== State Variables ========
    
    IzkMedCore public zkMedCore;
    address public emailDomainProver;
    
    // ======== Events ========
    
    event HospitalRegistered(address indexed hospital, string domain, bytes32 emailHash);
    
    // ======== Constructor ========
    
    constructor(address _zkMedCore, address _emailDomainProver) {
        zkMedCore = IzkMedCore(_zkMedCore);
        emailDomainProver = _emailDomainProver;
    }
    
    // ======== Modifiers ========
    
    modifier notRegistered() {
        require(!zkMedCore.isUserRegistered(msg.sender), "User already registered");
        _;
    }
    
    // ======== Hospital Registration ========
    
    /**
     * @dev Register a hospital using MailProof domain verification
     * @param registrationData Data structure containing registration information
     */
    function registerHospital(
        Proof calldata, 
        zkMedDomainProver.RegistrationData calldata registrationData
    ) 
        external 
        notRegistered
        onlyVerified(
            emailDomainProver, 
            zkMedDomainProver.proveOrganizationDomain.selector
        )
    {
        // Verify this is a hospital registration
        require(registrationData.requestedRole == zkMedDomainProver.UserType.HOSPITAL, 
                "Not a hospital registration");
        
        // Validate the registration data
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(!zkMedCore.isDomainTaken(registrationData.domain), "Domain already registered");
        require(_isValidHospitalDomain(registrationData.domain), "Invalid hospital domain");
        
        // Generate a unique request ID
        uint256 requestId = uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            msg.sender, 
            registrationData.emailHash,
            registrationData.domain
        )));
        
        // Register hospital through the core contract
        zkMedCore.registerHospitalFromContract(
            msg.sender,
            registrationData.emailHash,
            registrationData.domain,
            registrationData.organizationName,
            requestId
        );
        
        emit HospitalRegistered(msg.sender, registrationData.domain, registrationData.emailHash);
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
    
    // ======== View Functions ========
    
    /**
     * @dev Get hospital record for an address
     * @param hospital Hospital address
     * @return OrganizationRecord struct
     */
    function getHospitalRecord(address hospital) external view returns (IzkMedCore.OrganizationRecord memory) {
        require(zkMedCore.isUserRegistered(hospital), "Hospital not registered");
        require(zkMedCore.getUserType(hospital) == IzkMedCore.UserType.HOSPITAL, "Not a hospital");
        return zkMedCore.getOrganizationRecord(hospital);
    }
    
    /**
     * @dev Check if hospital is registered and approved
     * @param hospital Hospital address
     * @return bool True if hospital is approved
     */
    function isHospitalApproved(address hospital) external view returns (bool) {
        if (!zkMedCore.isUserRegistered(hospital)) {
            return false;
        }
        if (zkMedCore.getUserType(hospital) != IzkMedCore.UserType.HOSPITAL) {
            return false;
        }
        return zkMedCore.isOrganizationApproved(hospital);
    }
    
    /**
     * @dev Validate if a hospital domain is registered and active
     * @param domain Domain to validate
     * @return bool True if valid hospital domain
     */
    function validateHospitalDomain(string calldata domain) external view returns (bool) {
        return zkMedCore.validateHospitalDomain(domain);
    }
    
    /**
     * @dev Check if user is registered as a hospital
     * @param user User address
     * @return bool True if user is registered as a hospital
     */
    function isHospitalRegistered(address user) external view returns (bool) {
        if (!zkMedCore.isUserRegistered(user)) {
            return false;
        }
        return zkMedCore.getUserType(user) == IzkMedCore.UserType.HOSPITAL;
    }
    
    /**
     * @dev Get domain owner address
     * @param domain Domain to query
     * @return address Owner of the domain
     */
    function getDomainOwner(string calldata domain) external view returns (address) {
        return zkMedCore.getDomainOwner(domain);
    }
    
    /**
     * @dev Check if domain is already taken
     * @param domain Domain to check
     * @return bool True if domain is taken
     */
    function isDomainTaken(string calldata domain) external view returns (bool) {
        return zkMedCore.isDomainTaken(domain);
    }
} 
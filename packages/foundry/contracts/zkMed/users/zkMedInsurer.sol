// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {zkMedDomainProver} from "../provers/zkMedDomainProver.sol";
import {zkMedInvitationProver} from "../provers/zkMedInvitationProver.sol";
import {IzkMedCore} from "../interfaces/IzkMedCore.sol";

/**
 * @title zkMedInsurer
 * @notice Handles insurer registration, invitation sending, and insurer-specific functionality
 * @dev Verifier contract for insurer domain verification and invitations
 */
contract zkMedInsurer is Verifier {
    
    // ======== State Variables ========
    
    IzkMedCore public zkMedCore;
    address public emailDomainProver;
    address public invitationProver;
    
    // ======== Events ========
    
    event InsurerRegistered(address indexed insurer, string domain, bytes32 emailHash);
    event InvitationSent(address indexed insurer, address indexed recipient, uint256 indexed requestId);
    
    // ======== Constructor ========
    
    constructor(address _zkMedCore, address _emailDomainProver, address _invitationProver) {
        zkMedCore = IzkMedCore(_zkMedCore);
        emailDomainProver = _emailDomainProver;
        invitationProver = _invitationProver;
    }
    
    // ======== Modifiers ========
    
    modifier notRegistered() {
        require(!zkMedCore.isUserRegistered(msg.sender), "User already registered");
        _;
    }
    
    modifier onlyApprovedInsurer() {
        require(zkMedCore.isUserRegistered(msg.sender), "Not registered");
        require(zkMedCore.getUserType(msg.sender) == IzkMedCore.UserType.INSURER, "Not an insurer");
        require(zkMedCore.isOrganizationApproved(msg.sender), "Insurer not approved");
        _;
    }
    
    // ======== Insurer Registration ========
    
    /**
     * @dev Register an insurance company using MailProof domain verification
     * @param registrationData Data structure containing registration information
     */
    function registerInsurer(
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
        // Verify this is an insurer registration
        require(registrationData.requestedRole == zkMedDomainProver.UserType.INSURER, 
                "Not an insurer registration");
        
        // Validate the registration data
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(!zkMedCore.isDomainTaken(registrationData.domain), "Domain already registered");
        require(_isValidInsurerDomain(registrationData.domain), "Invalid insurer domain");
        
        // Generate a unique request ID
        uint256 requestId = uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            msg.sender, 
            registrationData.emailHash,
            registrationData.domain
        )));
        
        // Register insurer through the core contract
        zkMedCore.registerInsurerFromContract(
            msg.sender,
            registrationData.emailHash,
            registrationData.domain,
            registrationData.organizationName,
            requestId
        );
        
        emit InsurerRegistered(msg.sender, registrationData.domain, registrationData.emailHash);
    }
    
    // ======== Invitation Processing ========
    
    /**
     * @dev Send an invitation from an insurance company to a patient or hospital
     * @param invitationData Data structure containing invitation information
     */
    function sendInvitation(
        Proof calldata,
        zkMedInvitationProver.InvitationData calldata invitationData
    ) 
        external 
        onlyApprovedInsurer
        onlyVerified(
            invitationProver, 
            zkMedInvitationProver.proveInvitation.selector
        )
    {
        // Validate sender matches the caller
        require(invitationData.senderAddress == msg.sender, "Sender address mismatch");
        
        // Generate a unique request ID
        uint256 requestId = uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            msg.sender, 
            invitationData.recipientAddress,
            invitationData.senderEmailHash,
            invitationData.recipientEmailHash
        )));
        
        // Process invitation through the core contract
        zkMedCore.processInvitationFromContract(invitationData, requestId);
        
        emit InvitationSent(msg.sender, invitationData.recipientAddress, requestId);
    }
    
    // ======== Internal Functions ========
    
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
     * @dev Get insurer record for an address
     * @param insurer Insurer address
     * @return OrganizationRecord struct
     */
    function getInsurerRecord(address insurer) external view returns (IzkMedCore.OrganizationRecord memory) {
        require(zkMedCore.isUserRegistered(insurer), "Insurer not registered");
        require(zkMedCore.getUserType(insurer) == IzkMedCore.UserType.INSURER, "Not an insurer");
        return zkMedCore.getOrganizationRecord(insurer);
    }
    
    /**
     * @dev Check if insurer is registered and approved
     * @param insurer Insurer address
     * @return bool True if insurer is approved
     */
    function isInsurerApproved(address insurer) external view returns (bool) {
        if (!zkMedCore.isUserRegistered(insurer)) {
            return false;
        }
        if (zkMedCore.getUserType(insurer) != IzkMedCore.UserType.INSURER) {
            return false;
        }
        return zkMedCore.isOrganizationApproved(insurer);
    }
    
    /**
     * @dev Validate if an insurer domain is registered and active
     * @param domain Domain to validate
     * @return bool True if valid insurer domain
     */
    function validateInsurerDomain(string calldata domain) external view returns (bool) {
        return zkMedCore.validateInsurerDomain(domain);
    }
    
    /**
     * @dev Check if user is registered as an insurer
     * @param user User address
     * @return bool True if user is registered as an insurer
     */
    function isInsurerRegistered(address user) external view returns (bool) {
        if (!zkMedCore.isUserRegistered(user)) {
            return false;
        }
        return zkMedCore.getUserType(user) == IzkMedCore.UserType.INSURER;
    }
    
    /**
     * @dev Check if an insurer has invited a patient
     * @param insurer Insurer address
     * @param patient Patient address
     * @return bool True if invitation exists
     */
    function hasInvitedPatient(address insurer, address patient) external view returns (bool) {
        return zkMedCore.hasInsurerInvitedPatient(insurer, patient);
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
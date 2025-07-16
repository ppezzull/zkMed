// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {zkMedDomainProver} from "../provers/zkMedDomainProver.sol";
import {IzkMedCore} from "../interfaces/IzkMedCore.sol";

/**
 * @title zkMedPatient
 * @notice Handles patient registration and patient-specific functionality
 * @dev Verifier contract for patient email verification
 */
contract zkMedPatient is Verifier {
    
    // ======== State Variables ========
    
    IzkMedCore public zkMedCore;
    address public emailDomainProver;
    
    // ======== Events ========
    
    event PatientRegistered(address indexed patient, bytes32 emailHash);
    
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
    
    // ======== Patient Registration ========
    
    /**
     * @dev Register a patient with email verification proof
     * @param registrationData Data structure containing registration information
     */
    function registerPatient(
        Proof calldata,
        zkMedDomainProver.RegistrationData calldata registrationData
    ) 
        external 
        notRegistered
        onlyVerified(
            emailDomainProver, 
            zkMedDomainProver.provePatientEmail.selector
        )
    {
        // Validate registration data
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(registrationData.walletAddress != address(0), "Invalid patient address");
        require(registrationData.requestedRole == zkMedDomainProver.UserType.PATIENT, 
                "Not a patient registration");
        
        // Generate a unique request ID (simple counter approach)
        uint256 requestId = uint256(keccak256(abi.encodePacked(
            block.timestamp, 
            msg.sender, 
            registrationData.emailHash
        )));
        
        // Register patient through the core contract
        zkMedCore.registerPatientFromContract(
            msg.sender,
            registrationData.emailHash,
            requestId
        );
        
        emit PatientRegistered(msg.sender, registrationData.emailHash);
    }
    
    // ======== View Functions ========
    
    /**
     * @dev Get patient record for an address
     * @param patient Patient address
     * @return PatientRecord struct
     */
    function getPatientRecord(address patient) external view returns (IzkMedCore.PatientRecord memory) {
        return zkMedCore.getPatientRecord(patient);
    }
    
    /**
     * @dev Get all payment plans for a patient
     * @param patient Patient address
     * @return PaymentPlan[] Array of payment plans
     */
    function getPatientPaymentPlans(address patient) external view returns (IzkMedCore.PaymentPlan[] memory) {
        return zkMedCore.getPatientPaymentPlans(patient);
    }
    
    /**
     * @dev Get active payment plans for a patient
     * @param patient Patient address
     * @return PaymentPlan[] Array of active payment plans
     */
    function getActivePaymentPlans(address patient) external view returns (IzkMedCore.PaymentPlan[] memory) {
        return zkMedCore.getActivePaymentPlans(patient);
    }
    
    /**
     * @dev Check if user is registered and active
     * @param user User address
     * @return bool True if user is registered and active
     */
    function isPatientRegistered(address user) external view returns (bool) {
        if (!zkMedCore.isUserRegistered(user)) {
            return false;
        }
        return zkMedCore.getUserType(user) == IzkMedCore.UserType.PATIENT;
    }
} 
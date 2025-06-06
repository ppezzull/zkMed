// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {HealthSystemWebProofProver} from "./HealthSystemWebProofProver.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

interface IRegistrationContract {
    function registerPatientWithWebProof(
        address patient,
        bytes32 commitment,
        string memory patientId,
        bytes32 taxCodeHash,
        string memory regionalCode,
        string memory homeAsl
    ) external;
}

/// @title HealthSystemWebProofVerifier
/// @notice Verifier contract for Italian health system WebProofs
/// @dev Verifies WebProofs from Italian health portal and registers patients
contract HealthSystemWebProofVerifier is Verifier {
    
    // Reference to the prover contract
    address public prover;
    
    // Reference to the registration contract
    IRegistrationContract public registrationContract;
    
    // Mapping to track verified Italian patients
    mapping(address => bool) public verifiedItalianPatients;
    mapping(bytes32 => bool) public usedTaxCodeHashes;
    mapping(string => address) public patientIdToAddress;
    
    // Events
    event ItalianPatientVerified(
        address indexed patient,
        string patientId,
        bytes32 taxCodeHash,
        string regionalCode,
        string homeAsl,
        uint256 timestamp
    );
    
    event PatientRegisteredWithWebProof(
        address indexed patient,
        string patientId,
        string homeAsl
    );
    
    // Errors
    error AlreadyVerified();
    error TaxCodeAlreadyUsed();
    error InvalidProof();
    error RegistrationFailed();
    
    constructor(address _prover, address _registrationContract) {
        prover = _prover;
        registrationContract = IRegistrationContract(_registrationContract);
    }
    
    /// @notice Verify Italian health system WebProof and register patient
    /// @param proof The vlayer proof from the prover
    /// @param verifiedData The verified patient data from the prover
    /// @param patientAddress The patient's Ethereum address
    function verifyAndRegisterItalianPatient(
        Proof calldata proof,
        HealthSystemWebProofProver.VerifiedPatientData memory verifiedData,
        address patientAddress
    ) public onlyVerified(prover, HealthSystemWebProofProver.proveItalianPatient.selector) {
        
        // Check if patient is already verified
        if (verifiedItalianPatients[patientAddress]) {
            revert AlreadyVerified();
        }
        
        // Check if tax code hash is already used
        if (usedTaxCodeHashes[verifiedData.taxCodeHash]) {
            revert TaxCodeAlreadyUsed();
        }
        
        // Validate the verified data
        require(bytes(verifiedData.patientId).length > 0, "Invalid patient ID");
        require(verifiedData.taxCodeHash != bytes32(0), "Invalid tax code hash");
        require(bytes(verifiedData.regionalCode).length > 0, "Invalid regional code");
        require(bytes(verifiedData.homeAsl).length > 0, "Invalid ASL");
        
        // Mark patient as verified
        verifiedItalianPatients[patientAddress] = true;
        usedTaxCodeHashes[verifiedData.taxCodeHash] = true;
        patientIdToAddress[verifiedData.patientId] = patientAddress;
        
        // Create commitment for registration
        bytes32 commitment = keccak256(abi.encodePacked(
            verifiedData.taxCodeHash,
            patientAddress,
            block.timestamp
        ));
        
        // Register patient in the main registration contract
        try registrationContract.registerPatientWithWebProof(
            patientAddress,
            commitment,
            verifiedData.patientId,
            verifiedData.taxCodeHash,
            verifiedData.regionalCode,
            verifiedData.homeAsl
        ) {
            emit PatientRegisteredWithWebProof(
                patientAddress,
                verifiedData.patientId,
                verifiedData.homeAsl
            );
        } catch {
            revert RegistrationFailed();
        }
        
        emit ItalianPatientVerified(
            patientAddress,
            verifiedData.patientId,
            verifiedData.taxCodeHash,
            verifiedData.regionalCode,
            verifiedData.homeAsl,
            verifiedData.timestamp
        );
    }
    
    /// @notice Verify Italian health system registration without full patient registration
    /// @param proof The vlayer proof
    /// @param isValid Whether the patient has valid health system registration
    /// @param patientId The patient's health system ID
    /// @param homeAsl The patient's Local Health Authority
    function verifyHealthSystemRegistration(
        Proof calldata proof,
        bool isValid,
        string memory patientId,
        string memory homeAsl
    ) public view onlyVerified(prover, HealthSystemWebProofProver.verifyHealthSystemRegistration.selector) 
        returns (bool) {
        
        require(isValid, "Invalid health system registration");
        require(bytes(patientId).length > 0, "Invalid patient ID");
        require(bytes(homeAsl).length > 0, "Invalid ASL");
        
        return true;
    }
    
    /// @notice Check if a patient is verified in the Italian health system
    /// @param patient The patient's address
    /// @return True if patient is verified
    function isItalianPatientVerified(address patient) external view returns (bool) {
        return verifiedItalianPatients[patient];
    }
    
    /// @notice Get patient address by patient ID
    /// @param patientId The Italian health system patient ID
    /// @return The patient's Ethereum address
    function getPatientByHealthId(string memory patientId) external view returns (address) {
        return patientIdToAddress[patientId];
    }
    
    /// @notice Check if a tax code hash has been used
    /// @param taxCodeHash The hashed tax code
    /// @return True if already used
    function isTaxCodeUsed(bytes32 taxCodeHash) external view returns (bool) {
        return usedTaxCodeHashes[taxCodeHash];
    }
    
    /// @notice Update the prover contract address (admin function)
    /// @param _prover New prover contract address
    function updateProver(address _prover) external {
        // Add access control as needed
        prover = _prover;
    }
    
    /// @notice Update the registration contract address (admin function)
    /// @param _registrationContract New registration contract address
    function updateRegistrationContract(address _registrationContract) external {
        // Add access control as needed
        registrationContract = IRegistrationContract(_registrationContract);
    }
} 
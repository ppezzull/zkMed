// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./IRegistrationModule.sol";
import "./RegistrationStorage.sol";

/// @title PatientModule
/// @notice Handles patient registration and commitment verification
contract PatientModule is IRegistrationModule {
    
    RegistrationStorage public immutable storageContract;
    address public core;
    
    // ============ EVENTS ============
    
    event PatientRegistered(
        address indexed patient,
        bytes32 indexed commitment,
        uint256 timestamp
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyCore() {
        require(msg.sender == core, "Only core contract");
        _;
    }
    
    modifier notRegistered(address _user) {
        require(storageContract.roles(_user) == RegistrationStorage.Role.None, "Already registered");
        _;
    }
    
    modifier validCommitment(bytes32 _commitment) {
        require(_commitment != bytes32(0), "Invalid commitment");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _storage) {
        storageContract = RegistrationStorage(_storage);
    }
    
    // ============ INITIALIZATION ============
    
    function initialize(address _core) external override {
        require(core == address(0), "Already initialized");
        core = _core;
    }
    
    // ============ PATIENT REGISTRATION ============
    
    /// @notice Register a patient with a privacy-preserving commitment
    /// @param _patient The patient address
    /// @param _commitment Hash of secret passphrase + address
    function registerPatient(address _patient, bytes32 _commitment) 
        external 
        onlyCore
        notRegistered(_patient)
        validCommitment(_commitment)
    {
        require(storageContract.patientCommitments(_patient) == bytes32(0), "Patient already has commitment");
        
        // Store commitment and assign role
        storageContract.setPatientCommitment(_patient, _commitment);
        storageContract.setRole(_patient, RegistrationStorage.Role.Patient);
        storageContract.setVerified(_patient, true);
        storageContract.setActiveUser(_patient, true);
        storageContract.setRegistrationTimestamp(_patient, block.timestamp);
        
        emit PatientRegistered(_patient, _commitment, block.timestamp);
    }
    
    /// @notice Verify a patient's commitment with their secret passphrase
    /// @param _patient The patient address
    /// @param _secret The secret passphrase used in the original commitment
    /// @return bool True if the commitment is valid
    function verifyPatientCommitment(address _patient, string memory _secret) 
        external 
        view 
        returns (bool) 
    {
        require(storageContract.roles(_patient) == RegistrationStorage.Role.Patient, "Not a registered patient");
        require(storageContract.activeUsers(_patient), "User deactivated");
        
        bytes32 computedCommitment = keccak256(abi.encodePacked(_secret, _patient));
        return storageContract.patientCommitments(_patient) == computedCommitment;
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /// @notice Get patient commitment
    function getPatientCommitment(address _patient) external view returns (bytes32) {
        require(storageContract.roles(_patient) == RegistrationStorage.Role.Patient, "Not a patient");
        return storageContract.patientCommitments(_patient);
    }
} 
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./IRegistrationModule.sol";
import "./RegistrationStorage.sol";

/// @title PatientModule
/// @notice Handles patient registration with privacy-preserving commitments and WebProof integration
contract PatientModule is IRegistrationModule {
    
    RegistrationStorage public immutable storageContract;
    address public core;
    
    // Italian health system integration
    struct ItalianHealthData {
        string patientId;        // ASUR patient ID
        bytes32 taxCodeHash;     // Hashed Italian tax code
        string regionalCode;     // Regional healthcare code
        string homeAsl;          // Local Health Authority
        uint256 verificationTimestamp;
    }
    
    // Storage for Italian health system data
    mapping(address => ItalianHealthData) public italianHealthData;
    mapping(string => address) public patientIdToAddress;
    mapping(bytes32 => address) public taxCodeHashToAddress;
    
    // ============ EVENTS ============
    
    event PatientRegistered(
        address indexed patient,
        bytes32 indexed commitment,
        uint256 timestamp
    );
    
    event PatientRegisteredWithWebProof(
        address indexed patient,
        bytes32 indexed commitment,
        string patientId,
        bytes32 taxCodeHash,
        string regionalCode,
        string homeAsl,
        uint256 timestamp
    );
    
    event EHRUploaded(
        address indexed patient,
        string indexed cid,
        uint256 timestamp
    );
    
    event OperationProposed(
        address indexed patient,
        bytes32 indexed procedureHash,
        uint256 estimatedUSDCCost,
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
    
    modifier registeredPatient(address _patient) {
        require(storageContract.roles(_patient) == RegistrationStorage.Role.Patient, "Not a registered patient");
        require(storageContract.activeUsers(_patient), "User deactivated");
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
    
    /// @notice Register a patient with Italian health system WebProof
    /// @param _patient The patient address
    /// @param _commitment Privacy-preserving commitment
    /// @param _patientId Italian health system patient ID
    /// @param _taxCodeHash Hashed Italian tax code
    /// @param _regionalCode Regional healthcare code
    /// @param _homeAsl Local Health Authority
    function registerPatientWithWebProof(
        address _patient,
        bytes32 _commitment,
        string memory _patientId,
        bytes32 _taxCodeHash,
        string memory _regionalCode,
        string memory _homeAsl
    ) 
        external 
        onlyCore
        notRegistered(_patient)
        validCommitment(_commitment)
    {
        require(storageContract.patientCommitments(_patient) == bytes32(0), "Patient already has commitment");
        require(bytes(_patientId).length > 0, "Invalid patient ID");
        require(_taxCodeHash != bytes32(0), "Invalid tax code hash");
        require(bytes(_regionalCode).length > 0, "Invalid regional code");
        require(bytes(_homeAsl).length > 0, "Invalid ASL");
        
        // Check uniqueness
        require(patientIdToAddress[_patientId] == address(0), "Patient ID already used");
        require(taxCodeHashToAddress[_taxCodeHash] == address(0), "Tax code already used");
        
        // Store commitment and assign role
        storageContract.setPatientCommitment(_patient, _commitment);
        storageContract.setRole(_patient, RegistrationStorage.Role.Patient);
        storageContract.setVerified(_patient, true);
        storageContract.setActiveUser(_patient, true);
        storageContract.setRegistrationTimestamp(_patient, block.timestamp);
        
        // Store Italian health system data
        italianHealthData[_patient] = ItalianHealthData({
            patientId: _patientId,
            taxCodeHash: _taxCodeHash,
            regionalCode: _regionalCode,
            homeAsl: _homeAsl,
            verificationTimestamp: block.timestamp
        });
        
        // Update mappings
        patientIdToAddress[_patientId] = _patient;
        taxCodeHashToAddress[_taxCodeHash] = _patient;
        
        emit PatientRegisteredWithWebProof(
            _patient,
            _commitment,
            _patientId,
            _taxCodeHash,
            _regionalCode,
            _homeAsl,
            block.timestamp
        );
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
    
    // ============ ENCRYPTED EHR MANAGEMENT ============
    
    /// @notice Upload encrypted EHR with PRE key for post-approval decryption
    /// @param _cid IPFS CID of encrypted medical records
    /// @param _preKey Proxy Re-Encryption key for controlled access
    function uploadEncryptedEHR(
        string memory _cid,
        bytes memory _preKey
    ) 
        external 
        registeredPatient(msg.sender)
    {
        require(bytes(_cid).length > 0, "Invalid IPFS CID");
        require(_preKey.length > 0, "Invalid PRE key");
        
        // Store EHR data (implementation depends on storage pattern)
        // This could be stored in a separate EHR storage contract
        
        emit EHRUploaded(msg.sender, _cid, block.timestamp);
    }
    
    /// @notice Propose operation with WebProof validation
    /// @param _webProof vlayer WebProof from patient portal
    /// @param _procedureHash Hash of the medical procedure
    /// @param _estimatedUSDCCost Estimated cost in USDC
    function proposeOperation(
        bytes memory _webProof,
        bytes32 _procedureHash,
        uint256 _estimatedUSDCCost
    ) 
        external 
        registeredPatient(msg.sender)
    {
        require(_webProof.length > 0, "Invalid WebProof");
        require(_procedureHash != bytes32(0), "Invalid procedure hash");
        require(_estimatedUSDCCost > 0, "Invalid cost estimate");
        
        // WebProof validation would be handled by a separate validator contract
        // This function creates the operation proposal
        
        emit OperationProposed(
            msg.sender,
            _procedureHash,
            _estimatedUSDCCost,
            block.timestamp
        );
    }
    
    // ============ VIEW FUNCTIONS ============
    
    /// @notice Get patient commitment
    function getPatientCommitment(address _patient) external view returns (bytes32) {
        require(storageContract.roles(_patient) == RegistrationStorage.Role.Patient, "Not a patient");
        return storageContract.patientCommitments(_patient);
    }
    
    /// @notice Get Italian health system data for a patient
    /// @param _patient The patient address
    /// @return patientId Italian health system patient ID
    /// @return taxCodeHash Hashed tax code
    /// @return regionalCode Regional healthcare code
    /// @return homeAsl Local Health Authority
    /// @return verificationTimestamp When the data was verified
    function getItalianHealthData(address _patient) 
        external 
        view 
        returns (
            string memory patientId,
            bytes32 taxCodeHash,
            string memory regionalCode,
            string memory homeAsl,
            uint256 verificationTimestamp
        ) 
    {
        require(storageContract.roles(_patient) == RegistrationStorage.Role.Patient, "Not a patient");
        
        ItalianHealthData memory data = italianHealthData[_patient];
        return (
            data.patientId,
            data.taxCodeHash,
            data.regionalCode,
            data.homeAsl,
            data.verificationTimestamp
        );
    }
    
    /// @notice Get patient address by Italian health system patient ID
    /// @param _patientId The Italian health system patient ID
    /// @return The patient's Ethereum address
    function getPatientByHealthId(string memory _patientId) 
        external 
        view 
        returns (address) 
    {
        return patientIdToAddress[_patientId];
    }
    
    /// @notice Get patient address by tax code hash
    /// @param _taxCodeHash The hashed tax code
    /// @return The patient's Ethereum address
    function getPatientByTaxCodeHash(bytes32 _taxCodeHash) 
        external 
        view 
        returns (address) 
    {
        return taxCodeHashToAddress[_taxCodeHash];
    }
    
    /// @notice Check if a patient has Italian health system verification
    /// @param _patient The patient address
    /// @return True if patient has Italian health system data
    function hasItalianHealthVerification(address _patient) 
        external 
        view 
        returns (bool) 
    {
        return bytes(italianHealthData[_patient].patientId).length > 0;
    }
} 
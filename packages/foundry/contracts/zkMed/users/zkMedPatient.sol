// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {zkMedRequestManager} from "../zkMedRequestManager.sol";
import {zkMedRegistrationProver} from "../provers/zkMedRegistrationProver.sol";
import {zkMedPaymentPlanProver} from "../provers/zkMedPaymentPlanProver.sol";
import {zkMedLinkPay} from "../zkMedLinkPay.sol";

/**
 * @title zkMed Patient Contract
 * @notice Handles patient registration, data storage, and payment plan management
 * @dev Manages own data and communicates with zkMedCore for verification only
 */
contract zkMedPatient is Verifier {
    
    // ======== Data Structures ========
    
    // Base record with common fields
    struct BaseRecord {
        address walletAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
        uint256 requestId;
    }
    
    // Patient-specific record
    struct PatientRecord {
        BaseRecord base;
        // Additional patient-specific fields can be added here
    }
    
    // ======== State Variables ========
    
    address public zkMedCoreContract;
    address public registrationProver;
    address public paymentPlanProver;
    zkMedLinkPay public linkPayContract;
    
    // Patient data storage
    mapping(address => PatientRecord) public patientRecords;
    mapping(bytes32 => bool) public usedEmailHashes;
    uint256 public totalPatients;
    
    // ======== Events ========
    
    event PatientRegistered(address indexed patient, bytes32 emailHash);
    event PaymentPlanRequested(address indexed patient, address indexed insurer, uint256 requestId);
    
    // ======== Constructor ========
    
    constructor(
        address _zkMedCore, 
        address _registrationProver,
        address _paymentPlanProver,
        address _linkPayContract
    ) {
        zkMedCoreContract = _zkMedCore;
        registrationProver = _registrationProver;
        paymentPlanProver = _paymentPlanProver;
        linkPayContract = zkMedLinkPay(_linkPayContract);
    }
    
    // ======== Modifiers ========
    
    modifier onlyCore() {
        require(msg.sender == zkMedCoreContract, "Only zkMedCore can call this");
        _;
    }
    
    modifier notRegistered() {
        require(!patientRecords[msg.sender].base.isActive, "Patient already registered");
        _;
    }
    
    modifier onlyRegisteredPatient() {
        require(patientRecords[msg.sender].base.isActive, "Patient not registered");
        _;
    }
    
    // ======== External Registration Functions ========
    
    /**
     * @dev Register as a patient using email verification
     * @param registrationData Data from the registration prover
     */
    function registerPatient(
        Proof calldata,
        zkMedRegistrationProver.RegistrationData calldata registrationData
    ) 
        external 
        notRegistered
        onlyVerified(
            registrationProver, 
            zkMedRegistrationProver.provePatientEmail.selector
        )
    {
        require(
            registrationData.requestedRole == zkMedRegistrationProver.UserType.PATIENT, 
            "Not a patient registration"
        );
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        require(_isValidEmail(registrationData.emailHash), "Invalid email hash");
        
        // Store patient data locally
        patientRecords[msg.sender] = PatientRecord({
            base: BaseRecord({
                walletAddress: msg.sender,
                emailHash: registrationData.emailHash,
                registrationTime: block.timestamp,
                isActive: true,
                requestId: 0 // Will be set by core if needed
            })
        });
        
        usedEmailHashes[registrationData.emailHash] = true;
        totalPatients++;
        
        // Notify zkMedCore for cross-system coordination
        (bool success,) = zkMedCoreContract.call(
            abi.encodeWithSignature("notifyPatientRegistration(address,bytes32)", msg.sender, registrationData.emailHash)
        );
        require(success, "Failed to notify core contract");
        
        emit PatientRegistered(msg.sender, registrationData.emailHash);
    }
    
    /**
     * @dev Accept a payment plan from an insurer
     * @param planData Payment plan data from prover
     */
    function acceptPaymentPlan(
        Proof calldata,
        zkMedPaymentPlanProver.PaymentPlanData calldata planData
    ) 
        external 
        onlyRegisteredPatient
        onlyVerified(
            paymentPlanProver, 
            zkMedPaymentPlanProver.provePaymentPlan.selector
        )
    {
        require(planData.insurerAddress != address(0), "Invalid insurer address");
        require(planData.duration > block.timestamp, "Duration must be in the future");
        require(planData.monthlyAllowance > 0, "Monthly allowance must be positive");
        require(bytes(planData.insuranceName).length > 0, "Insurance name cannot be empty");
        
        // Get hospital address from zkMedCore (assuming it exists in the system)
        (bool success, bytes memory hospitalResult) = zkMedCoreContract.call(
            abi.encodeWithSignature("getHospitalForPatient(address)", msg.sender)
        );
        require(success, "Failed to get hospital address");
        address hospitalAddress = abi.decode(hospitalResult, (address));
        require(hospitalAddress != address(0), "No hospital assigned to patient");
        
        // Create automated payment plan through LinkPay contract
        bytes32 planId = linkPayContract.createPaymentPlan(
            msg.sender,                    // patient
            planData.insurerAddress,       // insurer
            hospitalAddress,               // hospital
            planData.monthlyAllowance,     // monthly allowance
            planData.duration,             // plan duration
            planData.insuranceName         // insurance name
        );
        
        // Call zkMedCore to create payment plan request with proper validation
        (bool coreSuccess, bytes memory result) = zkMedCoreContract.call(
            abi.encodeWithSignature(
                "createPaymentPlanRequest(address,address,string,uint256,uint256,bytes32,bytes32,bytes32)",
                planData.insurerAddress,
                msg.sender,
                planData.insuranceName,
                planData.duration,
                planData.monthlyAllowance,
                planData.insurerEmailHash,
                planData.patientEmailHash,
                planId  // Include the LinkPay plan ID
            )
        );
        require(coreSuccess, "Failed to create payment plan request");
        
        uint256 requestId = abi.decode(result, (uint256));
        emit PaymentPlanRequested(msg.sender, planData.insurerAddress, requestId);
    }
    
    // ======== View Functions ========
    
    /**
     * @dev Check if an address is a registered patient
     * @param patient Patient address to check
     * @return bool True if registered and active
     */
    function isPatientRegistered(address patient) external view returns (bool) {
        return patientRecords[patient].base.isActive;
    }
    
    /**
     * @dev Get patient record
     * @param patient Patient address
     * @return PatientRecord struct
     */
    function getPatientRecord(address patient) external view returns (PatientRecord memory) {
        require(patientRecords[patient].base.isActive, "Patient not registered");
        return patientRecords[patient];
    }
    
    /**
     * @dev Get caller's patient record
     * @return PatientRecord struct
     */
    function getMyPatientRecord() external view onlyRegisteredPatient returns (PatientRecord memory) {
        return patientRecords[msg.sender];
    }
    
    /**
     * @dev Check if email hash is already used
     * @param emailHash Email hash to check
     * @return bool True if already used
     */
    function isEmailHashUsed(bytes32 emailHash) external view returns (bool) {
        return usedEmailHashes[emailHash];
    }
    
    /**
     * @dev Get total number of registered patients
     * @return uint256 Total patients
     */
    function getTotalPatients() external view returns (uint256) {
        return totalPatients;
    }
    
    // ======== Core Interface Functions ========
    
    /**
     * @dev Update LinkPay contract address (only callable by zkMedCore)
     * @param newLinkPayContract New LinkPay contract address
     */
    function updateLinkPayContract(address newLinkPayContract) external onlyCore {
        require(newLinkPayContract != address(0), "Invalid LinkPay contract address");
        linkPayContract = zkMedLinkPay(newLinkPayContract);
    }
    
    /**
     * @dev Update patient record (only callable by zkMedCore)
     * @param patient Patient address
     * @param requestId Request ID to associate
     */
    function updatePatientRequestId(address patient, uint256 requestId) external onlyCore {
        require(patientRecords[patient].base.isActive, "Patient not registered");
        patientRecords[patient].base.requestId = requestId;
    }
    
    /**
     * @dev Deactivate a patient (only callable by zkMedCore)
     * @param patient Patient address to deactivate
     */
    function deactivatePatient(address patient) external onlyCore {
        require(patientRecords[patient].base.isActive, "Patient not registered");
        patientRecords[patient].base.isActive = false;
        totalPatients--;
    }
    
    // ======== Internal Helper Functions ========
    
    /**
     * @dev Validate email hash format
     * @param emailHash Email hash to validate
     * @return bool True if valid email hash
     */
    function _isValidEmail(bytes32 emailHash) internal pure returns (bool) {
        return emailHash != bytes32(0);
    }
} 
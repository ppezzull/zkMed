// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {zkMedCore} from "../zkMedCore.sol";

import {zkMedRegistrationProver} from "../provers/zkMedRegistrationProver.sol";

/**
 * @title zkMed Insurer Contract
 * @notice Handles insurer-specific functions including registration, payments, and payment plan creation
 * @dev Uses vlayer verification for domain proofs and calls zkMedCore for state management
 */
contract zkMedInsurer is Verifier {
    
    zkMedCore public zkMedCoreContract;
    address public registrationProver;
    
    // Organization record structure
    struct BaseRecord {
        address walletAddress;
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
    
    // Insurer data storage
    mapping(address => OrganizationRecord) public insurerRecords;
    mapping(string => address) public domainToInsurer;
    mapping(bytes32 => bool) public usedEmailHashes;
    uint256 public totalInsurers;
    
    // Payment plan creation tracking
    struct PaymentPlanProposal {
        address patient;
        string insuranceName;
        uint256 duration;
        uint256 monthlyAllowance;
        uint256 createdAt;
        bool isActive;
    }
    
    // Mapping from insurer to their created payment plan proposals
    mapping(address => PaymentPlanProposal[]) public insurerPaymentProposals;
    mapping(address => mapping(address => PaymentPlanProposal[])) public insurerPatientProposals;
    
    event InsurerRegisteredLocal(address indexed insurer, string domain, uint256 requestId);
    event PaymentSentToPatient(address indexed insurer, address indexed patient, uint256 amount);
    event PaymentSentToHospital(address indexed insurer, address indexed hospital, uint256 amount);
    event PaymentPlanCreated(address indexed insurer, address indexed patient, string insuranceName, uint256 duration, uint256 monthlyAllowance);
    event PaymentPlanSent(address indexed insurer, address indexed patient, uint256 proposalIndex);
    
    modifier notRegistered() {
        require(!insurerRecords[msg.sender].base.isActive, "Insurer already registered");
        _;
    }
    
    modifier onlyRegisteredInsurer() {
        require(insurerRecords[msg.sender].base.isActive, "Insurer not registered");
        _;
    }
    
    modifier onlyApprovedInsurer() {
        require(isInsurerRegistered(msg.sender), "Insurer not registered");
        require(insurerRecords[msg.sender].isApproved, "Insurer not approved");
        _;
    }
    
    constructor(address _zkMedCore, address _registrationProver) {
        zkMedCoreContract = zkMedCore(_zkMedCore);
        registrationProver = _registrationProver;
    }
    
    /**
     * @dev Register as an insurer using domain verification
     * @param registrationData Data from the registration prover
     */
    function registerInsurer(
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
        // Validate that this is an insurer registration
        require(
            registrationData.requestedRole == zkMedRegistrationProver.UserType.INSURER, 
            "Not an insurer registration"
        );
        require(registrationData.walletAddress == msg.sender, "Wallet address mismatch");
        require(registrationData.walletAddress != address(0), "Invalid insurer address");
        require(bytes(registrationData.domain).length > 0, "Domain cannot be empty");
        require(bytes(registrationData.organizationName).length > 0, "Organization name cannot be empty");
        require(_isValidInsurerDomain(registrationData.domain), "Invalid insurer domain");
        require(_isValidEmail(registrationData.emailHash), "Invalid email hash");
        require(domainToInsurer[registrationData.domain] == address(0), "Domain already registered");
        require(!usedEmailHashes[registrationData.emailHash], "Email already used");
        
        // Store insurer data locally - inactive by default, requires admin activation
        insurerRecords[msg.sender] = OrganizationRecord({
            base: BaseRecord({
                walletAddress: msg.sender,
                emailHash: registrationData.emailHash,
                registrationTime: block.timestamp,
                isActive: false  // Changed: insurers start inactive and need admin approval
            }),
            domain: registrationData.domain,
            organizationName: registrationData.organizationName,
            isApproved: false
        });
        
        domainToInsurer[registrationData.domain] = msg.sender;
        usedEmailHashes[registrationData.emailHash] = true;
        totalInsurers++;
        
        // Notify zkMedCore for cross-system coordination
        zkMedCoreContract.notifyInsurerRegistration(
            msg.sender, 
            registrationData.domain, 
            registrationData.emailHash
        );
        
        emit InsurerRegisteredLocal(msg.sender, registrationData.domain, 0);
    }
    
    /**
     * @dev Pay a patient according to their payment plan
     * @param patient Address of the patient to pay
     * @param amount Amount to pay in wei
     */
    function payPatient(address patient, uint256 amount) external payable onlyApprovedInsurer {
        require(msg.value >= amount, "Insufficient payment amount");
        require(patient != address(0), "Invalid patient address");
        require(amount > 0, "Amount must be positive");
        
        // Patient validation will be done by zkMedCore during plan creation
        
        // Check if there's an active payment plan
        // TODO: Implement local payment plan tracking or use request manager
        bool hasActivePlan = true; // Simplified for now
        uint256 planAllowance = amount; // Simplified for now
        
        require(hasActivePlan, "No active payment plan with this patient");
        require(amount <= planAllowance, "Amount exceeds monthly allowance");
        
        // Transfer payment to patient
        (bool success, ) = payable(patient).call{value: amount}("");
        require(success, "Payment transfer failed");
        
        // Refund excess if any
        if (msg.value > amount) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - amount}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit PaymentSentToPatient(msg.sender, patient, amount);
    }
    
    /**
     * @dev Pay a hospital for services
     * @param hospital Address of the hospital to pay
     * @param amount Amount to pay in wei
     */
    function payHospital(address hospital, uint256 amount) external payable onlyApprovedInsurer {
        require(msg.value >= amount, "Insufficient payment amount");
        require(hospital != address(0), "Invalid hospital address");
        require(amount > 0, "Amount must be positive");
        
        // Verify hospital is registered and approved through hospital contract
        (bool success, bytes memory result) = zkMedCoreContract.hospitalContract().staticcall(
            abi.encodeWithSignature("isHospitalApproved(address)", hospital)
        );
        require(success && abi.decode(result, (bool)), "Hospital not approved");
        
        // Transfer payment to hospital
        (bool paymentSuccess, ) = payable(hospital).call{value: amount}("");
        require(paymentSuccess, "Payment transfer failed");
        
        // Refund excess if any
        if (msg.value > amount) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - amount}("");
            require(refundSuccess, "Refund failed");
        }
        
        emit PaymentSentToHospital(msg.sender, hospital, amount);
    }
    
    // ======== Admin Functions ========
    
    /**
     * @dev Activate an insurer (called by zkMedCore via admin)
     * @param insurerAddress Address of the insurer to activate
     */
    function activateByAdmin(address insurerAddress) external {
        require(msg.sender == address(zkMedCoreContract), "Only zkMedCore can call this");
        require(insurerRecords[insurerAddress].base.walletAddress != address(0), "Insurer not registered");
        require(!insurerRecords[insurerAddress].base.isActive, "Insurer already active");
        
        insurerRecords[insurerAddress].base.isActive = true;
        insurerRecords[insurerAddress].isApproved = true;
    }
    
    /**
     * @dev Deactivate an insurer (called by zkMedCore via admin)
     * @param insurerAddress Address of the insurer to deactivate
     */
    function deactivateByAdmin(address insurerAddress) external {
        require(msg.sender == address(zkMedCoreContract), "Only zkMedCore can call this");
        require(insurerRecords[insurerAddress].base.walletAddress != address(0), "Insurer not registered");
        require(insurerRecords[insurerAddress].base.isActive, "Insurer already inactive");
        
        insurerRecords[insurerAddress].base.isActive = false;
        insurerRecords[insurerAddress].isApproved = false;
    }
    
    // ======== Payment Plan Creation Functions ========
    
    /**
     * @dev Create a payment plan proposal for a patient
     * @param patient Address of the patient
     * @param insuranceName Name of the insurance company
     * @param duration Duration of the payment plan (timestamp)
     * @param monthlyAllowance Monthly allowance in cents (e.g., 4000 = $40.00)
     * @return proposalIndex The index of the created proposal
     */
    function createPaymentPlan(
        address patient,
        string calldata insuranceName,
        uint256 duration,
        uint256 monthlyAllowance
    ) external onlyApprovedInsurer returns (uint256 proposalIndex) {
        require(patient != address(0), "Invalid patient address");
        require(bytes(insuranceName).length > 0, "Insurance name cannot be empty");
        require(duration > block.timestamp, "Duration must be in the future");
        require(duration <= block.timestamp + 365 days * 5, "Duration cannot exceed 5 years");
        require(monthlyAllowance > 0, "Monthly allowance must be positive");
        require(monthlyAllowance <= 1000000, "Monthly allowance too high"); // Max $10,000
        
        // Verify patient is registered through patient contract
        (bool success, bytes memory result) = zkMedCoreContract.patientContract().staticcall(
            abi.encodeWithSignature("isPatientRegistered(address)", patient)
        );
        require(success && abi.decode(result, (bool)), "Patient not registered");
        
        // Create the payment plan proposal
        PaymentPlanProposal memory proposal = PaymentPlanProposal({
            patient: patient,
            insuranceName: insuranceName,
            duration: duration,
            monthlyAllowance: monthlyAllowance,
            createdAt: block.timestamp,
            isActive: true
        });
        
        // Store the proposal
        insurerPaymentProposals[msg.sender].push(proposal);
        insurerPatientProposals[msg.sender][patient].push(proposal);
        
        proposalIndex = insurerPaymentProposals[msg.sender].length - 1;
        
        emit PaymentPlanCreated(
            msg.sender, 
            patient, 
            insuranceName, 
            duration, 
            monthlyAllowance
        );
        emit PaymentPlanSent(msg.sender, patient, proposalIndex);
        
        return proposalIndex;
    }
    
    /**
     * @dev Get payment plan proposals created by this insurer
     * @return Array of payment plan proposals
     */
    function getMyPaymentProposals() external view onlyRegisteredInsurer returns (PaymentPlanProposal[] memory) {
        return insurerPaymentProposals[msg.sender];
    }
    
    /**
     * @dev Get payment plan proposals for a specific patient
     * @param patient Patient address
     * @return Array of payment plan proposals for the patient
     */
    function getPaymentProposalsForPatient(address patient) external view onlyRegisteredInsurer returns (PaymentPlanProposal[] memory) {
        require(patient != address(0), "Invalid patient address");
        // Verify patient is registered through patient contract
        (bool success, bytes memory result) = zkMedCoreContract.patientContract().staticcall(
            abi.encodeWithSignature("isPatientRegistered(address)", patient)
        );
        require(success && abi.decode(result, (bool)), "Patient not registered");
        return insurerPatientProposals[msg.sender][patient];
    }
    
    /**
     * @dev Deactivate a payment plan proposal
     * @param proposalIndex Index of the proposal to deactivate
     */
    function deactivatePaymentProposal(uint256 proposalIndex) external onlyApprovedInsurer {
        require(proposalIndex < insurerPaymentProposals[msg.sender].length, "Invalid proposal index");
        require(insurerPaymentProposals[msg.sender][proposalIndex].isActive, "Proposal already inactive");
        
        insurerPaymentProposals[msg.sender][proposalIndex].isActive = false;
        
        // Also deactivate in patient-specific mapping
        address patient = insurerPaymentProposals[msg.sender][proposalIndex].patient;
        PaymentPlanProposal[] storage patientProposals = insurerPatientProposals[msg.sender][patient];
        
        for (uint256 i = 0; i < patientProposals.length; i++) {
            if (patientProposals[i].createdAt == insurerPaymentProposals[msg.sender][proposalIndex].createdAt) {
                patientProposals[i].isActive = false;
                break;
            }
        }
    }
    
    /**
     * @dev Get insurer's organization record
     * @return OrganizationRecord struct
     */
    function getMyOrganizationRecord() external view onlyRegisteredInsurer returns (OrganizationRecord memory) {
        return insurerRecords[msg.sender];
    }
    
    /**
     * @dev Check if insurer is registered and approved
     * @param insurer Insurer address to check
     * @return bool True if registered, active, and approved
     */
    function isInsurerApproved(address insurer) external view returns (bool) {
        return isInsurerRegistered(insurer) && insurerRecords[insurer].isApproved;
    }
    
    /**
     * @dev Check if caller is a registered insurer
     * @return bool True if caller is registered and active insurer
     */
    function amIRegistered() external view returns (bool) {
        return isInsurerRegistered(msg.sender);
    }
    
    /**
     * @dev Check if caller is approved (registered and admin-approved)
     * @return bool True if caller is approved insurer
     */
    function amIApproved() external view returns (bool) {
        return isInsurerRegistered(msg.sender) && insurerRecords[msg.sender].isApproved;
    }
    

    
    /**
     * @dev Get insurer by domain
     * @param domain Domain to query
     * @return address Insurer address that owns the domain
     */
    function getInsurerByDomain(string calldata domain) external view returns (address) {
        address insurerAddress = domainToInsurer[domain];
        require(insurerAddress != address(0), "Domain not registered");
        require(isInsurerRegistered(insurerAddress), "Domain not owned by registered insurer");
        return insurerAddress;
    }
    
    /**
     * @dev Get all patients with active payment plans from this insurer
     * @return patients Array of patient addresses with active plans
     * @return planCounts Array of number of active plans per patient
     */
    function getMyPatients() external view onlyRegisteredInsurer returns (
        address[] memory patients,
        uint256[] memory planCounts
    ) {
        // This is a simplified implementation
        // In production, you might want to maintain a separate mapping for efficiency
        
        // For now, return empty arrays as this would require iterating through all patients
        // which is gas-expensive. A better approach would be to use events or maintain 
        // separate mappings for insurer->patients relationships
        
        patients = new address[](0);
        planCounts = new uint256[](0);
        
        return (patients, planCounts);
    }
    
    /**
     * @dev Check if insurer has active payment plans with a specific patient
     * @param patient Patient address
     * @return bool True if insurer has active plans with the patient
     */
    function hasActivePaymentPlanWith(address patient) external view onlyRegisteredInsurer returns (bool) {
        // Verify patient is registered through patient contract
        (bool success, bytes memory result) = zkMedCoreContract.patientContract().staticcall(
            abi.encodeWithSignature("isPatientRegistered(address)", patient)
        );
        require(success && abi.decode(result, (bool)), "Patient not registered");
        
        // TODO: Implement local payment plan tracking
        // For now, return false as this function needs redesign for the new architecture
        return false;
    }
    
    // ======== Internal Validation Functions ========
    
    /**
     * @dev Check if domain is valid for insurer registration
     * @param domain Domain to check
     * @return bool True if valid insurer domain
     */
    function _isValidInsurerDomain(string memory domain) internal pure returns (bool) {
        bytes memory domainBytes = bytes(domain);
        if (domainBytes.length < 4 || domainBytes.length > 253) {
            return false;
        }
        
        // Check for basic domain structure (contains at least one dot)
        bool hasDot = false;
        for (uint256 i = 0; i < domainBytes.length; i++) {
            if (domainBytes[i] == 0x2E) { // ASCII for '.'
                hasDot = true;
                break;
            }
        }
        
        return hasDot;
    }
    
    // ======== Core Interface Functions ========
    
    /**
     * @dev Check if an insurer is registered
     * @param insurer Insurer address
     * @return bool True if registered
     */
    function isInsurerRegistered(address insurer) public view returns (bool) {
        return insurerRecords[insurer].base.isActive;
    }
    
    /**
     * @dev Check if email hash is used
     * @param emailHash Email hash to check
     * @return bool True if used
     */
    function isEmailHashUsed(bytes32 emailHash) external view returns (bool) {
        return usedEmailHashes[emailHash];
    }
    
    /**
     * @dev Get total insurers
     * @return uint256 Total number of insurers
     */
    function getTotalInsurers() external view returns (uint256) {
        return totalInsurers;
    }
    
    /**
     * @dev Validate insurer domain
     * @param domain Domain to validate
     * @return bool True if valid
     */
    function validateInsurerDomain(string calldata domain) external view returns (bool) {
        address insurerAddress = domainToInsurer[domain];
        return insurerAddress != address(0) && insurerRecords[insurerAddress].base.isActive;
    }
    
    /**
     * @dev Validate email hash format
     * @param emailHash Email hash to validate
     * @return bool True if valid email hash
     */
    function _isValidEmail(bytes32 emailHash) internal pure returns (bool) {
        return emailHash != bytes32(0);
    }
} 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {zkMedInvitationProver} from "../provers/zkMedInvitationProver.sol";

interface IzkMedCore {
    enum UserType { PATIENT, HOSPITAL, INSURER }
    enum RequestStatus { PENDING, APPROVED, REJECTED }
    enum RequestType { PATIENT_REGISTRATION, ORG_REGISTRATION, ADMIN_ACCESS, INVITATION }
    
    struct BaseRecord {
        address walletAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
        uint256 requestId;
    }
    
    struct PatientRecord {
        BaseRecord base;
    }
    
    struct OrganizationRecord {
        BaseRecord base;
        UserType orgType;
        string domain;
        string organizationName;
    }
    
    struct PaymentPlan {
        uint256 duration;
        uint256 monthlyAllowance;
        bool isActive;
        uint256 createdAt;
        address insurerAddress;
    }
    
    // Patient functions
    function registerPatientFromContract(
        address patient,
        bytes32 emailHash,
        uint256 requestId
    ) external;
    
    // Hospital functions
    function registerHospitalFromContract(
        address hospital,
        bytes32 emailHash,
        string calldata domain,
        string calldata organizationName,
        uint256 requestId
    ) external;
    
    // Insurer functions
    function registerInsurerFromContract(
        address insurer,
        bytes32 emailHash,
        string calldata domain,
        string calldata organizationName,
        uint256 requestId
    ) external;
    
    function processInvitationFromContract(
        zkMedInvitationProver.InvitationData calldata invitationData,
        uint256 requestId
    ) external;
    
    // View functions
    function isUserRegistered(address user) external view returns (bool);
    function getUserType(address user) external view returns (UserType);
    function getPatientRecord(address patient) external view returns (PatientRecord memory);
    function getOrganizationRecord(address organization) external view returns (OrganizationRecord memory);
    function getPatientPaymentPlans(address patient) external view returns (PaymentPlan[] memory);
    function getActivePaymentPlans(address patient) external view returns (PaymentPlan[] memory);
    function isOrganizationApproved(address organization) external view returns (bool);
    function validateHospitalDomain(string calldata domain) external view returns (bool);
    function validateInsurerDomain(string calldata domain) external view returns (bool);
    function isDomainTaken(string calldata domain) external view returns (bool);
    function getDomainOwner(string calldata domain) external view returns (address);
    function hasInsurerInvitedPatient(address insurer, address patient) external view returns (bool);
} 
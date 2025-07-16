// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Strings} from "openzeppelin-contracts/utils/Strings.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";

// Simple interface for the invitation prover's needs
interface IzkMedCoreSimple {
    enum UserType { PATIENT, HOSPITAL, INSURER }
    function userTypes(address user) external view returns (UserType);
    function isOrganizationApproved(address organization) external view returns (bool);
    function isUserRegistered(address user) external view returns (bool);
    function domainToUser(string calldata domain) external view returns (address);
    function usedEmailHashes(bytes32 emailHash) external view returns (bool);
}

/// @title zkMed Invitation Prover Contract
/// @notice Handles invitation verification from insurance companies to patients/hospitals
contract zkMedInvitationProver is Prover {
    using RegexLib for string;
    using Strings for string;
    using EmailProofLib for UnverifiedEmail;

    enum RecipientType { PATIENT, HOSPITAL }
    
    struct PaymentPlan {
        uint256 duration;           // Timestamp like 01/01/2027
        uint256 monthlyAllowance;   // Monthly allowance in cents (e.g., 4000 = $40.00)
    }
    
    struct InvitationData {
        address senderAddress;      // Insurance company address
        address recipientAddress;   // Patient or hospital address
        RecipientType recipientType;
        string insuranceName;
        bytes32 senderEmailHash;
        bytes32 recipientEmailHash;
        PaymentPlan paymentPlan;    // Only populated for patient invitations
        bool hasPaymentPlan;        // True if invitation includes payment plan
    }

    IzkMedCoreSimple public zkMedCore;

    constructor(address _zkMedCore) {
        zkMedCore = IzkMedCoreSimple(_zkMedCore);
    }

    /// @notice Convert string to address
    function stringToAddress(string memory str) public pure returns (address) {
        bytes memory strBytes = bytes(str);
        require(strBytes.length == 42, "Invalid address length");
        bytes memory addrBytes = new bytes(20);

        for (uint256 i = 0; i < 20; i++) {
            uint8 high = hexCharToByte(strBytes[i * 2 + 2]);
            uint8 low = hexCharToByte(strBytes[i * 2 + 3]);
            addrBytes[i] = bytes1(uint8((high << 4) | low));
        }

        return address(uint160(bytes20(addrBytes)));
    }

    /// @notice Convert hex character to byte
    function hexCharToByte(bytes1 char) internal pure returns (uint8) {
        uint8 byteValue = uint8(char);
        if (byteValue >= uint8(bytes1("0")) && byteValue <= uint8(bytes1("9"))) {
            return byteValue - uint8(bytes1("0"));
        } else if (byteValue >= uint8(bytes1("a")) && byteValue <= uint8(bytes1("f"))) {
            return 10 + byteValue - uint8(bytes1("a"));
        } else if (byteValue >= uint8(bytes1("A")) && byteValue <= uint8(bytes1("F"))) {
            return 10 + byteValue - uint8(bytes1("A"));
        }
        revert("Invalid hex character");
    }

    /// @notice Parse date string DD/MM/YYYY to timestamp
    function parseDate(string memory dateStr) public pure returns (uint256) {
        bytes memory dateBytes = bytes(dateStr);
        require(dateBytes.length == 10, "Invalid date format");
        
        // Extract day, month, year
        uint256 day = (uint8(dateBytes[0]) - 48) * 10 + (uint8(dateBytes[1]) - 48);
        uint256 month = (uint8(dateBytes[3]) - 48) * 10 + (uint8(dateBytes[4]) - 48);
        uint256 year = (uint8(dateBytes[6]) - 48) * 1000 + (uint8(dateBytes[7]) - 48) * 100 + 
                       (uint8(dateBytes[8]) - 48) * 10 + (uint8(dateBytes[9]) - 48);
        
        require(day >= 1 && day <= 31, "Invalid day");
        require(month >= 1 && month <= 12, "Invalid month");
        require(year >= 2024, "Invalid year");
        
        // Convert to timestamp (simplified calculation)
        // This is a basic conversion - in production, use a proper date library
        uint256 timestamp = ((year - 1970) * 365 + (month - 1) * 30 + day) * 24 * 60 * 60;
        return timestamp;
    }

    /// @notice Parse monetary amount string like "40$" to cents
    function parseAmount(string memory amountStr) public pure returns (uint256) {
        bytes memory amountBytes = bytes(amountStr);
        require(amountBytes.length >= 2, "Invalid amount format");
        require(amountBytes[amountBytes.length - 1] == 0x24, "Amount must end with $"); // '$' character
        
        uint256 amount = 0;
        for (uint256 i = 0; i < amountBytes.length - 1; i++) {
            require(amountBytes[i] >= 0x30 && amountBytes[i] <= 0x39, "Invalid digit");
            amount = amount * 10 + (uint8(amountBytes[i]) - 48);
        }
        
        return amount * 100; // Convert to cents
    }

    /// @notice Prove insurance invitation to patient or hospital
    /// @dev Email subject: "You have been invited in zkMed from {insurance name}"
    /// @dev Email body for patients: "Patient payment contract\nDuration: DD/MM/YYYY\nMonthly allowance: XX$"
    function proveInvitation(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, InvitationData memory)
    {
        // Verify the email DKIM signature
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract domain from sender email
        string[] memory senderCapture = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(senderCapture.length == 2, "Invalid sender email format");
        string memory senderDomain = senderCapture[1];
        
        // Get sender address from domain
        address senderAddress = zkMedCore.domainToUser(senderDomain);
        require(senderAddress != address(0), "Sender domain not registered");
        require(zkMedCore.userTypes(senderAddress) == IzkMedCoreSimple.UserType.INSURER, "Sender is not an insurer");
        require(zkMedCore.isOrganizationApproved(senderAddress), "Sender organization not approved");
        
        // Extract recipient email and determine type
        string[] memory recipientCapture = email.to.capture("^([\\w.-]+)@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(recipientCapture.length == 3, "Invalid recipient email format");
        string memory recipientDomain = recipientCapture[2];
        
        // Determine recipient type and validate
        address recipientAddress;
        RecipientType recipientType;
        
        // Check if it's an organization domain
        address orgAddress = zkMedCore.domainToUser(recipientDomain);
        if (orgAddress != address(0)) {
            // It's an organization
            require(zkMedCore.userTypes(orgAddress) == IzkMedCoreSimple.UserType.HOSPITAL, "Recipient organization must be a hospital");
            require(zkMedCore.isOrganizationApproved(orgAddress), "Recipient hospital not approved");
            recipientAddress = orgAddress;
            recipientType = RecipientType.HOSPITAL;
        } else {
            // Assume it's a patient - we need to validate patient registration differently
            // For patients, we'll need additional logic since we can't directly map email to address
            // This is a simplified approach - in practice, you might need additional verification
            recipientType = RecipientType.PATIENT;
            recipientAddress = address(0); // Will be filled by the caller
        }
        
        // Parse subject to extract insurance name
        string[] memory subjectCapture = email.subject.capture(
            "^You have been invited in zkMed from ([\\w\\s]+)$"
        );
        require(subjectCapture.length == 2, "Invalid invitation subject format");
        string memory insuranceName = subjectCapture[1];
        
        // Initialize payment plan data
        PaymentPlan memory paymentPlan;
        bool hasPaymentPlan = false;
        
        // Parse body if it's a patient invitation
        if (recipientType == RecipientType.PATIENT) {
            // Extract payment plan from body
            string[] memory bodyCapture = email.body.capture(
                "Patient payment contract\\s*Duration:\\s*(\\d{2}/\\d{2}/\\d{4})\\s*Monthly allowance:\\s*(\\d+\\$)"
            );
            
            if (bodyCapture.length == 3) {
                hasPaymentPlan = true;
                paymentPlan.duration = parseDate(bodyCapture[1]);
                paymentPlan.monthlyAllowance = parseAmount(bodyCapture[2]);
            }
        }
        
        // Create invitation data
        InvitationData memory invitationData = InvitationData({
            senderAddress: senderAddress,
            recipientAddress: recipientAddress,
            recipientType: recipientType,
            insuranceName: insuranceName,
            senderEmailHash: sha256(abi.encodePacked(email.from)),
            recipientEmailHash: sha256(abi.encodePacked(email.to)),
            paymentPlan: paymentPlan,
            hasPaymentPlan: hasPaymentPlan
        });
        
        return (proof(), invitationData);
    }
}

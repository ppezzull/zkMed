// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Strings} from "openzeppelin-contracts/utils/Strings.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";

/// @title zkMed Payment Plan Prover Contract
/// @notice Handles payment plan verification from insurance companies to patients
contract zkMedPaymentPlanProver is Prover {
    using RegexLib for string;
    using Strings for string;
    using EmailProofLib for UnverifiedEmail;

    struct PaymentPlanData {
        address insurerAddress;
        address patientAddress;
        string insuranceName;
        bytes32 insurerEmailHash;
        bytes32 patientEmailHash;
        uint256 duration;           // Timestamp like 01/01/2027
        uint256 monthlyAllowance;   // Monthly allowance in cents (e.g., 4000 = $40.00)
    }

    /// @notice Convert string to address (from hex)
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

    /// @notice Prove payment plan creation from insurance company to patient
    /// @dev Email subject: "{insurance name} payment contract in zkMed"
    /// @dev Email body: "Patient payment contract\nDuration: DD/MM/YYYY\nMonthly allowance: XX$"
    function provePaymentPlan(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, PaymentPlanData memory)
    {
        // Verify the email DKIM signature
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract domain from sender email
        string[] memory senderCapture = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(senderCapture.length == 2, "Invalid sender email format");
        string memory senderDomain = senderCapture[1];
        
        // Get sender address from domain
        // address insurerAddress = zkMedCoreContract.domainToUser(senderDomain); // This line is removed
        // require(insurerAddress != address(0), "Sender domain not registered");
        // require(zkMedCoreContract.userTypes(insurerAddress) == zkMedCore.UserType.INSURER, "Sender is not an insurer");
        // require(zkMedCoreContract.isOrganizationApproved(insurerAddress), "Sender organization not approved");
        
        // Parse subject to extract insurance name
        string[] memory subjectCapture = email.subject.capture("^([\\w\\s]+) payment contract in zkMed$");
        require(subjectCapture.length == 2, "Invalid payment contract subject format");
        string memory insuranceName = subjectCapture[1];
        
        // Parse body to extract payment plan details
        string[] memory bodyCapture = email.body.capture(
            "^Patient payment contract\\s*Duration:\\s*(\\d{2}/\\d{2}/\\d{4})\\s*Monthly allowance:\\s*(\\d+\\$)\\s*$"
        );
        require(bodyCapture.length == 3, "Invalid payment contract body format");
        
        uint256 duration = parseDate(bodyCapture[1]);
        uint256 monthlyAllowance = parseAmount(bodyCapture[2]);
        
        // For now, we'll get the patient address from the email recipient
        // In a real implementation, you might want additional verification
        bytes32 patientEmailHash = sha256(abi.encodePacked(email.to));
        
        // Create payment plan data
        PaymentPlanData memory planData = PaymentPlanData({
            insurerAddress: address(0), // Placeholder, will be provided by the patient
            patientAddress: address(0), // Will be provided by the patient when they submit the proof
            insuranceName: insuranceName,
            insurerEmailHash: sha256(abi.encodePacked(email.from)),
            patientEmailHash: patientEmailHash,
            duration: duration,
            monthlyAllowance: monthlyAllowance
        });
        
        return (proof(), planData);
    }
} 
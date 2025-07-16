// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Strings} from "openzeppelin-contracts/utils/Strings.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";


/// @title zkMed Healthcare Registration Contract
/// @notice Manages patient and organization registration with MailProof verification for organizations
contract zkMedDomainProver is Prover {
    using RegexLib for string;
    using Strings for string;
    using EmailProofLib for UnverifiedEmail;

    enum UserType { PATIENT, HOSPITAL, INSURER }
    
    struct RegistrationData {
        UserType requestedRole;
        address walletAddress;
        string domain;
        string organizationName;
        bytes32 emailHash;
    }

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

    /// @notice Prove organization registration with domain ownership
    /// @dev Email format: "Register organization [Name] as [HOSPITAL/INSURER] with wallet: 0x..."
    function proveOrganizationDomain(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, RegistrationData memory)
    {
        // Verify the email DKIM signature
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract domain from sender email
        string[] memory domainCapture = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(domainCapture.length == 2, "Invalid email format");
        string memory domain = domainCapture[1];
        
        // Handle base64 encoded or plain text subject
        // For simplicity, we'll assume the subject is directly accessible and matches our pattern
        // In production, you'd need to handle potential base64 decoding
        
        // Extract organization name, role, and wallet from subject
        string[] memory subjectCapture = email.subject.capture(
            "^Register organization ([^\\s]+(?:\\s+[^\\s]+)*) as (HOSPITAL|INSURER) with wallet: (0x[a-fA-F0-9]{40})$"
        );
        
        require(subjectCapture.length == 4, "Invalid registration format");
        string memory orgName = subjectCapture[1];
        string memory roleStr = subjectCapture[2];
        address walletAddress = stringToAddress(subjectCapture[3]);
        
        // Determine role
        UserType role;
        if (roleStr.equal("HOSPITAL")) {
            role = UserType.HOSPITAL;
        } else if (roleStr.equal("INSURER")) {
            role = UserType.INSURER;
        } else {
            revert("Invalid role type");
        }
        
        // Create registration data
        RegistrationData memory regData = RegistrationData({
            requestedRole: role,
            walletAddress: walletAddress,
            domain: domain,
            organizationName: orgName,
            emailHash: sha256(abi.encodePacked(email.from))
        });
        
        // Return proof and registration data
        return (proof(), regData);
    }

    /// @notice Prove patient registration with email verification
    /// @dev Email subject format: "Register patient with wallet: 0x..."
    function provePatientEmail(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, RegistrationData memory)
    {
        // Verify the email DKIM signature
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract wallet address from subject
        string[] memory subjectCapture = email.subject.capture(
            "^Register patient with wallet: (0x[a-fA-F0-9]{40})$"
        );
        
        require(subjectCapture.length == 2, "Invalid patient registration format");
        address walletAddress = stringToAddress(subjectCapture[1]);
        
        // Calculate email hash - we use the entire email, not just the domain
        bytes32 emailHash = sha256(abi.encodePacked(email.from));

        // Create registration data
        RegistrationData memory regData = RegistrationData({
            requestedRole: UserType.PATIENT,
            walletAddress: walletAddress,
            domain: "",
            organizationName: "",
            emailHash: emailHash
        });

        // Return proof and registration data
        return (proof(), regData);
    }
}
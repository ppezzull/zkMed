// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Strings} from "openzeppelin-contracts/utils/Strings.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";


/// @title zkMed Healthcare Registration Contract
/// @notice Manages patient and organization registration with MailProof verification for organizations
contract HealthcareRegistrationProver is Prover {
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
            addrBytes[i] = bytes1(hexCharToByte(strBytes[2 + i * 2]) * 16 + hexCharToByte(strBytes[3 + i * 2]));
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
    function proveOrganizationRegistration(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, RegistrationData memory)
    {
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract organization name, role, and wallet address from subject
        // Pattern: "Register organization [Name] as [HOSPITAL/INSURER] with wallet: 0x[address]"
        string[] memory subjectCapture = email.subject.capture(
            "^Register organization (.+) as (HOSPITAL|INSURER) with wallet:\\s*(0x[a-fA-F0-9]{40})$"
        );
        require(subjectCapture.length >= 4, "Invalid organization registration format");
        
        string memory organizationName = subjectCapture[1];
        string memory roleString = subjectCapture[2];
        address targetWallet = stringToAddress(subjectCapture[3]);
        
        // Convert role string to enum
        UserType requestedRole;
        if (keccak256(abi.encodePacked(roleString)) == keccak256(abi.encodePacked("HOSPITAL"))) {
            requestedRole = UserType.HOSPITAL;
        } else if (keccak256(abi.encodePacked(roleString)) == keccak256(abi.encodePacked("INSURER"))) {
            requestedRole = UserType.INSURER;
        } else {
            revert("Invalid role specified");
        }
        
        // Extract domain from email (any domain is allowed)
        string[] memory domainCapture = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(domainCapture.length == 2, "Invalid email domain");
        
        string memory domain = domainCapture[1];
        
        RegistrationData memory regData = RegistrationData({
            requestedRole: requestedRole,
            walletAddress: targetWallet,
            domain: domain,
            organizationName: organizationName,
            emailHash: sha256(abi.encodePacked(email.from))
        });
        
        return (proof(), regData);
    }
}
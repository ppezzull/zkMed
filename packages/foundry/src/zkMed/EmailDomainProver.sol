// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Strings} from "openzeppelin-contracts/utils/Strings.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";

contract EmailDomainProver is Prover {
    using RegexLib for string;
    using Strings for string;
    using EmailProofLib for UnverifiedEmail;

    /// @notice Converts hex string to address
    function stringToAddress(string memory str) public pure returns (address) {
        bytes memory strBytes = bytes(str);
        require(strBytes.length == 42, "Invalid address length");
        require(strBytes[0] == "0" && strBytes[1] == "x", "Missing 0x prefix");
        
        bytes memory addrBytes = new bytes(20);
        for (uint256 i = 0; i < 20; i++) {
            addrBytes[i] = bytes1(
                hexCharToByte(strBytes[2 + i * 2]) * 16 + hexCharToByte(strBytes[3 + i * 2])
            );
        }
        return address(uint160(bytes20(addrBytes)));
    }

    /// @notice Converts hex character to byte value
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


    function verifyDomainOwnership(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, bytes32, address, string memory)
    {
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract wallet address from subject line
        string[] memory subjectCapture = email.subject.capture(
            "^Verify domain ownership for address: (0x[a-fA-F0-9]{40})$"
        );
        require(subjectCapture.length > 0, "No wallet address in subject");
        address targetWallet = stringToAddress(subjectCapture[1]);

        // Extract domain from email sender
        string[] memory domainCapture = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(domainCapture.length == 2, "Invalid email domain");
        require(bytes(domainCapture[1]).length > 0, "Invalid email domain");

        // Verify sender has admin privileges (admin@domain, info@domain, etc.)
        string[] memory adminCapture = email.from.capture("^(admin|info|contact|support)@");
        require(adminCapture.length > 0, "Email must be sent from admin account");

        return (proof(), sha256(abi.encodePacked(email.from)), targetWallet, domainCapture[1]);
    }

    /// @notice Verify organization with complete details
    /// Expected email subject: "Register organization [OrgName] for address: 0x..."
    function verifyOrganization(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, OrganizationVerificationData memory)
    {
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract organization name and wallet address from subject
        string[] memory orgCapture = email.subject.capture(
            "^Register organization \\[([^\\]]+)\\] for address: (0x[a-fA-F0-9]{40})$"
        );
        require(orgCapture.length >= 2, "Invalid organization registration format");
        
        string memory organizationName = orgCapture[1];
        address targetWallet = stringToAddress(orgCapture[2]);

        // Extract domain from email sender
        string[] memory domainCapture = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(domainCapture.length == 2, "Invalid email domain");
        
        // Verify admin sender
        string[] memory adminCapture = email.from.capture("^(admin|info|contact|support)@");
        require(adminCapture.length > 0, "Email must be sent from admin account");

        OrganizationVerificationData memory orgData = OrganizationVerificationData({
            name: organizationName,
            domain: domainCapture[1],
            targetWallet: targetWallet,
            emailHash: sha256(abi.encodePacked(email.from)),
            verificationTimestamp: block.timestamp
        });

        return (proof(), orgData);
    }

    /// @notice Simple domain verification for existing email patterns
    /// This is for backward compatibility and testing
    function simpleDomainVerification(UnverifiedEmail calldata unverifiedEmail, address /* targetWallet */)
        public
        view
        returns (Proof memory, string memory, bytes32)
    {
        VerifiedEmail memory email = unverifiedEmail.verify();
        
        // Extract domain from sender
        string[] memory domainCapture = email.from.capture("^[\\w.-]+@([a-zA-Z\\d.-]+\\.[a-zA-Z]{2,})$");
        require(domainCapture.length == 2, "Invalid email domain");
        
        return (proof(), domainCapture[1], sha256(abi.encodePacked(email.from)));
    }
}

/// @notice Organization verification data structure
struct OrganizationVerificationData {
    string name;
    string domain;
    address targetWallet;
    bytes32 emailHash;
    uint256 verificationTimestamp;
} 
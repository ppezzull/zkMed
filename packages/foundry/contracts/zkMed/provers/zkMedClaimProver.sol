// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Prover} from "vlayer-0.1.0/Prover.sol";
import {RegexLib} from "vlayer-0.1.0/Regex.sol";
import {VerifiedEmail, UnverifiedEmail, EmailProofLib} from "vlayer-0.1.0/EmailProof.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";

/// @title zkMed Claim Prover Contract
/// @notice Verifies claim payout emails and extracts payout data
contract zkMedClaimProver is Prover {
    using RegexLib for string;
    using EmailProofLib for UnverifiedEmail;

    struct ClaimPayoutData {
        string operationCode;        // e.g., "0DTJ0ZZ"
        uint256 payoutAmountCents;   // 100$ -> 10000 (cents)
        bytes32 insurerEmailHash;    // sha256(from)
        bytes32 patientEmailHash;    // sha256(to)
    }

    /// @notice Parse dollar amount string (digits only) to cents
    /// @dev E.g., "100" -> 10000
    function parseDollarsToCents(string memory dollars) public pure returns (uint256) {
        bytes memory b = bytes(dollars);
        require(b.length >= 1, "Invalid amount format");
        uint256 amount = 0;
        for (uint256 i = 0; i < b.length; i++) {
            require(b[i] >= 0x30 && b[i] <= 0x39, "Invalid digit");
            amount = amount * 10 + (uint8(b[i]) - 48);
        }
        return amount * 100;
    }

    /// @notice Prove claim payout extracted from the email subject
    /// @dev Subject format: "Claim payout of {amount}$ for operation {operationCode}"
    function proveClaimPayout(UnverifiedEmail calldata unverifiedEmail)
        public
        view
        returns (Proof memory, ClaimPayoutData memory)
    {
        // Verify DKIM signature
        VerifiedEmail memory email = unverifiedEmail.verify();

        // Subject capture
        // Group 1: amount dollars (digits)
        // Group 2: operation code (alphanumeric)
        string[] memory subjectCapture = email.subject.capture(
            "^Claim payout of (\\d+)\\$ for operation ([A-Za-z0-9]+)$"
        );
        require(subjectCapture.length == 3, "Invalid claim subject format");

        uint256 payoutAmountCents = parseDollarsToCents(subjectCapture[1]);
        string memory operationCode = subjectCapture[2];

        ClaimPayoutData memory claim = ClaimPayoutData({
            operationCode: operationCode,
            payoutAmountCents: payoutAmountCents,
            insurerEmailHash: sha256(abi.encodePacked(email.from)),
            patientEmailHash: sha256(abi.encodePacked(email.to))
        });

        return (proof(), claim);
    }
}



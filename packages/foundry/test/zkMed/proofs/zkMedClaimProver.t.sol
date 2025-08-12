// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {VTest} from "vlayer-0.1.0/testing/VTest.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {UnverifiedEmail, EmailProofLib, VerifiedEmail} from "vlayer-0.1.0/EmailProof.sol";
import {zkMedClaimProver} from "../../../contracts/zkMed/provers/zkMedClaimProver.sol";

contract EmailProofLibWrapperClaim {
    using EmailProofLib for UnverifiedEmail;

    function verify(UnverifiedEmail calldata email) public view returns (VerifiedEmail memory v) {
        return email.verify();
    }
}

contract zkMedClaimProverTest is VTest {
    function getTestEmail(string memory relativePath) public view returns (UnverifiedEmail memory) {
        string memory root = vm.projectRoot();
        string memory fullPath = string.concat(root, "/", relativePath);
        string memory mime = vm.readFile(fullPath);
        return preverifyEmail(mime);
    }

    function test_proveClaimPayout_parsesSubjectAndHashes() public {
        // Arrange
        EmailProofLibWrapperClaim wrapper = new EmailProofLibWrapperClaim();
        zkMedClaimProver prover = new zkMedClaimProver();
        UnverifiedEmail memory email = getTestEmail(
            "testdata/claim/Claim payout of 100$ for operation 0DTJ0ZZ.eml"
        );
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);

        // Act
        callProver();
        (Proof memory p, zkMedClaimProver.ClaimPayoutData memory claim) = prover.proveClaimPayout(email);

        // Assert
        assertEq(claim.operationCode, "0DTJ0ZZ");
        assertEq(claim.payoutAmountCents, 10000);
        assertEq(claim.insurerEmailHash, sha256(abi.encodePacked(verifiedEmail.from)));
        assertEq(claim.patientEmailHash, sha256(abi.encodePacked(verifiedEmail.to)));
    }

    function test_parseDollarsToCents() public {
        zkMedClaimProver prover = new zkMedClaimProver();
        assertEq(prover.parseDollarsToCents("0"), 0);
        assertEq(prover.parseDollarsToCents("1"), 100);
        assertEq(prover.parseDollarsToCents("100"), 10000);
    }
}



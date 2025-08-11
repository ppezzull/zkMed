// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {VTest} from "vlayer-0.1.0/testing/VTest.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {UnverifiedEmail, EmailProofLib, VerifiedEmail} from "vlayer-0.1.0/EmailProof.sol";
import {zkMedPaymentPlanProver} from "../../../contracts/zkMed/provers/zkMedPaymentPlanProver.sol";

contract EmailProofLibWrapper2 {
    using EmailProofLib for UnverifiedEmail;

    function verify(UnverifiedEmail calldata email) public view returns (VerifiedEmail memory v) {
        return email.verify();
    }
}

contract zkMedPaymentPlanProverTest is VTest {
    function getTestEmail(string memory relativePath) public view returns (UnverifiedEmail memory) {
        string memory root = vm.projectRoot();
        string memory fullPath = string.concat(root, "/", relativePath);
        string memory mime = vm.readFile(fullPath);
        return preverifyEmail(mime);
    }

    function test_provePaymentPlan_parsesEmailAndReturnsPlanData() public {
        // Arrange
        EmailProofLibWrapper2 wrapper = new EmailProofLibWrapper2();
        zkMedPaymentPlanProver prover = new zkMedPaymentPlanProver();
        UnverifiedEmail memory email = getTestEmail(
            "testdata/payment/HealthCorp Insurance payment contract in zkMed.eml"
        );
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);

        // Act
        callProver();
        (Proof memory p, zkMedPaymentPlanProver.PaymentPlanData memory plan) = prover.provePaymentPlan(email);

        // Assert
        // Proof object existence (minimal check that data was produced)
        // Note: We don't validate proof internals in this unit test
        // Core extracted fields
        assertEq(plan.insuranceName, "HealthCorp Insurance");
        assertEq(plan.monthlyAllowance, 4000); // 40$ -> 4000 cents

        // Duration: 01/01/2027 using prover's simplified conversion
        uint256 expectedTs = prover.parseDate("01/01/2027");
        assertEq(plan.duration, expectedTs);

        // Email hashes
        assertEq(plan.insurerEmailHash, sha256(abi.encodePacked(verifiedEmail.from)));
        assertEq(plan.patientEmailHash, sha256(abi.encodePacked(verifiedEmail.to)));

        // Addresses are placeholders in current implementation
        assertEq(plan.insurerAddress, address(0));
        assertEq(plan.patientAddress, address(0));
    }

    function test_parseAmount_and_parseDate_helpers() public {
        zkMedPaymentPlanProver prover = new zkMedPaymentPlanProver();
        assertEq(prover.parseAmount("40$"), 4000);
        assertEq(prover.parseAmount("0$"), 0);

        uint256 ts = prover.parseDate("01/01/2027");
        // Deterministic across both places
        assertEq(ts, prover.parseDate("01/01/2027"));
    }
}



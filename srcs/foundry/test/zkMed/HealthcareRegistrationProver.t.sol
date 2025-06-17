// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {VTest} from "vlayer-0.1.0/testing/VTest.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {UnverifiedEmail, EmailProofLib, VerifiedEmail} from "vlayer-0.1.0/EmailProof.sol";
import {HealthcareRegistrationProver} from "../../src/zkMed/HealthcareRegistrationProver.sol";

contract EmailProofLibWrapper {
    using EmailProofLib for UnverifiedEmail;

    function verify(UnverifiedEmail calldata email) public view returns (VerifiedEmail memory v) {
        return email.verify();
    }
}

contract HealthcareRegistrationProverTest is VTest {
    function getTestEmail(string memory path) public view returns (UnverifiedEmail memory) {
        string memory mime = vm.readFile(path);
        return preverifyEmail(mime);
    }

    function test_verifyHospitalRegistration() public {
        // Create test instances
        EmailProofLibWrapper wrapper = new EmailProofLibWrapper();
        HealthcareRegistrationProver prover = new HealthcareRegistrationProver();
        
        // Get hospital email - note: using the correct Hospital.eml file for hospital registration
        UnverifiedEmail memory email = getTestEmail("testdata/Insurance.eml"); // Fix this path if needed
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);
        
        // Call the prover
        callProver();
        (, HealthcareRegistrationProver.RegistrationData memory regData) = prover.main(email);

        // Verify the extracted data matches expected values
        assertEq(uint256(regData.requestedRole), uint256(HealthcareRegistrationProver.UserType.HOSPITAL));
        assertEq(regData.walletAddress, 0x8B6D5F12D27A8870f9ab437c6f9135ab8EE3DB87);
        assertEq(regData.domain, "onlyfive.it");
        assertEq(regData.organizationName, "City General Hospital");
        assertEq(regData.emailHash, sha256(abi.encodePacked(verifiedEmail.from)));
    }

    function test_verifyInsurerRegistration() public {
        // Create test instances
        EmailProofLibWrapper wrapper = new EmailProofLibWrapper();
        HealthcareRegistrationProver prover = new HealthcareRegistrationProver();
        
        // Get insurer email - note: using the correct Insurance.eml file for insurer registration
        UnverifiedEmail memory email = getTestEmail("testdata/Hospital.eml"); // Fix this path if needed
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);
        
        // Call the prover
        callProver();
        (, HealthcareRegistrationProver.RegistrationData memory regData) = prover.main(email);

        // Verify the extracted data matches expected values
        assertEq(uint256(regData.requestedRole), uint256(HealthcareRegistrationProver.UserType.INSURER));
        assertEq(regData.walletAddress, 0x19dE91Af973F404EDF5B4c093983a7c6E3EC8ccE);
        assertEq(regData.domain, "onlyfive.it");
        assertEq(regData.organizationName, "MediClaims Insurance Group");
        assertEq(regData.emailHash, sha256(abi.encodePacked(verifiedEmail.from)));
    }

    function test_stringToAddress() public {
        HealthcareRegistrationProver prover = new HealthcareRegistrationProver();
        address expected = 0x8B6D5F12D27A8870f9ab437c6f9135ab8EE3DB87;
        address result = prover.stringToAddress("0x8B6D5f12D27A8870f9ab437C6F9135aB8ee3Db87");
        assertEq(result, expected);
    }

    function test_stringToAddressInsurer() public {
        HealthcareRegistrationProver prover = new HealthcareRegistrationProver();
        address expected = 0x19dE91Af973F404EDF5B4c093983a7c6E3EC8ccE;
        address result = prover.stringToAddress("0x19dE91Af973F404EDF5B4c093983a7c6E3EC8ccE");
        assertEq(result, expected);
    }

    function test_revertOnInvalidAddressLength() public {
        HealthcareRegistrationProver prover = new HealthcareRegistrationProver();
        vm.expectRevert("Invalid address length");
        prover.stringToAddress("0x123");
    }

    function test_revertOnInvalidHexCharacter() public {
        HealthcareRegistrationProver prover = new HealthcareRegistrationProver();
        vm.expectRevert("Invalid hex character");
        prover.stringToAddress("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
    }
}
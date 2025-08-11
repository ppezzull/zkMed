// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {VTest} from "vlayer-0.1.0/testing/VTest.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {UnverifiedEmail, EmailProofLib, VerifiedEmail} from "vlayer-0.1.0/EmailProof.sol";
import {zkMedRegistrationProver} from "../../../contracts/zkMed/provers/zkMedRegistrationProver.sol";

contract EmailProofLibWrapper {
    using EmailProofLib for UnverifiedEmail;

    function verify(UnverifiedEmail calldata email) public view returns (VerifiedEmail memory v) {
        return email.verify();
    }
}

contract zkMedRegistrationProverTest is VTest {
    // anvil default wallet 7 for Hospital.eml
    address public hospitalWallet = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955; 
    // anvil default wallet 2 for Insurance.eml
    address public insurerWallet = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; 
    // anvil default wallet 9 for Patient.eml
    address public patientWallet = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720; 

    function getTestEmail(string memory relativePath) public view returns (UnverifiedEmail memory) {
        string memory root = vm.projectRoot();
        string memory fullPath = string.concat(root, "/", relativePath);
        string memory mime = vm.readFile(fullPath);
        return preverifyEmail(mime);
    }

    function test_verifyHospitalRegistration() public {
        // Create test instances
        EmailProofLibWrapper wrapper = new EmailProofLibWrapper();
        zkMedRegistrationProver prover = new zkMedRegistrationProver();
        UnverifiedEmail memory email = getTestEmail("testdata/registration/Hospital.eml"); // Fix this path if needed
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);
        
        // Call the prover
        callProver();
        (, zkMedRegistrationProver.RegistrationData memory regData) = prover.proveOrganizationDomain(email);

        // Verify the extracted data matches expected values
        assertEq(uint256(regData.requestedRole), uint256(zkMedRegistrationProver.UserType.HOSPITAL));
        assertEq(regData.walletAddress, hospitalWallet);
        assertEq(regData.domain, "onlyfive.it");
        assertEq(regData.organizationName, "City General Hospital");
        assertEq(regData.emailHash, sha256(abi.encodePacked(verifiedEmail.from)));
    }

    function test_verifyInsurerRegistration() public {
        // Create test instances
        EmailProofLibWrapper wrapper = new EmailProofLibWrapper();
        zkMedRegistrationProver prover = new zkMedRegistrationProver();
        UnverifiedEmail memory email = getTestEmail("testdata/registration/Insurance.eml"); // Fix this path if needed
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);
        
        // Call the prover
        callProver();
        (, zkMedRegistrationProver.RegistrationData memory regData) = prover.proveOrganizationDomain(email);

        // Verify the extracted data matches expected values
        assertEq(uint256(regData.requestedRole), uint256(zkMedRegistrationProver.UserType.INSURER));
        assertEq(regData.walletAddress, insurerWallet);
        assertEq(regData.domain, "nexthoop.it");
        assertEq(regData.organizationName, "MediClaims Insurance Group");
        assertEq(regData.emailHash, sha256(abi.encodePacked(verifiedEmail.from)));
    }

    function test_verifyPatientRegistration() public {
        // Create test instances
        EmailProofLibWrapper wrapper = new EmailProofLibWrapper();
        zkMedRegistrationProver prover = new zkMedRegistrationProver();
        UnverifiedEmail memory email = getTestEmail("testdata/registration/Patient.eml");
        VerifiedEmail memory verifiedEmail = wrapper.verify(email);
        
        // Call the prover
        callProver();
        (, zkMedRegistrationProver.RegistrationData memory regData) = prover.provePatientEmail(email);

        // Verify the extracted data matches expected values
        assertEq(regData.walletAddress, patientWallet);
        assertEq(regData.emailHash, sha256(abi.encodePacked(verifiedEmail.from)));
    }

    function test_stringToAddress() public {
        zkMedRegistrationProver prover = new zkMedRegistrationProver();
        address expected = hospitalWallet;
        address result = prover.stringToAddress("0x14dC79964da2C08b23698B3D3cc7Ca32193d9955");
        assertEq(result, expected);
    }

    function test_stringToAddressInsurer() public {
        zkMedRegistrationProver prover = new zkMedRegistrationProver();
        address expected = insurerWallet;
        address result = prover.stringToAddress("0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
        assertEq(result, expected);
    }

    function test_revertOnInvalidAddressLength() public {
        zkMedRegistrationProver prover = new zkMedRegistrationProver();
        vm.expectRevert("Invalid address length");
        prover.stringToAddress("0x123");
    }

    function test_revertOnInvalidHexCharacter() public {
        zkMedRegistrationProver prover = new zkMedRegistrationProver();
        vm.expectRevert("Invalid hex character");
        prover.stringToAddress("0xGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGGG");
    }
}
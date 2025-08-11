// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {zkMedRegistrationProver} from "../provers/zkMedRegistrationProver.sol";

library HospitalLib is Verifier {
    struct OrganizationRecord {
        address userAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
        string domain;
        string organizationName;
    }

    struct HospitalState {
        mapping(address => OrganizationRecord) records;
        mapping(bytes32 => bool) usedEmailHashes;
        mapping(string => address) domainToHospital;
        uint256 total;
    }

    function register(
        HospitalState storage hs,
        address hospital,
        bytes32 emailHash,
        string memory domain,
        string memory organizationName
    ) internal {
        require(hospital != address(0), "invalid hospital");
        require(emailHash != bytes32(0), "invalid email");
        require(bytes(domain).length > 0, "invalid domain");
        require(bytes(organizationName).length > 0, "invalid org");
        require(hs.records[hospital].userAddress == address(0), "already registered");
        require(hs.domainToHospital[domain] == address(0), "domain used");
        require(!hs.usedEmailHashes[emailHash], "email used");

        hs.records[hospital] = OrganizationRecord({
            userAddress: hospital,
            emailHash: emailHash,
            registrationTime: block.timestamp,
            isActive: false,
            domain: domain,
            organizationName: organizationName
        });
        hs.usedEmailHashes[emailHash] = true;
        hs.domainToHospital[domain] = hospital;
        hs.total += 1;
    }

    function isRegistered(HospitalState storage hs, address hospital) internal view returns (bool) {
        return hs.records[hospital].userAddress != address(0);
    }

    function setActive(HospitalState storage hs, address hospital) internal {
        require(isRegistered(hs, hospital), "not registered");
        hs.records[hospital].isActive = true;
    }

    function deactivate(HospitalState storage hs, address hospital) internal {
        require(isRegistered(hs, hospital), "not registered");
        hs.records[hospital].isActive = false;
    }

}


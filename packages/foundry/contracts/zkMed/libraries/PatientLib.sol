// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library PatientLib {
    struct PatientRecord {
        address walletAddress;
        bytes32 emailHash;
        uint256 registrationTime;
    }

    struct PatientState {
        mapping(address => PatientRecord) records;
        mapping(bytes32 => bool) usedEmailHashes;
        uint256 total;
    }

    function register(PatientState storage ps, address patient, bytes32 emailHash) internal {
        require(patient != address(0), "invalid patient");
        require(emailHash != bytes32(0), "invalid email");
        require(ps.records[patient].walletAddress == address(0), "already registered");
        require(!ps.usedEmailHashes[emailHash], "email used");

        ps.records[patient] = PatientRecord({
            walletAddress: patient,
            emailHash: emailHash,
            registrationTime: block.timestamp
        });
        ps.usedEmailHashes[emailHash] = true;
        ps.total += 1;
    }

    function isRegistered(PatientState storage ps, address patient) internal view returns (bool) {
        return ps.records[patient].walletAddress != address(0);
    }
}


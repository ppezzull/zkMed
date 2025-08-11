// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library HospitalLib {
    struct OrganizationRecord {
        address userAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
        string domain;
        string organizationName;
        bool isApproved;
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
            organizationName: organizationName,
            isApproved: false
        });
        hs.usedEmailHashes[emailHash] = true;
        hs.domainToHospital[domain] = hospital;
        hs.total += 1;
    }

    function setActive(HospitalState storage hs, address hospital, bool active, bool approved) internal {
        require(hs.records[hospital].userAddress != address(0), "not registered");
        hs.records[hospital].isActive = active;
        hs.records[hospital].isApproved = approved;
    }

    function isRegistered(HospitalState storage hs, address hospital) internal view returns (bool) {
        return hs.records[hospital].userAddress != address(0) && hs.records[hospital].isActive;
    }
}


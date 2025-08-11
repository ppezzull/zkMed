// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

library InsurerLib {
    struct OrganizationRecord {
        address walletAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
        string domain;
        string organizationName;
        bool isApproved;
    }

    struct InsurerState {
        mapping(address => OrganizationRecord) records;
        mapping(string => address) domainToInsurer;
        mapping(bytes32 => bool) usedEmailHashes;
        uint256 total;
    }

    function register(
        InsurerState storage is_,
        address insurer,
        bytes32 emailHash,
        string memory domain,
        string memory organizationName
    ) internal {
        require(insurer != address(0), "invalid insurer");
        require(emailHash != bytes32(0), "invalid email");
        require(bytes(domain).length > 0, "invalid domain");
        require(bytes(organizationName).length > 0, "invalid org");
        require(is_.records[insurer].walletAddress == address(0), "already registered");
        require(is_.domainToInsurer[domain] == address(0), "domain used");
        require(!is_.usedEmailHashes[emailHash], "email used");

        is_.records[insurer] = OrganizationRecord({
            walletAddress: insurer,
            emailHash: emailHash,
            registrationTime: block.timestamp,
            isActive: false,
            domain: domain,
            organizationName: organizationName,
            isApproved: false
        });
        is_.usedEmailHashes[emailHash] = true;
        is_.domainToInsurer[domain] = insurer;
        is_.total += 1;
    }

    function setActive(InsurerState storage is_, address insurer, bool active, bool approved) internal {
        require(is_.records[insurer].walletAddress != address(0), "not registered");
        is_.records[insurer].isActive = active;
        is_.records[insurer].isApproved = approved;
    }

    function isRegistered(InsurerState storage is_, address insurer) internal view returns (bool) {
        return is_.records[insurer].isActive;
    }
}


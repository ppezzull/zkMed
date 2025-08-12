// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

/// @title HospitalRegistry
/// @notice Stores hospital registrations and activation state. Mutations restricted to controller.
contract HospitalRegistry is Verifier, Ownable {
    struct OrganizationRecord {
        address userAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
        string domain;
        string organizationName;
    }

    // Storage
    mapping(address => OrganizationRecord) public records;
    mapping(bytes32 => bool) private usedEmailHashes;
    mapping(string => address) public domainToHospital;
    uint256 public total;

    // Controller allowed to mutate
    address public controller;

    // Prover dependency
    address public immutable organizationProver;

    modifier onlyController() {
        require(msg.sender == controller, "not controller");
        _;
    }

    constructor(address _owner, address _organizationProver) Ownable(_owner) {
        organizationProver = _organizationProver;
    }

    function initializeController(address _controller) external {
        require(controller == address(0), "controller set");
        require(_controller != address(0), "invalid controller");
        controller = _controller;
    }

    function setController(address _controller) external onlyOwner {
        require(_controller != address(0), "invalid controller");
        controller = _controller;
    }

    function register(
        address hospital,
        bytes32 emailHash,
        string calldata domain,
        string calldata organizationName
    ) external onlyController {
        require(hospital != address(0), "invalid hospital");
        require(emailHash != bytes32(0), "invalid email");
        require(bytes(domain).length > 0, "invalid domain");
        require(bytes(organizationName).length > 0, "invalid org");
        require(records[hospital].userAddress == address(0), "already registered");
        require(domainToHospital[domain] == address(0), "domain used");
        require(!usedEmailHashes[emailHash], "email used");

        records[hospital] = OrganizationRecord({
            userAddress: hospital,
            emailHash: emailHash,
            registrationTime: block.timestamp,
            isActive: false,
            domain: domain,
            organizationName: organizationName
        });
        usedEmailHashes[emailHash] = true;
        domainToHospital[domain] = hospital;
        total += 1;
    }

    function isRegistered(address hospital) public view returns (bool) {
        return records[hospital].userAddress != address(0);
    }

    function getTotal() external view returns (uint256) {
        return total;
    }

    function setActive(address hospital) external onlyController {
        require(isRegistered(hospital), "not registered");
        records[hospital].isActive = true;
    }

    function deactivate(address hospital) external onlyController {
        require(isRegistered(hospital), "not registered");
        records[hospital].isActive = false;
    }

    function isActive(address hospital) external view returns (bool) {
        return records[hospital].isActive;
    }
}


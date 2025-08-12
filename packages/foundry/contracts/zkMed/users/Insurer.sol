// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";

/// @title InsurerRegistry
/// @notice Stores insurer registrations and activation state. Mutations restricted to controller.
contract InsurerRegistry is Verifier, Ownable {
    struct OrganizationRecord {
        address walletAddress;
        bytes32 emailHash;
        uint256 registrationTime;
        bool isActive;
        string domain;
        string organizationName;
    }

    // Storage
    mapping(address => OrganizationRecord) public records;
    mapping(string => address) public domainToInsurer;
    mapping(bytes32 => bool) private usedEmailHashes;
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
        address insurer,
        bytes32 emailHash,
        string calldata domain,
        string calldata organizationName
    ) external onlyController {
        require(insurer != address(0), "invalid insurer");
        require(emailHash != bytes32(0), "invalid email");
        require(bytes(domain).length > 0, "invalid domain");
        require(bytes(organizationName).length > 0, "invalid org");
        require(records[insurer].walletAddress == address(0), "already registered");
        require(domainToInsurer[domain] == address(0), "domain used");
        require(!usedEmailHashes[emailHash], "email used");

        records[insurer] = OrganizationRecord({
            walletAddress: insurer,
            emailHash: emailHash,
            registrationTime: block.timestamp,
            isActive: false,
            domain: domain,
            organizationName: organizationName
        });
        usedEmailHashes[emailHash] = true;
        domainToInsurer[domain] = insurer;
        total += 1;
    }

    function isRegistered(address insurer) public view returns (bool) {
        return records[insurer].walletAddress != address(0) && records[insurer].isActive;
    }

    function setActive(address insurer) external onlyController {
        require(isRegistered(insurer), "not registered");
        records[insurer].isActive = true;
    }

    function deactivate(address insurer) external onlyController {
        require(isRegistered(insurer), "not registered");
        records[insurer].isActive = false;
    }

    function isActive(address insurer) external view returns (bool) {
        return records[insurer].isActive;
    }

    function getTotal() external view returns (uint256) {
        return total;
    }
}


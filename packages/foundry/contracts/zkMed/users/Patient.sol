// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import {ChainIdLibrary} from "vlayer-0.1.0/proof_verifier/ChainId.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {zkMedPatientProver} from "../provers/zkMedPatientProver.sol";

/// @title PatientRegistry
/// @notice Stores patient registrations and exposes simple views. Mutations are restricted to a controller (e.g., core).
contract PatientRegistry is Verifier, Ownable {
    struct PatientRecord {
        address walletAddress;
        bytes32 emailHash;
        uint256 registrationTime;
    }

    // Storage
    mapping(address => PatientRecord) private records;
    mapping(bytes32 => bool) private usedEmailHashes;
    uint256 public total;

    // Controller that is allowed to mutate state (usually core)
    address public controller;

    // Provers used in this domain
    address public immutable patientProver;
    address public immutable paymentPlanProver;
    address public immutable claimProver;

    modifier onlyController() {
        require(msg.sender == controller, "not controller");
        _;
    }

    constructor(
        address _owner,
        address _patientProver,
        address _paymentPlanProver,
        address _claimProver
    ) Ownable(_owner) {
        patientProver = _patientProver;
        paymentPlanProver = _paymentPlanProver;
        claimProver = _claimProver;
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

    // ========== Mutations ==========
    function register(
        Proof memory,
        zkMedPatientProver.PatientRegistrationData memory data
    ) external onlyController {
        // TODO: remove this once we need to deploy to mainnet
        if (!ChainIdLibrary.isTestEnv()) {
            _verify(patientProver, zkMedPatientProver.provePatientEmail.selector);
        }
        require(data.walletAddress != address(0), "invalid patient");
        require(data.emailHash != bytes32(0), "invalid email");
        require(records[data.walletAddress].walletAddress == address(0), "already registered");
        require(!usedEmailHashes[data.emailHash], "email used");

        records[data.walletAddress] = PatientRecord({
            walletAddress: data.walletAddress,
            emailHash: data.emailHash,
            registrationTime: block.timestamp
        });
        usedEmailHashes[data.emailHash] = true;
        total += 1;
    }

    // ========== Views ==========
    function isRegistered(address patient) external view returns (bool) {
        return records[patient].walletAddress != address(0);
    }

    function getTotal() external view returns (uint256) {
        return total;
    }
}


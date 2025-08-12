// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IPatientRegistry {
    // Mutations (expected to be restricted to controller/owner)
    function register(address patient, bytes32 emailHash) external;

    // Views
    function isRegistered(address patient) external view returns (bool);
    function getTotal() external view returns (uint256);
}



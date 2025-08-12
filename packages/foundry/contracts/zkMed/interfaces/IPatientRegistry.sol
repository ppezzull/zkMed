// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {zkMedPatientProver} from "../provers/zkMedPatientProver.sol";

interface IPatientRegistry {
    // Mutations (expected to be restricted to controller/owner)
    function register(
        Proof memory proof,
        zkMedPatientProver.PatientRegistrationData memory data
    ) external;

    // Views
    function isRegistered(address patient) external view returns (bool);
    function getTotal() external view returns (uint256);
}



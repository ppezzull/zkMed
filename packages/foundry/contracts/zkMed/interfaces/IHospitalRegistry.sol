// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {zkMedOrganizationProver} from "../provers/zkMedOrganizationProver.sol";

interface IHospitalRegistry {
    function register(
        Proof memory proof,
        zkMedOrganizationProver.OrganizationRegistrationData memory data
    ) external;

    function setActive(address hospital) external;
    function deactivate(address hospital) external;
    function isActive(address hospital) external view returns (bool);

    function isRegistered(address hospital) external view returns (bool);
    function getTotal() external view returns (uint256);
}



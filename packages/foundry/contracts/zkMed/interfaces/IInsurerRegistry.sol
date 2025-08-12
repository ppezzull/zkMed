// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {zkMedOrganizationProver} from "../provers/zkMedOrganizationProver.sol";

interface IInsurerRegistry {
    function register(
        Proof memory proof,
        zkMedOrganizationProver.OrganizationRegistrationData memory data
    ) external;

    function setActive(address insurer) external;
    function deactivate(address insurer) external;
    function isActive(address insurer) external view returns (bool);

    function isRegistered(address insurer) external view returns (bool);
    function getTotal() external view returns (uint256);
}



// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IHospitalRegistry {
    function register(
        address hospital,
        bytes32 emailHash,
        string calldata domain,
        string calldata organizationName
    ) external;

    function setActive(address hospital) external;
    function deactivate(address hospital) external;
    function isActive(address hospital) external view returns (bool);

    function isRegistered(address hospital) external view returns (bool);
    function getTotal() external view returns (uint256);
}



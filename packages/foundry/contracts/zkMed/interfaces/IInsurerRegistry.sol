// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

interface IInsurerRegistry {
    function register(
        address insurer,
        bytes32 emailHash,
        string calldata domain,
        string calldata organizationName
    ) external;

    function setActive(address insurer) external;
    function deactivate(address insurer) external;
    function isActive(address insurer) external view returns (bool);

    function isRegistered(address insurer) external view returns (bool);
    function getTotal() external view returns (uint256);
}



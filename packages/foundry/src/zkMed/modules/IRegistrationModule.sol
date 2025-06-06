// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./RegistrationStorage.sol";

/// @title IRegistrationModule
/// @notice Base interface for all registration modules
interface IRegistrationModule {
    /// @notice Initialize the module with the core contract address
    function initialize(address _core) external;
    
    /// @notice Get the core contract address
    function core() external view returns (address);
} 
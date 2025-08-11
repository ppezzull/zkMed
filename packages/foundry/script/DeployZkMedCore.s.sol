// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "./DeployHelpers.s.sol";
import "../contracts/zkMed/core/zkMedCore.sol";
import "../contracts/zkMed/mocks/MockUSDC.sol";

contract DeployZkMedCore is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        MockUSDC mockUSDC = new MockUSDC();
        new zkMedCore(address(mockUSDC));
    }
}

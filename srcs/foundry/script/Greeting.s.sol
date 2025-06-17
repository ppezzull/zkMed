// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "../src/examples/Greeting.sol";

contract DeployGreeting is Script {
    function run() external {
        // Use default Anvil private key for local development
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the Greeting contract with an initial greeting
        Greeting greeting = new Greeting("Hello from zkMed on Mantle!");

        console.log("Greeting contract deployed to:", address(greeting));
        console.log("Initial greeting:", greeting.getGreeting());
        console.log("Owner:", greeting.owner());

        vm.stopBroadcast();
    }
}
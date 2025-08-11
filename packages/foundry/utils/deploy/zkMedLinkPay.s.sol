// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {zkMedLinkPay} from "../contracts/zkMed/zkMedLinkPay.sol";

/**
 * @title Deploy zkMedLinkPay Contract
 * @notice Deployment script for the Chainlink Automation-based payment contract
 */
contract DeployZkMedLinkPay is Script {
    
    // Default configuration values
    uint256 constant PAYMENT_INTERVAL = 30 days;  // Monthly payments
    
    // Mock addresses for local testing (replace with actual addresses for mainnet)
    address constant MOCK_USDC = 0x07865c6E87B9F70255377e024ace6630C1Eaa37F;  // Goerli USDC
    address constant MOCK_TREASURY = 0x1234567890123456789012345678901234567890;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        require(deployerPrivateKey != 0, "DEPLOYER_PRIVATE_KEY not set");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying zkMedLinkPay with deployer:", deployer);
        console.log("Payment interval:", PAYMENT_INTERVAL);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the contract with actual deployed addresses
        zkMedLinkPay linkPay = new zkMedLinkPay(
            PAYMENT_INTERVAL,
            0x202Fa7479d6fcBa37148009D256Ac2936729e577,  // zkMedCore
            0x852FfA30dBdd64a4893D1cAB9DbA14148Ed3690D,  // zkMedPatient  
            MOCK_USDC,   // Payment token (USDC)
            MOCK_TREASURY // Treasury address
        );
        
        vm.stopBroadcast();
        
        console.log("zkMedLinkPay deployed at:", address(linkPay));
        console.log("Payment token:", MOCK_USDC);
        console.log("Treasury:", MOCK_TREASURY);
        
        // Output deployment info for integration
        console.log("\n=== DEPLOYMENT COMPLETE ===");
        console.log("Contract Address:", address(linkPay));
        console.log("Don't forget to:");
        console.log("1. Update zkMedCore and zkMedPatient addresses");
        console.log("2. Register with Chainlink Automation");
        console.log("3. Fund the contract for automation");
        console.log("4. Update frontend contract addresses");
    }
    
    function deployWithCustomParams(
        uint256 paymentInterval,
        address zkMedCore,
        address zkMedPatient,
        address paymentToken,
        address treasury
    ) external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        zkMedLinkPay linkPay = new zkMedLinkPay(
            paymentInterval,
            zkMedCore,
            zkMedPatient,
            paymentToken,
            treasury
        );
        
        vm.stopBroadcast();
        
        console.log("zkMedLinkPay deployed at:", address(linkPay));
    }
} 
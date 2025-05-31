// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {RegistrationContract} from "../src/zkMed/RegistrationContract.sol";
import {EmailDomainProver} from "../src/zkMed/EmailDomainProver.sol";

/**
 * @title Local Anvil Deployment Script for zkMed Registration System
 * @notice Deploys the complete zkMed registration system for local development
 * @dev Run with: forge script script/DeployLocal.s.sol --rpc-url http://localhost:8545 --broadcast
 */
contract DeployLocalScript is Script {
    
    // Anvil default test accounts
    address constant ANVIL_ACCOUNT_0 = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address constant ANVIL_ACCOUNT_1 = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address constant ANVIL_ACCOUNT_2 = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;
    
    function run() external {
        // Use Anvil's default private key for local development
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        vm.startBroadcast(deployerPrivateKey);
        
        console.log("=== zkMed Local Anvil Deployment ===");
        console.log("Network: Anvil Local");
        console.log("RPC URL: http://localhost:8545");
        console.log("Deployer:", vm.addr(deployerPrivateKey));
        console.log("Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        
        // Deploy EmailDomainProver (vlayer Prover contract)
        console.log("\n1. Deploying EmailDomainProver...");
        EmailDomainProver emailDomainProver = new EmailDomainProver();
        console.log("EmailDomainProver deployed at:", address(emailDomainProver));
        
        // Deploy RegistrationContract (main contract)
        console.log("\n2. Deploying RegistrationContract...");
        RegistrationContract registrationContract = new RegistrationContract(
            address(emailDomainProver)
        );
        console.log("RegistrationContract deployed at:", address(registrationContract));
        
        // Local development setup
        console.log("\n3. Setting up local development environment...");
        
        // Add additional admins for testing
        console.log("Adding test admin accounts...");
        registrationContract.addAdmin(ANVIL_ACCOUNT_1);
        registrationContract.addAdmin(ANVIL_ACCOUNT_2);
        
        console.log("Test admin 1:", ANVIL_ACCOUNT_1);
        console.log("Test admin 2:", ANVIL_ACCOUNT_2);
        
        // Verify deployment
        console.log("\n4. Verifying local deployment...");
        
        // Check EmailDomainProver deployment
        require(address(emailDomainProver).code.length > 0, "EmailDomainProver deployment failed");
        console.log("EmailDomainProver deployed successfully");
        
        // Check RegistrationContract deployment
        require(address(registrationContract).code.length > 0, "RegistrationContract deployment failed");
        require(registrationContract.admin() == vm.addr(deployerPrivateKey), "Admin not set correctly");
        require(registrationContract.emailDomainProver() == address(emailDomainProver), "Prover not set correctly");
        console.log("RegistrationContract deployed successfully");
        
        // Verify admin setup
        require(registrationContract.admins(ANVIL_ACCOUNT_1), "Test admin 1 not added");
        require(registrationContract.admins(ANVIL_ACCOUNT_2), "Test admin 2 not added");
        console.log("Test admins configured successfully");
        
        // Display connection info for local development
        console.log("\n5. Local development setup complete!");
        console.log("=== Contract Addresses ===");
        console.log("EmailDomainProver:", address(emailDomainProver));
        console.log("RegistrationContract:", address(registrationContract));
        
        console.log("\n=== Test Accounts ===");
        console.log("Deployer/Admin:", vm.addr(deployerPrivateKey));
        console.log("Test Admin 1:", ANVIL_ACCOUNT_1);
        console.log("Test Admin 2:", ANVIL_ACCOUNT_2);
        
        console.log("\n=== vlayer Integration ===");
        console.log("vlayer Call Server: http://localhost:3000");
        console.log("vlayer DNS Server: http://localhost:3002");
        console.log("Anvil RPC: http://localhost:8545");
        
        console.log("\n=== Next Steps ===");
        console.log("1. Start vlayer services: docker-compose -f vlayer/docker-compose.devnet.yaml up -d");
        console.log("2. Run email proof: cd vlayer && npx tsx proveEmailDomain.ts");
        console.log("3. Test registration: forge test --match-test testCompletePatientJourney");
        
        vm.stopBroadcast();
    }
    
    /**
     * @notice Helper function to check if local services are ready
     */
    function checkLocalServices() external view {
        console.log("=== Local Services Status ===");
        console.log("Anvil Chain ID:", block.chainid);
        console.log("Block Number:", block.number);
        console.log("Block Timestamp:", block.timestamp);
        
        // Note: In production, we could add HTTP calls to check service health
        // For now, we'll just display the expected endpoints
        console.log("\nExpected Services:");
        console.log("- Anvil L1: http://localhost:8545 (Chain ID: 31337)");
        console.log("- Anvil L2: http://localhost:8546 (Chain ID: 31338)");
        console.log("- vlayer Call Server: http://localhost:3000");
        console.log("- vlayer DNS Server: http://localhost:3002");
    }
}

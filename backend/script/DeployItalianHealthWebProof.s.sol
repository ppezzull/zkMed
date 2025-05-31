// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "../src/zkMed/HealthSystemWebProofProver.sol";
import "../src/zkMed/HealthSystemWebProofVerifier.sol";
import "../src/zkMed/RegistrationContract.sol";

/// @title DeployItalianHealthWebProof
/// @notice Deployment script for Italian health system WebProof integration
contract DeployItalianHealthWebProof is Script {
    
    // Deployment addresses
    address public healthProver;
    address public healthVerifier;
    address public registrationContract;
    
    function setUp() public {}
    
    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);
        
        console.log("Deploying Italian Health System WebProof contracts...");
        console.log("Deployer:", deployer);
        console.log("Deployer balance:", deployer.balance);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Check if RegistrationContract is already deployed
        // You might need to update this address based on your deployment
        address existingRegistration = vm.envOr("REGISTRATION_CONTRACT", address(0));
        
        if (existingRegistration == address(0)) {
            console.log("No existing RegistrationContract found, this deployment requires it");
            console.log("Please deploy RegistrationContract first or set REGISTRATION_CONTRACT env var");
            vm.stopBroadcast();
            return;
        }
        
        registrationContract = existingRegistration;
        console.log("Using existing RegistrationContract:", registrationContract);
        
        // Deploy HealthSystemWebProofProver
        console.log("Deploying HealthSystemWebProofProver...");
        healthProver = address(new HealthSystemWebProofProver());
        console.log("HealthSystemWebProofProver deployed at:", healthProver);
        
        // Deploy HealthSystemWebProofVerifier
        console.log("Deploying HealthSystemWebProofVerifier...");
        healthVerifier = address(new HealthSystemWebProofVerifier(
            healthProver,
            registrationContract
        ));
        console.log("HealthSystemWebProofVerifier deployed at:", healthVerifier);
        
        vm.stopBroadcast();
        
        // Log deployment summary
        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("HealthSystemWebProofProver:", healthProver);
        console.log("HealthSystemWebProofVerifier:", healthVerifier);
        console.log("RegistrationContract (existing):", registrationContract);
        
        // Save deployment addresses to file
        string memory deploymentInfo = string(
            abi.encodePacked(
                "{\n",
                '  "healthProver": "', addressToString(healthProver), '",\n',
                '  "healthVerifier": "', addressToString(healthVerifier), '",\n',
                '  "registrationContract": "', addressToString(registrationContract), '",\n',
                '  "deployer": "', addressToString(deployer), '",\n',
                '  "timestamp": ', vm.toString(block.timestamp), ',\n',
                '  "chainId": ', vm.toString(block.chainid), '\n',
                "}"
            )
        );
        
        vm.writeFile("./deployments/italian-health-webproof.json", deploymentInfo);
        console.log("Deployment info saved to ./deployments/italian-health-webproof.json");
    }
    
    /// @notice Convert address to string
    function addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < 20; i++) {
            str[2 + i * 2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3 + i * 2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
} 
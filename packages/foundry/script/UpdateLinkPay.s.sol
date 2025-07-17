// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {zkMedCore} from "../contracts/zkMed/zkMedCore.sol";
import {zkMedPatient} from "../contracts/zkMed/users/zkMedPatient.sol";

/**
 * @title Update LinkPay Contract Address
 * @notice Updates the LinkPay contract address in the deployed zkMedPatient contract
 */
contract UpdateLinkPay is Script {
    
    // Deployed contract addresses on Base Sepolia
    address constant ZKMED_CORE = 0x202Fa7479d6fcBa37148009D256Ac2936729e577;
    address constant ZKMED_PATIENT = 0x852FfA30dBdd64a4893D1cAB9DbA14148Ed3690D;
    address constant ZKMED_LINKPAY = 0x0EF10af413E5B852CeE08adAFc82FCb452D0afd6;
    
    function run() external {
        uint256 deployerPrivateKey = vm.envOr("DEPLOYER_PRIVATE_KEY", uint256(0));
        require(deployerPrivateKey != 0, "DEPLOYER_PRIVATE_KEY not set");
        
        console.log("Updating LinkPay contract address...");
        console.log("zkMedCore:", ZKMED_CORE);
        console.log("zkMedPatient:", ZKMED_PATIENT);
        console.log("zkMedLinkPay:", ZKMED_LINKPAY);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Get the zkMedCore contract
        zkMedCore core = zkMedCore(ZKMED_CORE);
        
        // Call updateLinkPayContract through zkMedCore
        // Note: This will call the zkMedPatient contract with onlyCore modifier
        core.updatePatientLinkPayContract(ZKMED_LINKPAY);
        
        vm.stopBroadcast();
        
        console.log("SUCCESS: LinkPay contract address updated successfully!");
        console.log("zkMedPatient now connected to zkMedLinkPay at:", ZKMED_LINKPAY);
    }
} 
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Script, console} from "forge-std/Script.sol";
import {EmailDomainProver} from "../src/zkMed/EmailDomainProver.sol";
import {RegistrationContract} from "../src/zkMed/RegistrationContract.sol";

contract DeployRegistration is Script {
    EmailDomainProver public emailDomainProver;
    RegistrationContract public registrationContract;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        // Deploy EmailDomainProver first
        emailDomainProver = new EmailDomainProver();
        console.log("EmailDomainProver deployed to:", address(emailDomainProver));

        // Deploy RegistrationContract with EmailDomainProver address
        registrationContract = new RegistrationContract(address(emailDomainProver));
        console.log("RegistrationContract deployed to:", address(registrationContract));

        vm.stopBroadcast();

        // Log deployment summary
        console.log("\n=== Deployment Summary ===");
        console.log("EmailDomainProver:", address(emailDomainProver));
        console.log("RegistrationContract:", address(registrationContract));
        console.log("Owner:", msg.sender);
        
        // Log deployment info for frontend integration
        console.log("\n=== Frontend Integration ===");
        console.log("Add these addresses to your environment:");
        console.log("NEXT_PUBLIC_REGISTRATION_CONTRACT=", address(registrationContract));
        console.log("NEXT_PUBLIC_EMAIL_DOMAIN_PROVER=", address(emailDomainProver));
    }
} 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "forge-std/Script.sol";
import "./DeployHelpers.s.sol";
import "../contracts/zkMed/core/zkMedCore.sol";
import "../contracts/zkMed/mocks/MockUSDC.sol";
import "../contracts/zkMed/provers/zkMedOrganizationProver.sol";
import "../contracts/zkMed/provers/zkMedPatientProver.sol";
import "../contracts/zkMed/provers/zkMedPaymentPlanProver.sol";
import "../contracts/zkMed/provers/zkMedClaimProver.sol";

contract DeployZkMedCore is ScaffoldETHDeploy {
    function run() external ScaffoldEthDeployerRunner {
        MockUSDC mockUSDC = new MockUSDC();
        zkMedOrganizationProver organizationProver = new zkMedOrganizationProver();
        zkMedPatientProver patientProver = new zkMedPatientProver();
        zkMedPaymentPlanProver paymentPlanProver = new zkMedPaymentPlanProver();
        zkMedClaimProver claimProver = new zkMedClaimProver();
        new zkMedCore(
            address(mockUSDC), 
            address(organizationProver), 
            address(patientProver), 
            address(paymentPlanProver),
            address(claimProver)
        );
    }
}

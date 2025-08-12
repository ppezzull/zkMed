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
import "../contracts/zkMed/users/Patient.sol";
import "../contracts/zkMed/users/Hospital.sol";
import "../contracts/zkMed/users/Insurer.sol";

contract DeployZkMedCore is ScaffoldETHDeploy {
    zkMedCore public zkMedCoreDeployed;

    function run() external ScaffoldEthDeployerRunner {
        // 1) Deploy assets and provers
        MockUSDC mockUSDC = new MockUSDC();
        zkMedOrganizationProver organizationProver = new zkMedOrganizationProver();
        zkMedPatientProver patientProver = new zkMedPatientProver();
        zkMedPaymentPlanProver paymentPlanProver = new zkMedPaymentPlanProver();
        zkMedClaimProver claimProver = new zkMedClaimProver();

        // 2) Deploy registries (converted from libraries)
        PatientRegistry patientRegistry = new PatientRegistry({
            _owner: msg.sender,
            _patientProver: address(patientProver),
            _paymentPlanProver: address(paymentPlanProver),
            _claimProver: address(claimProver)
        });
        HospitalRegistry hospitalRegistry = new HospitalRegistry({
            _owner: msg.sender,
            _organizationProver: address(organizationProver)
        });
        InsurerRegistry insurerRegistry = new InsurerRegistry({
            _owner: msg.sender,
            _organizationProver: address(organizationProver)
        });

        // 3) Deploy core pointing to registries
        zkMedCore core = new zkMedCore(
            address(mockUSDC),
            address(patientRegistry),
            address(hospitalRegistry),
            address(insurerRegistry)
        );
        zkMedCoreDeployed = core;

        // 4) Wire controller permissions to core
        patientRegistry.setController(address(core));
        hospitalRegistry.setController(address(core));
        insurerRegistry.setController(address(core));

        // 5) Record named deployments
        deployments.push(Deployment({name: "MockUSDC", addr: address(mockUSDC)}));
        deployments.push(Deployment({name: "zkMedOrganizationProver", addr: address(organizationProver)}));
        deployments.push(Deployment({name: "zkMedPatientProver", addr: address(patientProver)}));
        deployments.push(Deployment({name: "zkMedPaymentPlanProver", addr: address(paymentPlanProver)}));
        deployments.push(Deployment({name: "zkMedClaimProver", addr: address(claimProver)}));
        deployments.push(Deployment({name: "PatientRegistry", addr: address(patientRegistry)}));
        deployments.push(Deployment({name: "HospitalRegistry", addr: address(hospitalRegistry)}));
        deployments.push(Deployment({name: "InsurerRegistry", addr: address(insurerRegistry)}));
        deployments.push(Deployment({name: "zkMedCore", addr: address(core)}));
    }
}

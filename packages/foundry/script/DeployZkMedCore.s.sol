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
        // 1) Determine EOA to use as owner for Ownable registries
        (, address eoa,) = vm.readCallers();

        // 2) Deploy assets and provers
        MockUSDC mockUSDC = new MockUSDC();
        zkMedOrganizationProver organizationProver = new zkMedOrganizationProver();
        zkMedPatientProver patientProver = new zkMedPatientProver();
        zkMedPaymentPlanProver paymentPlanProver = new zkMedPaymentPlanProver();
        zkMedClaimProver claimProver = new zkMedClaimProver();

        // 3) Deploy registries with the EOA as owner (so subsequent calls come from the authorized account)
        PatientRegistry patientRegistry = new PatientRegistry({
            _owner: eoa,
            _patientProver: address(patientProver),
            _paymentPlanProver: address(paymentPlanProver),
            _claimProver: address(claimProver)
        });
        HospitalRegistry hospitalRegistry = new HospitalRegistry({
            _owner: eoa,
            _organizationProver: address(organizationProver)
        });
        InsurerRegistry insurerRegistry = new InsurerRegistry({
            _owner: eoa,
            _organizationProver: address(organizationProver)
        });

        // 4) Deploy core pointing to registries (owner will be the EOA due to broadcast)
        zkMedCore core = new zkMedCore(
            address(mockUSDC),
            address(patientRegistry),
            address(hospitalRegistry),
            address(insurerRegistry)
        );
        zkMedCoreDeployed = core;

        // 5) Wire controller permissions to core (EOA is owner of registries, so this will succeed)
        patientRegistry.setController(address(core));
        hospitalRegistry.setController(address(core));
        insurerRegistry.setController(address(core));
    }
}

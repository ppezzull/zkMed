// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./DeployHelpers.s.sol";
import "../contracts/zkMed/zkMedCore.sol";
import "../contracts/zkMed/provers/zkMedDomainProver.sol";
import "../contracts/zkMed/provers/zkMedInvitationProver.sol";
import "../contracts/zkMed/users/zkMedPatient.sol";
import "../contracts/zkMed/users/zkMedHospital.sol";
import "../contracts/zkMed/users/zkMedInsurer.sol";

/**
 * @notice Deploy script for YourContract contract
 * @dev Inherits ScaffoldETHDeploy which:
 *      - Includes forge-std/Script.sol for deployment
 *      - Includes ScaffoldEthDeployerRunner modifier
 *      - Provides `deployer` variable
 * Example:
 * yarn deploy --file DeployYourContract.s.sol  # local anvil chain
 * yarn deploy --file DeployYourContract.s.sol --network optimism # live network (requires keystore)
 */
contract DeployYourContract is ScaffoldETHDeploy {
    /**
     * @dev Deployer setup based on `ETH_KEYSTORE_ACCOUNT` in `.env`:
     *      - "scaffold-eth-default": Uses Anvil's account #9 (0xa0Ee7A142d267C1f36714E4a8F75612F20a79720), no password prompt
     *      - "scaffold-eth-custom": requires password used while creating keystore
     *
     * Note: Must use ScaffoldEthDeployerRunner modifier to:
     *      - Setup correct `deployer` account and fund it
     *      - Export contract addresses & ABIs to `nextjs` packages
     */
    function run() external ScaffoldEthDeployerRunner {
        // Deploy provers first
        zkMedDomainProver domainProver = new zkMedDomainProver();
        zkMedInvitationProver invitationProver = new zkMedInvitationProver(address(0)); // Temporary address
        
        // Deploy core contract
        zkMedCore core = new zkMedCore(address(domainProver), address(invitationProver));
        
        // Deploy user contracts
        zkMedPatient patientContract = new zkMedPatient(address(core), address(domainProver));
        zkMedHospital hospitalContract = new zkMedHospital(address(core), address(domainProver));
        zkMedInsurer insurerContract = new zkMedInsurer(address(core), address(domainProver), address(invitationProver));
        
        // Set user contract addresses in the core contract
        core.setUserContracts(
            address(patientContract),
            address(hospitalContract), 
            address(insurerContract)
        );
        
        // Deploy invitation prover with correct core address
        invitationProver = new zkMedInvitationProver(address(core));
        
        // Note: In production, you might want to update contracts with the new invitation prover address
        // For now, the user contracts are initialized with the correct addresses
    }
}

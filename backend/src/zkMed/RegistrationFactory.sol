// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import "./modules/RegistrationStorage.sol";
import "./modules/PatientModule.sol";
import "./modules/OrganizationModule.sol";
import "./modules/AdminModule.sol";
import "./RegistrationContract.sol";

/// @title RegistrationFactory
/// @notice Factory contract to deploy registration system components
contract RegistrationFactory {
    
    event RegistrationSystemDeployed(
        address indexed deployer,
        address registrationContract,
        address storageContract,
        address patientModule,
        address organizationModule,
        address adminModule
    );
    
    struct DeploymentAddresses {
        address registrationContract;
        address storageContract;
        address patientModule;
        address organizationModule;
        address adminModule;
    }
    
    /// @notice Deploy the complete registration system
    /// @param _emailDomainProver Address of the email domain prover contract
    /// @return addresses Struct containing all deployed contract addresses
    function deployRegistrationSystem(address _emailDomainProver) 
        external 
        returns (DeploymentAddresses memory addresses) 
    {
        // Deploy storage contract
        RegistrationStorage storageContract = new RegistrationStorage();
        
        // Deploy modules
        PatientModule patientModule = new PatientModule(address(storageContract));
        OrganizationModule organizationModule = new OrganizationModule(address(storageContract), _emailDomainProver);
        AdminModule adminModule = new AdminModule(address(storageContract));
        
        // Deploy main registration contract
        RegistrationContract registrationContract = new RegistrationContract(
            _emailDomainProver,
            address(storageContract),
            address(patientModule),
            address(organizationModule),
            address(adminModule)
        );
        
        // Initialize modules
        patientModule.initialize(address(registrationContract));
        organizationModule.initialize(address(registrationContract));
        adminModule.initialize(address(registrationContract));
        
        // Authorize modules in storage
        storageContract.authorizeModule(address(patientModule));
        storageContract.authorizeModule(address(organizationModule));
        storageContract.authorizeModule(address(adminModule));
        storageContract.authorizeModule(address(registrationContract));
        
        // Transfer storage ownership to registration contract
        storageContract.transferOwnership(address(registrationContract));
        
        addresses = DeploymentAddresses({
            registrationContract: address(registrationContract),
            storageContract: address(storageContract),
            patientModule: address(patientModule),
            organizationModule: address(organizationModule),
            adminModule: address(adminModule)
        });
        
        emit RegistrationSystemDeployed(
            msg.sender,
            addresses.registrationContract,
            addresses.storageContract,
            addresses.patientModule,
            addresses.organizationModule,
            addresses.adminModule
        );
    }
} 
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Verifier} from "vlayer-0.1.0/Verifier.sol";
import "./IRegistrationModule.sol";
import "./RegistrationStorage.sol";
import "../EmailDomainProver.sol";

/// @title OrganizationModule
/// @notice Handles organization registration and domain verification
contract OrganizationModule is IRegistrationModule, Verifier {
    
    RegistrationStorage public immutable storageContract;
    address public core;
    address public emailDomainProver;
    
    // ============ EVENTS ============
    
    event OrganizationRegistered(
        address indexed organization,
        string indexed domain,
        string name,
        RegistrationStorage.Role role,
        uint256 timestamp
    );
    
    event EmailProofVerified(
        address indexed organization,
        string domain,
        bytes32 emailHash,
        uint256 timestamp
    );
    
    event DomainVerified(
        address indexed user,
        string domain,
        bytes32 emailHash,
        uint256 timestamp
    );
    
    // ============ MODIFIERS ============
    
    modifier onlyCore() {
        require(msg.sender == core, "Only core contract");
        _;
    }
    
    modifier notRegistered(address _user) {
        require(storageContract.roles(_user) == RegistrationStorage.Role.None, "Already registered");
        _;
    }
    
    modifier validDomain(string calldata _domain) {
        require(bytes(_domain).length > 0, "Domain cannot be empty");
        require(storageContract.domainToAddress(_domain) == address(0), "Domain already registered");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(address _storage, address _emailDomainProver) {
        storageContract = RegistrationStorage(_storage);
        emailDomainProver = _emailDomainProver;
    }
    
    // ============ INITIALIZATION ============
    
    function initialize(address _core) external override {
        require(core == address(0), "Already initialized");
        core = _core;
    }
    
    // ============ ORGANIZATION REGISTRATION ============
    
    /// @notice Verify domain ownership using vlayer email proof
    /// @param emailHash Hash of the verified email address
    /// @param targetWallet The wallet address from the email subject
    /// @param domain The verified domain
    function verifyDomainOwnership(
        Proof calldata,
        bytes32 emailHash,
        address targetWallet,
        string calldata domain
    ) external 
        onlyCore
        notRegistered(targetWallet)
        validDomain(domain)
        onlyVerified(emailDomainProver, EmailDomainProver.verifyDomainOwnership.selector)
    {
        require(!storageContract.usedEmailHashes(emailHash), "Email hash already used");
        
        // Mark email as used and reserve domain
        storageContract.setUsedEmailHash(emailHash, true);
        storageContract.setDomainToAddress(domain, targetWallet);
        storageContract.setEmailHashToAddress(emailHash, targetWallet);
        
        emit DomainVerified(targetWallet, domain, emailHash, block.timestamp);
    }
    
    /// @notice Complete organization registration after domain verification
    /// @param organization The organization address
    /// @param organizationName The name of the organization
    /// @param domain The pre-verified domain
    /// @param _role The organization role (Hospital or Insurer)
    function completeOrganizationRegistration(
        address organization,
        string calldata organizationName,
        string calldata domain,
        RegistrationStorage.Role _role
    ) external onlyCore notRegistered(organization) {
        require(storageContract.domainToAddress(domain) == organization, "Domain not verified for this address");
        require(_role == RegistrationStorage.Role.Hospital || _role == RegistrationStorage.Role.Insurer, "Invalid organization role");
        require(bytes(organizationName).length > 0, "Organization name cannot be empty");
        
        // Create organization struct
        RegistrationStorage.Organization memory org = RegistrationStorage.Organization({
            name: organizationName,
            domain: domain,
            role: _role,
            registrationTimestamp: block.timestamp,
            verified: true,
            emailHash: bytes32(0) // Will be set by domain verification
        });
        
        // Register the organization
        storageContract.setOrganization(organization, org);
        storageContract.setRole(organization, _role);
        storageContract.setVerified(organization, true);
        storageContract.setActiveUser(organization, true);
        storageContract.setRegistrationTimestamp(organization, block.timestamp);
        
        emit OrganizationRegistered(
            organization,
            domain,
            organizationName,
            _role,
            block.timestamp
        );
    }
    
    /// @notice Single-step organization registration with complete email proof
    /// @param orgData Complete organization verification data
    /// @param _role The organization role (Hospital or Insurer)
    function registerOrganization(
        Proof calldata,
        OrganizationVerificationData calldata orgData,
        RegistrationStorage.Role _role
    ) external 
        onlyCore
        notRegistered(orgData.targetWallet)
        validDomain(orgData.domain)
        onlyVerified(emailDomainProver, EmailDomainProver.verifyOrganization.selector)
    {
        require(_role == RegistrationStorage.Role.Hospital || _role == RegistrationStorage.Role.Insurer, "Invalid organization role");
        require(bytes(orgData.name).length > 0, "Organization name cannot be empty");
        require(!storageContract.usedEmailHashes(orgData.emailHash), "Email hash already used");
        
        // Mark email as used
        storageContract.setUsedEmailHash(orgData.emailHash, true);
        
        // Create organization struct
        RegistrationStorage.Organization memory org = RegistrationStorage.Organization({
            name: orgData.name,
            domain: orgData.domain,
            role: _role,
            registrationTimestamp: block.timestamp,
            verified: true,
            emailHash: orgData.emailHash
        });
        
        // Register the organization
        storageContract.setOrganization(orgData.targetWallet, org);
        storageContract.setRole(orgData.targetWallet, _role);
        storageContract.setVerified(orgData.targetWallet, true);
        storageContract.setActiveUser(orgData.targetWallet, true);
        storageContract.setRegistrationTimestamp(orgData.targetWallet, block.timestamp);
        
        // Reserve the domain and email
        storageContract.setDomainToAddress(orgData.domain, orgData.targetWallet);
        storageContract.setEmailHashToAddress(orgData.emailHash, orgData.targetWallet);
        
        emit OrganizationRegistered(
            orgData.targetWallet,
            orgData.domain,
            orgData.name,
            _role,
            block.timestamp
        );
        emit EmailProofVerified(orgData.targetWallet, orgData.domain, orgData.emailHash, block.timestamp);
    }
    
    /// @notice Simple domain verification for backward compatibility
    /// @param domain The verified domain
    /// @param emailHash Hash of the verified email
    /// @param targetWallet The target wallet address
    function verifyAndStoreURL(
        Proof calldata,
        string calldata domain,
        bytes32 emailHash,
        address targetWallet
    ) external 
        onlyCore
        notRegistered(targetWallet)
        validDomain(domain)
        onlyVerified(emailDomainProver, EmailDomainProver.simpleDomainVerification.selector)
    {
        require(!storageContract.usedEmailHashes(emailHash), "Email hash already used");
        
        // Mark email as used and reserve domain
        storageContract.setUsedEmailHash(emailHash, true);
        storageContract.setDomainToAddress(domain, targetWallet);
        storageContract.setEmailHashToAddress(emailHash, targetWallet);
        
        emit DomainVerified(targetWallet, domain, emailHash, block.timestamp);
    }
} 
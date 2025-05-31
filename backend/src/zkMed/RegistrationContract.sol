// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Ownable} from "openzeppelin-contracts/access/Ownable.sol";
import {EmailDomainProver, OrganizationVerificationData} from "./EmailDomainProver.sol";
import "./modules/RegistrationStorage.sol";
import "./modules/PatientModule.sol";
import "./modules/OrganizationModule.sol";
import "./modules/AdminModule.sol";

/// @title RegistrationContract
/// @notice Lightweight proxy contract that coordinates pre-deployed registration modules
contract RegistrationContract is Ownable {
    
    // ============ TYPES ============
    
    enum Role { None, Patient, Hospital, Insurer, Admin }
    
    struct Organization {
        string name;
        string domain;
        Role role;
        uint256 registrationTimestamp;
        bool verified;
        bytes32 emailHash;
    }
    
    // ============ STATE VARIABLES ============
    
    RegistrationStorage public immutable storageContract;
    PatientModule public immutable patientModule;
    OrganizationModule public immutable organizationModule;
    AdminModule public immutable adminModule;
    address public emailDomainProver;
    
    // ============ EVENTS ============
    
    event PatientRegistered(address indexed patient, bytes32 indexed commitment, uint256 timestamp);
    event OrganizationRegistered(address indexed organization, string indexed domain, string name, Role role, uint256 timestamp);
    event EmailProofVerified(address indexed organization, string domain, bytes32 emailHash, uint256 timestamp);
    event DomainVerified(address indexed user, string domain, bytes32 emailHash, uint256 timestamp);
    event RoleAssigned(address indexed user, Role role, uint256 timestamp);
    event VerificationStatusChanged(address indexed user, bool verified, uint256 timestamp);
    event AdminAdded(address indexed admin);
    event AdminRemoved(address indexed admin);
    event OwnerAdded(address indexed newOwner, address indexed addedBy);
    event OwnerRemoved(address indexed removedOwner, address indexed removedBy);
    event UserActivated(address indexed user, address indexed activatedBy);
    event UserDeactivated(address indexed user, address indexed deactivatedBy);
    event OwnershipTransferRequested(address indexed currentOwner, address indexed newOwner);
    
    // ============ MODIFIERS ============
    
    modifier onlyRole(Role _role) {
        require(_convertToStorageRole(storageContract.roles(msg.sender)) == _role, "Unauthorized role");
        require(storageContract.verified(msg.sender), "Address not verified");
        require(storageContract.activeUsers(msg.sender), "User deactivated");
        _;
    }
    
    modifier onlyOwners() {
        require(storageContract.owners(msg.sender), "Not an owner");
        _;
    }
    
    modifier onlyAdminOrOwner() {
        require(storageContract.admins(msg.sender) || storageContract.owners(msg.sender), "Not admin or owner");
        _;
    }
    
    modifier onlyActiveUser() {
        require(storageContract.activeUsers(msg.sender), "User deactivated");
        _;
    }
    
    modifier notRegistered() {
        require(storageContract.roles(msg.sender) == RegistrationStorage.Role.None, "Already registered");
        _;
    }
    
    modifier validCommitment(bytes32 _commitment) {
        require(_commitment != bytes32(0), "Invalid commitment");
        _;
    }
    
    modifier validDomain(string calldata _domain) {
        require(bytes(_domain).length > 0, "Domain cannot be empty");
        require(storageContract.domainToAddress(_domain) == address(0), "Domain already registered");
        _;
    }
    
    // ============ CONSTRUCTOR ============
    
    constructor(
        address _emailDomainProver,
        address _storageContract,
        address _patientModule,
        address _organizationModule,
        address _adminModule
    ) Ownable(msg.sender) {
        emailDomainProver = _emailDomainProver;
        storageContract = RegistrationStorage(_storageContract);
        patientModule = PatientModule(_patientModule);
        organizationModule = OrganizationModule(_organizationModule);
        adminModule = AdminModule(_adminModule);
        
        // Initial setup will be done by the deployment script after authorization
    }
    
    // ============ ROLE CONVERSION UTILITIES ============
    
    function _convertToStorageRole(RegistrationStorage.Role _storageRole) internal pure returns (Role) {
        if (_storageRole == RegistrationStorage.Role.None) return Role.None;
        if (_storageRole == RegistrationStorage.Role.Patient) return Role.Patient;
        if (_storageRole == RegistrationStorage.Role.Hospital) return Role.Hospital;
        if (_storageRole == RegistrationStorage.Role.Insurer) return Role.Insurer;
        if (_storageRole == RegistrationStorage.Role.Admin) return Role.Admin;
        return Role.None;
    }
    
    function _convertFromRole(Role _role) internal pure returns (RegistrationStorage.Role) {
        if (_role == Role.None) return RegistrationStorage.Role.None;
        if (_role == Role.Patient) return RegistrationStorage.Role.Patient;
        if (_role == Role.Hospital) return RegistrationStorage.Role.Hospital;
        if (_role == Role.Insurer) return RegistrationStorage.Role.Insurer;
        if (_role == Role.Admin) return RegistrationStorage.Role.Admin;
        return RegistrationStorage.Role.None;
    }
    
    // ============ PATIENT REGISTRATION ============
    
    function registerPatient(bytes32 _commitment) 
        external 
        notRegistered 
        validCommitment(_commitment) 
    {
        patientModule.registerPatient(msg.sender, _commitment);
        emit RoleAssigned(msg.sender, Role.Patient, block.timestamp);
    }
    
    function verifyPatientCommitment(string memory _secret) external view returns (bool) {
        return patientModule.verifyPatientCommitment(msg.sender, _secret);
    }
    
    // ============ ORGANIZATION REGISTRATION ============
    
    function verifyDomainOwnership(
        Proof calldata proof,
        bytes32 emailHash,
        address targetWallet,
        string calldata domain
    ) external notRegistered validDomain(domain) {
        organizationModule.verifyDomainOwnership(proof, emailHash, targetWallet, domain);
    }
    
    function completeOrganizationRegistration(
        string calldata organizationName,
        string calldata domain,
        Role _role
    ) external notRegistered {
        organizationModule.completeOrganizationRegistration(msg.sender, organizationName, domain, _convertFromRole(_role));
        emit RoleAssigned(msg.sender, _role, block.timestamp);
    }
    
    function registerOrganization(
        Proof calldata proof, 
        OrganizationVerificationData calldata orgData,
        Role _role
    ) external notRegistered validDomain(orgData.domain) {
        organizationModule.registerOrganization(proof, orgData, _convertFromRole(_role));
        emit RoleAssigned(orgData.targetWallet, _role, block.timestamp);
    }
    
    function verifyAndStoreURL(
        Proof calldata proof,
        string calldata domain,
        bytes32 emailHash
    ) external notRegistered validDomain(domain) {
        organizationModule.verifyAndStoreURL(proof, domain, emailHash, msg.sender);
    }
    
    // ============ ADMIN FUNCTIONS - Delegated to AdminModule ============
    
    function addOwner(address _newOwner) external {
        adminModule.addOwner(_newOwner);
    }
    
    function removeOwner(address _owner) external {
        adminModule.removeOwner(_owner);
    }
    
    function activateUser(address _user) external {
        adminModule.activateUser(_user);
    }
    
    function deactivateUser(address _user) external {
        adminModule.deactivateUser(_user);
    }
    
    function batchActivateUsers(address[] calldata _users) external {
        adminModule.batchActivateUsers(_users);
    }
    
    function batchDeactivateUsers(address[] calldata _users) external {
        adminModule.batchDeactivateUsers(_users);
    }
    
    function addAdmin(address _newAdmin) external {
        adminModule.addAdmin(_newAdmin);
    }
    
    function removeAdmin(address _admin) external {
        adminModule.removeAdmin(_admin);
    }
    
    function updateVerificationStatus(address _user, bool _verified) external {
        adminModule.updateVerificationStatus(_user, _verified);
    }
    
    function resetEmailHash(bytes32 _emailHash) external {
        adminModule.resetEmailHash(_emailHash);
    }
    
    // ============ VIEW FUNCTIONS ============
    
    function getUserRegistration(address _user) external view returns (
        Role role,
        bool isVerified,
        uint256 timestamp,
        string memory organizationName,
        string memory domain
    ) {
        role = _convertToStorageRole(storageContract.roles(_user));
        isVerified = storageContract.verified(_user);
        timestamp = storageContract.registrationTimestamps(_user);
        
        if (role == Role.Hospital || role == Role.Insurer) {
            (organizationName, domain, , , , ) = storageContract.organizations(_user);
        }
    }
    
    function isUserVerified(address _user) external view returns (bool) {
        return storageContract.isUserVerified(_user);
    }
    
    function isUserActive(address _user) external view returns (bool) {
        return storageContract.isUserActive(_user);
    }
    
    function getUserActivationStatus(address _user) external view returns (bool isActive, uint256 deactivatedAt) {
        return adminModule.getUserActivationStatus(_user);
    }
    
    function getOrganization(address _organization) external view returns (Organization memory) {
        (string memory name, string memory domain, RegistrationStorage.Role storageRole, uint256 timestamp, bool isVerified, bytes32 emailHash) = storageContract.organizations(_organization);
        return Organization({
            name: name,
            domain: domain,
            role: _convertToStorageRole(storageRole),
            registrationTimestamp: timestamp,
            verified: isVerified,
            emailHash: emailHash
        });
    }
    
    function isDomainRegistered(string calldata _domain) external view returns (bool) {
        return storageContract.domainToAddress(_domain) != address(0);
    }
    
    function getDomainOwner(string calldata _domain) external view returns (address) {
        return storageContract.domainToAddress(_domain);
    }
    
    function isEmailHashUsed(bytes32 _emailHash) external view returns (bool) {
        return storageContract.usedEmailHashes(_emailHash);
    }
    
    function getEmailHashOwner(bytes32 _emailHash) external view returns (address) {
        return storageContract.emailHashToAddress(_emailHash);
    }
    
    function getOwners() external view returns (address[] memory) {
        return adminModule.getOwners();
    }
    
    function isOwner(address _address) external view returns (bool) {
        return adminModule.isOwner(_address);
    }
    
    // ============ COMPATIBILITY MAPPINGS ============
    
    function admin() external view returns (address) {
        return owner();
    }
    
    function admins(address _admin) external view returns (bool) {
        return storageContract.admins(_admin);
    }
    
    function owners(address _owner) external view returns (bool) {
        return storageContract.owners(_owner);
    }
    
    function roles(address _user) external view returns (Role) {
        return _convertToStorageRole(storageContract.roles(_user));
    }
    
    function verified(address _user) external view returns (bool) {
        return storageContract.verified(_user);
    }
    
    function activeUsers(address _user) external view returns (bool) {
        return storageContract.activeUsers(_user);
    }
    
    function deactivationTimestamp(address _user) external view returns (uint256) {
        return storageContract.deactivationTimestamp(_user);
    }
    
    function patientCommitments(address _patient) external view returns (bytes32) {
        return storageContract.patientCommitments(_patient);
    }
    
    function organizations(address _org) external view returns (
        string memory name,
        string memory domain,
        Role role,
        uint256 registrationTimestamp,
        bool isVerified,
        bytes32 emailHash
    ) {
        RegistrationStorage.Role storageRole;
        (name, domain, storageRole, registrationTimestamp, isVerified, emailHash) = storageContract.organizations(_org);
        role = _convertToStorageRole(storageRole);
    }
    
    function domainToAddress(string calldata _domain) external view returns (address) {
        return storageContract.domainToAddress(_domain);
    }
    
    function emailHashToAddress(bytes32 _emailHash) external view returns (address) {
        return storageContract.emailHashToAddress(_emailHash);
    }
    
    function usedEmailHashes(bytes32 _emailHash) external view returns (bool) {
        return storageContract.usedEmailHashes(_emailHash);
    }
    
    function registrationTimestamps(address _user) external view returns (uint256) {
        return storageContract.registrationTimestamps(_user);
    }
    
    // ============ VERIFIER COMPATIBILITY ============
    
    function verifier() external view returns (address) {
        return address(organizationModule);
    }
    
    function _setTestVerifier(address /* newVerifier */) external pure {
        // Removed for production security
        revert("Test functions removed for production");
    }
} 
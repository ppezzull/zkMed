// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {VTest} from "vlayer-0.1.0/testing/VTest.sol";
import {HealthcareRegistration} from "../../src/zkMed/HealthcareRegistration.sol";
import {HealthcareRegistrationProver} from "../../src/zkMed/HealthcareRegistrationProver.sol";
import {Proof} from "vlayer-0.1.0/Proof.sol";
import {UnverifiedEmail, EmailProofLib, VerifiedEmail} from "vlayer-0.1.0/EmailProof.sol";

contract HealthcareRegistrationTest is VTest {
    HealthcareRegistration public registration;
    HealthcareRegistrationProver public prover;
    
    address public admin;
    address public patient1;
    address public patient2;
    address public hospital1;
    address public insurer1;
    address public hospitalWallet;
    address public insurerWallet;
    
    function initialize() public {
        admin = address(this);
        patient1 = vm.addr(1);
        patient2 = vm.addr(2);
        hospital1 = vm.addr(3);
        insurer1 = vm.addr(4);
        hospitalWallet = 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955; // From Hospital.eml
        insurerWallet = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8; // From Insurance.eml
        
        prover = new HealthcareRegistrationProver();
        registration = new HealthcareRegistration(address(prover));
    }

    function getTestEmail(string memory path) public view returns (UnverifiedEmail memory) {
        string memory mime = vm.readFile(path);
        return preverifyEmail(mime);
    }

    // ======== Patient Registration Tests ========

    function test_registerPatient() public {
        initialize();
        registration.registerPatient(patient1);
        
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isUserRegistered(patient1));
        assertEq(uint256(registration.getUserType(patient1)), uint256(HealthcareRegistration.UserType.PATIENT));
        
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 1);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_registerMultiplePatients() public {
        initialize();
        registration.registerPatient(patient1);
        registration.registerPatient(patient2);
        
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isPatient(patient2));
        
        (uint256 totalUsers, uint256 patients,,) = registration.getRegistrationStats();
        assertEq(totalUsers, 2);
        assertEq(patients, 2);
    }

    function test_revertPatientAlreadyRegistered() public {
        initialize();
        registration.registerPatient(patient1);
        
        vm.expectRevert("Patient already registered");
        registration.registerPatient(patient1);
    }

    function test_revertInvalidPatientAddress() public {
        initialize();
        vm.expectRevert("Invalid patient address");
        registration.registerPatient(address(0));
    }

    function test_revertRegisterPatientNotAdmin() public {
        initialize();
        vm.prank(patient1);
        vm.expectRevert("Not an admin");
        registration.registerPatient(patient2);
    }

    function test_deactivatePatient() public {
        initialize();
        // Register a patient
        registration.registerPatient(patient1);
        
        // Verify patient is registered and active
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isUserRegistered(patient1));
        
        // Get initial stats
        (uint256 totalUsers, uint256 patients,,) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 1);
        
        // Deactivate patient
        registration.deactivateUser(patient1);
        
        // Verify patient is deactivated
        assertFalse(registration.isPatient(patient1));
        assertFalse(registration.isUserRegistered(patient1));
        
        // Check that stats are updated
        (uint256 newTotalUsers, uint256 newPatients,,) = registration.getRegistrationStats();
        assertEq(newTotalUsers, 0);
        assertEq(newPatients, 0);
        
        // Verify user record still exists but is inactive
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(patient1);
        assertFalse(record.isActive);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.PATIENT));
    }

    // ======== Hospital Registration Tests ========

    function test_registerHospitalWithMailProof() public {
        initialize();
        // Mock as the hospital wallet for this test
        vm.startPrank(hospitalWallet);
        
        // Get the test email and prepare it
        UnverifiedEmail memory email = getTestEmail("testdata/Hospital.eml");
        
        // Call the prover to get registration data and proof (simulated by vlayer)
        callProver();
        (Proof memory proof, HealthcareRegistrationProver.RegistrationData memory regData) = prover.main(email);
        
        // Register the hospital using the proof
        registration.registerHospitalWithMailProof(regData, proof);
        
        // Verify hospital was properly registered
        assertTrue(registration.isHospital(hospitalWallet));
        assertTrue(registration.isUserRegistered(hospitalWallet));
        assertEq(uint256(registration.getUserType(hospitalWallet)), uint256(HealthcareRegistration.UserType.HOSPITAL));
        
        // Verify domain is registered to hospital
        string memory domain = "onlyfive.it";
        assertTrue(registration.isDomainTaken(domain));
        assertEq(registration.getDomainOwner(domain), hospitalWallet);
        
        // Verify domain validates as hospital domain
        assertTrue(registration.validateHospitalDomain(domain));
        assertFalse(registration.validateInsurerDomain(domain));
        
        // Check registration stats
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 0);
        assertEq(hospitals, 1);
        assertEq(insurers, 0);
        
        vm.stopPrank();
    }

    function test_hospitalRecord() public {
        initialize();
        // First register the hospital
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory email = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory proof, HealthcareRegistrationProver.RegistrationData memory regData) = prover.main(email);
        registration.registerHospitalWithMailProof(regData, proof);
        vm.stopPrank();
        
        // Check hospital record details
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(hospitalWallet);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.HOSPITAL));
        assertEq(record.walletAddress, hospitalWallet);
        assertEq(record.domain, "onlyfive.it");
        assertEq(record.organizationName, "City General Hospital");
        assertTrue(record.isActive);
        assertTrue(record.registrationTime > 0);
    }

    // ======== Insurer Registration Tests ========

    function test_registerInsurerWithMailProof() public {
        initialize();
        // Mock as the insurer wallet for this test
        vm.startPrank(insurerWallet);
        
        // Get the test email and prepare it
        UnverifiedEmail memory email = getTestEmail("testdata/Insurance.eml");
        
        // Call the prover to get registration data and proof (simulated by vlayer)
        callProver();
        (Proof memory proof, HealthcareRegistrationProver.RegistrationData memory regData) = prover.main(email);
        
        // Register the insurer using the proof
        registration.registerInsurerWithMailProof(regData, proof);
        
        // Verify insurer was properly registered
        assertTrue(registration.isInsurer(insurerWallet));
        assertTrue(registration.isUserRegistered(insurerWallet));
        assertEq(uint256(registration.getUserType(insurerWallet)), uint256(HealthcareRegistration.UserType.INSURER));
        
        // Verify domain is registered to insurer
        string memory domain = "nexthoop.it";
        assertTrue(registration.isDomainTaken(domain));
        assertEq(registration.getDomainOwner(domain), insurerWallet);
        
        // Verify domain validates as insurer domain
        assertTrue(registration.validateInsurerDomain(domain));
        assertFalse(registration.validateHospitalDomain(domain));
        
        // Check registration stats
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 1);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 1);
        
        vm.stopPrank();
    }

    function test_insurerRecord() public {
        initialize();
        // First register the insurer
        vm.startPrank(insurerWallet);
        UnverifiedEmail memory email = getTestEmail("testdata/Insurance.eml");
        callProver();
        (Proof memory proof, HealthcareRegistrationProver.RegistrationData memory regData) = prover.main(email);
        registration.registerInsurerWithMailProof(regData, proof);
        vm.stopPrank();
        
        // Check insurer record details
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(insurerWallet);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.INSURER));
        assertEq(record.walletAddress, insurerWallet);
        assertEq(record.domain, "nexthoop.it");
        assertEq(record.organizationName, "MediClaims Insurance Group");
        assertTrue(record.isActive);
        assertTrue(record.registrationTime > 0);
    }

    // ======== Domain Validation Tests ========

    function test_isDomainTaken() public {
        initialize();
        // Initially, no domains are taken
        string memory hospitalDomain = "onlyfive.it";
        string memory insurerDomain = "nexthoop.it";
        
        assertFalse(registration.isDomainTaken(hospitalDomain));
        assertFalse(registration.isDomainTaken(insurerDomain));
        
        // Register hospital
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
        
        // Verify hospital domain is now taken
        assertTrue(registration.isDomainTaken(hospitalDomain));
        assertFalse(registration.isDomainTaken(insurerDomain));
        
        // Register insurer
        vm.startPrank(insurerWallet);
        UnverifiedEmail memory insurerEmail = getTestEmail("testdata/Insurance.eml");
        callProver();
        (Proof memory insurerProof, HealthcareRegistrationProver.RegistrationData memory insurerData) = prover.main(insurerEmail);
        registration.registerInsurerWithMailProof(insurerData, insurerProof);
        vm.stopPrank();
        
        // Verify both domains are now taken
        assertTrue(registration.isDomainTaken(hospitalDomain));
        assertTrue(registration.isDomainTaken(insurerDomain));
    }

    function test_domainOwnership() public {
        initialize();
        string memory hospitalDomain = "onlyfive.it";
        string memory insurerDomain = "nexthoop.it";
        
        // Initially, domains have no owner
        assertEq(registration.getDomainOwner(hospitalDomain), address(0));
        assertEq(registration.getDomainOwner(insurerDomain), address(0));
        
        // Register hospital and insurer
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
        
        vm.startPrank(insurerWallet);
        UnverifiedEmail memory insurerEmail = getTestEmail("testdata/Insurance.eml");
        callProver();
        (Proof memory insurerProof, HealthcareRegistrationProver.RegistrationData memory insurerData) = prover.main(insurerEmail);
        registration.registerInsurerWithMailProof(insurerData, insurerProof);
        vm.stopPrank();
        
        // Verify correct domain ownership
        assertEq(registration.getDomainOwner(hospitalDomain), hospitalWallet);
        assertEq(registration.getDomainOwner(insurerDomain), insurerWallet);
    }

    function test_validateHospitalDomain() public {
        initialize();
        string memory hospitalDomain = "onlyfive.it";
        string memory insurerDomain = "nexthoop.it";
        string memory unknownDomain = "unknown.com";
        
        // Initially, no domains are valid
        assertFalse(registration.validateHospitalDomain(hospitalDomain));
        assertFalse(registration.validateHospitalDomain(insurerDomain));
        assertFalse(registration.validateHospitalDomain(unknownDomain));
        
        // Register hospital
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
        
        // Only hospital domain should be valid
        assertTrue(registration.validateHospitalDomain(hospitalDomain));
        assertFalse(registration.validateHospitalDomain(insurerDomain));
        assertFalse(registration.validateHospitalDomain(unknownDomain));
    }

    function test_validateInsurerDomain() public {
        initialize();
        string memory hospitalDomain = "onlyfive.it";
        string memory insurerDomain = "nexthoop.it";
        string memory unknownDomain = "unknown.com";
        
        // Initially, no domains are valid
        assertFalse(registration.validateInsurerDomain(hospitalDomain));
        assertFalse(registration.validateInsurerDomain(insurerDomain));
        assertFalse(registration.validateInsurerDomain(unknownDomain));
        
        // Register insurer
        vm.startPrank(insurerWallet);
        UnverifiedEmail memory insurerEmail = getTestEmail("testdata/Insurance.eml");
        callProver();
        (Proof memory insurerProof, HealthcareRegistrationProver.RegistrationData memory insurerData) = prover.main(insurerEmail);
        registration.registerInsurerWithMailProof(insurerData, insurerProof);
        vm.stopPrank();
        
        // Only insurer domain should be valid
        assertTrue(registration.validateInsurerDomain(insurerDomain));
        assertFalse(registration.validateInsurerDomain(hospitalDomain));
        assertFalse(registration.validateInsurerDomain(unknownDomain));
    }

    function test_domainCaseSensitivity() public {
        initialize();
        // Register hospital
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
        
        // Domain validation should be case sensitive (since string comparison in Solidity is case-sensitive)
        assertTrue(registration.validateHospitalDomain("onlyfive.it"));
        assertFalse(registration.validateHospitalDomain("ONLYFIVE.IT"));
        assertFalse(registration.validateHospitalDomain("Onlyfive.It"));
        
        // Domain lookup should also be case sensitive
        assertTrue(registration.isDomainTaken("onlyfive.it"));
        assertFalse(registration.isDomainTaken("ONLYFIVE.IT"));
        assertFalse(registration.isDomainTaken("Onlyfive.It"));
    }

    function test_deactivateUser() public {
        initialize();
        // Register hospital
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
        
        // Verify hospital is active
        assertTrue(registration.isUserRegistered(hospitalWallet));
        assertTrue(registration.validateHospitalDomain("onlyfive.it"));
        
        // Deactivate hospital
        registration.deactivateUser(hospitalWallet);
        
        // Verify hospital is no longer active but domain remains taken
        assertFalse(registration.isUserRegistered(hospitalWallet));
        assertTrue(registration.isDomainTaken("onlyfive.it"));
        
        // Validate domain should now fail
        assertFalse(registration.validateHospitalDomain("onlyfive.it"));
        
        // Get user record should still show hospital but inactive
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(hospitalWallet);
        assertEq(uint256(record.userType), uint256(HealthcareRegistration.UserType.HOSPITAL));
        assertFalse(record.isActive);
    }

    // ======== Admin Management Tests ========

    function test_addAdmin() public {
        initialize();
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.BASIC));
        assertEq(permissions, 1);
    }

    function test_addModeratorAdmin() public {
        initialize();
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.MODERATOR);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.MODERATOR));
        assertEq(permissions, 255);
    }

    function test_addSuperAdmin() public {
        initialize();
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.SUPER_ADMIN);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions) = registration.admins(patient1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.SUPER_ADMIN));
        assertEq(permissions, type(uint256).max);
    }

    function test_revertAddAdminAlreadyAdmin() public {
        initialize();
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        vm.expectRevert("Already an admin");
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.MODERATOR);
    }

    function test_revertAddAdminInvalidAddress() public {
        initialize();
        vm.expectRevert("Invalid admin address");
        registration.addAdmin(address(0), HealthcareRegistration.AdminRole.BASIC);
    }

    function test_revertAddAdminNotSuperAdmin() public {
        initialize();
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        vm.prank(patient1);
        vm.expectRevert("Not a super admin");
        registration.addAdmin(patient2, HealthcareRegistration.AdminRole.BASIC);
    }

    function test_updateAdminPermissions() public {
        initialize();
        registration.addAdmin(patient1, HealthcareRegistration.AdminRole.BASIC);
        
        uint256 newPermissions = 100;
        registration.updateAdminPermissions(patient1, newPermissions);
        
        (,, uint256 permissions) = registration.admins(patient1);
        assertEq(permissions, newPermissions);
    }

    function test_revertUpdatePermissionsNotAdmin() public {
        initialize();
        vm.expectRevert("Not an admin");
        registration.updateAdminPermissions(patient1, 100);
    }

    // ======== Integration Tests ========

    function test_fullRegistrationFlow() public {
        initialize();
        // Register patient
        registration.registerPatient(patient1);
        
        // Register hospital
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
        
        // Register insurer
        vm.startPrank(insurerWallet);
        UnverifiedEmail memory insurerEmail = getTestEmail("testdata/Insurance.eml");
        callProver();
        (Proof memory insurerProof, HealthcareRegistrationProver.RegistrationData memory insurerData) = prover.main(insurerEmail);
        registration.registerInsurerWithMailProof(insurerData, insurerProof);
        vm.stopPrank();
        
        // Verify all users are registered
        assertTrue(registration.isPatient(patient1));
        assertTrue(registration.isHospital(hospitalWallet));
        assertTrue(registration.isInsurer(insurerWallet));
        
        // Verify domains are properly assigned
        assertTrue(registration.validateHospitalDomain("onlyfive.it"));
        assertTrue(registration.validateInsurerDomain("nexthoop.it"));
        
        // Check registration stats
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 3);
        assertEq(patients, 1);
        assertEq(hospitals, 1);
        assertEq(insurers, 1);
    }

    function test_revertDuplicateRegistrations() public {
        initialize();
        // Register hospital first
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        
        // Try registering the same wallet/email again
        callProver();
        (Proof memory duplicateProof, HealthcareRegistrationProver.RegistrationData memory duplicateData) = prover.main(hospitalEmail);
        vm.expectRevert("User already registered");
        registration.registerHospitalWithMailProof(duplicateData, duplicateProof);
        vm.stopPrank();
    }

    function test_revertWalletAddressMismatch() public {
        initialize();
        // Try to register hospital with a different wallet than the one in the proof
        vm.startPrank(patient1);  // Different from hospitalWallet
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        vm.expectRevert("Wallet address mismatch");
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
    }

    function test_domainReuseAfterDeactivation() public {
        initialize();
        // Register hospital
        vm.startPrank(hospitalWallet);
        UnverifiedEmail memory hospitalEmail = getTestEmail("testdata/Hospital.eml");
        callProver();
        (Proof memory hospitalProof, HealthcareRegistrationProver.RegistrationData memory hospitalData) = prover.main(hospitalEmail);
        registration.registerHospitalWithMailProof(hospitalData, hospitalProof);
        vm.stopPrank();
        
        // Deactivate hospital
        registration.deactivateUser(hospitalWallet);
        
        // Verify domain is still taken even after deactivation
        assertTrue(registration.isDomainTaken("onlyfive.it"));
        assertEq(registration.getDomainOwner("onlyfive.it"), hospitalWallet);
        
        // But domain validation should fail
        assertFalse(registration.validateHospitalDomain("onlyfive.it"));
    }

    function test_nonExistentUserRecord() public {
        initialize();
        // Trying to get a record for non-registered user should return an empty record
        HealthcareRegistration.UserRecord memory record = registration.getUserRecord(address(0x1234));
        assertFalse(record.isActive);
        assertEq(record.walletAddress, address(0));
        assertEq(record.domain, "");
        assertEq(record.organizationName, "");
    }

    function test_emptyDomain() public {
        initialize();
        // Empty domain should not be considered taken
        assertFalse(registration.isDomainTaken(""));
        
        // Empty domain should not validate as hospital or insurer
        assertFalse(registration.validateHospitalDomain(""));
        assertFalse(registration.validateInsurerDomain(""));
    }
}
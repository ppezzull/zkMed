// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Test} from "forge-std/Test.sol";
import {HealthcareRegistration} from "../../contracts/zkMed/HealthcareRegistration.sol";
import {HealthcareRegistrationProver} from "../../contracts/zkMed/HealthcareRegistrationProver.sol";

contract HealthcareRegistrationTest is Test {
    HealthcareRegistration public registration;
    HealthcareRegistrationProver public prover;
    
    address public admin;
    address public hospital1;
    address public insurer1;
    address public user1;
    address public user2;
    
    function setUp() public {
        admin = address(this);
        user1 = vm.addr(1);
        user2 = vm.addr(2);
        hospital1 = vm.addr(3);
        insurer1 = vm.addr(4);
        
        prover = new HealthcareRegistrationProver();
        registration = new HealthcareRegistration(address(prover));
    }

    // ======== Admin Management Tests ========

    function test_addAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions, uint256 adminSince) = registration.admins(user1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.BASIC));
        assertEq(permissions, 1); // Basic permissions should be 1
        assertGt(adminSince, 0);
    }

    function test_addModeratorAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.MODERATOR);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions,) = registration.admins(user1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.MODERATOR));
        assertEq(permissions, 255); // Moderate permissions should be 255
    }

    function test_addSuperAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.SUPER_ADMIN);
        
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions,) = registration.admins(user1);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.SUPER_ADMIN));
        assertEq(permissions, type(uint256).max); // Super admin gets all permissions
    }

    function test_revertAddAdminAlreadyAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        vm.expectRevert("Already an admin");
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.MODERATOR);
    }

    function test_revertAddAdminInvalidAddress() public {
        vm.expectRevert("Invalid admin address");
        registration.addAdmin(address(0), HealthcareRegistration.AdminRole.BASIC);
    }

    function test_revertAddAdminNotSuperAdmin() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        
        vm.prank(user1);
        vm.expectRevert("Not a super admin");
        registration.addAdmin(user2, HealthcareRegistration.AdminRole.BASIC);
    }

    function test_updateAdminPermissions() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        
        uint256 newPermissions = 123;
        registration.updateAdminPermissions(user1, newPermissions);
        
        (,, uint256 permissions,) = registration.admins(user1);
        assertEq(permissions, newPermissions);
    }

    function test_revertUpdatePermissionsNotAdmin() public {
        vm.prank(user1);
        vm.expectRevert("Not a super admin");
        registration.updateAdminPermissions(user2, 123);
    }

    function test_getAdminType() public {
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.MODERATOR);
        
        HealthcareRegistration.AdminRole role = registration.getAdminType(user1);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.MODERATOR));
    }

    function test_revertGetAdminTypeNotAdmin() public {
        vm.expectRevert("Admin not registered");
        registration.getAdminType(user1);
    }

    // ======== View Function Tests ========

    function test_nonExistentPatientRecord() public view {
        // For unregistered users, userTypes[address] returns UserType(0) which is PATIENT
        // So getPatientRecord won't revert but will return an empty record
        HealthcareRegistration.PatientRecord memory record = registration.getPatientRecord(user1);
        assertEq(record.base.walletAddress, address(0));
        assertEq(record.base.emailHash, bytes32(0));
        assertEq(record.base.registrationTime, 0);
        assertFalse(record.base.isActive);
        assertEq(record.base.requestId, 0);
    }

    function test_nonExistentOrganizationRecord() public {
        vm.expectRevert(); // Should revert for non-organization users
        registration.getOrganizationRecord(user1);
    }

    function test_isUserRegistered() public view {
        // Non-registered users should return false
        assertFalse(registration.isUserRegistered(user1));
    }

    function test_getUserTypeNotRegistered() public {
        vm.expectRevert("User not registered or inactive");
        registration.getUserType(user1);
    }

    function test_emptyDomain() public view {
        assertFalse(registration.isDomainTaken(""));
        assertEq(registration.getDomainOwner(""), address(0));
        assertFalse(registration.validateHospitalDomain(""));
        assertFalse(registration.validateInsurerDomain(""));
    }

    function test_initialStats() public view {
        (uint256 totalUsers, uint256 patients, uint256 hospitals, uint256 insurers) = registration.getRegistrationStats();
        assertEq(totalUsers, 0);
        assertEq(patients, 0);
        assertEq(hospitals, 0);
        assertEq(insurers, 0);
    }

    function test_domainValidation() public view {
        // Test unregistered domains - should return false since they're not registered
        assertFalse(registration.validateHospitalDomain("hospital.com"));
        assertFalse(registration.validateInsurerDomain("insurance.co.uk"));
        
        // Test empty domain
        assertFalse(registration.validateHospitalDomain(""));
        assertFalse(registration.validateInsurerDomain(""));
        
        // Test very short domain
        assertFalse(registration.validateHospitalDomain("abc"));
        assertFalse(registration.validateInsurerDomain("xyz"));
    }

    function test_getPendingRequests() public view {
        uint256[] memory pendingRequests = registration.getPendingRequests();
        assertEq(pendingRequests.length, 0);
    }

    function test_getPendingRequestsByType() public view {
        uint256[] memory patientRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.PATIENT_REGISTRATION);
        uint256[] memory orgRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ORG_REGISTRATION);
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        
        assertEq(patientRequests.length, 0);
        assertEq(orgRequests.length, 0);
        assertEq(adminRequests.length, 0);
    }

    function test_adminRequestSystem() public {
        // Test requesting admin access
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Need admin access for testing");
        
        // Check that the request was created
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        assertEq(adminRequests.length, 1);
        
        uint256 requestId = adminRequests[0];
        HealthcareRegistration.BaseRequest memory baseRequest = registration.getRequestBase(requestId);
        assertEq(baseRequest.requester, user1);
        assertEq(uint256(baseRequest.requestType), uint256(HealthcareRegistration.RequestType.ADMIN_ACCESS));
        assertEq(uint256(baseRequest.status), uint256(HealthcareRegistration.RequestStatus.PENDING));
        
        // Admin should be able to approve the request
        registration.approveRequest(requestId);
        
        // Check that user1 is now an admin
        (bool isActive,,,) = registration.admins(user1);
        assertTrue(isActive);
        assertEq(uint256(registration.getAdminType(user1)), uint256(HealthcareRegistration.AdminRole.BASIC));
    }

    function test_revertRequestSuperAdmin() public {
        vm.prank(user1);
        vm.expectRevert("Cannot request super admin role");
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.SUPER_ADMIN, "Trying to get super admin");
    }

    function test_revertApproveRequestNotModerator() public {
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Need admin access");
        
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        uint256 requestId = adminRequests[0];
        
        vm.prank(user2);
        vm.expectRevert("Not a moderator or super admin");
        registration.approveRequest(requestId);
    }

    function test_rejectRequest() public {
        // Create a request
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Need admin access");
        
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        uint256 requestId = adminRequests[0];
        
        // Reject the request
        registration.rejectRequest(requestId, "Not sufficient justification");
        
        // Check that the request was rejected
        HealthcareRegistration.BaseRequest memory baseRequest = registration.getRequestBase(requestId);
        assertEq(uint256(baseRequest.status), uint256(HealthcareRegistration.RequestStatus.REJECTED));
        
        // User should not be an admin
        (bool isActive,,,) = registration.admins(user1);
        assertFalse(isActive);
    }

    // ======== Additional Edge Case Tests ========

    function test_revertRequestAdminAccessAlreadyAdmin() public {
        // First make user1 an admin
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.BASIC);
        
        // Then try to request admin access again
        vm.prank(user1);
        vm.expectRevert("Already an admin");
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.MODERATOR, "Upgrade request");
    }

    function test_revertRequestAdminAccessPendingRequest() public {
        // Submit first request
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "First request");
        
        // Try to submit another request while first is pending
        vm.prank(user1);
        vm.expectRevert("Already have pending request");
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.MODERATOR, "Second request");
    }

    function test_requestAdminAccessAfterRejection() public {
        // Submit first request
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "First request");
        
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        uint256 requestId = adminRequests[0];
        
        // Reject the request
        registration.rejectRequest(requestId, "Not qualified");
        
        // Should be able to submit a new request after rejection
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Second attempt");
        
        // Check that new request was created
        adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        assertEq(adminRequests.length, 1);
        
        uint256 newRequestId = adminRequests[0];
        assertGt(newRequestId, requestId); // New request should have higher ID
    }

    function test_getAdminRequestDetails() public {
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Need basic access");
        
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        uint256 requestId = adminRequests[0];
        
        HealthcareRegistration.AdminAccessRequest memory adminReq = registration.getAdminRequest(requestId);
        assertEq(adminReq.base.requester, user1);
        assertEq(uint256(adminReq.adminRole), uint256(HealthcareRegistration.AdminRole.BASIC));
        assertEq(adminReq.reason, "Need basic access");
    }

    function test_revertGetNonExistentRequest() public {
        vm.expectRevert("Request does not exist");
        registration.approveRequest(999);
    }

    function test_revertGetWrongRequestType() public {
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Admin request");
        
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        uint256 requestId = adminRequests[0];
        
        // Try to get it as a patient request
        vm.expectRevert("Not a patient request");
        registration.getPatientRequest(requestId);
        
        // Try to get it as an organization request
        vm.expectRevert("Not an organization request");
        registration.getOrganizationRequest(requestId);
    }

    function test_moderatorCanApproveBasicAdminRequest() public {
        // First create a moderator
        registration.addAdmin(user1, HealthcareRegistration.AdminRole.MODERATOR);
        
        // User2 requests basic admin access
        vm.prank(user2);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Need basic access");
        
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        uint256 requestId = adminRequests[0];
        
        // Moderator should be able to approve basic admin request
        vm.prank(user1);
        registration.approveRequest(requestId);
        
        // Check that user2 is now a basic admin
        (bool isActive, HealthcareRegistration.AdminRole role,,) = registration.admins(user2);
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.BASIC));
    }

    function test_contractHasSuperAdminOnDeploy() public view {
        // The deployer (this contract) should be a super admin
        (bool isActive, HealthcareRegistration.AdminRole role, uint256 permissions, uint256 adminSince) = registration.admins(address(this));
        assertTrue(isActive);
        assertEq(uint256(role), uint256(HealthcareRegistration.AdminRole.SUPER_ADMIN));
        assertEq(permissions, type(uint256).max);
        assertGt(adminSince, 0);
    }

    function test_requestCountIncreases() public {
        uint256 initialCount = registration.requestCount();
        
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "First request");
        
        assertEq(registration.requestCount(), initialCount + 1);
        
        vm.prank(user2);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Second request");
        
        assertEq(registration.requestCount(), initialCount + 2);
    }

    function test_pendingRequestCountTracking() public {
        uint256 initialPendingCount = registration.pendingRequestCount();
        
        // Submit request - should increase pending count
        vm.prank(user1);
        registration.requestAdminAccess(HealthcareRegistration.AdminRole.BASIC, "Test request");
        
        assertEq(registration.pendingRequestCount(), initialPendingCount + 1);
        
        // Approve request - should decrease pending count
        uint256[] memory adminRequests = registration.getPendingRequestsByType(HealthcareRegistration.RequestType.ADMIN_ACCESS);
        uint256 requestId = adminRequests[0];
        registration.approveRequest(requestId);
        
        assertEq(registration.pendingRequestCount(), initialPendingCount);
    }
}
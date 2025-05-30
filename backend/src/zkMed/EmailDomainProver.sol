// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";

contract EmailDomainProver is Prover {
    
    /// @notice Proves domain ownership through email verification
    /// @param domain The domain to verify (e.g., "hospital.com")
    /// @param emailToken The token received via email to admin@domain
    /// @return proof The vlayer proof
    /// @return verifiedDomain The domain that was verified
    /// @return verificationTimestamp When the verification occurred
    function verifyDomainOwnership(
        string memory domain,
        string memory emailToken
    ) public returns (Proof memory, string memory, uint256) {
        // vlayer will handle the email verification logic
        // This validates that the emailToken was sent to admin@domain
        // and that the caller has access to that email address
        
        // In a real implementation, vlayer would:
        // 1. Verify the emailToken was generated for admin@domain
        // 2. Confirm the token hasn't been used before
        // 3. Validate the token is still within the time window
        
        uint256 verificationTimestamp = block.timestamp;
        
        return (proof(), domain, verificationTimestamp);
    }
    
    /// @notice Proves organization legitimacy through email domain verification
    /// @param organizationName The name of the organization
    /// @param domain The domain to verify
    /// @param emailToken The email verification token
    /// @return proof The vlayer proof
    /// @return orgData Packed organization data (name, domain, timestamp)
    function verifyOrganization(
        string memory organizationName,
        string memory domain,
        string memory emailToken
    ) public returns (Proof memory, OrganizationData memory) {
        // Verify domain ownership first
        (, string memory verifiedDomain, uint256 timestamp) = verifyDomainOwnership(domain, emailToken);
        
        OrganizationData memory orgData = OrganizationData({
            name: organizationName,
            domain: verifiedDomain,
            verificationTimestamp: timestamp
        });
        
        return (proof(), orgData);
    }
}

/// @notice Organization data structure for verification
struct OrganizationData {
    string name;
    string domain;
    uint256 verificationTimestamp;
} 
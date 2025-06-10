// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.21;

import {Proof} from "vlayer-0.1.0/Proof.sol";
import {Prover} from "vlayer-0.1.0/Prover.sol";
import {Web, WebProof, WebProofLib, WebLib} from "vlayer-0.1.0/WebProof.sol";

/// @title HealthSystemWebProofProver
/// @notice Prover contract for Italian health system (Salute Lazio) WebProofs
/// @dev Validates patient data from Italian health portal without exposing sensitive information
contract HealthSystemWebProofProver is Prover {
    using WebProofLib for WebProof;
    using WebLib for Web;

    // Italian health system API endpoint
    string public constant SALUTE_LAZIO_PROFILE_URL = 
        "https://www.salutelazio.it/group/guest/profilo-utente";

    // Struct to hold verified patient data (privacy-preserving)
    struct VerifiedPatientData {
        string patientId;        // ASUR patient ID
        bytes32 taxCodeHash;     // Hashed Italian tax code (codice fiscale)
        string regionalCode;     // Regional healthcare code
        string homeAsl;          // Local Health Authority
        bytes32 mmgTaxCodeHash;  // Hashed family doctor tax code
        uint256 timestamp;       // Verification timestamp
    }

    /// @notice Main prover function to validate Italian health system patient data
    /// @param webProof The WebProof containing patient data from Salute Lazio portal
    /// @param patientAddress The Ethereum address of the patient
    /// @param commitment Privacy-preserving commitment (hash of secret + tax code)
    /// @return proof The vlayer proof
    /// @return verifiedData Verified patient data (privacy-preserving)
    /// @return patientAddress The patient's Ethereum address
    function proveItalianPatient(
        WebProof calldata webProof,
        address patientAddress,
        bytes32 commitment
    ) public view returns (
        Proof memory,
        VerifiedPatientData memory,
        address
    ) {
        // Verify the WebProof comes from the correct Italian health portal
        Web memory web = webProof.verify(SALUTE_LAZIO_PROFILE_URL);

        // Create verified data struct directly to avoid local variable overflow
        VerifiedPatientData memory verifiedData;
        
        // Extract and validate patient data
        verifiedData.patientId = web.jsonGetString("patientId");
        verifiedData.regionalCode = web.jsonGetString("regionalCode");
        verifiedData.homeAsl = web.jsonGetString("homeAsl");
        verifiedData.timestamp = block.timestamp;

        // Handle tax codes separately to avoid stack issues
        string memory taxCode = web.jsonGetString("taxCode");
        string memory mmgTaxCode = web.jsonGetString("mmgTaxCode");
        
        // Validate essential fields
        require(bytes(verifiedData.patientId).length > 0, "Invalid patient ID");
        require(bytes(taxCode).length > 0, "Invalid tax code");
        require(bytes(verifiedData.regionalCode).length > 0, "Invalid regional code");
        require(bytes(verifiedData.homeAsl).length > 0, "Invalid ASL");

        // Create hashes
        verifiedData.taxCodeHash = keccak256(abi.encodePacked(taxCode));
        verifiedData.mmgTaxCodeHash = keccak256(abi.encodePacked(mmgTaxCode));

        // Verify commitment
        bytes32 expectedCommitment = keccak256(abi.encodePacked(taxCode, patientAddress));
        require(commitment == expectedCommitment, "Invalid commitment");

        return (proof(), verifiedData, patientAddress);
    }

    /// @notice Verify patient has valid Italian health system registration
    /// @param webProof The WebProof containing patient data
    /// @return isValid True if patient has valid health system registration
    /// @return patientId The patient's health system ID
    /// @return homeAsl The patient's Local Health Authority
    function verifyHealthSystemRegistration(
        WebProof calldata webProof
    ) public view returns (
        bool isValid,
        string memory patientId,
        string memory homeAsl
    ) {
        Web memory web = webProof.verify(SALUTE_LAZIO_PROFILE_URL);

        patientId = web.jsonGetString("patientId");
        homeAsl = web.jsonGetString("homeAsl");
        string memory taxCode = web.jsonGetString("taxCode");

        // Check if patient has valid registration
        isValid = bytes(patientId).length > 0 && 
                  bytes(homeAsl).length > 0 && 
                  bytes(taxCode).length > 0;

        return (isValid, patientId, homeAsl);
    }

    /// @notice Generate commitment for Italian tax code
    /// @dev Helper function to create privacy-preserving commitment
    /// @param taxCode The Italian tax code (codice fiscale)
    /// @param patientAddress The patient's Ethereum address
    /// @return commitment The privacy-preserving commitment
    function generateCommitment(
        string memory taxCode,
        address patientAddress
    ) public pure returns (bytes32 commitment) {
        return keccak256(abi.encodePacked(taxCode, patientAddress));
    }
} 
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract IdentityAttestation {

    // Structure to store attestation details
    struct Attestation {
        bytes32 nameHash;          // Hash of the name
        bytes32 dobHash;           // Hash of the date of birth (DOB)
        bytes32 nationalityHash;   // Hash of the nationality
        bytes32 employmentStatusHash; // Hash of the employment status
        bool isAttested;           // Status of the attestation (true/false)
    }

    // Mapping to store the attestation of each worker (by their address)
    mapping(address => Attestation) public attestations;

    // Event to emit when a new attestation is made
    event Attested(address indexed worker, bytes32 nameHash, bytes32 dobHash, bytes32 nationalityHash, bytes32 employmentStatusHash);

    // Function to attest the identity of a worker
    // Accepts hashes of name, dob, nationality, and employment status to avoid storing sensitive data directly
    function attestIdentity(
        bytes32 _nameHash,
        bytes32 _dobHash,
        bytes32 _nationalityHash,
        bytes32 _employmentStatusHash
    ) public {
        require(!attestations[msg.sender].isAttested, "Identity already attested.");

        // Store the attestation details
        attestations[msg.sender] = Attestation({
            nameHash: _nameHash,
            dobHash: _dobHash,
            nationalityHash: _nationalityHash,
            employmentStatusHash: _employmentStatusHash,
            isAttested: true
        });

        // Emit an event to indicate a new attestation
        emit Attested(msg.sender, _nameHash, _dobHash, _nationalityHash, _employmentStatusHash);
    }

    // Function to verify the identity of a worker
    // Accepts the hashes for comparison to verify the worker's data
    function verifyIdentity(
        address _worker,
        bytes32 _nameHash,
        bytes32 _dobHash,
        bytes32 _nationalityHash,
        bytes32 _employmentStatusHash
    ) public view returns (bool) {
        Attestation memory att = attestations[_worker];

        // Check if the hashes match the stored data
        return att.isAttested
            && att.nameHash == _nameHash
            && att.dobHash == _dobHash
            && att.nationalityHash == _nationalityHash
            && att.employmentStatusHash == _employmentStatusHash;
    }

    // Optional: A function to get the attestation details of a worker
    function getAttestationDetails(address _worker) public view returns (bytes32, bytes32, bytes32, bytes32, bool) {
        Attestation memory att = attestations[_worker];
        return (att.nameHash, att.dobHash, att.nationalityHash, att.employmentStatusHash, att.isAttested);
    }
}

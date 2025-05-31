/**
 * RegistrationContract ABI
 * Auto-generated from Foundry build artifacts
 */

export const RegistrationContractABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_emailDomainProver",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "_setTestVerifier",
    "inputs": [
      {
        "name": "newVerifier",
        "type": "address",
        "internalType": "contract IProofVerifier"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "addAdmin",
    "inputs": [
      {
        "name": "_newAdmin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "admin",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "admins",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "completeOrganizationRegistration",
    "inputs": [
      {
        "name": "organizationName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "domain",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_role",
        "type": "uint8",
        "internalType": "enum RegistrationContract.Role"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "domainToAddress",
    "inputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "emailDomainProver",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "emailHashToAddress",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getDomainOwner",
    "inputs": [
      {
        "name": "_domain",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getEmailHashOwner",
    "inputs": [
      {
        "name": "_emailHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getOrganization",
    "inputs": [
      {
        "name": "_organization",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct RegistrationContract.Organization",
        "components": [
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "domain",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "role",
            "type": "uint8",
            "internalType": "enum RegistrationContract.Role"
          },
          {
            "name": "registrationTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "verified",
            "type": "bool",
            "internalType": "bool"
          },
          {
            "name": "emailHash",
            "type": "bytes32",
            "internalType": "bytes32"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserRegistration",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "role",
        "type": "uint8",
        "internalType": "enum RegistrationContract.Role"
      },
      {
        "name": "isVerified",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "organizationName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "domain",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isDomainRegistered",
    "inputs": [
      {
        "name": "_domain",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isEmailHashUsed",
    "inputs": [
      {
        "name": "_emailHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "isUserVerified",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "organizations",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "name",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "domain",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "role",
        "type": "uint8",
        "internalType": "enum RegistrationContract.Role"
      },
      {
        "name": "registrationTimestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "verified",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "emailHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "patientCommitments",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerOrganization",
    "inputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Proof",
        "components": [
          {
            "name": "seal",
            "type": "tuple",
            "internalType": "struct Seal",
            "components": [
              {
                "name": "verifierSelector",
                "type": "bytes4",
                "internalType": "bytes4"
              },
              {
                "name": "seal",
                "type": "bytes32[8]",
                "internalType": "bytes32[8]"
              },
              {
                "name": "mode",
                "type": "uint8",
                "internalType": "enum ProofMode"
              }
            ]
          },
          {
            "name": "callGuestId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "length",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callAssumptions",
            "type": "tuple",
            "internalType": "struct CallAssumptions",
            "components": [
              {
                "name": "proverContractAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "functionSelector",
                "type": "bytes4",
                "internalType": "bytes4"
              },
              {
                "name": "settleChainId",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "settleBlockNumber",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "settleBlockHash",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          }
        ]
      },
      {
        "name": "orgData",
        "type": "tuple",
        "internalType": "struct OrganizationVerificationData",
        "components": [
          {
            "name": "name",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "domain",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "targetWallet",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "emailHash",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "verificationTimestamp",
            "type": "uint256",
            "internalType": "uint256"
          }
        ]
      },
      {
        "name": "_role",
        "type": "uint8",
        "internalType": "enum RegistrationContract.Role"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registerPatient",
    "inputs": [
      {
        "name": "_commitment",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "registrationTimestamps",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "removeAdmin",
    "inputs": [
      {
        "name": "_admin",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "resetEmailHash",
    "inputs": [
      {
        "name": "_emailHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "roles",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint8",
        "internalType": "enum RegistrationContract.Role"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "updateVerificationStatus",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_verified",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "usedEmailHashes",
    "inputs": [
      {
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verified",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifier",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract IProofVerifier"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyAndStoreURL",
    "inputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Proof",
        "components": [
          {
            "name": "seal",
            "type": "tuple",
            "internalType": "struct Seal",
            "components": [
              {
                "name": "verifierSelector",
                "type": "bytes4",
                "internalType": "bytes4"
              },
              {
                "name": "seal",
                "type": "bytes32[8]",
                "internalType": "bytes32[8]"
              },
              {
                "name": "mode",
                "type": "uint8",
                "internalType": "enum ProofMode"
              }
            ]
          },
          {
            "name": "callGuestId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "length",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callAssumptions",
            "type": "tuple",
            "internalType": "struct CallAssumptions",
            "components": [
              {
                "name": "proverContractAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "functionSelector",
                "type": "bytes4",
                "internalType": "bytes4"
              },
              {
                "name": "settleChainId",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "settleBlockNumber",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "settleBlockHash",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          }
        ]
      },
      {
        "name": "domain",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "emailHash",
        "type": "bytes32",
        "internalType": "bytes32"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "verifyDomainOwnership",
    "inputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct Proof",
        "components": [
          {
            "name": "seal",
            "type": "tuple",
            "internalType": "struct Seal",
            "components": [
              {
                "name": "verifierSelector",
                "type": "bytes4",
                "internalType": "bytes4"
              },
              {
                "name": "seal",
                "type": "bytes32[8]",
                "internalType": "bytes32[8]"
              },
              {
                "name": "mode",
                "type": "uint8",
                "internalType": "enum ProofMode"
              }
            ]
          },
          {
            "name": "callGuestId",
            "type": "bytes32",
            "internalType": "bytes32"
          },
          {
            "name": "length",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "callAssumptions",
            "type": "tuple",
            "internalType": "struct CallAssumptions",
            "components": [
              {
                "name": "proverContractAddress",
                "type": "address",
                "internalType": "address"
              },
              {
                "name": "functionSelector",
                "type": "bytes4",
                "internalType": "bytes4"
              },
              {
                "name": "settleChainId",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "settleBlockNumber",
                "type": "uint256",
                "internalType": "uint256"
              },
              {
                "name": "settleBlockHash",
                "type": "bytes32",
                "internalType": "bytes32"
              }
            ]
          }
        ]
      },
      {
        "name": "emailHash",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "targetWallet",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "domain",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "verifyPatientCommitment",
    "inputs": [
      {
        "name": "_secret",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "AdminAdded",
    "inputs": [
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "AdminRemoved",
    "inputs": [
      {
        "name": "admin",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "DomainVerified",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "domain",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "emailHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "EmailProofVerified",
    "inputs": [
      {
        "name": "organization",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "domain",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "emailHash",
        "type": "bytes32",
        "indexed": false,
        "internalType": "bytes32"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OrganizationRegistered",
    "inputs": [
      {
        "name": "organization",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "domain",
        "type": "string",
        "indexed": true,
        "internalType": "string"
      },
      {
        "name": "name",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "role",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum RegistrationContract.Role"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "PatientRegistered",
    "inputs": [
      {
        "name": "patient",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "commitment",
        "type": "bytes32",
        "indexed": true,
        "internalType": "bytes32"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "RoleAssigned",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "role",
        "type": "uint8",
        "indexed": false,
        "internalType": "enum RegistrationContract.Role"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "VerificationStatusChanged",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "verified",
        "type": "bool",
        "indexed": false,
        "internalType": "bool"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  },
  {
    "type": "error",
    "name": "InvalidChainId",
    "inputs": []
  }
] as const;

export default RegistrationContractABI;

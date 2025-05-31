// Auto-generated TypeScript interface for RegistrationContract
export const RegistrationContractABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_emailDomainProver",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_storageContract",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_patientModule",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_organizationModule",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "_adminModule",
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
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "activateUser",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "activeUsers",
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
    "name": "addOwner",
    "inputs": [
      {
        "name": "_newOwner",
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
    "name": "adminModule",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract AdminModule"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "admins",
    "inputs": [
      {
        "name": "_admin",
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
    "name": "batchActivateUsers",
    "inputs": [
      {
        "name": "_users",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "batchDeactivateUsers",
    "inputs": [
      {
        "name": "_users",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "deactivateUser",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "deactivationTimestamp",
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
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "domainToAddress",
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
    "name": "getOwners",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address[]",
        "internalType": "address[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserActivationStatus",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "isActive",
        "type": "bool",
        "internalType": "bool"
      },
      {
        "name": "deactivatedAt",
        "type": "uint256",
        "internalType": "uint256"
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
    "name": "isOwner",
    "inputs": [
      {
        "name": "_address",
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
    "name": "isUserActive",
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
    "name": "organizationModule",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract OrganizationModule"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "organizations",
    "inputs": [
      {
        "name": "_org",
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
        "name": "isVerified",
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
    "name": "owner",
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
    "name": "owners",
    "inputs": [
      {
        "name": "_owner",
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
    "name": "patientCommitments",
    "inputs": [
      {
        "name": "_patient",
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
    "name": "patientModule",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract PatientModule"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "registerOrganization",
    "inputs": [
      {
        "name": "proof",
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
        "name": "_user",
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
    "name": "removeOwner",
    "inputs": [
      {
        "name": "_owner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "renounceOwnership",
    "inputs": [],
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
        "name": "_user",
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
    "name": "storageContract",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "contract RegistrationStorage"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "transferOwnership",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
    "name": "verified",
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
    "name": "verifier",
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
    "name": "verifyAndStoreURL",
    "inputs": [
      {
        "name": "proof",
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
        "name": "proof",
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
    "name": "OwnerAdded",
    "inputs": [
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "addedBy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnerRemoved",
    "inputs": [
      {
        "name": "removedOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "removedBy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferRequested",
    "inputs": [
      {
        "name": "currentOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "OwnershipTransferred",
    "inputs": [
      {
        "name": "previousOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "newOwner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
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
    "name": "UserActivated",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "activatedBy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "UserDeactivated",
    "inputs": [
      {
        "name": "user",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "deactivatedBy",
        "type": "address",
        "indexed": true,
        "internalType": "address"
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
    "name": "OwnableInvalidOwner",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "internalType": "address"
      }
    ]
  },
  {
    "type": "error",
    "name": "OwnableUnauthorizedAccount",
    "inputs": [
      {
        "name": "account",
        "type": "address",
        "internalType": "address"
      }
    ]
  }
] as const;

export interface RegistrationContractContract {
  _setTestVerifier(: string): Promise<void>;
  activateUser(_user: string): Promise<void>;
  activeUsers(_user: string): Promise<boolean>;
  addAdmin(_newAdmin: string): Promise<void>;
  addOwner(_newOwner: string): Promise<void>;
  admin(): Promise<string>;
  adminModule(): Promise<string>;
  admins(_admin: string): Promise<boolean>;
  batchActivateUsers(_users: string[]): Promise<void>;
  batchDeactivateUsers(_users: string[]): Promise<void>;
  completeOrganizationRegistration(organizationName: string, domain: string, _role: number): Promise<void>;
  deactivateUser(_user: string): Promise<void>;
  deactivationTimestamp(_user: string): Promise<bigint>;
  domainToAddress(_domain: string): Promise<string>;
  emailDomainProver(): Promise<string>;
  emailHashToAddress(_emailHash: string): Promise<string>;
  getDomainOwner(_domain: string): Promise<string>;
  getEmailHashOwner(_emailHash: string): Promise<string>;
  getOrganization(_organization: string): Promise<any>;
  getOwners(): Promise<string[]>;
  getUserActivationStatus(_user: string): Promise<boolean | bigint>;
  getUserRegistration(_user: string): Promise<number | boolean | bigint | string | string>;
  isDomainRegistered(_domain: string): Promise<boolean>;
  isEmailHashUsed(_emailHash: string): Promise<boolean>;
  isOwner(_address: string): Promise<boolean>;
  isUserActive(_user: string): Promise<boolean>;
  isUserVerified(_user: string): Promise<boolean>;
  organizationModule(): Promise<string>;
  organizations(_org: string): Promise<string | string | number | bigint | boolean | string>;
  owner(): Promise<string>;
  owners(_owner: string): Promise<boolean>;
  patientCommitments(_patient: string): Promise<string>;
  patientModule(): Promise<string>;
  registerOrganization(proof: any, orgData: any, _role: number): Promise<void>;
  registerPatient(_commitment: string): Promise<void>;
  registrationTimestamps(_user: string): Promise<bigint>;
  removeAdmin(_admin: string): Promise<void>;
  removeOwner(_owner: string): Promise<void>;
  renounceOwnership(): Promise<void>;
  resetEmailHash(_emailHash: string): Promise<void>;
  roles(_user: string): Promise<number>;
  storageContract(): Promise<string>;
  transferOwnership(newOwner: string): Promise<void>;
  updateVerificationStatus(_user: string, _verified: boolean): Promise<void>;
  usedEmailHashes(_emailHash: string): Promise<boolean>;
  verified(_user: string): Promise<boolean>;
  verifier(): Promise<string>;
  verifyAndStoreURL(proof: any, domain: string, emailHash: string): Promise<void>;
  verifyDomainOwnership(proof: any, emailHash: string, targetWallet: string, domain: string): Promise<void>;
  verifyPatientCommitment(_secret: string): Promise<boolean>;
}

export interface RegistrationContractEvents {
  AdminAdded: { admin: string };
  AdminRemoved: { admin: string };
  DomainVerified: { user: string, domain: string, emailHash: string, timestamp: bigint };
  EmailProofVerified: { organization: string, domain: string, emailHash: string, timestamp: bigint };
  OrganizationRegistered: { organization: string, domain: string, name: string, role: number, timestamp: bigint };
  OwnerAdded: { newOwner: string, addedBy: string };
  OwnerRemoved: { removedOwner: string, removedBy: string };
  OwnershipTransferRequested: { currentOwner: string, newOwner: string };
  OwnershipTransferred: { previousOwner: string, newOwner: string };
  PatientRegistered: { patient: string, commitment: string, timestamp: bigint };
  RoleAssigned: { user: string, role: number, timestamp: bigint };
  UserActivated: { user: string, activatedBy: string };
  UserDeactivated: { user: string, deactivatedBy: string };
  VerificationStatusChanged: { user: string, verified: boolean, timestamp: bigint };
}

export type RegistrationContractAddress = `0x${string}`;

// Usage example with viem:
// const contract = getContract({
//   address: "0x...", // from deployment-local.json
//   abi: RegistrationContractABI,
//   client: publicClient,
// });

// Usage example with thirdweb:
// const contract = getContract({
//   client,
//   chain: defineChain(31337),
//   address: "0x...", // from deployment-local.json
//   abi: RegistrationContractABI,
// });

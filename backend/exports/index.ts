/**
 * zkMed Contract ABIs and Bytecode
 * 
 * Auto-generated from Foundry build artifacts
 * Generated at: 2025-05-31T01:54:51.712Z
 */


// RegistrationContract Contract
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

export const RegistrationContractBytecode = "0x60a060405234801561000f575f5ffd5b5060405161af6338038061af638339818101604052810190610031919061073b565b61003f6102d960201b60201c565b5f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff1660808173ffffffffffffffffffffffffffffffffffffffff16815250508060015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503360025f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600b5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff021916908315150217905550600460055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff021916908360048111156101e6576101e5610766565b5b0217905550600160065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555042600a5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055503373ffffffffffffffffffffffffffffffffffffffff167fb7f677009e40b63d956ecadcfcb1f65c754aa8f19532b58a315c47d23dfcbdcb6004426040516102cb9291906107f1565b60405180910390a250610a08565b5f6102e861047560201b60201c565b156103e4575f30306040516102fc906106c3565b610307929190610827565b604051809103905ff080158015610320573d5f5f3e3d5ffd5b5090508073ffffffffffffffffffffffffffffffffffffffff166384cf84e17fdcb00648ecc90d8bfe92aa8d51061beb0bcb110d274fc4a517e526574233d36b5f1b6040518263ffffffff1660e01b815260040161037e9190610866565b5f604051808303815f87803b158015610395575f5ffd5b505af11580156103a7573d5f5f3e3d5ffd5b50505050806040516103b8906106d0565b6103c291906108da565b604051809103905ff0801580156103db573d5f5f3e3d5ffd5b50915050610472565b6103f261049e60201b60201c565b15610411575f61040661050660201b60201c565b905080915050610472565b61041f61052660201b60201c565b15610440575f61043361058a60201b60201c565b9250505080915050610472565b6040517f7a47c9a200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b90565b5f6104846105e660201b60201c565b8061049957506104986105fe60201b60201c565b5b905090565b5f60014614806104ae5750600a46145b806104b95750608946145b806104c5575061014446145b806104d157506101e046145b806104dd575061210546145b806104e9575061a4b146145b806104f5575061a4ba46145b80610501575061e70846145b905090565b5f5f735553cf6ce25e3f80fad2866f6230346159ecd89c90508091505090565b5f62aa36a7461480610539575061012c46145b8061054557506112c146145b80610551575061e70546145b8061055e57506201388246145b8061056b575062014a3446145b80610578575062066eee46145b80610585575062aa37dc46145b905090565b5f5f5f5f739e30dc3e49c4d47f982902710616dcc4b6ff7bf590505f737e231cfc3e3b549633d5ad61c30f07dd4d408ad390505f738972b6ff413ac04e61e19f07d7f3bd980d0cc3219050828282955095509550505050909192565b5f617a694614806105f957506204991946145b905090565b5f5f5f601e73f4e4fdca9d5d55e64525e314391996a15f7ec6006106229190610920565b73ffffffffffffffffffffffffffffffffffffffff1660405161064490610994565b5f60405180830381855afa9150503d805f811461067c576040519150601f19603f3d011682016040523d82523d5f602084013e610681565b606091505b509150915081158061069357505f8151145b156106a2575f925050506106c0565b5f818060200190518101906106b791906109dd565b90508093505050505b90565b611fd0806168e783390190565b6126ac806188b783390190565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f61070a826106e1565b9050919050565b61071a81610700565b8114610724575f5ffd5b50565b5f8151905061073581610711565b92915050565b5f602082840312156107505761074f6106dd565b5b5f61075d84828501610727565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b600581106107a4576107a3610766565b5b50565b5f8190506107b482610793565b919050565b5f6107c3826107a7565b9050919050565b6107d3816107b9565b82525050565b5f819050919050565b6107eb816107d9565b82525050565b5f6040820190506108045f8301856107ca565b61081160208301846107e2565b9392505050565b61082181610700565b82525050565b5f60408201905061083a5f830185610818565b6108476020830184610818565b9392505050565b5f819050919050565b6108608161084e565b82525050565b5f6020820190506108795f830184610857565b92915050565b5f819050919050565b5f6108a261089d610898846106e1565b61087f565b6106e1565b9050919050565b5f6108b382610888565b9050919050565b5f6108c4826108a9565b9050919050565b6108d4816108ba565b82525050565b5f6020820190506108ed5f8301846108cb565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61092a826106e1565b9150610935836106e1565b9250828201905073ffffffffffffffffffffffffffffffffffffffff811115610961576109606108f3565b5b92915050565b5f81905092915050565b50565b5f61097f5f83610967565b915061098a82610971565b5f82019050919050565b5f61099e82610974565b9150819050919050565b5f8115159050919050565b6109bc816109a8565b81146109c6575f5ffd5b50565b5f815190506109d7816109b3565b92915050565b5f602082840312156109f2576109f16106dd565b5b5f6109ff848285016109c9565b91505092915050565b608051615ec7610a205f395f6128010152615ec75ff3fe608060405234801561000f575f5ffd5b50600436106101d8575f3560e01c80635a1f7406116101025780639cd16498116100a0578063bececd4e1161006f578063bececd4e146105ed578063d2c30a6d14610609578063d560c83b14610639578063f851a44014610669576101d8565b80639cd1649814610555578063a014479614610571578063a3efb65c146105a1578063ace417e0146105bd576101d8565b806370480275116100dc57806370480275146104d15780638ebc10d9146104ed57806399374642146105095780639b8b30c814610539576101d8565b80635a1f74061461046257806365629b43146104975780636d9a4335146104b3576101d8565b80631c4527811161017a5780632d89988e116101495780632d89988e146103b6578063429b62e5146103e65780634acd01f614610416578063555d22be14610446576101d8565b80631c4527811461030857806325970115146103385780632640bf92146103685780632b7ac3f314610398576101d8565b8063105bcb57116101b6578063105bcb571461027057806314d23038146102a05780631785f53c146102bc57806318ff0f67146102d8576101d8565b806302158ec4146101dc57806302b949d91461020c5780630db065f414610240575b5f5ffd5b6101f660048036038101906101f19190613e19565b610687565b6040516102039190613e5e565b60405180910390f35b61022660048036038101906102219190613ed1565b6106a4565b604051610237959493929190613ff7565b60405180910390f35b61025a60048036038101906102559190613ed1565b610979565b6040516102679190613e5e565b60405180910390f35b61028a60048036038101906102859190614182565b610996565b60405161029791906141d8565b60405180910390f35b6102ba60048036038101906102b59190614271565b6109de565b005b6102d660048036038101906102d19190613ed1565b610db6565b005b6102f260048036038101906102ed9190613e19565b611027565b6040516102ff9190613e5e565b60405180910390f35b610322600480360381019061031d91906142f9565b61104d565b60405161032f9190613e5e565b60405180910390f35b610352600480360381019061034d91906142f9565b6110c5565b60405161035f91906141d8565b60405180910390f35b610382600480360381019061037d9190613e19565b61110e565b60405161038f91906141d8565b60405180910390f35b6103a061113e565b6040516103ad919061439f565b60405180910390f35b6103d060048036038101906103cb9190613e19565b611162565b6040516103dd91906141d8565b60405180910390f35b61040060048036038101906103fb9190613ed1565b61119b565b60405161040d9190613e5e565b60405180910390f35b610430600480360381019061042b9190614182565b6111b8565b60405161043d9190613e5e565b60405180910390f35b610460600480360381019061045b91906143b8565b6112dd565b005b61047c60048036038101906104779190613ed1565b611646565b60405161048e9695949392919061443b565b60405180910390f35b6104b160048036038101906104ac91906144e9565b6117a2565b005b6104bb612031565b6040516104c891906141d8565b60405180910390f35b6104eb60048036038101906104e69190613ed1565b612056565b005b61050760048036038101906105029190613e19565b61248b565b005b610523600480360381019061051e9190613ed1565b6127e2565b6040516105309190614558565b60405180910390f35b610553600480360381019061054e91906145ac565b6127ff565b005b61056f600480360381019061056a9190613e19565b6129ff565b005b61058b60048036038101906105869190613ed1565b612b0a565b60405161059891906145d7565b60405180910390f35b6105bb60048036038101906105b691906145f0565b612b1f565b005b6105d760048036038101906105d29190613ed1565b6130af565b6040516105e49190613e5e565b60405180910390f35b610607600480360381019061060291906146ab565b61317a565b005b610623600480360381019061061e9190613ed1565b6133b1565b60405161063091906147fa565b60405180910390f35b610653600480360381019061064e9190613ed1565b6136b7565b604051610660919061481a565b60405180910390f35b6106716136cc565b60405161067e91906141d8565b60405180910390f35b6009602052805f5260405f205f915054906101000a900460ff1681565b5f5f5f60608060055f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16945060065f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff169350600a5f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205492506002600481111561079657610795613efc565b5b8560048111156107a9576107a8613efc565b5b14806107d95750600360048111156107c4576107c3613efc565b5b8560048111156107d7576107d6613efc565b5b145b156109705760045f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f01805461082890614860565b80601f016020809104026020016040519081016040528092919081815260200182805461085490614860565b801561089f5780601f106108765761010080835404028352916020019161089f565b820191905f5260205f20905b81548152906001019060200180831161088257829003601f168201915b5050505050915060045f8773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2060010180546108f190614860565b80601f016020809104026020016040519081016040528092919081815260200182805461091d90614860565b80156109685780601f1061093f57610100808354040283529160200191610968565b820191905f5260205f20905b81548152906001019060200180831161094b57829003601f168201915b505050505090505b91939590929450565b6006602052805f5260405f205f915054906101000a900460ff1681565b6007818051602081018201805184825260208301602085012081835280955050505050505f915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f60048111156109f1576109f0613efc565b5b60055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff166004811115610a4d57610a4c613efc565b5b14610a8d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a84906148da565b60405180910390fd5b81815f8282905011610ad4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610acb90614942565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff1660078383604051610afd92919061498e565b90815260200160405180910390205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614610b81576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b78906149f0565b60405180910390fd5b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff166385a4588d60e01b610bb582826136f1565b3373ffffffffffffffffffffffffffffffffffffffff168773ffffffffffffffffffffffffffffffffffffffff1614610c23576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c1a90614a58565b60405180910390fd5b60095f8981526020019081526020015f205f9054906101000a900460ff1615610c81576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c7890614ac0565b60405180910390fd5b600160095f8a81526020019081526020015f205f6101000a81548160ff0219169083151502179055503360078787604051610cbd92919061498e565b90815260200160405180910390205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503360085f8a81526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff167f21cb5085ef1e64af29d5aed1fa723be410a7b1332bd88fe7781009e38327f9f687878b42604051610da39493929190614b0a565b60405180910390a2505050505050505050565b600b5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1680610e57575060025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b610e96576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e8d90614b92565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff1603610f04576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610efb90614bfa565b60405180910390fd5b600b5f8273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16610f8d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f8490614c62565b60405180910390fd5b5f600b5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508073ffffffffffffffffffffffffffffffffffffffff167fa3b62bc36326052d97ea62d63c3d60308ed4c3ea8ac079dd8499f1e9c4f80c0f60405160405180910390a250565b5f60095f8381526020019081526020015f205f9054906101000a900460ff169050919050565b5f5f73ffffffffffffffffffffffffffffffffffffffff166007848460405161107792919061498e565b90815260200160405180910390205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff161415905092915050565b5f600783836040516110d892919061498e565b90815260200160405180910390205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff16905092915050565b6008602052805f5260405f205f915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f60085f8381526020019081526020015f205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050919050565b600b602052805f5260405f205f915054906101000a900460ff1681565b5f600160048111156111cd576111cc613efc565b5b60055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16600481111561122957611228613efc565b5b14611269576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161126090614cca565b60405180910390fd5b5f823360405160200161127d929190614d5d565b6040516020818303038152906040528051906020012090508060035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205414915050919050565b5f60048111156112f0576112ef613efc565b5b60055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16600481111561134c5761134b613efc565b5b1461138c576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611383906148da565b60405180910390fd5b82825f82829050116113d3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113ca90614942565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff16600783836040516113fc92919061498e565b90815260200160405180910390205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611480576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611477906149f0565b60405180910390fd5b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1663642dc55c60e01b6114b482826136f1565b60095f8681526020019081526020015f205f9054906101000a900460ff1615611512576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161150990614ac0565b60405180910390fd5b600160095f8781526020019081526020015f205f6101000a81548160ff021916908315150217905550336007888860405161154e92919061498e565b90815260200160405180910390205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503360085f8781526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503373ffffffffffffffffffffffffffffffffffffffff167f21cb5085ef1e64af29d5aed1fa723be410a7b1332bd88fe7781009e38327f9f6888888426040516116349493929190614b0a565b60405180910390a25050505050505050565b6004602052805f5260405f205f91509050805f01805461166590614860565b80601f016020809104026020016040519081016040528092919081815260200182805461169190614860565b80156116dc5780601f106116b3576101008083540402835291602001916116dc565b820191905f5260205f20905b8154815290600101906020018083116116bf57829003601f168201915b5050505050908060010180546116f190614860565b80601f016020809104026020016040519081016040528092919081815260200182805461171d90614860565b80156117685780601f1061173f57610100808354040283529160200191611768565b820191905f5260205f20905b81548152906001019060200180831161174b57829003601f168201915b505050505090806002015f9054906101000a900460ff1690806003015490806004015f9054906101000a900460ff16908060050154905086565b5f60048111156117b5576117b4613efc565b5b60055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16600481111561181157611810613efc565b5b14611851576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611848906148da565b60405180910390fd5b8180602001906118619190614d90565b5f82829050116118a6576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161189d90614942565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff16600783836040516118cf92919061498e565b90815260200160405180910390205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614611953576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161194a906149f0565b60405180910390fd5b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1663a62dac9c60e01b61198782826136f1565b3373ffffffffffffffffffffffffffffffffffffffff168660400160208101906119b19190613ed1565b73ffffffffffffffffffffffffffffffffffffffff1614611a07576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016119fe90614a58565b60405180910390fd5b60026004811115611a1b57611a1a613efc565b5b856004811115611a2e57611a2d613efc565b5b1480611a5e575060036004811115611a4957611a48613efc565b5b856004811115611a5c57611a5b613efc565b5b145b611a9d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611a9490614e3c565b60405180910390fd5b5f86805f0190611aad9190614d90565b905011611aef576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611ae690614eca565b60405180910390fd5b60095f876060013581526020019081526020015f205f9054906101000a900460ff1615611b51576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401611b4890614ac0565b60405180910390fd5b600160095f886060013581526020019081526020015f205f6101000a81548160ff0219169083151502179055506040518060c0016040528087805f0190611b989190614d90565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f820116905080830192505050505050508152602001878060200190611bef9190614d90565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f820116905080830192505050505050508152602001866004811115611c4957611c48613efc565b5b8152602001428152602001600115158152602001876060013581525060045f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f820151815f019081611cb5919061507f565b506020820151816001019081611ccb919061507f565b506040820151816002015f6101000a81548160ff02191690836004811115611cf657611cf5613efc565b5b0217905550606082015181600301556080820151816004015f6101000a81548160ff02191690831515021790555060a082015181600501559050508460055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690836004811115611d9057611d8f613efc565b5b0217905550600160065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555042600a5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550336007878060200190611e3f9190614d90565b604051611e4d92919061498e565b90815260200160405180910390205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055503360085f886060013581526020019081526020015f205f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550858060200190611efb9190614d90565b604051611f0992919061498e565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167f05d91bf902c32e68cecd5180de147ba30644d76463ec9da4e8512148cb83927188805f0190611f589190614d90565b8942604051611f6a949392919061514e565b60405180910390a33373ffffffffffffffffffffffffffffffffffffffff167fb7f677009e40b63d956ecadcfcb1f65c754aa8f19532b58a315c47d23dfcbdcb8642604051611fba92919061518c565b60405180910390a23373ffffffffffffffffffffffffffffffffffffffff167fa6130fca2eac7ee26dbd1371b3e9d8db485b3150b5bdcf25c3f6759938f98a9487806020019061200a9190614d90565b8960600135426040516120209493929190614b0a565b60405180910390a250505050505050565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600b5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16806120f7575060025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b612136576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161212d90614b92565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16036121a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161219b906151fd565b60405180910390fd5b600b5f8273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff161561222e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161222590615265565b60405180910390fd5b6001600b5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055505f600481111561229657612295613efc565b5b60055f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1660048111156122f2576122f1613efc565b5b0361244557600460055f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083600481111561235757612356613efc565b5b0217905550600160065f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555042600a5f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508073ffffffffffffffffffffffffffffffffffffffff167fb7f677009e40b63d956ecadcfcb1f65c754aa8f19532b58a315c47d23dfcbdcb60044260405161243c92919061518c565b60405180910390a25b8073ffffffffffffffffffffffffffffffffffffffff167f44d6d25963f097ad14f29f06854a01f575648a1ef82f30e562ccd3889717e33960405160405180910390a250565b5f600481111561249e5761249d613efc565b5b60055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1660048111156124fa576124f9613efc565b5b1461253a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612531906148da565b60405180910390fd5b805f5f1b810361257f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612576906152cd565b60405180910390fd5b5f5f1b60035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205414612600576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016125f790615335565b60405180910390fd5b8160035f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550600160055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff021916908360048111156126a2576126a1613efc565b5b0217905550600160065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555042600a5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f2081905550813373ffffffffffffffffffffffffffffffffffffffff167fa6b52db6073bb31c3809fa0524ce3459bec174b0f4800a32cdf84729b823585e42604051612785919061481a565b60405180910390a33373ffffffffffffffffffffffffffffffffffffffff167fb7f677009e40b63d956ecadcfcb1f65c754aa8f19532b58a315c47d23dfcbdcb6001426040516127d692919061518c565b60405180910390a25050565b6005602052805f5260405f205f915054906101000a900460ff1681565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461288d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612884906153c3565b60405180910390fd5b612895613790565b806128a457506128a36137ad565b5b6128e3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016128da90615451565b60405180910390fd5b5f73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16633fd66f226040518163ffffffff1660e01b8152600401602060405180830381865afa158015612943573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061296791906154aa565b73ffffffffffffffffffffffffffffffffffffffff16036129bd576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016129b490615545565b60405180910390fd5b805f5f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600b5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1680612aa0575060025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b612adf576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612ad690614b92565b60405180910390fd5b5f60095f8381526020019081526020015f205f6101000a81548160ff02191690831515021790555050565b6003602052805f5260405f205f915090505481565b5f6004811115612b3257612b31613efc565b5b60055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff166004811115612b8e57612b8d613efc565b5b14612bce576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612bc5906148da565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff1660078484604051612bf792919061498e565b90815260200160405180910390205f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614612c7b576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612c72906155d3565b60405180910390fd5b60026004811115612c8f57612c8e613efc565b5b816004811115612ca257612ca1613efc565b5b1480612cd2575060036004811115612cbd57612cbc613efc565b5b816004811115612cd057612ccf613efc565b5b145b612d11576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612d0890614e3c565b60405180910390fd5b5f8585905011612d56576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401612d4d90614eca565b60405180910390fd5b5f5f5f1b90506040518060c0016040528087878080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f82011690508083019250505050505050815260200185858080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f820116905080830192505050505050508152602001836004811115612e0c57612e0b613efc565b5b81526020014281526020016001151581526020018281525060045f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f820151815f019081612e74919061507f565b506020820151816001019081612e8a919061507f565b506040820151816002015f6101000a81548160ff02191690836004811115612eb557612eb4613efc565b5b0217905550606082015181600301556080820151816004015f6101000a81548160ff02191690831515021790555060a082015181600501559050508160055f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690836004811115612f4f57612f4e613efc565b5b0217905550600160065f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555042600a5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f20819055508383604051612ffb92919061498e565b60405180910390203373ffffffffffffffffffffffffffffffffffffffff167f05d91bf902c32e68cecd5180de147ba30644d76463ec9da4e8512148cb8392718888864260405161304f949392919061514e565b60405180910390a33373ffffffffffffffffffffffffffffffffffffffff167fb7f677009e40b63d956ecadcfcb1f65c754aa8f19532b58a315c47d23dfcbdcb834260405161309f92919061518c565b60405180910390a2505050505050565b5f5f60048111156130c3576130c2613efc565b5b60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16600481111561311f5761311e613efc565b5b14158015613173575060065f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff165b9050919050565b600b5f3373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff168061321b575060025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16145b61325a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161325190614b92565b60405180910390fd5b5f600481111561326d5761326c613efc565b5b60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1660048111156132c9576132c8613efc565b5b03613309576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016133009061563b565b60405180910390fd5b8060065f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff167f32ba28c3fa8c3f5101d8ca9fc54eb5fbf2d633cde38c4f944ab033bd50eb506782426040516133a5929190615659565b60405180910390a25050565b6133b9613c85565b600260048111156133cd576133cc613efc565b5b60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16600481111561342957613428613efc565b5b14806134a257506003600481111561344457613443613efc565b5b60055f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff1660048111156134a05761349f613efc565b5b145b6134e1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016134d8906156ca565b60405180910390fd5b60045f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f206040518060c00160405290815f8201805461353890614860565b80601f016020809104026020016040519081016040528092919081815260200182805461356490614860565b80156135af5780601f10613586576101008083540402835291602001916135af565b820191905f5260205f20905b81548152906001019060200180831161359257829003601f168201915b505050505081526020016001820180546135c890614860565b80601f01602080910402602001604051908101604052809291908181526020018280546135f490614860565b801561363f5780601f106136165761010080835404028352916020019161363f565b820191905f5260205f20905b81548152906001019060200180831161362257829003601f168201915b50505050508152602001600282015f9054906101000a900460ff16600481111561366c5761366b613efc565b5b600481111561367e5761367d613efc565b5b815260200160038201548152602001600482015f9054906101000a900460ff161515151581526020016005820154815250509050919050565b600a602052805f5260405f205f915090505481565b60025f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b5f5f6136fb613811565b915091505f5f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1663c4fa74e5838387876040518563ffffffff1660e01b815260040161375e949392919061591b565b5f6040518083038186803b158015613774575f5ffd5b505afa158015613786573d5f5f3e3d5ffd5b5050505050505050565b5f613799613b91565b806137a857506137a7613ba9565b5b905090565b5f62aa36a74614806137c0575061012c46145b806137cc57506112c146145b806137d8575061e70546145b806137e557506201388246145b806137f2575062014a3446145b806137ff575062066eee46145b8061380c575062aa37dc46145b905090565b613819613ccb565b5f5f5f36600490809261382e9392919061596a565b81019061383b9190615c32565b90505f60208060208060206138509190615c8b565b61385a9190615c8b565b6138649190615c8b565b61386e9190615c8b565b602080602061010060206138829190615c8b565b61388c9190615c8b565b6138969190615c8b565b6138a09190615c8b565b60046138ac9190615c8b565b6138b69190615c8b565b90505f60208060208060206138cb9190615c8b565b6138d59190615c8b565b6138df9190615c8b565b6138e99190615c8b565b60208060208060206138fb9190615c8b565b6139059190615c8b565b61390f9190615c8b565b6139199190615c8b565b6020806020610100602061392d9190615c8b565b6139379190615c8b565b6139419190615c8b565b61394b9190615c8b565b6139559190615c8b565b84604001516139649190615cbe565b61396e9190615cbe565b90505f818361397d9190615c8b565b90505f5f36602080602061010060206139969190615c8b565b6139a09190615c8b565b6139aa9190615c8b565b6139b49190615c8b565b60046139c09190615c8b565b9060208060208060206139d39190615c8b565b6139dd9190615c8b565b6139e79190615c8b565b6139f19190615c8b565b60208060206101006020613a059190615c8b565b613a0f9190615c8b565b613a199190615c8b565b613a239190615c8b565b6004613a2f9190615c8b565b613a399190615c8b565b92613a469392919061596a565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f8201169050808301925050505050505090505f5f3686908592613a9d9392919061596a565b8080601f0160208091040260200160405190810160405280939291908181526020018383808284375f81840152601f19601f8201169050808301925050505050505090505f82613aeb613c6e565b604051602001613afb9190615cf1565b60405160208183030381529060405283604051602001613b1d93929190615d4f565b60405160208183030381529060405290505f600282604051613b3f9190615d7f565b602060405180830381855afa158015613b5a573d5f5f3e3d5ffd5b5050506040513d601f19601f82011682018060405250810190613b7d9190615da9565b905087819950995050505050505050509091565b5f617a69461480613ba457506204991946145b905090565b5f5f5f601e73f4e4fdca9d5d55e64525e314391996a15f7ec600613bcd9190615dd4565b73ffffffffffffffffffffffffffffffffffffffff16604051613bef90615e3e565b5f60405180830381855afa9150503d805f8114613c27576040519150601f19603f3d011682016040523d82523d5f602084013e613c2c565b606091505b5091509150811580613c3e57505f8151145b15613c4d575f92505050613c6b565b5f81806020019051810190613c629190615e66565b90508093505050505b90565b613c76613ccb565b613c7e613ccb565b8091505090565b6040518060c0016040528060608152602001606081526020015f6004811115613cb157613cb0613efc565b5b81526020015f81526020015f151581526020015f81525090565b6040518060800160405280613cde613cfd565b81526020015f81526020015f8152602001613cf7613d53565b81525090565b60405180606001604052805f7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152602001613d35613db2565b81526020015f6001811115613d4d57613d4c613efc565b5b81525090565b6040518060a001604052805f73ffffffffffffffffffffffffffffffffffffffff1681526020015f7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020015f81526020015f81526020015f81525090565b604051806101000160405280600890602082028036833780820191505090505090565b5f604051905090565b5f5ffd5b5f5ffd5b5f819050919050565b613df881613de6565b8114613e02575f5ffd5b50565b5f81359050613e1381613def565b92915050565b5f60208284031215613e2e57613e2d613dde565b5b5f613e3b84828501613e05565b91505092915050565b5f8115159050919050565b613e5881613e44565b82525050565b5f602082019050613e715f830184613e4f565b92915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f613ea082613e77565b9050919050565b613eb081613e96565b8114613eba575f5ffd5b50565b5f81359050613ecb81613ea7565b92915050565b5f60208284031215613ee657613ee5613dde565b5b5f613ef384828501613ebd565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b60058110613f3a57613f39613efc565b5b50565b5f819050613f4a82613f29565b919050565b5f613f5982613f3d565b9050919050565b613f6981613f4f565b82525050565b5f819050919050565b613f8181613f6f565b82525050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f613fc982613f87565b613fd38185613f91565b9350613fe3818560208601613fa1565b613fec81613faf565b840191505092915050565b5f60a08201905061400a5f830188613f60565b6140176020830187613e4f565b6140246040830186613f78565b81810360608301526140368185613fbf565b9050818103608083015261404a8184613fbf565b90509695505050505050565b5f5ffd5b5f5ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61409482613faf565b810181811067ffffffffffffffff821117156140b3576140b261405e565b5b80604052505050565b5f6140c5613dd5565b90506140d1828261408b565b919050565b5f67ffffffffffffffff8211156140f0576140ef61405e565b5b6140f982613faf565b9050602081019050919050565b828183375f83830152505050565b5f614126614121846140d6565b6140bc565b9050828152602081018484840111156141425761414161405a565b5b61414d848285614106565b509392505050565b5f82601f83011261416957614168614056565b5b8135614179848260208601614114565b91505092915050565b5f6020828403121561419757614196613dde565b5b5f82013567ffffffffffffffff8111156141b4576141b3613de2565b5b6141c084828501614155565b91505092915050565b6141d281613e96565b82525050565b5f6020820190506141eb5f8301846141c9565b92915050565b5f5ffd5b5f610220828403121561420b5761420a6141f1565b5b81905092915050565b5f5ffd5b5f5ffd5b5f5f83601f84011261423157614230614056565b5b8235905067ffffffffffffffff81111561424e5761424d614214565b5b60208301915083600182028301111561426a57614269614218565b5b9250929050565b5f5f5f5f5f610280868803121561428b5761428a613dde565b5b5f614298888289016141f5565b9550506102206142aa88828901613e05565b9450506102406142bc88828901613ebd565b93505061026086013567ffffffffffffffff8111156142de576142dd613de2565b5b6142ea8882890161421c565b92509250509295509295909350565b5f5f6020838503121561430f5761430e613dde565b5b5f83013567ffffffffffffffff81111561432c5761432b613de2565b5b6143388582860161421c565b92509250509250929050565b5f819050919050565b5f61436761436261435d84613e77565b614344565b613e77565b9050919050565b5f6143788261434d565b9050919050565b5f6143898261436e565b9050919050565b6143998161437f565b82525050565b5f6020820190506143b25f830184614390565b92915050565b5f5f5f5f61026085870312156143d1576143d0613dde565b5b5f6143de878288016141f5565b94505061022085013567ffffffffffffffff811115614400576143ff613de2565b5b61440c8782880161421c565b935093505061024061442087828801613e05565b91505092959194509250565b61443581613de6565b82525050565b5f60c0820190508181035f8301526144538189613fbf565b905081810360208301526144678188613fbf565b90506144766040830187613f60565b6144836060830186613f78565b6144906080830185613e4f565b61449d60a083018461442c565b979650505050505050565b5f60a082840312156144bd576144bc6141f1565b5b81905092915050565b600581106144d2575f5ffd5b50565b5f813590506144e3816144c6565b92915050565b5f5f5f610260848603121561450157614500613dde565b5b5f61450e868287016141f5565b93505061022084013567ffffffffffffffff8111156145305761452f613de2565b5b61453c868287016144a8565b92505061024061454e868287016144d5565b9150509250925092565b5f60208201905061456b5f830184613f60565b92915050565b5f61457b82613e96565b9050919050565b61458b81614571565b8114614595575f5ffd5b50565b5f813590506145a681614582565b92915050565b5f602082840312156145c1576145c0613dde565b5b5f6145ce84828501614598565b91505092915050565b5f6020820190506145ea5f83018461442c565b92915050565b5f5f5f5f5f6060868803121561460957614608613dde565b5b5f86013567ffffffffffffffff81111561462657614625613de2565b5b6146328882890161421c565b9550955050602086013567ffffffffffffffff81111561465557614654613de2565b5b6146618882890161421c565b93509350506040614674888289016144d5565b9150509295509295909350565b61468a81613e44565b8114614694575f5ffd5b50565b5f813590506146a581614681565b92915050565b5f5f604083850312156146c1576146c0613dde565b5b5f6146ce85828601613ebd565b92505060206146df85828601614697565b9150509250929050565b5f82825260208201905092915050565b5f61470382613f87565b61470d81856146e9565b935061471d818560208601613fa1565b61472681613faf565b840191505092915050565b61473a81613f4f565b82525050565b61474981613f6f565b82525050565b61475881613e44565b82525050565b61476781613de6565b82525050565b5f60c083015f8301518482035f86015261478782826146f9565b915050602083015184820360208601526147a182826146f9565b91505060408301516147b66040860182614731565b5060608301516147c96060860182614740565b5060808301516147dc608086018261474f565b5060a08301516147ef60a086018261475e565b508091505092915050565b5f6020820190508181035f830152614812818461476d565b905092915050565b5f60208201905061482d5f830184613f78565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602260045260245ffd5b5f600282049050600182168061487757607f821691505b60208210810361488a57614889614833565b5b50919050565b7f416c7265616479207265676973746572656400000000000000000000000000005f82015250565b5f6148c4601283613f91565b91506148cf82614890565b602082019050919050565b5f6020820190508181035f8301526148f1816148b8565b9050919050565b7f446f6d61696e2063616e6e6f7420626520656d707479000000000000000000005f82015250565b5f61492c601683613f91565b9150614937826148f8565b602082019050919050565b5f6020820190508181035f83015261495981614920565b9050919050565b5f81905092915050565b5f6149758385614960565b9350614982838584614106565b82840190509392505050565b5f61499a82848661496a565b91508190509392505050565b7f446f6d61696e20616c72656164792072656769737465726564000000000000005f82015250565b5f6149da601983613f91565b91506149e5826149a6565b602082019050919050565b5f6020820190508181035f830152614a07816149ce565b9050919050565b7f5461726765742077616c6c6574206d69736d61746368000000000000000000005f82015250565b5f614a42601683613f91565b9150614a4d82614a0e565b602082019050919050565b5f6020820190508181035f830152614a6f81614a36565b9050919050565b7f456d61696c206861736820616c726561647920757365640000000000000000005f82015250565b5f614aaa601783613f91565b9150614ab582614a76565b602082019050919050565b5f6020820190508181035f830152614ad781614a9e565b9050919050565b5f614ae98385613f91565b9350614af6838584614106565b614aff83613faf565b840190509392505050565b5f6060820190508181035f830152614b23818688614ade565b9050614b32602083018561442c565b614b3f6040830184613f78565b95945050505050565b7f4e6f742061646d696e00000000000000000000000000000000000000000000005f82015250565b5f614b7c600983613f91565b9150614b8782614b48565b602082019050919050565b5f6020820190508181035f830152614ba981614b70565b9050919050565b7f43616e6e6f742072656d6f76652073656c6600000000000000000000000000005f82015250565b5f614be4601283613f91565b9150614bef82614bb0565b602082019050919050565b5f6020820190508181035f830152614c1181614bd8565b9050919050565b7f4e6f7420616e2061646d696e00000000000000000000000000000000000000005f82015250565b5f614c4c600c83613f91565b9150614c5782614c18565b602082019050919050565b5f6020820190508181035f830152614c7981614c40565b9050919050565b7f4e6f74206120726567697374657265642070617469656e7400000000000000005f82015250565b5f614cb4601883613f91565b9150614cbf82614c80565b602082019050919050565b5f6020820190508181035f830152614ce181614ca8565b9050919050565b5f614cf282613f87565b614cfc8185614960565b9350614d0c818560208601613fa1565b80840191505092915050565b5f8160601b9050919050565b5f614d2e82614d18565b9050919050565b5f614d3f82614d24565b9050919050565b614d57614d5282613e96565b614d35565b82525050565b5f614d688285614ce8565b9150614d748284614d46565b6014820191508190509392505050565b5f5ffd5b5f5ffd5b5f5ffd5b5f5f83356001602003843603038112614dac57614dab614d84565b5b80840192508235915067ffffffffffffffff821115614dce57614dcd614d88565b5b602083019250600182023603831315614dea57614de9614d8c565b5b509250929050565b7f496e76616c6964206f7267616e697a6174696f6e20726f6c65000000000000005f82015250565b5f614e26601983613f91565b9150614e3182614df2565b602082019050919050565b5f6020820190508181035f830152614e5381614e1a565b9050919050565b7f4f7267616e697a6174696f6e206e616d652063616e6e6f7420626520656d70745f8201527f7900000000000000000000000000000000000000000000000000000000000000602082015250565b5f614eb4602183613f91565b9150614ebf82614e5a565b604082019050919050565b5f6020820190508181035f830152614ee181614ea8565b9050919050565b5f819050815f5260205f209050919050565b5f6020601f8301049050919050565b5f82821b905092915050565b5f60088302614f447fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82614f09565b614f4e8683614f09565b95508019841693508086168417925050509392505050565b5f614f80614f7b614f7684613f6f565b614344565b613f6f565b9050919050565b5f819050919050565b614f9983614f66565b614fad614fa582614f87565b848454614f15565b825550505050565b5f5f905090565b614fc4614fb5565b614fcf818484614f90565b505050565b5b81811015614ff257614fe75f82614fbc565b600181019050614fd5565b5050565b601f8211156150375761500881614ee8565b61501184614efa565b81016020851015615020578190505b61503461502c85614efa565b830182614fd4565b50505b505050565b5f82821c905092915050565b5f6150575f198460080261503c565b1980831691505092915050565b5f61506f8383615048565b9150826002028217905092915050565b61508882613f87565b67ffffffffffffffff8111156150a1576150a061405e565b5b6150ab8254614860565b6150b6828285614ff6565b5f60209050601f8311600181146150e7575f84156150d5578287015190505b6150df8582615064565b865550615146565b601f1984166150f586614ee8565b5f5b8281101561511c578489015182556001820191506020850194506020810190506150f7565b868310156151395784890151615135601f891682615048565b8355505b6001600288020188555050505b505050505050565b5f6060820190508181035f830152615167818688614ade565b90506151766020830185613f60565b6151836040830184613f78565b95945050505050565b5f60408201905061519f5f830185613f60565b6151ac6020830184613f78565b9392505050565b7f496e76616c69642061646d696e206164647265737300000000000000000000005f82015250565b5f6151e7601583613f91565b91506151f2826151b3565b602082019050919050565b5f6020820190508181035f830152615214816151db565b9050919050565b7f416c726561647920616e2061646d696e000000000000000000000000000000005f82015250565b5f61524f601083613f91565b915061525a8261521b565b602082019050919050565b5f6020820190508181035f83015261527c81615243565b9050919050565b7f496e76616c696420636f6d6d69746d656e7400000000000000000000000000005f82015250565b5f6152b7601283613f91565b91506152c282615283565b602082019050919050565b5f6020820190508181035f8301526152e4816152ab565b9050919050565b7f50617469656e7420616c72656164792068617320636f6d6d69746d656e7400005f82015250565b5f61531f601e83613f91565b915061532a826152eb565b602082019050919050565b5f6020820190508181035f83015261534c81615313565b9050919050565b7f4f6e6c79206465706c6f7965722063616e206368616e676520766572696669655f8201527f7200000000000000000000000000000000000000000000000000000000000000602082015250565b5f6153ad602183613f91565b91506153b882615353565b604082019050919050565b5f6020820190508181035f8301526153da816153a1565b9050919050565b7f4368616e67696e6720766572696669657273206973206f6e6c7920616c6c6f775f8201527f6564206f6e206465766e6574206f7220746573746e6574000000000000000000602082015250565b5f61543b603783613f91565b9150615446826153e1565b604082019050919050565b5f6020820190508181035f8301526154688161542f565b9050919050565b5f61547982613e96565b9050919050565b6154898161546f565b8114615493575f5ffd5b50565b5f815190506154a481615480565b92915050565b5f602082840312156154bf576154be613dde565b5b5f6154cc84828501615496565b91505092915050565b7f56657269666965722773207265706f7369746f727920616464726573732069735f8201527f206e6f7420736574000000000000000000000000000000000000000000000000602082015250565b5f61552f602883613f91565b915061553a826154d5565b604082019050919050565b5f6020820190508181035f83015261555c81615523565b9050919050565b7f446f6d61696e206e6f7420766572696669656420666f722074686973206164645f8201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b5f6155bd602483613f91565b91506155c882615563565b604082019050919050565b5f6020820190508181035f8301526155ea816155b1565b9050919050565b7f55736572206e6f742072656769737465726564000000000000000000000000005f82015250565b5f615625601383613f91565b9150615630826155f1565b602082019050919050565b5f6020820190508181035f83015261565281615619565b9050919050565b5f60408201905061566c5f830185613e4f565b6156796020830184613f78565b9392505050565b7f41646472657373206973206e6f7420616e206f7267616e697a6174696f6e00005f82015250565b5f6156b4601e83613f91565b91506156bf82615680565b602082019050919050565b5f6020820190508181035f8301526156e1816156a8565b9050919050565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61571c816156e8565b82525050565b5f60089050919050565b5f81905092915050565b5f819050919050565b5f61574a838361475e565b60208301905092915050565b5f602082019050919050565b61576b81615722565b615775818461572c565b925061578082615736565b805f5b838110156157b0578151615797878261573f565b96506157a283615756565b925050600181019050615783565b505050505050565b600281106157c9576157c8613efc565b5b50565b5f8190506157d9826157b8565b919050565b5f6157e8826157cc565b9050919050565b6157f8816157de565b82525050565b61014082015f8201516158135f850182615713565b5060208201516158266020850182615762565b50604082015161583a6101208501826157ef565b50505050565b61584981613e96565b82525050565b60a082015f8201516158635f850182615840565b5060208201516158766020850182615713565b5060408201516158896040850182614740565b50606082015161589c6060850182614740565b5060808201516158af608085018261475e565b50505050565b61022082015f8201516158ca5f8501826157fe565b5060208201516158de61014085018261475e565b5060408201516158f2610160850182614740565b50606082015161590661018085018261584f565b50505050565b615915816156e8565b82525050565b5f6102808201905061592f5f8301876158b5565b61593d61022083018661442c565b61594b6102408301856141c9565b61595961026083018461590c565b95945050505050565b5f5ffd5b5f5ffd5b5f5f8585111561597d5761597c615962565b5b8386111561598e5761598d615966565b5b6001850283019150848603905094509492505050565b5f5ffd5b6159b1816156e8565b81146159bb575f5ffd5b50565b5f813590506159cc816159a8565b92915050565b5f67ffffffffffffffff8211156159ec576159eb61405e565b5b602082029050919050565b5f615a09615a04846159d2565b6140bc565b90508060208402830185811115615a2357615a22614218565b5b835b81811015615a4c5780615a388882613e05565b845260208401935050602081019050615a25565b5050509392505050565b5f82601f830112615a6a57615a69614056565b5b6008615a778482856159f7565b91505092915050565b60028110615a8c575f5ffd5b50565b5f81359050615a9d81615a80565b92915050565b5f6101408284031215615ab957615ab86159a4565b5b615ac360606140bc565b90505f615ad2848285016159be565b5f830152506020615ae584828501615a56565b602083015250610120615afa84828501615a8f565b60408301525092915050565b615b0f81613f6f565b8114615b19575f5ffd5b50565b5f81359050615b2a81615b06565b92915050565b5f60a08284031215615b4557615b446159a4565b5b615b4f60a06140bc565b90505f615b5e84828501613ebd565b5f830152506020615b71848285016159be565b6020830152506040615b8584828501615b1c565b6040830152506060615b9984828501615b1c565b6060830152506080615bad84828501613e05565b60808301525092915050565b5f6102208284031215615bcf57615bce6159a4565b5b615bd960806140bc565b90505f615be884828501615aa3565b5f83015250610140615bfc84828501613e05565b602083015250610160615c1184828501615b1c565b604083015250610180615c2684828501615b30565b60608301525092915050565b5f6102208284031215615c4857615c47613dde565b5b5f615c5584828501615bb9565b91505092915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f615c9582613f6f565b9150615ca083613f6f565b9250828201905080821115615cb857615cb7615c5e565b5b92915050565b5f615cc882613f6f565b9150615cd383613f6f565b9250828203905081811115615ceb57615cea615c5e565b5b92915050565b5f61022082019050615d055f8301846158b5565b92915050565b5f81519050919050565b5f81905092915050565b5f615d2982615d0b565b615d338185615d15565b9350615d43818560208601613fa1565b80840191505092915050565b5f615d5a8286615d1f565b9150615d668285615d1f565b9150615d728284615d1f565b9150819050949350505050565b5f615d8a8284615d1f565b915081905092915050565b5f81519050615da381613def565b92915050565b5f60208284031215615dbe57615dbd613dde565b5b5f615dcb84828501615d95565b91505092915050565b5f615dde82613e77565b9150615de983613e77565b9250828201905073ffffffffffffffffffffffffffffffffffffffff811115615e1557615e14615c5e565b5b92915050565b50565b5f615e295f83615d15565b9150615e3482615e1b565b5f82019050919050565b5f615e4882615e1e565b9150819050919050565b5f81519050615e6081614681565b92915050565b5f60208284031215615e7b57615e7a613dde565b5b5f615e8884828501615e52565b9150509291505056fea2646970667358221220009bebbe26b4010affc5f6cc44ac7baf9a52b117b6f7f5c6eaa8b026b64ea5be64736f6c634300081c0033608060405234801561000f575f5ffd5b50604051611fd0380380611fd083398181016040528101906100319190610342565b6100435f5f1b8361007c60201b60201c565b506100747fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e8261007c60201b60201c565b505050610380565b5f5f61008e84846100c560201b60201c565b905080156100bb576100b98360015f8781526020019081526020015f206101ba60201b90919060201c565b505b8091505092915050565b5f6100d683836101ed60201b60201c565b6101b05760015f5f8581526020019081526020015f205f015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff02191690831515021790555061014d61025060201b60201c565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a4600190506101b4565b5f90505b92915050565b5f6101e5835f018373ffffffffffffffffffffffffffffffffffffffff165f1b61025760201b60201c565b905092915050565b5f5f5f8481526020019081526020015f205f015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b5f33905090565b5f61026883836102c460201b60201c565b6102ba57825f0182908060018154018082558091505060019003905f5260205f20015f9091909190915055825f0180549050836001015f8481526020019081526020015f2081905550600190506102be565b5f90505b92915050565b5f5f836001015f8481526020019081526020015f20541415905092915050565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f610311826102e8565b9050919050565b61032181610307565b811461032b575f5ffd5b50565b5f8151905061033c81610318565b92915050565b5f5f60408385031215610358576103576102e4565b5b5f6103658582860161032e565b92505060206103768582860161032e565b9150509250929050565b611c438061038d5f395ff3fe608060405234801561000f575f5ffd5b5060043610610135575f3560e01c8063853b5d19116100b6578063c5df91b51161007a578063c5df91b51461036b578063ca0d535814610387578063ca15c873146103a3578063d547741f146103d3578063e58378bb146103ef578063f2fde38b1461040d57610135565b8063853b5d19146102b55780639010d07c146102d157806391d1485414610301578063a217fddf14610331578063ada8f9191461034f57610135565b80632f2ff15d116100fd5780632f2ff15d1461021557806336568abe14610231578063755e936f1461024d57806381e4c9a31461026957806384cf84e11461029957610135565b806301ffc9a7146101395780631af6c43114610169578063248a9ca3146101995780632505a3bd146101c95780632ad82eea146101f9575b5f5ffd5b610153600480360381019061014e91906113a4565b610429565b60405161016091906113e9565b60405180910390f35b610183600480360381019061017e9190611435565b6104a2565b60405161019091906113e9565b60405180910390f35b6101b360048036038101906101ae9190611435565b6104c8565b6040516101c0919061146f565b60405180910390f35b6101e360048036038101906101de91906115c4565b6104e4565b6040516101f091906113e9565b60405180910390f35b610213600480360381019061020e91906115c4565b610511565b005b61022f600480360381019061022a9190611665565b610620565b005b61024b60048036038101906102469190611665565b610642565b005b61026760048036038101906102629190611741565b6106bd565b005b610283600480360381019061027e9190611741565b6107ca565b60405161029091906113e9565b60405180910390f35b6102b360048036038101906102ae9190611435565b6107f7565b005b6102cf60048036038101906102ca9190611741565b6108ce565b005b6102eb60048036038101906102e691906117bb565b6109dd565b6040516102f89190611808565b60405180910390f35b61031b60048036038101906103169190611665565b610a09565b60405161032891906113e9565b60405180910390f35b610339610a6c565b604051610346919061146f565b60405180910390f35b61036960048036038101906103649190611821565b610a72565b005b61038560048036038101906103809190611435565b610a8d565b005b6103a1600480360381019061039c91906115c4565b610b62565b005b6103bd60048036038101906103b89190611435565b610c6f565b6040516103ca919061185b565b60405180910390f35b6103ed60048036038101906103e89190611665565b610c90565b005b6103f7610cb2565b604051610404919061146f565b60405180910390f35b61042760048036038101906104229190611821565b610cd6565b005b5f7f5a05180f000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061049b575061049a82610d5b565b5b9050919050565b5f60035f8381526020019081526020015f205f9054906101000a900460ff169050919050565b5f5f5f8381526020019081526020015f20600101549050919050565b5f60045f838051906020012081526020019081526020015f205f9054906101000a900460ff169050919050565b7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e61053b81610dd4565b5f8280519060200120905060045f8281526020019081526020015f205f9054906101000a900460ff16156105a4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161059b906118ce565b60405180910390fd5b600160045f8381526020019081526020015f205f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167fcbfa55581c230aeb174d969838d927cdd297755dfb967a33134312f1377ee71d84604051610613919061193c565b60405180910390a2505050565b610629826104c8565b61063281610dd4565b61063c8383610de8565b50505050565b61064a610e2b565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146106ae576040517f6697b23200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6106b88282610e32565b505050565b7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e6106e781610dd4565b5f8280519060200120905060025f8281526020019081526020015f205f9054906101000a900460ff1661074f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610746906119a6565b60405180910390fd5b5f60025f8381526020019081526020015f205f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f66e43f8252a3257fe010a4fd6ae50f57624762cc64a6eceadb04b18cfdefac7d846040516107bd9190611a16565b60405180910390a2505050565b5f60025f838051906020012081526020019081526020015f205f9054906101000a900460ff169050919050565b7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e61082181610dd4565b61082a826104a2565b1561086a576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161086190611a80565b60405180910390fd5b600160035f8481526020019081526020015f205f6101000a81548160ff0219169083151502179055507f010120d82c0c66b257c0ea628d405b1d3c2d37bb8dd9141f6c5c12cb0375c572826040516108c2919061146f565b60405180910390a15050565b7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e6108f881610dd4565b5f8280519060200120905060025f8281526020019081526020015f205f9054906101000a900460ff1615610961576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610958906118ce565b60405180910390fd5b600160025f8381526020019081526020015f205f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f0a249d4766726d36cb6d6ac22cf998dc9fc02bb4ff9fda73ec1e3061c8a1db09846040516109d09190611a16565b60405180910390a2505050565b5f610a018260015f8681526020019081526020015f20610e7590919063ffffffff16565b905092915050565b5f5f5f8481526020019081526020015f205f015f8373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f9054906101000a900460ff16905092915050565b5f5f1b81565b610a7e5f5f1b82610620565b610a8a5f5f1b33610642565b50565b7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e610ab781610dd4565b610ac0826104a2565b610aff576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610af690611b0e565b60405180910390fd5b5f60035f8481526020019081526020015f205f6101000a81548160ff0219169083151502179055507f4072861add20da436ef0a8274b90d102aea17b603f972cc8196d51f1a5d5617982604051610b56919061146f565b60405180910390a15050565b7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e610b8c81610dd4565b5f8280519060200120905060045f8281526020019081526020015f205f9054906101000a900460ff16610bf4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610beb906119a6565b60405180910390fd5b5f60045f8381526020019081526020015f205f6101000a81548160ff0219169083151502179055503373ffffffffffffffffffffffffffffffffffffffff167f69c40cdda8ad6e074bf320a4a76804a6652eb5231bda91b690dcb98010b2707984604051610c62919061193c565b60405180910390a2505050565b5f610c8960015f8481526020019081526020015f20610e8c565b9050919050565b610c99826104c8565b610ca281610dd4565b610cac8383610e32565b50505050565b7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e81565b5f610d017fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e5f6109dd565b9050610d2d7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e82610c90565b610d577fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e83610620565b5050565b5f7f7965db0b000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480610dcd5750610dcc82610e9f565b5b9050919050565b610de581610de0610e2b565b610f08565b50565b5f5f610df48484610f59565b90508015610e2157610e1f8360015f8781526020019081526020015f2061104290919063ffffffff16565b505b8091505092915050565b5f33905090565b5f5f610e3e848461106f565b90508015610e6b57610e698360015f8781526020019081526020015f2061115890919063ffffffff16565b505b8091505092915050565b5f610e82835f0183611185565b5f1c905092915050565b5f610e98825f016111ac565b9050919050565b5f7f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b610f128282610a09565b610f555780826040517fe2517d3f000000000000000000000000000000000000000000000000000000008152600401610f4c929190611b2c565b60405180910390fd5b5050565b5f610f648383610a09565b6110385760015f5f8581526020019081526020015f205f015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff021916908315150217905550610fd5610e2b565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16847f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a46001905061103c565b5f90505b92915050565b5f611067835f018373ffffffffffffffffffffffffffffffffffffffff165f1b6111bb565b905092915050565b5f61107a8383610a09565b1561114e575f5f5f8581526020019081526020015f205f015f8473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020015f205f6101000a81548160ff0219169083151502179055506110eb610e2b565b73ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16847ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b60405160405180910390a460019050611152565b5f90505b92915050565b5f61117d835f018373ffffffffffffffffffffffffffffffffffffffff165f1b611222565b905092915050565b5f825f01828154811061119b5761119a611b53565b5b905f5260205f200154905092915050565b5f815f01805490509050919050565b5f6111c6838361131e565b61121857825f0182908060018154018082558091505060019003905f5260205f20015f9091909190915055825f0180549050836001015f8481526020019081526020015f20819055506001905061121c565b5f90505b92915050565b5f5f836001015f8481526020019081526020015f205490505f8114611313575f60018261124f9190611bad565b90505f6001865f01805490506112659190611bad565b90508082146112cb575f865f01828154811061128457611283611b53565b5b905f5260205f200154905080875f0184815481106112a5576112a4611b53565b5b905f5260205f20018190555083876001015f8381526020019081526020015f2081905550505b855f018054806112de576112dd611be0565b5b600190038181905f5260205f20015f90559055856001015f8681526020019081526020015f205f905560019350505050611318565b5f9150505b92915050565b5f5f836001015f8481526020019081526020015f20541415905092915050565b5f604051905090565b5f5ffd5b5f5ffd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6113838161134f565b811461138d575f5ffd5b50565b5f8135905061139e8161137a565b92915050565b5f602082840312156113b9576113b8611347565b5b5f6113c684828501611390565b91505092915050565b5f8115159050919050565b6113e3816113cf565b82525050565b5f6020820190506113fc5f8301846113da565b92915050565b5f819050919050565b61141481611402565b811461141e575f5ffd5b50565b5f8135905061142f8161140b565b92915050565b5f6020828403121561144a57611449611347565b5b5f61145784828501611421565b91505092915050565b61146981611402565b82525050565b5f6020820190506114825f830184611460565b92915050565b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6114d682611490565b810181811067ffffffffffffffff821117156114f5576114f46114a0565b5b80604052505050565b5f61150761133e565b905061151382826114cd565b919050565b5f67ffffffffffffffff821115611532576115316114a0565b5b61153b82611490565b9050602081019050919050565b828183375f83830152505050565b5f61156861156384611518565b6114fe565b9050828152602081018484840111156115845761158361148c565b5b61158f848285611548565b509392505050565b5f82601f8301126115ab576115aa611488565b5b81356115bb848260208601611556565b91505092915050565b5f602082840312156115d9576115d8611347565b5b5f82013567ffffffffffffffff8111156115f6576115f561134b565b5b61160284828501611597565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6116348261160b565b9050919050565b6116448161162a565b811461164e575f5ffd5b50565b5f8135905061165f8161163b565b92915050565b5f5f6040838503121561167b5761167a611347565b5b5f61168885828601611421565b925050602061169985828601611651565b9150509250929050565b5f67ffffffffffffffff8211156116bd576116bc6114a0565b5b6116c682611490565b9050602081019050919050565b5f6116e56116e0846116a3565b6114fe565b9050828152602081018484840111156117015761170061148c565b5b61170c848285611548565b509392505050565b5f82601f83011261172857611727611488565b5b81356117388482602086016116d3565b91505092915050565b5f6020828403121561175657611755611347565b5b5f82013567ffffffffffffffff8111156117735761177261134b565b5b61177f84828501611714565b91505092915050565b5f819050919050565b61179a81611788565b81146117a4575f5ffd5b50565b5f813590506117b581611791565b92915050565b5f5f604083850312156117d1576117d0611347565b5b5f6117de85828601611421565b92505060206117ef858286016117a7565b9150509250929050565b6118028161162a565b82525050565b5f60208201905061181b5f8301846117f9565b92915050565b5f6020828403121561183657611835611347565b5b5f61184384828501611651565b91505092915050565b61185581611788565b82525050565b5f60208201905061186e5f83018461184c565b92915050565b5f82825260208201905092915050565b7f4b657920697320616c72656164792076616c69640000000000000000000000005f82015250565b5f6118b8601483611874565b91506118c382611884565b602082019050919050565b5f6020820190508181035f8301526118e5816118ac565b9050919050565b5f81519050919050565b8281835e5f83830152505050565b5f61190e826118ec565b6119188185611874565b93506119288185602086016118f6565b61193181611490565b840191505092915050565b5f6020820190508181035f8301526119548184611904565b905092915050565b7f43616e6e6f74207265766f6b6520696e76616c6964206b6579000000000000005f82015250565b5f611990601983611874565b915061199b8261195c565b602082019050919050565b5f6020820190508181035f8301526119bd81611984565b9050919050565b5f81519050919050565b5f82825260208201905092915050565b5f6119e8826119c4565b6119f281856119ce565b9350611a028185602086016118f6565b611a0b81611490565b840191505092915050565b5f6020820190508181035f830152611a2e81846119de565b905092915050565b7f496d616765494420697320616c726561647920737570706f72746564000000005f82015250565b5f611a6a601c83611874565b9150611a7582611a36565b602082019050919050565b5f6020820190508181035f830152611a9781611a5e565b9050919050565b7f43616e6e6f74207265766f6b6520756e737570706f7274656420496d616765495f8201527f4400000000000000000000000000000000000000000000000000000000000000602082015250565b5f611af8602183611874565b9150611b0382611a9e565b604082019050919050565b5f6020820190508181035f830152611b2581611aec565b9050919050565b5f604082019050611b3f5f8301856117f9565b611b4c6020830184611460565b9392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f611bb782611788565b9150611bc283611788565b9250828203905081811115611bda57611bd9611b80565b5b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603160045260245ffdfea2646970667358221220df3590aca4c0c0d1781eaaa3aa9cb86086cb36b81365d32ffb499ec2cd19875d64736f6c634300081c003360e060405234801561000f575f5ffd5b506040516126ac3803806126ac8339818101604052810190610031919061022d565b808073ffffffffffffffffffffffffffffffffffffffff1660c08173ffffffffffffffffffffffffffffffffffffffff16815250505061007561014960201b60201c565b156100ac576040517f7a47c9a200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b63deafbeef60e01b6040516100c0906101b1565b6100ca9190610292565b604051809103905ff0801580156100e3573d5f5f3e3d5ffd5b5073ffffffffffffffffffffffffffffffffffffffff1660a08173ffffffffffffffffffffffffffffffffffffffff168152505060018081111561012a576101296102ab565b5b608081600181111561013f5761013e6102ab565b5b81525050506102d8565b5f60014614806101595750600a46145b806101645750608946145b80610170575061014446145b8061017c57506101e046145b80610188575061210546145b80610194575061a4b146145b806101a0575061a4ba46145b806101ac575061e70846145b905090565b610ffb806116b183390190565b5f5ffd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6101eb826101c2565b9050919050565b5f6101fc826101e1565b9050919050565b61020c816101f2565b8114610216575f5ffd5b50565b5f8151905061022781610203565b92915050565b5f60208284031215610242576102416101be565b5b5f61024f84828501610219565b91505092915050565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b61028c81610258565b82525050565b5f6020820190506102a55f830184610283565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b60805160a05160c05161139461031d5f395f818161011401528181610240015261053401525f818160ef015261019201525f818161013a015261026401526113945ff3fe608060405234801561000f575f5ffd5b5060043610610055575f3560e01c806308c84e70146100595780633fd66f22146100775780639a44ea8414610095578063c4fa74e5146100b3578063f4cbae94146100cf575b5f5ffd5b6100616100ed565b60405161006e9190610747565b60405180910390f35b61007f610111565b60405161008c9190610780565b60405180910390f35b61009d610138565b6040516100aa919061080c565b60405180910390f35b6100cd60048036038101906100c89190610918565b61015c565b005b6100d761023e565b6040516100e49190610780565b60405180910390f35b7f000000000000000000000000000000000000000000000000000000000000000081565b5f7f0000000000000000000000000000000000000000000000000000000000000000905090565b7f000000000000000000000000000000000000000000000000000000000000000081565b610175848036038101906101709190610c7d565b610262565b610190848036038101906101899190610c7d565b83836102f6565b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff1663ab750e756101e7865f018036038101906101e29190610ca9565b610612565b866101400135866040518463ffffffff1660e01b815260040161020c93929190610d44565b5f6040518083038186803b158015610222575f5ffd5b505afa158015610234573d5f5f3e3d5ffd5b5050505050505050565b7f000000000000000000000000000000000000000000000000000000000000000081565b7f0000000000000000000000000000000000000000000000000000000000000000600181111561029557610294610799565b5b6102a1825f01516106c0565b60018111156102b3576102b2610799565b5b146102f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102ea90610dda565b60405180910390fd5b50565b8173ffffffffffffffffffffffffffffffffffffffff1683606001515f015173ffffffffffffffffffffffffffffffffffffffff161461036b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161036290610e42565b60405180910390fd5b807bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168360600151602001517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916146103f3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016103ea90610eaa565b60405180910390fd5b468360600151604001511461043d576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161043490610f12565b60405180910390fd5b4383606001516060015110610487576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161047e90610fa0565b60405180910390fd5b4361010084606001516060015161049e9190610feb565b10156104df576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d69061108e565b60405180910390fd5b8260600151606001514083606001516080015114610532576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610529906110f6565b60405180910390fd5b7f000000000000000000000000000000000000000000000000000000000000000073ffffffffffffffffffffffffffffffffffffffff16631af6c43184602001516040518263ffffffff1660e01b815260040161058f9190611114565b602060405180830381865afa1580156105aa573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906105ce9190611162565b61060d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610604906111d7565b60405180910390fd5b505050565b606060018081111561062757610626610799565b5b8260400151600181111561063e5761063d610799565b5b0361068f575f82602001515f6008811061065b5761065a6111f5565b5b60200201519050825f015181604051602001610678929190611262565b6040516020818303038152906040529150506106bb565b815f015182602001516040516020016106a9929190611332565b60405160208183030381529060405290505b919050565b5f81604001519050919050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f819050919050565b5f61070f61070a610705846106cd565b6106ec565b6106cd565b9050919050565b5f610720826106f5565b9050919050565b5f61073182610716565b9050919050565b61074181610727565b82525050565b5f60208201905061075a5f830184610738565b92915050565b5f61076a82610716565b9050919050565b61077a81610760565b82525050565b5f6020820190506107935f830184610771565b92915050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b600281106107d7576107d6610799565b5b50565b5f8190506107e7826107c6565b919050565b5f6107f6826107da565b9050919050565b610806816107ec565b82525050565b5f60208201905061081f5f8301846107fd565b92915050565b5f604051905090565b5f5ffd5b5f5ffd5b5f610220828403121561084c5761084b610832565b5b81905092915050565b5f819050919050565b61086781610855565b8114610871575f5ffd5b50565b5f813590506108828161085e565b92915050565b5f610892826106cd565b9050919050565b6108a281610888565b81146108ac575f5ffd5b50565b5f813590506108bd81610899565b92915050565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6108f7816108c3565b8114610901575f5ffd5b50565b5f81359050610912816108ee565b92915050565b5f5f5f5f61028085870312156109315761093061082e565b5b5f61093e87828801610836565b94505061022061095087828801610874565b935050610240610962878288016108af565b92505061026061097487828801610904565b91505092959194509250565b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b6109ca82610984565b810181811067ffffffffffffffff821117156109e9576109e8610994565b5b80604052505050565b5f6109fb610825565b9050610a0782826109c1565b919050565b5f5ffd5b5f67ffffffffffffffff821115610a2a57610a29610994565b5b602082029050919050565b5f5ffd5b5f610a4b610a4684610a10565b6109f2565b90508060208402830185811115610a6557610a64610a35565b5b835b81811015610a8e5780610a7a8882610874565b845260208401935050602081019050610a67565b5050509392505050565b5f82601f830112610aac57610aab610a0c565b5b6008610ab9848285610a39565b91505092915050565b60028110610ace575f5ffd5b50565b5f81359050610adf81610ac2565b92915050565b5f6101408284031215610afb57610afa610980565b5b610b0560606109f2565b90505f610b1484828501610904565b5f830152506020610b2784828501610a98565b602083015250610120610b3c84828501610ad1565b60408301525092915050565b5f819050919050565b610b5a81610b48565b8114610b64575f5ffd5b50565b5f81359050610b7581610b51565b92915050565b5f60a08284031215610b9057610b8f610980565b5b610b9a60a06109f2565b90505f610ba9848285016108af565b5f830152506020610bbc84828501610904565b6020830152506040610bd084828501610b67565b6040830152506060610be484828501610b67565b6060830152506080610bf884828501610874565b60808301525092915050565b5f6102208284031215610c1a57610c19610980565b5b610c2460806109f2565b90505f610c3384828501610ae5565b5f83015250610140610c4784828501610874565b602083015250610160610c5c84828501610b67565b604083015250610180610c7184828501610b7b565b60608301525092915050565b5f6102208284031215610c9357610c9261082e565b5b5f610ca084828501610c04565b91505092915050565b5f6101408284031215610cbf57610cbe61082e565b5b5f610ccc84828501610ae5565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f610d0782610cd5565b610d118185610cdf565b9350610d21818560208601610cef565b610d2a81610984565b840191505092915050565b610d3e81610855565b82525050565b5f6060820190508181035f830152610d5c8186610cfd565b9050610d6b6020830185610d35565b610d786040830184610d35565b949350505050565b5f82825260208201905092915050565b7f496e76616c69642070726f6f66206d6f646500000000000000000000000000005f82015250565b5f610dc4601283610d80565b9150610dcf82610d90565b602082019050919050565b5f6020820190508181035f830152610df181610db8565b9050919050565b7f496e76616c69642070726f7665720000000000000000000000000000000000005f82015250565b5f610e2c600e83610d80565b9150610e3782610df8565b602082019050919050565b5f6020820190508181035f830152610e5981610e20565b9050919050565b7f496e76616c69642073656c6563746f72000000000000000000000000000000005f82015250565b5f610e94601083610d80565b9150610e9f82610e60565b602082019050919050565b5f6020820190508181035f830152610ec181610e88565b9050919050565b7f496e76616c696420636861696e206964000000000000000000000000000000005f82015250565b5f610efc601083610d80565b9150610f0782610ec8565b602082019050919050565b5f6020820190508181035f830152610f2981610ef0565b9050919050565b7f496e76616c696420626c6f636b206e756d6265723a20626c6f636b2066726f6d5f8201527f2066757475726500000000000000000000000000000000000000000000000000602082015250565b5f610f8a602783610d80565b9150610f9582610f30565b604082019050919050565b5f6020820190508181035f830152610fb781610f7e565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f610ff582610b48565b915061100083610b48565b925082820190508082111561101857611017610fbe565b5b92915050565b7f496e76616c696420626c6f636b206e756d6265723a20626c6f636b20746f6f205f8201527f6f6c640000000000000000000000000000000000000000000000000000000000602082015250565b5f611078602383610d80565b91506110838261101e565b604082019050919050565b5f6020820190508181035f8301526110a58161106c565b9050919050565b7f496e76616c696420626c6f636b206861736800000000000000000000000000005f82015250565b5f6110e0601283610d80565b91506110eb826110ac565b602082019050919050565b5f6020820190508181035f83015261110d816110d4565b9050919050565b5f6020820190506111275f830184610d35565b92915050565b5f8115159050919050565b6111418161112d565b811461114b575f5ffd5b50565b5f8151905061115c81611138565b92915050565b5f602082840312156111775761117661082e565b5b5f6111848482850161114e565b91505092915050565b7f556e737570706f727465642043616c6c477565737449640000000000000000005f82015250565b5f6111c1601783610d80565b91506111cc8261118d565b602082019050919050565b5f6020820190508181035f8301526111ee816111b5565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b5f819050919050565b61123c611237826108c3565b611222565b82525050565b5f819050919050565b61125c61125782610855565b611242565b82525050565b5f61126d828561122b565b60048201915061127d828461124b565b6020820191508190509392505050565b5f60089050919050565b5f81905092915050565b5f819050919050565b6112b381610855565b82525050565b5f6112c483836112aa565b60208301905092915050565b5f602082019050919050565b6112e58161128d565b6112ef8184611297565b92506112fa826112a1565b805f5b8381101561132a57815161131187826112b9565b965061131c836112d0565b9250506001810190506112fd565b505050505050565b5f61133d828561122b565b60048201915061134d82846112dc565b61010082019150819050939250505056fea2646970667358221220fc72db7b03058080dc454dfdef3f08203f328f20cd3ba9dc7458df7e946ae28464736f6c634300081c003360a060405234801561000f575f5ffd5b50604051610ffb380380610ffb833981810160405281019061003191906100d6565b807bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166080817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19168152505050610101565b5f5ffd5b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6100b581610081565b81146100bf575f5ffd5b50565b5f815190506100d0816100ac565b92915050565b5f602082840312156100eb576100ea61007d565b5b5f6100f8848285016100c2565b91505092915050565b608051610ecd61012e5f395f8181610111015281816101670152818161024201526102a50152610ecd5ff3fe608060405234801561000f575f5ffd5b5060043610610055575f3560e01c8063053c238d146100595780631599ead5146100775780633a115bb11461009357806366cf0e4b146100c3578063ab750e75146100f3575b5f5ffd5b61006161010f565b60405161006e91906106d2565b60405180910390f35b610091600480360381019061008c9190610715565b610133565b005b6100ad60048036038101906100a8919061078f565b610152565b6040516100ba9190610873565b60405180910390f35b6100dd60048036038101906100d89190610893565b6101b7565b6040516100ea9190610873565b60405180910390f35b61010d60048036038101906101089190610932565b6101e1565b005b7f000000000000000000000000000000000000000000000000000000000000000081565b61014f81805f019061014591906109af565b8360200135610203565b50565b61015a610621565b60405180604001604052807f000000000000000000000000000000000000000000000000000000000000000084604051602001610198929190610a51565b6040516020818303038152906040528152602001838152509050919050565b6101bf610621565b6101d96101d46101cf858561038d565b61042f565b610152565b905092915050565b6101fd84846101f86101f3868661038d565b61042f565b610203565b50505050565b82825f9060049261021693929190610a84565b906102219190610ad4565b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19167f00000000000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916146103015782825f9060049261029893929190610a84565b906102a39190610ad4565b7f00000000000000000000000000000000000000000000000000000000000000006040517fb8b38d4c0000000000000000000000000000000000000000000000000000000081526004016102f8929190610b32565b60405180910390fd5b806040516020016103129190610b59565b604051602081830303815290604052805190602001208383600490809261033b93929190610a84565b604051610349929190610baf565b604051809103902014610388576040517f439cc0cd00000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b505050565b61039561063a565b6040518060a001604052808481526020017fa3acc27117418996340b84e5a90f3ef4c49d22c79e44aad822ec9c313e1eb8e25f1b815260200160405180604001604052805f60028111156103ec576103eb610bc7565b5b81526020015f60ff1681525081526020015f5f1b815260200161042460405180604001604052808681526020015f5f1b81525061054c565b815250905092915050565b5f60028060405161043f90610c3e565b602060405180830381855afa15801561045a573d5f5f3e3d5ffd5b5050506040513d601f19601f8201168201806040525081019061047d9190610c66565b8360600151845f015185602001518660800151601888604001515f015160028111156104ac576104ab610bc7565b5b63ffffffff16901b601889604001516020015160ff1663ffffffff16901b6008600461ffff16901b6040516020016104eb989796959493929190610d15565b6040516020818303038152906040526040516105079190610dd6565b602060405180830381855afa158015610522573d5f5f3e3d5ffd5b5050506040513d601f19601f820116820180604052508101906105459190610c66565b9050919050565b5f60028060405161055c90610e36565b602060405180830381855afa158015610577573d5f5f3e3d5ffd5b5050506040513d601f19601f8201168201806040525081019061059a9190610c66565b835f015184602001516008600261ffff16901b6040516020016105c09493929190610e4a565b6040516020818303038152906040526040516105dc9190610dd6565b602060405180830381855afa1580156105f7573d5f5f3e3d5ffd5b5050506040513d601f19601f8201168201806040525081019061061a9190610c66565b9050919050565b6040518060400160405280606081526020015f81525090565b6040518060a001604052805f81526020015f815260200161065961066b565b81526020015f81526020015f81525090565b60405180604001604052805f600281111561068957610688610bc7565b5b81526020015f60ff1681525090565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6106cc81610698565b82525050565b5f6020820190506106e55f8301846106c3565b92915050565b5f5ffd5b5f5ffd5b5f5ffd5b5f6040828403121561070c5761070b6106f3565b5b81905092915050565b5f6020828403121561072a576107296106eb565b5b5f82013567ffffffffffffffff811115610747576107466106ef565b5b610753848285016106f7565b91505092915050565b5f819050919050565b61076e8161075c565b8114610778575f5ffd5b50565b5f8135905061078981610765565b92915050565b5f602082840312156107a4576107a36106eb565b5b5f6107b18482850161077b565b91505092915050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f601f19601f8301169050919050565b5f6107fc826107ba565b61080681856107c4565b93506108168185602086016107d4565b61081f816107e2565b840191505092915050565b6108338161075c565b82525050565b5f604083015f8301518482035f86015261085382826107f2565b9150506020830151610868602086018261082a565b508091505092915050565b5f6020820190508181035f83015261088b8184610839565b905092915050565b5f5f604083850312156108a9576108a86106eb565b5b5f6108b68582860161077b565b92505060206108c78582860161077b565b9150509250929050565b5f5ffd5b5f5ffd5b5f5ffd5b5f5f83601f8401126108f2576108f16108d1565b5b8235905067ffffffffffffffff81111561090f5761090e6108d5565b5b60208301915083600182028301111561092b5761092a6108d9565b5b9250929050565b5f5f5f5f6060858703121561094a576109496106eb565b5b5f85013567ffffffffffffffff811115610967576109666106ef565b5b610973878288016108dd565b945094505060206109868782880161077b565b92505060406109978782880161077b565b91505092959194509250565b5f5ffd5b5f5ffd5b5f5ffd5b5f5f833560016020038436030381126109cb576109ca6109a3565b5b80840192508235915067ffffffffffffffff8211156109ed576109ec6109a7565b5b602083019250600182023603831315610a0957610a086109ab565b5b509250929050565b5f819050919050565b610a2b610a2682610698565b610a11565b82525050565b5f819050919050565b610a4b610a468261075c565b610a31565b82525050565b5f610a5c8285610a1a565b600482019150610a6c8284610a3a565b6020820191508190509392505050565b5f5ffd5b5f5ffd5b5f5f85851115610a9757610a96610a7c565b5b83861115610aa857610aa7610a80565b5b6001850283019150848603905094509492505050565b5f82905092915050565b5f82821b905092915050565b5f610adf8383610abe565b82610aea8135610698565b92506004821015610b2a57610b257fffffffff0000000000000000000000000000000000000000000000000000000083600403600802610ac8565b831692505b505092915050565b5f604082019050610b455f8301856106c3565b610b5260208301846106c3565b9392505050565b5f610b648284610a3a565b60208201915081905092915050565b5f81905092915050565b828183375f83830152505050565b5f610b968385610b73565b9350610ba3838584610b7d565b82840190509392505050565b5f610bbb828486610b8b565b91508190509392505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b7f72697363302e52656365697074436c61696d00000000000000000000000000005f82015250565b5f610c28601283610b73565b9150610c3382610bf4565b601282019050919050565b5f610c4882610c1c565b9150819050919050565b5f81519050610c6081610765565b92915050565b5f60208284031215610c7b57610c7a6106eb565b5b5f610c8884828501610c52565b91505092915050565b5f63ffffffff82169050919050565b5f8160e01b9050919050565b5f610cb682610ca0565b9050919050565b610cce610cc982610c91565b610cac565b82525050565b5f61ffff82169050919050565b5f8160f01b9050919050565b5f610cf782610ce1565b9050919050565b610d0f610d0a82610cd4565b610ced565b82525050565b5f610d20828b610a3a565b602082019150610d30828a610a3a565b602082019150610d408289610a3a565b602082019150610d508288610a3a565b602082019150610d608287610a3a565b602082019150610d708286610cbd565b600482019150610d808285610cbd565b600482019150610d908284610cfe565b6002820191508190509998505050505050505050565b5f610db0826107ba565b610dba8185610b73565b9350610dca8185602086016107d4565b80840191505092915050565b5f610de18284610da6565b915081905092915050565b7f72697363302e4f757470757400000000000000000000000000000000000000005f82015250565b5f610e20600c83610b73565b9150610e2b82610dec565b600c82019050919050565b5f610e4082610e14565b9150819050919050565b5f610e558287610a3a565b602082019150610e658286610a3a565b602082019150610e758285610a3a565b602082019150610e858284610cfe565b6002820191508190509594505050505056fea26469706673582212201af08fecd0841bd017f492adf49e35b782bd5a55810d4f4f9dede2245690092b64736f6c634300081c0033";


// EmailDomainProver Contract
export const EmailDomainProverABI = [
  {
    "type": "function",
    "name": "proof",
    "inputs": [],
    "outputs": [
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
      }
    ],
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "setBlock",
    "inputs": [
      {
        "name": "blockNo",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "setChain",
    "inputs": [
      {
        "name": "chainId",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "blockNo",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "simpleDomainVerification",
    "inputs": [
      {
        "name": "unverifiedEmail",
        "type": "tuple",
        "internalType": "struct UnverifiedEmail",
        "components": [
          {
            "name": "email",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "dnsRecord",
            "type": "tuple",
            "internalType": "struct DnsRecord",
            "components": [
              {
                "name": "name",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "recordType",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "data",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "ttl",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "verificationData",
            "type": "tuple",
            "internalType": "struct VerificationData",
            "components": [
              {
                "name": "validUntil",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "signature",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "pubKey",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          }
        ]
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
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
        "name": "",
        "type": "string",
        "internalType": "string"
      },
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
    "name": "stringToAddress",
    "inputs": [
      {
        "name": "str",
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
    "stateMutability": "pure"
  },
  {
    "type": "function",
    "name": "verifyDomainOwnership",
    "inputs": [
      {
        "name": "unverifiedEmail",
        "type": "tuple",
        "internalType": "struct UnverifiedEmail",
        "components": [
          {
            "name": "email",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "dnsRecord",
            "type": "tuple",
            "internalType": "struct DnsRecord",
            "components": [
              {
                "name": "name",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "recordType",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "data",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "ttl",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "verificationData",
            "type": "tuple",
            "internalType": "struct VerificationData",
            "components": [
              {
                "name": "validUntil",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "signature",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "pubKey",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          }
        ]
      }
    ],
    "outputs": [
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
        "name": "",
        "type": "bytes32",
        "internalType": "bytes32"
      },
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "verifyOrganization",
    "inputs": [
      {
        "name": "unverifiedEmail",
        "type": "tuple",
        "internalType": "struct UnverifiedEmail",
        "components": [
          {
            "name": "email",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "dnsRecord",
            "type": "tuple",
            "internalType": "struct DnsRecord",
            "components": [
              {
                "name": "name",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "recordType",
                "type": "uint8",
                "internalType": "uint8"
              },
              {
                "name": "data",
                "type": "string",
                "internalType": "string"
              },
              {
                "name": "ttl",
                "type": "uint64",
                "internalType": "uint64"
              }
            ]
          },
          {
            "name": "verificationData",
            "type": "tuple",
            "internalType": "struct VerificationData",
            "components": [
              {
                "name": "validUntil",
                "type": "uint64",
                "internalType": "uint64"
              },
              {
                "name": "signature",
                "type": "bytes",
                "internalType": "bytes"
              },
              {
                "name": "pubKey",
                "type": "bytes",
                "internalType": "bytes"
              }
            ]
          }
        ]
      }
    ],
    "outputs": [
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
        "name": "",
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
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "error",
    "name": "FailedInnerCall",
    "inputs": []
  }
] as const;

export const EmailDomainProverBytecode = "0x6080604052348015600e575f5ffd5b506131be8061001c5f395ff3fe608060405234801561000f575f5ffd5b506004361061007b575f3560e01c806387cea3ae1161005957806387cea3ae14610114578063a62dac9c14610130578063faf924cf14610161578063ffbc56381461017f5761007b565b806315706fdf1461007f578063642dc55c146100af57806385a4588d146100e1575b5f5ffd5b61009960048036038101906100949190611836565b61019b565b6040516100a691906118bc565b60405180910390f35b6100c960048036038101906100c49190611921565b610449565b6040516100d893929190611c6b565b60405180910390f35b6100fb60048036038101906100f69190611caa565b610581565b60405161010b9493929190611cf1565b60405180910390f35b61012e60048036038101906101299190611d69565b61084b565b005b61014a60048036038101906101459190611caa565b610928565b604051610158929190611e56565b60405180910390f35b610169610bf3565b6040516101769190611e86565b60405180910390f35b61019960048036038101906101949190611ea0565b610c08565b005b5f5f829050602a8151146101e4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101db90611f28565b60405180910390fd5b7f3000000000000000000000000000000000000000000000000000000000000000815f8151811061021857610217611f46565b5b602001015160f81c60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161480156102b157507f78000000000000000000000000000000000000000000000000000000000000008160018151811061028257610281611f46565b5b602001015160f81c60f81b7effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b6102f0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016102e790611fbd565b60405180910390fd5b5f601467ffffffffffffffff81111561030c5761030b611712565b5b6040519080825280601f01601f19166020018201604052801561033e5781602001600182028036833780820191505090505b5090505f5f90505b60148110156104325761038d836002836103609190612008565b600361036c9190612049565b8151811061037d5761037c611f46565b5b602001015160f81c60f81b610ce8565b60106103cd856002856103a09190612008565b60026103ac9190612049565b815181106103bd576103bc611f46565b5b602001015160f81c60f81b610ce8565b6103d79190612088565b6103e191906120c4565b60f81b8282815181106103f7576103f6611f46565b5b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff191690815f1a9053508080600101915050610346565b508061043d9061215c565b60601c92505050919050565b610451611575565b60605f5f61046786610462906124ca565b610f22565b90505f61049860405180606001604052806027815260200161316260279139835f015161127790919063ffffffff16565b905060028151146104de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d590612526565b60405180910390fd5b6104e6610bf3565b816001815181106104fa576104f9611f46565b5b60200260200101516002845f0151604051602001610518919061257e565b60405160208183030381529060405260405161053491906125ce565b602060405180830381855afa15801561054f573d5f5f3e3d5ffd5b5050506040513d601f19601f82011682018060405250810190610572919061260e565b94509450945050509250925092565b610589611575565b5f5f60605f6105a08661059b906124ca565b610f22565b90505f6105d26040518060600160405280603a8152602001613128603a9139836040015161127790919063ffffffff16565b90505f815111610617576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060e90612683565b60405180910390fd5b5f61063c8260018151811061062f5761062e611f46565b5b602002602001015161019b565b90505f61066d60405180606001604052806027815260200161316260279139855f015161127790919063ffffffff16565b905060028151146106b3576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106aa90612526565b60405180910390fd5b5f816001815181106106c8576106c7611f46565b5b60200260200101515111610711576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161070890612526565b60405180910390fd5b5f61075d6040518060400160405280601e81526020017f5e2861646d696e7c696e666f7c636f6e746163747c737570706f727429400000815250865f015161127790919063ffffffff16565b90505f8151116107a2576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161079990612711565b60405180910390fd5b6107aa610bf3565b6002865f01516040516020016107c0919061257e565b6040516020818303038152906040526040516107dc91906125ce565b602060405180830381855afa1580156107f7573d5f5f3e3d5ffd5b5050506040513d601f19601f8201168201806040525081019061081a919061260e565b848460018151811061082f5761082e611f46565b5b6020026020010151985098509850985050505050509193509193565b7f2ae215ce9fde588adfdea92976dc9aa45aa006a0f63942d8f9f21bd4537972a35f1c73ffffffffffffffffffffffffffffffffffffffff166387cea3ae826040518263ffffffff1660e01b81526004016108a6919061273e565b6020604051808303815f875af11580156108c2573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906108e6919061278c565b610925576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091c90612801565b60405180910390fd5b50565b610930611575565b6109386115a7565b5f61094b84610946906124ca565b610f22565b90505f61097d6040518060800160405280604581526020016130e360459139836040015161127790919063ffffffff16565b90506002815110156109c4576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109bb9061288f565b60405180910390fd5b5f816001815181106109d9576109d8611f46565b5b602002602001015190505f610a08836002815181106109fb576109fa611f46565b5b602002602001015161019b565b90505f610a3960405180606001604052806027815260200161316260279139865f015161127790919063ffffffff16565b90506002815114610a7f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a7690612526565b60405180910390fd5b5f610acb6040518060400160405280601e81526020017f5e2861646d696e7c696e666f7c636f6e746163747c737570706f727429400000815250875f015161127790919063ffffffff16565b90505f815111610b10576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b0790612711565b60405180910390fd5b5f6040518060a0016040528086815260200184600181518110610b3657610b35611f46565b5b602002602001015181526020018573ffffffffffffffffffffffffffffffffffffffff1681526020016002895f0151604051602001610b75919061257e565b604051602081830303815290604052604051610b9191906125ce565b602060405180830381855afa158015610bac573d5f5f3e3d5ffd5b5050506040513d601f19601f82011682018060405250810190610bcf919061260e565b8152602001428152509050610be2610bf3565b819850985050505050505050915091565b610bfb611575565b610c0361135e565b905090565b7f2ae215ce9fde588adfdea92976dc9aa45aa006a0f63942d8f9f21bd4537972a35f1c73ffffffffffffffffffffffffffffffffffffffff1663ffbc563883836040518363ffffffff1660e01b8152600401610c659291906128ad565b6020604051808303815f875af1158015610c81573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610ca5919061278c565b610ce4576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610cdb90612801565b60405180910390fd5b5050565b5f5f8260f81c90507f300000000000000000000000000000000000000000000000000000000000000060f81c60ff168160ff1610158015610d5257507f390000000000000000000000000000000000000000000000000000000000000060f81c60ff168160ff1611155b15610d8e577f300000000000000000000000000000000000000000000000000000000000000060f81c81610d8691906128d4565b915050610f1d565b7f610000000000000000000000000000000000000000000000000000000000000060f81c60ff168160ff1610158015610df057507f660000000000000000000000000000000000000000000000000000000000000060f81c60ff168160ff1611155b15610e38577f610000000000000000000000000000000000000000000000000000000000000060f81c81600a610e2691906120c4565b610e3091906128d4565b915050610f1d565b7f410000000000000000000000000000000000000000000000000000000000000060f81c60ff168160ff1610158015610e9a57507f460000000000000000000000000000000000000000000000000000000000000060f81c60ff168160ff1611155b15610ee2577f410000000000000000000000000000000000000000000000000000000000000060f81c81600a610ed091906120c4565b610eda91906128d4565b915050610f1d565b6040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f1490612952565b60405180910390fd5b919050565b610f2a6115e9565b4282604001515f015167ffffffffffffffff1611610f7d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f74906129e0565b60405180910390fd5b610f85611375565b15611002577fc16646301c7615357b8f8ee125956b0e5fbf972fa2a0c26feb1f1ae75d04103f5f1b8260400151604001518051906020012014610ffd576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ff490612a48565b60405180910390fd5b6111a2565b61100a611392565b156110da576110176113fa565b73ffffffffffffffffffffffffffffffffffffffff166381e4c9a38360400151604001516040518263ffffffff1660e01b81526004016110579190612aae565b602060405180830381865afa158015611072573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611096919061278c565b6110d5576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110cc90612b18565b60405180910390fd5b6111a1565b6110e2611415565b73ffffffffffffffffffffffffffffffffffffffff166381e4c9a38360400151604001516040518263ffffffff1660e01b81526004016111229190612aae565b602060405180830381865afa15801561113d573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611161919061278c565b6111a0576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161119790612b18565b60405180910390fd5b5b5b5f5f600173f4e4fdca9d5d55e64525e314391996a15f7ec6006111c59190612b36565b73ffffffffffffffffffffffffffffffffffffffff16846040516020016111ec9190612cf9565b60405160208183030381529060405260405161120891906125ce565b5f60405180830381855afa9150503d805f8114611240576040519150601f19603f3d011682016040523d82523d5f602084013e611245565b606091505b50915091506112548282611430565b505f8180602001905181019061126a9190612e6c565b9050809350505050919050565b60605f5f601173f4e4fdca9d5d55e64525e314391996a15f7ec60061129c9190612b36565b73ffffffffffffffffffffffffffffffffffffffff166040518060400160405280878152602001868152506040516020016112d79190612f62565b6040516020818303038152906040526040516112f391906125ce565b5f60405180830381855afa9150503d805f811461132b576040519150601f19603f3d011682016040523d82523d5f602084013e611330565b606091505b509150915061133f8282611430565b50808060200190518101906113549190613064565b9250505092915050565b611366611575565b61136e611575565b8091505090565b5f61137e611454565b8061138d575061138c61146c565b5b905090565b5f60014614806113a25750600a46145b806113ad5750608946145b806113b9575061014446145b806113c557506101e046145b806113d1575061210546145b806113dd575061a4b146145b806113e9575061a4ba46145b806113f5575061e70846145b905090565b5f73565dca92902ea0ca597b5e62df0b47886b6b7d4d905090565b5f73c4e4dc291a5c4debe9ff5a3372f3fdd2e42bac86905090565b6060826114455761144082611531565b61144d565b81905061144e565b5b92915050565b5f617a6946148061146757506204991946145b905090565b5f5f5f601e73f4e4fdca9d5d55e64525e314391996a15f7ec6006114909190612b36565b73ffffffffffffffffffffffffffffffffffffffff166040516114b2906130ce565b5f60405180830381855afa9150503d805f81146114ea576040519150601f19603f3d011682016040523d82523d5f602084013e6114ef565b606091505b509150915081158061150157505f8151145b15611510575f9250505061152e565b5f81806020019051810190611525919061278c565b90508093505050505b90565b5f815111156115435780518082602001fd5b6040517f1425ea4200000000000000000000000000000000000000000000000000000000815260040160405180910390fd5b6040518060800160405280611588611611565b81526020015f81526020015f81526020016115a1611667565b81525090565b6040518060a0016040528060608152602001606081526020015f73ffffffffffffffffffffffffffffffffffffffff1681526020015f81526020015f81525090565b6040518060800160405280606081526020016060815260200160608152602001606081525090565b60405180606001604052805f7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020016116496116c6565b81526020015f600181111561166157611660611a63565b5b81525090565b6040518060a001604052805f73ffffffffffffffffffffffffffffffffffffffff1681526020015f7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191681526020015f81526020015f81526020015f81525090565b604051806101000160405280600890602082028036833780820191505090505090565b5f604051905090565b5f5ffd5b5f5ffd5b5f5ffd5b5f5ffd5b5f601f19601f8301169050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52604160045260245ffd5b61174882611702565b810181811067ffffffffffffffff8211171561176757611766611712565b5b80604052505050565b5f6117796116e9565b9050611785828261173f565b919050565b5f67ffffffffffffffff8211156117a4576117a3611712565b5b6117ad82611702565b9050602081019050919050565b828183375f83830152505050565b5f6117da6117d58461178a565b611770565b9050828152602081018484840111156117f6576117f56116fe565b5b6118018482856117ba565b509392505050565b5f82601f83011261181d5761181c6116fa565b5b813561182d8482602086016117c8565b91505092915050565b5f6020828403121561184b5761184a6116f2565b5b5f82013567ffffffffffffffff811115611868576118676116f6565b5b61187484828501611809565b91505092915050565b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6118a68261187d565b9050919050565b6118b68161189c565b82525050565b5f6020820190506118cf5f8301846118ad565b92915050565b5f5ffd5b5f606082840312156118ee576118ed6118d5565b5b81905092915050565b6119008161189c565b811461190a575f5ffd5b50565b5f8135905061191b816118f7565b92915050565b5f5f60408385031215611937576119366116f2565b5b5f83013567ffffffffffffffff811115611954576119536116f6565b5b611960858286016118d9565b92505060206119718582860161190d565b9150509250929050565b5f7fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b6119af8161197b565b82525050565b5f60089050919050565b5f81905092915050565b5f819050919050565b5f819050919050565b6119e4816119d2565b82525050565b5f6119f583836119db565b60208301905092915050565b5f602082019050919050565b611a16816119b5565b611a2081846119bf565b9250611a2b826119c9565b805f5b83811015611a5b578151611a4287826119ea565b9650611a4d83611a01565b925050600181019050611a2e565b505050505050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52602160045260245ffd5b60028110611aa157611aa0611a63565b5b50565b5f819050611ab182611a90565b919050565b5f611ac082611aa4565b9050919050565b611ad081611ab6565b82525050565b61014082015f820151611aeb5f8501826119a6565b506020820151611afe6020850182611a0d565b506040820151611b12610120850182611ac7565b50505050565b5f819050919050565b611b2a81611b18565b82525050565b611b398161189c565b82525050565b60a082015f820151611b535f850182611b30565b506020820151611b6660208501826119a6565b506040820151611b796040850182611b21565b506060820151611b8c6060850182611b21565b506080820151611b9f60808501826119db565b50505050565b61022082015f820151611bba5f850182611ad6565b506020820151611bce6101408501826119db565b506040820151611be2610160850182611b21565b506060820151611bf6610180850182611b3f565b50505050565b5f81519050919050565b5f82825260208201905092915050565b8281835e5f83830152505050565b5f611c2e82611bfc565b611c388185611c06565b9350611c48818560208601611c16565b611c5181611702565b840191505092915050565b611c65816119d2565b82525050565b5f61026082019050611c7f5f830186611ba5565b818103610220830152611c928185611c24565b9050611ca2610240830184611c5c565b949350505050565b5f60208284031215611cbf57611cbe6116f2565b5b5f82013567ffffffffffffffff811115611cdc57611cdb6116f6565b5b611ce8848285016118d9565b91505092915050565b5f61028082019050611d055f830187611ba5565b611d13610220830186611c5c565b611d216102408301856118ad565b818103610260830152611d348184611c24565b905095945050505050565b611d4881611b18565b8114611d52575f5ffd5b50565b5f81359050611d6381611d3f565b92915050565b5f60208284031215611d7e57611d7d6116f2565b5b5f611d8b84828501611d55565b91505092915050565b5f82825260208201905092915050565b5f611dae82611bfc565b611db88185611d94565b9350611dc8818560208601611c16565b611dd181611702565b840191505092915050565b5f60a083015f8301518482035f860152611df68282611da4565b91505060208301518482036020860152611e108282611da4565b9150506040830151611e256040860182611b30565b506060830151611e3860608601826119db565b506080830151611e4b6080860182611b21565b508091505092915050565b5f61024082019050611e6a5f830185611ba5565b818103610220830152611e7d8184611ddc565b90509392505050565b5f61022082019050611e9a5f830184611ba5565b92915050565b5f5f60408385031215611eb657611eb56116f2565b5b5f611ec385828601611d55565b9250506020611ed485828601611d55565b9150509250929050565b7f496e76616c69642061646472657373206c656e677468000000000000000000005f82015250565b5f611f12601683611c06565b9150611f1d82611ede565b602082019050919050565b5f6020820190508181035f830152611f3f81611f06565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52603260045260245ffd5b7f4d697373696e67203078207072656669780000000000000000000000000000005f82015250565b5f611fa7601183611c06565b9150611fb282611f73565b602082019050919050565b5f6020820190508181035f830152611fd481611f9b565b9050919050565b7f4e487b71000000000000000000000000000000000000000000000000000000005f52601160045260245ffd5b5f61201282611b18565b915061201d83611b18565b925082820261202b81611b18565b9150828204841483151761204257612041611fdb565b5b5092915050565b5f61205382611b18565b915061205e83611b18565b925082820190508082111561207657612075611fdb565b5b92915050565b5f60ff82169050919050565b5f6120928261207c565b915061209d8361207c565b92508282026120ab8161207c565b91508082146120bd576120bc611fdb565b5b5092915050565b5f6120ce8261207c565b91506120d98361207c565b9250828201905060ff8111156120f2576120f1611fdb565b5b92915050565b5f81519050919050565b5f819050602082019050919050565b5f7fffffffffffffffffffffffffffffffffffffffff00000000000000000000000082169050919050565b5f6121478251612111565b80915050919050565b5f82821b905092915050565b5f612166826120f8565b8261217084612102565b905061217b8161213c565b925060148210156121bb576121b67fffffffffffffffffffffffffffffffffffffffff00000000000000000000000083601403600802612150565b831692505b5050919050565b5f5ffd5b5f5ffd5b6121d38161207c565b81146121dd575f5ffd5b50565b5f813590506121ee816121ca565b92915050565b5f67ffffffffffffffff82169050919050565b612210816121f4565b811461221a575f5ffd5b50565b5f8135905061222b81612207565b92915050565b5f60808284031215612246576122456121c2565b5b6122506080611770565b90505f82013567ffffffffffffffff81111561226f5761226e6121c6565b5b61227b84828501611809565b5f83015250602061228e848285016121e0565b602083015250604082013567ffffffffffffffff8111156122b2576122b16121c6565b5b6122be84828501611809565b60408301525060606122d28482850161221d565b60608301525092915050565b5f67ffffffffffffffff8211156122f8576122f7611712565b5b61230182611702565b9050602081019050919050565b5f61232061231b846122de565b611770565b90508281526020810184848401111561233c5761233b6116fe565b5b6123478482856117ba565b509392505050565b5f82601f830112612363576123626116fa565b5b813561237384826020860161230e565b91505092915050565b5f60608284031215612391576123906121c2565b5b61239b6060611770565b90505f6123aa8482850161221d565b5f83015250602082013567ffffffffffffffff8111156123cd576123cc6121c6565b5b6123d98482850161234f565b602083015250604082013567ffffffffffffffff8111156123fd576123fc6121c6565b5b6124098482850161234f565b60408301525092915050565b5f6060828403121561242a576124296121c2565b5b6124346060611770565b90505f82013567ffffffffffffffff811115612453576124526121c6565b5b61245f84828501611809565b5f83015250602082013567ffffffffffffffff811115612482576124816121c6565b5b61248e84828501612231565b602083015250604082013567ffffffffffffffff8111156124b2576124b16121c6565b5b6124be8482850161237c565b60408301525092915050565b5f6124d53683612415565b9050919050565b7f496e76616c696420656d61696c20646f6d61696e0000000000000000000000005f82015250565b5f612510601483611c06565b915061251b826124dc565b602082019050919050565b5f6020820190508181035f83015261253d81612504565b9050919050565b5f81905092915050565b5f61255882611bfc565b6125628185612544565b9350612572818560208601611c16565b80840191505092915050565b5f612589828461254e565b915081905092915050565b5f81905092915050565b5f6125a8826120f8565b6125b28185612594565b93506125c2818560208601611c16565b80840191505092915050565b5f6125d9828461259e565b915081905092915050565b6125ed816119d2565b81146125f7575f5ffd5b50565b5f81519050612608816125e4565b92915050565b5f60208284031215612623576126226116f2565b5b5f612630848285016125fa565b91505092915050565b7f4e6f2077616c6c6574206164647265737320696e207375626a656374000000005f82015250565b5f61266d601c83611c06565b915061267882612639565b602082019050919050565b5f6020820190508181035f83015261269a81612661565b9050919050565b7f456d61696c206d7573742062652073656e742066726f6d2061646d696e2061635f8201527f636f756e74000000000000000000000000000000000000000000000000000000602082015250565b5f6126fb602583611c06565b9150612706826126a1565b604082019050919050565b5f6020820190508181035f830152612728816126ef565b9050919050565b61273881611b18565b82525050565b5f6020820190506127515f83018461272f565b92915050565b5f8115159050919050565b61276b81612757565b8114612775575f5ffd5b50565b5f8151905061278681612762565b92915050565b5f602082840312156127a1576127a06116f2565b5b5f6127ae84828501612778565b91505092915050565b7f4661696c6564206368656174636f646520696e766f636174696f6e00000000005f82015250565b5f6127eb601b83611c06565b91506127f6826127b7565b602082019050919050565b5f6020820190508181035f830152612818816127df565b9050919050565b7f496e76616c6964206f7267616e697a6174696f6e20726567697374726174696f5f8201527f6e20666f726d6174000000000000000000000000000000000000000000000000602082015250565b5f612879602883611c06565b91506128848261281f565b604082019050919050565b5f6020820190508181035f8301526128a68161286d565b9050919050565b5f6040820190506128c05f83018561272f565b6128cd602083018461272f565b9392505050565b5f6128de8261207c565b91506128e98361207c565b9250828203905060ff81111561290257612901611fdb565b5b92915050565b7f496e76616c6964206865782063686172616374657200000000000000000000005f82015250565b5f61293c601583611c06565b915061294782612908565b602082019050919050565b5f6020820190508181035f83015261296981612930565b9050919050565b7f456d61696c50726f6f663a206578706972656420444e532076657269666963615f8201527f74696f6e00000000000000000000000000000000000000000000000000000000602082015250565b5f6129ca602483611c06565b91506129d582612970565b604082019050919050565b5f6020820190508181035f8301526129f7816129be565b9050919050565b7f4e6f7420612076616c69642056444e532068617264636f646564206b657900005f82015250565b5f612a32601e83611c06565b9150612a3d826129fe565b602082019050919050565b5f6020820190508181035f830152612a5f81612a26565b9050919050565b5f82825260208201905092915050565b5f612a80826120f8565b612a8a8185612a66565b9350612a9a818560208601611c16565b612aa381611702565b840191505092915050565b5f6020820190508181035f830152612ac68184612a76565b905092915050565b7f4e6f7420612076616c69642056444e53207075626c6963206b657900000000005f82015250565b5f612b02601b83611c06565b9150612b0d82612ace565b602082019050919050565b5f6020820190508181035f830152612b2f81612af6565b9050919050565b5f612b408261187d565b9150612b4b8361187d565b9250828201905073ffffffffffffffffffffffffffffffffffffffff811115612b7757612b76611fdb565b5b92915050565b612b868161207c565b82525050565b612b95816121f4565b82525050565b5f608083015f8301518482035f860152612bb58282611da4565b9150506020830151612bca6020860182612b7d565b5060408301518482036040860152612be28282611da4565b9150506060830151612bf76060860182612b8c565b508091505092915050565b5f82825260208201905092915050565b5f612c1c826120f8565b612c268185612c02565b9350612c36818560208601611c16565b612c3f81611702565b840191505092915050565b5f606083015f830151612c5f5f860182612b8c565b5060208301518482036020860152612c778282612c12565b91505060408301518482036040860152612c918282612c12565b9150508091505092915050565b5f606083015f8301518482035f860152612cb88282611da4565b91505060208301518482036020860152612cd28282612b9b565b91505060408301518482036040860152612cec8282612c4a565b9150508091505092915050565b5f6020820190508181035f830152612d118184612c9e565b905092915050565b5f612d2b612d268461178a565b611770565b905082815260208101848484011115612d4757612d466116fe565b5b612d52848285611c16565b509392505050565b5f82601f830112612d6e57612d6d6116fa565b5b8151612d7e848260208601612d19565b91505092915050565b5f60808284031215612d9c57612d9b6121c2565b5b612da66080611770565b90505f82015167ffffffffffffffff811115612dc557612dc46121c6565b5b612dd184828501612d5a565b5f83015250602082015167ffffffffffffffff811115612df457612df36121c6565b5b612e0084828501612d5a565b602083015250604082015167ffffffffffffffff811115612e2457612e236121c6565b5b612e3084828501612d5a565b604083015250606082015167ffffffffffffffff811115612e5457612e536121c6565b5b612e6084828501612d5a565b60608301525092915050565b5f60208284031215612e8157612e806116f2565b5b5f82015167ffffffffffffffff811115612e9e57612e9d6116f6565b5b612eaa84828501612d87565b91505092915050565b5f60029050919050565b5f81905092915050565b5f819050919050565b5f612edb8383611da4565b905092915050565b5f602082019050919050565b5f612ef982612eb3565b612f038185612ebd565b935083602082028501612f1585612ec7565b805f5b85811015612f505784840389528151612f318582612ed0565b9450612f3c83612ee3565b925060208a01995050600181019050612f18565b50829750879550505050505092915050565b5f6020820190508181035f830152612f7a8184612eef565b905092915050565b5f67ffffffffffffffff821115612f9c57612f9b611712565b5b602082029050602081019050919050565b5f5ffd5b5f612fc3612fbe84612f82565b611770565b90508083825260208201905060208402830185811115612fe657612fe5612fad565b5b835b8181101561302d57805167ffffffffffffffff81111561300b5761300a6116fa565b5b8086016130188982612d5a565b85526020850194505050602081019050612fe8565b5050509392505050565b5f82601f83011261304b5761304a6116fa565b5b815161305b848260208601612fb1565b91505092915050565b5f60208284031215613079576130786116f2565b5b5f82015167ffffffffffffffff811115613096576130956116f6565b5b6130a284828501613037565b91505092915050565b50565b5f6130b95f83612594565b91506130c4826130ab565b5f82019050919050565b5f6130d8826130ae565b915081905091905056fe5e5265676973746572206f7267616e697a6174696f6e205c5b285b5e5c5d5d2b295c5d20666f7220616464726573733a202830785b612d66412d46302d395d7b34307d29245e56657269667920646f6d61696e206f776e65727368697020666f7220616464726573733a202830785b612d66412d46302d395d7b34307d29245e5b5c772e2d5d2b40285b612d7a412d5a5c642e2d5d2b5c2e5b612d7a412d5a5d7b322c7d2924a2646970667358221220c2c681d79a2b1d9afd025447eab88cf02211236fa716dbab02bbbeffd43a8bd364736f6c634300081c0033";


// Contract addresses (update these after deployment)
export const CONTRACT_ADDRESSES = {
  // Local development (Anvil L1)
  31337: {
    RegistrationContract: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    EmailDomainProver: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'
  },
  // Sepolia testnet
  11155111: {
    RegistrationContract: '', // Add after deployment
    EmailDomainProver: ''     // Add after deployment
  },
  // Ethereum mainnet
  1: {
    RegistrationContract: '', // Add after deployment
    EmailDomainProver: ''     // Add after deployment
  }
} as const;

// Type definitions for thirdweb
export type ContractAddresses = typeof CONTRACT_ADDRESSES;
export type SupportedChainId = keyof ContractAddresses;

// Helper to get contract address by chain ID
export function getContractAddress(
  chainId: SupportedChainId,
  contractName: keyof ContractAddresses[SupportedChainId]
): string {
  const address = CONTRACT_ADDRESSES[chainId]?.[contractName];
  if (!address) {
    throw new Error(`Contract ${contractName} not deployed on chain ${chainId}`);
  }
  return address;
}

// thirdweb contract configurations
export const registrationContractConfig = {
  address: getContractAddress,
  abi: RegistrationContractABI,
} as const;

export const emailDomainProverConfig = {
  address: getContractAddress,
  abi: EmailDomainProverABI,
} as const;

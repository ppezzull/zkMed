// Auto-generated TypeScript interface for OrganizationModule
export const OrganizationModuleABI = [
  {
    "type": "constructor",
    "inputs": [
      {
        "name": "_storage",
        "type": "address",
        "internalType": "address"
      },
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
    "name": "completeOrganizationRegistration",
    "inputs": [
      {
        "name": "organization",
        "type": "address",
        "internalType": "address"
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
      },
      {
        "name": "_role",
        "type": "uint8",
        "internalType": "enum RegistrationStorage.Role"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "core",
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
    "name": "initialize",
    "inputs": [
      {
        "name": "_core",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
        "internalType": "enum RegistrationStorage.Role"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
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
      },
      {
        "name": "targetWallet",
        "type": "address",
        "internalType": "address"
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
        "internalType": "enum RegistrationStorage.Role"
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

export interface OrganizationModuleContract {
  _setTestVerifier(newVerifier: string): Promise<void>;
  completeOrganizationRegistration(organization: string, organizationName: string, domain: string, _role: number): Promise<void>;
  core(): Promise<string>;
  emailDomainProver(): Promise<string>;
  initialize(_core: string): Promise<void>;
  registerOrganization(: any, orgData: any, _role: number): Promise<void>;
  storageContract(): Promise<string>;
  verifier(): Promise<string>;
  verifyAndStoreURL(: any, domain: string, emailHash: string, targetWallet: string): Promise<void>;
  verifyDomainOwnership(: any, emailHash: string, targetWallet: string, domain: string): Promise<void>;
}

export interface OrganizationModuleEvents {
  DomainVerified: { user: string, domain: string, emailHash: string, timestamp: bigint };
  EmailProofVerified: { organization: string, domain: string, emailHash: string, timestamp: bigint };
  OrganizationRegistered: { organization: string, domain: string, name: string, role: number, timestamp: bigint };
}

export type OrganizationModuleAddress = `0x${string}`;

// Usage example:
// const contract = getContract({
//   address: "organizationmoduleAddress",
//   abi: OrganizationModuleABI,
//   client: publicClient,
// });

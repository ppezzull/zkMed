// Auto-generated TypeScript interface for EmailDomainProver
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

export interface EmailDomainProverContract {
  proof(): Promise<any>;
  setBlock(blockNo: bigint): Promise<void>;
  setChain(chainId: bigint, blockNo: bigint): Promise<void>;
  simpleDomainVerification(unverifiedEmail: any, : string): Promise<any | string | string>;
  stringToAddress(str: string): Promise<string>;
  verifyDomainOwnership(unverifiedEmail: any): Promise<any | string | string | string>;
  verifyOrganization(unverifiedEmail: any): Promise<any | any>;
}

export interface EmailDomainProverEvents {

}

export type EmailDomainProverAddress = `0x${string}`;

// Usage example:
// const contract = getContract({
//   address: "emaildomainproverAddress",
//   abi: EmailDomainProverABI,
//   client: publicClient,
// });

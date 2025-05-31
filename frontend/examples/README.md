# zkMed Next.js Integration Examples

This directory contains complete examples showing how to integrate zkMed smart contracts into Next.js applications using thirdweb.

## Quick Start

1. Install dependencies:
```bash
npm install thirdweb @thirdweb-dev/react @thirdweb-dev/sdk
```

2. Copy the contract exports from `../backend/exports/` to your Next.js project

3. Follow the examples below for specific use cases

## Examples

- `basic-setup/` - Basic thirdweb provider setup
- `user-registration/` - Patient and doctor registration flows
- `email-verification/` - vlayer email domain verification
- `role-management/` - User role checking and display
- `organization-verification/` - Organization domain verification
- `complete-app/` - Full medical registration application

## Contract Addresses (Local Development)

- **RegistrationContract**: `0x8A791620dd6260079BF849Dc5567aDC3F2FdC318`
- **EmailDomainProver**: `0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6`
- **Chain ID**: `31337` (Anvil Local)

## Getting Started

Each example includes:
- Complete component code
- Required imports
- Usage instructions
- Error handling
- TypeScript types

Start with the `basic-setup` example to configure your Next.js app, then explore specific use cases.

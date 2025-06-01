# zkMed Frontend

A privacy-preserving healthcare platform built with Next.js 15, thirdweb, and shadcn/ui.

## Features

- 🔐 **thirdweb Authentication** - Secure wallet-based authentication with JWT sessions
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 🌙 **Dark Mode** - Full dark/light theme support
- 🏥 **Role-based Registration** - Support for Patients, Hospitals, and Insurance Companies
- 🔒 **Privacy-First** - Zero-knowledge proofs and cryptographic commitments
- 📱 **Responsive Design** - Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: thirdweb with deterministic JWT signing
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS with custom color scheme
- **Blockchain**: Ethereum (local Anvil for development)
- **Package Manager**: Bun

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- A running Ethereum node (Anvil for local development)
- Deployed registration contracts

### Installation

1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your environment variables:
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`: Your thirdweb client ID
- `THIRDWEB_SECRET_KEY`: Your thirdweb secret key (used for deterministic JWT signing)
- `NEXT_PUBLIC_REGISTRATION_CONTRACT_ADDRESS`: Deployed registration contract address

3. Start the development server:
```bash
bun dev
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page with auth flow
│   └── profile/           # Protected profile pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── registration/     # Registration flow components
│   ├── profile/          # Profile page components
│   ├── theme/            # Theme provider and toggle
│   └── ui/               # shadcn/ui components
├── actions/              # Server actions
│   ├── auth.ts           # Authentication actions
│   └── registration.ts   # Registration contract actions
├── lib/                  # Utility libraries
│   ├── client.ts         # thirdweb client configuration
│   ├── contracts.ts      # Contract instances and configuration
│   └── utils.ts          # Utility functions
└── middleware.ts         # Route protection middleware
```

## Authentication Flow

1. **Connect Wallet**: Users connect their wallet using thirdweb
2. **Sign Message**: Users sign a message to prove wallet ownership
3. **Deterministic Key Generation**: Server generates a deterministic private key using thirdweb secret + user address
4. **JWT Session**: Server creates a JWT session cookie using the deterministic key
5. **Registration Check**: Check if user is registered in the contract
6. **Role Selection**: If not registered, show role selection dialog
7. **Registration**: Complete registration based on selected role
8. **Profile Access**: Redirect to protected profile page

## Registration Roles

### Patient
- Privacy-preserving registration with cryptographic commitments
- Secure medical record management
- Insurance claim submission

### Hospital
- Domain verification via email proofs
- Patient procedure verification
- Claim processing on behalf of patients

### Insurance Company
- Domain verification via email proofs
- Policy management
- Claim review and approval

## Environment Variables

```bash
# thirdweb Configuration
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id
THIRDWEB_SECRET_KEY=your_secret_key
NEXT_PUBLIC_THIRDWEB_AUTH_DOMAIN=localhost:3000

# Contract Configuration
NEXT_PUBLIC_REGISTRATION_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_CHAIN_ID=31337
NEXT_PUBLIC_RPC_URL=http://127.0.0.1:8545

# App Configuration
NEXT_PUBLIC_APP_NAME=zkMed
NEXT_PUBLIC_APP_DESCRIPTION=Privacy-preserving healthcare platform
```

**Note**: The authentication system now uses deterministic key generation instead of a separate `AUTH_PRIVATE_KEY`. JWT signing keys are derived from your `THIRDWEB_SECRET_KEY` combined with each user's wallet address, providing user-specific authentication while maintaining security.

## Development

### Running Tests
```bash
bun test
```

### Building for Production
```bash
bun build
```

### Linting
```bash
bun lint
```

## Deployment

The frontend can be deployed to any platform that supports Next.js:

- **Vercel** (recommended)
- **Netlify**
- **AWS Amplify**
- **Self-hosted**

Make sure to set the environment variables in your deployment platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is part of the zkMed healthcare platform.

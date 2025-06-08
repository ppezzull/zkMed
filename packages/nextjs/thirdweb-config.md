# Thirdweb Configuration for zkMed

## Environment Variables Required

Create a `.env.local` file in the nextjs package directory with the following variables:

```bash
# Thirdweb Client ID (Get from https://thirdweb.com/dashboard)
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
```

## Getting Your Thirdweb Client ID

1. Go to [Thirdweb Dashboard](https://thirdweb.com/dashboard)
2. Create a new project or select an existing one
3. Copy your Client ID from the project settings
4. Add it to your `.env.local` file

## Chain Configuration

The app is configured to connect to:
- **Chain ID**: 31339 (Anvil Mantle Fork)
- **RPC URL**: http://127.0.0.1:8547
- **Network Name**: Anvil Mantle Fork

Make sure your Docker container is running:
```bash
cd zkMed/packages/foundry/vlayer/anvil
docker-compose up anvil-l1-mantle
```

## Features Enabled

### Smart Wallets (Gas Abstraction)
- Gasless transactions for users
- Account abstraction features
- Enhanced security with smart contract wallets
- Session management

### Supported Wallets
- Smart Wallets (with gas abstraction)
- In-App Wallets (email, Google, Apple, Facebook)
- MetaMask
- Coinbase Wallet
- Rainbow Wallet

### Development Features
- Local Mantle fork integration
- Development mode indicators
- Real-time wallet connection status
- Enhanced error handling

## Usage

Once configured, users can:
1. Connect with various wallet types
2. Enjoy gasless transactions via smart wallets
3. Use email/social login with in-app wallets
4. Access zkMed features with enhanced privacy

## Smart Wallet Factory

Using default Thirdweb smart wallet factory:
- Factory Address: `0x9Bb60d360932171292Ad2b80839080fb6F5aBD97`
- Gasless transactions enabled
- Compatible with Account Abstraction standards 
# zkMed Demo Data

This directory contains pre-configured demo accounts and data for the zkMed containerized deployment.

## Files

### `accounts.json` (Generated)
Auto-generated during container deployment containing:
- Demo insurer account (Regione Lazio Health Insurance)
- Demo hospital account (Ospedale San Giovanni)  
- Demo patient account
- Demo admin account
- Contract addresses and configuration

### `sample-accounts.json`
Template file showing the expected structure for demo accounts.

### `email-proofs/`
Directory containing sample email proof data for vlayer integration testing.

### `test-scenarios/`
Pre-defined test scenarios for demo workflows:
- Patient registration flows
- Hospital claim submissions
- Insurer approval processes

## Usage

The demo data is automatically configured during container deployment:

1. **zkmed-contracts** container deploys smart contracts
2. Contract addresses are saved to `accounts.json`
3. Demo accounts are funded and configured
4. **zkmed-demo-api** serves this data via REST endpoints
5. **zkmed-frontend** uses the demo configuration

## Demo Accounts

All accounts use Anvil's deterministic private keys for consistent deployment:

- **Insurer**: `0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266`
- **Hospital**: `0x70997970c51812dc3a010c7d01b50e0d17dc79c8`  
- **Patient**: `0x3c44cdddb6a900fa2b585dd299e03d12fa4293bc`
- **Admin**: `0x90f79bf6eb2c4f870365e785982e1f101e93b906`

## API Access

Demo data is accessible via the demo API:

```bash
# Get all demo accounts
curl http://localhost:8080/api/demo/accounts

# Get specific account type
curl http://localhost:8080/api/demo/accounts/insurer

# Get account balances
curl http://localhost:8080/api/demo/balances

# Get blockchain status
curl http://localhost:8080/api/demo/blockchain
```

## Security Note

This data is for demonstration purposes only. All private keys are publicly known Anvil test keys and should never be used in production environments. 
# zkMed Backend Makefile
# This Makefile provides convenient commands for local development

.PHONY: start deploy all clean help

# Default target
all: build deploy

# Start Anvil local blockchain
start:
	@echo "Starting Anvil local blockchain..."
	anvil --host 0.0.0.0 --port 8545 --chain-id 31337

# Deploy registration contracts to local Anvil
deploy:
	@echo "Deploying registration contracts..."
	forge script script/DeployRegistration.s.sol:DeployRegistration --rpc-url http://localhost:8545 --broadcast --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Clean forge artifacts
clean:
	@echo "Cleaning forge artifacts..."
	forge clean

# Build contracts
build:
	@echo "Building contracts..."
	forge build

# Run tests
test:
	@echo "Running tests..."
	forge test

# Install dependencies
install:
	@echo "Installing dependencies..."
	forge install

# Help target
help:
	@echo "Available targets:"
	@echo "  all     - Start Anvil and deploy contracts (default)"
	@echo "  start   - Start Anvil local blockchain"
	@echo "  deploy  - Deploy registration contracts to local Anvil"
	@echo "  build   - Build contracts"
	@echo "  test    - Run tests"
	@echo "  clean   - Clean forge artifacts"
	@echo "  install - Install dependencies"
	@echo "  help    - Show this help message"

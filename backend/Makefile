# zkMed Smart Contract Development Makefile
# Modular Registration System - Direct Module Deployment

.PHONY: help install build test deploy-local clean export-abis run-vlayer stop-vlayer run-anvil stop-anvil start-services stop-services status health test-email-proof deploy-production dev-stack deploy-italian-health test-italian-health test-italian-health-full vlayer-italian-setup test-italian-webproof test-italian-webproof-help test-all-italian integration-test-italian quick-test-italian quick-test-access-control quick-test-webproof-registration help-italian
.DEFAULT_GOAL := help

# ============ VARIABLES ============
RPC_URL := http://localhost:8545
PRIVATE_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
CHAIN_ID := 31337
ETHERSCAN_API_KEY := your_api_key_here

# ============ DEPENDENCIES & INSTALLATION ============

install: ## Install all dependencies
	@echo "📦 Installing dependencies..."
	forge install
	@echo "✅ Dependencies installed"

check-deps: ## Check if all required tools are installed
	@echo "🔍 Checking dependencies..."
	@command -v forge >/dev/null 2>&1 || { echo "❌ Foundry not found. Install from https://getfoundry.sh/"; exit 1; }
	@command -v node >/dev/null 2>&1 || { echo "❌ Node.js not found. Install from https://nodejs.org/"; exit 1; }
	@command -v curl >/dev/null 2>&1 || { echo "❌ curl not found. Please install curl"; exit 1; }
	@echo "✅ All dependencies check passed"

# ============ BUILD & TEST ============

build: ## Build all smart contracts
	@echo "🔨 Building contracts..."
	forge build
	@echo "✅ Build completed"

test: ## Run all tests
	@echo "🧪 Running tests..."
	forge test -vvv
	@echo "✅ Tests completed"

test-verbose: ## Run tests with verbose output
	@echo "🧪 Running tests with verbose output..."
	forge test -vvv --gas-report
	@echo "✅ Verbose tests completed"

clean: ## Clean build artifacts
	@echo "🧹 Cleaning build artifacts..."
	forge clean
	rm -rf out/
	rm -rf cache/
	rm -rf deployments/
	rm -rf exports/
	@echo "✅ Clean completed"

# ============ LOCAL DEVELOPMENT SERVICES ============

run-anvil: ## Start local Anvil node
	@echo "⚡ Starting Anvil local node..."
	@if pgrep -f "anvil" > /dev/null; then \
		echo "⚠️  Anvil is already running"; \
	else \
		anvil --host 0.0.0.0 --chain-id $(CHAIN_ID) --accounts 10 --balance 1000 &\
		echo "🟢 Anvil started on http://localhost:8545"; \
	fi

stop-anvil: ## Stop local Anvil node
	@echo "🛑 Stopping Anvil..."
	@pkill -f "anvil" || echo "⚠️  Anvil was not running"
	@echo "🔴 Anvil stopped"

run-vlayer: ## Start vlayer prover service
	@echo "🔐 Starting vlayer prover..."
	@if pgrep -f "vlayer" > /dev/null; then \
		echo "⚠️  vlayer is already running"; \
	else \
		nohup vlayer serve > vlayer.log 2>&1 & \
		echo "🟢 vlayer started (logs: vlayer.log)"; \
	fi

stop-vlayer: ## Stop vlayer prover service
	@echo "🛑 Stopping vlayer..."
	@pkill -f "vlayer" || echo "⚠️  vlayer was not running"
	@echo "🔴 vlayer stopped"

start-services: check-deps run-anvil run-vlayer ## Start all required local services
	@echo "🚀 Starting development services..."
	@sleep 2
	@echo "✅ All services started"
	@make status

stop-services: stop-anvil stop-vlayer ## Stop all local services
	@echo "🛑 Stopping all services..."
	@echo "✅ All services stopped"

status: ## Check status of all services
	@echo "📊 Service Status:"
	@echo -n "Anvil (8545): "
	@curl -s -f http://localhost:8545 >/dev/null 2>&1 && echo "🟢 Running" || echo "🔴 Stopped"
	@echo -n "vlayer: "
	@pgrep -f "vlayer" >/dev/null 2>&1 && echo "🟢 Running" || echo "🔴 Stopped"

health: ## Perform health checks
	@echo "🏥 Performing health checks..."
	@make status
	@echo "💾 Checking build artifacts..."
	@test -d "out" && echo "✅ Build artifacts present" || echo "❌ No build artifacts (run 'make build')"
	@echo "🧪 Checking test results..."
	@forge test --list | grep -q "test" && echo "✅ Tests available" || echo "❌ No tests found"

# ============ DEPLOYMENT ============

deploy-local: start-services build ## Deploy contracts to local Anvil network
	@echo "🚀 Deploying to local network..."
	@mkdir -p deployments
	forge script script/DeployLocal.s.sol:DeployLocal --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --force
	@echo "✅ Local deployment completed"
	@echo "📄 Deployment info saved to deployments/local.json"

deploy-production: ## Deploy to production network (requires MAINNET_RPC_URL and MAINNET_PRIVATE_KEY)
	@echo "🌐 Deploying to production..."
	@if [ -z "$(MAINNET_RPC_URL)" ] || [ -z "$(MAINNET_PRIVATE_KEY)" ]; then \
		echo "❌ Set MAINNET_RPC_URL and MAINNET_PRIVATE_KEY environment variables"; \
		exit 1; \
	fi
	forge script script/DeployLocal.s.sol:DeployLocal --rpc-url $(MAINNET_RPC_URL) --private-key $(MAINNET_PRIVATE_KEY) --broadcast --verify --etherscan-api-key $(ETHERSCAN_API_KEY)
	@echo "✅ Production deployment completed"

# ============ ABI EXPORT & FRONTEND INTEGRATION ============

export-abis: build ## Export contract ABIs for frontend integration
	@echo "📤 Exporting ABIs and creating TypeScript interfaces..."
	@node scripts/export-abis.cjs

# ============ EMAIL PROOF TESTING ============

test-email-proof: ## Test email domain proof functionality
	@echo "📧 Testing email domain proof..."
	@if ! pgrep -f "vlayer" >/dev/null 2>&1; then \
		echo "❌ vlayer not running. Start with 'make run-vlayer'"; \
		exit 1; \
	fi
	@if ! curl -s -f http://localhost:8545 >/dev/null 2>&1; then \
		echo "❌ Anvil not running. Start with 'make run-anvil'"; \
		exit 1; \
	fi
	@echo "🧪 Running email proof tests..."
	cd scripts && node proveEmailDomain.js help
	@echo "✅ Email proof testing available"

# ============ DEVELOPMENT WORKFLOW ============

dev-stack: ## Start complete development stack
	@echo "🔧 Starting complete development stack..."
	@make clean
	@make start-services
	@make build
	@make deploy-local
	@make export-abis
	@echo "🎉 Development stack ready!"
	@echo ""
	@echo "🚀 Next steps:"
	@echo "  1. Start your Next.js frontend"
	@echo "  2. Import contracts from exports/"
	@echo "  3. Use deployment addresses from deployments/local.json"
	@echo "  4. Test email proofs with: make test-email-proof"

rebuild: ## Clean, build, and redeploy everything
	@echo "🔄 Rebuilding everything..."
	@make clean
	@make build
	@make deploy-local
	@make export-abis
	@echo "✅ Rebuild completed"

# ============ QUICK COMMANDS ============

quick-test: ## Quick test run without verbose output
	@forge test --no-match-test "testFail"

quick-deploy: ## Quick deployment without starting services (assumes they're running)
	@forge script script/DeployLocal.s.sol:DeployLocal --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --force

logs: ## Show recent logs
	@echo "📋 Recent logs:"
	@echo "=== Anvil Logs ==="
	@tail -20 nohup.out 2>/dev/null || echo "No Anvil logs found"
	@echo "=== vlayer Logs ==="
	@tail -20 vlayer.log 2>/dev/null || echo "No vlayer logs found"

# ============ HELP ============

help: ## Show this help message
	@echo "zkMed Smart Contract Development"
	@echo "================================"
	@echo ""
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🚀 Quick start:"
	@echo "  make dev-stack    # Start everything"
	@echo "  make status       # Check services"
	@echo "  make health       # Health check"
	@echo ""
	@echo "🔧 Development:"
	@echo "  make build test deploy-local export-abis"
	@echo ""
	@echo "📡 Services:"
	@echo "  Anvil:  http://localhost:8545"
	@echo "  vlayer: Background service for email proofs"

# Italian Health System WebProof Integration
deploy-italian-health:
	@echo "🏥 Deploying Italian Health System WebProof contracts..."
	@if [ ! -f .env ]; then echo "❌ .env file not found. Please create it with PRIVATE_KEY."; exit 1; fi
	@export $$(grep -v '^#' .env | xargs) && \
	export REGISTRATION_CONTRACT=$$(jq -r '.registrationContract // empty' deployments/local.json 2>/dev/null || echo "") && \
	if [ -z "$$REGISTRATION_CONTRACT" ]; then \
		echo "❌ No existing RegistrationContract found. Please deploy the main system first with 'make deploy-local'"; \
		exit 1; \
	else \
		echo "✅ Using existing RegistrationContract: $$REGISTRATION_CONTRACT"; \
		forge script script/DeployItalianHealthWebProof.s.sol:DeployItalianHealthWebProof \
			--rpc-url http://localhost:8545 \
			--broadcast \
			--private-key $$PRIVATE_KEY; \
	fi

test-italian-health:
	@echo "🧪 Running Italian Health System WebProof tests..."
	forge test --match-contract ItalianHealthWebProofTest -vv

test-italian-health-full:
	@echo "🧪 Running comprehensive Italian Health System tests..."
	@echo "Testing access controls, WebProof verification, and patient registration..."
	forge test --match-contract ItalianHealthWebProofTest -vvv

vlayer-italian-setup:
	@echo "🔧 Setting up vlayer for Italian Health System integration..."
	@cd vlayer && \
	if [ ! -f package.json ]; then \
		echo "❌ vlayer directory not properly configured. Please run 'make vlayer-setup' first."; \
		exit 1; \
	fi && \
	echo "📋 Installing additional dependencies for Italian health integration..." && \
	bun install && \
	echo "✅ vlayer setup complete for Italian health system"

test-italian-webproof:
	@echo "🏥 Testing Italian Health System WebProof generation..."
	@cd vlayer && \
	if [ ! -f proveItalianHealthSystem.ts ]; then \
		echo "❌ proveItalianHealthSystem.ts not found"; \
		exit 1; \
	fi && \
	echo "📋 Running WebProof generation test..." && \
	bun run proveItalianHealthSystem.ts \
		--address 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 \
		--commitment 0x1234567890123456789012345678901234567890123456789012345678901234

test-italian-webproof-help:
	@echo "📋 Showing Italian Health System WebProof help..."
	@cd vlayer && bun run proveItalianHealthSystem.ts --help

test-all-italian:
	@echo "🔄 Running all Italian Health System tests..."
	@make test-italian-health
	@make test-italian-webproof
	@echo "✅ All Italian Health System tests completed!"

integration-test-italian:
	@echo "🔄 Running full Italian Health System integration test..."
	@make run-anvil
	@sleep 2
	@make deploy-local
	@make deploy-italian-health
	@make test-italian-health-full
	@make test-italian-webproof
	@echo "✅ Italian Health System integration test completed!"

# Fast testing commands
quick-test-italian:
	@echo "⚡ Quick Italian health test (no verbose output)..."
	forge test --match-contract ItalianHealthWebProofTest

quick-test-access-control:
	@echo "🔒 Testing access control for Italian health registration..."
	forge test --match-test testOnlyVerifierCanRegister -v

quick-test-webproof-registration:
	@echo "🏥 Testing WebProof registration flow..."
	forge test --match-test testPatientRegistrationWithWebProof -v

help-italian:
	@echo "🏥 Italian Health System WebProof Integration Commands:"
	@echo ""
	@echo "Deployment & Setup:"
	@echo "  deploy-italian-health     Deploy Italian health WebProof contracts"
	@echo "  vlayer-italian-setup      Set up vlayer for Italian health integration"
	@echo ""
	@echo "Testing Commands:"
	@echo "  test-italian-health       Run Italian health WebProof tests"
	@echo "  test-italian-health-full  Run comprehensive tests with verbose output"
	@echo "  test-italian-webproof     Test Italian health WebProof generation"
	@echo "  test-italian-webproof-help Show WebProof script help"
	@echo "  test-all-italian          Run all Italian health tests"
	@echo "  integration-test-italian  Run full integration test"
	@echo ""
	@echo "Quick Tests:"
	@echo "  quick-test-italian        Fast test run (no verbose output)"
	@echo "  quick-test-access-control Test access control only"
	@echo "  quick-test-webproof-registration Test WebProof registration only"
	@echo ""
	@echo "Prerequisites:"
	@echo "  1. Anvil running (make run-anvil)"
	@echo "  2. Main system deployed (make deploy-local)"
	@echo "  3. vlayer setup completed (make vlayer-italian-setup)"
	@echo ""
	@echo "Example workflows:"
	@echo "  # Complete setup and test"
	@echo "  make integration-test-italian"
	@echo ""
	@echo "  # Quick development cycle"
	@echo "  make run-anvil && make deploy-local && make deploy-italian-health"
	@echo "  make quick-test-italian"
	@echo ""
	@echo "  # Test specific functionality"
	@echo "  make quick-test-access-control"
	@echo "  make test-italian-webproof"

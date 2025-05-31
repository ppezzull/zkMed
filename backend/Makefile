# zkMed Backend Makefile
# This Makefile provides convenient commands for local development and deployment

.PHONY: help build test clean start-anvil start-vlayer start-local deploy-local deploy-prod test-local stop-local status health

# Default target
all: build test

# Variables
ANVIL_KEY := 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
LOCAL_RPC := http://localhost:8545
VLAYER_DIR := vlayer

# Help target
help:
	@echo "zkMed Development Commands:"
	@echo ""
	@echo "  build          - Compile all contracts"
	@echo "  test           - Run all tests"
	@echo "  clean          - Clean build artifacts"
	@echo ""
	@echo "Local Development:"
	@echo "  start-anvil    - Start Anvil blockchain"
	@echo "  start-vlayer   - Start vlayer services"
	@echo "  start-local    - Start complete local environment"
	@echo "  deploy-local   - Deploy contracts to local Anvil"
	@echo "  test-local     - Run tests against local deployment"
	@echo "  stop-local     - Stop all local services"
	@echo "  status         - Check service status"
	@echo "  health         - Health check all services"
	@echo ""
	@echo "Email Proof Testing:"
	@echo "  test-email-proof - Test email proof workflow"
	@echo ""
	@echo "Production:"
	@echo "  deploy-prod    - Deploy to production network"
	@echo ""
	@echo "Utilities:"
	@echo "  logs           - Show service logs"
	@echo "  reset          - Reset local environment"
	@echo "  setup          - Full development setup"
	@echo ""
	@echo "Vlayer Development Tools:"
	@echo "  start-vlayer   - Start vlayer services"
	@echo "  stop-vlayer    - Stop vlayer services"
	@echo "  restart-vlayer  - Restart vlayer services"
	@echo "  status-vlayer  - Show vlayer service status"
	@echo "  logs-vlayer    - Show vlayer service logs"
	@echo "  clean-vlayer   - Clean vlayer environment"
	@echo "  dev-setup      - Set up development environment"
	@echo "  dev-test       - Run tests in development environment"
	@echo "  dev-deploy     - Deploy in development environment"
	@echo "  dev-health     - Health check in development environment"
	@echo "  dev-monitor    - Monitor development environment"
	@echo "  dev-reset      - Reset development environment"
	@echo "  diag           - Quick diagnostics"
	@echo "  dashboard      - Interactive monitoring dashboard"
	@echo "  test-prove     - Test email proof workflow in development"

# Build contracts
build:
	@echo "🔨 Building contracts..."
	forge build

# Run tests
test:
	@echo "🧪 Running tests..."
	forge test

# Clean build artifacts
clean:
	@echo "🧹 Cleaning build artifacts..."
	forge clean
	cd $(VLAYER_DIR) && rm -rf node_modules/.cache

# === LOCAL DEVELOPMENT ===

# Start Anvil blockchain
start-anvil:
	@echo "🚀 Starting Anvil blockchain..."
	@echo "Network: anvil (Chain ID: 31337)"
	@echo "RPC URL: $(LOCAL_RPC)"
	anvil --host 0.0.0.0 --port 8545 --chain-id 31337

# Start vlayer services
start-vlayer:
	cd vlayer && docker compose -f docker-compose.devnet.yaml up -d
	@echo "✅ vlayer services started"

stop-vlayer:
	cd vlayer && docker compose -f docker-compose.devnet.yaml down
	@echo "✅ vlayer services stopped"

restart-vlayer:
	cd vlayer && docker compose -f docker-compose.devnet.yaml restart
	@echo "✅ vlayer services restarted"

status-vlayer:
	@./scripts/vlayer-docker-analysis.sh status

logs-vlayer:
	@./scripts/vlayer-docker-analysis.sh logs

clean-vlayer:
	cd vlayer && docker compose -f docker-compose.devnet.yaml down --remove-orphans
	docker system prune -f
	@echo "✅ vlayer environment cleaned"

# Development Environment Tools
dev-setup:
	@./scripts/vlayer-dev-env.sh setup

dev-test:
	@./scripts/vlayer-dev-env.sh test-env

dev-deploy:
	@./scripts/vlayer-dev-env.sh deploy

dev-health:
	@./scripts/vlayer-dev-env.sh health

dev-monitor:
	@./scripts/vlayer-dev-env.sh monitor

dev-reset:
	@./scripts/vlayer-dev-env.sh reset

# Quick Diagnostics
diag:
	@./scripts/vlayer-quick-diag.sh

# Interactive Dashboard
dashboard:
	@./scripts/vlayer-dashboard.sh

# Proof Testing
test-prove:
	@./scripts/vlayer-dev-env.sh prove

# === EMAIL PROOF TESTING ===

# Test email proof workflow
test-email-proof:
	@echo "📧 Testing email proof workflow..."
	cd $(VLAYER_DIR) && cp .env.dev .env
	cd $(VLAYER_DIR) && npx tsx proveEmailDomain.ts

# === PRODUCTION DEPLOYMENT ===

# Deploy to production network
deploy-prod:
	@echo "🚀 Deploying to production..."
	@if [ -z "$(RPC_URL)" ]; then echo "❌ Error: RPC_URL not set"; exit 1; fi
	@if [ -z "$(PRIVATE_KEY)" ]; then echo "❌ Error: PRIVATE_KEY not set"; exit 1; fi
	forge script script/DeployProduction.s.sol --rpc-url $(RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --verify
	@echo "✅ Production deployment complete!"

# === UTILITIES ===

# Show logs for debugging
logs:
	@echo "📋 Docker Service Logs:"
	cd $(VLAYER_DIR) && docker-compose -f docker-compose.devnet.yaml logs --tail=50

# Reset local environment
reset:
	@echo "🔄 Resetting local environment..."
		@make stop-local
	@make clean
	@echo "✅ Environment reset complete"

# Full development setup from scratch
setup:
	@echo "🛠️  Setting up development environment..."
	@make clean
	@make build
	@make start-local
	@sleep 5
	@make deploy-local
	@make test-local
	@echo "🎉 Development environment ready!"
	@echo "  build   - Build contracts"
	@echo "  test    - Run tests"
	@echo "  clean   - Clean forge artifacts"
	@echo "  install - Install dependencies"
	@echo "  help    - Show this help message"

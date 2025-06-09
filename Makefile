# zkMed Container Management
.PHONY: help build up down logs shell clean demo-up demo-down demo-logs demo-shell

# Default target
help: ## Show this help message
	@echo "zkMed Container Management Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Basic container operations
build: ## Build all containers
	@echo "🔨 Building zkMed containers..."
	docker-compose build

up: ## Start all services
	@echo "🚀 Starting zkMed stack..."
	cd packages/foundry/vlayer && docker-compose -f docker-compose.devnet.yaml up -d
	sleep 10
	docker-compose up -d

down: ## Stop all services
	@echo "🛑 Stopping zkMed stack..."
	docker-compose down
	cd packages/foundry/vlayer && docker-compose -f docker-compose.devnet.yaml down

restart: ## Restart all services
	@echo "🔄 Restarting zkMed stack..."
	$(MAKE) down
	sleep 5
	$(MAKE) up

logs: ## Show logs for all services
	docker-compose logs -f

status: ## Show status of all containers
	@echo "📊 Container Status:"
	@echo ""
	@echo "vlayer Services:"
	cd packages/foundry/vlayer && docker-compose -f docker-compose.devnet.yaml ps
	@echo ""
	@echo "zkMed Services:"
	docker-compose ps

# Individual service operations
logs-vlayer: ## Show vlayer service logs
	cd packages/foundry/vlayer && docker-compose -f docker-compose.devnet.yaml logs -f

logs-contracts: ## Show contract deployment logs
	docker-compose logs -f zkmed-contracts

logs-frontend: ## Show frontend logs
	docker-compose logs -f zkmed-frontend

logs-api: ## Show demo API logs
	docker-compose logs -f zkmed-demo-api

logs-proxy: ## Show nginx proxy logs
	docker-compose logs -f zkmed-proxy

# Development operations
shell-contracts: ## Open shell in contracts container
	docker-compose exec zkmed-contracts /bin/bash

shell-frontend: ## Open shell in frontend container
	docker-compose exec zkmed-frontend /bin/sh

shell-api: ## Open shell in demo API container
	docker-compose exec zkmed-demo-api /bin/sh

# Demo and testing
demo-setup: ## Setup demo environment
	@echo "🎭 Setting up demo environment..."
	$(MAKE) build
	$(MAKE) up
	@echo "⏳ Waiting for services to initialize..."
	sleep 30
	@echo "✅ Demo environment ready!"
	@echo ""
	@echo "🌐 Access URLs:"
	@echo "  Frontend: http://localhost"
	@echo "  Demo API: http://localhost:8080"
	@echo "  RPC: http://localhost/rpc"
	@echo "  vlayer Call Server: http://localhost:3000"
	@echo ""
	@echo "📋 Demo Commands:"
	@echo "  make demo-status    - Check demo status"
	@echo "  make demo-accounts  - Show demo accounts"
	@echo "  make demo-test      - Run demo tests"

demo-status: ## Show demo environment status
	@echo "🔍 Demo Environment Status:"
	@echo ""
	curl -s http://localhost:8080/api/demo/blockchain | jq .
	@echo ""
	curl -s http://localhost:8080/api/demo/accounts | jq '.data.accounts | keys'

demo-accounts: ## Show demo account details
	@echo "👥 Demo Accounts:"
	curl -s http://localhost:8080/api/demo/accounts | jq '.data.accounts'

demo-balances: ## Show demo account balances
	@echo "💰 Demo Account Balances:"
	curl -s http://localhost:8080/api/demo/balances | jq .

demo-test: ## Run demo workflow tests
	@echo "🧪 Testing demo workflows..."
	@echo "Patient Registration:"
	curl -s -X POST http://localhost:8080/api/demo/register-patient \
		-H "Content-Type: application/json" \
		-d '{"commitment":"0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"}' | jq .
	@echo ""
	@echo "Claim Submission:"
	curl -s -X POST http://localhost:8080/api/demo/submit-claim \
		-H "Content-Type: application/json" \
		-d '{"amount":"1000","description":"Demo procedure"}' | jq .
	@echo ""
	@echo "Claim Approval:"
	curl -s -X POST http://localhost:8080/api/demo/approve-claim \
		-H "Content-Type: application/json" \
		-d '{"claimId":"DEMO_CLAIM","amount":"1000"}' | jq .

# Health checks
health: ## Check health of all services
	@echo "🏥 Health Checks:"
	@echo ""
	@echo "Frontend:"
	@curl -s http://localhost:3000/health.json | jq . || echo "❌ Frontend not responding"
	@echo ""
	@echo "Demo API:"
	@curl -s http://localhost:8080/health | jq . || echo "❌ Demo API not responding"
	@echo ""
	@echo "Nginx Proxy:"
	@curl -s http://localhost/health || echo "❌ Proxy not responding"
	@echo ""
	@echo "Blockchain RPC:"
	@curl -s -X POST -H "Content-Type: application/json" \
		--data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
		http://localhost/rpc | jq . || echo "❌ RPC not responding"

# Cleanup operations
clean: ## Clean up containers and volumes
	@echo "🧹 Cleaning up..."
	docker-compose down -v
	cd packages/foundry/vlayer && docker-compose -f docker-compose.devnet.yaml down -v
	docker system prune -f

clean-all: ## Clean up everything including images
	@echo "🧹 Deep cleaning..."
	$(MAKE) clean
	docker-compose down --rmi all
	cd packages/foundry/vlayer && docker-compose -f docker-compose.devnet.yaml down --rmi all

reset: ## Reset entire environment
	@echo "🔄 Resetting environment..."
	$(MAKE) clean
	$(MAKE) build
	$(MAKE) up

# Development helpers
dev-env: ## Setup development environment
	@echo "🛠️ Setting up development environment..."
	@echo "Installing required tools..."
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required"; exit 1; }
	@command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required"; exit 1; }
	@command -v jq >/dev/null 2>&1 || { echo "⚠️ jq recommended for JSON parsing"; }
	@command -v curl >/dev/null 2>&1 || { echo "⚠️ curl recommended for API testing"; }
	@echo "✅ Development environment ready"

watch: ## Watch logs from all services
	docker-compose logs -f --tail=50

# Production helpers
prod-build: ## Build for production
	@echo "🏭 Building for production..."
	docker-compose -f docker-compose.yml build --no-cache

prod-deploy: ## Deploy to production (requires additional configuration)
	@echo "🚀 Production deployment requires additional configuration"
	@echo "Please configure your production environment variables and domain settings"

# Documentation
docs: ## Generate documentation
	@echo "📚 zkMed Container Documentation"
	@echo ""
	@echo "Architecture:"
	@echo "  - vlayer services (anvil, call_server, vdns_server, notary-server)"
	@echo "  - zkmed-contracts (smart contract deployment)"
	@echo "  - zkmed-frontend (Next.js application)"
	@echo "  - zkmed-demo-api (demo data API)"
	@echo "  - zkmed-proxy (nginx reverse proxy)"
	@echo ""
	@echo "For detailed information, see:"
	@echo "  - ./demo-data/README.md"
	@echo "  - ./containers/*/README.md"
	@echo "  - ./docker-compose.yml"

# Quick start
quick-start: ## Quick start for new users
	@echo "🚀 zkMed Quick Start"
	@echo ""
	@echo "1. Setting up development environment..."
	$(MAKE) dev-env
	@echo ""
	@echo "2. Building containers..."
	$(MAKE) build
	@echo ""
	@echo "3. Starting demo environment..."
	$(MAKE) demo-setup
	@echo ""
	@echo "🎉 Quick start complete!"
	@echo ""
	@echo "Next steps:"
	@echo "  - Visit http://localhost for the demo frontend"
	@echo "  - Use 'make demo-test' to test workflows"
	@echo "  - Use 'make logs' to monitor services"
	@echo "  - Use 'make help' for more commands" 
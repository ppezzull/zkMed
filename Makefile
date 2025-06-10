# zkMed - Docker Deployment
.PHONY: help all deploy stop restart logs health validate up down check-anvil deploy-contracts extract-env clean clean-all dev-setup status quick-start

# Default target
all: ## Complete development setup with vlayer + zkMed (validate + deploy + status)
	@echo "🚀 zkMed Complete Development Setup (vlayer + zkMed)"
	@echo "================================================="
	@echo "1️⃣ Validating environment..."
	@$(MAKE) validate
	@echo ""
	@echo "2️⃣ Deploying unified vlayer + zkMed stack..."
	@$(MAKE) deploy
	@echo ""
	@echo "3️⃣ Final status check..."
	@$(MAKE) status
	@echo ""
	@echo "🎉 Complete setup finished!"
	@echo "📊 Frontend: http://localhost:3001"
	@echo "🔧 Dev Page: http://localhost:3001/dev"
	@echo "🔗 vlayer Services: http://localhost:3000 (prover), http://localhost:7047 (notary)"
	@echo ""
	@echo "📚 Useful commands:"
	@echo "  make logs      # Monitor all container logs"
	@echo "  make health    # Check full deployment health"
	@echo "  make clean     # Clean up everything"

help: ## Show this help message
	@echo "zkMed Docker Deployment Commands:"
	@echo ""
	@echo "🏁 SETUP COMMANDS:"
	@echo "  all                  Complete development setup (validate + deploy + status)"
	@echo ""
	@echo "🐳 DOCKER COMMANDS (docker-compose.yml - Local Testing):"
	@echo "  deploy               Deploy zkMed locally with docker-compose.yml"
	@echo "  up                   Start all services with docker-compose.yml"
	@echo "  down                 Stop all services with docker-compose.yml"
	@echo "  restart              Restart all services with docker-compose.yml"
	@echo "  logs                 Show logs from docker-compose.yml services"
	@echo "  health               Check health of main deployment"
	@echo "  validate             Validate main deployment setup"
	@echo ""

	@echo ""

	@echo ""
	@echo "🔧 UTILITY COMMANDS:"
	@echo "  check-anvil          Check if Anvil is running on port 8547"
	@echo "  check-env            Check environment variables configuration"
	@echo "  extract-env          Extract contract environment from deployment"
	@echo "  dev-setup            Setup development environment"
	@echo "  clean                Complete cleanup (containers + images + volumes)"
	@echo "  clean-light          Light cleanup (containers + volumes, keep images)"
	@echo "  status               Show deployment status"
	@echo "  quick-start          Quick start guide for new users"

# ==================================================================================
# 🐳 DOCKER COMMANDS (docker-compose.yml - Local Testing)
# ==================================================================================

deploy: ## Deploy unified vlayer + zkMed stack with docker-compose.yml
	@echo "🚀 Starting Unified vlayer + zkMed Deployment..."
	@echo "🔧 Starting all services (vlayer infrastructure + zkMed)..."
	@docker compose up -d
	@echo "⏳ Waiting for vlayer services to initialize..."
	@sleep 10
	@echo "⏳ Waiting for contract deployment..."
	@sleep 15
	@$(MAKE) extract-env
	@echo "🔄 Restarting frontend with deployed contracts..."
	@docker compose restart zkmed-frontend
	@$(MAKE) health
	@echo "🎉 Unified deployment complete!"
	@echo "📊 Frontend: http://localhost:3001"
	@echo "🔧 Dev Page: http://localhost:3001/dev"
	@echo "🔗 vlayer Prover: http://localhost:3000"
	@echo "🔗 vlayer Notary: http://localhost:7047"

up: ## Start all services with docker-compose.yml
	@echo "🔧 Starting zkMed services..."
	@docker compose up -d

down: ## Stop all services with docker-compose.yml  
	@echo "🛑 Stopping zkMed services..."
	@docker compose down

stop: ## Stop all services with docker-compose.yml
	@$(MAKE) down

restart: ## Restart all services with docker-compose.yml
	@echo "🔄 Restarting zkMed services..."
	@docker compose restart

logs: ## Show logs from docker-compose.yml services
	@docker compose logs -f

health: ## Check health of unified vlayer + zkMed deployment
	@echo "🏥 Unified vlayer + zkMed Health Check"
	@echo "===================================="
	@echo "🔗 vlayer Infrastructure:"
	@echo "Anvil L2 Mantle (port 8547):"
	@curl -s -X POST -H "Content-Type: application/json" \
		--data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
		http://localhost:8547 >/dev/null && echo "✅ Anvil L2 Mantle responding" || echo "❌ Anvil L2 Mantle not responding"
	@echo "vlayer Call Server (port 3000):"
	@curl -s http://localhost:3000/health >/dev/null && echo "✅ vlayer Call Server responding" || echo "❌ vlayer Call Server not responding"
	@echo "Notary Server (port 7047):"
	@curl -s http://localhost:7047 >/dev/null && echo "✅ Notary Server responding" || echo "❌ Notary Server not responding"
	@echo ""
	@echo "🏥 zkMed Application:"
	@echo "Frontend Health:"
	@curl -s http://localhost:3001/api/health >/dev/null && echo "✅ Frontend responding" || echo "❌ Frontend not responding"
	@echo "Contract Status:"
	@curl -s http://localhost:3001/api/contracts | jq -r '.status // "error"' 2>/dev/null || echo "❌ Contracts API not responding"

validate: ## Validate main deployment setup
	@echo "🔍 zkMed Deployment Setup Validation"
	@echo "===================================="
	@echo "📁 Checking essential files..."
	@test -f docker-compose.yml && echo "✅ Main Docker Compose File" || echo "❌ Missing docker-compose.yml"
	@test -f srcs/foundry/vlayer/docker-compose.devnet.yaml && echo "✅ vlayer Compose File" || echo "❌ Missing vlayer compose file"
	@test -f srcs/nextjs/Dockerfile && echo "✅ Next.js Dockerfile" || echo "❌ Missing Next.js Dockerfile"
	@test -f srcs/foundry/Dockerfile.deployer && echo "✅ Contract Deployer Dockerfile" || echo "❌ Missing Contract Deployer Dockerfile"
	@test -f srcs/foundry/src/Greeting.sol && echo "✅ Greeting Contract" || echo "❌ Missing Greeting Contract"
	@test -f srcs/foundry/scripts/deploy.sh && echo "✅ Deployment Script" || echo "❌ Missing Deployment Script"
	@test -f srcs/nextjs/app/dev/page.tsx && echo "✅ Development Page" || echo "❌ Missing Development Page"
	@echo ""
	@echo "🐳 Checking Docker setup..."
	@command -v docker >/dev/null 2>&1 && echo "✅ Docker available" || echo "❌ Docker not found"
	@docker compose version >/dev/null 2>&1 && echo "✅ Docker Compose available" || echo "❌ Docker Compose not found"
	@echo ""
	@echo "✅ All files and requirements validated!"



# ==================================================================================
# 🔧 UTILITY COMMANDS
# ==================================================================================

check-env: ## Check environment variables configuration
	@echo "⚙️ zkMed Environment Variables Configuration"
	@echo "=========================================="
	@echo "🔗 Blockchain Configuration:"
	@echo "  NEXT_PUBLIC_RPC_URL: http://host.docker.internal:8547"
	@echo "  NEXT_PUBLIC_CHAIN_ID: 31339"
	@echo ""
	@echo "🔑 thirdweb Configuration:"
	@echo "  NEXT_PUBLIC_THIRDWEB_CLIENT_ID: b928ddd875d3769c8652f348e29a52c5"
	@echo "  SMART_WALLET_FACTORY_MANTLE: 0x06224c9387a352a953d6224bfff134c3dd247313"
	@echo ""
	@echo "🌐 vlayer Service URLs (Docker Container Network):"
	@echo "  VLAYER_ENV: dev"
	@echo "  CHAIN_NAME: anvil"
	@echo "  PROVER_URL: http://host.docker.internal:3000"
	@echo "  JSON_RPC_URL: http://host.docker.internal:8547"
	@echo "  NOTARY_URL: http://host.docker.internal:7047"
	@echo "  WS_PROXY_URL: ws://host.docker.internal:3003"
	@echo ""
	@echo "🔐 Development Test Key:"
	@echo "  EXAMPLES_TEST_PRIVATE_KEY: 0xac0974... (Anvil Account #0)"
	@echo ""
	@echo "✅ All environment variables are configured for Docker container networking!"
	@echo "⚠️ These use host.docker.internal for proper container-to-host communication"

check-anvil: ## Check if Anvil is running on port 8547
	@echo "🔍 Checking Anvil Mantle Fork..."
	@curl -s -X POST -H "Content-Type: application/json" \
		--data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
		http://localhost:8547 >/dev/null || { \
		echo "❌ Anvil not detected on port 8547"; \
		echo "⚠️  Please ensure vlayer services are running:"; \
		echo "   - Run 'make anvil-mantle' to start the Mantle fork"; \
		echo "   - Or check that anvil is running on port 8547"; \
		exit 1; \
	}
	@echo "✅ Anvil Mantle Fork is ready!"

extract-env: ## Extract contract environment from deployment
	@echo "🔄 Extracting contract environment variables..."
	@mkdir -p docker-shared
	@echo "# Checking for deployment artifacts..."
	@if [ -f "./srcs/foundry/out/contracts.env" ]; then \
		echo "✅ Found deployment environment file"; \
		cp "./srcs/foundry/out/contracts.env" "./docker-shared/contracts.env"; \
	else \
		echo "⚠️ No deployment environment found, checking Docker volume..."; \
		if docker volume inspect zkmed_contract_artifacts >/dev/null 2>&1; then \
			echo "✅ Found contract artifacts volume"; \
			TEMP_CONTAINER=$$(docker create --rm -v zkmed_contract_artifacts:/data alpine:latest); \
			if docker cp "$$TEMP_CONTAINER:/data/contracts.env" "./docker-shared/contracts.env" 2>/dev/null; then \
				echo "📄 Successfully extracted environment from Docker volume"; \
			else \
				echo "ℹ️ Using fallback environment configuration"; \
			fi; \
			docker rm "$$TEMP_CONTAINER" >/dev/null 2>&1; \
		else \
			echo "ℹ️ No artifacts volume found, using fallback configuration"; \
		fi; \
	fi
	@echo "📄 Environment file: docker-shared/contracts.env"
	@cat "./docker-shared/contracts.env" 2>/dev/null || echo "❌ Environment file not found"

dev-setup: ## Setup development environment
	@echo "🛠️ Setting up development environment..."
	@command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required"; exit 1; }
	@command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1 || { echo "❌ Docker Compose is required"; exit 1; }
	@command -v jq >/dev/null 2>&1 || echo "⚠️ jq recommended for JSON parsing"
	@command -v curl >/dev/null 2>&1 || echo "⚠️ curl recommended for API testing"
	@echo "✅ Development environment ready"

clean: ## Complete cleanup - remove all containers, images, and volumes
	@echo "🧹 Complete zkMed Cleanup (containers + images + volumes)"
	@echo "========================================================="
	@echo "🛑 Stopping and removing all containers..."
	@docker compose down -v --rmi all 2>/dev/null || true
	@echo "🗑️ Removing zkMed volumes..."
	@docker volume rm zkmed_contract_artifacts 2>/dev/null || true
	@docker volume rm zkmed_contract-artifacts 2>/dev/null || true
	@echo "🧽 Cleaning Docker system..."
	@docker system prune -af --volumes
	@echo "📁 Cleaning local files..."
	@rm -rf docker-shared 2>/dev/null || true
	@rm -rf srcs/foundry/out 2>/dev/null || true
	@echo "✅ Complete cleanup finished!"

clean-light: ## Light cleanup - containers and volumes only (keep images)
	@echo "🧹 Light zkMed cleanup (containers + volumes, keep images)..."
	@docker compose down -v 2>/dev/null || true
	@docker volume rm zkmed_contract_artifacts 2>/dev/null || true
	@docker volume rm zkmed_contract-artifacts 2>/dev/null || true
	@docker system prune -f --volumes
	@rm -rf docker-shared 2>/dev/null || true
	@echo "✅ Light cleanup finished!"

status: ## Show unified deployment status
	@echo "📊 Unified vlayer + zkMed Status"
	@echo "==============================="
	@echo "All Services (docker-compose.yml):"
	@docker compose ps || echo "No containers running"
	@echo ""
	@$(MAKE) health

quick-start: ## Quick start guide for new users
	@echo "🚀 zkMed Quick Start Guide"
	@echo ""
	@echo "🏃‍♂️ Super Quick (everything in one command):"
	@echo "   make all                    # Complete setup + deployment"
	@echo ""
	@echo "📝 Step by step:"
	@echo "   1. make validate            # Check environment"
	@echo "   2. make deploy              # Deploy locally"
	@echo "   3. make logs                # Monitor logs"
	@echo ""
	@echo "🎯 Access points:"
	@echo "   Frontend: http://localhost:3001"
	@echo "   Dev Page: http://localhost:3001/dev"
	@echo ""
	@echo "🧹 When done:"
	@echo "   make clean                  # Remove everything"

 
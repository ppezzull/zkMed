# vlayer Development Tools Documentation

This document provides a comprehensive overview of the vlayer development tools created for the zkMed backend project.

## 🎯 Overview

The vlayer development environment consists of multiple Docker services that provide:
- **Anvil L1**: Local Ethereum blockchain (Chain ID: 31337, Port: 8545)
- **Anvil L2**: Local Optimism blockchain (Chain ID: 31338, Port: 8546)
- **Call Server**: vlayer proof generation service (Port: 3000)
- **VDNS Server**: vlayer DNS service (Port: 3002)
- **Notary Server**: TLS notarization service (Port: 7047)
- **WebProxy**: WebSocket proxy service (Port: 3003)

## 🛠️ Development Scripts

### 1. vlayer-docker-analysis.sh
**Location**: `scripts/vlayer-docker-analysis.sh`

Comprehensive Docker infrastructure analysis tool.

**Usage**:
```bash
./scripts/vlayer-docker-analysis.sh [COMMAND]
```

**Commands**:
- `status` - Show container status and health
- `logs` - Show logs for all vlayer containers
- `ports` - Analyze port mappings and conflicts
- `health` - Check health status of containers
- `restart` - Restart all vlayer containers
- `stop` - Stop all vlayer containers
- `start` - Start all vlayer containers
- `clean` - Clean up stopped containers
- `monitor` - Real-time container monitoring

### 2. vlayer-dev-env.sh
**Location**: `scripts/vlayer-dev-env.sh`

Complete development environment management tool.

**Usage**:
```bash
./scripts/vlayer-dev-env.sh [COMMAND]
```

**Environment Management**:
- `setup` - Initial setup and environment check
- `start` - Start complete vlayer development environment
- `stop` - Stop all vlayer services
- `restart` - Restart all vlayer services
- `status` - Check status of all services
- `health` - Run comprehensive health checks

**Development Tools**:
- `test-env` - Test vlayer environment connectivity
- `deploy` - Deploy contracts to local vlayer environment
- `prove` - Run vlayer proof generation test
- `verify` - Verify proofs on local chain

**Utilities**:
- `logs` - Show logs from all services
- `clean` - Clean up development environment
- `reset` - Full reset (stop, clean, rebuild, start)
- `monitor` - Real-time monitoring dashboard

### 3. vlayer-quick-diag.sh
**Location**: `scripts/vlayer-quick-diag.sh`

Quick diagnostics tool for troubleshooting.

**Usage**:
```bash
./scripts/vlayer-quick-diag.sh
```

**Features**:
- Container status check
- Port availability verification
- Chain ID validation
- Error log analysis
- Quick fix suggestions

## 📋 Makefile Targets

### vlayer Service Management
```bash
make start-vlayer     # Start vlayer services
make stop-vlayer      # Stop vlayer services
make restart-vlayer   # Restart vlayer services
make status-vlayer    # Show vlayer status
make logs-vlayer      # Show vlayer logs
make clean-vlayer     # Clean vlayer environment
```

### Development Environment Tools
```bash
make dev-setup        # Setup development environment
make dev-test         # Test environment connectivity
make dev-deploy       # Deploy contracts to local environment
make dev-health       # Run comprehensive health check
make dev-monitor      # Start real-time monitoring
make dev-reset        # Full environment reset
```

### Quick Utilities
```bash
make diag            # Run quick diagnostics
make test-prove      # Test proof generation
```

## 🚀 Quick Start Guide

### 1. Initial Setup
```bash
# Setup the complete development environment
make dev-setup
```

### 2. Start Services
```bash
# Start all vlayer services
make start-vlayer

# Or use the comprehensive start
./scripts/vlayer-dev-env.sh start
```

### 3. Verify Environment
```bash
# Quick diagnostics
make diag

# Comprehensive health check
make dev-health

# Test connectivity
make dev-test
```

### 4. Deploy Contracts
```bash
# Deploy to local environment
make dev-deploy
```

### 5. Monitor Services
```bash
# Real-time monitoring
make dev-monitor

# Check status
make status-vlayer
```

## 🔧 Troubleshooting

### Common Issues

#### Port Conflicts
If you encounter port conflicts (especially 8545):
```bash
# Check what's using the port
netstat -tlnp | grep 8545

# Kill conflicting processes
pkill -f "anvil.*8545"

# Restart vlayer
make restart-vlayer
```

#### Container Not Starting
```bash
# Check container logs
make logs-vlayer

# Run diagnostics
make diag

# Full reset if needed
make dev-reset
```

#### Service Not Responding
```bash
# Quick health check
make dev-health

# Restart specific service
docker restart vlayer-call-server
```

### Debug Commands

```bash
# Check all container status
docker ps -a

# Check specific service logs
docker logs vlayer-call-server --tail=20

# Check port usage
netstat -tlnp | grep -E "(8545|8546|3000|3002|3003|7047)"

# Test chain connectivity
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}' \
  http://localhost:8545
```

## 📊 Service Endpoints

### Anvil Blockchains
- **L1 (Ethereum)**: http://localhost:8545 (Chain ID: 31337)
- **L2 (Optimism)**: http://localhost:8546 (Chain ID: 31338)

### vlayer Services
- **Call Server**: http://localhost:3000
- **VDNS Server**: http://localhost:3002
- **WebSocket Proxy**: http://localhost:3003
- **Notary Server**: tcp://localhost:7047

## 🎮 Development Workflow

### 1. Daily Development
```bash
# Start your development session
make start-vlayer
make dev-health

# Deploy contracts
make dev-deploy

# Run tests
forge test

# Monitor while developing
make dev-monitor
```

### 2. Testing Proofs
```bash
# Test proof generation
make test-prove

# Deploy and verify
make dev-deploy
```

### 3. Debugging
```bash
# Quick diagnostics
make diag

# Detailed logs
make logs-vlayer

# Full health check
make dev-health
```

### 4. Clean Shutdown
```bash
# Stop services
make stop-vlayer

# Or clean everything
make clean-vlayer
```

## 📈 Monitoring and Health Checks

### Real-time Monitoring
The monitoring dashboard provides:
- Container status and health
- Port usage analysis
- Resource utilization
- Real-time log streaming

### Health Check Coverage
- Container status verification
- Network connectivity tests
- Service endpoint validation
- Chain ID verification
- Error log analysis

## 🔐 Security Notes

- Services run on localhost only
- No external exposure by default
- Anvil uses test private keys
- Notary server runs without production keys
- Call server runs in "fake" mode for testing

## 📚 Integration with zkMed

The vlayer tools integrate seamlessly with the zkMed project:
- Email domain verification proofs
- Medical record validation
- Privacy-preserving attestations
- Decentralized identity verification

Use these tools to develop and test your zkMed functionality in a complete local environment that mirrors the production vlayer setup.

---

**Created**: May 31, 2025  
**Version**: 1.0  
**Project**: zkMed Backend vlayer Integration

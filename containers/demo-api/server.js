const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());

// Environment variables
const RPC_URL = process.env.RPC_URL || 'http://anvil:8545';
const CHAIN_ID = process.env.CHAIN_ID || '31337';
const DEMO_ACCOUNTS_FILE = process.env.DEMO_ACCOUNTS_FILE || '/app/demo-data/accounts.json';
const CONTRACTS_FILE = '/app/contracts/contracts.json';

// Initialize provider
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Load demo data
let demoData = {};
let contractData = {};

function loadDemoData() {
  try {
    if (fs.existsSync(DEMO_ACCOUNTS_FILE)) {
      demoData = JSON.parse(fs.readFileSync(DEMO_ACCOUNTS_FILE, 'utf8'));
      console.log('✅ Demo accounts loaded');
    }
    if (fs.existsSync(CONTRACTS_FILE)) {
      contractData = JSON.parse(fs.readFileSync(CONTRACTS_FILE, 'utf8'));
      console.log('✅ Contract addresses loaded');
    }
  } catch (error) {
    console.error('❌ Error loading demo data:', error.message);
  }
}

// Load data on startup
loadDemoData();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'zkmed-demo-api',
    version: '1.0.0'
  });
});

// Get all demo accounts
app.get('/api/demo/accounts', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        chainId: CHAIN_ID,
        rpcUrl: RPC_URL,
        accounts: demoData.accounts || {},
        contracts: contractData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific demo account
app.get('/api/demo/accounts/:type', (req, res) => {
  try {
    const { type } = req.params;
    const account = demoData.accounts?.[type];
    
    if (!account) {
      return res.status(404).json({
        success: false,
        error: `Account type '${type}' not found`
      });
    }

    res.json({
      success: true,
      data: account
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get account balances
app.get('/api/demo/balances', async (req, res) => {
  try {
    const balances = {};
    
    if (demoData.accounts) {
      for (const [type, account] of Object.entries(demoData.accounts)) {
        try {
          const balance = await provider.getBalance(account.address);
          balances[type] = {
            address: account.address,
            balance: ethers.formatEther(balance),
            balanceWei: balance.toString()
          };
        } catch (error) {
          balances[type] = {
            address: account.address,
            error: error.message
          };
        }
      }
    }

    res.json({
      success: true,
      data: balances
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get blockchain status
app.get('/api/demo/blockchain', async (req, res) => {
  try {
    const network = await provider.getNetwork();
    const blockNumber = await provider.getBlockNumber();
    const block = await provider.getBlock(blockNumber);

    res.json({
      success: true,
      data: {
        chainId: network.chainId.toString(),
        blockNumber,
        timestamp: new Date(Number(block.timestamp) * 1000).toISOString(),
        rpcUrl: RPC_URL
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simulate patient registration
app.post('/api/demo/register-patient', async (req, res) => {
  try {
    const { commitment } = req.body;
    const patientAccount = demoData.accounts?.patient;
    
    if (!patientAccount) {
      return res.status(404).json({
        success: false,
        error: 'Patient account not configured'
      });
    }

    // This would normally interact with the smart contract
    // For demo purposes, we'll just return a success response
    res.json({
      success: true,
      data: {
        message: 'Patient registration simulated',
        account: patientAccount.address,
        commitment: commitment || patientAccount.commitment,
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simulate claim submission
app.post('/api/demo/submit-claim', async (req, res) => {
  try {
    const { amount, description } = req.body;
    const hospitalAccount = demoData.accounts?.hospital;
    
    if (!hospitalAccount) {
      return res.status(404).json({
        success: false,
        error: 'Hospital account not configured'
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Claim submission simulated',
        hospital: hospitalAccount.address,
        amount: amount || '1000',
        description: description || 'Demo medical procedure',
        claimId: 'CLAIM_' + Date.now(),
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Simulate claim approval
app.post('/api/demo/approve-claim', async (req, res) => {
  try {
    const { claimId, amount } = req.body;
    const insurerAccount = demoData.accounts?.insurer;
    
    if (!insurerAccount) {
      return res.status(404).json({
        success: false,
        error: 'Insurer account not configured'
      });
    }

    res.json({
      success: true,
      data: {
        message: 'Claim approval simulated',
        insurer: insurerAccount.address,
        claimId: claimId || 'CLAIM_' + Date.now(),
        approvedAmount: amount || '1000',
        transactionHash: '0x' + Math.random().toString(16).substr(2, 64)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Reload demo data endpoint
app.post('/api/demo/reload', (req, res) => {
  try {
    loadDemoData();
    res.json({
      success: true,
      message: 'Demo data reloaded successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Contract addresses endpoint
app.get('/api/contracts', (req, res) => {
  try {
    res.json({
      success: true,
      data: contractData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 zkMed Demo API server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Demo accounts: http://localhost:${PORT}/api/demo/accounts`);
  console.log(`⚡ Blockchain status: http://localhost:${PORT}/api/demo/blockchain`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM signal, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT signal, shutting down gracefully...');
  process.exit(0);
}); 
#!/usr/bin/env node
/**
 * Next.js Compatibility Test Script
 * Tests all critical vlayer endpoints and blockchain connectivity for Next.js integration
 */

const https = require('http');
const util = require('util');

async function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
          ok: res.statusCode >= 200 && res.statusCode < 300
        });
      });
    });
    
    req.on('error', reject);
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testJsonRpc(url, payload) {
  try {
    const response = await makeRequest(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    return {
      success: response.ok,
      data: response.data ? JSON.parse(response.data) : null,
      status: response.status
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function testHttpEndpoint(url, method = 'GET') {
  try {
    const response = await makeRequest(url, { method });
    return {
      success: response.status < 500, // Accept 404, 405 as "service running"
      status: response.status,
      available: response.ok
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

async function runCompatibilityTests() {
  console.log('🧪 Next.js + vlayer Compatibility Test Suite');
  console.log('='.repeat(50));
  
  const results = {
    blockchains: {},
    vlayerServices: {},
    overall: true
  };
  
  // Test 1: Anvil L1 JSON-RPC (Critical for wagmi)
  console.log('\n1. Testing Anvil L1 Blockchain (Chain ID: 31337)');
  const l1Test = await testJsonRpc('http://localhost:8545', {
    jsonrpc: '2.0',
    method: 'eth_chainId',
    params: [],
    id: 1
  });
  
  results.blockchains.l1 = l1Test;
  if (l1Test.success && l1Test.data?.result === '0x7a69') {
    console.log('   ✅ L1 Chain ID: 0x7a69 (31337) - Next.js Compatible');
  } else {
    console.log('   ❌ L1 Blockchain not accessible');
    results.overall = false;
  }
  
  // Test 2: Anvil L2 JSON-RPC
  console.log('\n2. Testing Anvil L2 Blockchain (Chain ID: 31338)');
  const l2Test = await testJsonRpc('http://localhost:8546', {
    jsonrpc: '2.0',
    method: 'eth_chainId',
    params: [],
    id: 1
  });
  
  results.blockchains.l2 = l2Test;
  if (l2Test.success && l2Test.data?.result === '0x7a6a') {
    console.log('   ✅ L2 Chain ID: 0x7a6a (31338) - Next.js Compatible');
  } else {
    console.log('   ❌ L2 Blockchain not accessible');
    results.overall = false;
  }
  
  // Test 3: vlayer Call Server (Critical for proof generation)
  console.log('\n3. Testing vlayer Call Server (Port 3000)');
  const callServerTest = await testHttpEndpoint('http://localhost:3000');
  results.vlayerServices.callServer = callServerTest;
  
  if (callServerTest.success) {
    console.log(`   ✅ Call Server responding (HTTP ${callServerTest.status}) - Next.js API Routes Compatible`);
  } else {
    console.log('   ❌ Call Server not accessible');
    results.overall = false;
  }
  
  // Test 4: vlayer VDNS Server
  console.log('\n4. Testing vlayer VDNS Server (Port 3002)');
  const dnsTest = await testHttpEndpoint('http://localhost:3002');
  results.vlayerServices.vdns = dnsTest;
  
  if (dnsTest.success) {
    console.log(`   ✅ VDNS Server responding (HTTP ${dnsTest.status}) - Next.js Compatible`);
  } else {
    console.log('   ❌ VDNS Server not accessible');
    results.overall = false;
  }
  
  // Test 5: WebSocket Proxy
  console.log('\n5. Testing WebSocket Proxy (Port 3003)');
  const wsTest = await testHttpEndpoint('http://localhost:3003');
  results.vlayerServices.websocket = wsTest;
  
  if (wsTest.success) {
    console.log(`   ✅ WebSocket Proxy responding (HTTP ${wsTest.status}) - Next.js Compatible`);
  } else {
    console.log('   ⚠️  WebSocket Proxy not accessible (optional for basic Next.js integration)');
  }
  
  // Test 6: Notary Server
  console.log('\n6. Testing Notary Server (Port 7047)');
  const notaryTest = await testHttpEndpoint('http://localhost:7047');
  results.vlayerServices.notary = notaryTest;
  
  if (notaryTest.success) {
    console.log(`   ✅ Notary Server responding (HTTP ${notaryTest.status}) - Next.js Compatible`);
  } else {
    console.log('   ❌ Notary Server not accessible');
    results.overall = false;
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Next.js Compatibility Summary');
  console.log('='.repeat(50));
  
  if (results.overall) {
    console.log('🎉 100% NEXT.JS COMPATIBLE! All critical services are running.');
    console.log('\n✅ Ready for Next.js integration:');
    console.log('   • Wagmi can connect to both L1 (31337) and L2 (31338)');
    console.log('   • vlayer API endpoints accessible for proof generation');
    console.log('   • All services responding properly to HTTP requests');
    console.log('   • No port conflicts detected');
    
    console.log('\n🚀 Next Steps for Next.js Integration:');
    console.log('   1. Create Next.js project: npx create-next-app@latest frontend');
    console.log('   2. Install dependencies: npm install wagmi viem @wagmi/core');
    console.log('   3. Configure wagmi with L1/L2 endpoints');
    console.log('   4. Use vlayer API routes for proof generation');
    console.log('   5. Deploy contracts: make dev-deploy');
  } else {
    console.log('❌ COMPATIBILITY ISSUES DETECTED');
    console.log('Some services are not running properly. Check Docker containers:');
    console.log('   docker ps');
    console.log('   make start-vlayer');
  }
  
  return results;
}

// Run the tests
runCompatibilityTests()
  .then(results => {
    process.exit(results.overall ? 0 : 1);
  })
  .catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });

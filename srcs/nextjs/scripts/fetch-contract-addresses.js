#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function fetchContractAddresses() {
  try {
    console.log('🔍 Fetching contract addresses...');
    
    // Try to read from the mounted contracts directory first
    const contractsPath = path.join(process.cwd(), 'contracts', 'addresses.json');
    let contractData = null;
    
    try {
      const data = fs.readFileSync(contractsPath, 'utf-8');
      contractData = JSON.parse(data);
      console.log('✅ Found contract addresses in mounted volume');
    } catch (error) {
      console.log('⚠️  Contract addresses not found in mounted volume');
    }
    
    if (!contractData || !contractData.contracts) {
      console.log('⚠️  No contract addresses found, using fallback values');
      // Set fallback environment variables so the app doesn't break
      process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS = '0x0000000000000000000000000000000000000000';
      process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS = '0x0000000000000000000000000000000000000000';
      console.log('✅ Fallback contract addresses set');
      return;
    }
    
    // Update .env.local file
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    // Read existing .env.local if it exists
    try {
      envContent = fs.readFileSync(envPath, 'utf-8');
    } catch (error) {
      // File doesn't exist, start with empty content
      console.log('📄 Creating new .env.local file');
    }
    
    // Remove existing contract address entries
    envContent = envContent
      .split('\n')
      .filter(line => !line.startsWith('NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=') && 
                     !line.startsWith('NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS='))
      .join('\n');
    
    // Add new contract addresses
    const healthcareAddress = contractData.contracts.HealthcareRegistration?.address;
    const proverAddress = contractData.contracts.HealthcareRegistrationProver?.address;
    
    if (healthcareAddress && proverAddress) {
      envContent += `\n# Contract addresses (auto-generated)\n`;
      envContent += `NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=${healthcareAddress}\n`;
      envContent += `NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS=${proverAddress}\n`;
      
      // Write updated .env.local with error handling
      try {
        fs.writeFileSync(envPath, envContent.trim() + '\n');
        console.log('✅ Contract addresses updated in .env.local:');
        console.log(`   NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=${healthcareAddress}`);
        console.log(`   NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS=${proverAddress}`);
      } catch (writeError) {
        console.log('⚠️  Could not write to .env.local (permission denied), setting env vars directly');
        // Set environment variables directly for this process
        process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS = healthcareAddress;
        process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS = proverAddress;
        console.log('✅ Contract addresses set as environment variables:');
        console.log(`   NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=${healthcareAddress}`);
        console.log(`   NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS=${proverAddress}`);
      }
    } else {
      console.log('❌ Invalid contract data structure');
      console.log('Expected addresses:', { healthcareAddress, proverAddress });
    }
    
  } catch (error) {
    console.error('❌ Error fetching contract addresses:', error);
    process.exit(1);
  }
}

fetchContractAddresses();

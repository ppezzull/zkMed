#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function fetchContractAddresses() {
  try {
    
    // Try to read from the mounted contracts directory first
    const contractsPath = path.join(process.cwd(), 'contracts', 'addresses.json');
    let contractData = null;
    
    try {
      const data = fs.readFileSync(contractsPath, 'utf-8');
      contractData = JSON.parse(data);
    } catch (error) {
      console.error(`Error reading contracts file at ${contractsPath}:`, error);
    }
    
    if (!contractData || !contractData.contracts) {
      // Set fallback environment variables so the app doesn't break
      process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS = '0x0000000000000000000000000000000000000000';
      process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS = '0x0000000000000000000000000000000000000000';
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
      console.warn(`.env.local file not found at ${envPath}, creating a new one.`);
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
      } catch (writeError) {
        // Set environment variables directly for this process
        process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS = healthcareAddress;
        process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS = proverAddress;
      }
    } else {
    }
    
  } catch (error) {
    process.exit(1);
  }
}

fetchContractAddresses();

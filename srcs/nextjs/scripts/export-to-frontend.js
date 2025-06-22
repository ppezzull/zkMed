#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

async function exportContractsToFrontend() {
  try {
    console.log('🔄 Exporting zkMed contracts to local frontend environment...');
    
    // Path to local frontend environment (from zkMed/ to srcs/nextjs/)
    const frontendEnvPath = path.join(process.cwd(), 'srcs', 'nextjs', '.env.local');
    
    let contractData = null;
    
    // Try to read zkMed contract addresses from Docker volume
    try {
      console.log('🔍 Checking for contract data in Docker volume...');
      
      // Use docker command to read the addresses.json from the volume
      const { execSync } = require('child_process');
      const dockerCommand = 'docker run --rm -v zkmed_contract-artifacts:/volume alpine cat /volume/addresses.json';
      
      try {
        const output = execSync(dockerCommand, { encoding: 'utf-8' });
        contractData = JSON.parse(output);
        console.log('✅ Found zkMed contract data in Docker volume');
      } catch (dockerError) {
        console.log('⚠️  Could not read from Docker volume, checking local paths...');
        
        // Fallback: Try local paths (relative to zkMed/)
        const localPaths = [
          path.join(process.cwd(), 'srcs', 'foundry', 'out', 'addresses.json'),
          path.join(process.cwd(), 'contracts', 'addresses.json'),
          path.join(process.cwd(), 'out', 'addresses.json')
        ];
        
        for (const localPath of localPaths) {
          if (fs.existsSync(localPath)) {
            const data = fs.readFileSync(localPath, 'utf-8');
            contractData = JSON.parse(data);
            console.log(`✅ Found zkMed contract data at: ${localPath}`);
            break;
          }
        }
      }
    } catch (error) {
      console.error('❌ Error reading zkMed contracts:', error);
    }
    
    // Read existing frontend .env.local
    let envContent = '';
    try {
      if (fs.existsSync(frontendEnvPath)) {
        envContent = fs.readFileSync(frontendEnvPath, 'utf-8');
        console.log('✅ Found existing local frontend .env.local');
      } else {
        console.log('📝 Creating new local frontend .env.local');
      }
    } catch (error) {
      console.log('📝 Creating new local frontend .env.local');
    }
    
    // Remove existing zkMed contract entries and comments
    envContent = envContent
      .split('\n')
      .filter(line => !line.startsWith('NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=') && 
                     !line.startsWith('NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS=') &&
                     !line.includes('ZKMED_') && 
                     !line.includes('NEXT_PUBLIC_GREETING_CONTRACT_ADDRESS') &&
                     !line.includes('# Contract addresses (auto-generated)') &&
                     !line.includes('# Contract addresses (fallback'))
      .join('\n')
      .trim(); // Remove extra whitespace and newlines
    
    // Add zkMed contract addresses if available (matching fetch-contract-addresses.js)
    if (contractData && contractData.contracts) {
      if (envContent) {
        envContent += '\n';
      }
      envContent += '# Contract addresses (auto-generated)\n';
      
      // Add healthcare contracts (same as fetch-contract-addresses.js)
      const healthcareAddress = contractData.contracts.HealthcareRegistration?.address;
      const proverAddress = contractData.contracts.HealthcareRegistrationProver?.address;
      
      if (healthcareAddress) {
        envContent += `NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=${healthcareAddress}\n`;
        console.log(`✅ Added HealthcareRegistration: ${healthcareAddress}`);
      }
      
      if (proverAddress) {
        envContent += `NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS=${proverAddress}`;
        console.log(`✅ Added HealthcareRegistrationProver: ${proverAddress}`);
      }      
    } else {
      console.log('⚠️  No zkMed contract data available - using fallback addresses');
      if (envContent) {
        envContent += '\n';
      }
      envContent += '# Contract addresses (fallback - no contracts deployed)\n';
      envContent += 'NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS=0x0000000000000000000000000000000000000000\n';
      envContent += 'NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS=0x0000000000000000000000000000000000000000';
    }
    
    // Write updated .env.local
    try {
      // Ensure frontend directory exists
      const frontendDir = path.dirname(frontendEnvPath);
      if (!fs.existsSync(frontendDir)) {
        fs.mkdirSync(frontendDir, { recursive: true });
        console.log(`📁 Created local frontend directory: ${frontendDir}`);
      }
      
      fs.writeFileSync(frontendEnvPath, envContent + '\n');
      console.log(`📝 Updated local frontend environment: ${frontendEnvPath}`);
    } catch (writeError) {
      console.error('❌ Error writing local frontend .env.local:', writeError);
      process.exit(1);
    }
    
  } catch (error) {
    console.error('❌ Failed to export contracts to local frontend:', error);
    process.exit(1);
  }
}

// Run the export
exportContractsToFrontend(); 
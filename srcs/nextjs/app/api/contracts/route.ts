import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET() {
  try {
    // Try to read contract addresses from mounted volume
    const contractsPath = path.join(process.cwd(), 'contracts', 'addresses.json')
    
    let contractData = null
    try {
      const data = await fs.readFile(contractsPath, 'utf-8')
      contractData = JSON.parse(data)
    } catch (error) {
      console.log('Contract addresses file not found, using defaults')
    }

    // Fallback configuration
    const response = {
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31337'),
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://host.docker.internal:8547',
      contracts: contractData?.contracts || {
        HealthcareRegistration: {
          address: process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS || '0x0000000000000000000000000000000000000000',
          deployer: 'default'
        },
        HealthcareRegistrationProver: {
          address: process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS || '0x0000000000000000000000000000000000000000',
          deployer: 'default'
        }
      },
      timestamp: contractData?.timestamp || new Date().toISOString(),
      status: contractData ? 'deployed' : 'fallback'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error reading contract data:', error)
    return NextResponse.json(
      { error: 'Failed to read contract data' },
      { status: 500 }
    )
  }
} 
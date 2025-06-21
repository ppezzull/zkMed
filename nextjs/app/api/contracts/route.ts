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
      chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '31339'),
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL || 'http://host.docker.internal:8547',
      contracts: contractData?.contracts || {
        Greeting: {
          address: process.env.NEXT_PUBLIC_GREETING_CONTRACT_ADDRESS || '0x922D6956C99E12DFeB3224DEA977D0939758A1Fe',
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
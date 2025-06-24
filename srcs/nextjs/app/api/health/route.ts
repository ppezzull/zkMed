import { NextResponse } from 'next/server'
import { getContractAddresses, isContractsConfigured } from '@/lib/addresses'

export async function GET() {
  const contractAddresses = getContractAddresses();

  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'zkmed-frontend',
    version: process.env.npm_package_version || '1.0.0',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      demoMode: process.env.NEXT_PUBLIC_DEMO_MODE,
      chainId: process.env.NEXT_PUBLIC_CHAIN_ID,
      rpcUrl: process.env.NEXT_PUBLIC_RPC_URL ? 'configured' : 'not configured'
    },
    contracts: {
      healthcareRegistrationAddress: contractAddresses.healthcareRegistration !== '0x0000000000000000000000000000000000000000' ? contractAddresses.healthcareRegistration : 'not configured',
      healthcareProverAddress: contractAddresses.healthcareRegistrationProver !== '0x0000000000000000000000000000000000000000' ? contractAddresses.healthcareRegistrationProver : 'not configured',
      configured: isContractsConfigured()
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }

  return NextResponse.json(healthCheck)
}

export async function HEAD() {
  return new Response(null, { status: 200 })
} 
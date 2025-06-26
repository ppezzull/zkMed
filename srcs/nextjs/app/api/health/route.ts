import { NextResponse } from 'next/server'

export async function GET() {
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
      healthcareRegistrationAddress: process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS || 'not configured',
      healthcareProverAddress: process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS || 'not configured',
      configured: process.env.NEXT_PUBLIC_HEALTHCARE_REGISTRATION_ADDRESS && process.env.NEXT_PUBLIC_HEALTHCARE_PROVER_ADDRESS ? true : false
    },
    uptime: process.uptime(),
    memory: process.memoryUsage(),
  }

  return NextResponse.json(healthCheck)
}

export async function HEAD() {
  return new Response(null, { status: 200 })
} 
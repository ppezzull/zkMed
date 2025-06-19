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

    return NextResponse.json(contractData || "{}")
  } catch (error) {
    console.error('Error reading contract data:', error)
    return NextResponse.json(
      { error: 'Failed to read contract data' },
      { status: 500 }
    )
  }
}
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import WalletConnect from '@/components/wallet-connect';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/hooks/useWallet';

export default function Header() {
  const account = useActiveAccount();
  const router = useRouter();
  const [currentAPY, setCurrentAPY] = useState(4.2);
  const [tvl, setTvl] = useState(12.7);
  const [claims, setClaims] = useState(15847);
  const { disconnect } = useWallet();

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setCurrentAPY(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setTvl(prev => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
      setClaims(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg font-bold">⚕️</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  <span className="text-indigo-600">zk</span>Med
                </div>
                <div className="text-xs text-slate-500 -mt-1">Global Healthcare Platform</div>
              </div>
            </Link>
          </div>

          {/* Center: Navigation + Live Stats */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex items-center space-x-6 mr-6">
              <Link href="/" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Platform
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger className="text-slate-700 hover:text-indigo-600 font-medium transition-colors flex items-center space-x-1">
                  <span>Solutions</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>👥 For Patients</DropdownMenuItem>
                  <DropdownMenuItem>🏥 For Hospitals</DropdownMenuItem>
                  <DropdownMenuItem>🏢 For Insurers</DropdownMenuItem>
                  <DropdownMenuItem>⚙️ For Administrators</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Link href="/privacy" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Privacy
              </Link>
              <Link href="/docs" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Docs
              </Link>
            </nav>

            {/* Live Stats Pill */}
            <div className="bg-slate-100 rounded-full px-4 py-2 flex items-center space-x-4 text-sm">
              <span className="text-slate-600">
                TVL: <span className="font-semibold text-slate-900">${tvl}M</span>
              </span>
              <span className="h-4 w-px bg-slate-300"></span>
              <span className="text-slate-600">
                APY: <span className="font-semibold text-emerald-600">{currentAPY}%</span>
              </span>
              <span className="h-4 w-px bg-slate-300"></span>
              <span className="text-slate-600">
                Claims: <span className="font-semibold text-indigo-600">{claims.toLocaleString()}</span>
              </span>
              <span className="h-4 w-px bg-slate-300"></span>
              <span className="text-slate-600">
                <span className="font-semibold text-orange-600">Testnet</span>
              </span>
            </div>
          </div>

          {/* Right: Wallet Connect + Profile */}
          <div className="flex items-center space-x-3">
            {!account ? (
              <WalletConnect variant="header" />
            ) : (
              <div className="flex items-center space-x-2">
                <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1">
                  🧪 Testnet Active
                </Badge>
                
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white text-lg">👤</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium leading-none">Connected Wallet</p>
                      <p className="text-xs leading-none text-slate-600">
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard')}>
                      📊 Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/claims')}>
                      🏥 My Claims
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/pool')}>
                      💰 Pool Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dev')}>
                      🛠️ Developer Tools
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={disconnect} className="text-red-600">
                      🚪 Disconnect
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4">
          <nav className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors text-sm">
              Platform
            </Link>
            <Link href="/solutions" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors text-sm">
              Solutions
            </Link>
            <Link href="/privacy" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors text-sm">
              Privacy
            </Link>
            <Link href="/docs" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors text-sm">
              Docs
            </Link>
          </nav>
          
          {/* Mobile Stats */}
          <div className="mt-3 flex justify-center">
            <div className="bg-slate-100 rounded-full px-3 py-1 flex items-center space-x-3 text-xs">
              <span className="text-slate-600">
                TVL: <span className="font-semibold">${tvl}M</span>
              </span>
              <span className="text-slate-600">
                APY: <span className="font-semibold text-emerald-600">{currentAPY}%</span>
              </span>
              <span className="text-slate-600">
                Claims: <span className="font-semibold text-indigo-600">{claims.toLocaleString()}</span>
              </span>
              <span className="text-slate-600">
                <span className="font-semibold text-orange-600">Testnet</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 
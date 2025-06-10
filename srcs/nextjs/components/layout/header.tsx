'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import WalletConnect from '@/components/wallet-connect';
import { useRouter } from 'next/navigation';

export default function Header() {
  const account = useActiveAccount();
  const router = useRouter();
  const [currentAPY, setCurrentAPY] = useState(4.2);
  const [tvl, setTvl] = useState(2.3);
  const [claims, setClaims] = useState(1247);

  useEffect(() => {
    // Simulate live data updates
    const interval = setInterval(() => {
      setCurrentAPY(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setTvl(prev => +(prev + (Math.random() * 0.05 - 0.025)).toFixed(2));
      setClaims(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    // Disconnect wallet logic will be handled by WalletConnect component
    // For now, we'll just refresh the page
    window.location.reload();
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-slate-800 hover:text-slate-600 transition-colors">
              <span className="text-indigo-600">zk</span>Med
            </Link>
          </div>

          {/* Center: Navigation + Live Stats */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex items-center space-x-6 mr-6">
              <Link href="/" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Platform
              </Link>
              <Link href="/procedures" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
                Procedures
              </Link>
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
                Claims: <span className="font-semibold text-indigo-600">{claims}</span>
              </span>
            </div>
          </div>

          {/* Right: Wallet Connect + Profile */}
          <div className="flex items-center space-x-3">
            {!account ? (
              <WalletConnect variant="header" />
            ) : (
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1">
                  🛡️ Privacy Enabled
                </Badge>
                
                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br indigo-500 flex items-center justify-center">
                        <span className="text-white text-lg">
                          👤
                        </span>
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
                    <DropdownMenuItem onClick={() => router.push('/procedures')}>
                      🏥 My Procedures
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dev')}>
                      🛠️ Developer Tools
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
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
            <Link href="/procedures" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors text-sm">
              Procedures
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
                Claims: <span className="font-semibold text-indigo-600">{claims}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 
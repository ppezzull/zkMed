'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import WalletConnect from '@/components/wallet-connect';

export default function Header() {
  const account = useActiveAccount();
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

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-[#0066CC]">
              zkMed
            </Link>
          </div>

          {/* Center: Navigation + Live Stats */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Navigation */}
            <nav className="flex items-center space-x-6 mr-6">
              <Link href="/" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors">
                Platform
              </Link>
              <Link href="/pools" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors">
                Pools
              </Link>
              <Link href="/privacy" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors">
                Privacy
              </Link>
              <Link href="/docs" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors">
                Docs
              </Link>
              <Link href="/dev" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors">
                Dev
              </Link>
            </nav>

            {/* Live Stats Pill */}
            <div className="bg-gray-50 rounded-full px-4 py-2 flex items-center space-x-4 text-sm">
              <span className="text-gray-600">
                TVL: <span className="font-semibold text-gray-900">${tvl}M</span>
              </span>
              <span className="h-4 w-px bg-gray-300"></span>
              <span className="text-gray-600">
                APY: <span className="font-semibold text-[#10B981]">{currentAPY}%</span>
              </span>
              <span className="h-4 w-px bg-gray-300"></span>
              <span className="text-gray-600">
                Claims: <span className="font-semibold text-[#0066CC]">{claims}</span>
              </span>
            </div>
          </div>

          {/* Right: Wallet Connect */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <WalletConnect variant="header" />
              {account && (
                <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1">
                  Gas-Free
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden pb-4">
          <nav className="flex flex-wrap justify-center gap-4">
            <Link href="/" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors text-sm">
              Platform
            </Link>
            <Link href="/pools" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors text-sm">
              Pools
            </Link>
            <Link href="/privacy" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors text-sm">
              Privacy
            </Link>
            <Link href="/docs" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors text-sm">
              Docs
            </Link>
            <Link href="/dev" className="text-gray-700 hover:text-[#0066CC] font-medium transition-colors text-sm">
              Dev
            </Link>
          </nav>
          
          {/* Mobile Stats */}
          <div className="mt-3 flex justify-center">
            <div className="bg-gray-50 rounded-full px-3 py-1 flex items-center space-x-3 text-xs">
              <span className="text-gray-600">
                TVL: <span className="font-semibold">${tvl}M</span>
              </span>
              <span className="text-gray-600">
                APY: <span className="font-semibold text-[#10B981]">{currentAPY}%</span>
              </span>
              <span className="text-gray-600">
                Claims: <span className="font-semibold text-[#0066CC]">{claims}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 
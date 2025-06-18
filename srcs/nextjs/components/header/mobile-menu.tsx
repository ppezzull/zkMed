'use client';

import Link from 'next/link';

interface MobileMenuProps {
  tvl: number;
  currentAPY: number;
  claims: number;
}

export default function MobileMenu({ tvl, currentAPY, claims }: MobileMenuProps) {
  return (
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
  );
}

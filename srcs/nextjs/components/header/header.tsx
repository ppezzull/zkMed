'use client';

import Logo from './logo';
import Navigation from './navigation';
import LiveStats from './live-stats';
import MobileMenu from './mobile-menu';
import WalletConnect from '../wallet-connect';

export default function Header() {
  const apy = 4.2; // Example APY value
  const tvl = 12.7; // Example TVL value
  const claims = 15847; // Example claims value

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Center: Navigation + Live Stats */}
          <div className="hidden md:flex items-center space-x-4">
            <Navigation />
            <LiveStats 
              initialTvl={tvl}
              initialAPY={apy}
              initialClaims={claims}
            />
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center space-x-3">
            <WalletConnect />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          tvl={tvl}
          currentAPY={apy}
          claims={claims}
        />
      </div>
    </header>
  );
}

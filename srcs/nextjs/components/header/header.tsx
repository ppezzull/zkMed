'use client';

import { useState } from 'react';

import Logo from './logo';
import Navigation from './navigation';
import LiveStats from './live-stats';
import UserProfile from './user-profile';
import MobileMenu from './mobile-menu';

export default function Header() {
  const [currentAPY, setCurrentAPY] = useState(4.2);
  const [tvl, setTvl] = useState(12.7);
  const [claims, setClaims] = useState(15847);

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
              initialAPY={currentAPY}
              initialClaims={claims}
            />
          </div>

          {/* Right: User Profile */}
          <div className="flex items-center space-x-3">
            <UserProfile />
          </div>
        </div>

        {/* Mobile Menu */}
        <MobileMenu 
          tvl={tvl}
          currentAPY={currentAPY}
          claims={claims}
        />
      </div>
    </header>
  );
}

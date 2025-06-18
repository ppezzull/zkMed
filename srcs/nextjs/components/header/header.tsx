'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useHealthcareRegistration } from '@/hooks/useHealthcareRegistration';
import { UserType } from '@/utils/types/healthcare';
import { RegistrationFlow } from '@/components/registration/RegistrationFlow';

import Logo from './logo';
import Navigation from './navigation';
import LiveStats from './live-stats';
import UserProfile from './user-profile';
import MobileMenu from './mobile-menu';
import RegistrationStatus from './registration-status';

export default function Header() {
  const account = useActiveAccount();
  const [currentAPY, setCurrentAPY] = useState(4.2);
  const [tvl, setTvl] = useState(12.7);
  const [claims, setClaims] = useState(15847);
  
  // Healthcare registration functionality
  const registration = useHealthcareRegistration();
  const [showRegistrationFlow, setShowRegistrationFlow] = useState(false);

  // Check user role when wallet connects
  useEffect(() => {
    if (account?.address && !registration.loading) {
      registration.checkUserRole();
    }
  }, [account?.address]);

  // Show registration flow if user is connected but not registered
  useEffect(() => {
    if (account?.address && !registration.isRegistered && !registration.loading && !showRegistrationFlow) {
      setShowRegistrationFlow(true);
    }
  }, [account?.address, registration.isRegistered, registration.loading]);

  const handleRegistrationComplete = (userRole: UserType) => {
    setShowRegistrationFlow(false);
    // You could show a success message or update UI state here
  };

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
    <>
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
              <UserProfile onShowRegistration={() => setShowRegistrationFlow(true)} />
            </div>
          </div>

          {/* Mobile Menu */}
          <MobileMenu 
            tvl={tvl}
            currentAPY={currentAPY}
            claims={claims}
          />
        </div>

        {/* Registration Status Loading */}
        <RegistrationStatus loading={registration.loading} />
      </header>

      {/* Registration Flow */}
      <RegistrationFlow
        isOpen={showRegistrationFlow}
        onClose={() => setShowRegistrationFlow(false)}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </>
  );
}

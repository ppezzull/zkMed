'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
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
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0066CC] to-[#4A90E2] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="bg-white/20 text-white mb-6 px-3 py-1 text-sm backdrop-blur-sm border-white/30">
              ⚡ Gas-Free Transactions
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Healthcare Funds That Work While You Wait
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-lg">
              First platform where premiums earn 3-5% yield in Aave pools until claims, 
              with instant payouts and complete medical privacy.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Button className="bg-white text-[#0066CC] hover:bg-white/90 px-6 py-6 text-lg rounded-lg">
                Start Earning on Premiums
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white/10 px-6 py-6 text-lg rounded-lg"
              >
                🎥 Watch Demo
              </Button>
            </div>
            
            {/* Live Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold">{currentAPY}%</div>
                <div className="text-sm text-white/80">Current APY</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold">${tvl}M</div>
                <div className="text-sm text-white/80">Total Value Locked</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="text-3xl font-bold">{claims}</div>
                <div className="text-sm text-white/80">Claims Processed</div>
              </div>
            </div>
          </div>
          
          {/* Demo Dashboard Card */}
          <div className="relative">
            <div className="absolute -inset-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 transform rotate-3"></div>
            <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 transform -rotate-2 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#0066CC] flex items-center justify-center">
                    🛡️
                  </div>
                  <div className="ml-3 text-white">
                    <div className="font-medium">Patient Dashboard</div>
                    <div className="text-xs text-white/70">Secure & Private</div>
                  </div>
                </div>
                <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">
                  Live Demo
                </Badge>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
                <div className="flex justify-between text-white mb-2">
                  <span>Premium Balance</span>
                  <span className="font-medium">2,500 mUSD</span>
                </div>
                <div className="flex justify-between text-white mb-2">
                  <span>Yield Generated</span>
                  <span className="font-medium text-[#10B981]">+105 mUSD</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Effective Cost</span>
                  <span className="font-medium">
                    2,395 mUSD <span className="text-[#10B981]">(-4.2%)</span>
                  </span>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-4 mb-6 backdrop-blur-sm">
                <div className="flex justify-between text-white mb-2">
                  <span className="font-medium">Recent Activity</span>
                  <span className="text-xs text-white/70">Today</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-white">
                    <div className="w-8 h-8 rounded-full bg-[#0066CC]/30 flex items-center justify-center mr-3">
                      🏥
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm">Hospital Visit</div>
                      <div className="text-xs text-white/70">Memorial Health</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm">-350 mUSD</div>
                      <div className="text-xs text-white/70">Instant</div>
                    </div>
                  </div>
                  <div className="flex items-center text-white">
                    <div className="w-8 h-8 rounded-full bg-[#10B981]/30 flex items-center justify-center mr-3">
                      📈
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm">Yield Earned</div>
                      <div className="text-xs text-white/70">Aave V3 Pool</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#10B981]">+8.75 mUSD</div>
                      <div className="text-xs text-white/70">Today</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-white text-[#0066CC] hover:bg-white/90 rounded-lg">
                Access Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function HeroSection() {
  const [currentAPY, setCurrentAPY] = useState(4.2);
  const [tvl, setTvl] = useState(12.7);
  const [claims, setClaims] = useState(15847);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate on mount
    setIsVisible(true);
    
    // Simulate live data updates
    const interval = setInterval(() => {
      setCurrentAPY(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setTvl(prev => +(prev + (Math.random() * 0.2 - 0.1)).toFixed(1));
      setClaims(prev => prev + (Math.random() > 0.8 ? 1 : 0));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-4 pb-24 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Advanced Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-1000"></div>
      </div>

      {/* Floating Technology Icons */}
      <div className="absolute inset-0">
        <div className="absolute top-32 right-32 animate-float">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
            <Image src="/icons/vlayer-logo.png" alt="vlayer MailProof" width={32} height={32} className="w-8 h-8 rounded" />
          </div>
        </div>
        <div className="absolute top-48 left-24 animate-float animation-delay-1000">
          <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
            <Image src="/icons/merchant-moe.png" alt="Merchant Moe" width={28} height={28} className="w-7 h-7 rounded" />
          </div>
        </div>
        <div className="absolute bottom-32 right-48 animate-float animation-delay-2000">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
            <Image src="/icons/thirdweb.png" alt="thirdweb" width={24} height={24} className="w-6 h-6 rounded" />
          </div>
        </div>
        <div className="absolute top-64 right-64 animate-float animation-delay-3000">
          <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm border border-white/20">
            <Image src="/icons/mantle-network.jpg" alt="Mantle Network" width={20} height={20} className="w-5 h-5 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh] py-6">
          {/* Left Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 mb-6 px-4 py-2 text-sm backdrop-blur-sm border border-indigo-200">
              🌍 Global Healthcare Insurance Platform
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Healthcare Insurance
              </span>
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              The world's first <span className="font-semibold text-indigo-600">Web3 + MailProof + Pools</span> platform.
              Privacy-preserving claims processing with <span className="font-semibold text-emerald-600">instant settlements</span> and 
              <span className="font-semibold text-purple-600"> yield generation</span> for any insurance company.
            </p>

            {/* Global Platform Notice */}
            <div className="bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200 rounded-xl p-4 mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-emerald-600 text-2xl">🌍</span>
                <div>
                  <p className="text-sm font-semibold text-emerald-800">Works with Any Insurance Company</p>
                  <p className="text-xs text-emerald-600">
                    Universal platform • Compatible with existing systems • Global deployment ready
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🚀 Start Your Integration
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('value-proposition')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-8 py-6 text-lg rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                🔍 Explore Features
              </Button>
            </div>
            
            {/* Key Platform Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-sm font-semibold text-slate-700">MailProof Privacy</div>
                <div className="text-xs text-slate-500">Zero medical data exposure</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-semibold text-slate-700">Instant Settlement</div>
                <div className="text-xs text-slate-500">Claims paid in seconds</div>
              </div>
              <div className="text-center p-4 bg-white/70 rounded-lg backdrop-blur-sm">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-sm font-semibold text-emerald-600">{currentAPY}% APY</div>
                <div className="text-xs text-slate-500">Merchant Moe pools</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Advanced Platform Dashboard */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-bold">zkM</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">zkMed Global Platform</div>
                      <div className="text-xs text-slate-500">Web3 + MailProof + Pools • Live Network</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                    🧪 Testnet Active
                  </Badge>
                </div>
                
                {/* Platform Metrics */}
                <div className="space-y-4 mb-6">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <div className="flex justify-between text-slate-700 mb-3">
                      <span className="font-medium">Testnet Network Stats</span>
                      <span className="text-xs text-slate-500">Development</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-indigo-600">${tvl}M</div>
                        <div className="text-xs text-slate-500">Test TVL</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-emerald-600">{currentAPY}%</div>
                        <div className="text-xs text-slate-500">Simulated APY</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-purple-600">{claims.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">Test Claims</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between text-slate-700 mb-2">
                      <span className="font-medium">Privacy Protection</span>
                      <span className="font-semibold text-emerald-600">100%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full w-full"></div>
                    </div>
                    <p className="text-xs text-slate-500">MailProof verification • Zero medical data on-chain</p>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between text-slate-700 mb-2">
                      <span className="font-medium">Settlement Speed</span>
                      <span className="font-semibold text-indigo-600">Instant</span>
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-slate-600">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                        Direct Hospital Payment
                      </span>
                      <span>•</span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-1 animate-pulse"></div>
                        Patient Reimbursement
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl">
                    🏢 Insurance Company Demo
                  </Button>
                  <Button variant="outline" className="w-full border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded-xl">
                    📊 View Live Analytics
                  </Button>
                </div>
              </div>

              {/* Floating Feature Pills */}
              <div className="absolute -top-4 -right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg animate-bounce">
                <span className="text-xs font-medium text-indigo-600">thirdweb Powered</span>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg animate-bounce animation-delay-1000">
                <span className="text-xs font-medium text-orange-600">Anvil Testnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
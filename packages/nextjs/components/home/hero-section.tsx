'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HeroSection() {
  const [currentAPY, setCurrentAPY] = useState(4.2);
  const [tvl, setTvl] = useState(2.3);
  const [claims, setClaims] = useState(1247);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Animate on mount
    setIsVisible(true);
    
    // Simulate live data updates
    const interval = setInterval(() => {
      setCurrentAPY(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
      setTvl(prev => +(prev + (Math.random() * 0.05 - 0.025)).toFixed(2));
      setClaims(prev => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative pt-4 pb-24 overflow-hidden bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Single Floating Medical Icon */}
      <div className="absolute top-32 right-32 animate-float">
        <div className="w-16 h-16 bg-white/80 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
          <span className="text-2xl">🛡️</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh] py-6">
          {/* Left Content */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <Badge className="bg-indigo-100 text-indigo-700 mb-6 px-4 py-2 text-sm backdrop-blur-sm border border-indigo-200">
              🇮🇹 Now Available in Regione Lazio, Italy
            </Badge>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-8 bg-gradient-to-r from-slate-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Private Healthcare
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Procedures
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Submit, verify, and process health procedures in Regione Lazio with 
              <span className="font-semibold text-indigo-600"> complete privacy</span>. 
              No medical data exposed, 
              <span className="font-semibold text-emerald-600"> earn yield while protected</span>.
            </p>

            {/* Regional Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
              <div className="flex items-center space-x-3">
                <span className="text-blue-500 text-lg">🌍</span>
                <div>
                  <p className="text-sm font-medium text-blue-800">Currently serving Regione Lazio, Italy</p>
                  <p className="text-xs text-blue-600">
                    From another region? <button className="underline hover:text-blue-800">Contact our dev team</button> to add WebProof support.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🏥 Submit Procedure (Lazio)
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('insurer-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-8 py-6 text-lg rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                🏢 For Insurers
              </Button>
            </div>
            
            {/* Simplified Key Features */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">🔒</div>
                <div className="text-sm font-semibold text-slate-700">100% Private</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm font-semibold text-slate-700">5 min processing</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">💰</div>
                <div className="text-sm font-semibold text-slate-700">{currentAPY}% APY</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Simplified Dashboard */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <div className="relative">
              {/* Main Dashboard Card */}
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      🛡️
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">Lazio Privacy Dashboard</div>
                      <div className="text-xs text-slate-500">Regione Lazio • Secure & Encrypted</div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
                    🟢 Lazio Active
                  </Badge>
                </div>
                
                {/* Privacy Stats */}
                <div className="space-y-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between text-slate-700 mb-2">
                      <span>Medical Privacy Level</span>
                      <span className="font-semibold text-indigo-600">100%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full w-full"></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Zero-knowledge proof verified in Lazio</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-slate-800">2,500 mUSD</div>
                      <div className="text-xs text-slate-500">Protected Balance</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-emerald-600">+{(2500 * currentAPY / 100 / 12).toFixed(2)}</div>
                      <div className="text-xs text-slate-500">Monthly Yield</div>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl">
                  🔐 Access Lazio Portal
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
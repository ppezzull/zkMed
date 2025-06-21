'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

export default function ValueProposition() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('value-proposition');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: '🔐',
      title: 'MailProof Privacy',
      subtitle: 'Zero Medical Data Exposure',
      description: 'Revolutionary vlayer MailProof technology verifies claims through DKIM-signed emails without exposing any medical information on-chain. Complete privacy preservation.',
      stats: 'Zero Data Exposure',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      delay: 'delay-100'
    },
    {
      icon: '💰',
      title: 'Merchant Moe Pools',
      subtitle: 'Yield Generation',
      description: 'Healthcare funds earn 3-5% APY through Merchant Moe Liquidity Book pools with custom healthcare hooks. Automated 60/20/20 yield distribution to all stakeholders.',
      stats: '3-5% APY',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      delay: 'delay-300'
    },
    {
      icon: '⚡',
      title: 'Instant Settlement',
      subtitle: 'Dual Payment Options',
      description: 'Choose direct hospital payment or patient reimbursement. MailProof verification triggers instant mUSD transfers from pools in seconds, not weeks.',
      stats: 'Instant Payments',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      delay: 'delay-500'
    },
    {
      icon: '🌍',
      title: 'Universal Platform',
      subtitle: 'Any Insurance Company',
      description: 'Works with any health insurance company globally. Hybrid Web2/Web3 architecture maintains regulatory compliance while delivering blockchain benefits.',
      stats: 'Global Compatible',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      delay: 'delay-700'
    },
    {
      icon: '🔗',
      title: 'thirdweb Integration',
      subtitle: 'Seamless Access',
      description: 'Fiat-to-crypto payments and smart account management. Web3 benefits with traditional user experience through comprehensive thirdweb integration.',
      stats: 'Fiat + Crypto',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      delay: 'delay-900'
    },
    {
      icon: '🏢',
      title: 'Multi-Role Support',
      subtitle: 'Complete Ecosystem',
      description: 'Comprehensive platform for patients, hospitals, insurers, and administrators. Specialized dashboards and workflows for each stakeholder role.',
      stats: '4 User Types',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      delay: 'delay-1100'
    }
  ];

  return (
    <section id="value-proposition" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-white"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 mb-6 px-4 py-2 text-sm">
            🚀 Revolutionary Healthcare Innovation
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            Web3 + MailProof + Pools Architecture
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            The world's first platform combining privacy-preserving MailProof verification, yield-generating Merchant Moe Liquidity Book pools, 
            and instant settlement capabilities for global healthcare insurance companies.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'} ${feature.delay}`}
            >
              <Card className="h-full group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-3xl">{feature.icon}</span>
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                      {feature.title}
                    </CardTitle>
                    <p className="text-sm font-medium text-slate-500">{feature.subtitle}</p>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Stats Pill */}
                  <div className={`${feature.bgColor} rounded-full px-4 py-2 inline-flex items-center group-hover:scale-105 transition-transform duration-300`}>
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.color} mr-2 animate-pulse`}></div>
                    <span className="text-sm font-semibold text-slate-700">{feature.stats}</span>
                  </div>
                  
                  {/* Hover Effect */}
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${feature.color} transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom CTA Section */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-indigo-100">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Ready to Transform Healthcare Insurance?
              </h3>
              <p className="text-slate-600 mb-8">
                Join the revolution in healthcare payments with our comprehensive Web3 + MailProof + Pools platform.
                Compatible with any insurance company worldwide.
              </p>
              
              {/* Enhanced Demo Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">15,847</div>
                  <div className="text-sm text-slate-500">Global Claims Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">$12.7M</div>
                  <div className="text-sm text-slate-500">Total Value Locked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-slate-500">Privacy Maintained</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">47</div>
                  <div className="text-sm text-slate-500">Insurance Partners</div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                  🏢 Schedule Integration Demo
                </button>
                <button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                  👥 Patient Portal Demo
                </button>
                <button className="border-2 border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                  📊 View Live Analytics
                </button>
              </div>

              {/* Technology Stack Showcase */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-slate-800 mb-4">Powered by Leading Web3 Technologies</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mx-auto flex items-center justify-center">
                      <Image src="/icons/mantle-network.jpg" alt="Mantle Network" width={32} height={32} className="w-8 h-8 rounded" />
                    </div>
                    <div className="text-sm font-medium text-slate-700">Mantle Network</div>
                    <div className="text-xs text-slate-500">L2 Blockchain (Testnet)</div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg mx-auto flex items-center justify-center">
                      <Image src="/icons/vlayer-logo.png" alt="vlayer" width={32} height={32} className="w-8 h-8 rounded" />
                    </div>
                    <div className="text-sm font-medium text-slate-700">vlayer MailProof</div>
                    <div className="text-xs text-slate-500">Privacy Verification</div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg mx-auto flex items-center justify-center">
                      <Image src="/icons/merchant-moe.png" alt="Merchant Moe" width={32} height={32} className="w-8 h-8 rounded" />
                    </div>
                    <div className="text-sm font-medium text-slate-700">Merchant Moe LB</div>
                    <div className="text-xs text-slate-500">Yield Generation</div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg mx-auto flex items-center justify-center">
                      <Image src="/icons/thirdweb.png" alt="thirdweb" width={32} height={32} className="w-8 h-8 rounded" />
                    </div>
                    <div className="text-sm font-medium text-slate-700">thirdweb SDK</div>
                    <div className="text-xs text-slate-500">Web3 Integration</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
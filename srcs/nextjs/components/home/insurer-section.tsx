'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function InsurerSection() {
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

    const element = document.getElementById('insurer-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="insurer-section" className="py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 mb-6 px-4 py-2 text-sm">
            🏢 For Global Insurance Companies
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Transform Your Insurance Operations
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Join leading insurance companies leveraging our Web3 + MailProof + Pools platform for instant settlements, 
            yield generation, and complete privacy protection. Compatible with any existing system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Benefits for Insurers */}
          <div className={`space-y-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="space-y-6">
              {[
                {
                  icon: '⚡',
                  title: 'Instant MailProof Claims',
                  description: 'Automated claims verification through DKIM-signed emails. No medical data exposure, complete privacy preservation with instant settlement.',
                  metric: 'Instant Processing',
                  color: 'from-indigo-500 to-purple-600'
                },
                {
                  icon: '💰',
                  title: 'Merchant Moe Pool Yields',
                  description: 'Healthcare premiums earn 3-5% APY through Liquidity Book pools with custom hooks. 60/20/20 distribution benefits all stakeholders.',
                  metric: '3-5% APY Revenue',
                  color: 'from-emerald-500 to-teal-600'
                },
                {
                  icon: '🌍',
                  title: 'Universal Compatibility',
                  description: 'Works with any insurance company globally. Hybrid Web2/Web3 architecture maintains regulatory compliance and existing workflows.',
                  metric: 'Global Ready',
                  color: 'from-blue-500 to-cyan-600'
                },
                {
                  icon: '🔐',
                  title: 'Zero Privacy Risk',
                  description: 'MailProof verification eliminates medical data exposure. Complete HIPAA/GDPR compliance with cryptographic proof validation.',
                  metric: '100% Compliant',
                  color: 'from-violet-500 to-purple-600'
                },
                {
                  icon: '🏥',
                  title: 'Dual Payment Options',
                  description: 'Choose direct hospital payment or patient reimbursement. Flexible settlement options to match any business model or regulatory requirement.',
                  metric: 'Flexible Settlement',
                  color: 'from-orange-500 to-red-600'
                },
                {
                  icon: '📊',
                  title: 'Real-Time Analytics',
                  description: 'Comprehensive dashboard with live pool metrics, yield tracking, and claims analytics. Complete transparency and performance insights.',
                  metric: 'Live Monitoring',
                  color: 'from-pink-500 to-rose-600'
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className={`w-12 h-12 bg-gradient-to-br ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-xl text-white">{benefit.icon}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-slate-800">{benefit.title}</h3>
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        {benefit.metric}
                      </Badge>
                    </div>
                    <p className="text-slate-600 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Integration Dashboard */}
          <div className={`transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
              <CardHeader className="pb-6">
                <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mr-3">
                    🏢
                  </div>
                  Global Insurance Integration Portal
                </CardTitle>
                <p className="text-slate-600">
                  Seamlessly integrate with your existing infrastructure
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Integration Features */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-slate-700">Web3 + MailProof Integration</span>
                      <Badge className="bg-emerald-100 text-emerald-700">✓ Production Ready</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>• vlayer MailProof API</span>
                        <span className="text-emerald-600">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Merchant Moe Pool SDK</span>
                        <span className="text-emerald-600">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• thirdweb Smart Accounts</span>
                        <span className="text-emerald-600">Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-slate-700">Compliance & Security</span>
                      <Badge className="bg-blue-100 text-blue-700">Enterprise Grade</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>• HIPAA/GDPR compliance</span>
                        <span className="text-blue-600">Certified</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• SOC 2 Type II</span>
                        <span className="text-blue-600">Audited</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Zero medical data exposure</span>
                        <span className="text-purple-600">Guaranteed</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-lg font-semibold text-emerald-800 mb-4">🧪 Testnet Analytics Dashboard</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="text-xl font-bold text-emerald-700">$12.7M</div>
                          <div className="text-xs text-emerald-600">Test Pool TVL</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-teal-700">4.2%</div>
                          <div className="text-xs text-teal-600">Simulated APY</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-indigo-700">15,847</div>
                          <div className="text-xs text-indigo-600">Test Claims</div>
                        </div>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-3">
                        <div className="flex justify-between text-xs text-slate-600 mb-2">
                          <span>Development Progress</span>
                          <span>78%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-200">
                  <div className="space-y-3">
                    <Button 
                      size="lg" 
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      🏢 Schedule Integration Demo
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg"
                      className="w-full border-2 border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-700 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                    >
                      📊 View Platform Analytics
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 text-center">
                    Integration typically takes 1-2 weeks • Full technical support included
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/50 shadow-2xl">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Ready to Lead the Healthcare Insurance Revolution?
            </h3>
            <p className="text-slate-600 mb-8 max-w-3xl mx-auto">
              Join forward-thinking insurance companies leveraging Web3 + MailProof + Pools architecture 
              for competitive advantage, operational efficiency, and enhanced customer experience.
            </p>
            
            {/* ROI Calculator Preview */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 mb-8 border border-indigo-100">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">Estimated Benefits for Your Company</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">+$2.8M</div>
                  <div className="text-sm text-slate-600">Annual yield revenue</div>
                  <div className="text-xs text-slate-500">Based on $100M premium pool</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">-85%</div>
                  <div className="text-sm text-slate-600">Processing costs</div>
                  <div className="text-xs text-slate-500">Automated claim workflow</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-slate-600">Privacy compliance</div>
                  <div className="text-xs text-slate-500">Zero data exposure risk</div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🎯 Request Custom ROI Analysis
              </Button>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🚀 Start Pilot Program
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-8 py-4 text-lg rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                📋 Download Integration Guide
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
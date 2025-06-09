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
    <section id="insurer-section" className="py-24 bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="bg-blue-100 text-blue-700 mb-6 px-4 py-2 text-sm">
            🏢 For Insurance Partners
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
            Transform Insurance Operations
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Join the future of healthcare insurance with privacy-preserving claims processing, 
            automated payouts, and yield-generating premium pools.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Benefits for Insurers */}
          <div className={`space-y-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
            <div className="space-y-6">
              {[
                {
                  icon: '⚡',
                  title: 'Instant Claims Processing',
                  description: 'Automate claims verification and payouts with smart contracts. Reduce processing time from weeks to minutes.',
                  metric: '95% faster'
                },
                {
                  icon: '💰',
                  title: 'Revenue from Idle Funds',
                  description: 'Premium pools automatically earn 3-5% APY in Aave V3 while awaiting claims, creating additional revenue streams.',
                  metric: '3-5% APY'
                },
                {
                  icon: '🛡️',
                  title: 'Zero Fraud Risk',
                  description: 'Zero-knowledge proofs verify claims without exposing medical data, eliminating fraud while maintaining privacy.',
                  metric: '100% verified'
                },
                {
                  icon: '📊',
                  title: 'Reduced Operational Costs',
                  description: 'Eliminate manual claim reviews, paperwork processing, and administrative overhead with automated workflows.',
                  metric: '80% cost reduction'
                }
              ].map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
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
                  Insurer Integration Portal
                </CardTitle>
                <p className="text-slate-600">
                  Seamlessly integrate with your existing systems
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Integration Features */}
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-slate-700">API Integration</span>
                      <Badge className="bg-emerald-100 text-emerald-700">✓ Ready</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>• RESTful API endpoints</span>
                        <span className="text-emerald-600">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Real-time webhooks</span>
                        <span className="text-emerald-600">Available</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• SDK for major platforms</span>
                        <span className="text-emerald-600">Available</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-medium text-slate-700">Compliance & Security</span>
                      <Badge className="bg-blue-100 text-blue-700">HIPAA Ready</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-600">
                      <div className="flex justify-between">
                        <span>• HIPAA compliance</span>
                        <span className="text-blue-600">Certified</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• SOC 2 Type II</span>
                        <span className="text-blue-600">Audited</span>
                      </div>
                      <div className="flex justify-between">
                        <span>• Zero-knowledge proofs</span>
                        <span className="text-purple-600">Built-in</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                    <h4 className="font-semibold text-slate-800 mb-2">Current Network Stats</h4>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-blue-600">$2.3M</div>
                        <div className="text-xs text-slate-500">Total Value Locked</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-emerald-600">1,247</div>
                        <div className="text-xs text-slate-500">Claims Processed</div>
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
                      📄 Download Partnership Kit
                    </Button>
                  </div>
                  <p className="text-sm text-slate-500 mt-4 text-center">
                    Integration typically takes 2-4 weeks • Full support included
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
              Ready to Revolutionize Your Insurance Operations?
            </h3>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Join leading insurance companies already using zkMed to reduce costs, 
              increase efficiency, and provide better customer experiences.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">95%</div>
                <div className="text-sm text-slate-500">Faster Processing</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600">80%</div>
                <div className="text-sm text-slate-500">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">100%</div>
                <div className="text-sm text-slate-500">Privacy Protected</div>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
              >
                🤝 Become a Partner
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-300 hover:border-blue-300 text-slate-700 hover:text-blue-700 px-8 py-4 text-lg rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                📞 Schedule Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
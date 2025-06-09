'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
      icon: '🛡️',
      title: 'Zero-Knowledge Privacy',
      subtitle: 'Medical Data Protection',
      description: 'Submit procedures without exposing any medical information. Zero-knowledge proofs verify eligibility while keeping your health data completely private.',
      stats: '100% Privacy',
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      delay: 'delay-100'
    },
    {
      icon: '⚡',
      title: 'Instant Processing',
      subtitle: 'Fast Verification',
      description: 'Automated verification through smart contracts processes your procedures in under 5 minutes. No paperwork, no waiting rooms.',
      stats: '< 5 minutes',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      delay: 'delay-300'
    },
    {
      icon: '💰',
      title: 'Earn While Protected',
      subtitle: 'Yield Generation',
      description: 'Your deposited funds automatically earn yield in Aave V3 pools on Mantle while providing procedure coverage.',
      stats: '3-5% APY',
      color: 'from-violet-500 to-purple-600',
      bgColor: 'bg-violet-50',
      delay: 'delay-500'
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
          <Badge className="bg-indigo-100 text-indigo-700 mb-6 px-4 py-2 text-sm">
            🏥 Healthcare Revolution
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            Privacy-First Healthcare
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            The first platform combining zero-knowledge privacy, instant procedure processing, 
            and yield generation for your healthcare funds.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

        {/* Bottom CTA Section */}
        <div className={`text-center mt-20 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-indigo-100">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Ready to Experience Private Healthcare?
              </h3>
              <p className="text-slate-600 mb-6">
                Join thousands of users who trust zkMed for their healthcare procedure processing.
              </p>
              
              {/* Demo Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">2,847</div>
                  <div className="text-sm text-slate-500">Procedures Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">$2.3M</div>
                  <div className="text-sm text-slate-500">Protected in Pools</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-slate-500">Privacy Maintained</div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center gap-4">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                  🏥 Start Your First Procedure
                </button>
                <button className="border-2 border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-8 py-3 rounded-xl font-medium hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">
                  📖 Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
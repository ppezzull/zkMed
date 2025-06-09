'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function RegistrationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('submit');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('registration-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="registration-section" className="py-24 bg-gradient-to-br from-slate-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="bg-indigo-100 text-indigo-700 mb-6 px-4 py-2 text-sm">
            🏥 Get Started
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            Secure Procedure Submission
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Submit medical procedures privately or explore coverage options. 
            Your health data stays encrypted with zero-knowledge technology.
          </p>
        </div>

        {/* Registration Tabs */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm p-1 h-14">
              <TabsTrigger 
                value="submit" 
                className="h-12 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                🔐 Submit Procedure
              </TabsTrigger>
              <TabsTrigger 
                value="explore" 
                className="h-12 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                🔍 Explore Coverage
              </TabsTrigger>
            </TabsList>

            <TabsContent value="submit" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      🏥
                    </div>
                    Private Procedure Submission
                  </CardTitle>
                  <p className="text-slate-600">
                    Submit your medical procedure for private verification and instant processing.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Procedure Details */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Procedure Type
                        </label>
                        <select className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                          <option>Select procedure type...</option>
                          <option>🩺 General Consultation</option>
                          <option>❤️ Cardiology</option>
                          <option>🧠 Neurology</option>
                          <option>🦴 Orthopedics</option>
                          <option>👁️ Ophthalmology</option>
                          <option>🔬 Laboratory Tests</option>
                          <option>📷 Imaging (X-ray, MRI, CT)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Estimated Cost (mUSD)
                        </label>
                        <Input 
                          type="number" 
                          placeholder="Enter estimated cost"
                          className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Healthcare Provider
                        </label>
                        <Input 
                          placeholder="Hospital or clinic name"
                          className="h-12 border-slate-200 focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    {/* Privacy Features */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                        🛡️ Privacy Protection
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Medical Data Encryption</span>
                          <Badge className="bg-emerald-100 text-emerald-700">✓ Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Zero-Knowledge Proofs</span>
                          <Badge className="bg-emerald-100 text-emerald-700">✓ Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Identity Protection</span>
                          <Badge className="bg-emerald-100 text-emerald-700">✓ Active</Badge>
                        </div>
                      </div>
                      
                      <div className="mt-4 p-3 bg-white/60 rounded-xl">
                        <p className="text-sm text-slate-600">
                          🔒 Your medical information is encrypted and never exposed. 
                          Only verification proofs are shared on-chain.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200">
                    <div className="flex flex-wrap gap-4">
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                      >
                        🔐 Submit Securely
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-2 border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 px-8 py-6 text-lg rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
                      >
                        📋 Save Draft
                      </Button>
                    </div>
                    <p className="text-sm text-slate-500 mt-4">
                      Processing time: Less than 5 minutes • Gas fees covered by zkMed
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="explore" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                      🔍
                    </div>
                    Explore Coverage Options
                  </CardTitle>
                  <p className="text-slate-600">
                    Discover available coverage pools and their benefits.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Coverage Options */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        title: 'Basic Coverage',
                        apy: '3.2%',
                        procedures: '5-10',
                        color: 'from-blue-500 to-indigo-600',
                        features: ['General consultations', 'Basic diagnostics', 'Emergency care']
                      },
                      {
                        title: 'Comprehensive',
                        apy: '4.1%',
                        procedures: '15-25',
                        color: 'from-indigo-500 to-purple-600',
                        features: ['All basic features', 'Specialist consultations', 'Imaging & lab tests', 'Surgical procedures']
                      },
                      {
                        title: 'Premium Care',
                        apy: '4.8%',
                        procedures: 'Unlimited',
                        color: 'from-purple-500 to-pink-600',
                        features: ['All comprehensive features', 'Experimental treatments', 'Preventive care', 'Global coverage']
                      }
                    ].map((plan, index) => (
                      <div key={index} className="group">
                        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-slate-100">
                          <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                            {index === 0 ? '🏥' : index === 1 ? '⭐' : '👑'}
                          </div>
                          <h3 className="text-lg font-bold text-slate-800 mb-2">{plan.title}</h3>
                          <div className="mb-4">
                            <div className="text-2xl font-bold text-emerald-600">{plan.apy}</div>
                            <div className="text-sm text-slate-500">APY on deposits</div>
                          </div>
                          <div className="mb-4">
                            <div className="text-sm text-slate-600 mb-2">Covered Procedures</div>
                            <div className="font-semibold text-slate-800">{plan.procedures}</div>
                          </div>
                          <ul className="space-y-2 mb-6">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="text-sm text-slate-600 flex items-center">
                                <span className="text-emerald-500 mr-2">✓</span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <Button 
                            className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200`}
                          >
                            Select Plan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center">
                      💡 How It Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { step: '1', title: 'Choose Plan', desc: 'Select coverage that fits your needs' },
                        { step: '2', title: 'Deposit Funds', desc: 'Funds earn yield in Aave V3 pools' },
                        { step: '3', title: 'Submit Procedures', desc: 'Privately submit when needed' },
                        { step: '4', title: 'Get Paid', desc: 'Instant payouts to providers' }
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                            {item.step}
                          </div>
                          <div className="font-semibold text-slate-800 text-sm mb-1">{item.title}</div>
                          <div className="text-xs text-slate-600">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="text-center pt-6 border-t border-slate-200">
                    <Button 
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                    >
                      🔍 Get Personalized Recommendations
                    </Button>
                    <p className="text-sm text-slate-500 mt-4">
                      Free consultation • No commitment required
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
} 
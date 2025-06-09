'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function RegistrationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('mailproof');

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
            🇮🇹 Currently Available in Regione Lazio, Italy
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            Join zkMed Healthcare
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Verify your existing insurance with MailProof or pay directly with crypto. 
            Your health data stays private with zero-knowledge technology.
          </p>
          
          {/* Regional Limitation Notice */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200 max-w-2xl mx-auto">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-2xl">🌍</span>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-blue-800 mb-2">Currently Available in Regione Lazio, Italy</h3>
                <p className="text-sm text-blue-700 mb-3">
                  zkMed is launching first in Regione Lazio with certified healthcare providers and insurance partners.
                </p>
                <p className="text-sm text-blue-600">
                  <strong>From another region?</strong> Contact our dev team to add WebProof support for your area.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    📧 Contact Dev Team
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    📋 Request Region Support
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Tabs */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm p-1 h-14">
              <TabsTrigger 
                value="mailproof" 
                className="h-12 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                📧 Insurance MailProof
              </TabsTrigger>
              <TabsTrigger 
                value="crypto" 
                className="h-12 text-base font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
              >
                💰 Pay with Crypto
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mailproof" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      📧
                    </div>
                    Insurance MailProof Verification - Regione Lazio
                  </CardTitle>
                  <p className="text-slate-600">
                    Already have insurance in Regione Lazio? Verify your coverage with a secure email proof from your insurer.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Regional Limitation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-500 text-lg">🇮🇹</span>
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Regione Lazio, Italy Only</p>
                        <p className="text-xs text-blue-700">
                          Currently available for residents and healthcare providers in Regione Lazio. 
                          WebProof integration verified with local health authorities and insurance providers.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lazio Insurance Providers */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">
                      🏥 Regione Lazio Insurance Providers
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        {
                          name: 'Assicurazioni Generali Italia',
                          region: '🇮🇹 Regione Lazio',
                          domain: '@generali.it',
                          color: 'from-red-500 to-orange-600',
                          coverage: 'Lazio Regional Coverage'
                        },
                        {
                          name: 'UniSalute Lazio',
                          region: '🇮🇹 Regione Lazio',
                          domain: '@unisalute.it',
                          color: 'from-green-500 to-emerald-600',
                          coverage: 'Local Healthcare Network'
                        },
                        {
                          name: 'Allianz Care Italia',
                          region: '🇮🇹 Regione Lazio',
                          domain: '@allianz.it',
                          color: 'from-blue-500 to-indigo-600',
                          coverage: 'Regional Private Health'
                        },
                        {
                          name: 'Servizio Sanitario Regionale',
                          region: '🇮🇹 Regione Lazio',
                          domain: '@salute.gov.it',
                          color: 'from-slate-500 to-slate-700',
                          coverage: 'Public Healthcare System'
                        }
                      ].map((insurer, index) => (
                        <div key={index} className="group cursor-pointer">
                          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-slate-100 hover:border-indigo-300">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${insurer.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <span className="text-white text-lg font-bold">{insurer.name.charAt(0)}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800">{insurer.name}</h3>
                                <p className="text-sm text-slate-500">{insurer.region}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-emerald-500 text-sm">✓</span>
                                <span className="text-xs text-emerald-600 font-medium">Lazio Verified</span>
                              </div>
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl p-3 mb-4">
                              <div className="text-xs text-slate-600 mb-1">Accepted Email Domain:</div>
                              <div className="text-sm font-mono font-semibold text-indigo-600">{insurer.domain}</div>
                              <div className="text-xs text-slate-500 mt-1">{insurer.coverage}</div>
                            </div>

                            <Button 
                              className={`w-full bg-gradient-to-r ${insurer.color} hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-white`}
                            >
                              📧 Request MailProof
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How MailProof Works */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      🔍 How MailProof Works in Regione Lazio
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { step: '1', title: 'Request Proof', desc: 'Click on your Lazio insurer to request verification email' },
                        { step: '2', title: 'Receive Email', desc: 'Get official proof email from your insurance provider' },
                        { step: '3', title: 'Verify & Join', desc: 'Upload email proof to verify Lazio coverage instantly' }
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">
                            {item.step}
                          </div>
                          <div className="font-semibold text-slate-800 text-sm mb-1">{item.title}</div>
                          <div className="text-xs text-slate-600">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact for Other Regions */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      🌍 Need Support for Another Region?
                    </h3>
                    <p className="text-sm text-slate-700 mb-4">
                      We're expanding zkMed to other regions! If you're outside Regione Lazio, contact our development team 
                      to add WebProof support for your healthcare providers and insurance companies.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        📧 Contact Dev Team
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        📋 Request Region
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        🗺️ View Roadmap
                      </Button>
                    </div>
                  </div>

                  {/* Alternative Option */}
                  <div className="text-center pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-4">
                      Don't have insurance in Regione Lazio? 
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedTab('crypto')}
                      className="border-2 border-emerald-300 hover:border-emerald-400 text-emerald-700 hover:text-emerald-800 px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      💰 Pay Directly with Crypto Instead
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="crypto" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                      💰
                    </div>
                    Pay Directly with Crypto - Regione Lazio
                  </CardTitle>
                  <p className="text-slate-600">
                    Don't have insurance in Regione Lazio? Select a coverage plan and pay directly with cryptocurrency for instant access to local healthcare providers.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Regional Limitation */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start space-x-3">
                      <span className="text-blue-500 text-lg">🇮🇹</span>
                      <div>
                        <p className="text-sm text-blue-800 font-medium">Regione Lazio Healthcare Network</p>
                        <p className="text-xs text-blue-700">
                          Payments are processed for healthcare services within Regione Lazio's certified provider network. 
                          Coverage includes hospitals, clinics, and specialists verified by local health authorities.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Lazio Healthcare Plans */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-6 text-center">
                      🏥 Regione Lazio Healthcare Plans
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {[
                        {
                          name: 'Lazio Basic Care',
                          region: '🇮🇹 Regione Lazio',
                          priceRange: '€80-150/month',
                          coverage: 'Basic Healthcare',
                          color: 'from-blue-500 to-indigo-600',
                          features: ['General Consultations', 'Emergency Care', 'Basic Diagnostics']
                        },
                        {
                          name: 'Lazio Comprehensive',
                          region: '🇮🇹 Regione Lazio',
                          priceRange: '€150-250/month',
                          coverage: 'Full Coverage',
                          color: 'from-emerald-500 to-teal-600',
                          features: ['All Basic Services', 'Specialist Care', 'Advanced Imaging']
                        },
                        {
                          name: 'Lazio Premium Care',
                          region: '🇮🇹 Regione Lazio',
                          priceRange: '€250-400/month',
                          coverage: 'Premium Network',
                          color: 'from-purple-500 to-violet-600',
                          features: ['Private Hospitals', 'Express Service', 'International Coverage']
                        },
                        {
                          name: 'Lazio Family Plan',
                          region: '🇮🇹 Regione Lazio',
                          priceRange: '€300-500/month',
                          coverage: 'Family Coverage',
                          color: 'from-orange-500 to-red-600',
                          features: ['Up to 4 Members', 'Pediatric Care', 'Maternity Services']
                        }
                      ].map((plan, index) => (
                        <div key={index} className="group cursor-pointer">
                          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-slate-100 hover:border-emerald-300">
                            <div className="flex items-center space-x-4 mb-4">
                              <div className={`w-12 h-12 bg-gradient-to-br ${plan.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                <span className="text-white text-lg font-bold">{plan.name.charAt(0)}</span>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-slate-800">{plan.name}</h3>
                                <p className="text-sm text-slate-500">{plan.region}</p>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-emerald-500 text-sm">✓</span>
                                <span className="text-xs text-emerald-600 font-medium">Lazio Network</span>
                              </div>
                            </div>
                            
                            <div className="space-y-3 mb-4">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Price Range:</span>
                                <span className="text-sm font-semibold text-slate-800">{plan.priceRange}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Coverage Type:</span>
                                <span className="text-sm font-semibold text-emerald-600">{plan.coverage}</span>
                              </div>
                              <div className="bg-slate-50 rounded-xl p-3">
                                <div className="text-xs text-slate-600 mb-2">Included Services:</div>
                                <div className="space-y-1">
                                  {plan.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center space-x-2">
                                      <span className="text-emerald-500 text-xs">✓</span>
                                      <span className="text-xs text-slate-700">{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <Button 
                              className={`w-full bg-gradient-to-r ${plan.color} hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 text-white`}
                            >
                              🏥 Select {plan.name.split(' ')[1]} Plan
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      💳 Accepted Cryptocurrencies
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { name: 'mUSD', symbol: 'mUSD', desc: 'Mantle USD (Recommended)', color: 'bg-emerald-100 text-emerald-700' },
                        { name: 'USDC', symbol: 'USDC', desc: 'USD Coin', color: 'bg-blue-100 text-blue-700' },
                        { name: 'USDT', symbol: 'USDT', desc: 'Tether USD', color: 'bg-green-100 text-green-700' },
                        { name: 'ETH', symbol: 'ETH', desc: 'Ethereum', color: 'bg-purple-100 text-purple-700' }
                      ].map((crypto, index) => (
                        <div key={index} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${crypto.color} mb-2`}>
                            <span className="font-bold text-lg">{crypto.symbol.charAt(0)}</span>
                          </div>
                          <div className="font-semibold text-slate-800 text-sm">{crypto.name}</div>
                          <div className="text-xs text-slate-500">{crypto.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* How Crypto Payment Works */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      ⚡ How Crypto Payment Works
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { step: '1', title: 'Select Plan', desc: 'Choose Lazio healthcare coverage' },
                        { step: '2', title: 'Connect Wallet', desc: 'Link your crypto wallet securely' },
                        { step: '3', title: 'Pay with Crypto', desc: 'Instant payment processing' },
                        { step: '4', title: 'Start Coverage', desc: 'Access to Lazio healthcare network' }
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

                  {/* Contact for Other Regions */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                      🌍 Expanding to Other Regions
                    </h3>
                    <p className="text-sm text-slate-700 mb-4">
                      zkMed plans to expand beyond Regione Lazio. Contact our team to request support for your region's 
                      healthcare providers and enable crypto payments in your area.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white"
                      >
                        📧 Request Region Support
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-amber-300 text-amber-700 hover:bg-amber-50"
                      >
                        🗺️ View Expansion Roadmap
                      </Button>
                    </div>
                  </div>

                  {/* Alternative Option */}
                  <div className="text-center pt-6 border-t border-slate-200">
                    <p className="text-sm text-slate-600 mb-4">
                      Already have insurance coverage in Regione Lazio?
                    </p>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedTab('mailproof')}
                      className="border-2 border-indigo-300 hover:border-indigo-400 text-indigo-700 hover:text-indigo-800 px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                    >
                      📧 Verify with MailProof Instead
                    </Button>
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
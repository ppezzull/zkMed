'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function RegistrationSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState('patients');

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
    <section id="registration-section" className="py-24 bg-gradient-to-br from-slate-50 via-emerald-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-pulse animation-delay-1000"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <Badge className="bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 mb-6 px-4 py-2 text-sm">
            🌍 Global Multi-Role Healthcare Platform
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            Join the Healthcare Revolution
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            Whether you're a patient, hospital, insurer, or administrator, zkMed's Web3 + MailProof + Pools 
            platform delivers privacy, yield generation, and instant settlements for your role.
          </p>
          
          {/* Global Platform Benefits */}
          <div className="mt-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6 border border-emerald-200 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <span className="text-emerald-600 text-2xl">🌍</span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-emerald-800 mb-2">Universal Compatibility</h3>
                  <p className="text-sm text-emerald-700">
                    Works with any insurance company globally. Hybrid Web2/Web3 architecture maintains regulatory compliance.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 text-2xl">💰</span>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Merchant Moe Yield Generation</h3>
                  <p className="text-sm text-blue-700">
                    Healthcare funds earn 3-5% APY through custom Liquidity Book pools while awaiting claims.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Role Registration Tabs */}
        <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm p-1 h-14">
              <TabsTrigger 
                value="patients" 
                className="h-12 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                👥 Patients
              </TabsTrigger>
              <TabsTrigger 
                value="hospitals" 
                className="h-12 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
              >
                🏥 Hospitals
              </TabsTrigger>
              <TabsTrigger 
                value="insurers" 
                className="h-12 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-600 data-[state=active]:text-white"
              >
                🏢 Insurers
              </TabsTrigger>
              <TabsTrigger 
                value="admins" 
                className="h-12 text-sm font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
              >
                ⚙️ Admins
              </TabsTrigger>
            </TabsList>

            <TabsContent value="patients" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      👥
                    </div>
                    Patient Portal - Web3 + MailProof + Pools
                  </CardTitle>
                  <p className="text-slate-600">
                    Access yield-generating healthcare coverage with complete privacy and instant claim settlements.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Patient Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                      <h3 className="text-lg font-semibold text-indigo-800 mb-3">🔐 MailProof Privacy</h3>
                      <ul className="space-y-2 text-sm text-indigo-700">
                        <li>• Zero medical data exposure on-chain</li>
                        <li>• DKIM-signed email verification</li>
                        <li>• Complete claims privacy preservation</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-3">💰 Yield Generation</h3>
                      <ul className="space-y-2 text-sm text-emerald-700">
                        <li>• 3-5% APY through Merchant Moe pools</li>
                        <li>• Lower effective premium costs</li>
                        <li>• Automatic yield distribution</li>
                      </ul>
                    </div>
                  </div>

                  {/* Payment Options */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                      💳 Flexible Payment Options via thirdweb
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-100 hover:border-indigo-300 transition-colors">
                        <h4 className="font-semibold text-slate-800 mb-2">Fiat-to-Crypto</h4>
                        <p className="text-sm text-slate-600 mb-3">Credit card, bank transfer, or digital wallet payments automatically converted to mUSD</p>
                        <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                          💳 Setup Fiat Payments
                        </Button>
                      </div>
                      <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-slate-100 hover:border-emerald-300 transition-colors">
                        <h4 className="font-semibold text-slate-800 mb-2">Direct Crypto</h4>
                        <p className="text-sm text-slate-600 mb-3">Direct mUSD payments for Web3-native users with advanced DeFi features</p>
                        <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                          🪙 Connect Crypto Wallet
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Getting Started */}
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">🚀 Get Started in 3 Steps</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                        <span className="text-slate-700">Choose your payment method (fiat or crypto)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                        <span className="text-slate-700">Receive insurance agreement via MailProof email</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                        <span className="text-slate-700">Start earning yield while covered</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hospitals" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mr-3">
                      🏥
                    </div>
                    Hospital Integration - Instant Settlements
                  </CardTitle>
                  <p className="text-slate-600">
                    Integrate with zkMed for instant claim payments and improved cash flow management.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hospital Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                      <h3 className="text-lg font-semibold text-emerald-800 mb-3">⚡ Instant Payments</h3>
                      <ul className="space-y-2 text-sm text-emerald-700">
                        <li>• MailProof-triggered instant mUSD transfers</li>
                        <li>• No more weeks of payment delays</li>
                        <li>• Immediate cash flow improvement</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">🔗 Easy Integration</h3>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li>• Works with existing EHR systems</li>
                        <li>• Domain verification via MailProof</li>
                        <li>• Comprehensive API documentation</li>
                      </ul>
                    </div>
                  </div>

                  {/* Integration Process */}
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">🏥 Hospital Integration Process</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                        <div>
                          <div className="font-medium text-slate-800">Domain Verification</div>
                          <div className="text-sm text-slate-600">Submit MailProof from your hospital domain for verification</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                        <div>
                          <div className="font-medium text-slate-800">Wallet Setup</div>
                          <div className="text-sm text-slate-600">Configure payment wallet for instant mUSD receipts</div>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                        <div>
                          <div className="font-medium text-slate-800">Start Receiving Payments</div>
                          <div className="text-sm text-slate-600">Begin receiving instant payments for approved claims</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 text-lg rounded-xl">
                    🏥 Register Your Hospital
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insurers" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mr-3">
                      🏢
                    </div>
                    Insurance Company Integration - Yield + Efficiency
                  </CardTitle>
                  <p className="text-slate-600">
                    Transform your insurance operations with yield-generating pools and automated settlements.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Insurer Benefits */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-800 mb-3">💰 Revenue Generation</h3>
                      <ul className="space-y-2 text-sm text-blue-700">
                        <li>• 3-5% APY on premium pools</li>
                        <li>• Automated yield distribution</li>
                        <li>• Additional revenue streams</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                      <h3 className="text-lg font-semibold text-violet-800 mb-3">⚡ Operational Efficiency</h3>
                      <ul className="space-y-2 text-sm text-violet-700">
                        <li>• 95% faster claim processing</li>
                        <li>• 80% operational cost reduction</li>
                        <li>• Automated compliance reporting</li>
                      </ul>
                    </div>
                  </div>

                  {/* ROI Preview */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-lg font-semibold text-blue-800 mb-4">📊 Estimated ROI Calculator</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-emerald-600">+$2.8M</div>
                        <div className="text-sm text-slate-600">Annual yield revenue</div>
                        <div className="text-xs text-slate-500">$100M premium pool</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">-85%</div>
                        <div className="text-sm text-slate-600">Processing costs</div>
                        <div className="text-xs text-slate-500">Automated workflows</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">6-12mo</div>
                        <div className="text-sm text-slate-600">Payback period</div>
                        <div className="text-xs text-slate-500">Full integration</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 text-lg rounded-xl">
                      🎯 Request Custom ROI Analysis
                    </Button>
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 text-lg rounded-xl">
                      🚀 Start Pilot Program
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="admins" className="mt-8">
              <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-slate-800 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      ⚙️
                    </div>
                    zkMed Admin Portal - Fraud Prevention & Security
                  </CardTitle>
                  <p className="text-slate-600">
                    Internal zkMed team portal for monitoring platform security, detecting fraudulent activities, and managing user account integrity.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Admin Features */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
                      <h3 className="text-lg font-semibold text-violet-800 mb-3">🛡️ Fraud Detection</h3>
                      <ul className="space-y-2 text-sm text-violet-700">
                        <li>• Real-time anomaly detection systems</li>
                        <li>• Suspicious transaction monitoring</li>
                        <li>• AI-powered behavioral analysis</li>
                      </ul>
                    </div>
                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                      <h3 className="text-lg font-semibold text-pink-800 mb-3">🚨 Account Management</h3>
                      <ul className="space-y-2 text-sm text-pink-700">
                        <li>• Malicious account investigation</li>
                        <li>• Account suspension/termination tools</li>
                        <li>• Appeal process management</li>
                      </ul>
                    </div>
                  </div>

                  {/* Admin Capabilities */}
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">⚙️ zkMed Team Capabilities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-violet-600">✓</span>
                          <span className="text-sm text-slate-700">Fraudulent claim investigation</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-violet-600">✓</span>
                          <span className="text-sm text-slate-700">User account verification review</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-violet-600">✓</span>
                          <span className="text-sm text-slate-700">Emergency account suspension</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <span className="text-violet-600">✓</span>
                          <span className="text-sm text-slate-700">MailProof validation auditing</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-violet-600">✓</span>
                          <span className="text-sm text-slate-700">Platform integrity monitoring</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-violet-600">✓</span>
                          <span className="text-sm text-slate-700">Security incident response</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
                    <h4 className="text-sm font-semibold text-red-800 mb-2">🚨 For zkMed Team Members Only</h4>
                    <p className="text-xs text-red-700">
                      This portal is restricted to authorized zkMed team members with fraud prevention and security responsibilities. 
                      Unauthorized access attempts are logged and may result in legal action.
                    </p>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-4 text-lg rounded-xl">
                    🔐 zkMed Team Login
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
} 
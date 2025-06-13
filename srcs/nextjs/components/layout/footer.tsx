import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl font-bold">⚕️</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🧪</span>
                  </div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">
                    <span className="text-indigo-400">zk</span>Med
                  </div>
                  <div className="text-xs text-slate-400 -mt-1">Global Healthcare Platform</div>
                </div>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed">
                The world's first Web3 + MailProof + Pools healthcare insurance platform. 
                Privacy-preserving claims processing with yield generation for any insurance company globally.
              </p>
              
              {/* Live Stats */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Test TVL</span>
                  <span className="text-indigo-400 font-semibold">$12.7M</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Test Claims</span>
                  <span className="text-emerald-400 font-semibold">15,847</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Simulated APY</span>
                  <span className="text-purple-400 font-semibold">4.2%</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-lg">𝕏</span>
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-lg">📧</span>
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-lg">💬</span>
                </button>
                <button className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                  <span className="text-lg">📚</span>
                </button>
              </div>
            </div>

            {/* Platform Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Platform</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
                    <span className="mr-2">🏠</span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
                    <span className="mr-2">📊</span>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/claims" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
                    <span className="mr-2">🏥</span>
                    Claims Portal
                  </Link>
                </li>
                <li>
                  <Link href="/pool" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
                    <span className="mr-2">💰</span>
                    Pool Analytics
                  </Link>
                </li>
                <li>
                  <Link href="/governance" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
                    <span className="mr-2">🗳️</span>
                    Governance
                  </Link>
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Solutions</h3>
              <ul className="space-y-4">
                <li>
                  <Link href="/patients" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
                    <span className="mr-2">👥</span>
                    For Patients
                  </Link>
                </li>
                <li>
                  <Link href="/hospitals" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
                    <span className="mr-2">🏥</span>
                    For Hospitals
                  </Link>
                </li>
                <li>
                  <Link href="/insurers" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
                    <span className="mr-2">🏢</span>
                    For Insurers
                  </Link>
                </li>
                <li>
                  <Link href="/admins" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
                    <span className="mr-2">⚙️</span>
                    zkMed Team
                  </Link>
                </li>
                <li>
                  <Link href="/integration" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
                    <span className="mr-2">🔗</span>
                    API Integration
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources & Newsletter */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
              <ul className="space-y-4 mb-8">
                <li>
                  <Link href="/docs" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">📚</span>
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">🛡️</span>
                    Security Design
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">🔐</span>
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">📋</span>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
                    <span className="mr-2">💬</span>
                    Support Center
                  </Link>
                </li>
              </ul>

              {/* Newsletter Signup */}
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <h4 className="text-sm font-semibold text-white mb-3">Development Updates</h4>
                <p className="text-xs text-slate-400 mb-4">
                  Get notified about testnet progress and launch preparations.
                </p>
                <div className="flex space-x-2">
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-sm flex-1"
                  />
                  <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-3">
                    ✓
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Partners Bar */}
        <div className="border-t border-white/10 py-8">
          <div className="text-center mb-6">
            <h4 className="text-sm font-semibold text-slate-400 mb-4">Powered by Leading Web3 Technologies</h4>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2">
                <Image src="/icons/mantle-network.jpg" alt="Mantle" width={16} height={16} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">Mantle Network</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image src="/icons/vlayer-logo.png" alt="vlayer" width={16} height={16} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">vlayer MailProof</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image src="/icons/merchant-moe.png" alt="Merchant Moe" width={16} height={16} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">Merchant Moe LB</span>
              </div>
              <div className="flex items-center space-x-2">
                <Image src="/icons/thirdweb.png" alt="thirdweb" width={16} height={16} className="w-4 h-4 rounded" />
                <span className="text-sm text-slate-300">thirdweb SDK</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span>© 2024 zkMed. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  🧪 Testnet Development
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  🛡️ SOC 2 Planning
                </Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                  🔐 HIPAA Ready
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-slate-400">Built with ❤️ for global healthcare</span>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-orange-400">Testnet operational</span>
              </div>
            </div>
          </div>
        </div>

        {/* Network Status */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
            <div className="flex items-center space-x-2 text-xs">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300">Network: Anvil Testnet</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300">Status: Development</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 
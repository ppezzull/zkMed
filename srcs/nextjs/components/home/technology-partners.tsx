import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function TechnologyPartners() {
  const partners = [
    {
      name: "Mantle Network",
      description: "High-performance L2 blockchain for mUSD settlements",
      iconPath: "/icons/mantle-network.jpg",
      color: "bg-gradient-to-br from-indigo-50 to-indigo-100",
      iconColor: "text-indigo-600",
      category: "Blockchain Infrastructure"
    },
    {
      name: "vlayer MailProof",
      description: "Privacy-preserving DKIM email verification",
      iconPath: "/icons/vlayer-logo.png",
      color: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconColor: "text-purple-600",
      category: "Privacy Technology"
    },
    {
      name: "Merchant Moe LB",
      description: "Liquidity Book pools with custom healthcare hooks",
      iconPath: "/icons/merchant-moe.png",
      color: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      iconColor: "text-emerald-600",
      category: "DeFi Yield Generation"
    },
    {
      name: "thirdweb SDK",
      description: "Seamless Web3 integration and smart accounts",
      iconPath: "/icons/thirdweb.png",
      color: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconColor: "text-orange-600",
      category: "Developer Platform"
    }
  ];

  const stats = [
    { value: "47", label: "Test Insurance Partners", icon: "🏢" },
    { value: "100%", label: "Privacy Maintained", icon: "🔒" },
    { value: "15,847", label: "Test Claims Processed", icon: "📋" },
    { value: "$12.7M", label: "Simulated TVL", icon: "💎" },
    { value: "4.2%", label: "Test APY", icon: "📊" },
    { value: "< 30s", label: "Settlement Time", icon: "⚡" }
  ];

  const features = [
    {
      title: "Universal Compatibility",
      description: "Works with any insurance company globally",
      icon: "🌍"
    },
    {
      title: "Complete Privacy",
      description: "Zero medical data exposure on-chain",
      icon: "🛡️"
    },
    {
      title: "Instant Settlements",
      description: "MailProof-triggered payments in seconds",
      icon: "⚡"
    },
    {
      title: "Yield Generation",
      description: "3-5% APY through Merchant Moe pools",
      icon: "💰"
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 mb-6 px-4 py-2 text-sm">
            🧪 Development Stack - Testnet Environment
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
            Powered by Revolutionary Technology
          </h2>
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            zkMed's Web3 + MailProof + Pools architecture combines the best blockchain, privacy, 
            and DeFi technologies for global healthcare insurance transformation.
          </p>
        </div>
        
        {/* Core Technology Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {partners.map((partner, index) => (
            <div key={index} className="group cursor-pointer">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 border border-white/50 h-full">
                <div className={`w-16 h-16 rounded-2xl ${partner.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Image 
                    src={partner.iconPath} 
                    alt={partner.name} 
                    width={32} 
                    height={32}
                    className="w-8 h-8 rounded"
                    unoptimized
                  />
                </div>
                <div className="mb-2">
                  <Badge className="bg-slate-100 text-slate-600 text-xs mb-2">
                    {partner.category}
                  </Badge>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">{partner.description}</p>
                
                {/* Hover Effect */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${partner.iconColor} bg-current transform -translate-x-full group-hover:translate-x-0 transition-transform duration-1000 ease-out`}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Platform Features */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Platform Advantages
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Comprehensive benefits that make zkMed the leading healthcare insurance platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-2xl text-white">{feature.icon}</span>
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">{feature.title}</h4>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Live Network Stats */}
        <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 border border-indigo-100 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
              Testnet Development Statistics
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Current metrics from our anvil testnet development environment
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg text-center group hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-lg text-white">{stat.icon}</span>
                </div>
                <h4 className="font-bold text-slate-800 mb-1 text-lg">{stat.value}</h4>
                <p className="text-xs text-slate-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Compliance */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-white/50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Enterprise-Grade Security & Compliance
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                zkMed meets the highest security and regulatory standards for global healthcare operations. 
                Our platform is built with privacy-first architecture and comprehensive compliance frameworks.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <Badge variant="outline" className="bg-white text-emerald-700 border-emerald-300 px-3 py-2 justify-center">
                  ✅ HIPAA Ready
                </Badge>
                <Badge variant="outline" className="bg-white text-blue-700 border-blue-300 px-3 py-2 justify-center">
                  🛡️ SOC 2 Planning
                </Badge>
                <Badge variant="outline" className="bg-white text-purple-700 border-purple-300 px-3 py-2 justify-center">
                  🔒 Zero Data Exposure
                </Badge>
                <Badge variant="outline" className="bg-white text-indigo-700 border-indigo-300 px-3 py-2 justify-center">
                  🌍 GDPR Ready
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl px-8 py-3">
                  🔍 View Security Design
                </Button>
                <Button variant="outline" className="border-slate-300 hover:border-indigo-300 text-slate-700 hover:text-indigo-700 rounded-xl px-8 py-3">
                  📋 Development Roadmap
                </Button>
              </div>
            </div>
            
            {/* Compliance Features */}
            <div className="space-y-4">
              {[
                {
                  title: "MailProof Privacy",
                  description: "DKIM-based verification with zero medical data exposure",
                  icon: "🛡️",
                  color: "from-purple-500 to-violet-600"
                },
                {
                  title: "Smart Contract Security",
                  description: "Comprehensive testing and audit preparation",
                  icon: "🔍",
                  color: "from-blue-500 to-indigo-600"
                },
                {
                  title: "Development Security",
                  description: "Secure development practices and code review",
                  icon: "🔐",
                  color: "from-emerald-500 to-teal-600"
                },
                {
                  title: "Compliance Framework",
                  description: "Built for global healthcare regulatory requirements",
                  icon: "📋",
                  color: "from-orange-500 to-red-600"
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-slate-50 rounded-xl group hover:bg-slate-100 transition-colors">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
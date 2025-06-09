import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function TechnologyPartners() {
  const partners = [
    {
      name: "Mantle",
      description: "High-performance L2 blockchain",
      icon: "⛓️",
      color: "bg-[#F0F9FF]",
      iconColor: "text-[#0066CC]"
    },
    {
      name: "Aave V3",
      description: "Secure yield generation protocol",
      icon: "📊",
      color: "bg-[#ECFDF5]",
      iconColor: "text-[#10B981]"
    },
    {
      name: "vlayer",
      description: "Zero-knowledge proof system",
      icon: "🛡️",
      color: "bg-[#F3E8FF]",
      iconColor: "text-[#8B5CF6]"
    },
    {
      name: "thirdweb",
      description: "Gas-free transaction sponsor",
      icon: "🚀",
      color: "bg-[#FEF3C7]",
      iconColor: "text-[#F59E0B]"
    }
  ];

  const stats = [
    { value: "150+", label: "Lazio Hospitals Integrated", icon: "🏥" },
    { value: "100%", label: "Claim Success Rate", icon: "📋" },
    { value: "3,200+", label: "Protected Patients", icon: "👥" },
    { value: "< 5 min", label: "Avg. Claim Processing", icon: "⚡" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge className="bg-blue-100 text-blue-700 mb-4 px-4 py-2 text-sm">
            🇮🇹 Regione Lazio, Italy
          </Badge>
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0066CC] mb-4">
            Powered by Leading Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            zkMed integrates best-in-class blockchain solutions for security, yield, and privacy in Regione Lazio.
          </p>
        </div>
        
        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {partners.map((partner, index) => (
            <div key={index} className="flex flex-col items-center group cursor-pointer">
              <div className={`w-20 h-20 rounded-full ${partner.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <span className={`text-3xl ${partner.iconColor}`}>{partner.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{partner.name}</h3>
              <p className="text-sm text-gray-600 text-center">{partner.description}</p>
            </div>
          ))}
        </div>
        
        {/* Trust Section */}
        <div className="bg-[#F0F9FF] rounded-2xl p-8 shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-[#0066CC] mb-4">
                Trusted by Regione Lazio Healthcare
              </h3>
              <p className="text-gray-600 mb-6">
                zkMed's platform is integrated with leading hospitals and insurance providers in Regione Lazio, 
                with 100% claim success rate and complete privacy protection.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
                  ✅ HIPAA Compliant
                </Badge>
                <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
                  🛡️ SOC 2 Certified
                </Badge>
                <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
                  🔒 End-to-End Encrypted
                </Badge>
                <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
                  🇮🇹 Lazio Verified
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-[#0066CC] hover:bg-[#0055AA] text-white rounded-lg">
                  🏥 Lazio Provider Portal
                </Button>
                <Button variant="outline" className="border-[#0066CC] text-[#0066CC] hover:bg-[#F0F9FF] rounded-lg">
                  📧 Request Other Regions
                </Button>
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-[#F0F9FF] flex items-center justify-center mb-3">
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <h4 className="font-medium text-gray-800 mb-1">{stat.value}</h4>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Regional Expansion Notice */}
        <div className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-amber-800 mb-4">🌍 Expanding Beyond Regione Lazio</h3>
            <p className="text-amber-700 mb-6 max-w-2xl mx-auto">
              zkMed is currently optimized for Regione Lazio's healthcare ecosystem. We're working to expand 
              to other Italian regions and internationally. Contact our development team to add WebProof 
              support for your region.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg">
                📧 Contact Dev Team
              </Button>
              <Button variant="outline" className="border-amber-400 text-amber-700 hover:bg-amber-50 rounded-lg">
                🗺️ View Expansion Roadmap
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
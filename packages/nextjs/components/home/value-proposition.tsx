import { Card } from '@/components/ui/card';

export default function ValueProposition() {
  const valueProps = [
    {
      icon: "📈",
      title: "Premiums Earn 3-5% APY",
      description: "Patient and insurer funds generate yield via Aave V3 pools while awaiting claims",
      bgColor: "bg-gradient-to-br from-[#ECFDF5] to-white",
      borderColor: "border-l-4 border-[#10B981]",
      iconBg: "bg-[#10B981]/10",
      iconColor: "text-[#10B981]"
    },
    {
      icon: "⚡",
      title: "Instant Claim Payouts",
      description: "Approved claims trigger immediate mUSD withdrawals from pool to hospitals",
      bgColor: "bg-gradient-to-br from-[#F0F9FF] to-white",
      borderColor: "border-l-4 border-[#0066CC]",
      iconBg: "bg-[#0066CC]/10",
      iconColor: "text-[#0066CC]"
    },
    {
      icon: "🛡️",
      title: "Complete Medical Privacy",
      description: "Zero-knowledge proofs ensure no medical data exposed during claim processing",
      bgColor: "bg-gradient-to-br from-[#F3E8FF] to-white",
      borderColor: "border-l-4 border-[#8B5CF6]",
      iconBg: "bg-[#8B5CF6]/10",
      iconColor: "text-[#8B5CF6]"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0066CC] mb-4">
            Why Choose zkMed?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            The first healthcare platform that makes your money work for you while ensuring 
            complete privacy and instant claim processing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <Card 
              key={index} 
              className={`${prop.bgColor} ${prop.borderColor} p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex flex-col items-start h-full">
                <div className={`w-16 h-16 ${prop.iconBg} rounded-full flex items-center justify-center mb-6`}>
                  <span className="text-2xl">{prop.icon}</span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                  {prop.title}
                </h3>
                
                <p className="text-gray-600 mb-6 flex-grow">
                  {prop.description}
                </p>
                
                {/* Visual Element */}
                <div className="w-full">
                  {index === 0 && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Your Yield Today</span>
                        <span className="font-semibold text-[#10B981]">+$8.75</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#10B981] h-2 rounded-full transition-all duration-1000" 
                          style={{ width: '75%' }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">75% of daily target reached</p>
                    </div>
                  )}
                  
                  {index === 1 && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Processing Time</p>
                          <p className="text-xs text-gray-500">Traditional vs zkMed</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-[#0066CC]">&lt; 5 min</p>
                          <p className="text-xs text-gray-400 line-through">30-90 days</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {index === 2 && (
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Privacy Level</span>
                        <span className="text-sm font-semibold text-[#8B5CF6]">100%</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i} 
                              className="w-2 h-2 bg-[#8B5CF6] rounded-full"
                            ></div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">Zero-Knowledge</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 
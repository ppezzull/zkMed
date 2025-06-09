import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export default function RegistrationSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#0066CC] mb-4">
            Simple Registration, Maximum Benefits
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose to verify your existing insurance or select new coverage with yield-earning premiums.
          </p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <Tabs defaultValue="existing" className="w-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
              <TabsList className="grid grid-cols-2 gap-4 bg-transparent">
                <TabsTrigger 
                  value="existing" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#0066CC] data-[state=active]:shadow-md rounded-lg px-4 py-2"
                >
                  📋 Have Insurance?
                </TabsTrigger>
                <TabsTrigger 
                  value="new" 
                  className="data-[state=active]:bg-white data-[state=active]:text-[#0066CC] data-[state=active]:shadow-md rounded-lg px-4 py-2"
                >
                  ➕ Need Coverage?
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="existing" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left Column - Upload Insurance */}
                <div className="p-8 border-r border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Upload Existing Insurance
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Verify your current insurance to start earning yield on your premiums 
                    while maintaining your existing coverage.
                  </p>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Insurance Provider Email
                    </label>
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="yourinsurer@provider.com"
                        className="pl-10 border-gray-300 focus:border-[#0066CC] focus:ring focus:ring-[#0066CC] focus:ring-opacity-20"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        ✉️
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      We will verify your coverage with vlayer MailProof
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or Upload Insurance Card
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0066CC] transition-colors cursor-pointer">
                      <div className="text-gray-400 text-2xl mb-2">📄</div>
                      <p className="text-gray-500">
                        Drag & drop your insurance card or click to browse
                      </p>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-[#0066CC] hover:bg-[#0055AA] text-white rounded-lg">
                    Verify & Start Earning
                  </Button>
                </div>
                
                {/* Right Column - Benefits */}
                <div className="p-8 bg-[#F0F9FF]">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Benefits After Verification
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        title: "Immediate Yield Generation",
                        description: "Your premiums start earning 3-5% APY instantly"
                      },
                      {
                        title: "Zero-Knowledge Privacy",
                        description: "Your medical data remains completely private"
                      },
                      {
                        title: "Instant Claim Processing",
                        description: "Approved claims paid immediately to providers"
                      },
                      {
                        title: "Gas-Free Transactions",
                        description: "All network fees covered by zkMed"
                      }
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#10B981] flex items-center justify-center mt-0.5">
                          <span className="text-white text-xs">✓</span>
                        </div>
                        <div className="ml-3">
                          <h4 className="text-base font-medium text-gray-800">
                            {benefit.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Verification Progress
                      </span>
                      <span className="text-sm font-medium text-[#0066CC]">
                        Step 1 of 3
                      </span>
                    </div>
                    <Progress value={33} className="h-2" />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Left Column - Choose Coverage */}
                <div className="p-8 border-r border-gray-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Choose New Coverage
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Select from verified insurers with transparent pricing and 
                    automatic yield generation on premiums.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    {[
                      { name: "MedShield Plus", apy: 4.5, monthly: 250, selected: true },
                      { name: "HealthGuard Pro", apy: 3.8, monthly: 180, selected: false },
                      { name: "WellCare Select", apy: 4.2, monthly: 210, selected: false }
                    ].map((plan, index) => (
                      <div 
                        key={index} 
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          plan.selected 
                            ? 'border-[#0066CC] bg-[#F0F9FF]' 
                            : 'border-gray-200 hover:border-[#0066CC]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-800">{plan.name}</h4>
                            <p className="text-sm text-gray-600">
                              ${plan.monthly}/month · 
                              <span className="text-[#10B981] font-medium">
                                {plan.apy}% APY
                              </span>
                            </p>
                          </div>
                          <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
                            {plan.selected && (
                              <div className="h-3 w-3 rounded-full bg-[#0066CC]"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Setup mUSD Payments
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value="250 mUSD / month"
                        readOnly
                        className="pl-10 border-gray-300 bg-gray-50"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        💰
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Automatic deposits to Aave V3 yield pools
                    </p>
                  </div>
                  
                  <Button className="w-full bg-[#0066CC] hover:bg-[#0055AA] text-white rounded-lg">
                    Confirm Selection
                  </Button>
                </div>
                
                {/* Right Column - Plan Details */}
                <div className="p-8 bg-[#F0F9FF]">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    MedShield Plus Coverage Details
                  </h3>
                  
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Effective Premium Cost</span>
                      <span className="font-medium">
                        $238.75/month 
                        <span className="text-[#10B981] ml-1">(-4.5%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#10B981] transition-all duration-1000" 
                        style={{ width: '4.5%' }}
                      ></div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      After yield returns at current APY
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    {[
                      {
                        icon: "🏥",
                        title: "Hospital Coverage",
                        description: "100% coverage after $500 deductible"
                      },
                      {
                        icon: "💊",
                        title: "Prescription Drugs",
                        description: "$15 generic / $30 brand name copay"
                      },
                      {
                        icon: "👨‍⚕️",
                        title: "Specialist Visits",
                        description: "$35 copay per visit"
                      }
                    ].map((coverage, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-sm">{coverage.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-base font-medium text-gray-800">
                            {coverage.title}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {coverage.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-medium text-gray-800 mb-2">
                      Annual Yield Projection
                    </h4>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Premium Total: $3,000</span>
                      <span className="text-[#10B981] font-medium">
                        Yield Return: ~$135
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
} 
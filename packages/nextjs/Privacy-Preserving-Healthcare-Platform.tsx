// // The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.

// import React from 'react';
// import { useEffect, useState, useRef } from 'react';
// import * as echarts from 'echarts';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/pagination';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Progress } from "@/components/ui/progress";

// const App: React.FC = () => {
//   const [currentAPY, setCurrentAPY] = useState(4.2);
//   const [tvl, setTvl] = useState(2.3);
//   const [claims, setClaims] = useState(1247);
//   const yieldChartRef = useRef<HTMLDivElement>(null);
//   const claimsChartRef = useRef<HTMLDivElement>(null);
//   const swiperModules = [Pagination, Autoplay];

//   useEffect(() => {
//     // Simulate live data updates
//     const interval = setInterval(() => {
//       setCurrentAPY(prev => +(prev + (Math.random() * 0.1 - 0.05)).toFixed(2));
//       setTvl(prev => +(prev + (Math.random() * 0.05 - 0.025)).toFixed(2));
//       setClaims(prev => prev + (Math.random() > 0.7 ? 1 : 0));
//     }, 5000);

//     // Initialize yield chart
//     if (yieldChartRef.current) {
//       const yieldChart = echarts.init(yieldChartRef.current);
//       const yieldOption = {
//         animation: false,
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           top: '3%',
//           containLabel: true
//         },
//         xAxis: {
//           type: 'category',
//           boundaryGap: false,
//           data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
//           axisLine: {
//             lineStyle: {
//               color: '#E5E7EB'
//             }
//           },
//           axisLabel: {
//             color: '#6B7280'
//           }
//         },
//         yAxis: {
//           type: 'value',
//           min: 3,
//           max: 5,
//           axisLine: {
//             lineStyle: {
//               color: '#E5E7EB'
//             }
//           },
//           axisLabel: {
//             color: '#6B7280',
//             formatter: '{value}%'
//           },
//           splitLine: {
//             lineStyle: {
//               color: '#F3F4F6'
//             }
//           }
//         },
//         series: [
//           {
//             name: 'APY',
//             type: 'line',
//             smooth: true,
//             data: [3.8, 4.1, 3.9, 4.2, 4.3, 4.2],
//             lineStyle: {
//               width: 3,
//               color: '#10B981'
//             },
//             areaStyle: {
//               color: {
//                 type: 'linear',
//                 x: 0,
//                 y: 0,
//                 x2: 0,
//                 y2: 1,
//                 colorStops: [
//                   { offset: 0, color: 'rgba(16, 185, 129, 0.2)' },
//                   { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
//                 ]
//               }
//             },
//             symbol: 'circle',
//             symbolSize: 8,
//             itemStyle: {
//               color: '#10B981',
//               borderColor: '#FFFFFF',
//               borderWidth: 2
//             }
//           }
//         ],
//         tooltip: {
//           trigger: 'axis',
//           formatter: '{b}: {c}% APY',
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           borderColor: '#E5E7EB',
//           borderWidth: 1,
//           textStyle: {
//             color: '#374151'
//           }
//         }
//       };
//       yieldChart.setOption(yieldOption);
//       window.addEventListener('resize', () => {
//         yieldChart.resize();
//       });
//     }

//     // Initialize claims chart
//     if (claimsChartRef.current) {
//       const claimsChart = echarts.init(claimsChartRef.current);
//       const claimsOption = {
//         animation: false,
//         grid: {
//           left: '3%',
//           right: '4%',
//           bottom: '3%',
//           top: '3%',
//           containLabel: true
//         },
//         xAxis: {
//           type: 'category',
//           data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//           axisLine: {
//             lineStyle: {
//               color: '#E5E7EB'
//             }
//           },
//           axisLabel: {
//             color: '#6B7280'
//           }
//         },
//         yAxis: {
//           type: 'value',
//           axisLine: {
//             lineStyle: {
//               color: '#E5E7EB'
//             }
//           },
//           axisLabel: {
//             color: '#6B7280'
//           },
//           splitLine: {
//             lineStyle: {
//               color: '#F3F4F6'
//             }
//           }
//         },
//         series: [
//           {
//             name: 'Claims',
//             type: 'bar',
//             data: [23, 18, 25, 29, 32, 19, 21],
//             itemStyle: {
//               color: '#0066CC'
//             },
//             barWidth: '60%'
//           }
//         ],
//         tooltip: {
//           trigger: 'axis',
//           formatter: '{b}: {c} Claims',
//           backgroundColor: 'rgba(255, 255, 255, 0.9)',
//           borderColor: '#E5E7EB',
//           borderWidth: 1,
//           textStyle: {
//             color: '#374151'
//           }
//         }
//       };
//       claimsChart.setOption(claimsOption);
//       window.addEventListener('resize', () => {
//         claimsChart.resize();
//       });
//     }

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <div className="min-h-[1024px] bg-white text-gray-800 font-sans">
//       {/* Header */}
//       <header className="bg-white sticky top-0 z-50 border-b border-gray-100 shadow-sm">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <a href="#" className="text-2xl font-bold text-[#0066CC]">zkMed</a>
//             </div>
//             <div className="hidden md:flex items-center space-x-4">
//               <nav className="flex items-center space-x-6 mr-6">
//                 <a href="#" className="text-gray-700 hover:text-[#0066CC] font-medium">Platform</a>
//                 <a href="#" className="text-gray-700 hover:text-[#0066CC] font-medium">Pools</a>
//                 <a href="#" className="text-gray-700 hover:text-[#0066CC] font-medium">Privacy</a>
//                 <a href="#" className="text-gray-700 hover:text-[#0066CC] font-medium">Docs</a>
//                 <a href="#" className="text-gray-700 hover:text-[#0066CC] font-medium">About</a>
//                 <a href="#" className="text-gray-700 hover:text-[#0066CC] font-medium">Contact</a>
//               </nav>
//               <div className="bg-gray-100 rounded-full px-4 py-1.5 flex items-center space-x-3 text-sm">
//                 <span>TVL: <strong>${tvl}M</strong></span>
//                 <span className="h-4 w-px bg-gray-300"></span>
//                 <span>APY: <strong className="text-[#10B981]">{currentAPY}%</strong></span>
//                 <span className="h-4 w-px bg-gray-300"></span>
//                 <span>Claims: <strong className="text-[#0066CC]">{claims}</strong></span>
//               </div>
//             </div>
//             <div className="flex items-center">
//               <Button className="bg-[#0066CC] hover:bg-[#0055AA] text-white font-medium !rounded-button whitespace-nowrap">
//                 Connect Wallet
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Hero Section */}
//       <section className="relative overflow-hidden">
//         <div className="absolute inset-0 z-0">
//           <img
//             src="https://readdy.ai/api/search-image?query=futuristic%20medical%20technology%20with%20blue%20gradient%20background%2C%20abstract%20digital%20healthcare%20interface%2C%20secure%20blockchain%20visualization%2C%20professional%20modern%20medical%20technology%20concept%2C%20high%20quality%203D%20render&width=1440&height=700&seq=1&orientation=landscape"
//             alt="Hero Background"
//             className="w-full h-full object-cover object-top"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-[#0066CC]/90 to-transparent"></div>
//         </div>
        
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
//             <div className="text-white">
//               <Badge className="bg-white/20 text-white mb-6 px-3 py-1 text-sm backdrop-blur-sm">
//                 <i className="fas fa-shield-alt mr-2"></i> Gas-Free Transactions
//               </Badge>
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
//                 Revolutionizing Healthcare Payments
//               </h1>
//               <p className="text-xl text-white/90 mb-8 max-w-lg">
//                 A secure financial ecosystem connecting patients, hospitals, and insurers with yield-generating pools, instant settlements, and complete privacy.
//               </p>
//               <div className="flex flex-wrap gap-4">
//                 <Button className="bg-white text-[#0066CC] hover:bg-white/90 px-6 py-6 text-lg !rounded-button whitespace-nowrap">
//                   Get Started Now
//                 </Button>
//                 <Button variant="outline" className="border-white text-white hover:bg-white/10 px-6 py-6 text-lg !rounded-button whitespace-nowrap">
//                   <i className="fas fa-play-circle mr-2"></i> Watch Demo
//                 </Button>
//               </div>
              
//               <div className="mt-12 grid grid-cols-3 gap-6">
//                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                   <div className="text-3xl font-bold">{currentAPY}%</div>
//                   <div className="text-sm text-white/80">Current APY</div>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                   <div className="text-3xl font-bold">${tvl}M</div>
//                   <div className="text-sm text-white/80">Total Value Locked</div>
//                 </div>
//                 <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
//                   <div className="text-3xl font-bold">{claims}</div>
//                   <div className="text-sm text-white/80">Claims Processed</div>
//                 </div>
//               </div>
//             </div>
            
//             <div className="relative">
//               <div className="absolute -inset-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 transform rotate-3"></div>
//               <div className="relative bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/30 transform -rotate-2 shadow-xl">
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 rounded-full bg-[#0066CC] flex items-center justify-center">
//                       <i className="fas fa-user-shield text-white"></i>
//                     </div>
//                     <div className="ml-3 text-white">
//                       <div className="font-medium">Patient Dashboard</div>
//                       <div className="text-xs text-white/70">Secure & Private</div>
//                     </div>
//                   </div>
//                   <Badge className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30">Live Demo</Badge>
//                 </div>
                
//                 <div className="bg-white/20 rounded-lg p-4 mb-4 backdrop-blur-sm">
//                   <div className="flex justify-between text-white mb-2">
//                     <span>Premium Balance</span>
//                     <span className="font-medium">2,500 mUSD</span>
//                   </div>
//                   <div className="flex justify-between text-white mb-2">
//                     <span>Yield Generated</span>
//                     <span className="font-medium text-[#10B981]">+105 mUSD</span>
//                   </div>
//                   <div className="flex justify-between text-white">
//                     <span>Effective Cost</span>
//                     <span className="font-medium">2,395 mUSD <span className="text-[#10B981]">(-4.2%)</span></span>
//                   </div>
//                 </div>
                
//                 <div className="bg-white/20 rounded-lg p-4 mb-6 backdrop-blur-sm">
//                   <div className="flex justify-between text-white mb-2">
//                     <span className="font-medium">Recent Activity</span>
//                     <span className="text-xs text-white/70">Today</span>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex items-center text-white">
//                       <div className="w-8 h-8 rounded-full bg-[#0066CC]/30 flex items-center justify-center mr-3">
//                         <i className="fas fa-hospital text-white text-xs"></i>
//                       </div>
//                       <div className="flex-grow">
//                         <div className="text-sm">Hospital Visit</div>
//                         <div className="text-xs text-white/70">Memorial Health</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm">-350 mUSD</div>
//                         <div className="text-xs text-white/70">Instant</div>
//                       </div>
//                     </div>
//                     <div className="flex items-center text-white">
//                       <div className="w-8 h-8 rounded-full bg-[#10B981]/30 flex items-center justify-center mr-3">
//                         <i className="fas fa-chart-line text-white text-xs"></i>
//                       </div>
//                       <div className="flex-grow">
//                         <div className="text-sm">Yield Earned</div>
//                         <div className="text-xs text-white/70">Aave V3 Pool</div>
//                       </div>
//                       <div className="text-right">
//                         <div className="text-sm text-[#10B981]">+8.75 mUSD</div>
//                         <div className="text-xs text-white/70">Today</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 <Button className="w-full bg-white text-[#0066CC] hover:bg-white/90 !rounded-button whitespace-nowrap">
//                   Access Dashboard
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent z-10"></div>
//       </section>

//       {/* Stakeholder Flows Section */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-semibold text-[#0066CC] mb-4">
//               How zkMed Works for Everyone
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               A seamless ecosystem connecting all healthcare stakeholders with secure, efficient payment flows.
//             </p>
//           </div>

//           <Tabs defaultValue="patients" className="w-full">
//             <TabsList className="grid w-full grid-cols-3 mb-8">
//               <TabsTrigger value="patients" className="data-[state=active]:bg-[#F0F9FF] data-[state=active]:text-[#0066CC] !rounded-button whitespace-nowrap">
//                 <i className="fas fa-user-circle mr-2"></i> For Patients
//               </TabsTrigger>
//               <TabsTrigger value="hospitals" className="data-[state=active]:bg-[#F0F9FF] data-[state=active]:text-[#0066CC] !rounded-button whitespace-nowrap">
//                 <i className="fas fa-hospital mr-2"></i> For Hospitals
//               </TabsTrigger>
//               <TabsTrigger value="insurers" className="data-[state=active]:bg-[#F0F9FF] data-[state=active]:text-[#0066CC] !rounded-button whitespace-nowrap">
//                 <i className="fas fa-shield-alt mr-2"></i> For Insurers
//               </TabsTrigger>
//             </TabsList>

//             <TabsContent value="patients" className="mt-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="bg-[#F0F9FF] rounded-xl p-8">
//                   <h3 className="text-2xl font-semibold text-[#0066CC] mb-6">Patient Benefits</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-percentage text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Earn While Insured</h4>
//                         <p className="text-gray-600">Your premium deposits generate yield in secure pools until needed for claims</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-user-shield text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Complete Privacy</h4>
//                         <p className="text-gray-600">Your medical data remains private with zero-knowledge proof technology</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-bolt text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Instant Claims</h4>
//                         <p className="text-gray-600">No waiting for reimbursements with automatic claim processing</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-6">
//                   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                     <h4 className="font-medium text-gray-800 mb-4">Getting Started</h4>
//                     <ol className="space-y-3">
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">1</span>
//                         <span className="text-gray-600">Connect your existing insurance or choose new coverage</span>
//                       </li>
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">2</span>
//                         <span className="text-gray-600">Set up premium deposits into yield-generating pools</span>
//                       </li>
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">3</span>
//                         <span className="text-gray-600">Use healthcare services with automatic claim processing</span>
//                       </li>
//                     </ol>
//                   </div>
//                   <Button className="w-full bg-[#0066CC] hover:bg-[#0055AA] text-white !rounded-button whitespace-nowrap">
//                     Start Your Patient Journey
//                   </Button>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="hospitals" className="mt-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="bg-[#F0F9FF] rounded-xl p-8">
//                   <h3 className="text-2xl font-semibold text-[#0066CC] mb-6">Hospital Benefits</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-money-bill-wave text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Instant Settlements</h4>
//                         <p className="text-gray-600">Receive payments immediately after service verification</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-file-medical text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Streamlined Claims</h4>
//                         <p className="text-gray-600">Automated verification and processing reduces administrative work</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-chart-line text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Improved Cash Flow</h4>
//                         <p className="text-gray-600">No more waiting for insurance payments or claim processing</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-6">
//                   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                     <h4 className="font-medium text-gray-800 mb-4">Hospital Integration Process</h4>
//                     <ol className="space-y-3">
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">1</span>
//                         <span className="text-gray-600">Register your hospital and verify credentials</span>
//                       </li>
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">2</span>
//                         <span className="text-gray-600">Connect to insurer pools for direct payments</span>
//                       </li>
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">3</span>
//                         <span className="text-gray-600">Start receiving instant payments for verified claims</span>
//                       </li>
//                     </ol>
//                   </div>
//                   <Button className="w-full bg-[#0066CC] hover:bg-[#0055AA] text-white !rounded-button whitespace-nowrap">
//                     Register Your Hospital
//                   </Button>
//                 </div>
//               </div>
//             </TabsContent>

//             <TabsContent value="insurers" className="mt-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div className="bg-[#F0F9FF] rounded-xl p-8">
//                   <h3 className="text-2xl font-semibold text-[#0066CC] mb-6">Insurer Benefits</h3>
//                   <div className="space-y-4">
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-pool text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Efficient Pool Management</h4>
//                         <p className="text-gray-600">Automated premium collection and claim disbursement</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-shield-check text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Reduced Fraud Risk</h4>
//                         <p className="text-gray-600">Zero-knowledge proofs ensure valid claims while maintaining privacy</p>
//                       </div>
//                     </div>
//                     <div className="flex items-start">
//                       <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#0066CC] flex items-center justify-center mt-1">
//                         <i className="fas fa-handshake text-white text-sm"></i>
//                       </div>
//                       <div className="ml-4">
//                         <h4 className="font-medium text-gray-800">Direct Hospital Relations</h4>
//                         <p className="text-gray-600">Streamlined payment channels with healthcare providers</p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="space-y-6">
//                   <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
//                     <h4 className="font-medium text-gray-800 mb-4">Setting Up Insurance Pools</h4>
//                     <ol className="space-y-3">
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">1</span>
//                         <span className="text-gray-600">Create your insurer account and verify credentials</span>
//                       </li>
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">2</span>
//                         <span className="text-gray-600">Set up premium pools and define coverage parameters</span>
//                       </li>
//                       <li className="flex items-center">
//                         <span className="w-6 h-6 rounded-full bg-[#F0F9FF] text-[#0066CC] flex items-center justify-center text-sm font-medium mr-3">3</span>
//                         <span className="text-gray-600">Connect with hospitals and activate automated claims</span>
//                       </li>
//                     </ol>
//                   </div>
//                   <Button className="w-full bg-[#0066CC] hover:bg-[#0055AA] text-white !rounded-button whitespace-nowrap">
//                     Launch Insurance Pools
//                   </Button>
//                 </div>
//               </div>
//             </TabsContent>
//           </Tabs>
//         </div>
//       </section>

//       {/* Registration Section */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-semibold text-[#0066CC] mb-4">
//               Simple Registration, Maximum Benefits
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Choose to verify your existing insurance or select new coverage with yield-earning premiums.
//             </p>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//             <Tabs defaultValue="existing" className="w-full">
//               <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
//                 <TabsList className="grid grid-cols-2 gap-4">
//                   <TabsTrigger value="existing" className="data-[state=active]:bg-white data-[state=active]:text-[#0066CC] data-[state=active]:shadow-md !rounded-button whitespace-nowrap">
//                     <i className="fas fa-id-card mr-2"></i> Have Insurance?
//                   </TabsTrigger>
//                   <TabsTrigger value="new" className="data-[state=active]:bg-white data-[state=active]:text-[#0066CC] data-[state=active]:shadow-md !rounded-button whitespace-nowrap">
//                     <i className="fas fa-plus-circle mr-2"></i> Need Coverage?
//                   </TabsTrigger>
//                 </TabsList>
//               </div>
//               <TabsContent value="existing" className="p-0">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
//                   <div className="p-8 border-r border-gray-100">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Upload Existing Insurance</h3>
//                     <p className="text-gray-600 mb-6">
//                       Verify your current insurance to start earning yield on your premiums while maintaining your existing coverage.
//                     </p>
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Insurance Provider Email</label>
//                       <div className="relative">
//                         <Input
//                           type="email"
//                           placeholder="yourinsurer@provider.com"
//                           className="pl-10 border-gray-300 focus:border-[#0066CC] focus:ring focus:ring-[#0066CC] focus:ring-opacity-20"
//                         />
//                         <i className="fas fa-envelope absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
//                       </div>
//                       <p className="mt-2 text-sm text-gray-500">We'll verify your coverage with vlayer MailProof</p>
//                     </div>
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Or Upload Insurance Card</label>
//                       <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0066CC] transition-colors cursor-pointer">
//                         <i className="fas fa-upload text-gray-400 text-2xl mb-2"></i>
//                         <p className="text-gray-500">Drag & drop your insurance card or click to browse</p>
//                       </div>
//                     </div>
//                     <Button className="w-full bg-[#0066CC] hover:bg-[#0055AA] text-white !rounded-button whitespace-nowrap">
//                       Verify & Start Earning
//                     </Button>
//                   </div>
//                   <div className="p-8 bg-[#F0F9FF]">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Benefits After Verification</h3>
//                     <div className="space-y-4">
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#10B981] flex items-center justify-center mt-0.5">
//                           <i className="fas fa-check text-white text-xs"></i>
//                         </div>
//                         <div className="ml-3">
//                           <h4 className="text-base font-medium text-gray-800">Immediate Yield Generation</h4>
//                           <p className="text-sm text-gray-600">Your premiums start earning 3-5% APY instantly</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#10B981] flex items-center justify-center mt-0.5">
//                           <i className="fas fa-check text-white text-xs"></i>
//                         </div>
//                         <div className="ml-3">
//                           <h4 className="text-base font-medium text-gray-800">Zero-Knowledge Privacy</h4>
//                           <p className="text-sm text-gray-600">Your medical data remains completely private</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#10B981] flex items-center justify-center mt-0.5">
//                           <i className="fas fa-check text-white text-xs"></i>
//                         </div>
//                         <div className="ml-3">
//                           <h4 className="text-base font-medium text-gray-800">Instant Claim Processing</h4>
//                           <p className="text-sm text-gray-600">Approved claims paid immediately to providers</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#10B981] flex items-center justify-center mt-0.5">
//                           <i className="fas fa-check text-white text-xs"></i>
//                         </div>
//                         <div className="ml-3">
//                           <h4 className="text-base font-medium text-gray-800">Gas-Free Transactions</h4>
//                           <p className="text-sm text-gray-600">All network fees covered by zkMed</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mt-8 bg-white rounded-xl p-4 shadow-sm">
//                       <div className="flex items-center justify-between mb-2">
//                         <span className="text-sm font-medium text-gray-700">Verification Progress</span>
//                         <span className="text-sm font-medium text-[#0066CC]">Step 1 of 3</span>
//                       </div>
//                       <Progress value={33} className="h-2 bg-gray-200" indicatorClassName="bg-[#0066CC]" />
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>
//               <TabsContent value="new" className="p-0">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
//                   <div className="p-8 border-r border-gray-100">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose New Coverage</h3>
//                     <p className="text-gray-600 mb-6">
//                       Select from verified insurers with transparent pricing and automatic yield generation on premiums.
//                     </p>
//                     <div className="space-y-4 mb-6">
//                       {[
//                         { name: "MedShield Plus", apy: 4.5, monthly: 250 },
//                         { name: "HealthGuard Pro", apy: 3.8, monthly: 180 },
//                         { name: "WellCare Select", apy: 4.2, monthly: 210 }
//                       ].map((plan, index) => (
//                         <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-[#0066CC] transition-colors cursor-pointer">
//                           <div className="flex justify-between items-center">
//                             <div>
//                               <h4 className="font-medium text-gray-800">{plan.name}</h4>
//                               <p className="text-sm text-gray-600">
//                                 ${plan.monthly}/month · <span className="text-[#10B981]">{plan.apy}% APY</span>
//                               </p>
//                             </div>
//                             <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
//                               {index === 0 && <div className="h-3 w-3 rounded-full bg-[#0066CC]"></div>}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                     <div className="mb-6">
//                       <label className="block text-sm font-medium text-gray-700 mb-2">Setup mUSD Payments</label>
//                       <div className="relative">
//                         <Input
//                           type="text"
//                           value="250 mUSD / month"
//                           readOnly
//                           className="pl-10 border-gray-300"
//                         />
//                         <i className="fas fa-dollar-sign absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
//                       </div>
//                       <p className="mt-2 text-sm text-gray-500">Automatic deposits to Aave V3 yield pools</p>
//                     </div>
//                     <Button className="w-full bg-[#0066CC] hover:bg-[#0055AA] text-white !rounded-button whitespace-nowrap">
//                       Confirm Selection
//                     </Button>
//                   </div>
//                   <div className="p-8 bg-[#F0F9FF]">
//                     <h3 className="text-xl font-semibold text-gray-800 mb-4">MedShield Plus Coverage Details</h3>
//                     <div className="mb-6">
//                       <div className="flex justify-between text-sm text-gray-600 mb-1">
//                         <span>Effective Premium Cost</span>
//                         <span className="font-medium">$238.75/month <span className="text-[#10B981]">(-4.5%)</span></span>
//                       </div>
//                       <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
//                         <div className="h-full bg-[#10B981]" style={{ width: '4.5%' }}></div>
//                       </div>
//                       <p className="mt-1 text-xs text-gray-500">After yield returns at current APY</p>
//                     </div>
//                     <div className="space-y-4 mb-6">
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066CC] flex items-center justify-center mt-0.5">
//                           <i className="fas fa-hospital text-white text-xs"></i>
//                         </div>
//                         <div className="ml-3">
//                           <h4 className="text-base font-medium text-gray-800">Hospital Coverage</h4>
//                           <p className="text-sm text-gray-600">100% coverage after $500 deductible</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066CC] flex items-center justify-center mt-0.5">
//                           <i className="fas fa-pills text-white text-xs"></i>
//                         </div>
//                         <div className="ml-3">
//                           <h4 className="text-base font-medium text-gray-800">Prescription Drugs</h4>
//                           <p className="text-sm text-gray-600">$15 generic / $30 brand name copay</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start">
//                         <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[#0066CC] flex items-center justify-center mt-0.5">
//                           <i className="fas fa-user-md text-white text-xs"></i>
//                         </div>
//                         <div className="ml-3">
//                           <h4 className="text-base font-medium text-gray-800">Specialist Visits</h4>
//                           <p className="text-sm text-gray-600">$35 copay per visit</p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="bg-white rounded-xl p-4 shadow-sm">
//                       <h4 className="font-medium text-gray-800 mb-2">Annual Yield Projection</h4>
//                       <div className="flex items-center justify-between text-sm">
//                         <span className="text-gray-600">Premium Total: $3,000</span>
//                         <span className="text-[#10B981] font-medium">Yield Return: ~$135</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </section>

//       {/* Technology Partners */}
//       <section className="py-20 bg-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-semibold text-[#0066CC] mb-4">
//               Powered by Leading Technology
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               zkMed integrates best-in-class blockchain solutions for security, yield, and privacy.
//             </p>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
//             <div className="flex flex-col items-center">
//               <div className="w-20 h-20 rounded-full bg-[#F0F9FF] flex items-center justify-center mb-4">
//                 <i className="fas fa-layer-group text-[#0066CC] text-3xl"></i>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-1">Mantle</h3>
//               <p className="text-sm text-gray-600 text-center">High-performance L2 blockchain</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-20 h-20 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-4">
//                 <i className="fas fa-chart-pie text-[#10B981] text-3xl"></i>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-1">Aave V3</h3>
//               <p className="text-sm text-gray-600 text-center">Secure yield generation protocol</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-20 h-20 rounded-full bg-[#F3E8FF] flex items-center justify-center mb-4">
//                 <i className="fas fa-shield-alt text-[#8B5CF6] text-3xl"></i>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-1">vlayer</h3>
//               <p className="text-sm text-gray-600 text-center">Zero-knowledge proof system</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-20 h-20 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-4">
//                 <i className="fas fa-wallet text-[#F59E0B] text-3xl"></i>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-1">thirdweb</h3>
//               <p className="text-sm text-gray-600 text-center">Gas-free transaction sponsor</p>
//             </div>
//           </div>
//           <div className="bg-[#F0F9FF] rounded-2xl p-8 shadow-md">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//               <div>
//                 <h3 className="text-2xl font-semibold text-[#0066CC] mb-4">Trusted by Healthcare Providers</h3>
//                 <p className="text-gray-600 mb-6">
//                   zkMed's platform is already integrated with leading hospitals and insurance providers, with 100% claim success rate and complete privacy protection.
//                 </p>
//                 <div className="flex flex-wrap gap-3 mb-6">
//                   <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
//                     <i className="fas fa-check-circle mr-1.5"></i> HIPAA Compliant
//                   </Badge>
//                   <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
//                     <i className="fas fa-shield-alt mr-1.5"></i> SOC 2 Certified
//                   </Badge>
//                   <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
//                     <i className="fas fa-lock mr-1.5"></i> End-to-End Encrypted
//                   </Badge>
//                   <Badge variant="outline" className="bg-white text-[#0066CC] border-[#0066CC] px-3 py-1">
//                     <i className="fas fa-code-branch mr-1.5"></i> Open Source
//                   </Badge>
//                 </div>
//                 <Button className="bg-[#0066CC] hover:bg-[#0055AA] text-white !rounded-button whitespace-nowrap">
//                   <i className="fas fa-hospital-user mr-2"></i> Provider Portal
//                 </Button>
//               </div>
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
//                   <div className="w-12 h-12 rounded-full bg-[#F0F9FF] flex items-center justify-center mb-3">
//                     <i className="fas fa-hospital text-[#0066CC] text-xl"></i>
//                   </div>
//                   <h4 className="font-medium text-gray-800 mb-1">1,200+</h4>
//                   <p className="text-sm text-gray-600">Hospitals Integrated</p>
//                 </div>
//                 <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
//                   <div className="w-12 h-12 rounded-full bg-[#ECFDF5] flex items-center justify-center mb-3">
//                     <i className="fas fa-file-medical text-[#10B981] text-xl"></i>
//                   </div>
//                   <h4 className="font-medium text-gray-800 mb-1">100%</h4>
//                   <p className="text-sm text-gray-600">Claim Success Rate</p>
//                 </div>
//                 <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
//                   <div className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center mb-3">
//                     <i className="fas fa-user-shield text-[#8B5CF6] text-xl"></i>
//                   </div>
//                   <h4 className="font-medium text-gray-800 mb-1">25,000+</h4>
//                   <p className="text-sm text-gray-600">Protected Patients</p>
//                 </div>
//                 <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center text-center">
//                   <div className="w-12 h-12 rounded-full bg-[#FEF3C7] flex items-center justify-center mb-3">
//                     <i className="fas fa-bolt text-[#F59E0B] text-xl"></i>
//                   </div>
//                   <h4 className="font-medium text-gray-800 mb-1">&lt; 5 min</h4>
//                   <p className="text-sm text-gray-600">Avg. Claim Processing</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials */}
//       <section className="py-20 bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-16">
//             <h2 className="text-3xl md:text-4xl font-semibold text-[#0066CC] mb-4">
//               What Our Users Say
//             </h2>
//             <p className="text-xl text-gray-600 max-w-3xl mx-auto">
//               Real experiences from patients, providers, and insurers using zkMed.
//             </p>
//           </div>
//           <Swiper
//             modules={swiperModules}
//             spaceBetween={24}
//             slidesPerView={1}
//             breakpoints={{
//               640: { slidesPerView: 2 },
//               1024: { slidesPerView: 3 }
//             }}
//             pagination={{ clickable: true }}
//             autoplay={{ delay: 5000 }}
//             className="pb-12"
//           >
//             {[
//               {
//                 name: "Sarah Johnson",
//                 role: "Patient",
//                 quote: "I love that my premiums are actually working for me while I'm healthy. The 4.2% APY has saved me nearly $200 this year alone.",
//                 image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20female%20healthcare%20patient%2C%2030s%2C%20friendly%20smile%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20natural%20lighting%2C%20professional%20business%20attire&width=100&height=100&seq=4&orientation=squarish"
//               },
//               {
//                 name: "Dr. Michael Chen",
//                 role: "Hospital Administrator",
//                 quote: "The instant claim payouts have transformed our cash flow. We no longer wait 30-90 days for insurance payments.",
//                 image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20an%20Asian%20male%20doctor%20in%2040s%20wearing%20white%20coat%2C%20stethoscope%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20natural%20lighting%2C%20confident%20expression&width=100&height=100&seq=5&orientation=squarish"
//               },
//               {
//                 name: "Jennifer Williams",
//                 role: "Insurance Provider",
//                 quote: "The privacy-preserving verification system has reduced our fraud cases by 92% while maintaining complete HIPAA compliance.",
//                 image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20female%20insurance%20executive%2C%2040s%2C%20business%20suit%2C%20confident%20expression%2C%20office%20background%2C%20high%20quality%20portrait%2C%20natural%20lighting&width=100&height=100&seq=6&orientation=squarish"
//               },
//               {
//                 name: "Robert Martinez",
//                 role: "Patient",
//                 quote: "The gas-free transactions and simple interface made switching to zkMed incredibly easy. I'm earning yield without any crypto knowledge.",
//                 image: "https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20latino%20male%20in%2030s%2C%20casual%20business%20attire%2C%20friendly%20smile%2C%20neutral%20background%2C%20high%20quality%20portrait%2C%20natural%20lighting&width=100&height=100&seq=7&orientation=squarish"
//               }
//             ].map((testimonial, index) => (
//               <SwiperSlide key={index}>
//                 <Card className="h-full bg-white shadow-md hover:shadow-lg transition-shadow">
//                   <div className="p-6 flex flex-col h-full">
//                     <div className="flex items-center mb-4">
//                       <Avatar className="h-12 w-12 mr-4">
//                         <AvatarImage src={testimonial.image} alt={testimonial.name} />
//                         <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
//                       </Avatar>
//                       <div>
//                         <h3 className="font-medium text-gray-800">{testimonial.name}</h3>
//                         <p className="text-sm text-gray-600">{testimonial.role}</p>
//                       </div>
//                     </div>
//                     <div className="mb-4 text-yellow-400 flex">
//                       {[...Array(5)].map((_, i) => (
//                         <i key={i} className="fas fa-star"></i>
//                       ))}
//                     </div>
//                     <p className="text-gray-600 flex-grow">"{testimonial.quote}"</p>
//                     <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
//                       <i className="fas fa-calendar-alt mr-2"></i> Verified User · June 2025
//                     </div>
//                   </div>
//                 </Card>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="py-20 bg-gradient-to-r from-[#0066CC] to-[#4A90E2] text-white">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
//           <h2 className="text-3xl md:text-4xl font-semibold mb-6">
//             Ready to Transform Your Healthcare Experience?
//           </h2>
//           <p className="text-xl text-white text-opacity-90 max-w-3xl mx-auto mb-8">
//             Join thousands of patients already earning yield on their premiums while enjoying privacy-first healthcare.
//           </p>
//           <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
//             <Button className="bg-white text-[#0066CC] hover:bg-gray-100 px-6 py-3 text-base !rounded-button whitespace-nowrap">
//               <i className="fas fa-user-plus mr-2"></i> Create Account
//             </Button>
//             <Button variant="outline" className="border-white text-white hover:bg-white hover:bg-opacity-10 px-6 py-3 text-base !rounded-button whitespace-nowrap">
//               <i className="fas fa-calculator mr-2"></i> Calculate Your Savings
//             </Button>
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
//             <div className="flex flex-col items-center">
//               <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-3">
//                 <i className="fas fa-rocket text-white text-xl"></i>
//               </div>
//               <h3 className="font-medium text-white mb-1">5 Minute Setup</h3>
//               <p className="text-sm text-white text-opacity-80">Quick registration process</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-3">
//                 <i className="fas fa-hand-holding-usd text-white text-xl"></i>
//               </div>
//               <h3 className="font-medium text-white mb-1">Immediate Yield</h3>
//               <p className="text-sm text-white text-opacity-80">Start earning from day one</p>
//             </div>
//             <div className="flex flex-col items-center">
//               <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center mb-3">
//                 <i className="fas fa-lock text-white text-xl"></i>
//               </div>
//               <h3 className="font-medium text-white mb-1">100% Private</h3>
//               <p className="text-sm text-white text-opacity-80">Zero medical data exposure</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Footer */}
//       <footer className="bg-white border-t border-gray-100">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Product</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Dashboard</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Registration</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Patient Portal</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Provider Portal</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Insurer Portal</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Technology</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Privacy</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Pools</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Proofs</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Security</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Architecture</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Documentation</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Whitepaper</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">GitHub</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">API Reference</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Audit Reports</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Community</h3>
//               <ul className="space-y-2">
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Twitter</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Discord</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Telegram</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Blog</a></li>
//                 <li><a href="#" className="text-gray-600 hover:text-[#0066CC]">Forum</a></li>
//               </ul>
//             </div>
//           </div>
//           <Separator className="mb-8" />
//           <div className="flex flex-col md:flex-row justify-between items-center">
//             <div className="mb-4 md:mb-0">
//               <a href="#" className="text-xl font-bold text-[#0066CC]">zkMed</a>
//               <p className="text-sm text-gray-600 mt-1">
//                 Privacy-Preserving Healthcare with Yield
//               </p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <div className="text-sm text-gray-600">
//                 Built on <span className="font-medium">Mantle</span> | Powered by <span className="font-medium">Aave V3</span>
//               </div>
//               <div className="flex space-x-2">
//                 <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0066CC] hover:text-white transition-colors">
//                   <i className="fab fa-twitter"></i>
//                 </a>
//                 <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0066CC] hover:text-white transition-colors">
//                   <i className="fab fa-discord"></i>
//                 </a>
//                 <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0066CC] hover:text-white transition-colors">
//                   <i className="fab fa-github"></i>
//                 </a>
//               </div>
//             </div>
//           </div>
//           <div className="mt-8 text-center text-sm text-gray-500">
//             &copy; 2025 zkMed. All rights reserved. <a href="#" className="text-[#0066CC]">Privacy Policy</a> · <a href="#" className="text-[#0066CC]">Terms of Service</a>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default App;

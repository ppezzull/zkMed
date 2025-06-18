export default function CompanyInfo() {
  return (
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
  );
}

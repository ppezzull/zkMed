export default function NetworkStatus() {
  return (
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
  );
}

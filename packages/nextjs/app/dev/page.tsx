import ChainStats from "@/components/chain-stats";
import WalletConnect from "@/components/wallet-connect";
import WalletFunding from "@/components/wallet-funding";
import GreetingDemo from "@/components/greeting-demo";

export default function DevPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#0066CC] mb-4">
            🛠️ Development Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Development tools and blockchain interaction components for zkMed platform testing
          </p>
        </div>

        <div className="space-y-8">
          {/* Network Stats */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              🌐 Network Information
            </h2>
            <ChainStats />
          </div>
          
          {/* Wallet Authentication */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              👛 Wallet Connection
            </h2>
            <WalletConnect />
          </div>

          {/* Wallet Funding (Local Development) */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              💰 Local Development Funding
            </h2>
            <WalletFunding />
          </div>

          {/* Greeting Contract Demo */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📝 Smart Contract Interaction
            </h2>
            <GreetingDemo />
          </div>

          {/* Development Resources */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              📚 Development Resources
            </h2>
            <div className="bg-white rounded-xl p-6 shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">🚀 Quick Start Resources</h3>
              <p className="text-gray-600 mb-6">
                Essential documentation and tools for zkMed platform development
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="https://portal.thirdweb.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  <div className="text-2xl">📚</div>
                  <div>
                    <h4 className="font-medium text-blue-800">thirdweb Docs</h4>
                    <p className="text-sm text-blue-600">Smart wallet integration</p>
                  </div>
                </a>
                <a
                  href="https://docs.vlayer.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <div className="text-2xl">🔍</div>
                  <div>
                    <h4 className="font-medium text-purple-800">vlayer Docs</h4>
                    <p className="text-sm text-purple-600">Zero-knowledge proofs</p>
                  </div>
                </a>
                <a
                  href="https://docs.mantle.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-colors"
                >
                  <div className="text-2xl">⛓️</div>
                  <div>
                    <h4 className="font-medium text-green-800">Mantle Docs</h4>
                    <p className="text-sm text-green-600">L2 blockchain network</p>
                  </div>
                </a>
              </div>
              
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">⚠️ Development Mode</h4>
                <p className="text-sm text-yellow-700">
                  This page is for development and testing purposes. All transactions use testnet tokens 
                  and smart contracts are deployed on Anvil local network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
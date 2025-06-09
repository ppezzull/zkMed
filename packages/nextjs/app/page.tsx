import Image from "next/image";
import WalletConnect from "@/components/wallet-connect";
import ChainStats from "@/components/chain-stats";
import WalletFunding from "@/components/wallet-funding";
import GreetingDemo from "@/components/greeting-demo";

export default function Home() {
  return (
    <div className="min-h-screen p-8 pb-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Image
            className="dark:invert mx-auto"
            src="/next.svg"
            alt="zkMed logo"
            width={180}
            height={38}
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900">zkMed</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Privacy-preserving healthcare platform with zero-knowledge proofs and smart wallets on Mantle
          </p>
        </div>

        {/* Network Stats */}
        <ChainStats />
        
        {/* Wallet Authentication */}
        <WalletConnect />

        {/* Wallet Funding (Local Development) */}
        <WalletFunding />

        {/* Greeting Contract Demo */}
        <GreetingDemo />

        {/* Quick Start Guide */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">🚀 Quick Start</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Connect your wallet using smart wallet abstraction</li>
            <li>Interact with the greeting contract using gasless transactions</li>
            <li>Experience the power of account abstraction on Mantle</li>
          </ol>
          
          <div className="mt-4 flex gap-3 flex-wrap">
            <a
              href="https://portal.thirdweb.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              📚 thirdweb Docs
            </a>
            <a
              href="https://docs.vlayer.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              🔍 vlayer Docs
            </a>
            <a
              href="https://docs.mantle.xyz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              ⛓️ Mantle Docs
            </a>
          </div>
        </div>
      </main>
      
      <footer className="mt-16 text-center text-gray-500 text-sm">
        <p>Built with thirdweb, vlayer, and Mantle blockchain</p>
      </footer>
    </div>
  );
}

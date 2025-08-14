"use client";

import type { NextPage } from "next";
import { BackgroundPaths } from "~~/components/ui/background-paths";

const Home: NextPage = () => {
  return (
    <>
      {/* Main Content - Single Section */}
      <main className="relative bg-slate-900 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <BackgroundPaths />
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-start justify-start min-h-[calc(100vh-4rem)] px-4 pt-28 md:pt-36 pb-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold text-white mb-4">
              Privacy-Preserving
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                Healthcare
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-300 mb-6 leading-relaxed">
              Secure patient data with zero-knowledge proofs while earning
              <span className="text-cyan-300 font-semibold"> DeFi yield</span> on healthcare payments
            </p>

            {/* Description */}
            <div className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
              <p className="mb-3">
                zkMed revolutionizes healthcare by combining privacy-preserving technology with decentralized finance.
                Patients control their data, providers verify credentials instantly, and everyone benefits from
                transparent, secure transactions.
              </p>
              <p>Experience the future of healthcare where privacy meets profitability.</p>
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/register"
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 shadow-lg text-center"
              >
                Register Now
              </a>
              <button className="px-6 py-3 border border-gray-500 text-gray-300 font-semibold rounded-lg hover:border-gray-400 hover:text-white transition-all duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Product Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/dashboard" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/registration" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Registration
                </Link>
              </li>
              <li>
                <Link href="/patient-portal" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Patient Portal
                </Link>
              </li>
              <li>
                <Link href="/provider-portal" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Provider Portal
                </Link>
              </li>
              <li>
                <Link href="/insurer-portal" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Insurer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Technology</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Privacy Architecture
                </Link>
              </li>
              <li>
                <Link href="/pools" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Pool Mechanics
                </Link>
              </li>
              <li>
                <Link href="/contracts" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Smart Contracts
                </Link>
              </li>
              <li>
                <Link href="/proofs" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Multi-Proof System
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Security
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/whitepaper" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Whitepaper
                </Link>
              </li>
              <li>
                <a 
                  href="https://github.com/zkmed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#0066CC] transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <Link href="/api" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/audits" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Audit Reports
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Community</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://twitter.com/zkmed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#0066CC] transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/zkmed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#0066CC] transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="https://t.me/zkmed" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#0066CC] transition-colors"
                >
                  Telegram
                </a>
              </li>
              <li>
                <Link href="/blog" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-600 hover:text-[#0066CC] transition-colors">
                  Forum
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="mb-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link href="/" className="text-xl font-bold text-[#0066CC]">
              zkMed
            </Link>
            <p className="text-sm text-gray-600 mt-1">
              Privacy-Preserving Healthcare with Yield
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Built on <span className="font-medium text-[#0066CC]">Mantle</span> | 
              Powered by <span className="font-medium text-[#10B981]">Aave V3</span>
            </div>
            <div className="flex space-x-2">
              <a 
                href="https://twitter.com/zkmed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0066CC] hover:text-white transition-colors"
              >
                𝕏
              </a>
              <a 
                href="https://discord.gg/zkmed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0066CC] hover:text-white transition-colors"
              >
                💬
              </a>
              <a 
                href="https://github.com/zkmed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#0066CC] hover:text-white transition-colors"
              >
                🐙
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; 2025 zkMed. All rights reserved. 
          <Link href="/privacy-policy" className="text-[#0066CC] ml-2 hover:underline">
            Privacy Policy
          </Link>
          ·
          <Link href="/terms" className="text-[#0066CC] ml-2 hover:underline">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
} 
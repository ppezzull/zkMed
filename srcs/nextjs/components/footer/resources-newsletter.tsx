import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResourcesNewsletter() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-6">Resources</h3>
      <ul className="space-y-4 mb-8">
        <li>
          <Link href="/docs" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
            <span className="mr-2">📚</span>
            Documentation
          </Link>
        </li>
        <li>
          <Link href="/security" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
            <span className="mr-2">🛡️</span>
            Security Design
          </Link>
        </li>
        <li>
          <Link href="/privacy" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
            <span className="mr-2">🔐</span>
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link href="/terms" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
            <span className="mr-2">📋</span>
            Terms of Service
          </Link>
        </li>
        <li>
          <Link href="/support" className="text-slate-300 hover:text-purple-400 transition-colors flex items-center">
            <span className="mr-2">💬</span>
            Support Center
          </Link>
        </li>
      </ul>

      {/* Newsletter Signup */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
        <h4 className="text-sm font-semibold text-white mb-3">Development Updates</h4>
        <p className="text-xs text-slate-400 mb-4">
          Get notified about testnet progress and launch preparations.
        </p>
        <div className="flex space-x-2">
          <Input 
            type="email" 
            placeholder="your@email.com" 
            className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 text-sm flex-1"
          />
          <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-3">
            ✓
          </Button>
        </div>
      </div>
    </div>
  );
}

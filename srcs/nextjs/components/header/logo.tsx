'use client';

import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
          <span className="text-white text-lg font-bold">⚕️</span>
        </div>
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
          <span className="text-indigo-600">zk</span>Med
        </div>
        <div className="text-xs text-slate-500 -mt-1">Global Healthcare Platform</div>
      </div>
    </Link>
  );
}

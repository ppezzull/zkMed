import Link from 'next/link';

export default function PlatformLinks() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-6">Platform</h3>
      <ul className="space-y-4">
        <li>
          <Link href="/" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
            <span className="mr-2">🏠</span>
            Home
          </Link>
        </li>
        <li>
          <Link href="/dashboard" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
            <span className="mr-2">📊</span>
            Dashboard
          </Link>
        </li>
        <li>
          <Link href="/claims" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
            <span className="mr-2">🏥</span>
            Claims Portal
          </Link>
        </li>
        <li>
          <Link href="/pool" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
            <span className="mr-2">💰</span>
            Pool Analytics
          </Link>
        </li>
        <li>
          <Link href="/governance" className="text-slate-300 hover:text-indigo-400 transition-colors flex items-center">
            <span className="mr-2">🗳️</span>
            Governance
          </Link>
        </li>
      </ul>
    </div>
  );
}

import Link from 'next/link';

export default function SolutionsLinks() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-6">Solutions</h3>
      <ul className="space-y-4">
        <li>
          <Link href="/patients" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
            <span className="mr-2">👥</span>
            For Patients
          </Link>
        </li>
        <li>
          <Link href="/hospitals" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
            <span className="mr-2">🏥</span>
            For Hospitals
          </Link>
        </li>
        <li>
          <Link href="/insurers" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
            <span className="mr-2">🏢</span>
            For Insurers
          </Link>
        </li>
        <li>
          <Link href="/admins" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
            <span className="mr-2">⚙️</span>
            zkMed Team
          </Link>
        </li>
        <li>
          <Link href="/integration" className="text-slate-300 hover:text-emerald-400 transition-colors flex items-center">
            <span className="mr-2">🔗</span>
            API Integration
          </Link>
        </li>
      </ul>
    </div>
  );
}

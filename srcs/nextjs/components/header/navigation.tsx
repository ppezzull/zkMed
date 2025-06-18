'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Navigation() {
  const router = useRouter();

  return (
    <nav className="flex items-center space-x-6 mr-6">
      <Link href="/" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
        Platform
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="text-slate-700 hover:text-indigo-600 font-medium transition-colors flex items-center space-x-1">
          <span>Solutions</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => router.push('/patients')}>👥 For Patients</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/hospitals')}>🏥 For Hospitals</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/insurers')}>🏢 For Insurers</DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/admins')}>⚙️ For Administrators</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Link href="/privacy" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
        Privacy
      </Link>
      <Link href="/docs" className="text-slate-700 hover:text-indigo-600 font-medium transition-colors">
        Docs
      </Link>
    </nav>
  );
}

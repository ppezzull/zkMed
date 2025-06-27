'use client';

import { useRouter } from 'next/navigation';
import AdminRequest from '@/components/register/admin-request';

export default function AdminPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/register/role-selection');
  };

  return <AdminRequest onBack={handleBack} />;
} 
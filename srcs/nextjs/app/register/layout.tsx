import VlayerProvider from '@/components/providers/vlayer-provider';
import { isLoggedIn } from '@/lib/actions/auth';
import { redirect } from 'next/navigation';

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export default async function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <VlayerProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              zkMed Registration
            </h1>
            <p className="text-lg text-gray-600">
              Secure healthcare registration with blockchain verification
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {children}
            </div>
          </div>

          {/* Registration Information */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Registration Information
              </h3>
              <div className="space-y-2 text-sm text-blue-700">
                <p>• <strong>Patients:</strong> Registration with email verification</p>
                <p>• <strong>Hospitals:</strong> Domain ownership verification required</p>
                <p>• <strong>Insurance Companies:</strong> Domain ownership verification required</p>
                <p>• All registrations use cryptographic MailProof verification</p>
                <p>• Organization registrations require admin approval</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </VlayerProvider>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useActiveAccount } from 'thirdweb/react';
import { useRouter } from 'next/navigation';
import { useVerifier } from '@/hooks/useVerifier';
import { useProver } from '@/hooks/useProver';
import { UserType, RegistrationData } from '@/utils/types/healthcare';

interface VerifyRegistrationProps {
  role: 'PATIENT' | 'HOSPITAL' | 'INSURER';
  emlContent: string;
  organizationName?: string;
  onBack: () => void;
}

export default function VerifyRegistration({ role, emlContent, organizationName, onBack }: VerifyRegistrationProps) {
  const account = useActiveAccount();
  const router = useRouter();
  const verifier = useVerifier();
  const prover = useProver();
  
  const [currentStep, setCurrentStep] = useState<string>('Generating proof...');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (account?.address && emlContent) {
      handleVerification();
    }
  }, [account?.address, emlContent]);

  const handleVerification = async () => {
    if (!account?.address) return;

    try {
      setCurrentStep('Parsing email content...');
      
      // Create registration data based on role
      const registrationData: RegistrationData = {
        requestedRole: role === 'PATIENT' ? UserType.PATIENT : 
                     role === 'HOSPITAL' ? UserType.HOSPITAL : UserType.INSURER,
        walletAddress: account.address,
        domain: organizationName ? extractDomainFromEmail(emlContent) : '',
        organizationName: organizationName || '',
        emailHash: generateEmailHash(emlContent)
      };

      setCurrentStep('Generating cryptographic proof...');
      
      // Generate proof based on role
      let proof;
      if (role === 'PATIENT') {
        proof = await prover.generatePatientProof(emlContent);
      } else {
        proof = await prover.generateOrganizationProof(emlContent);
      }

      if (!proof) {
        throw new Error('Failed to generate proof');
      }

      setCurrentStep('Submitting to blockchain...');
      
      // Verify proof on-chain based on role
      let result;
      if (role === 'PATIENT') {
        result = await verifier.verifyPatientProof(proof, registrationData);
      } else {
        result = await verifier.verifyOrganizationProof(proof, registrationData);
      }

      if (result) {
        setCurrentStep('Registration completed successfully!');
        setIsComplete(true);
        
        // Redirect after success
        setTimeout(() => {
          switch (role) {
            case 'PATIENT':
              router.push(`/patient/${account.address}`);
              break;
            case 'HOSPITAL':
              router.push(`/hospital/${account.address}`);
              break;
            case 'INSURER':
              router.push(`/insurance/${account.address}`);
              break;
          }
        }, 2000);
      }
    } catch (error: any) {
      setCurrentStep(`Error: ${error.message || 'Registration failed'}`);
    }
  };

  const extractDomainFromEmail = (emlContent: string): string => {
    // Extract domain from the From header
    const fromMatch = emlContent.match(/From:.*?@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    return fromMatch ? fromMatch[1] : '';
  };

  const generateEmailHash = (emlContent: string): `0x${string}` => {
    // Extract the From email address for hashing
    const fromMatch = emlContent.match(/From:.*?([^\s<>]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
    const emailAddress = fromMatch ? fromMatch[1] : '';
    
    // In a real implementation, you'd use a proper hashing function
    // For now, we'll create a mock hash
    const hash = Array.from(emailAddress)
      .reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff, 0)
      .toString(16)
      .padStart(64, '0');
    
    return `0x${hash}` as `0x${string}`;
  };

  const getSuccessMessage = () => {
    if (role === 'PATIENT') {
      return 'Your patient registration has been completed successfully!';
    } else {
      return 'Your organization registration has been submitted for admin approval.';
    }
  };

  if (!account?.address) {
    return <div>Connect your wallet to continue</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Join zkMed</h1>
              <p className="text-gray-600">Complete your registration to access healthcare services</p>
            </div>
            {!isComplete && (
              <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Choose Role</span>
            </div>
            
            {role !== 'PATIENT' && (
              <>
                <div className="w-8 h-0.5 bg-gray-300"></div>
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                    ✓
                  </div>
                  <span className="text-sm font-medium">Organization Details</span>
                </div>
              </>
            )}

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Email Verification</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Email Received</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className={`flex items-center space-x-2 ${isComplete ? 'text-green-600' : 'text-blue-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isComplete ? 'bg-green-100' : 'bg-blue-100'}`}>
                {isComplete ? '✓' : (role === 'PATIENT' ? '4' : '5')}
              </div>
              <span className="text-sm font-medium">Verify Registration</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            {isComplete ? (
              <>
                <div className="text-green-600 text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold text-green-800 mb-4">Success!</h2>
                <p className="text-gray-600 mb-4">
                  {getSuccessMessage()}
                </p>
                <p className="text-sm text-gray-500">
                  Redirecting you to your dashboard...
                </p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">Verifying Registration</h2>
                
                <div className="mb-6">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-lg font-semibold mb-2">{currentStep}</p>
                  <p className="text-gray-600 text-sm">
                    Please wait while we process your registration...
                  </p>
                </div>

                {(verifier.error || prover.error) && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Registration Error</h3>
                    <p className="text-red-700 text-sm">{verifier.error || prover.error}</p>
                    <button
                      onClick={onBack}
                      className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Go Back
                    </button>
                  </div>
                )}

                <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
                  <h3 className="font-semibold text-blue-800 mb-2">What's happening?</h3>
                  <ul className="text-sm text-blue-700 space-y-1 text-left">
                    <li>• Generating cryptographic proof from your email</li>
                    <li>• Submitting proof to the zkMed smart contract</li>
                    <li>• Registering your {role.toLowerCase()} account on-chain</li>
                    {role !== 'PATIENT' && (
                      <li>• Your registration will be pending admin approval</li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PatientRecord } from '@/utils/types/healthcare';
import { usePatient } from '@/hooks/usePatient';
import { useActiveAccount } from 'thirdweb/react';

interface PatientDashboardProps {
  initialData: {
    patientRecord: PatientRecord | null;
    userVerification: any;
    walletAddress: string;
  };
}

export default function PatientDashboard({ initialData }: PatientDashboardProps) {
  const account = useActiveAccount();
  const patient = usePatient();
  
  const [registrationStep, setRegistrationStep] = useState<'email' | 'submit'>('email');
  const [emailContent, setEmailContent] = useState('');
  const [walletAddress, setWalletAddress] = useState(account?.address || '');

  useEffect(() => {
    if (account?.address) {
      setWalletAddress(account.address);
    }
  }, [account]);

  const handleRegisterPatient = async () => {
    if (!emailContent.trim() || !walletAddress.trim()) {
      alert('Please provide both email content and wallet address');
      return;
    }

    try {
      await patient.registerPatient(emailContent, walletAddress);
      // Refresh page after successful registration
      window.location.reload();
    } catch (error) {
      console.error('Registration error:', error);
    }
  };

  if (!account) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600">
            Please connect your wallet to access the patient dashboard.
          </p>
        </div>
      </div>
    );
  }

  // If patient is already registered
  if (initialData.patientRecord && initialData.patientRecord.base.isActive) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Patient Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your healthcare information</p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Registration Status</CardTitle>
              <CardDescription>Your patient registration details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="default" className="bg-green-600">
                    Active Patient
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wallet Address</p>
                  <p className="font-mono text-sm">{initialData.patientRecord.base.walletAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Registration Date</p>
                  <p className="text-sm">
                    {initialData.patientRecord.base.registrationTime 
                      ? new Date(Number(initialData.patientRecord.base.registrationTime) * 1000).toLocaleDateString()
                      : 'Unknown'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Healthcare Services</CardTitle>
              <CardDescription>Access your healthcare services and records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-4">🏥</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Healthcare Services</h3>
                <p className="text-gray-500 mb-4">
                  Healthcare service features will be available soon.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Registration flow
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Patient Registration</h1>
        <p className="text-gray-600 mt-2">Register as a patient to access healthcare services</p>
      </div>

      {patient.error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{patient.error}</p>
        </div>
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Patient Registration</CardTitle>
          <CardDescription>
            Complete your patient registration with email verification
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {patient.registrationStep && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700">{patient.registrationStep}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Address
              </label>
              <Input
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
                disabled={!!account?.address}
              />
              <p className="text-xs text-gray-500 mt-1">
                {account?.address ? 'Using connected wallet address' : 'Enter your wallet address'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Proof Content
              </label>
              <textarea
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                placeholder="Paste your email content here for verification..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Paste the email content that contains your registration request
              </p>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={handleRegisterPatient}
              disabled={patient.isRegistering || !emailContent.trim() || !walletAddress.trim()}
              className="flex-1"
            >
              {patient.isRegistering ? 'Registering...' : 'Register as Patient'}
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              By registering, you agree to our terms of service and privacy policy.
              Your email will be cryptographically verified using vlayer technology.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 
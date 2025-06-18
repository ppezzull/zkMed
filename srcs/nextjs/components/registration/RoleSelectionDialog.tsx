'use client';

import { useState } from 'react';
import { UserType } from '@/utils/types/healthcare';

interface RoleSelectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: 'PATIENT' | 'HOSPITAL' | 'INSURER') => void;
  loading: boolean;
}

export function RoleSelectionDialog({ 
  isOpen, 
  onClose, 
  onSelectRole, 
  loading 
}: RoleSelectionDialogProps) {
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'HOSPITAL' | 'INSURER' | null>(null);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (selectedRole) {
      onSelectRole(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome to zkMed
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Please select your role to get started:
        </p>

        <div className="space-y-4">
          {/* Patient Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === 'PATIENT' 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('PATIENT')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="patient"
                name="role"
                checked={selectedRole === 'PATIENT'}
                onChange={() => setSelectedRole('PATIENT')}
                className="mr-3"
              />
              <div>
                <label htmlFor="patient" className="font-semibold text-lg cursor-pointer">
                  Patient
                </label>
                <p className="text-gray-600 text-sm">
                  Access your medical records and manage healthcare data
                </p>
              </div>
            </div>
          </div>

          {/* Hospital Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === 'HOSPITAL' 
                ? 'border-green-500 bg-green-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('HOSPITAL')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="hospital"
                name="role"
                checked={selectedRole === 'HOSPITAL'}
                onChange={() => setSelectedRole('HOSPITAL')}
                className="mr-3"
              />
              <div>
                <label htmlFor="hospital" className="font-semibold text-lg cursor-pointer">
                  Hospital
                </label>
                <p className="text-gray-600 text-sm">
                  Manage patient records and medical data as a healthcare provider
                </p>
              </div>
            </div>
          </div>

          {/* Insurer Option */}
          <div 
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
              selectedRole === 'INSURER' 
                ? 'border-purple-500 bg-purple-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedRole('INSURER')}
          >
            <div className="flex items-center">
              <input
                type="radio"
                id="insurer"
                name="role"
                checked={selectedRole === 'INSURER'}
                onChange={() => setSelectedRole('INSURER')}
                className="mr-3"
              />
              <div>
                <label htmlFor="insurer" className="font-semibold text-lg cursor-pointer">
                  Insurance Company
                </label>
                <p className="text-gray-600 text-sm">
                  Process claims and manage insurance policies
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading}
          >
            Cancel
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedRole && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
} 
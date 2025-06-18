'use client';

import { useState } from 'react';

interface OrganizationNameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (name: string) => void;
  organizationType: 'HOSPITAL' | 'INSURER';
  loading: boolean;
}

export function OrganizationNameDialog({ 
  isOpen, 
  onClose, 
  onContinue, 
  organizationType,
  loading 
}: OrganizationNameDialogProps) {
  const [organizationName, setOrganizationName] = useState('');

  if (!isOpen) return null;

  const handleContinue = () => {
    if (organizationName.trim()) {
      onContinue(organizationName.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && organizationName.trim()) {
      handleContinue();
    }
  };

  const getPlaceholder = () => {
    return organizationType === 'HOSPITAL' 
      ? 'e.g., City General Hospital'
      : 'e.g., HealthCare Insurance Group';
  };

  const getTitle = () => {
    return organizationType === 'HOSPITAL' 
      ? 'Hospital Registration'
      : 'Insurance Company Registration';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6">
          {getTitle()}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          Enter your organization name to begin the verification process:
        </p>

        <div className="mb-6">
          <label 
            htmlFor="organizationName" 
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Organization Name
          </label>
          <input
            type="text"
            id="organizationName"
            value={organizationName}
            onChange={(e) => setOrganizationName(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={getPlaceholder()}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="text-xs text-gray-500 mt-1">
            This name will be verified through your organization's email domain
          </p>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading}
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!organizationName.trim() || loading}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              organizationName.trim() && !loading
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
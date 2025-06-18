'use client';

import { useState } from 'react';

interface CollectEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitEmail: (emlContent: string) => void;
  organizationType: 'HOSPITAL' | 'INSURER';
  loading: boolean;
  currentStep: string;
}

export function CollectEmailDialog({ 
  isOpen, 
  onClose, 
  onSubmitEmail, 
  organizationType,
  loading,
  currentStep
}: CollectEmailDialogProps) {
  const [emlContent, setEmlContent] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (emlContent.trim()) {
      onSubmitEmail(emlContent.trim());
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setEmlContent(content);
      };
      reader.readAsText(file);
    }
  };

  const getTitle = () => {
    return organizationType === 'HOSPITAL' 
      ? 'Verify Hospital Email'
      : 'Verify Insurance Company Email';
  };

  const getInstructions = () => {
    return organizationType === 'HOSPITAL' 
      ? 'Paste the complete email content (including headers) that you sent from your hospital\'s email address.'
      : 'Paste the complete email content (including headers) that you sent from your insurance company\'s email address.';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          {getTitle()}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {getInstructions()}
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Email Content (.eml format)
            </label>
            <label className="cursor-pointer bg-blue-100 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors text-sm">
              Upload .eml file
              <input
                type="file"
                accept=".eml,.txt"
                onChange={handleFileUpload}
                className="hidden"
                disabled={loading}
              />
            </label>
          </div>
          
          <textarea
            value={emlContent}
            onChange={(e) => setEmlContent(e.target.value)}
            placeholder="Paste the complete email content here, including all headers (Return-Path, Received, From, To, Subject, etc.)..."
            className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            disabled={loading}
          />
          
          <p className="text-xs text-gray-500 mt-2">
            Make sure to include the complete email source with all headers. In most email clients, you can find this option as "Show Original", "View Source", or "Show Raw Message".
          </p>
        </div>

        {/* Progress indicator */}
        {loading && (
          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-blue-700 font-medium">{currentStep}</span>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <h3 className="font-semibold text-yellow-800 mb-2">How to get email source:</h3>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li><strong>Gmail:</strong> Open email → Three dots menu → "Show original"</li>
            <li><strong>Outlook:</strong> Open email → File → Properties → "Internet headers"</li>
            <li><strong>Apple Mail:</strong> Open email → View → Message → "Raw Source"</li>
            <li><strong>Thunderbird:</strong> Open email → View → "Message Source"</li>
          </ul>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            disabled={loading}
          >
            Back
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={!emlContent.trim() || loading}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              emlContent.trim() && !loading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Processing...' : 'Submit Email'}
          </button>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useState } from 'react';

interface SendEmailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailSent: () => void;
  organizationType: 'HOSPITAL' | 'INSURER';
  organizationName: string;
  walletAddress: string;
  uniqueEmail: string;
}

export function SendEmailDialog({ 
  isOpen, 
  onClose, 
  onEmailSent, 
  organizationType,
  organizationName,
  walletAddress,
  uniqueEmail
}: SendEmailDialogProps) {
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen) return null;

  const subject = `Register organization ${organizationName} as ${organizationType} with wallet: ${walletAddress}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleEmailSent = () => {
    setEmailSent(true);
    onEmailSent();
  };

  const getInstructions = () => {
    return organizationType === 'HOSPITAL' 
      ? 'Send this email from your hospital\'s official email address to verify domain ownership.'
      : 'Send this email from your insurance company\'s official email address to verify domain ownership.';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          Send Verification Email
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {getInstructions()}
        </p>

        <div className="space-y-4">
          {/* Email To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={uniqueEmail}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
              <button
                onClick={() => copyToClipboard(uniqueEmail)}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Email Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject:
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={subject}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
              />
              <button
                onClick={() => copyToClipboard(subject)}
                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Email Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Body (optional):
            </label>
            <textarea
              readOnly
              value={`Hello,

I am requesting to register ${organizationName} as a verified ${organizationType.toLowerCase()} in the zkMed healthcare system.

Please process this registration request for wallet address: ${walletAddress}

Thank you.`}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm h-32 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-800 mb-2">Important:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Send this email from your organization's official email domain</li>
            <li>• The email domain will be used to verify your organization</li>
            <li>• Keep the subject line exactly as shown</li>
            <li>• The email body can be customized as needed</li>
          </ul>
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleEmailSent}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            I've Sent the Email
          </button>
        </div>
      </div>
    </div>
  );
} 
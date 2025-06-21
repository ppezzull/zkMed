import { InputWithCopy } from './ui/InputWithCopy';

interface SendEmailProps {
  uniqueEmail: string;
  subject: string;
  organizationName: string;
  organizationType: 'HOSPITAL' | 'INSURER' | null;
  onEmailSent: () => void;
  onBack: () => void;
}

export const SendEmailPresentational = ({ 
  uniqueEmail, 
  subject, 
  organizationName,
  organizationType,
  onEmailSent, 
  onBack 
}: SendEmailProps) => {
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
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back
            </button>
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
            
            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Organization Details</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                3
              </div>
              <span className="text-sm font-medium">Email Verification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Send Verification Email</h2>
            <p className="text-gray-600 mb-6">
              Send an email from your organization's official email address to verify domain ownership.
            </p>
            
            <div className="space-y-4 max-w-2xl mx-auto">
              <InputWithCopy label="To" value={uniqueEmail} />
              <InputWithCopy label="Subject" value={subject} />
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg max-w-2xl mx-auto">
              <h3 className="font-semibold text-blue-800 mb-2">Important:</h3>
              <ul className="text-sm text-blue-700 space-y-1 text-left">
                <li>• Send this email from your organization's official email domain</li>
                <li>• The email domain will be used to verify your organization</li>
                <li>• Keep the subject line exactly as shown</li>
                <li>• The email body can be customized as needed</li>
              </ul>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={onEmailSent}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                I've Sent the Email
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
interface PatientEmailProps {
  email: string;
  setEmail: (email: string) => void;
  onSubmit: (email: string) => void;
  onBack: () => void;
  error: string | null;
}

export const PatientEmailPresentational = ({ 
  email, 
  setEmail, 
  onSubmit, 
  onBack, 
  error 
}: PatientEmailProps) => {
  const handleSubmit = () => {
    if (email.trim()) {
      onSubmit(email.trim());
    }
  };

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
            
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                2
              </div>
              <span className="text-sm font-medium">Enter Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Patient Registration</h2>
            <p className="text-gray-600 mb-6">
              Enter your email address to complete your patient registration:
            </p>

            <div className="mb-6 text-left">
              <label htmlFor="patientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="patientEmail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., john.doe@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && email.trim()) {
                    handleSubmit();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                This email will be hashed and stored securely for verification purposes
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Back
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={!email.trim()}
                className={`px-6 py-2 rounded-lg transition-colors ${
                  email.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Register as Patient
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
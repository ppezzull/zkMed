interface RoleSelectionProps {
  onRoleSelect: (role: 'PATIENT' | 'HOSPITAL' | 'INSURER') => void;
  onBack: () => void;
}

export const RoleSelectionPresentational = ({ onRoleSelect, onBack }: RoleSelectionProps) => {
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
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                1
              </div>
              <span className="text-sm font-medium">Choose Role</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Choose Your Role</h2>
            <p className="text-gray-600 mb-8">Please select your role to get started with zkMed</p>
            
            <div className="space-y-4 max-w-md mx-auto">
              {/* Patient Option */}
              <button
                onClick={() => onRoleSelect('PATIENT')}
                className="w-full border-2 border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">👤</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Patient</h3>
                    <p className="text-gray-600 text-sm">Access your medical records and manage healthcare data</p>
                  </div>
                </div>
              </button>

              {/* Hospital Option */}
              <button
                onClick={() => onRoleSelect('HOSPITAL')}
                className="w-full border-2 border-gray-200 rounded-lg p-6 hover:border-green-500 hover:bg-green-50 transition-all text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🏥</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Hospital</h3>
                    <p className="text-gray-600 text-sm">Manage patient records and medical data as a healthcare provider</p>
                  </div>
                </div>
              </button>

              {/* Insurer Option */}
              <button
                onClick={() => onRoleSelect('INSURER')}
                className="w-full border-2 border-gray-200 rounded-lg p-6 hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Insurance Company</h3>
                    <p className="text-gray-600 text-sm">Process claims and manage insurance policies</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
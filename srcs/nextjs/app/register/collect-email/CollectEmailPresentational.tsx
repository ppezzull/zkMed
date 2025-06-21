interface CollectEmailProps {
  onSubmit: (emlContent: string) => void;
  onBack: () => void;
  error: string | null;
  loading: boolean;
}

export const CollectEmailPresentational = ({ 
  onSubmit, 
  onBack, 
  error, 
  loading 
}: CollectEmailProps) => {
  const handleSubmit = () => {
    const textarea = document.getElementById('emlContent') as HTMLTextAreaElement;
    if (textarea?.value.trim()) {
      onSubmit(textarea.value.trim());
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
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Organization Details</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-100">
                ✓
              </div>
              <span className="text-sm font-medium">Email Verification</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300"></div>
            
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">
                4
              </div>
              <span className="text-sm font-medium">Submit Proof</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Submit Email Proof</h2>
            <p className="text-gray-600 mb-6">
              Paste the complete email content (including headers) that you sent from your organization's email address.
            </p>
            
            <div className="text-left max-w-4xl mx-auto">
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
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const content = event.target?.result as string;
                            const textarea = document.getElementById('emlContent') as HTMLTextAreaElement;
                            if (textarea) {
                              textarea.value = content;
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
                
                <textarea
                  id="emlContent"
                  placeholder="Paste the complete email content here, including all headers (Return-Path, Received, From, To, Subject, etc.)..."
                  className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                />
                
                <p className="text-xs text-gray-500 mt-2">
                  Make sure to include the complete email source with all headers. In most email clients, you can find this option as "Show Original", "View Source", or "Show Raw Message".
                </p>
              </div>

              {loading && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 font-medium">Processing email proof...</span>
                  </div>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
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
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                Back
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Submit Email'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 
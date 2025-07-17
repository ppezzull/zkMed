import { NextPage } from "next";
import SendContractForm from "~~/components/insurance/send-contract-form";

const SendContractPage: NextPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Send Insurance Contract</h1>
              <p className="text-slate-300">Send a new insurance contract to a registered patient</p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="/insurance"
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                ← Back to Dashboard
              </a>
            </div>
          </div>
        </div>

        {/* Send Contract Form */}
        <SendContractForm />
      </div>
    </main>
  );
};

export default SendContractPage;

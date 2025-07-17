"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  Shield,
  Upload,
  Wallet,
} from "lucide-react";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";

interface ContractDetails {
  id: string;
  insuranceCompany: string;
  duration: number;
  monthlyRate: number;
  totalValue: number;
  startDate: string;
  endDate: string;
  firstPayment: number;
}

// Mock contract data (in real app this would come from the URL params or API)
const mockContract: ContractDetails = {
  id: "CTR-001",
  insuranceCompany: "HealthSecure Insurance",
  duration: 12,
  monthlyRate: 50,
  totalValue: 600,
  startDate: "2024-02-01",
  endDate: "2025-01-31",
  firstPayment: 50,
};

export default function SignContractForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<"review" | "upload" | "payment">("review");
  const [contractUploaded, setContractUploaded] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "recurring" | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock wallet balance
  const [walletBalance] = useState(75.0);

  const handleDownloadContract = () => {
    // Simulate contract download
    alert("Contract downloaded successfully!");
    setCurrentStep("upload");
  };

  const handleContractUpload = () => {
    // Simulate contract upload
    setContractUploaded(true);
    setCurrentStep("payment");
  };

  const handlePaymentSetup = async () => {
    if (!paymentMethod) return;

    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      alert("Contract signed and first payment processed successfully!");
      router.push("/patient");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const canProceedWithWallet = walletBalance >= mockContract.firstPayment;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-8">
          {[
            { step: "review", label: "Review Contract", icon: FileText },
            { step: "upload", label: "Upload Signed Contract", icon: Upload },
            { step: "payment", label: "Setup Payment", icon: CreditCard },
          ].map(({ step, label, icon: Icon }, index) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep === step
                    ? "bg-blue-600 border-blue-600 text-white"
                    : index < ["review", "upload", "payment"].indexOf(currentStep)
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-slate-600 text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${currentStep === step ? "text-blue-400" : "text-slate-400"}`}>
                {label}
              </span>
              {index < 2 && (
                <div
                  className={`ml-4 w-8 h-0.5 ${
                    index < ["review", "upload", "payment"].indexOf(currentStep) ? "bg-emerald-600" : "bg-slate-600"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contract Details (Always Visible) */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              Contract Details
            </CardTitle>
            <CardDescription className="text-slate-400">
              Insurance contract from {mockContract.insuranceCompany}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-slate-700/30 rounded-lg">
              <h4 className="text-white font-semibold mb-3">Contract Terms</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Contract ID:</span>
                  <span className="text-white font-mono">{mockContract.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Insurance Provider:</span>
                  <span className="text-white">{mockContract.insuranceCompany}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage Duration:</span>
                  <span className="text-white">{mockContract.duration} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Monthly Premium:</span>
                  <span className="text-white">{formatCurrency(mockContract.monthlyRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Coverage Period:</span>
                  <span className="text-white">
                    {formatDate(mockContract.startDate)} - {formatDate(mockContract.endDate)}
                  </span>
                </div>
                <hr className="border-slate-600" />
                <div className="flex justify-between font-semibold">
                  <span className="text-slate-300">Total Contract Value:</span>
                  <span className="text-emerald-400">{formatCurrency(mockContract.totalValue)}</span>
                </div>
              </div>
            </div>

            {/* Payment Warning */}
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-amber-400 font-semibold mb-1">First Payment Required</h4>
                  <p className="text-slate-300 text-sm">
                    A payment of <strong>{formatCurrency(mockContract.firstPayment)}</strong> is required immediately
                    upon contract acceptance to activate your coverage.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">
              {currentStep === "review" && "Review Contract"}
              {currentStep === "upload" && "Upload Signed Contract"}
              {currentStep === "payment" && "Setup Payment"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Review */}
            {currentStep === "review" && (
              <div className="space-y-6">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Review Your Contract</h3>
                  <p className="text-slate-400 mb-6">
                    Please download and carefully review your insurance contract before proceeding.
                  </p>
                </div>

                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                  <h4 className="text-blue-400 font-semibold mb-2">What&apos;s Included:</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Comprehensive health coverage</li>
                    <li>• Emergency medical services</li>
                    <li>• Prescription drug coverage</li>
                    <li>• Preventive care and checkups</li>
                  </ul>
                </div>

                <Button
                  onClick={handleDownloadContract}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Contract
                </Button>
              </div>
            )}

            {/* Step 2: Upload */}
            {currentStep === "upload" && (
              <div className="space-y-6">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Upload Signed Contract</h3>
                  <p className="text-slate-400 mb-6">Please sign the downloaded contract and upload it back here.</p>
                </div>

                {!contractUploaded ? (
                  <>
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 mb-2">Drag and drop your signed contract here</p>
                      <p className="text-slate-500 text-sm mb-4">or click to browse files</p>
                      <Button
                        onClick={handleContractUpload}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        Choose File
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                      <div>
                        <p className="text-emerald-400 font-semibold">Contract Uploaded Successfully</p>
                        <p className="text-slate-300 text-sm">Your signed contract has been received.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === "payment" && (
              <div className="space-y-6">
                <div className="text-center">
                  <CreditCard className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Setup Payment</h3>
                  <p className="text-slate-400 mb-6">
                    Choose your payment method for the first payment and ongoing premiums.
                  </p>
                </div>

                {/* Wallet Info */}
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-white font-semibold">Current Wallet Balance</p>
                        <p className="text-slate-400 text-sm">Available for immediate payment</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{formatCurrency(walletBalance)}</p>
                      <Badge
                        className={`${canProceedWithWallet ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                      >
                        {canProceedWithWallet ? "Sufficient" : "Insufficient"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Payment Options */}
                <div className="space-y-4">
                  <h4 className="text-white font-semibold">Choose Payment Method:</h4>

                  {/* Wallet Payment */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "wallet"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    } ${!canProceedWithWallet ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => canProceedWithWallet && setPaymentMethod("wallet")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === "wallet" ? "border-blue-500 bg-blue-500" : "border-slate-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold">Pay from Wallet</p>
                        <p className="text-slate-400 text-sm">Use your current wallet balance for immediate payment</p>
                      </div>
                      <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                  </div>

                  {/* Recurring Payment */}
                  <div
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === "recurring"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-slate-600 hover:border-slate-500"
                    }`}
                    onClick={() => setPaymentMethod("recurring")}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          paymentMethod === "recurring" ? "border-blue-500 bg-blue-500" : "border-slate-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-white font-semibold">Enable Recurring Payment</p>
                        <p className="text-slate-400 text-sm">
                          Automatically charge your wallet each month (requires sufficient balance)
                        </p>
                      </div>
                      <Calendar className="w-5 h-5 text-blue-400" />
                    </div>
                  </div>

                  {!canProceedWithWallet && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <div>
                          <p className="text-amber-400 font-semibold">Insufficient Balance</p>
                          <p className="text-slate-300 text-sm">
                            You need at least {formatCurrency(mockContract.firstPayment)} to proceed. Please add money
                            to your wallet first.
                          </p>
                        </div>
                      </div>
                      <Button
                        className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white"
                        onClick={() => router.push("/patient")}
                      >
                        Add Money to Wallet
                      </Button>
                    </div>
                  )}
                </div>

                {/* Confirm Payment */}
                {paymentMethod && canProceedWithWallet && (
                  <Button
                    onClick={handlePaymentSetup}
                    disabled={isProcessing}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Confirm & Pay {formatCurrency(mockContract.firstPayment)}
                      </>
                    )}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

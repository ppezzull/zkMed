"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, DollarSign, FileText, Send, User } from "lucide-react";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/card";
import { Input } from "~~/components/ui/input";

interface ContractForm {
  patientId: string;
  duration: number;
  monthlyRate: number;
  endDate: string;
  startDate: string;
}

// Mock registered patients
const mockRegisteredPatients = [
  { id: "1", name: "John Smith", email: "john.smith@email.com", wallet: "0x1234...5678" },
  { id: "2", name: "Mary Johnson", email: "mary.j@email.com", wallet: "0x2345...6789" },
  { id: "3", name: "Robert Wilson", email: "robert.w@email.com", wallet: "0x3456...7890" },
  { id: "4", name: "Sarah Brown", email: "sarah.b@email.com", wallet: "0x4567...8901" },
];

export default function SendContractForm() {
  const router = useRouter();
  const [form, setForm] = useState<ContractForm>({
    patientId: "",
    duration: 12,
    monthlyRate: 50,
    endDate: "2050-12-31",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate sending contract
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message (you can add a toast here)
      alert("Contract sent successfully!");

      // Redirect back to insurance dashboard
      router.push("/insurance");
    } catch (error) {
      console.error("Error sending contract:", error);
      alert("Failed to send contract. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatient = mockRegisteredPatients.find(p => p.id === form.patientId);
  const totalAmount = form.duration * form.monthlyRate;

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contract Form */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Contract Details
              </CardTitle>
              <CardDescription className="text-slate-400">Define the terms of the insurance contract</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Patient Selection */}
              <div className="space-y-2">
                <label htmlFor="patient" className="text-slate-300 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Select Patient
                </label>
                <select
                  id="patient"
                  value={form.patientId}
                  onChange={e => setForm(prev => ({ ...prev, patientId: e.target.value }))}
                  className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                  required
                >
                  <option value="">Choose a registered patient...</option>
                  {mockRegisteredPatients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} ({patient.email})
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <label htmlFor="duration" className="text-slate-300 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Contract Duration (months)
                </label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  max="360"
                  value={form.duration}
                  onChange={e => setForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                  required
                />
              </div>

              {/* Monthly Rate */}
              <div className="space-y-2">
                <label htmlFor="monthlyRate" className="text-slate-300 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Monthly Rate ($)
                </label>
                <Input
                  id="monthlyRate"
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.monthlyRate}
                  onChange={e => setForm(prev => ({ ...prev, monthlyRate: parseFloat(e.target.value) }))}
                  className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                  required
                />
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <label htmlFor="startDate" className="text-slate-300 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Start Date
                </label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                  required
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label htmlFor="endDate" className="text-slate-300 flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  End Date
                </label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={e => setForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="bg-slate-700/50 border-slate-600 text-white focus:border-blue-500"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Contract Preview */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Contract Preview</CardTitle>
              <CardDescription className="text-slate-400">Review the contract before sending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPatient ? (
                <>
                  {/* Patient Info */}
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Recipient</h4>
                    <p className="text-slate-300">{selectedPatient.name}</p>
                    <p className="text-slate-400 text-sm">{selectedPatient.email}</p>
                    <p className="text-slate-400 text-sm font-mono">{selectedPatient.wallet}</p>
                  </div>

                  {/* Contract Terms */}
                  <div className="p-4 bg-slate-700/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-3">Contract Terms</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-white">{form.duration} months</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly Rate:</span>
                        <span className="text-white">${form.monthlyRate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Start Date:</span>
                        <span className="text-white">{form.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">End Date:</span>
                        <span className="text-white">{form.endDate}</span>
                      </div>
                      <hr className="border-slate-600" />
                      <div className="flex justify-between font-semibold">
                        <span className="text-slate-300">Total Contract Value:</span>
                        <span className="text-emerald-400">${totalAmount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Payment Information</h4>
                    <p className="text-slate-300 text-sm">
                      First payment of <strong>${form.monthlyRate}</strong> will be required immediately upon contract
                      acceptance.
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      Patient must have sufficient wallet balance to proceed.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-4 space-y-3">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Sending Contract...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Contract
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => router.push("/insurance")}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">Select a patient to preview the contract</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}

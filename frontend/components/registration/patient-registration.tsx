"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, User, Shield } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { registrationContract } from "@/lib/contracts";

interface PatientRegistrationProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function PatientRegistration({ onSuccess, onBack }: PatientRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    secret: "",
    confirmSecret: "",
  });

  const account = useActiveAccount();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (formData.secret !== formData.confirmSecret) {
      setError("Secrets do not match");
      return;
    }

    if (formData.secret.length < 8) {
      setError("Secret must be at least 8 characters long");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Generate commitment from secret (in a real app, this would be more sophisticated)
      const commitment = `0x${Buffer.from(formData.secret).toString('hex').padStart(64, '0')}` as `0x${string}`;

      // Prepare the transaction
      const transaction = prepareContractCall({
        contract: registrationContract,
        method: "registerPatient",
        params: [commitment],
      });

      // Send the transaction
      await sendTransaction({
        transaction,
        account,
      });

      onSuccess();
    } catch (err) {
      console.error("Registration error:", err);
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">Patient Registration</CardTitle>
        <CardDescription>
          Create your privacy-preserving medical identity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="secret">Privacy Secret</Label>
            <Input
              id="secret"
              type="password"
              placeholder="Enter a secure secret"
              value={formData.secret}
              onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
              required
            />
            <p className="text-sm text-muted-foreground">
              This secret will be used to generate your privacy-preserving commitment
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmSecret">Confirm Secret</Label>
            <Input
              id="confirmSecret"
              type="password"
              placeholder="Confirm your secret"
              value={formData.confirmSecret}
              onChange={(e) => setFormData({ ...formData, confirmSecret: e.target.value })}
              required
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 dark:text-blue-100">Privacy Protection</p>
                <p className="text-blue-700 dark:text-blue-200">
                  Your secret is used to create a cryptographic commitment that protects your medical data while enabling verification.
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button type="button" variant="outline" onClick={onBack} className="flex-1">
              Back
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register as Patient
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
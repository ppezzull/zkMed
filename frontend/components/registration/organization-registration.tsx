"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Heart, Shield, Mail } from "lucide-react";
import { useActiveAccount } from "thirdweb/react";
import { prepareContractCall, sendTransaction } from "thirdweb";
import { registrationContract } from "@/lib/contracts";
import { Role, RoleLabels } from "@/lib/constants";

interface OrganizationRegistrationProps {
  role: number;
  onSuccess: () => void;
  onBack: () => void;
}

export function OrganizationRegistration({ role, onSuccess, onBack }: OrganizationRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    organizationName: "",
    domain: "",
    email: "",
  });

  const account = useActiveAccount();

  const getRoleIcon = () => {
    switch (role) {
      case Role.Hospital:
        return Heart;
      case Role.Insurer:
        return Shield;
      default:
        return Shield;
    }
  };

  const getRoleColor = () => {
    switch (role) {
      case Role.Hospital:
        return "bg-green-500";
      case Role.Insurer:
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) {
      setError("Please connect your wallet first");
      return;
    }

    if (!formData.organizationName || !formData.domain || !formData.email) {
      setError("Please fill in all fields");
      return;
    }

    if (!formData.email.includes("@" + formData.domain)) {
      setError("Email must be from the organization domain");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // For now, we'll create a mock proof structure that matches the contract interface
      // In a real implementation, this would use vlayer MailProofs
      const mockProof = {
        seal: {
          verifierSelector: "0x00000000" as `0x${string}`,
          seal: [
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
          ] as readonly [`0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`, `0x${string}`],
          mode: 0,
        },
        callGuestId: "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
        length: BigInt(0),
        callAssumptions: {
          proverContractAddress: "0x0000000000000000000000000000000000000000",
          functionSelector: "0x00000000" as `0x${string}`,
          settleChainId: BigInt(31337),
          settleBlockNumber: BigInt(0),
          settleBlockHash: "0x0000000000000000000000000000000000000000000000000000000000000000" as `0x${string}`,
        }
      };

      const orgData = {
        name: formData.organizationName,
        domain: formData.domain,
        targetWallet: account.address,
        emailHash: `0x${Buffer.from(formData.email).toString('hex').padStart(64, '0')}` as `0x${string}`,
        verificationTimestamp: BigInt(Math.floor(Date.now() / 1000)),
      };

      // Prepare the transaction
      const transaction = prepareContractCall({
        contract: registrationContract,
        method: "registerOrganization",
        params: [mockProof, orgData, role],
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

  const Icon = getRoleIcon();
  const roleColor = getRoleColor();
  const roleLabel = RoleLabels[role as keyof typeof RoleLabels];

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className={`w-16 h-16 rounded-full ${roleColor} flex items-center justify-center mx-auto mb-4`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl">{roleLabel} Registration</CardTitle>
        <CardDescription>
          Register your organization to participate in zkMed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizationName">Organization Name</Label>
            <Input
              id="organizationName"
              placeholder="Enter organization name"
              value={formData.organizationName}
              onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="example.com"
              value={formData.domain}
              onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
              required
            />
            <p className="text-sm text-muted-foreground">
              Your organization's verified domain
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Official Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <p className="text-sm text-muted-foreground">
              Must be from your organization's domain
            </p>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Mail className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 dark:text-amber-100">Email Verification</p>
                <p className="text-amber-700 dark:text-amber-200">
                  Your organization will be verified through domain ownership proof using vlayer MailProofs.
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
              Register Organization
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
} 
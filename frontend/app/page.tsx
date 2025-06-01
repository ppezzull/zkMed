"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, Heart, Users } from "lucide-react";
import AuthConnectButton from "@/components/auth/connect-button";
import { RegistrationDialog } from "@/components/registration/registration-dialog";
import { PatientRegistration } from "@/components/registration/patient-registration";
import { OrganizationRegistration } from "@/components/registration/organization-registration";
import { checkUserRegistration } from "@/actions/registration";
import { isLoggedIn } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/constants";

type RegistrationStep = "role-selection" | "patient-form" | "organization-form" | "success";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<{
    isRegistered: boolean;
    role: number;
    verified: boolean;
    active: boolean;
  } | null>(null);
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationStep, setRegistrationStep] = useState<RegistrationStep>("role-selection");
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const account = useActiveAccount();
  const router = useRouter();

  // Check authentication and registration status
  useEffect(() => {
    const checkStatus = async () => {
      if (!account?.address) {
        setIsLoading(false);
        return;
      }

      try {
        // Check if user is authenticated
        const authenticated = await isLoggedIn();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          // Check registration status
          const status = await checkUserRegistration(account.address);
          setRegistrationStatus(status);

          if (status.isRegistered) {
            // Redirect to profile if registered
            router.push("/profile");
          } else {
            // Show registration dialog if not registered
            setShowRegistration(true);
          }
        }
      } catch (err) {
        console.error("Error checking status:", err);
        setError("Failed to check user status");
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [account?.address, router]);

  const handleRoleSelect = (role: number) => {
    setSelectedRole(role);
    if (role === Role.Patient) {
      setRegistrationStep("patient-form");
    } else {
      setRegistrationStep("organization-form");
    }
  };

  const handleRegistrationSuccess = () => {
    setRegistrationStep("success");
    setTimeout(() => {
      router.push("/profile");
    }, 2000);
  };

  const handleBackToRoleSelection = () => {
    setRegistrationStep("role-selection");
    setSelectedRole(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to <span className="text-primary">zkMed</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            The future of healthcare is here. Experience privacy-preserving medical claims processing 
            with cutting-edge Web3 technology, zero-knowledge proofs, and seamless user experience.
          </p>
          
          {!account && (
            <div className="mb-8">
              <AuthConnectButton />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="max-w-md mx-auto mb-8">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Privacy First</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your medical data stays private with zero-knowledge proofs and cryptographic commitments.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Seamless Care</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Healthcare providers can verify and process claims without accessing sensitive data.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <CardTitle>Trusted Network</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Insurance companies can approve claims with confidence using multi-proof validation.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        {account && isAuthenticated && !registrationStatus?.isRegistered && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Get Started</CardTitle>
                <CardDescription>
                  Complete your registration to start using zkMed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowRegistration(true)} size="lg" className="w-full">
                  Complete Registration
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Registration Dialog */}
        <RegistrationDialog
          open={showRegistration && registrationStep === "role-selection"}
          onOpenChange={setShowRegistration}
          onRoleSelect={handleRoleSelect}
        />

        {/* Registration Forms */}
        {registrationStep === "patient-form" && selectedRole === Role.Patient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <PatientRegistration
              onSuccess={handleRegistrationSuccess}
              onBack={handleBackToRoleSelection}
            />
          </div>
        )}

        {registrationStep === "organization-form" && selectedRole && selectedRole !== Role.Patient && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <OrganizationRegistration
              role={selectedRole}
              onSuccess={handleRegistrationSuccess}
              onBack={handleBackToRoleSelection}
            />
          </div>
        )}

        {/* Success Message */}
        {registrationStep === "success" && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md mx-auto">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Registration Successful!</CardTitle>
                <CardDescription>
                  Welcome to zkMed. Redirecting to your profile...
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

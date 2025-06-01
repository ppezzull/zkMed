"use client";

import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, LogOut, Settings, FileText, Activity } from "lucide-react";
import { ProfileHeader } from "@/components/profile/profile-header";
import { checkUserRegistration } from "@/actions/registration";
import { isLoggedIn, logout } from "@/actions/auth";
import AuthConnectButton from "@/components/auth/connect-button";

export default function ProfilePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [registrationStatus, setRegistrationStatus] = useState<{
    isRegistered: boolean;
    role: number;
    verified: boolean;
    active: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const account = useActiveAccount();
  const router = useRouter();

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

        if (!authenticated) {
          router.push("/");
          return;
        }

        // Check registration status
        const status = await checkUserRegistration(account.address);
        setRegistrationStatus(status);

        if (!status.isRegistered) {
          router.push("/");
          return;
        }
      } catch (err) {
        console.error("Error checking status:", err);
        setError("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [account?.address, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (err) {
      console.error("Logout error:", err);
      setError("Failed to logout");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Please connect your wallet to access your profile
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <AuthConnectButton />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated || !registrationStatus?.isRegistered) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You need to be authenticated and registered to access this page
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/")} variant="outline">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Profile Header */}
          <ProfileHeader
            address={account.address}
            role={registrationStatus.role}
            verified={registrationStatus.verified}
            active={registrationStatus.active}
          />

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-2">
                <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Medical Records</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Manage your encrypted medical records
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-2">
                <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Claims</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  View and manage insurance claims
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center pb-2">
                <Settings className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Configure your privacy preferences
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleLogout}>
              <CardHeader className="text-center pb-2">
                <LogOut className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <CardTitle className="text-lg">Logout</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Sign out of your account
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Role-specific content */}
          <Card>
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Welcome to your zkMed dashboard. Here you can manage your healthcare data securely.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Your dashboard is ready! Role-specific features will be available soon.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                      Privacy Protected
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      Your medical data is secured with zero-knowledge proofs
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                      Verified Identity
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-200">
                      Your account is verified and ready for secure transactions
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
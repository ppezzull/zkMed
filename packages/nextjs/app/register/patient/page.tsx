"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { CollectEmailComponent } from "~~/components/register/CollectEmailComponent";
import { SendEmailComponent } from "~~/components/register/SendEmailComponent";
import { VerifyRegistrationComponent } from "~~/components/register/VerifyRegistrationComponent";

/**
 * Patient Registration Steps
 *
 * Defines the multi-step patient registration workflow
 */
type PatientRegistrationStep = "send" | "collect" | "verify";

/**
 * Patient Registration Page
 *
 * Multi-step patient registration workflow:
 * 1. Send verification email
 * 2. Collect email response
 * 3. Verify registration with cryptographic proof
 */
export default function PatientRegistrationPage() {
  const router = useRouter();
  const { authenticated, user } = usePrivy();

  // Registration state management
  const [currentStep, setCurrentStep] = useState<PatientRegistrationStep>("send");
  const [emailId, setEmailId] = useState<string>("");
  const [emlContent, setEmlContent] = useState<string>("");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authenticated || !user) {
      router.push("/");
    }
  }, [authenticated, user, router]);

  const handleEmailSent = (id: string) => {
    setEmailId(id);
    setCurrentStep("collect");
  };

  const handleEmailReceived = (content: string) => {
    setEmlContent(content);
    setCurrentStep("verify");
  };

  const handleBack = () => {
    switch (currentStep) {
      case "send":
        router.push("/register/role-selection");
        break;
      case "collect":
        setCurrentStep("send");
        break;
      case "verify":
        setCurrentStep("collect");
        break;
    }
  };

  // Don't render if user is not authenticated
  if (!authenticated || !user) {
    return null;
  }

  return (
    <>
      {currentStep === "send" && (
        <SendEmailComponent role="PATIENT" onEmailSent={handleEmailSent} onBack={handleBack} />
      )}

      {currentStep === "collect" && (
        <CollectEmailComponent
          emailId={emailId}
          role="PATIENT"
          onEmailReceived={handleEmailReceived}
          onBack={handleBack}
        />
      )}

      {currentStep === "verify" && (
        <VerifyRegistrationComponent role="PATIENT" emlContent={emlContent} onBack={handleBack} />
      )}
    </>
  );
}

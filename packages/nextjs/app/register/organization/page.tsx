"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { CollectEmailComponent } from "~~/components/register/CollectEmailComponent";
import { OrganizationDetailsComponent } from "~~/components/register/OrganizationDetailsComponent";
import type { HealthcareRole } from "~~/components/register/RoleSelectionComponent";
import { SendEmailComponent } from "~~/components/register/SendEmailComponent";
import { VerifyRegistrationComponent } from "~~/components/register/VerifyRegistrationComponent";

type OrganizationType = "HOSPITAL" | "INSURER";
type OrganizationStep = "details" | "send" | "collect" | "verify";

function OrganizationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = usePrivy();

  const [organizationType, setOrganizationType] = useState<OrganizationType | null>(null);
  const [step, setStep] = useState<OrganizationStep>("details");
  const [organizationName, setOrganizationName] = useState<string>("");
  const [emailId, setEmailId] = useState<string>("");
  const [emlContent, setEmlContent] = useState<string>("");

  // Get organization type from URL params
  useEffect(() => {
    const type = searchParams.get("type") as OrganizationType;
    if (type === "HOSPITAL" || type === "INSURER") {
      setOrganizationType(type);
    } else {
      router.push("/register/role-selection");
    }
  }, [searchParams, router]);

  // Redirect if user is not connected
  useEffect(() => {
    if (!user?.wallet?.address) {
      router.push("/");
    }
  }, [user?.wallet?.address, router]);

  const handleDetailsSubmit = (name: string) => {
    setOrganizationName(name);
    setStep("send");
  };

  const handleEmailSent = (id: string) => {
    setEmailId(id);
    setStep("collect");
  };

  const handleEmailReceived = (content: string) => {
    setEmlContent(content);
    setStep("verify");
  };

  const handleBack = () => {
    switch (step) {
      case "details":
        router.push("/register/role-selection");
        break;
      case "send":
        setStep("details");
        break;
      case "collect":
        setStep("send");
        break;
      case "verify":
        setStep("collect");
        break;
    }
  };

  // Don't render if user is not connected or organization type is not set
  if (!user?.wallet?.address || !organizationType) {
    return null;
  }

  return (
    <>
      {step === "details" && (
        <OrganizationDetailsComponent
          organizationType={organizationType}
          organizationName={organizationName}
          setOrganizationName={setOrganizationName}
          onSubmit={handleDetailsSubmit}
          onBack={handleBack}
        />
      )}

      {step === "send" && (
        <SendEmailComponent
          role={organizationType as HealthcareRole}
          organizationName={organizationName}
          onEmailSent={handleEmailSent}
          onBack={handleBack}
        />
      )}

      {step === "collect" && (
        <CollectEmailComponent
          emailId={emailId}
          role={organizationType as HealthcareRole}
          onEmailReceived={handleEmailReceived}
          onBack={handleBack}
        />
      )}

      {step === "verify" && (
        <VerifyRegistrationComponent
          role={organizationType as HealthcareRole}
          emlContent={emlContent}
          organizationName={organizationName}
          onBack={handleBack}
        />
      )}
    </>
  );
}

export default function OrganizationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrganizationPageContent />
    </Suspense>
  );
}

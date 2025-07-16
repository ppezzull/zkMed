"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { AdminRequestComponent } from "~~/components/register/AdminRequestComponent";

export default function AdminPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/register/role-selection");
  };

  return <AdminRequestComponent onBack={handleBack} />;
}

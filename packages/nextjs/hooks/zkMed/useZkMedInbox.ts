"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

const emailServiceUrl = process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || "https://email-service.vlayer.xyz";

export const useZkMedInbox = (emailId: string | undefined) => {
  const [emlFetched, setEmlFetched] = useState(false);
  const [, setEmlFile] = useLocalStorage("zkmedEmlFile", "");

  console.log("🔍 DEBUG - useZkMedInbox hook:");
  console.log("🔍 DEBUG - Email ID:", emailId);
  console.log("🔍 DEBUG - Email service URL:", emailServiceUrl);

  const { data, status, error, isLoading } = useQuery({
    queryKey: ["receivedEmailEmlContent", emailId],
    queryFn: async () => {
      if (!emailId) throw new Error("No email ID provided");

      const fetchUrl = `${emailServiceUrl}/${emailId}.eml`;
      console.log("🔍 DEBUG - Fetching from URL:", fetchUrl);

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        console.log("🔍 DEBUG - Fetch failed:", response.status, response.statusText);
        throw new Error(`Failed to fetch email: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      console.log("🔍 DEBUG - Fetched email content preview:", content.substring(0, 100));
      console.log("🔍 DEBUG - Fetched email length:", content.length);
      console.log("🔍 DEBUG - Is Nexthoop email?", content.includes("nexthoop.it"));
      console.log("🔍 DEBUG - Is Gmail email?", content.includes("gmail.com"));

      return content;
    },
    enabled: !!emailId,
    retry: 6,
    retryDelay: 10000, // 10 sec delay between fetch retries
  });

  useEffect(() => {
    if (data && status === "success") {
      setEmlFile(data);
      setEmlFetched(true);
    }
  }, [data, status, setEmlFile]);

  return {
    emlFetched,
    emlContent: data,
    isLoading,
    error: error?.message,
  };
};

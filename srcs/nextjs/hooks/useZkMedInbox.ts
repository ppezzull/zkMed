'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "usehooks-ts";

const emailServiceUrl = process.env.NEXT_PUBLIC_EMAIL_SERVICE_URL || "https://email-service.vlayer.xyz";

export const useZkMedInbox = (emailId: string | undefined) => {
  const [emlFetched, setEmlFetched] = useState(false);
  const [, setEmlFile] = useLocalStorage("zkmedEmlFile", "");

  console.log("emailServiceUrl", emailServiceUrl);

  const { data, status, error, isLoading } = useQuery({
    queryKey: ["receivedEmailEmlContent", emailId],
    queryFn: async () => {
      if (!emailId) throw new Error("No email ID provided");
      
      const response = await fetch(`${emailServiceUrl}/${emailId}.eml`);
      if (!response.ok) {
        throw new Error(`Failed to fetch email: ${response.status} ${response.statusText}`);
      }
      return response.text();
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
    error: error?.message 
  };
}; 
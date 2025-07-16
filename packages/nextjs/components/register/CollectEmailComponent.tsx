"use client";

import React, { useRef, useState } from "react";
import type { HealthcareRole } from "./RoleSelectionComponent";

/**
 * Collect Email Component Props
 */
interface CollectEmailComponentProps {
  emailId: string;
  role: HealthcareRole;
  onEmailReceived: (emlContent: string) => void;
  onBack: () => void;
}

/**
 * Collect Email Component
 *
 * Second step in registration workflow where users upload their
 * received email response for verification
 */
export function CollectEmailComponent({
  emailId,
  role: _role, // eslint-disable-line @typescript-eslint/no-unused-vars
  onEmailReceived,
  onBack,
}: CollectEmailComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const expectedEmail = `${emailId}@proving.vlayer.xyz`;

  /**
   * Handle file upload and read email content
   */
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate file type
      if (!file.name.endsWith(".eml") && !file.name.endsWith(".txt")) {
        throw new Error("Please upload a .eml or .txt file");
      }

      // Read file content
      const content = await readFileContent(file);

      // Basic validation of email content
      if (!content || content.trim().length === 0) {
        throw new Error("Email file appears to be empty");
      }

      // Proceed with email content
      onEmailReceived(content);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process email file");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Read file content as text
   */
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const content = e.target?.result;
        if (typeof content === "string") {
          resolve(content);
        } else {
          reject(new Error("Failed to read file content"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  /**
   * Handle file input change
   */
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  /**
   * Handle drag and drop
   */
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleBrowseFiles = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Email Collection</h1>
              <p className="text-gray-600">Upload your received email for verification</p>
            </div>
            <button onClick={onBack} className="text-gray-500 hover:text-gray-700 transition-colors">
              ← Back
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center space-x-4 py-4">
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100">3</div>
              <span className="text-sm font-medium">Collect Email</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Upload Email Response</h2>
              <p className="text-gray-600 mb-8">Please upload the email response you received from {expectedEmail}</p>
            </div>

            {/* Email Information */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Expected Email:</h3>
              <p className="text-sm text-blue-700">From: {expectedEmail}</p>
              <p className="text-sm text-blue-700">Subject: Verification response for your registration</p>
            </div>

            {/* File Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".eml,.txt"
                onChange={handleFileInputChange}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="text-4xl text-gray-400">📧</div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Email File</h3>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your .eml or .txt email file here, or click to browse
                  </p>
                  <button
                    onClick={handleBrowseFiles}
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Processing..." : "Browse Files"}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">How to get your email file:</h3>
              <ol className="text-sm text-gray-700 space-y-1 list-decimal list-inside">
                <li>Check your email inbox for a response from {expectedEmail}</li>
                <li>Save/download the email as an .eml file from your email client</li>
                <li>Upload the file using the area above</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={onBack}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

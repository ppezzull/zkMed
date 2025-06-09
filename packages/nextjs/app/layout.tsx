import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThirdwebProviders from "../components/providers/thirdweb-providers";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "zkMed - Privacy-Preserving Healthcare with Yield",
  description: "Healthcare platform where premiums earn 3-5% yield in Aave pools while maintaining complete medical privacy through zero-knowledge proofs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThirdwebProviders>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
          {children}
            </main>
            <Footer />
          </div>
        </ThirdwebProviders>
      </body>
    </html>
  );
}

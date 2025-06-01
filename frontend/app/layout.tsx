import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThirdwebProvider } from "thirdweb/react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "zkMed - Privacy-Preserving Healthcare Platform",
  description: "Secure, privacy-preserving healthcare claims processing with Web3 technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="bg-background text-foreground overflow-x-hidden" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ThirdwebProvider>
            <main className="min-h-screen flex flex-col">
              <header className="bg-background/85 backdrop-blur-md fixed top-0 left-0 right-0 z-[40] h-20 shadow-sm border-b">
                <div className="w-full h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">z</span>
                      </div>
                      <span className="text-xl font-bold text-primary">zkMed</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <ThemeToggle />
                  </div>
                </div>
              </header>
              
              <div className="flex-1 w-full mt-20 layout-content min-h-screen">
                {children}
              </div>
              
              <footer className="bg-muted/50 border-t py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-muted-foreground">
                  <p>&copy; 2024 zkMed. Privacy-preserving healthcare for everyone.</p>
                </div>
              </footer>
            </main>
          </ThirdwebProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

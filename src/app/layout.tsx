import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { TrialModalProvider } from "@/contexts/TrialModalContext";
import UpgradeModal from "@/components/UgradeModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docstant",
  description: "Docstant simplifies medical diagnosis. Doctors input patient information, symptoms, examination reports, physical reports, and CT scan results into our platform",
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
        <AppProvider>
          <TrialModalProvider>
            {children}
            <UpgradeModal />
            <Toaster richColors position="top-right" closeButton />
          </TrialModalProvider>
        </AppProvider>
      </body>
    </html>
  );
}

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientLayout from "../app/client-layout";
import AuthGuard from "@/components/AuthGuard";
import SessionProviderWrapper from "./providers/SessionProviderWrapper"; // ✅ import wrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GMB Auto Management System",
  description: "AI-powered GMB automation dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ✅ Wrap the entire app in SessionProvider */}
        <SessionProviderWrapper>
          <ClientLayout>
            <AuthGuard>{children}</AuthGuard>
          </ClientLayout>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}

// ============================================================
// ORDERPILOT — ROOT LAYOUT
// File: src/app/layout.tsx
// Purpose: Global application layout and navigation shell
// ============================================================

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import AppShell from "./components/AppShell";


// ============================================================
// 1. FONTS
// ============================================================

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


// ============================================================
// 2. METADATA
// ============================================================

export const metadata: Metadata = {
  title: "OrderPilot",
  description: "AI-powered order and delivery management",
};


// ============================================================
// 3. ROOT LAYOUT
// ============================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-50">
        <AppShell>
          {children}
        </AppShell>
      </body>
    </html>
  );
}
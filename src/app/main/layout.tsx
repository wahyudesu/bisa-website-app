import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";

import {
  ClerkProvider,
} from '@clerk/nextjs'

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Main dashboard",
  description: "AI Website Builder",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
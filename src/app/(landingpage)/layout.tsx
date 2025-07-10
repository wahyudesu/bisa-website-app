import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { GradientBars } from '@/components/ui/gradient-bars';
import "../globals.css";

import LandingNavBar from './landing-navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bisa Website",
  description: "Bikin website modal ngetik",
  keywords: [
    "website builder",
    "bikin website",
    "landing page",
    "ai website builder",
    "ai indonesia",
    "buat website mudah",
    "website gratis",
    "website cepat",
  ],
  authors: [{ name: "Wahyu Ikbal Maulana", url: "https://wahyuikbal.web.id" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Gradient background absolutely positioned */}
        <div className="absolute inset-0 -z-10 pointer-events-none w-full h-full bg-neutral-200 dark:bg-neutral-800">
          <GradientBars />
        </div>
        <LandingNavBar />
        {children}
        {/* LinkedIn Floating Button */}
        <a
          href="https://www.linkedin.com/in/wahyuikbalmaulana"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-0 right-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-900 border-l-2 border-t-2 border-neutral-300 dark:border-neutral-700 rounded-tl-lg shadow-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors font-medium text-sm z-50"
          aria-label="LinkedIn Wahyu Ikbal Maulana"
        >
          By Wahyu
          <img
            src="/wahyu-pp.jpg"
            alt="Wahyu Ikbal Maulana"
            className="w-6 h-6 rounded-full object-cover"
          />
        </a>
      </body>
    </html>
  );
}

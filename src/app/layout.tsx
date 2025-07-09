import "./globals.css";
import { Inter, Gabarito } from 'next/font/google';

import { type Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { PostHogProvider } from "./providers";
import { ThemeProvider } from "next-themes";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const gabarito = Gabarito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-gabarito',
});

export const metadata: Metadata = {
  title: 'Ngumpulin',
  description: 'Aplikasi AI untuk mempermudah dosen dalam mengoreksi tugas',
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="id" className={`${inter.variable} ${gabarito.variable}`} suppressHydrationWarning>
        <body className={inter.className}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <PostHogProvider>
              {children}
            </PostHogProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

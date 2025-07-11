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
  title: 'Bisa Website',
  description: 'Aplikasi AI untuk mempermudah dosen dalam mengoreksi tugas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="id" className={`${inter.variable} ${gabarito.variable}`} suppressHydrationWarning>
        <head>
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="ca6ffcf7-5669-4e2c-aa73-9a103024b5bf"
          />
          <script
          src="https://app.rybbit.io/api/script.js"
          data-site-id="1576"
          defer>
          </script>
          <link
            rel="icon"
            href="/logo.svg"
            type="image"
            sizes="any"
          />
        </head>
        <body className={inter.className}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

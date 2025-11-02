import {
  CounterStoreProvider,
  QueryProvider,
  ThemeProvider,
} from '@/providers';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--display-family',
});

export const metadata: Metadata = {
  title: 'Crowdfunding Platform',
  description: 'Modern crowdfunding platform built with Next.js',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className={`${poppins.variable}`} suppressHydrationWarning>
      <body>
        <CounterStoreProvider>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </CounterStoreProvider>
      </body>
    </html>
  );
}

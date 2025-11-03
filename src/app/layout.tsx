import { Toaster } from '@/components/ui';
import { routing } from '@/i18n/routing';
import {
  CounterStoreProvider,
  QueryProvider,
  ThemeProvider,
} from '@/providers';
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--display-family',
});

export const metadata: Metadata = {
  title: 'Crowdfunding Platform',
  description: 'Modern crowdfunding platform built with Next.js',
};

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html className={`${poppins.variable}`} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

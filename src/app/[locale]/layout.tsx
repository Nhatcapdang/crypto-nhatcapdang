import { StructuredData } from '@/components/seo';
import { Toaster } from '@/components/ui';
import { routing } from '@/i18n/routing';
import {
  createOrganizationStructuredData,
  createSeoMetadata,
  createWebsiteStructuredData,
} from '@/lib/seo';
import { QueryProvider, ThemeProvider } from '@/providers';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata } from 'next';
import { AppConfig, NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { Poppins } from 'next/font/google';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return createSeoMetadata({
    title: t('metadata.home.default'),
    description: t('metadata.home.description'),
    keywords: t.raw('metadata.home.keywords'),
    locale,
    path: '/',
  });
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--display-family',
});

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale as AppConfig['Locale'];

  // Enable static rendering
  setRequestLocale(locale);

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${poppins.variable}`}
      suppressHydrationWarning
    >
      <body>
        <StructuredData
          data={[
            createOrganizationStructuredData(),
            createWebsiteStructuredData(),
          ]}
        />
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

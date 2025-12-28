import { Toaster } from '@/components/ui';
import { QueryProvider, ThemeProvider } from '@/providers';
import StoreProvider from '@/providers/StoreProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Metadata, Viewport } from 'next';
import { AppConfig, NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { Poppins } from 'next/font/google';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatcapdang.com';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: '%s | Nhatcapdang',
      default: t('metadata.home.default'),
    },
    description: t('metadata.home.description'),
    keywords: t.raw('metadata.home.keywords'),
    icons: {
      icon: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '48x48',
          type: 'image/x-icon',
        },
      ],
      apple: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
      other: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          rel: 'icon',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          rel: 'icon',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    openGraph: {
      title: {
        template: '%s | Nhatcapdang',
        default: t('metadata.home.title'),
      },
      siteName: 'Nhatcapdang',
      description: t('metadata.home.description'),
      url: SITE_URL,
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: t('metadata.home.title'),
        },
      ],
    },
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        vi: '/vi',
      },
    },
    authors: [
      {
        name: 'Nhatcapdang',
        url: 'https://nhatcapdang.com',
      },
    ],
    assets: ['https://nhatcapdang.com/images/nhatcapdang.png'],
    creator: 'Nhatcapdang',
    twitter: {
      card: 'summary_large_image',
      title: {
        template: '%s | Nhatcapdang',
        default: t('metadata.home.title'),
      },
      description: t('metadata.home.description'),
    },
  };
};

export const generateViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  };
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--display-family',
});

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: AppConfig['Locale'] }>;
}>) {
  const { locale } = await params;

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
        <NextIntlClientProvider messages={messages}>
          <StoreProvider>
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
          </StoreProvider>
        </NextIntlClientProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

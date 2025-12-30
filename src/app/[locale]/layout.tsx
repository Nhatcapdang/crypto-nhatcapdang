import { Toaster } from '@/components/ui';
import { routing } from '@/i18n/routing';
import { QueryProvider, ThemeProvider } from '@/providers';
import StoreProvider from '@/providers/StoreProvider';
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
    other: {
      link: [
        'https://nhatcapdang.com/fonts/poppins-v20-latin-600.woff2',
        'https://nhatcapdang.com/images/nhatcapdang.png',
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
        hi: '/hi',
        'zh-HK': '/zh-HK',
        fr: '/fr',
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

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['600'],
  variable: '--display-family',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
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

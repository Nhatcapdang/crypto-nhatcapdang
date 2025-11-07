import { Toaster } from '@/components/ui';
import {
  CounterStoreProvider,
  QueryProvider,
  ThemeProvider,
} from '@/providers';
import { NextIntlClientProvider } from 'next-intl';
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
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'layout' });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      template: t('template'),
      default: t('default'),
    },
    description: t('description') || 'Create Meme Coin for Free | NhatCapDang',
    keywords: t.raw('keywords') as string[],
    viewport: {
      width: 'device-width',
      initialScale: 1,
      maximumScale: 5,
    },
    icons: {
      icon: [
        {
          url: '/images/nhatcapdang.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: '/images/nhatcapdang.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: '/favicon.ico',
          sizes: '48x48',
          type: 'image/x-icon',
        },
      ],
      apple: [
        {
          url: '/images/nhatcapdang.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
      other: [
        {
          url: '/images/nhatcapdang.png',
          rel: 'icon',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          url: '/images/nhatcapdang.png',
          rel: 'icon',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    openGraph: {
      title: {
        template: t('template'),
        default: t('default'),
      },
      description:
        t('description') || 'Create Meme Coin for Free | NhatCapDang',
      url: SITE_URL,
      images: [
        {
          url: '/images/nhatcapdang-text.png',
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: t('description'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        template: t('template'),
        default: t('default'),
      },
      description: t('description_large_image'),
    },
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
  params: Promise<{ locale: string }>;
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

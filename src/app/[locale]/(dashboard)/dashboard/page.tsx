import Overview from '@/components/dashboard-layout/overview';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL('https://nhatcapdang.com'),
    title: {
      template: t('metadata.overview.title'),
      default: t('metadata.overview.title'),
    },
    description: t('metadata.overview.description'),
    keywords: t.raw('metadata.overview.keywords'),
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
        template: t('metadata.overview.title'),
        default: t('metadata.overview.title'),
      },
      siteName: 'Nhatcapdang',
      description: t('metadata.overview.description'),
      url: 'https://nhatcapdang.com/dashboard',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: t('metadata.overview.title'),
        },
      ],
    },
    alternates: {
      canonical: '/dashboard',
      languages: {
        en: '/dashboard',
        vi: '/vi/dashboard',
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
        default: t('metadata.overview.title'),
      },
      description: t('metadata.overview.description'),
    },
  };
};
export default function Page() {
  return <Overview />;
}

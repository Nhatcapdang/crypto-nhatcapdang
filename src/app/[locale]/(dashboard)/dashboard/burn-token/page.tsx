import BurnTokenComponent from '@/components/dashboard-layout/burn-token';
import type { Metadata } from 'next';
import { AppConfig } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('metadata.pool.title'),
    description: t('metadata.burn_token.description'),
    keywords: t.raw('metadata.burn_token.keywords'),
    alternates: {
      canonical: '/dashboard/burn-token',
      languages: {
        en: '/dashboard/burn-token',
        vi: '/vi/dashboard/burn-token',
        hi: '/hi/dashboard/burn-token',
        'zh-HK': '/zh-HK/dashboard/burn-token',
        fr: '/fr/dashboard/burn-token',
      },
    },
    openGraph: {
      title: {
        template: t('metadata.burn_token.title'),
        default: t('metadata.burn_token.title'),
      },
      description: t('metadata.burn_token.description'),
      url: 'https://nhatcapdang.com/dashboard/burn-token',
      siteName: 'NhatCapDang',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          width: 1200,
          height: 630,
          alt: t('metadata.burn_token.title'),
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadata.burn_token.title'),
      description: t('metadata.burn_token.description'),
      images: ['https://nhatcapdang.com/images/nhatcapdang.png'],
    },
  };
};
export default function BurnTokenPage() {
  return <BurnTokenComponent />;
}

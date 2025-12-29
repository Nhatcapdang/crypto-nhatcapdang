import PoolComponent from '@/components/dashboard-layout/pool';
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
    description: t('metadata.pool.description'),
    keywords: t.raw('metadata.pool.keywords'),
    alternates: {
      canonical: '/dashboard/pool',
      languages: {
        en: '/dashboard/pool',
        vi: '/vi/dashboard/pool',
        hi: '/hi/dashboard/pool',
        'zh-HK': '/zh-HK/dashboard/pool',
        fr: '/fr/dashboard/pool',
      },
    },
    openGraph: {
      title: {
        template: t('metadata.pool.title'),
        default: t('metadata.pool.title'),
      },
      description: t('metadata.pool.description'),
      url: 'https://nhatcapdang.com/dashboard/pool',
      siteName: 'NhatCapDang',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          width: 1200,
          height: 630,
          alt: t('metadata.pool.title'),
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadata.pool.title'),
      description: t('metadata.pool.description'),
      images: ['https://nhatcapdang.com/images/nhatcapdang.png'],
    },
  };
};
export default async function PoolPage() {
  return <PoolComponent />;
}

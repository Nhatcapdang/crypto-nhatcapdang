import PoolComponent from '@/components/dashboard-layout/pool';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const tLayout = await getTranslations({ locale, namespace: 'layout' });

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatcapdang.com';

  const title = t('pool') || 'Pool';
  const description =
    t('liquidity_pool_description') ||
    'View and manage your liquidity pools on Solana. Monitor positions, add liquidity, and track performance.';
  const url = `${SITE_URL}/dashboard/pool`;

  // Canonical should point to the current page's URL
  const canonicalPath = '/dashboard/pool';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard/pool',
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: tLayout('title') || 'NhatCapDang',
      images: [
        {
          url: `${SITE_URL}/images/nhatcapdang.png`,
          width: 1200,
          height: 630,
          alt: 'Liquidity Pools - Manage Your Pools on Solana',
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${SITE_URL}/images/nhatcapdang.png`],
    },
  };
};

export default function PoolPage() {
  return <PoolComponent />;
}

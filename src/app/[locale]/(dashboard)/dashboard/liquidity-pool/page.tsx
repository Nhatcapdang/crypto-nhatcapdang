import { CreateLiquidityPool } from '@/components/dashboard-layout/create-liquidity-pool';
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

  const title = t('create_liquidity_pool') || 'Create Liquidity Pool';
  const description =
    t('create_liquidity_pool_description') ||
    'Create a liquidity pool for your token so users can buy and trade it';
  const url = `${SITE_URL}/dashboard/create-liquidity-pool`;

  // Canonical should point to the default locale (English)
  const canonicalPath = '/dashboard/create-liquidity-pool';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard/create-liquidity-pool',
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: tLayout('title') || 'NhatCapDang',
      images: [
        {
          url: '/images/nhatcapdang-text.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/nhatcapdang-text.png'],
    },
  };
};

export default function LiquidityPoolPage() {
  return <CreateLiquidityPool />;
}

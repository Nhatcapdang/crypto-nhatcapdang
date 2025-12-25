import { CreateLiquidityComponent } from '@/components/dashboard-layout';
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

  const title = t('create_liquidity') || 'Create Liquidity';
  const description =
    t('create_liquidity_pool_description') ||
    'Create a new liquidity pool on Solana. Select tokens, set initial amounts, and start trading instantly.';
  const url = `${SITE_URL}/dashboard/create-liquidity`;

  // Canonical should point to the current page's URL
  const canonicalPath = '/dashboard/create-liquidity';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard/create-liquidity',
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
          alt: 'Create Liquidity Pool - Add Liquidity on Solana',
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

export default function CreateLiquidity() {
  return <CreateLiquidityComponent />;
}

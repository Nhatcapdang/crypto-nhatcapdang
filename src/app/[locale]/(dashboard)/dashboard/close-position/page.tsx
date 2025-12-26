import { ClosePositionComponent } from '@/components/dashboard-layout';
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

  const title = t('close_position') || 'Close Position';
  const description =
    'Close your liquidity position on Solana. Reclaim your tokens and SOL from active positions instantly.';
  const url = `${SITE_URL}/dashboard/close-position`;

  // Canonical should point to the current page's URL
  const canonicalPath = '/dashboard/close-position';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard/close-position',
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
          alt: 'Close Liquidity Position - Reclaim Tokens & SOL',
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

export default function ClosePositionPage() {
  return <ClosePositionComponent />;
}

import BurnTokenComponent from '@/components/dashboard-layout/burn-token';
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

  const title = t('burn_token') || 'Burn Token';
  const description = t('burn_token_description') || 'Burn your tokens easily';
  const url = `${SITE_URL}/dashboard/burn-token`;

  // Canonical should point to the current page's URL
  const canonicalPath = '/dashboard/burn-token';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard/burn-token',
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

export default function BurnTokenPage() {
  return <BurnTokenComponent />;
}

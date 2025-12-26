import Overview from '@/components/dashboard-layout/overview';
import type { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatcapdang.com';

  const title = 'Overview';
  const description = 'Enterprise-grade token management platform';
  const url = `${SITE_URL}/dashboard`;

  // Canonical should point to the current page's URL
  const canonicalPath = '/dashboard';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard',
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'NhatCapDang',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: 'website',
    },
  };
};

export default function Page({
  pool,
  'create-liquidity': createLiquidity,
}: {
  pool: React.ReactNode;
  'create-liquidity': React.ReactNode;
}) {
  return (
    <>
      {pool}
      {createLiquidity}
      <Overview />
    </>
  );
}

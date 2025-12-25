import { CreateTokenComponent } from '@/components/dashboard-layout';
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

  const title = t('create_token') || 'Create Token';
  const description =
    'Create your meme coin on Solana in seconds. No code, no KYC, no fees required. Start building your token today!';
  const url = `${SITE_URL}/dashboard/create-token`;

  // Canonical should point to the current page's URL
  const canonicalPath = '/dashboard/create-token';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard/create-token',
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
          alt: 'Create Meme Coin on Solana - Launch Your Token Free',
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

export default function CreateTokenPage() {
  return <CreateTokenComponent />;
}

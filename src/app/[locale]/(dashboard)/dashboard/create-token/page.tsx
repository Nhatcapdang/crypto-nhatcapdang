import { CreateTokenComponent } from '@/components/dashboard-layout';
import type { Metadata } from 'next';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  const title =
    'Create Your Meme Coin in Seconds, No Code Required, No KYC, No Fees';
  const description =
    'Create your meme coin in seconds with no code required no KYC no fees. New millionaire on the way. Millions of users are already using NhatCapDang to create, burn, update, and trade meme coins. Launch your meme coin in seconds.';
  const url = 'https://nhatcapdang.com/dashboard/create-token';

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

export default function CreateTokenPage() {
  return <CreateTokenComponent />;
}

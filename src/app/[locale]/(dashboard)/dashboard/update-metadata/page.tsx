import { UpdateMetadataComponent } from '@/components/dashboard-layout';
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

  const title = t('update_metadata') || 'Update Metadata';
  const description =
    t('update_token_description') || 'Modify token metadata on the fly';
  const url = `${SITE_URL}/dashboard/update-metadata`;

  // Canonical should point to the default locale (English)
  const canonicalPath = '/dashboard/update-metadata';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi/dashboard/update-metadata',
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
          alt: 'Update Token Metadata - Modify Token Info on Solana',
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

export default function UpdateMetadataPage() {
  return <UpdateMetadataComponent />;
}

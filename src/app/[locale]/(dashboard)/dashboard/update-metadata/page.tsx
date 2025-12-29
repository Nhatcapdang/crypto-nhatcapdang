import UpdateMetadataComponent from '@/components/dashboard-layout/update-metadata';
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
    title: t('metadata.update_token.title'),
    description: t('metadata.update_token.description'),
    keywords: t.raw('metadata.update_token.keywords'),
    alternates: {
      canonical: '/dashboard/update-metadata',
      languages: {
        en: '/dashboard/update-metadata',
        vi: '/vi/dashboard/update-metadata',
        hi: '/hi/dashboard/update-metadata',
        'zh-HK': '/zh-HK/dashboard/update-metadata',
        fr: '/fr/dashboard/update-metadata',
      },
    },
    openGraph: {
      title: {
        template: t('metadata.update_token.title'),
        default: t('metadata.update_token.title'),
      },
      description: t('metadata.update_token.description'),
      url: 'https://nhatcapdang.com/dashboard/update-metadata',
      siteName: 'NhatCapDang',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          width: 1200,
          height: 630,
          alt: t('metadata.update_token.title'),
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadata.update_token.title'),
      description: t('metadata.update_token.description'),
      images: ['https://nhatcapdang.com/images/nhatcapdang.png'],
    },
  };
};

export default function UpdateMetadataPage() {
  return <UpdateMetadataComponent />;
}

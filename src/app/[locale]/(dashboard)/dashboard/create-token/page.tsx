import CreateTokenComponent from '@/components/dashboard-layout/create-token';
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
    metadataBase: new URL('https://nhatcapdang.com'),
    title: {
      template: t('metadata.create_token.title'),
      default: t('metadata.create_token.title'),
    },
    description: t('metadata.create_token.description'),
    keywords: t.raw('metadata.create_token.keywords'),
    openGraph: {
      title: {
        template: t('metadata.create_token.title'),
        default: t('metadata.create_token.title'),
      },
      siteName: 'Nhatcapdang',
      description: t('metadata.create_token.description'),
      url: 'https://nhatcapdang.com/dashboard/create-token',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: t('metadata.create_token.title'),
        },
      ],
    },
    alternates: {
      canonical: '/dashboard/create-token',
      languages: {
        en: '/dashboard/create-token',
        vi: '/vi/dashboard/create-token',
      },
    },
    assets: ['https://nhatcapdang.com/images/nhatcapdang.png'],
    creator: 'Nhatcapdang',
    twitter: {
      card: 'summary_large_image',
      title: {
        template: t('metadata.create_token.title'),
        default: t('metadata.create_token.title'),
      },
      description: t('metadata.create_token.description'),
    },
  };
};

export default function CreateTokenPage() {
  return <CreateTokenComponent />;
}

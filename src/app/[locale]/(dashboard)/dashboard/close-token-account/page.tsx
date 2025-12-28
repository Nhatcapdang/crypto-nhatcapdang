import CloseTokenAccountComponent from '@/components/dashboard-layout/close-token-account';
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
    title: t('metadata.close_token_account.title'),
    description: t('metadata.close_token_account.description'),
    keywords: t.raw('metadata.close_token_account.keywords'),
    alternates: {
      canonical: '/dashboard/close-token-account',
      languages: {
        en: '/dashboard/close-token-account',
        vi: '/vi/dashboard/close-token-account',
      },
    },
    openGraph: {
      title: {
        template: t('metadata.close_token_account.title'),
        default: t('metadata.close_token_account.title'),
      },
      description: t('metadata.close_token_account.description'),
      url: 'https://nhatcapdang.com/dashboard/close-token-account',
      siteName: 'NhatCapDang',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          width: 1200,
          height: 630,
          alt: t('metadata.close_token_account.title'),
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metadata.close_token_account.title'),
      description: t('metadata.close_token_account.description'),
      images: ['https://nhatcapdang.com/images/nhatcapdang.png'],
    },
  };
};

export default function CloseTokenAccountPage() {
  return <CloseTokenAccountComponent />;
}

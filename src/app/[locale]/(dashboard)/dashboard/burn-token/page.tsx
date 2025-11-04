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

  return {
    title: t('burn_token') || 'Burn Token',
    description: t('burn_token_description') || 'Burn your tokens easily',
    alternates: {
      canonical: '/dashboard/burn-token',
      languages: {
        en: '/dashboard/burn-token',
        vi: '/vi/dashboard/burn-token',
      },
    },
  };
};

export default function BurnTokenPage() {
  return <BurnTokenComponent />;
}

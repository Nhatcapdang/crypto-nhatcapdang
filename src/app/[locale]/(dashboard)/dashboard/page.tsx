import Overview from '@/components/dashboard-layout/overview';
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
    title: t('overview') || 'Overview',
    description:
      t('enterprise_grade_token_management_platform') ||
      'Enterprise-grade token management platform',
    alternates: {
      canonical: '/dashboard',
      languages: {
        en: '/dashboard',
        vi: '/vi/dashboard',
      },
    },
  };
};

export default function Page() {
  return <Overview />;
}

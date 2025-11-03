import { CloseTokenAccountComponent } from '@/components/dashboard-layout/close-token-account';
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
    title: t('close_token_account') || 'Close Token Account',
    description:
      t('close_account_description') || 'Reclaim SOL from token accounts',
    alternates: {
      canonical: '/dashboard/close-token-account',
      languages: {
        en: '/dashboard/close-token-account',
        vi: '/vi/dashboard/close-token-account',
      },
    },
  };
};

export default function CloseTokenAccountPage() {
  return <CloseTokenAccountComponent />;
}

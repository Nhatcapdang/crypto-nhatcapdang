import CreateToken from '@/components/dashboard-layout/create-token';
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
    title: t('create_token') || 'Create Token',
    description:
      t('create_token_description') || 'Create your token in seconds',
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
  return (
    <section>
      <CreateToken />
    </section>
  );
}

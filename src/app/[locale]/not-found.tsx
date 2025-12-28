import { NotFound } from '@/components';
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
    title: t('not_found_page.title') || 'Page Not Found',
    description:
      t('not_found_page.title_suffix') ||
      'The page you are looking for has been deleted or does not exist.',
    robots: {
      index: false,
      follow: false,
    },
  };
};

export default function NotFoundPage() {
  return <NotFound />;
}

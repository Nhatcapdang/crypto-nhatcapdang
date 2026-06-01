import BurnTokenComponent from '@/components/dashboard-layout/burn-token';
import { PageSeo } from '@/components/seo';
import { generatePageMetadata, getSeoMessages } from '@/lib/seo';
import type { Metadata } from 'next';
import { AppConfig } from 'next-intl';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return generatePageMetadata({ locale, page: 'burnToken' });
};
export default async function BurnTokenPage({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}) {
  const { locale } = await params;
  const seo = await getSeoMessages(locale, 'burnToken');

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        locale={locale}
        path="/dashboard/burn-token"
        application
      />
      <BurnTokenComponent />
    </>
  );
}

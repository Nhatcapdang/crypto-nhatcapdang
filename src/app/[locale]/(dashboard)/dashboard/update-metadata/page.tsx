import UpdateMetadataComponent from '@/components/dashboard-layout/update-metadata';
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

  return generatePageMetadata({ locale, page: 'updateMetadata' });
};

export default async function UpdateMetadataPage({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}) {
  const { locale } = await params;
  const seo = await getSeoMessages(locale, 'updateMetadata');

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        locale={locale}
        path="/dashboard/update-metadata"
        application
      />
      <UpdateMetadataComponent />
    </>
  );
}

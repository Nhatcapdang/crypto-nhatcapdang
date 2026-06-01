import CreateTokenComponent from '@/components/dashboard-layout/create-token';
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

  return generatePageMetadata({ locale, page: 'createToken' });
};

export default async function CreateTokenPage({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}) {
  const { locale } = await params;
  const seo = await getSeoMessages(locale, 'createToken');

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        locale={locale}
        path="/dashboard/create-token"
        application
      />
      <CreateTokenComponent />
    </>
  );
}

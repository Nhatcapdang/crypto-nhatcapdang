import CloseTokenAccountComponent from '@/components/dashboard-layout/close-token-account';
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

  return generatePageMetadata({ locale, page: 'closeTokenAccount' });
};

export default async function CloseTokenAccountPage({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}) {
  const { locale } = await params;
  const seo = await getSeoMessages(locale, 'closeTokenAccount');

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        locale={locale}
        path="/dashboard/close-token-account"
        application
      />
      <CloseTokenAccountComponent />
    </>
  );
}

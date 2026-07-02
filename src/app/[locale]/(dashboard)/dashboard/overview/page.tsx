import { PageSeo } from '@/components/seo';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { generatePageMetadata, getSeoMessages } from '@/lib/seo';
import type { Metadata } from 'next';
import { AppConfig } from 'next-intl';
import { Plus } from 'lucide-react';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return generatePageMetadata({ locale, page: 'overview' });
};

export default async function OverviewPage({
  params,
  pool,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
  pool: React.ReactNode;
}) {
  const { locale } = await params;
  const seo = await getSeoMessages(locale, 'overview');

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        locale={locale}
        path="/dashboard/overview"
        application
      />
      {pool}
      <Link href="/dashboard/overview/create-liquidity">
        <Button>
          <Plus />
          Create Liquidity
        </Button>
      </Link>
    </>
  );
}

import Banner from '@/components/banner';
import Faq from '@/components/faq';
import Hero from '@/components/hero';
import Integration from '@/components/integration';
import { PageSeo } from '@/components/seo';
import Testimonial from '@/components/testimonial';
import { generatePageMetadata, getSeoMessages } from '@/lib/seo';
import { Metadata } from 'next';
import { AppConfig } from 'next-intl';

export const dynamic: 'auto' | 'force-dynamic' | 'error' | 'force-static' =
  'auto';
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}): Promise<Metadata> => {
  const { locale } = await params;

  return generatePageMetadata({ locale, page: 'home' });
};

export default async function Home({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}) {
  const { locale } = await params;
  const seo = await getSeoMessages(locale, 'home');

  return (
    <>
      <PageSeo
        title={seo.title}
        description={seo.description}
        locale={locale}
        path="/"
      />
      <main>
        <Hero />
        <Integration />
        <Testimonial />
        <Faq />
        <Banner />
      </main>
    </>
  );
}

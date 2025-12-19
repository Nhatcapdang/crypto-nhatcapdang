import { Banner, Faq, Hero, Integration, Testimonial } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const tLayout = await getTranslations({ locale, namespace: 'layout' });

  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatcapdang.com';

  const title = t('hero.titleHighlight')
    ? `${t('hero.titlePrefix')} ${t('hero.titleHighlight')} ${t('hero.titleSuffix')}`
    : 'Home';

  const description = t('hero.description') || 'Welcome to our platform';

  // Canonical should point to the current page's URL
  // This avoids Lighthouse warning about canonical pointing to hreflang location
  const canonicalPath = '/';

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        'x-default': canonicalPath,
        en: canonicalPath,
        vi: '/vi',
      },
    },
    openGraph: {
      title,
      description,
      url: SITE_URL,
      siteName: tLayout('title') || 'NhatCapDang',
      images: [
        {
          url: '/images/nhatcapdang.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/nhatcapdang.png'],
    },
  };
};

export default function Home() {
  return (
    <>
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

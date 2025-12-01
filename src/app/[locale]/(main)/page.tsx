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
          url: '/images/nhatcapdang-text.png',
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
      images: ['/images/nhatcapdang-text.png'],
    },
  };
};

async function SeoStructuredData() {
  const t = await getTranslations();
  const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatcapdang.com';

  const faq =
    (t.raw('faq.faq_question') as unknown as Array<{
      question: string;
      answer: string;
    }>) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'NhatCapDang',
        url: SITE_URL,
        logo: `${SITE_URL}/images/nhatcapdang-text.png`,
      },
      {
        '@type': 'WebSite',
        name: 'NhatCapDang',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      faq.length
        ? {
            '@type': 'FAQPage',
            mainEntity: faq.map(item => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: { '@type': 'Answer', text: item.answer },
            })),
          }
        : undefined,
    ].filter(Boolean),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Home() {
  return (
    <>
      <SeoStructuredData />
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

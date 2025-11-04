import { Banner, Faq, Hero, Integration, Testimonial } from '@/components';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import React from 'react';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const title = t('hero.titleHighlight')
    ? `${t('hero.titlePrefix')} ${t('hero.titleHighlight')} ${t('hero.titleSuffix')}`
    : 'Home';

  return {
    title,
    description: t('hero.description') || 'Welcome to our platform',
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        vi: '/vi',
      },
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
        logo: `${SITE_URL}/vercel.svg`,
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

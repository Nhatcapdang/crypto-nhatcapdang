import { Banner, Faq, Hero, Integration, Testimonial } from '@/components';
import { AnimatedSections } from '@/components/animated-sections';
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll';
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
        <RevealOnScroll effect="fade" duration={0.8} once>
          <Hero />
        </RevealOnScroll>

        <RevealOnScroll
          effect="slideUp"
          distance={40}
          delay={0.1}
          duration={0.6}
        >
          <AnimatedSections variant="building" />
        </RevealOnScroll>

        <RevealOnScroll
          effect="slideUp"
          distance={50}
          delay={0.2}
          duration={0.7}
        >
          <Integration />
        </RevealOnScroll>

        <RevealOnScroll
          effect="blurUp"
          blurAmount={12}
          distance={30}
          delay={0.1}
          duration={0.6}
        >
          <AnimatedSections variant="trusted" />
        </RevealOnScroll>

        <RevealOnScroll effect="zoom" scale={0.9} delay={0.15} duration={0.7}>
          <Testimonial />
        </RevealOnScroll>

        <RevealOnScroll
          effect="slideUp"
          distance={40}
          delay={0.1}
          duration={0.6}
        >
          <AnimatedSections variant="ready" />
        </RevealOnScroll>

        <RevealOnScroll effect="fade" delay={0.2} duration={0.8}>
          <Faq />
        </RevealOnScroll>

        <RevealOnScroll effect="zoomIn" scale={0.85} delay={0.1} duration={0.8}>
          <Banner />
        </RevealOnScroll>
      </main>
    </>
  );
}

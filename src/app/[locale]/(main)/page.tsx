import { Banner, Faq, Hero, Integration, Testimonial } from '@/components';
import { Metadata } from 'next';
import { AppConfig } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: AppConfig['Locale'] }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    metadataBase: new URL('https://nhatcapdang.com'),
    title: {
      template: '%s',
      default: t('metadata.home.title'),
    },
    description: t('metadata.home.description'),
    keywords: t.raw('metadata.home.keywords'),
    icons: {
      icon: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '48x48',
          type: 'image/x-icon',
        },
      ],
      apple: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          sizes: '180x180',
          type: 'image/png',
        },
      ],
      other: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          rel: 'icon',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          rel: 'icon',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
    alternates: {
      canonical: '/',
      languages: {
        en: '/',
        vi: '/vi',
        hi: '/hi',
        'zh-HK': '/zh-HK',
        fr: '/fr',
      },
    },
    authors: [
      {
        name: 'Nhatcapdang',
        url: 'https://nhatcapdang.com',
      },
    ],
    assets: ['https://nhatcapdang.com/images/nhatcapdang.png'],
    creator: 'Nhatcapdang',
    openGraph: {
      title: {
        template: '%s | Nhatcapdang',
        default: t('metadata.home.title'),
      },
      siteName: 'NhatCapDang',
      description: t('metadata.home.description'),
      url: 'https://nhatcapdang.com',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: t('metadata.home.title'),
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        template: '%s | Nhatcapdang',
        default: t('metadata.home.title'),
      },
      description: t('metadata.home.description'),
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

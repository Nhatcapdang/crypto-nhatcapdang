import { Banner, Faq, Hero, Integration, Testimonial } from '@/components';
import { getTranslations } from 'next-intl/server';
export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'layout' });

  return {
    metadataBase: new URL('https://nhatcapdang.com'),
    title: {
      template: '%s | NhatCapDang',
      default:
        'Create, Burn, Update, and Trade Meme Coin for Free. No Code Required. No KYC. No Fees. New millionaire on the way | NhatCapDang',
    },
    description:
      'Create, Burn, Update, and Trade Meme Coin for Free. No Code Required. No KYC. No Fees. Millions of users are already using NhatCapDang to create, burn, update, and trade meme coins. | NhatCapDang',
    keywords: t.raw('keywords') as string[],
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
    openGraph: {
      title: {
        template: '%s | NhatCapDang',
        default:
          'Create, Burn, Update, and Trade Meme Coin for Free. No Code Required. No KYC. No Fees. New millionaire on the way | NhatCapDang',
      },
      siteName: 'NhatCapDang',
      description:
        'Create, Burn, Update, and Trade Meme Coin for Free. No Code Required. No KYC. No Fees. Millions of users are already using NhatCapDang to create, burn, update, and trade meme coins. | NhatCapDang',
      url: 'https://nhatcapdang.com',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: 'Create, Burn, Update, and Trade Meme Coin for Free. No Code Required. No KYC. No Fees. New millionaire on the way | NhatCapDang',
        },
      ],
    },
    twitter: {
      card: 'Launch Your Meme Coin in Seconds, No Code Required, No KYC, No Fees',
      title: {
        template: '%s | NhatCapDang',
        default:
          'Create, Burn, Update, and Trade Meme Coin for Free. No Code Required. No KYC. No Fees. New millionaire on the way | NhatCapDang',
      },
      description:
        'Create, Burn, Update, and Trade Meme Coin for Free. No Code Required. No KYC. No Fees. Millions of users are already using NhatCapDang to create, burn, update, and trade meme coins. | NhatCapDang',
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

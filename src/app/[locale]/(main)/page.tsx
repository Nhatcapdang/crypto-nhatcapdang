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
      template: '%s',
      default: 'Launch Meme Coin - No Code, Free',
    },
    description:
      'Create a meme coin on Solana in minutes. No code required. Free tools for token creation, burning, metadata updates, and instant trading. Start today!',
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
        template: '%s',
        default: 'Launch Meme Coin - No Code, Free',
      },
      siteName: 'NhatCapDang',
      description:
        'Create a meme coin on Solana in minutes. No code required. Free tools for token creation, burning, metadata updates, and instant trading. Start today!',
      url: 'https://nhatcapdang.com',
      images: [
        {
          url: 'https://nhatcapdang.com/images/nhatcapdang.png',
          type: 'image/png',
          width: 1200,
          height: 630,
          alt: 'Launch Your Meme Coin on Solana - Create, Trade & Manage Tokens Free',
        },
      ],
    },
    twitter: {
      card: 'Launch Your Meme Coin on Solana - Create, Trade & Manage Tokens Free',
      title: {
        template: '%s',
        default: 'Launch Meme Coin - No Code, Free',
      },
      description:
        'Create a meme coin on Solana in minutes. No code required. Free tools for token creation, burning, metadata updates, and instant trading. Start today!',
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

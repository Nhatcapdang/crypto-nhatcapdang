import type { Metadata } from 'next';
import {
  SEO_DEFAULT_IMAGE,
  SEO_SITE_NAME,
  getAbsoluteImageUrl,
  getCanonicalPath,
  getCanonicalUrl,
  getLanguageAlternates,
  getSiteUrl,
} from './config';

export interface SeoMetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  locale: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  noIndex?: boolean;
  type?: 'website' | 'article';
}

export const createSeoMetadata = ({
  title,
  description,
  keywords,
  locale,
  path = '/',
  image = SEO_DEFAULT_IMAGE,
  imageAlt = title,
  noIndex = false,
  type = 'website',
}: SeoMetadataOptions): Metadata => {
  const imageUrl = getAbsoluteImageUrl(image);
  const canonicalPath = getCanonicalPath(locale, path);
  const canonicalUrl = getCanonicalUrl(locale, path);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    keywords,
    authors: [
      {
        name: SEO_SITE_NAME,
        url: getSiteUrl(),
      },
    ],
    creator: SEO_SITE_NAME,
    publisher: SEO_SITE_NAME,
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    alternates: {
      canonical: canonicalPath,
      languages: getLanguageAlternates(path),
    },
    icons: {
      icon: [
        {
          url: imageUrl,
          sizes: '16x16',
          type: 'image/png',
        },
        {
          url: imageUrl,
          sizes: '32x32',
          type: 'image/png',
        },
        {
          url: imageUrl,
          sizes: '48x48',
          type: 'image/png',
        },
      ],
      apple: [
        {
          url: imageUrl,
          sizes: '180x180',
          type: 'image/png',
        },
      ],
    },
    openGraph: {
      type,
      title,
      description,
      url: canonicalUrl,
      siteName: SEO_SITE_NAME,
      locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
          type: 'image/png',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
};

import {
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_IMAGE,
  SEO_SITE_NAME,
  getAbsoluteImageUrl,
  getCanonicalUrl,
  getSiteUrl,
} from './config';

export type JsonLd = Record<string, unknown>;

export interface WebPageStructuredDataOptions {
  title: string;
  description: string;
  locale: string;
  path?: string;
  image?: string;
}

export const createOrganizationStructuredData = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SEO_SITE_NAME,
  url: getSiteUrl(),
  logo: getAbsoluteImageUrl(SEO_DEFAULT_IMAGE),
  sameAs: [getSiteUrl()],
});

export const createWebsiteStructuredData = (): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SEO_SITE_NAME,
  url: getSiteUrl(),
  description: SEO_DEFAULT_DESCRIPTION,
  publisher: {
    '@type': 'Organization',
    name: SEO_SITE_NAME,
    logo: getAbsoluteImageUrl(SEO_DEFAULT_IMAGE),
  },
});

export const createWebPageStructuredData = ({
  title,
  description,
  locale,
  path = '/',
  image = SEO_DEFAULT_IMAGE,
}: WebPageStructuredDataOptions): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: title,
  description,
  url: getCanonicalUrl(locale, path),
  inLanguage: locale,
  image: getAbsoluteImageUrl(image),
  isPartOf: {
    '@type': 'WebSite',
    name: SEO_SITE_NAME,
    url: getSiteUrl(),
  },
});

export const createSoftwareApplicationStructuredData = ({
  title,
  description,
  locale,
  path = '/',
  image = SEO_DEFAULT_IMAGE,
}: WebPageStructuredDataOptions): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: title,
  description,
  url: getCanonicalUrl(locale, path),
  image: getAbsoluteImageUrl(image),
  applicationCategory: 'FinanceApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
});

export const createBreadcrumbStructuredData = (
  items: Array<{ name: string; path: string; locale: string }>,
): JsonLd => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: getCanonicalUrl(item.locale, item.path),
  })),
});

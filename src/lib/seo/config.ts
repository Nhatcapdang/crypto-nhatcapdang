import { routing } from '@/i18n/routing';

export const SEO_SITE_NAME = 'Nhatcapdang';
export const SEO_SITE_TITLE = 'Nhatcapdang - Solana Meme Coin Tools';
export const SEO_DEFAULT_DESCRIPTION =
  'Create, trade, and manage Solana meme coins with no-code token tools.';
export const SEO_DEFAULT_IMAGE = '/images/nhatcapdang.png';

export const SEO_BASE_PATHS = [
  '/',
  '/dashboard',
  '/dashboard/overview',
  '/dashboard/create-token',
  '/dashboard/update-metadata',
  '/dashboard/burn-token',
  '/dashboard/close-token-account',
  '/dashboard/pool',
  '/dashboard/create-liquidity',
  '/dashboard/close-position',
] as const;

export type SeoBasePath = (typeof SEO_BASE_PATHS)[number];
export type SeoLocale = (typeof routing.locales)[number];

export const getSiteUrl = () => {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://nhatcapdang.com';

  return siteUrl.replace(/\/$/, '');
};

export const getAbsoluteUrl = (path = '/') => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${getSiteUrl()}${normalizedPath === '/' ? '' : normalizedPath}`;
};

export const getCanonicalPath = (locale: string, path: string) => {
  const normalizedPath = path === '/' ? '' : path;

  if (locale === routing.defaultLocale) {
    return normalizedPath || '/';
  }

  return `/${locale}${normalizedPath}`;
};

export const getCanonicalUrl = (locale: string, path: string) =>
  getAbsoluteUrl(getCanonicalPath(locale, path));

export const getLanguageAlternates = (path: string) =>
  Object.fromEntries(
    routing.locales.map(locale => [locale, getCanonicalPath(locale, path)]),
  );

export const getAbsoluteImageUrl = (image = SEO_DEFAULT_IMAGE) => {
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }

  return getAbsoluteUrl(image);
};

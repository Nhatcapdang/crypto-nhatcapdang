import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import type { SeoBasePath, SeoLocale } from './config';
import { createSeoMetadata } from './metadata';

export const SEO_PAGES = {
  home: {
    metadataKey: 'home',
    path: '/',
    application: false,
  },
  dashboard: {
    metadataKey: 'overview',
    path: '/dashboard',
    application: true,
  },
  overview: {
    metadataKey: 'overview',
    path: '/dashboard/overview',
    application: true,
  },
  createToken: {
    metadataKey: 'create_token',
    path: '/dashboard/create-token',
    application: true,
  },
  updateMetadata: {
    metadataKey: 'update_token',
    path: '/dashboard/update-metadata',
    application: true,
  },
  burnToken: {
    metadataKey: 'burn_token',
    path: '/dashboard/burn-token',
    application: true,
  },
  closeTokenAccount: {
    metadataKey: 'close_token_account',
    path: '/dashboard/close-token-account',
    application: true,
  },
  pool: {
    metadataKey: 'pool',
    path: '/dashboard/pool',
    application: true,
  },
  createLiquidity: {
    metadataKey: 'pool',
    path: '/dashboard/create-liquidity',
    application: true,
  },
  closePosition: {
    metadataKey: 'pool',
    path: '/dashboard/close-position',
    application: true,
  },
} as const satisfies Record<
  string,
  { metadataKey: string; path: SeoBasePath; application: boolean }
>;

export type SeoPageKey = keyof typeof SEO_PAGES;

export const getSeoMessages = async (locale: string, page: SeoPageKey) => {
  const t = await getTranslations({ locale: locale as SeoLocale });
  const metadataKey = SEO_PAGES[page].metadataKey;

  return {
    title: t(`metadata.${metadataKey}.title`),
    description: t(`metadata.${metadataKey}.description`),
    keywords: t.raw(`metadata.${metadataKey}.keywords`) as string[],
  };
};

export const generatePageMetadata = async ({
  locale,
  page,
}: {
  locale: SeoLocale;
  page: SeoPageKey;
}): Promise<Metadata> => {
  const seo = await getSeoMessages(locale, page);
  const pageConfig = SEO_PAGES[page];

  return createSeoMetadata({
    ...seo,
    locale,
    path: pageConfig.path,
  });
};

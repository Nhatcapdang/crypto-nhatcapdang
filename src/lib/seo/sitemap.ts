import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import {
  SEO_BASE_PATHS,
  getAbsoluteUrl,
  getCanonicalUrl,
  getLanguageAlternates,
} from './config';

const DASHBOARD_ROUTES = new Set<string>([
  '/dashboard',
  '/dashboard/overview',
  '/dashboard/create-token',
  '/dashboard/update-metadata',
  '/dashboard/burn-token',
  '/dashboard/close-token-account',
  '/dashboard/pool',
  '/dashboard/create-liquidity',
  '/dashboard/close-position',
]);

export const getSitemapEntries = (): MetadataRoute.Sitemap => {
  const now = new Date();

  return SEO_BASE_PATHS.flatMap(path =>
    routing.locales.map(locale => ({
      url: getCanonicalUrl(locale, path),
      lastModified: now,
      changeFrequency: DASHBOARD_ROUTES.has(path) ? 'weekly' : 'monthly',
      priority: path === '/' ? 1 : DASHBOARD_ROUTES.has(path) ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(
          Object.entries(getLanguageAlternates(path)).map(
            ([alternateLocale, alternatePath]) => [
              alternateLocale,
              getAbsoluteUrl(alternatePath),
            ],
          ),
        ),
      },
    })),
  );
};

import type { MetadataRoute } from 'next';
import { getAbsoluteUrl, getSiteUrl } from './config';

export const getRobotsConfig = (): MetadataRoute.Robots => ({
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: ['/api/', '/_next/', '/dashboard/test'],
  },
  sitemap: getAbsoluteUrl('/sitemap.xml'),
  host: getSiteUrl(),
});

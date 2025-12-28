import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/i18n/request.ts',
  experimental: {
    createMessagesDeclaration: './messages/en.json',
  },
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  htmlLimitedBots: /.*/,
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*',
        destination: 'https://api.orca.so/v2/:path*',
      },
      {
        source: '/api/v3/:path*',
        destination: 'https://api.dexscreener.com/latest/dex/:path*',
      },
      {
        source: '/api/v4/:path*',
        destination: 'https://api.jup.ag/ultra/v1/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);

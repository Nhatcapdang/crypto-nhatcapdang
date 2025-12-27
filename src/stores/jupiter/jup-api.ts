import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface SearcjResponse {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  decimals: number;
  dev: string;
  circSupply: number;
  totalSupply: number;
  tokenProgram: string;
  firstPool: {
    id: string;
    // ISO date string
    createdAt: string;
  };
  holderCount: number;
  audit: {
    isSus: boolean;
    mintAuthorityDisabled: boolean;
    freezeAuthorityDisabled: boolean;
    topHoldersPercentage: number;
    devBalancePercentage: number;
    devMints: number;
    highSingleOwnership: boolean;
    blockaidHoneypot: boolean;
  };
  organicScore: number;
  organicScoreLabel: string;
  tags: string[];
  stats24h: {
    holderChange: number;
    buyVolume: number;
    sellVolume: number;
    numBuys: number;
    numSells: number;
    numTraders: number;
    numNetBuyers: number;
  };
  // ISO date string
  updatedAt: string;
}

export const jupiterApi = createApi({
  reducerPath: 'jupiter-api',
  tagTypes: ['jupiter-api'],
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v4',
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_JUPITER_API_KEY || '',
    },
  }),
  endpoints: builder => ({
    searchTokens: builder.query<SearcjResponse[], { query: string }>({
      query: params => ({
        url: '/search',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useSearchTokensQuery } = jupiterApi;
export const { endpoints, reducerPath, reducer, middleware } = jupiterApi;

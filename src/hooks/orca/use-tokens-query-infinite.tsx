import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';

type Token = {
  address: string;
  mintAuthority: string | null;
  supply: number;
  decimals: number;
  isInitialized: boolean;
  freezeAuthority: string | null;
  tokenProgram: string;
  extensions: Record<string, unknown>;
  tags: unknown[];
  updatedEpoch: number;
  updatedAt: string;
  priceUsdc: number | null;
  metadata: {
    description: string;
    image: string;
    name: string;
    risk: number;
    symbol: string;
  };
  stats: {
    '24h': {
      volume: number | null;
    };
  } | null;
};

type UseTokensQueryResponse = {
  data: Token[];
  meta: {
    cursor: {
      previous: string | null;
      next: string | null;
    };
  };
};

enum SortBy {
  MINT_ID = 'mint_id',
  ADDRESS = 'address',
  VOLUME_24H = 'volume_24h',
}
type Params = {
  next?: string;
  previous?: string;
  /** Maximum number of tokens to return (default: 50, max: 3000) */
  size?: number;
  /** default: mint_id */
  sort_by?: SortBy;
  /** default: asc */
  sort_direction?: 'asc' | 'desc';
  /** Mint address to filter by */
  tokens?: string;
};

export const useTokensQueryInfinite = (
  params?: Omit<Params, 'next' | 'previous'>,
) => {
  const query = useInfiniteQuery<
    UseTokensQueryResponse,
    Error,
    InfiniteData<UseTokensQueryResponse>
  >({
    queryKey: ['use-tokens-query-infinite', params],
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 5, // 5 minutes
    queryFn: async ({ pageParam, ..._params }) => {
      const response = await axios.get<UseTokensQueryResponse>(
        '/api/v2/solana/tokens',
        { params: { ...params, next: pageParam } },
      );
      return response.data;
    },
    getNextPageParam: lastPage => {
      return lastPage.meta.cursor.next;
    },
    getPreviousPageParam: firstPage => {
      return firstPage.meta.cursor.previous;
    },
    initialPageParam: undefined,
  });
  const flattenedData = query.data?.pages.flatMap(page => page.data) ?? [];
  return {
    ...query,
    data: flattenedData,
  };
};
export type UseTokensQueryInfiniteResponse = NonNullable<
  ReturnType<typeof useTokensQueryInfinite>['data']
>;

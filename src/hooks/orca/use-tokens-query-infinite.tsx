import { QUERY_KEY } from '@/constants';
import {
  InfiniteData,
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
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

type Meta = {
  cursor?: {
    previous?: string;
    next?: string;
  };
};

type UseTokensQueryResponse = {
  data: Token[];
  meta: Meta;
};

type SingleTokenResponse = {
  data: Token;
  meta: Meta;
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
  const query = useInfiniteQuery<UseTokensQueryResponse, Error, Token[]>({
    queryKey: [QUERY_KEY.useTokensQueryInfinite, params],
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
      return lastPage.meta?.cursor?.next;
    },
    getPreviousPageParam: firstPage => {
      return firstPage.meta?.cursor?.previous;
    },
    initialPageParam: undefined,
    select(data) {
      return data?.pages.flatMap(page => page.data);
    },
  });
  return query;
};
export type UseTokensQueryInfiniteResponse = NonNullable<
  ReturnType<typeof useTokensQueryInfinite>['data']
>;

export const updateInfiniteQueryCache = (
  queryClient: ReturnType<typeof useQueryClient>,
  tokenData: SingleTokenResponse,
  params?: Omit<Params, 'next' | 'previous'>,
) => {
  queryClient.setQueryData<InfiniteData<UseTokensQueryResponse>>(
    [QUERY_KEY.useTokensQueryInfinite, params],
    oldData => {
      if (!oldData) {
        // If no existing data, create new structure
        return {
          pages: [
            {
              data: [tokenData.data],
              meta: tokenData.meta,
            },
          ],
          pageParams: [undefined],
        };
      }

      // Check if token already exists in the cache
      const tokenExists = oldData.pages.some(page =>
        page.data.some(token => token.address === tokenData.data.address),
      );

      if (tokenExists) {
        // Update existing token
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            data: page.data.map(token =>
              token.address === tokenData.data.address ? tokenData.data : token,
            ),
          })),
        };
      } else {
        // Add new token to the first page
        const updatedPages = [...oldData.pages];
        if (updatedPages.length > 0) {
          updatedPages[0] = {
            ...updatedPages[0],
            data: [tokenData.data, ...updatedPages[0].data],
          };
        } else {
          // If no pages exist, create the first page
          updatedPages.push({
            data: [tokenData.data],
            meta: tokenData.meta,
          });
        }

        return {
          ...oldData,
          pages: updatedPages,
        };
      }
    },
  );
};

export const useTokenByMintQuery = (mintAddress: string | null) => {
  const queryClient = useQueryClient();

  return useQuery<SingleTokenResponse, Error, SingleTokenResponse>({
    queryKey: [QUERY_KEY.useTokenByMintQuery, mintAddress],
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (individual tokens don't change as often)
    enabled: !!mintAddress,
    queryFn: async () => {
      const response = await axios.get<SingleTokenResponse>(
        `/api/v2/solana/tokens/${mintAddress}`,
      );
      return response.data;
    },
    select: data => {
      updateInfiniteQueryCache(queryClient, data, undefined);
      return data;
    },
  });
};

export const useTokensSearchQuery = ({ q }: { q: string | null }) => {
  return useQuery<UseTokensQueryResponse, Error>({
    queryKey: ['use-tokens-search-query', q],
    staleTime: 1000 * 60 * 2, // 2 minutes (search results change more frequently)
    gcTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!q,
    queryFn: async () => {
      const response = await axios.get<UseTokensQueryResponse>(
        '/api/v2/solana/tokens/search',
        {
          params: { q },
        },
      );
      return response.data;
    },
  });
};

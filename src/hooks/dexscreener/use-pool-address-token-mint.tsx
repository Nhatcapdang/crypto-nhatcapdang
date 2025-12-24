import { isPublicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Pair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd: string;
  txns: {
    m5: {
      buys: number;
      sells: number;
    };
    h1: {
      buys: number;
      sells: number;
    };
    h6: {
      buys: number;
      sells: number;
    };
    h24: {
      buys: number;
      sells: number;
    };
  };
  volume: {
    h24: number;
    h6: number;
    h1: number;
    m5: number;
  };
  priceChange: {
    m5: number;
    h24: number;
  };
  liquidity: {
    usd: number;
    base: number;
    quote: number;
  };
  fdv: number;
  marketCap: number;
  // timestamp in milliseconds
  pairCreatedAt: number;
  info: {
    imageUrl: string;
    openGraph: string;
    websites: string[];
    socials: {
      url: string;
      type: string;
    }[];
  };
}
interface PoolAddressTokenMintResponse {
  schemaVersion: string;
  pairs: Pair[];
}
const usePoolAddressTokenMint = (mintAddress: string) => {
  return useQuery<PoolAddressTokenMintResponse, Error>({
    queryKey: ['pool-address-token-mint', mintAddress],
    staleTime: Infinity, // 5 minutes
    gcTime: Infinity,
    enabled: isPublicKey(mintAddress),
    queryFn: async () => {
      const response = await axios.get<PoolAddressTokenMintResponse>(
        `/api/v3/tokens/${mintAddress}`,
      );
      return response.data;
    },
  });
};

export default usePoolAddressTokenMint;

export type UsePoolAddressTokenMintResponse = NonNullable<
  ReturnType<typeof usePoolAddressTokenMint>['data']
>;

import { QUERY_KEY } from '@/constants';
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { isPublicKey, publicKey } from '@metaplex-foundation/umi';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useUmi } from '.';
import { UseAllDigitalAssetByOwnerResponse } from './use-all-digital-asset-by-owner';

export const useFetchDigitalAssetQuery = (mintAddress: string) => {
  const { umi, connected } = useUmi();
  const queryClient = useQueryClient();

  const selectFn = useMemo(
    () => (data: UseAllDigitalAssetByOwnerResponse[number]) => {
      queryClient.setQueryData<UseAllDigitalAssetByOwnerResponse>(
        [QUERY_KEY.useAllDigitalAssetByOwner],
        (oldData = []) => {
          return [data, ...oldData];
        },
      );
      return data;
    },
    [queryClient],
  );

  return useQuery({
    queryKey: [QUERY_KEY.useFetchDigitalAssetQuery, mintAddress],
    staleTime: Infinity, // 5 minutes
    gcTime: Infinity, // 10 minutes (individual tokens don't change as often)
    enabled: connected && isPublicKey(mintAddress),
    queryFn: async () => {
      const digitalAsset = await fetchDigitalAsset(umi, publicKey(mintAddress));
      const res = await umi.downloader.downloadJson<{
        name: string;
        symbol: string;
        image: string;
        description: string;
        website: string;
        telegram: string;
        twitter: string;
        discord: string;
      }>(digitalAsset.metadata.uri);
      return {
        ...digitalAsset,
        ...res,
      };
    },
    select: selectFn,
  });
};
export type UseFetchDigitalAssetResponse = NonNullable<
  ReturnType<typeof useFetchDigitalAssetQuery>['data']
>;

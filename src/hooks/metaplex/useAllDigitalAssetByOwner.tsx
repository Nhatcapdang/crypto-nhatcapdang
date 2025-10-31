import { QUERY_KEY } from '@/constants';
import { fetchAllDigitalAssetByOwner } from '@metaplex-foundation/mpl-token-metadata';
import { useQuery } from '@tanstack/react-query';
import { useUmi } from '.';

export const useAllDigitalAssetByOwner = () => {
  const { umi, connected } = useUmi();

  return useQuery({
    queryKey: [QUERY_KEY.useAllDigitalAssetByOwner],
    queryFn: async () => {
      const responses = await fetchAllDigitalAssetByOwner(
        umi,
        umi.identity.publicKey,
      );

      const data = await Promise.allSettled(
        responses.map(async item => {
          const res = await umi.downloader.downloadJson<{
            name: string;
            symbol: string;
            image: string;
            description: string;
          }>(item.metadata.uri);
          return {
            ...item,
            ...res,
          };
        }),
      );

      const results = data.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        return {
          ...responses[index],
          image: 'https://dummyimage.com/60x60/000/fff',
          name: 'Unknown',
          symbol: 'Unknown',
          description: 'Unknown',
        };
      });
      return results;
    },
    enabled: connected,
    staleTime: 30000, // 30 seconds
  });
};

export type UseAllDigitalAssetByOwnerResponse = NonNullable<
  ReturnType<typeof useAllDigitalAssetByOwner>['data']
>;

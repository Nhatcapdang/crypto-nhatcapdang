import { QUERY_KEY } from '@/constants';
import {
  DigitalAsset,
  fetchAllDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';
import { assign, uniq, zipWith } from 'lodash';
import { useUmi } from '.';

export const useFetchAllDigitalAsset = (mints: string[]) => {
  const { umi } = useUmi();
  return useQuery<
    (DigitalAsset & {
      name: string;
      symbol: string;
      image: string;
      description: string;
    })[]
  >({
    queryKey: [QUERY_KEY.useFetchAllDigitalAsset, uniq(mints)],
    enabled: mints.length > 0,
    staleTime: Infinity,
    queryFn: async () => {
      const mintKey = mints.map(mint => publicKey(mint));
      const digitalAsset = await fetchAllDigitalAsset(umi, mintKey);
      const data = await Promise.allSettled(
        digitalAsset.map(async item => {
          const res = await umi.downloader.downloadJson<{
            name: string;
            symbol: string;
            image: string;
            description: string;
            website: string;
            telegram: string;
            twitter: string;
            discord: string;
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
          ...digitalAsset[index],
          image: 'https://dummyimage.com/60x60/000/fff',
          name: 'Unknown',
          symbol: 'Unknown',
          description: 'Unknown',
          website: 'Unknown',
          telegram: 'Unknown',
          twitter: 'Unknown',
          discord: 'Unknown',
        };
      });
      // merge two arrays of {
      // }s element by element into one combined array
      //      _.zipWith(a, b, _.assign) → goes through both arrays index by index.
      //_.assign merges the objects at each index.
      return zipWith(digitalAsset, results, assign);
    },
  });
};

export type UseFetchAllDigitalAssetResponse = NonNullable<
  ReturnType<typeof useFetchAllDigitalAsset>['data']
>;

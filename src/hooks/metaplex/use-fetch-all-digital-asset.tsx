import { QUERY_KEY } from '@/constants';
import {
  DigitalAsset,
  fetchAllDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { useQuery } from '@tanstack/react-query';
import { assign, zipWith } from 'lodash';
import { useUmi } from '.';

export const useFetchAllDigitalAsset = (mints: string[]) => {
  const { umi } = useUmi();
  return useQuery<DigitalAsset[]>({
    queryKey: [QUERY_KEY.useFetchAllDigitalAsset, mints],
    enabled: mints.length > 0,
    queryFn: async () => {
      const mintKey = mints.map(mint => publicKey(mint));
      const digitalAsset = await fetchAllDigitalAsset(umi, mintKey);
      const res = await umi.downloader.download(
        digitalAsset.map(item => item.metadata.uri),
      );
      // merge two arrays of {
      // }s element by element into one combined array
      //      _.zipWith(a, b, _.assign) → goes through both arrays index by index.
      //_.assign merges the objects at each index.
      console.log('s', zipWith(digitalAsset, res, assign));
      return zipWith(digitalAsset, res, assign);
    },
  });
};

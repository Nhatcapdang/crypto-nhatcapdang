import { QUERY_KEY } from '@/constants';
import {
  DigitalAsset,
  fetchAllDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assign, uniqBy, zipWith } from 'lodash';
import { useUmi } from '.';

export const useFetchAllDigitalAssetMutation = () => {
  const { umi } = useUmi();
  const queryClient = useQueryClient();
  return useMutation<
    (DigitalAsset & {
      name: string;
      symbol: string;
      image: string;
      description: string;
    })[],
    Error,
    string[]
  >({
    mutationKey: [QUERY_KEY.useFetchAllDigitalAssetMutation],

    mutationFn: async mints => {
      const mintKey = mints.map(mint => publicKey(mint));
      const digitalAsset = await fetchAllDigitalAsset(umi, mintKey);
      const res = await umi.downloader.download(
        digitalAsset.map(item => item.metadata.uri),
      );
      return zipWith(digitalAsset, res, assign);
    },
    onSuccess: data => {
      queryClient.setQueryData<
        (DigitalAsset & {
          name: string;
          symbol: string;
          image: string;
          description: string;
        })[]
      >([QUERY_KEY.useFetchAllDigitalAsset], (oldData = []) => {
        return uniqBy([...data, ...oldData], 'mint.publicKey');
      });
    },
  });
};

export type UseFetchAllDigitalAssetMutationResponse = NonNullable<
  ReturnType<typeof useFetchAllDigitalAssetMutation>['data']
>;

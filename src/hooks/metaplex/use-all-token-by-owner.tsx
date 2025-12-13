import { QUERY_KEY } from '@/constants';
import { fetchAllTokenByOwner } from '@metaplex-foundation/mpl-toolbox';
import { useQuery } from '@tanstack/react-query';
import { useUmi } from '.';

export const useAllTokenByOwnerQuery = (
  options?: Parameters<typeof fetchAllTokenByOwner>[2],
) => {
  const { umi, connected } = useUmi();

  return useQuery({
    queryKey: [QUERY_KEY.useAllTokenByOwner, options],
    queryFn: async () => {
      const responses = await fetchAllTokenByOwner(
        umi,
        umi.identity.publicKey,
        options,
      );
      return responses;
    },
    enabled: connected,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export type UseAllTokenByOwnerResponse = NonNullable<
  ReturnType<typeof useAllTokenByOwnerQuery>['data']
>;

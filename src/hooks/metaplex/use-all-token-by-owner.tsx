import { QUERY_KEY } from '@/constants';
import { fetchAllTokenByOwner } from '@metaplex-foundation/mpl-toolbox';
import { useQuery } from '@tanstack/react-query';
import { useUmi } from '.';

export const useAllTokenByOwnerQuery = () => {
  const { umi, connected } = useUmi();

  return useQuery({
    queryKey: [QUERY_KEY.useAllTokenByOwner],
    queryFn: async () => {
      const responses = await fetchAllTokenByOwner(umi, umi.identity.publicKey);
      return responses;
    },
    enabled: connected,
    staleTime: 30000,
  });
};

export type UseAllTokenByOwnerResponse = NonNullable<
  ReturnType<typeof useAllTokenByOwnerQuery>['data']
>;

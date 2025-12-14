import { QUERY_KEY } from '@/constants';
import { fetchAllTokenByOwner } from '@metaplex-foundation/mpl-toolbox';
import { useQuery } from '@tanstack/react-query';
import { useUmi } from '.';

/**
 * Serializes options object for use in query key, handling functions properly
 */
function serializeOptions(
  options?: Parameters<typeof fetchAllTokenByOwner>[2],
): string {
  if (!options) return 'no-options';

  const serialized: Record<string, unknown> = {};

  // Handle tokenAmountFilter function by converting to string representation
  if (options.tokenAmountFilter) {
    // Create a stable identifier based on the function's string representation
    const fnString = options.tokenAmountFilter.toString();
    serialized.tokenAmountFilter = fnString;
  }

  // Handle other options that can be JSON serialized
  const otherOptions = { ...options };
  delete otherOptions.tokenAmountFilter;

  const otherSerialized = JSON.stringify(otherOptions);
  const filterSerialized = serialized.tokenAmountFilter
    ? `filter:${serialized.tokenAmountFilter}`
    : '';

  return [otherSerialized, filterSerialized].filter(Boolean).join('|');
}

export const useAllTokenByOwnerQuery = (
  options?: Parameters<typeof fetchAllTokenByOwner>[2],
) => {
  const { umi, connected } = useUmi();

  return useQuery({
    queryKey: [QUERY_KEY.useAllTokenByOwner, serializeOptions(options)],
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

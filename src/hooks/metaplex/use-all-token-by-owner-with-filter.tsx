'use client';

import { QUERY_KEY } from '@/constants';
import { AmountBigInt } from '@/utils';
import { fetchAllTokenByOwner } from '@metaplex-foundation/mpl-toolbox';
import { useQuery } from '@tanstack/react-query';
import { useUmi } from '.';

export const useAllTokenByOwnerWithFilterQuery = () => {
  const { umi, connected } = useUmi();

  return useQuery({
    queryKey: [QUERY_KEY.useAllTokenByOwnerWithFilter],
    queryFn: async () => {
      const closableTokens = await fetchAllTokenByOwner(
        umi,
        umi.identity.publicKey,
        {
          tokenAmountFilter: amount => amount === BigInt(0),
        },
      );
      const notClosableTokens = await fetchAllTokenByOwner(
        umi,
        umi.identity.publicKey,
        {
          tokenAmountFilter: amount => amount !== BigInt(0),
        },
      );
      return [...closableTokens, ...notClosableTokens];
    },
    select(data) {
      const totalData = data.reduce(
        (acc, curr) => {
          const isClosable = curr.amount === BigInt(0);
          const rentLamports = Number(curr.header.lamports.basisPoints);
          const solAmount = AmountBigInt(
            rentLamports,
            curr.header.lamports.decimals,
          );
          if (isClosable) {
            acc.totalClosableToken++;
            acc.totalSOLRefundable += solAmount;
          } else {
            acc.totalNotClosableToken++;
            acc.totalSOLLocked += solAmount;
          }
          acc.totalToken++;
          return acc;
        },
        {
          totalToken: 0,
          totalClosableToken: 0,
          totalNotClosableToken: 0,
          totalSOLLocked: 0,
          totalSOLRefundable: 0,
        },
      );
      return {
        ...totalData,
        data,
      };
    },
    enabled: connected,
    staleTime: 30000,
  });
};

export type UseAllTokenByOwnerWithFilterResponse = NonNullable<
  ReturnType<typeof useAllTokenByOwnerWithFilterQuery>['data']
>;

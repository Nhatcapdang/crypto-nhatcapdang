import { QUERY_KEY } from '@/constants';
import { formatNumber } from '@/lib/utils';
import { AmountBigInt, getExplorerLink } from '@/utils';
import { closeToken } from '@metaplex-foundation/mpl-toolbox';
import { transactionBuilder } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TransactionSuccessDescription } from '.';
import { useAllTokenByOwnerWithFilterQuery } from './use-all-token-by-owner-with-filter';
import { useUmi } from './useUmi';

interface CloseTokenAccountResult {
  signature: string;
  solRefunded: number;
  solscanUrl: string;
  explorerUrl: string;
  txUrl: string;
}

export function useCloseTokenMutation() {
  const { umi } = useUmi();
  const queryClient = useQueryClient();
  const { data: allTokenByOwnerWithFilterData } =
    useAllTokenByOwnerWithFilterQuery();

  return useMutation<CloseTokenAccountResult, Error, void>({
    mutationFn: async () => {
      let txBuilder = transactionBuilder();
      let solRefunded = 0;
      allTokenByOwnerWithFilterData?.data?.forEach(token => {
        if (token.amount === BigInt(0)) {
          solRefunded += AmountBigInt(
            token.header.lamports.basisPoints,
            token.header.lamports.decimals,
          );
          const closeTokenIx = closeToken(umi, {
            account: token.publicKey,
            destination: umi.identity.publicKey,
            owner: umi.identity,
          });
          txBuilder = txBuilder.add(closeTokenIx);
        }
      });

      const tx = await txBuilder.sendAndConfirm(umi);

      const signature = base58.deserialize(tx.signature)[0];

      const { explorerUrl, solscanUrl, txUrl } = getExplorerLink({
        account: umi.identity.publicKey,
        signature,
      });

      return {
        signature,
        solRefunded,
        solscanUrl,
        explorerUrl,
        txUrl,
      };
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.useAllTokenByOwnerWithFilter],
      });
      toast.success('Close token account successfully', {
        duration: 15 * 1000,
        description: (
          <TransactionSuccessDescription
            mintAddress={`${formatNumber({
              value: data.solRefunded,
              digit: 8,
            })} SOL`}
            solscanUrl={data.txUrl}
          />
        ),
      });
    },
  });
}

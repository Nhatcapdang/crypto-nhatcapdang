import { QUERY_KEY } from '@/constants';
import { getExplorerLink } from '@/utils';
import {
  burnToken,
  BurnTokenInstructionAccounts,
  BurnTokenInstructionArgs,
} from '@metaplex-foundation/mpl-toolbox';
import { publicKey } from '@metaplex-foundation/umi';
import { base58 } from '@metaplex-foundation/umi/serializers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { TransactionSuccessDescription } from './use-create-mint-with-associated-token-mutation';
import { useUmi } from './useUmi';

export const useBurnTokenMutation = () => {
  const { umi } = useUmi();
  const queryClient = useQueryClient();
  return useMutation<
    {
      signature: string;
      explorerUrl: string;
      solscanUrl: string;
      txUrl: string;
    },
    Error,
    BurnTokenInstructionAccounts & BurnTokenInstructionArgs
  >({
    mutationKey: [QUERY_KEY.useBurnToken],
    mutationFn: async ({ account, mint, amount }) => {
      const tx = await burnToken(umi, {
        account,
        mint,
        amount,
      }).sendAndConfirm(umi);

      const signature = base58.deserialize(tx.signature)[0];
      const { explorerUrl, solscanUrl, txUrl } = getExplorerLink({
        account: publicKey(mint),
        signature,
      });

      return {
        signature,
        explorerUrl,
        solscanUrl,
        txUrl,
      };
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.useAllDigitalAssetByOwner],
      });
      toast('Token burned successfully', {
        duration: 15 * 1000,
        description: (
          <TransactionSuccessDescription
            mintAddress={data.signature}
            solscanUrl={data.txUrl}
          />
        ),
      });
    },
  });
};

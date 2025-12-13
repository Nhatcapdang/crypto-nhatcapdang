import { getExplorerLink } from '@/utils';
import { Percentage } from '@orca-so/common-sdk';
import { ORCA_WHIRLPOOL_PROGRAM_ID, PDAUtil } from '@orca-so/whirlpools-sdk';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrca } from './use-orca';

interface ClosePositionParams {
  positionMint: string;
}
export const useClosePosition = () => {
  const { whirlpoolClient } = useOrca();
  return useMutation<
    {
      signature: string;
      explorerUrl: string;
      solscanUrl: string;
      txUrl: string;
    },
    Error,
    ClosePositionParams
  >({
    mutationKey: ['useClosePosition'],
    mutationFn: async ({ positionMint }: ClosePositionParams) => {
      if (!whirlpoolClient) {
        throw new Error('Whirlpool client not found');
      }
      const _positionMint = await whirlpoolClient.getPosition(
        PDAUtil.getPosition(
          ORCA_WHIRLPOOL_PROGRAM_ID,
          new PublicKey(positionMint),
        ).publicKey,
      );
      const poolKey = _positionMint.getData().whirlpool.toString();

      const pool = await whirlpoolClient.getPool(poolKey);
      const tx = await pool.closePosition(
        _positionMint.getAddress(),
        Percentage.fromFraction(1, 100),
      );
      const txId = await tx[0].buildAndExecute();
      const { explorerUrl, solscanUrl, txUrl } = getExplorerLink({
        account: positionMint,
        signature: txId,
      });
      return {
        signature: txId,
        explorerUrl,
        solscanUrl,
        txUrl,
      };
    },
    onSuccess: data => {
      toast('Position closed successfully', {
        description: data.signature,
        action: {
          actionButtonStyle: {
            backgroundColor: 'var(--primary-foreground)',
            color: 'var(--primary)',
          },
          label: 'View on Solscan',
          onClick: () => {
            window.open(data.txUrl, '_blank');
          },
        },
      });
    },
  });
};

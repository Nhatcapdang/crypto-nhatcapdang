import { getExplorerLink, getSplashPoolAddress } from '@/utils';
import { ORCA_WHIRLPOOL_PROGRAM_ID, PDAUtil } from '@orca-so/whirlpools-sdk';
import { PublicKey, SendTransactionError } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useOrca } from './use-orca';

interface ClosePositionParams {
  tokenMintA: string;
  tokenMintB: string;
}
export const useClosePosition = () => {
  const { whirlpoolClient, isDevnet } = useOrca();
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
    mutationFn: async params => {
      if (!whirlpoolClient) {
        throw new Error('Whirlpool client not found');
      }
      const { tokenMintA, tokenMintB } = params;
      const tokenA = new PublicKey(tokenMintA);
      const tokenB = new PublicKey(tokenMintB);

      const poolKey = getSplashPoolAddress(tokenA, tokenB, isDevnet);
      const positionAddress = PDAUtil.getPosition(
        ORCA_WHIRLPOOL_PROGRAM_ID,
        poolKey,
      ).publicKey;

      const pool = await whirlpoolClient.getPool(poolKey);
      const position = await whirlpoolClient.getPosition(positionAddress);
      const positionData = position.getData();

      const txBuilder = await pool.closePosition(
        positionData.liquidity.amount,
        positionData.liquidity.tokenMint,
        positionData.liquidity.tokenVault,
        positionData.liquidity.tokenVault,
      );
      const txId = await txBuilder[0].buildAndExecute();
      const { explorerUrl, solscanUrl, txUrl } = getExplorerLink({
        account: positionAddress.toString(),
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
          label: 'View on Solscan',
          onClick: () => {
            window.open(data.solscanUrl, '_blank');
          },
        },
      });
    },
    onError: error => {
      const err = error as SendTransactionError;
      console.error('Failed to close position:', err.transactionError.logs);
      toast('Failed to close position', {
        description: err.message,
      });
    },
  });
};

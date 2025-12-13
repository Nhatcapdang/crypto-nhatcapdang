import { getExplorerLink, getSplashPoolAddress } from '@/utils';
import { Percentage } from '@orca-so/common-sdk';
import {
  TickUtil,
  TokenExtensionUtil,
  increaseLiquidityQuoteByInputToken,
} from '@orca-so/whirlpools-sdk';
import { PublicKey, SendTransactionError } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { toast } from 'sonner';
import { useOrca } from './use-orca';

interface OpenPositionParams {
  tokenMintA: string;
  tokenMintB: string;
  amountOfTokenA: number;
}
export const useOpenPosition = () => {
  const { whirlpoolClient, isDevnet } = useOrca();
  return useMutation<
    {
      signature: string;
      explorerUrl: string;
      solscanUrl: string;
      txUrl: string;
    },
    Error,
    OpenPositionParams
  >({
    mutationKey: ['useOpenPosition'],
    mutationFn: async params => {
      if (!whirlpoolClient) {
        throw new Error('Whirlpool client not found');
      }
      const { tokenMintA, tokenMintB, amountOfTokenA } = params;
      const tokenA = new PublicKey(tokenMintA);
      const tokenB = new PublicKey(tokenMintB);

      const poolKey = getSplashPoolAddress(tokenA, tokenB, isDevnet);
      // Check if pool exists before trying to fetch it
      //   const accountInfo = await whirlpoolClient
      //     .getContext()
      //     .connection.getAccountInfo(poolKey);

      //   if (!accountInfo) {
      //     throw new Error(
      //       'Pool does not exist yet. Create the pool first using createSplashPool or createPool.',
      //     );
      //   }

      const pool = await whirlpoolClient.getPool(poolKey);
      const poolData = pool.getData();
      const poolTokenAInfo = pool.getTokenAInfo();

      const tickSpacing = poolData.tickSpacing; // 32896

      const [tickLower, tickUpper] =
        TickUtil.getFullRangeTickIndex(tickSpacing);
      const tokenExtensionCtx =
        await TokenExtensionUtil.buildTokenExtensionContextForPool(
          whirlpoolClient.getContext().fetcher,
          tokenA,
          tokenB,
        );
      // Get a quote on the estimated liquidity and tokenIn (50 tokenA)
      const quote = increaseLiquidityQuoteByInputToken(
        poolTokenAInfo.mint,
        new Decimal(amountOfTokenA), // amount of tokenA to add to the pool
        tickLower,
        tickUpper,
        Percentage.fromFraction(1, 100), // 1% slippage tolerance
        pool,
        tokenExtensionCtx,
      );

      // const { tokenMaxA, tokenMaxB } = quote;

      // Construct the open position & increase_liquidity ix and execute the transaction.
      const { positionMint, tx } = await pool.openPosition(
        tickLower,
        tickUpper,
        quote,
      );
      const txId = await tx.buildAndExecute();
      const { explorerUrl, solscanUrl, txUrl } = getExplorerLink({
        account: positionMint.toString(),
        signature: txId,
      });
      //   // Fetch the newly created position with liquidity
      //   const position = await whirlpoolClient.getPosition(
      //     PDAUtil.getPosition(ORCA_WHIRLPOOL_PROGRAM_ID, positionMint).publicKey,
      //   );
      //   console.log('position', position, quote);
      console.log(
        'poolKey',
        poolKey.toString(),
        'positionMint',
        positionMint.toString(),
      );
      return {
        signature: txId,
        explorerUrl,
        solscanUrl,
        txUrl,
      };
    },
    onSuccess: data => {
      toast('Position opened successfully', {
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
      console.error('Failed to open position:', err.transactionError.logs);
      toast('Failed to open position', {
        description: err.transactionError.logs?.[3],
      });
    },
  });
};

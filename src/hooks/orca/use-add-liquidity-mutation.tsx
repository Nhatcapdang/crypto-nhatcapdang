'use client';

import { QUERY_KEY } from '@/constants';
import { getExplorerLink } from '@/utils';
import { PublicKey, SendTransactionError } from '@solana/web3.js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Decimal } from 'decimal.js';
import { toast } from 'sonner';
import { useOrcaProvider } from './use-orca-provider';

interface AddLiquidityParams {
  poolAddress: string;
  tokenAmountA: number; // Amount of token A (your token) in human-readable format
  tokenAmountB: number; // Amount of token B (SOL/USDC) in human-readable format
  tokenDecimalsA: number;
  tokenDecimalsB: number;
  tickLower?: number; // Optional: Lower tick for price range
  tickUpper?: number; // Optional: Upper tick for price range
  // If tickLower/tickUpper not provided, will use full range
}

interface AddLiquidityResult {
  positionMint: string;
  txId: string;
  explorerUrl: string;
  solscanUrl: string;
}

/**
 * Hook to add liquidity to an Orca Whirlpool
 * This opens a position in the pool with your tokens
 */
export function useAddLiquidityMutation() {
  const { client, ctx, isConnected } = useOrcaProvider();
  const queryClient = useQueryClient();

  return useMutation<
    AddLiquidityResult,
    SendTransactionError,
    AddLiquidityParams
  >({
    mutationFn: async params => {
      if (!client || !ctx || !isConnected) {
        throw new Error('Wallet not connected');
      }

      const poolAddress = new PublicKey(params.poolAddress);

      // Get pool data
      const pool = await (client as any).getPool(poolAddress);
      if (!pool) {
        throw new Error('Pool not found');
      }

      // Calculate tick range (full range if not provided)
      // These are standard tick values for full range positions
      const MIN_TICK = -443636;
      const MAX_TICK = 443636;
      const tickLower =
        params.tickLower !== undefined ? params.tickLower : MIN_TICK;
      const tickUpper =
        params.tickUpper !== undefined ? params.tickUpper : MAX_TICK;

      // Convert amounts to Decimal with proper decimals (raw token amounts)
      const tokenAmountARaw = new Decimal(params.tokenAmountA).mul(
        new Decimal(10).pow(params.tokenDecimalsA),
      );
      const tokenAmountBRaw = new Decimal(params.tokenAmountB).mul(
        new Decimal(10).pow(params.tokenDecimalsB),
      );

      // Get pool information
      const currentTick = pool.tickCurrentIndex;
      const tokenMintA = pool.tokenA.mint;
      const tokenMintB = pool.tokenB.mint;

      // Determine token order (tokens are ordered lexicographically by mint address)
      const isTokenAFirst = tokenMintA.toBase58() < tokenMintB.toBase58();

      // Import Orca SDK utilities for liquidity calculation
      // Note: The exact API may vary - this is a simplified approach
      try {
        const sdk = await import('@orca-so/whirlpools-sdk');
        const { PriceMath, PoolUtil } = sdk as any;

        // Calculate liquidity from token amounts
        const sqrtPriceLower = PriceMath?.tickIndexToSqrtPriceX64?.(tickLower);
        const sqrtPriceUpper = PriceMath?.tickIndexToSqrtPriceX64?.(tickUpper);

        if (sqrtPriceLower && sqrtPriceUpper && PoolUtil) {
          const liquidityEstimate = PoolUtil.estimateLiquidityFromTokenAmounts(
            currentTick,
            sqrtPriceLower,
            sqrtPriceUpper,
            isTokenAFirst
              ? tokenAmountARaw.toString()
              : tokenAmountBRaw.toString(),
            isTokenAFirst
              ? tokenAmountBRaw.toString()
              : tokenAmountARaw.toString(),
          );

          // Open position (add liquidity)
          const { positionMint, tx } = await (client as any).openPosition({
            pool: poolAddress,
            tickLowerIndex: tickLower,
            tickUpperIndex: tickUpper,
            liquidity: liquidityEstimate,
          });

          // Execute transaction
          const txId = await tx.buildAndExecute();

          const { explorerUrl, solscanUrl } = getExplorerLink({
            account: positionMint.toBase58(),
            signature: txId,
          });

          return {
            positionMint: positionMint.toBase58(),
            txId,
            explorerUrl,
            solscanUrl,
          };
        }
      } catch (error) {
        console.error('Error calculating liquidity:', error);
        throw new Error(
          'Failed to calculate liquidity. Please check your token amounts and pool configuration.',
        );
      }

      // If we reach here, the SDK utilities were not available
      throw new Error(
        'Liquidity calculation not available. Please ensure @orca-so/whirlpools-sdk is properly installed.',
      );
    },
    onError: error => {
      console.error('Add liquidity error:', error);
      toast.error('Failed to add liquidity', {
        duration: 15 * 1000,
        description: error.message,
      });
    },
    onSuccess: data => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.useAllDigitalAssetByOwner],
      });
      toast.success('Liquidity added successfully', {
        duration: 15 * 1000,
        description: `Position: ${data.positionMint.slice(0, 8)}...${data.positionMint.slice(-8)}`,
      });
    },
  });
}

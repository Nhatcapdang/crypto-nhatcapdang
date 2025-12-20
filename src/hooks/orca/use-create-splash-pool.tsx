import { QUERY_KEY } from '@/constants/query-key';
import { getExplorerLink } from '@/utils';
import { ORCA_WHIRLPOOLS_CONFIG } from '@orca-so/whirlpools-sdk';
import { PublicKey, SendTransactionError } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { toast } from 'sonner';
import { useOrca } from './use-orca';

// For Devnet
export const DEVNET_WHIRLPOOLS_CONFIG = new PublicKey(
  'FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR',
);
// For Mainnet
const MAINNET_WHIRLPOOLS_CONFIG = new PublicKey(ORCA_WHIRLPOOLS_CONFIG);

export const getWhirlpoolsConfig = (isDevnet: boolean) =>
  isDevnet ? DEVNET_WHIRLPOOLS_CONFIG : MAINNET_WHIRLPOOLS_CONFIG;

interface CreateSplashPoolParams {
  tokenMintA: string;
  tokenMintB: string;
  initialPrice: number;
  feeTier?: string; // Fee tier as percentage string (e.g., "0.3")
}

export const useCreateSplashLiquidityPool = () => {
  const { whirlpoolClient, isDevnet } = useOrca();

  return useMutation<
    {
      signature: string;
      explorerUrl: string;
      solscanUrl: string;
      txUrl: string;
      poolKey: string;
    },
    Error,
    CreateSplashPoolParams
  >({
    mutationKey: [QUERY_KEY.useCreateSplashLiquidityPool],
    mutationFn: async params => {
      if (!whirlpoolClient) {
        throw new Error('Whirlpool client not found');
      }

      const {
        tokenMintA, // Base token
        tokenMintB, // Quote token
        initialPrice, // Price ratio
      } = params;

      const tokenAddressA = new PublicKey(tokenMintA);
      const tokenAddressB = new PublicKey(tokenMintB);
      const whirlpoolsConfig = getWhirlpoolsConfig(isDevnet);
      const price = new Decimal(initialPrice);

      const { poolKey, tx: createPoolTxBuilder } =
        await whirlpoolClient.createSplashPool(
          whirlpoolsConfig,
          tokenAddressA,
          tokenAddressB,
          price,
          whirlpoolClient.getContext().wallet.publicKey,
        );

      const createPoolTxId = await createPoolTxBuilder.buildAndExecute();

      const { explorerUrl, solscanUrl, txUrl } = getExplorerLink({
        account: poolKey.toString(),
        signature: createPoolTxId,
      });

      return {
        signature: createPoolTxId,
        explorerUrl,
        solscanUrl,
        txUrl,
        poolKey: poolKey.toBase58(),
      };
    },
    onSuccess: data => {
      toast('Splash Pool created successfully', {
        duration: 15 * 1000,
        description: data.poolKey,
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
      console.error('Failed to create splash pool:', err);
      toast('Failed to create splash pool', {
        duration: 15 * 1000,
        description: err.transactionError.logs?.[3] || err.message,
      });
    },
  });
};

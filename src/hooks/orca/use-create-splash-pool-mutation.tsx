import { getExplorerLink } from '@/utils';
import { DigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { publicKey } from '@metaplex-foundation/umi';
import { ORCA_WHIRLPOOLS_CONFIG } from '@orca-so/whirlpools-sdk';
import { PublicKey } from '@solana/web3.js';
import { useMutation } from '@tanstack/react-query';
import Decimal from 'decimal.js';
import { toast } from 'sonner';
import { useOrca } from './use-orca';

type TokenForLiquidity = DigitalAsset & {
  name: string;
  symbol: string;
  image: string;
  description: string;
  website?: string;
  telegram?: string;
  twitter?: string;
  discord?: string;
};

export interface CreateLiquidityPoolParams {
  tokenPool: TokenForLiquidity;
  tokenLiquidityPool: TokenForLiquidity;
  amountPool: number;
  amountLiquidityPool: number;
}
// For Devnet
export const DEVNET_WHIRLPOOLS_CONFIG = new PublicKey(
  'FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR',
);
// For Mainnet
const MAINNET_WHIRLPOOLS_CONFIG = new PublicKey(ORCA_WHIRLPOOLS_CONFIG);

export const devnetWhirlpoolsConfig =
  process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'devnet'
    ? DEVNET_WHIRLPOOLS_CONFIG
    : MAINNET_WHIRLPOOLS_CONFIG;

export const useCreateSplashPoolMutation = () => {
  const { whirlpoolClient } = useOrca();

  return useMutation<
    {
      signature: string;
      explorerUrl: string;
      solscanUrl: string;
      txUrl: string;
    },
    Error,
    CreateLiquidityPoolParams
  >({
    mutationKey: ['useCreateSplashPoolMutation'],
    mutationFn: async ({
      tokenPool,
      tokenLiquidityPool,
      amountPool,
      amountLiquidityPool,
    }) => {
      if (!whirlpoolClient) {
        throw new Error('Whirlpool client not found');
      }
      const tokenAddressB = new PublicKey(tokenLiquidityPool.publicKey); // SOL
      const tokenAddressA = new PublicKey(tokenPool.publicKey); // devUSDC
      // 1 = Highest precision (0.01% price steps)
      // 8 = High precision (0.08% price steps)
      // 64 = Medium precision (0.64% price steps) ← Your choice
      // 128 = Lower precision (1.28% price steps)
      // Why 64?: Good balance between precision and efficiency for most token pairs.
      const sol = amountLiquidityPool;
      const loadingToken = amountPool;
      // If you want 1 SOL = 500M tokens
      const initialPrice = new Decimal(sol).div(new Decimal(loadingToken));
      const { poolKey, tx: createPoolTxBuilder } =
        await whirlpoolClient.createSplashPool(
          devnetWhirlpoolsConfig,
          tokenAddressB, // SOL
          tokenAddressA,
          initialPrice,
          whirlpoolClient.getContext().wallet.publicKey,
        );
      const createPoolTxId = await createPoolTxBuilder.buildAndExecute();

      const { explorerUrl, solscanUrl, txUrl } = getExplorerLink({
        account: publicKey(tokenPool.publicKey),
        signature: createPoolTxId,
      });
      console.table([
        {
          createPoolTxId,
          explorerUrl,
          solscanUrl,
          txUrl,
          initialPrice,
          poolKey: poolKey.toBase58(),
          positionMint: poolKey.toBase58(),
        },
      ]);
      return {
        signature: txUrl,
        explorerUrl,
        solscanUrl,
        txUrl,
      };
    },
    onSuccess: data => {
      toast.success('Liquidity Pool created successfully', {
        duration: 15 * 1000,
        description: (
          <div>
            <p>Signature: {data.signature}</p>
            <p>Explorer URL: {data.explorerUrl}</p>
            <p>Solscan URL: {data.solscanUrl}</p>
            <p>Transaction URL: {data.txUrl}</p>
          </div>
        ),
      });
    },
    onError: error => {
      console.error('❌ Liquidity Pool creation failed:', error);
      toast.error('Liquidity Pool', {
        duration: 15 * 1000,
        description: error.message,
      });
    },
  });
};

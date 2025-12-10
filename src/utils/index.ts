import { Cluster } from '@metaplex-foundation/umi';
import {
  ORCA_WHIRLPOOLS_CONFIG,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  PDAUtil,
  SPLASH_POOL_TICK_SPACING,
} from '@orca-so/whirlpools-sdk';
import { PublicKey } from '@solana/web3.js';

/**
 * @example
 * https://solscan.io/tx/3bWh6QSoeocXNu61biWEEQz8NLu9JLeBSdXYGJgNo4dfEh2GBfdpQzfRsSpVsLDbzQ2kcx9zuY92V7MvCBZrgHGv?cluster=devnet
 */
export const getExplorerLink = ({
  cluster = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  account,
  signature,
}: {
  cluster?: Cluster;
  account: string;
  signature: string;
}) => {
  return {
    explorerUrl: `https://explorer.solana.com/address/${account}?cluster=${cluster}`,
    solscanUrl: `https://solscan.io/token/${account}?cluster=${cluster}`,
    txUrl: `https://solscan.io/tx/${signature}?cluster=${cluster}`,
  };
};

// export function Amount(amount: number, decimals: number) {
//   return BigInt(Math.round(amount * 10 ** decimals));
// }
/**
 * @param amount
 * @param decimals
 * @example
 * Amount(1, 9) // 1_000_000_000 lamports
 */
export function Amount(amount: number, decimals: number) {
  return amount * 10 ** decimals;
}

/**
 *
 * @param amount
 * @param decimals
 * @example
 * AmountBigInt(1000000000000000000n, 9) // 1_000_000_000
 */
export function AmountBigInt(amount: bigint | number, decimals: number) {
  return Number(amount) / 10 ** decimals;
}

// For Devnet
export const DEVNET_WHIRLPOOLS_CONFIG = new PublicKey(
  'FcrweFY1G9HJAHG5inkGB6pKg1HZ6x9UC2WioAfWrGkR',
);
// For Mainnet
const MAINNET_WHIRLPOOLS_CONFIG = new PublicKey(ORCA_WHIRLPOOLS_CONFIG);

export const getWhirlpoolsConfig = (isDevnet: boolean) =>
  isDevnet ? DEVNET_WHIRLPOOLS_CONFIG : MAINNET_WHIRLPOOLS_CONFIG;

export const getSplashPoolAddress = (
  tokenMintA: PublicKey,
  tokenMintB: PublicKey,
  isDevnet: boolean = false,
) => {
  const whirlpoolsConfig = getWhirlpoolsConfig(isDevnet);
  const poolPDA = PDAUtil.getWhirlpool(
    ORCA_WHIRLPOOL_PROGRAM_ID,
    whirlpoolsConfig,
    new PublicKey(tokenMintA),
    new PublicKey(tokenMintB),
    SPLASH_POOL_TICK_SPACING, // 32896 for Splash Pools
  );

  return poolPDA.publicKey;
};

import { Cluster } from '@metaplex-foundation/umi';

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

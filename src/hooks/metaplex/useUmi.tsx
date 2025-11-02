'use client';

import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useWallet } from '@solana/wallet-adapter-react';

export const useUmi = () => {
  const wallet = useWallet();

  // const connection = new Connection(
  //   process.env.NEXT_PUBLIC_SOLANA_RPC_URL!,
  //   'confirmed'
  // );
  const rpcUrl =
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
  const umi = createUmi(rpcUrl)
    .use(mplTokenMetadata())
    .use(mplToolbox())
    .use(walletAdapterIdentity(wallet));

  return { umi, ...wallet };
};

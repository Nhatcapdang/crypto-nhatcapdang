'use client';

import { AnchorProvider } from '@coral-xyz/anchor';
import {
  ORCA_WHIRLPOOL_PROGRAM_ID,
  WhirlpoolContext,
} from '@orca-so/whirlpools-sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

/**
 * Hook to get Orca Whirlpool context
 * Converts wallet adapter to Anchor provider format
 */
export function useOrcaProvider() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (
      !wallet.publicKey ||
      !wallet.signTransaction ||
      !wallet.signAllTransactions
    ) {
      return null;
    }

    // Create Anchor provider with wallet adapter
    // AnchorProvider accepts wallet adapter directly
    return new AnchorProvider(
      connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction.bind(wallet),
        signAllTransactions: wallet.signAllTransactions.bind(wallet),
      } as any, // Type assertion for wallet adapter compatibility
      {
        commitment: 'confirmed',
      },
    );
  }, [connection, wallet]);

  const ctx = useMemo(() => {
    if (!provider) return null;
    return WhirlpoolContext.withProvider(provider, ORCA_WHIRLPOOL_PROGRAM_ID);
  }, [provider]);

  const client = useMemo(() => {
    if (!ctx) return null;
    // The context has a getClient method that returns the WhirlpoolClient
    return (ctx as any).getClient?.() || ctx;
  }, [ctx]);

  return {
    provider,
    ctx,
    client,
    wallet: wallet.publicKey,
    isConnected: wallet.connected,
  };
}

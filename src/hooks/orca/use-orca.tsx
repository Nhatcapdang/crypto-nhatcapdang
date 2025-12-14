import { AnchorProvider } from '@coral-xyz/anchor';
import {
  buildWhirlpoolClient,
  WhirlpoolContext,
} from '@orca-so/whirlpools-sdk';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';

export const useOrca = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const whirlpoolClient = useMemo(() => {
    if (!wallet) return null;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });

    const ctx = WhirlpoolContext.withProvider(provider);

    return buildWhirlpoolClient(ctx);
  }, [connection, wallet]);

  const isDevnet = useMemo(() => {
    return connection.rpcEndpoint.includes('devnet');
  }, [connection.rpcEndpoint]);

  return {
    whirlpoolClient,
    isWalletConnected: !!wallet,
    isDevnet,
    connection,
  };
};

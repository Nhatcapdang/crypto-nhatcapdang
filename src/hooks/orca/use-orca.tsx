import { AnchorProvider } from '@coral-xyz/anchor';
import {
  buildWhirlpoolClient,
  ORCA_WHIRLPOOL_PROGRAM_ID,
  WhirlpoolContext,
} from '@orca-so/whirlpools-sdk';
import { createSolanaRpc, devnet, mainnet } from '@solana/kit';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useCallback } from 'react';

export const useOrca = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  const rpc = createSolanaRpc(
    connection.rpcEndpoint.includes('devnet')
      ? devnet(connection.rpcEndpoint)
      : mainnet(connection.rpcEndpoint),
  );

  const createPool = useCallback(() => {
    if (!wallet) return;

    const provider = new AnchorProvider(connection, wallet, {
      commitment: 'confirmed',
    });
    const ctx = WhirlpoolContext.withProvider(
      provider,
      ORCA_WHIRLPOOL_PROGRAM_ID,
    );

    const whirlpoolClient = buildWhirlpoolClient(ctx);
    return whirlpoolClient;
  }, [connection, wallet]);

  return { whirlpoolClient: createPool(), isWalletConnected: !!wallet, rpc };
};

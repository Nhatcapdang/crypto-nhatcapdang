'use client';

import { Button } from '@/components/ui';
import SelectCombobox, {
  ComboboxItem,
} from '@/components/ui/select-token-combobox';
import {
  UseAllTokenByOwnerResponse,
  useAllTokenByOwnerQuery,
} from '@/hooks/metaplex/use-all-token-by-owner';
import { useClosePosition } from '@/hooks/orca/use-close-position';
import { useCreateSplashLiquidityPool } from '@/hooks/orca/use-create-splash-pool';
import { useOpenPosition } from '@/hooks/orca/use-open-position';
import { zodResolver } from '@hookform/resolvers/zod';
import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const BurnFormSchema = z.object({
  selectedToken: z.custom<ComboboxItem<
    UseAllTokenByOwnerResponse[number]
  > | null>(val => val !== null && val !== undefined, {
    message: 'Please select a token to burn',
  }),
  amount: z.number().min(0, {
    message: 'Amount must be greater than 0',
  }),
});

export type BurnFormData = z.infer<typeof BurnFormSchema>;

export default function TestComponent() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const { data: tokenData = [], isLoading: loadingTokens } =
    useAllTokenByOwnerQuery({
      // only show NFT(Non Fungible Token)
      tokenAmountFilter: amount => amount === BigInt(1),
    });
  const { mutate: createSplashLiquidityPool, isPending } =
    useCreateSplashLiquidityPool();
  const { mutate: openPosition, isPending: isOpeningPosition } =
    useOpenPosition();
  const { mutate: closePosition, isPending: isClosingPosition } =
    useClosePosition();

  const handleCreatePool = useCallback(() => {
    console.log('Creating pool...');
    createSplashLiquidityPool({
      tokenMintA: 'PVmF8R41sh2YCLrt2eKGiyte4RSgbu7dXvf7H7C5vot',
      tokenMintB: 'So11111111111111111111111111111111111111112',
      initialPrice: 2 / 500_000_000,
    });
  }, [createSplashLiquidityPool]);

  const handleOpenPosition = useCallback(() => {
    openPosition({
      tokenMintA: 'PVmF8R41sh2YCLrt2eKGiyte4RSgbu7dXvf7H7C5vot',
      tokenMintB: 'So11111111111111111111111111111111111111112',
      amountOfTokenA: 1_000_000,
    });
  }, [openPosition]);

  useEffect(() => {
    const fetchSolBalance = async () => {
      if (!publicKey) return;
      const solBalance = await connection.getTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });
      const solBalance2 = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          programId: TOKEN_PROGRAM_ID,
        },
      );
      console.log(
        'solBalance',
        solBalance2,
        solBalance.value.map(item => {
          return {
            ...item,
            // this is position address
            mint: AccountLayout.decode(item.account.data).mint.toString(),
            owner: item.account.owner.toString(),
            publicKey: item.pubkey.toString(),
          };
        }),
      );
    };
    fetchSolBalance();
  }, [publicKey, connection]);
  const form = useForm<BurnFormData>({
    resolver: zodResolver(BurnFormSchema),
    defaultValues: { selectedToken: null, amount: 0 },
    mode: 'onSubmit',
  });

  const handleClosePosition = useCallback(() => {
    const positionMint = form.getValues('selectedToken')?.mint;
    if (!positionMint) return;
    closePosition({
      positionMint,
    });
  }, [closePosition, form]);
  return (
    <div className="p-4 space-y-4">
      <SelectCombobox<UseAllTokenByOwnerResponse[number]>
        label="Choose a token to close position"
        placeholder="Select a token..."
        data={tokenData.map(token => ({
          ...token,
          image: 'https://dummyimage.com/60x60/000/fff',
          name: token.mint.toString(),
          symbol: '',
          description: `This is a NFT(Non Fungible Token) - Amount: ${token.amount.toString()}`,
        }))}
        isLoading={loadingTokens}
        onSelect={token => {
          console.log('token', token);
          form.setValue('selectedToken', token);
        }}
        className="w-full"
      />
      <div className="space-x-2">
        <Button onClick={handleCreatePool} disabled={isPending}>
          {isPending ? 'Creating Pool...' : 'Create Splash Pool'}
        </Button>

        <Button onClick={handleOpenPosition} disabled={isOpeningPosition}>
          {isOpeningPosition ? 'Opening Position...' : 'Add Liquidity'}
        </Button>

        <Button onClick={handleClosePosition} disabled={isClosingPosition}>
          {isClosingPosition ? 'Closing Position...' : 'Close Position'}
        </Button>

        {/* <Button onClick={calculatePoolMetrics} variant="outline">
          📊 Calculate Metrics
        </Button> */}
      </div>
    </div>
  );
}

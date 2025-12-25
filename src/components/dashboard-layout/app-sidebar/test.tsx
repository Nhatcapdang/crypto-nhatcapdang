'use client';

import NumberFormatter from '@/components/form/NumberFormatter';
import { Button } from '@/components/ui';
import SelectCombobox, {
  ComboboxItem,
} from '@/components/ui/select-token-combobox';
import {
  UseAllDigitalAssetByOwnerResponse,
  useAllDigitalAssetByOwnerQuery,
} from '@/hooks/metaplex/use-all-digital-asset-by-owner';
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
import { Coins } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const BurnFormSchema = z.object({
  selectedToken: z.custom<ComboboxItem<
    UseAllTokenByOwnerResponse[number]
  > | null>(val => val !== null && val !== undefined, {
    message: 'Please select a token to burn',
  }),
  selectedTokenOpenPosition: z.custom<ComboboxItem<
    UseAllDigitalAssetByOwnerResponse[number]
  > | null>(val => val !== null && val !== undefined, {
    message: 'Please select a token to open position',
  }),
  amountOfTokenB: z.number().min(0, {
    message: 'Amount of token A must be greater than 0',
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

  const {
    data: tokenOpenPositionData = [],
    isLoading: loadingTokenOpenPosition,
  } = useAllDigitalAssetByOwnerQuery();
  const { mutate: createSplashLiquidityPool, isPending } =
    useCreateSplashLiquidityPool();
  const { mutate: openPosition, isPending: isOpeningPosition } =
    useOpenPosition();
  const { mutate: closePosition, isPending: isClosingPosition } =
    useClosePosition();

  useEffect(() => {
    const fetchSolBalance = async () => {
      if (!publicKey) return;
      const solBalance = await connection.getTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
      });

      console.log(
        'solBalance',
        await Promise.all(
          solBalance.value.map(async item => {
            // const mint = await getMint(
            //   connection,
            //   AccountLayout.decode(item.account.data).mint,
            // );
            return {
              ...item,
              // this is position address
              authority: AccountLayout.decode(
                item.account.data,
              ).owner.toString(),
              publicKey: item.pubkey.toString(),
              mintAuthority: AccountLayout.decode(
                item.account.data,
              ).mint?.equals(publicKey),
              ...AccountLayout.decode(item.account.data),
            };
          }),
        ),
      );

      const searchResponse = await (
        await fetch(
          `https://api.jup.ag/ultra/v1/search?query=DJc8yggey3zDJ5W7Bv2ErEJAns1SDvmQEpH6ZYsNwQBk`,
          {
            headers: {
              'x-api-key': '9bef6bc6-e093-43fa-89f3-57b89584294f',
            },
          },
        )
      ).json();
      console.log('searchResponse', searchResponse);
    };
    fetchSolBalance();
  }, [publicKey, connection]);
  const form = useForm<BurnFormData>({
    resolver: zodResolver(BurnFormSchema),
    defaultValues: {
      selectedToken: null,
      selectedTokenOpenPosition: null,
      amount: 0,
    },
    mode: 'onSubmit',
  });

  const handleCreatePool = useCallback(() => {
    const tokenMintB = form.getValues('selectedTokenOpenPosition')?.publicKey;
    if (!tokenMintB) return;
    createSplashLiquidityPool({
      tokenMintA: 'So11111111111111111111111111111111111111112',
      tokenMintB,
      // 1 mean 1TEST=1SOL
      initialPrice: 0.01,
    });
  }, [createSplashLiquidityPool, form]);

  const handleClosePosition = useCallback(() => {
    const positionMint = form.getValues('selectedToken')?.mint;
    if (!positionMint) return;
    closePosition({
      positionMint,
    });
  }, [closePosition, form]);

  const handleOpenPosition = useCallback(() => {
    const amountOfTokenB = form.getValues('amountOfTokenB');
    const tokenMintB = form.getValues('selectedTokenOpenPosition')?.publicKey;
    if (!tokenMintB || !amountOfTokenB) return;
    console.log('tokenMintB', tokenMintB, amountOfTokenB);
    openPosition({
      tokenMintA: 'So11111111111111111111111111111111111111112',
      tokenMintB,
      amountOfTokenB,
    });
  }, [form, openPosition]);

  return (
    <div className="p-4 space-y-4">
      <button
        onClick={async () => {
          const searchResponse = await (
            await fetch(`https://api.jup.ag/ultra/v1`, {
              headers: {
                'x-api-key': '9bef6bc6-e093-43fa-89f3-57b89584294f',
              },
            })
          ).json();
          console.log('searchResponse', searchResponse);
        }}
      >
        Fetch Search Response
      </button>
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
      <Button onClick={handleClosePosition} disabled={isClosingPosition}>
        {isClosingPosition ? 'Closing Position...' : 'Close Position'}
      </Button>

      <SelectCombobox<UseAllDigitalAssetByOwnerResponse[number]>
        label="Choose a token to open position"
        placeholder="Select a token to open position..."
        data={tokenOpenPositionData}
        isLoading={loadingTokenOpenPosition}
        onSelect={token => {
          form.setValue('selectedTokenOpenPosition', token);
        }}
        className="w-full"
      />
      <NumberFormatter
        control={form.control}
        name="amountOfTokenB"
        label="Amount of token B"
        leftIcon={<Coins className="h-4 w-4" />}
        placeholder="0"
        thousandSeparator=","
        required
      />
      <div className="space-x-2">
        <Button onClick={handleCreatePool} disabled={isPending}>
          {isPending ? 'Creating Pool...' : 'Create Splash Pool'}
        </Button>

        <Button onClick={handleOpenPosition} disabled={isOpeningPosition}>
          {isOpeningPosition ? 'Opening Position...' : 'Opening Liquidity'}
        </Button>

        {/* <Button onClick={calculatePoolMetrics} variant="outline">
          📊 Calculate Metrics
        </Button> */}
      </div>
    </div>
  );
}

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
import { useCreateSplashLiquidityPool } from '@/hooks/orca/use-create-splash-pool';
import { zodResolver } from '@hookform/resolvers/zod';
import { Coins } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';

const CreateLiquidityFormSchema = z.object({
  selectedToken: z.custom<ComboboxItem<
    UseAllDigitalAssetByOwnerResponse[number]
  > | null>(val => val !== null && val !== undefined, {
    message: 'Please select a token to create liquidity',
  }),
  amount: z.number().min(0, {
    message: 'Amount must be greater than 0',
  }),
});

export type CreateLiquidityFormData = z.infer<typeof CreateLiquidityFormSchema>;

export default function CreateLiquidityComponent() {
  const {
    data: tokenOpenPositionData = [],
    isLoading: loadingTokenOpenPosition,
  } = useAllDigitalAssetByOwnerQuery();
  const { mutate: createSplashLiquidityPool, isPending } =
    useCreateSplashLiquidityPool();

  const form = useForm<CreateLiquidityFormData>({
    resolver: zodResolver(CreateLiquidityFormSchema),
    defaultValues: {
      selectedToken: null,
      amount: 0,
    },
    mode: 'onSubmit',
  });

  const handleCreateLiquidity = useCallback(
    (data: CreateLiquidityFormData) => {
      const tokenMintB = data.selectedToken?.publicKey;
      if (!tokenMintB) return;
      createSplashLiquidityPool({
        tokenMintA: 'So11111111111111111111111111111111111111112',
        tokenMintB,
        // 1 mean 1TEST=1SOL
        initialPrice: 0.01,
      });
    },
    [createSplashLiquidityPool],
  );

  return (
    <div className="p-4 space-y-4">
      <form onSubmit={form.handleSubmit(handleCreateLiquidity)} noValidate>
        <SelectCombobox<UseAllDigitalAssetByOwnerResponse[number]>
          label="Choose a token to create liquidity"
          placeholder="Select a token to create liquidity..."
          data={tokenOpenPositionData}
          isLoading={loadingTokenOpenPosition}
          onSelect={token => {
            form.setValue('selectedToken', token);
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
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating Liquidity...' : 'Create Liquidity'}
          </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import { FormInput } from '@/components/form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  UseAllTokenByOwnerResponse,
  useFetchAllDigitalAsset,
} from '@/hooks/metaplex';
import { zodResolver } from '@hookform/resolvers/zod';
import { DigitalAsset } from '@metaplex-foundation/mpl-token-metadata';
import { Waves } from 'lucide-react';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SelectToken } from '../ui/select-token';
import SelectCombobox, { ComboboxItem } from '../ui/select-token-combobox';

const poolFormSchema = z.object({
  tokenA: z.custom<ComboboxItem<UseAllTokenByOwnerResponse[number]> | null>(
    val => val !== null && val !== undefined,
    {
      message: 'Please select a token you created',
    },
  ),
  tokenB: z.string().min(32, 'Pair token address must be valid'),
  initialPrice: z
    .number()
    .positive('Initial price must be positive')
    .min(0.000001, 'Price too low'),
  tokenDecimalsA: z.number().int().min(0).max(9),
  tokenDecimalsB: z.number().int().min(0).max(9),
});

const liquidityFormSchema = z.object({
  poolAddress: z.string().min(32, 'Pool address must be valid'),
  tokenAmountA: z
    .number()
    .positive('Token amount must be positive')
    .min(0.000001, 'Amount too low'),
  tokenAmountB: z
    .number()
    .positive('Pair token amount must be positive')
    .min(0.000001, 'Amount too low'),
  tokenDecimalsA: z.number().int().min(0).max(9),
  tokenDecimalsB: z.number().int().min(0).max(9),
});

type PoolFormData = z.infer<typeof poolFormSchema>;
type LiquidityFormData = z.infer<typeof liquidityFormSchema>;

/**
 * Component to create a liquidity pool and add liquidity
 * This allows users to create a pool for their token and add initial liquidity
 */
export function CreateLiquidityPool() {
  const [step, setStep] = React.useState<'create' | 'add'>('create');
  const { data: pairTokens = [] } = useFetchAllDigitalAsset([
    'GZboHKS2c1WG73kr5P7XHeWPuPPDWMUtvErCEoCwUNRZ',
    'So11111111111111111111111111111111111111112',
    'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', // usdc
    'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB', // usdt
    '27G8MtK7VtTcCHkpASjSDdkWWYfoqT6ggEuKidVJidD4', // jupiter
  ]);
  const poolForm = useForm<PoolFormData>({
    resolver: zodResolver(poolFormSchema),
    defaultValues: {
      tokenA: null,
      tokenB: 'So11111111111111111111111111111111111111112', // SOL
      initialPrice: 0.01,
      tokenDecimalsA: 9,
      tokenDecimalsB: 9,
    },
  });

  const liquidityForm = useForm<LiquidityFormData>({
    resolver: zodResolver(liquidityFormSchema),
    defaultValues: {
      poolAddress: '',
      tokenAmountA: 0,
      tokenAmountB: 0,
      tokenDecimalsA: 9,
      tokenDecimalsB: 9,
    },
  });

  const handleCreatePool = (data: PoolFormData) => {};

  const handleAddLiquidity = (data: LiquidityFormData) => {};

  return (
    <div className="container mx-auto p-5 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Waves className="h-5 w-5" />
            Create Liquidity Pool
          </CardTitle>
          <CardDescription>
            Create a liquidity pool for your token so users can buy and trade it
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'create' && (
            <form
              onSubmit={poolForm.handleSubmit(handleCreatePool)}
              className="space-y-4"
            >
              <Controller
                control={poolForm.control}
                name="tokenA"
                render={({ field }) => (
                  <SelectToken
                    label="Base Token"
                    placeholder="Select the token you created"
                    onSelectToken={token => {
                      field.onChange(token);
                    }}
                  />
                )}
              />
              <Controller
                control={poolForm.control}
                name="tokenB"
                render={({ field }) => (
                  <SelectCombobox<DigitalAsset>
                    label="Pair Token"
                    placeholder="Usually SOL or USDC (default: SOL)"
                    data={pairTokens.map(token => ({
                      ...token,
                      image: 'https://dummyimage.com/60x60/000/fff',
                      name: token.metadata.symbol,
                      symbol: token.metadata.name,
                      description: token.mint.publicKey,
                    }))}
                    onSelect={token => {
                      field.onChange(token);
                    }}
                  />
                )}
              />

              <FormInput
                label="Initial Price"
                description="Initial price ratio (your token / pair token)"
                type="number"
                step="0.000001"
                control={poolForm.control}
                name="initialPrice"
                placeholder="0.01"
              />
              <FormInput
                label="Your Token Decimals"
                description="Number of decimals for your token"
                type="number"
                control={poolForm.control}
                name="tokenDecimalsA"
              />
              <FormInput
                label="Pair Token Decimals"
                description="Number of decimals for pair token (SOL: 9, USDC: 6)"
                type="number"
                control={poolForm.control}
                name="tokenDecimalsB"
              />
              <Button className="w-full">Create Pool</Button>
            </form>
          )}

          <form
            onSubmit={liquidityForm.handleSubmit(handleAddLiquidity)}
            className="space-y-4"
          >
            <FormInput
              label="Pool Address"
              description="The pool address (auto-filled after creation)"
              control={liquidityForm.control}
              name="poolAddress"
              disabled
            />

            <FormInput
              label="Your Token Amount"
              description="Amount of your token to add to the pool"
              type="number"
              step="0.000001"
              control={liquidityForm.control}
              name="tokenAmountA"
              placeholder="1000"
            />

            <FormInput
              label="Pair Token Amount"
              description="Amount of pair token (SOL/USDC) to add"
              type="number"
              step="0.000001"
              control={liquidityForm.control}
              name="tokenAmountB"
              placeholder="10"
            />

            <FormInput
              label="Your Token Decimals"
              description="Number of decimals for your token"
              type="number"
              control={liquidityForm.control}
              name="tokenDecimalsA"
            />

            <FormInput
              label="Pair Token Decimals"
              description="Number of decimals for pair token"
              type="number"
              control={liquidityForm.control}
              name="tokenDecimalsB"
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('create')}
                className="flex-1"
              >
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Add Liquidity
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

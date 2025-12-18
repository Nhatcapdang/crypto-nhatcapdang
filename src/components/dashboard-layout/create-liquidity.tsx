'use client';

import NumberFormatter from '@/components/form/NumberFormatter';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Card,
  CardContent,
  CardFooter,
  Field,
  FieldContent,
  FieldLabel,
  Input,
} from '@/components/ui';
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
import { useCallback, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { WalletConnectButton } from '../kit/wallet-connect-button';

import {
  UseTokensQueryInfiniteResponse,
  useTokenByMintQuery,
  useTokensQueryInfinite,
} from '@/hooks/orca/use-tokens-query-infinite';
import { AmountBigInt } from '@/utils';
import { NumericFormat } from 'react-number-format';

const CreateLiquidityFormSchema = z.object({
  baseToken: z.custom<ComboboxItem<
    UseAllDigitalAssetByOwnerResponse[number]
  > | null>(val => val !== null && val !== undefined, {
    message: 'Please select a token to create liquidity',
  }),
  quoteToken: z.custom<ComboboxItem<
    UseTokensQueryInfiniteResponse[number]
  > | null>(val => val !== null && val !== undefined, {
    message: 'Please select a quote token',
  }),
  baseAmount: z.number().min(0, {
    message: 'Amount must be greater than 0',
  }),
  quoteAmount: z.number().min(0, {
    message: 'Amount must be greater than 0',
  }),
});

export type CreateLiquidityFormData = z.infer<typeof CreateLiquidityFormSchema>;

export default function CreateLiquidityComponent() {
  const {
    data: tokensQueryDataInfinite = [],
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useTokensQueryInfinite();
  const [searchByMintAddress, setSearchByMintAddress] = useState<string | null>(
    'So11111111111111111111111111111111111111112',
  );
  const { isPending: isPendingTokenByMintQuery } =
    useTokenByMintQuery(searchByMintAddress);

  const { data: baseTokenData = [], isLoading: loadingBaseTokenData } =
    useAllDigitalAssetByOwnerQuery();

  const { mutate: createSplashLiquidityPool, isPending } =
    useCreateSplashLiquidityPool();

  const form = useForm<CreateLiquidityFormData>({
    resolver: zodResolver(CreateLiquidityFormSchema),
    defaultValues: {
      baseToken: null,
      quoteToken: null,
      baseAmount: 0,
      quoteAmount: 0, // SOL
    },
    mode: 'onSubmit',
  });

  const [baseToken, quoteToken, baseAmount, quoteAmount] = useWatch({
    control: form.control,
    name: ['baseToken', 'quoteToken', 'baseAmount', 'quoteAmount'],
  });

  const handleCreateLiquidity = useCallback(
    (data: CreateLiquidityFormData) => {
      const baseToken = data.baseToken?.publicKey;
      const quoteToken = data.quoteToken?.address;
      if (!baseToken || !quoteToken) return;
      createSplashLiquidityPool({
        // SOL is the base token
        tokenMintA: quoteToken,
        tokenMintB: baseToken,
        initialPrice: data.quoteAmount / data.baseAmount,
      });
    },
    [createSplashLiquidityPool],
  );

  const onQuoteTokenNotFound = useCallback((search: string) => {
    setSearchByMintAddress(search);
  }, []);

  const onScrollEnd = useCallback(() => {
    if (isFetchingNextPage || !hasNextPage) return;
    fetchNextPage();
  }, [isFetchingNextPage, hasNextPage, fetchNextPage]);

  const maxBaseAmount = useMemo(() => {
    return AmountBigInt(
      baseToken?.mint.supply || 0,
      baseToken?.mint.decimals || 0,
    );
  }, [baseToken]);

  return (
    <section className=" p-5">
      <h1 className="text-2xl font-bold text-center">Create Liquidity</h1>
      <p className="text-sm text-muted-foreground text-center">
        Create a new liquidity pool on Solana with custom settings and metadata
      </p>

      <Card className="w-full max-w-4xl mx-auto mt-4 relative overflow-hidden ">
        <form onSubmit={form.handleSubmit(handleCreateLiquidity)} noValidate>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 items-center">
                <SelectCombobox<UseAllDigitalAssetByOwnerResponse[number]>
                  label="Select Base Token"
                  placeholder="Choose your token"
                  data={baseTokenData.map(token => ({
                    ...token,
                    description: token.publicKey,
                  }))}
                  isLoading={loadingBaseTokenData}
                  onSelect={token => {
                    form.setValue('baseToken', token);
                    form.setValue(
                      'baseAmount',
                      AmountBigInt(
                        token?.mint.supply || 0,
                        token?.mint.decimals || 0,
                      ),
                    );
                  }}
                  className="w-full"
                />

                <SelectCombobox<UseTokensQueryInfiniteResponse[number]>
                  label="Select Quote Token"
                  placeholder="Choose quote token (SOL, USDC, etc.)"
                  data={tokensQueryDataInfinite.map(token => ({
                    ...token,
                    image: token.metadata.image || 'https://dummyimage.com/40',
                    name: token.metadata.name,
                    symbol: token.metadata.symbol,
                    description: token.address,
                  }))}
                  isLoading={isFetchingNextPage || isPendingTokenByMintQuery}
                  onSelect={async token => {
                    form.setValue('quoteToken', token);
                  }}
                  className="w-full"
                  onNotFound={onQuoteTokenNotFound}
                  onScrollEnd={onScrollEnd}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 items-normal">
                <NumberFormatter
                  control={form.control}
                  name="baseAmount"
                  label="Base Amount"
                  leftIcon={
                    <Avatar className="size-6">
                      <AvatarImage
                        src={baseToken?.image}
                        alt={baseToken?.name}
                        loading="lazy"
                      />
                      <AvatarFallback>
                        {(baseToken?.symbol || baseToken?.name || 'T')
                          .toString()
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  }
                  placeholder="1,000,000.00"
                  thousandSeparator=","
                  required
                  max={maxBaseAmount}
                  isAllowed={values => {
                    const { floatValue } = values;
                    return floatValue ? floatValue <= maxBaseAmount : false;
                  }}
                  description={`Available balance: ${maxBaseAmount.toLocaleString(
                    'en-US',
                  )}`}
                />
                <NumberFormatter
                  control={form.control}
                  name="quoteAmount"
                  label="Quote Amount"
                  leftIcon={
                    <Avatar className="size-6">
                      <AvatarImage
                        src={quoteToken?.image}
                        alt={quoteToken?.name}
                        loading="lazy"
                      />
                      <AvatarFallback>
                        {(quoteToken?.symbol || quoteToken?.name || 'T')
                          .toString()
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  }
                  placeholder="1,000,000.00"
                  thousandSeparator=","
                  required
                  // max={maxQuoteAmount}
                  // isAllowed={values => {
                  //   const { floatValue } = values;
                  //   return floatValue ? floatValue <= maxQuoteAmount : false;
                  // }}
                />
              </div>
              {/* <div className=" gap-4 sm:grid-cols-2 items-center hidden sm:grid">
                <SliderWithArrowStickyLabel
                  defaultValue={[baseAmount]}
                  max={maxBaseAmount}
                  value={[baseAmount]}
                  min={1}
                  onValueChange={value => {
                    form.setValue('baseAmount', value[0]);
                  }}
                />

                <SliderWithArrowStickyLabel
                  defaultValue={[quoteAmount]}
                  max={maxQuoteAmount}
                  value={[quoteAmount]}
                  min={1}
                  onValueChange={value => {
                    form.setValue('quoteAmount', value[0] || 0);
                  }}
                />
              </div> */}
              <Field>
                <FieldContent>
                  <FieldLabel>Initial Price</FieldLabel>
                  <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring [&>*:first-child]:px-2 [&>*:last-child]:px-2 [&>input]:focus-visible:ring-0 [&>input]:border-0 [&>input]:shadow-none ">
                    <span className="text-muted-foreground min-w-fit">
                      {quoteToken?.symbol} / {baseToken?.symbol}
                    </span>
                    <NumericFormat
                      customInput={Input}
                      placeholder="0.00"
                      value={quoteAmount / baseAmount}
                      thousandSeparator=","
                      decimalScale={15}
                      readOnly
                    />
                  </div>
                </FieldContent>
              </Field>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <WalletConnectButton
              className="w-full"
              disabled={isPending}
              leftIcon={<Coins className="h-4 w-4 mr-2" />}
            >
              Create Liquidity
            </WalletConnectButton>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
}

'use client';

import NumberFormatter from '@/components/form/NumberFormatter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  UseAllTokenByOwnerResponse,
  useAllTokenByOwnerQuery,
  useBurnTokenMutation,
} from '@/hooks/metaplex';
import { formatNumber, truncateString } from '@/lib/utils';
import { Amount, AmountBigInt } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, CircleAlertIcon, Coins, Copy, Flame } from 'lucide-react';
import React, { useCallback, useMemo } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { WalletConnectButton } from '../kit/wallet-connect-button';
import { Badge } from '../ui';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { BorderBeam } from '../ui/border-beam';
import CopyButton from '../ui/copy-button';
import SelectCombobox, { ComboboxItem } from '../ui/select-token-combobox';

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

const BurnToken: React.FC = React.memo(() => {
  const { data: tokenData = [], isLoading: loadingTokens } =
    useAllTokenByOwnerQuery();
  const { mutate: burnTokenMutation, isPending: isPendingBurnToken } =
    useBurnTokenMutation();
  const form = useForm<BurnFormData>({
    resolver: zodResolver(BurnFormSchema),
    defaultValues: { selectedToken: null, amount: 0 },
    mode: 'onSubmit',
  });

  const [selectedToken, amount] = useWatch({
    control: form.control,
    name: ['selectedToken', 'amount'],
  });

  const onSubmit = useCallback<SubmitHandler<BurnFormData>>(
    data => {
      if (!selectedToken) return;
      burnTokenMutation(
        {
          account: selectedToken?.publicKey,
          mint: selectedToken?.mint,
          amount: Amount(data.amount, selectedToken?.header.lamports.decimals),
        },
        {
          onSuccess: () => {
            form.reset();
          },
        },
      );
    },
    [burnTokenMutation, form, selectedToken],
  );

  const availableBalance = useMemo(() => {
    if (!selectedToken || !selectedToken.header.lamports.decimals) return 0;
    return AmountBigInt(
      selectedToken.amount,
      selectedToken.header.lamports.decimals,
    );
  }, [selectedToken]);

  const remainingAfterBurn = useMemo(() => {
    return formatNumber({
      value: availableBalance - amount,
    });
  }, [availableBalance, amount]);

  return (
    <section className="p-5 container mx-auto">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Flame className="h-6 w-6 text-primary" /> Burn Tokens
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Permanently reduce the circulating supply of your fungible tokens
      </p>

      <div className="flex flex-wrap gap-6 mt-4 items-stretch">
        <Card className="flex-1 min-w-[400px]  card relative overflow-hidden">
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" /> Select Token to
                  Burn
                </h3>
                <SelectCombobox<UseAllTokenByOwnerResponse[number]>
                  label="Choose a token to burn"
                  placeholder="Select a token..."
                  data={tokenData.map(token => ({
                    ...token,
                    image: 'https://dummyimage.com/60x60/000/fff',
                    name: token.mint.toString(),
                    symbol: '',
                    description: formatNumber({
                      value: AmountBigInt(
                        token.amount,
                        token.header.lamports.decimals,
                      ),
                    }),
                  }))}
                  isLoading={loadingTokens}
                  onSelect={token => form.setValue('selectedToken', token)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <NumberFormatter
                  control={form.control}
                  name="amount"
                  label="Burn Amount"
                  description={`Available balance: ${formatNumber({
                    value: availableBalance,
                  })}`}
                  placeholder="0"
                  leftIcon={<Flame className="h-4 w-4" />}
                  required
                  allowNegative={false}
                  min={0}
                  isAllowed={values => {
                    const { floatValue } = values;
                    return floatValue ? floatValue <= availableBalance : false;
                  }}
                  thousandSeparator=","
                  rightIcon={
                    <Button
                      type="button"
                      variant="ghost"
                      className="cursor-pointer"
                      onClick={e => {
                        e.stopPropagation();
                        const amount = form.getValues('selectedToken')?.amount;
                        const decimals =
                          form.getValues('selectedToken')?.header.lamports
                            .decimals;
                        if (amount && decimals) {
                          form.setValue(
                            'amount',
                            AmountBigInt(amount, decimals),
                          );
                        }
                      }}
                    >
                      Max
                    </Button>
                  }
                />
              </div>
              <Alert className="border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 mb-4">
                <CircleAlertIcon />
                <AlertTitle>Burning tokens is irreversible</AlertTitle>
                <AlertDescription className="text-amber-600/80 dark:text-amber-400/80">
                  The tokens will be permanently removed from circulation and
                  can&apos;t be recovered.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-end ">
              <WalletConnectButton
                className="w-full"
                isPending={isPendingBurnToken}
                leftIcon={<Flame className="h-4 w-4 mr-2" />}
              >
                Burn Tokens
              </WalletConnectButton>
            </CardFooter>
          </form>
          <BorderBeam
            duration={10}
            size={400}
            className="from-transparent via-red-500 to-transparent"
          />
          <BorderBeam
            duration={10}
            delay={15}
            size={400}
            className="from-transparent via-yellow-500 to-transparent"
          />
        </Card>

        <Card className="flex-1 lg:max-w-[400px] card2">
          <CardContent className="space-y-4 pt-6">
            <h3 className="text-lg font-semibold">Burn Summary</h3>
            <div className="text-sm grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Address:</span>
                <CopyButton variant="ghost" size="sm" value="dummy-address">
                  {({ copied, copy }) => (
                    <span
                      className="truncate text-right flex items-center gap-2"
                      onClick={copy}
                    >
                      {truncateString(
                        selectedToken?.mint.toString() ?? '—',
                        12,
                      )}
                      {copied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </span>
                  )}
                </CopyButton>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Maximum Supply:</span>
                <span> {formatNumber({ value: availableBalance })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount to Burn:</span>
                <span>{formatNumber({ value: amount })}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Remaining Supply:</span>
                <span>{remainingAfterBurn}</span>
              </div>
            </div>
            <Badge className="bg-red-600/20 text-red-300 rounded-full w-full">
              <Flame className="h-3 w-3" /> REDUCES CIRCULATING SUPPLY
            </Badge>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

BurnToken.displayName = 'BurnToken';

export default BurnToken;

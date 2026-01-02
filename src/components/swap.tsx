'use client';
import { UseTokensResponse, useTokens } from '@/hooks/use-tokens';
import { useCallback, useEffect, useMemo } from 'react';
import z from 'zod';
import SelectCombobox, { ComboboxItem } from './ui/select-token-combobox';

import { useSwapMutation } from '@/hooks/use-swap-mutation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeftRight } from 'lucide-react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import NumberFormatter from './form/NumberFormatter';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardFooter,
  Separator,
} from './ui';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Form } from './ui/form';
import { Spinner } from './ui/spinner';

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(date));
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

const SwapFormSchema = z.object({
  payToken: z.custom<ComboboxItem<UseTokensResponse[number]> | null>(
    val => val !== null && val !== undefined,
    {
      message: 'Please select a pay token',
    }
  ),
  receiveToken: z.custom<ComboboxItem<UseTokensResponse[number]> | null>(
    val => val !== null && val !== undefined,
    {
      message: 'Please select a receive token',
    }
  ),
  payAmount: z.number().min(0, {
    message: 'Pay amount must be greater than 0',
  }),
  receiveAmount: z.number().min(0, {
    message: 'Receive amount must be greater than 0',
  }),
});

export type SwapFormData = z.infer<typeof SwapFormSchema>;

export function SwapComponent() {
  const swapForm = useForm<SwapFormData>({
    resolver: zodResolver(SwapFormSchema),
    defaultValues: {
      payToken: null,
      receiveToken: null,
      payAmount: 0,
      receiveAmount: 0,
    },
    mode: 'onSubmit',
  });

  const { mutate: swapMutation, isPending: isSwapping } = useSwapMutation();

  const [payToken, receiveToken, payAmount] = useWatch({
    control: swapForm.control,
    name: ['payToken', 'receiveToken', 'payAmount'],
  });

  useEffect(() => {
    if (payToken && receiveToken) {
      // Formula: receiveAmount = (payAmount * payTokenPrice) / receiveTokenPrice
      // Example: payAmount = 0.21, payTokenPrice = $1, receiveTokenPrice = $0.21
      // receiveAmount = (0.21 * 1) / 0.21 = 1.00
      const calculatedReceiveAmount =
        (payAmount * payToken.price) / receiveToken.price;
      swapForm.setValue('receiveAmount', calculatedReceiveAmount);
    }
  }, [payAmount, payToken, receiveToken, swapForm]);

  const handleSwap = useCallback(
    (data: SwapFormData) => swapMutation(data),
    [swapMutation]
  );

  console.log(swapForm.formState.errors);
  return (
    <section className=" p-5">
      <h1 className="text-2xl font-bold text-center">Swap</h1>
      <p className="text-sm text-muted-foreground text-center">
        Swap your tokens
      </p>

      <Card className="w-full max-w-4xl mx-auto mt-4 relative overflow-hidden ">
        <Form form={swapForm} onSubmit={swapForm.handleSubmit(handleSwap)}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 items-center">
                <SelectPayToken />
                <SelectReceiveToken />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 items-normal">
                <NumberFormatter
                  control={swapForm.control}
                  name="payAmount"
                  label="Pay Token"
                  leftIcon={
                    <Avatar className="size-6">
                      <AvatarImage
                        src={payToken?.image}
                        alt={payToken?.name}
                        loading="lazy"
                      />
                      <AvatarFallback>
                        {(payToken?.symbol || payToken?.name || 'T')
                          .toString()
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  }
                  decimalScale={3}
                  placeholder="0.00"
                  thousandSeparator=","
                />
                <NumberFormatter
                  control={swapForm.control}
                  name="receiveAmount"
                  label="Receive Token"
                  leftIcon={
                    <Avatar className="size-6">
                      <AvatarImage
                        src={receiveToken?.image}
                        alt={receiveToken?.name}
                        loading="lazy"
                      />
                      <AvatarFallback>
                        {(receiveToken?.symbol || receiveToken?.name || 'T')
                          .toString()
                          .slice(0, 2)
                          .toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  }
                  decimalScale={3}
                  placeholder="0.00"
                  thousandSeparator=","
                  readOnly
                />
              </div>
              <Alert>
                <AlertTitle className="">
                  <span className="font-bold">Trade Slippage:</span> Set the
                  allowed percentage difference between the quoted price and
                  actual execution price of your trade.
                </AlertTitle>

                <AlertDescription>
                  <Separator className="my-2 " />
                  <ButtonGroup aria-label="Button group">
                    <Button variant="outline">0.1%</Button>
                    <Button variant="outline">0.5%</Button>
                    <Button variant="outline">1%</Button>
                    <Button variant="outline">5%</Button>
                  </ButtonGroup>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end mt-4">
            <Button
              className="w-full"
              disabled={!swapForm.formState.isValid || isSwapping}
            >
              {isSwapping ? (
                <Spinner className="h-4 w-4 mr-2" />
              ) : (
                <ArrowLeftRight className="h-4 w-4 mr-2" />
              )}
              Swap
            </Button>
          </CardFooter>
        </Form>
      </Card>
    </section>
  );
}

const SelectPayToken = () => {
  const swapForm = useFormContext<SwapFormData>();
  const { data: tokens = [], isLoading: loadingTokens } = useTokens();

  const memoizedBaseTokenData = useMemo(
    () =>
      tokens.map(token => ({
        ...token,
        description: formatDate(token.date),
        image: token.image,
        name: token.currency,
        symbol: formatPrice(token.price),
      })),
    [tokens]
  );

  const handleBaseTokenSelect = useCallback(
    (token: ComboboxItem<UseTokensResponse[number]>) => {
      swapForm.setValue('payToken', token);
    },
    [swapForm]
  );

  return (
    <SelectCombobox<UseTokensResponse[number]>
      label="Select Pay Token"
      placeholder="Choose your token"
      data={memoizedBaseTokenData}
      isLoading={loadingTokens}
      onSelect={handleBaseTokenSelect}
      className="w-full"
    />
  );
};

const SelectReceiveToken = () => {
  const swapForm = useFormContext<SwapFormData>();
  const { data: tokens = [], isLoading: loadingTokens } = useTokens();

  const memoizedBaseTokenData = useMemo(
    () =>
      tokens.map(token => ({
        ...token,
        description: formatDate(token.date),
        image: token.image,
        name: token.currency,
        symbol: formatPrice(token.price),
      })),
    [tokens]
  );

  const handleReceiveTokenSelect = useCallback(
    (token: ComboboxItem<UseTokensResponse[number]>) => {
      swapForm.setValue('receiveToken', token);
    },
    [swapForm]
  );

  return (
    <SelectCombobox<UseTokensResponse[number]>
      label="Select Receive Token"
      placeholder="Choose your token"
      data={memoizedBaseTokenData}
      isLoading={loadingTokens}
      onSelect={handleReceiveTokenSelect}
      className="w-full"
    />
  );
};

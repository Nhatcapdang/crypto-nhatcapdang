'use client';
import { UseTokensResponse, useTokens } from '@/hooks/use-tokens';
import { useCallback, useEffect, useMemo } from 'react';
import z from 'zod';
import SelectCombobox, { ComboboxItem } from './ui/select-token-combobox';

import { useSwapMutation } from '@/hooks/use-swap-mutation';
import { useSwapStore } from '@/providers/swap-store-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDisclosure } from '@mantine/hooks';
import { ArrowLeftRight, CheckCircle } from 'lucide-react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import NumberFormatter from './form/NumberFormatter';
import { AvatarKit } from './kit/avatar';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardFooter,
  Separator,
} from './ui';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Form } from './ui/form';
import { Spinner } from './ui/spinner';

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
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
  const [
    isSuccessDialogOpen,
    { open: openSuccessDialog, close: closeSuccessDialog },
  ] = useDisclosure(false);

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
  const setSwapForm = useSwapStore(state => state.setSwapForm);
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
    (data: SwapFormData) => {
      swapMutation(data, {
        onSuccess: () => {
          setSwapForm(data);
          openSuccessDialog();
          swapForm.reset();
        },
      });
    },
    [swapMutation, setSwapForm, openSuccessDialog, swapForm]
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
                    <AvatarKit
                      image={payToken?.image || ''}
                      name={payToken?.name || ''}
                      symbol={payToken?.symbol || ''}
                    />
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
                    <AvatarKit
                      image={receiveToken?.image || ''}
                      name={receiveToken?.name || ''}
                      symbol={receiveToken?.symbol || ''}
                    />
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

      <SwapSuccessDialog
        open={isSuccessDialogOpen}
        onOpenChange={closeSuccessDialog}
      />
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

const SwapSuccessDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { payToken, receiveToken, payAmount, receiveAmount } = useSwapStore(
    state => state.swapForm
  );
  const exchangeRate = receiveAmount / payAmount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Swap Successful!
          </DialogTitle>
          <DialogDescription className="text-center">
            Your tokens have been swapped successfully
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="rounded-lg border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">You Paid</span>
              <div className="flex items-center gap-2">
                <AvatarKit
                  image={payToken?.image || ''}
                  name={payToken?.name || ''}
                  symbol={payToken?.symbol || ''}
                />
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(payAmount)}</div>
                  <div className="text-xs text-muted-foreground">
                    {payToken?.name}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                You Received
              </span>
              <div className="flex items-center gap-2">
                <AvatarKit
                  image={receiveToken?.image || ''}
                  name={receiveToken?.name || ''}
                  symbol={receiveToken?.symbol || ''}
                />
                <div className="text-right">
                  <div className="font-semibold">
                    {formatPrice(receiveAmount)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {receiveToken?.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">
                1 {payToken?.name} ≈ {formatPrice(exchangeRate)}{' '}
                {receiveToken?.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Transaction Time</span>
              <span className="font-medium">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

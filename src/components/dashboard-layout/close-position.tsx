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
import { zodResolver } from '@hookform/resolvers/zod';
import { WalletIcon } from 'lucide-react';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Spinner } from '../ui/spinner';

const ClosePositionFormSchema = z.object({
  selectedToken: z.custom<ComboboxItem<
    UseAllTokenByOwnerResponse[number]
  > | null>(val => val !== null && val !== undefined, {
    message: 'Please select a token to close position',
  }),
});

export type ClosePositionFormData = z.infer<typeof ClosePositionFormSchema>;

export default function ClosePositionComponent() {
  const { data: tokenData = [], isLoading: loadingTokens } =
    useAllTokenByOwnerQuery({
      // only show NFT(Non Fungible Token)
      tokenAmountFilter: amount => amount === BigInt(1),
    });

  const { mutate: closePosition, isPending: isClosingPosition } =
    useClosePosition();

  const formClosePosition = useForm<ClosePositionFormData>({
    resolver: zodResolver(ClosePositionFormSchema),
    defaultValues: { selectedToken: null },
    mode: 'onSubmit',
  });

  const handleClosePosition = useCallback(() => {
    const positionMint = formClosePosition.getValues('selectedToken')?.mint;
    if (!positionMint) return;
    closePosition({
      positionMint,
    });
  }, [closePosition, formClosePosition]);

  return (
    <div className="p-4 space-y-4">
      <SelectCombobox<UseAllTokenByOwnerResponse[number]>
        label="Select a position to close"
        placeholder="Select a position..."
        data={tokenData.map(token => ({
          ...token,
          image: 'https://dummyimage.com/60x60/000/fff',
          name: token.mint.toString(),
          symbol: '',
          description: `This is a NFT(Non Fungible Token) - Amount: ${token.amount.toString()}`,
        }))}
        isLoading={loadingTokens}
        onSelect={token => {
          formClosePosition.setValue('selectedToken', token);
        }}
        className="w-full"
      />
      <div className="space-x-2">
        <Button onClick={handleClosePosition} disabled={isClosingPosition}>
          {isClosingPosition ? (
            <Spinner className="h-4 w-4 animate-spin" />
          ) : (
            <WalletIcon className="h-4 w-4" />
          )}
          Close Position
        </Button>
      </div>
    </div>
  );
}

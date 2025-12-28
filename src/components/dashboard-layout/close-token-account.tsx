'use client';

import { useAllTokenByOwnerWithFilterQuery } from '@/hooks/metaplex/use-all-token-by-owner-with-filter';
import { useCloseTokenMutation } from '@/hooks/metaplex/use-close-token';
import { formatNumber, truncateString } from '@/lib/utils';
import { AmountBigInt } from '@/utils';
import { Token } from '@metaplex-foundation/mpl-toolbox';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import { Check, Copy, DollarSign, WalletIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Badge, Button, Card } from '../ui';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import CopyButton from '../ui/copy-button';
import SheetData from '../ui/sheet-data';
import { Spinner } from '../ui/spinner';

const columnDefsCloseToken: ColDef<Token>[] = [
  {
    field: 'mint',
    headerName: 'Mint',
    minWidth: 265,
    cellRenderer: ({ value = '' }: ICellRendererParams<Token>) => {
      return (
        <CopyButton value={value} variant="ghost">
          {({ copied, copy }) => (
            <span
              className="truncate text-right flex items-center gap-2"
              onClick={copy}
            >
              {truncateString(value, 12)}
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </span>
          )}
        </CopyButton>
      );
    },
  },
  {
    headerName: 'SOL Refund',
    valueFormatter: ({ data }) => {
      if (!data) {
        return '-';
      }
      const solRefund = AmountBigInt(
        data.header.lamports.basisPoints,
        data.header.lamports.decimals,
      );
      return `${formatNumber({
        value: solRefund,
        digit: 6,
      })} ${data.header.lamports.identifier}`;
    },
    cellClass: 'text-green-500 font-bold',
  },
  {
    headerName: 'Closable',
    field: 'amount',
    cellRenderer: ({ data }: ICellRendererParams<Token>) => {
      if (!data) {
        return '-';
      }
      return (
        <Badge variant="custom">
          {data.amount === BigInt(0) ? 'Closable' : 'Not Closable'}
        </Badge>
      );
    },
  },
];

function CloseTokenAccountComponent() {
  const t = useTranslations();
  const { setVisible } = useWalletModal();
  const { connected } = useWallet();
  const {
    data: allTokenByOwnerWithFilterData,
    isPending: isPendingClosableTokens,
  } = useAllTokenByOwnerWithFilterQuery();
  const { mutate: closeTokenMutation, isPending: isPendingCloseToken } =
    useCloseTokenMutation();
  const {
    data: closableTokens,
    totalClosableToken,
    totalNotClosableToken,
    totalSOLLocked,
    totalSOLRefundable,
  } = allTokenByOwnerWithFilterData ?? {
    data: [],
    totalToken: 0,
    totalClosableToken: 0,
    totalNotClosableToken: 0,
    totalSOLLocked: 0,
    totalSOLRefundable: 0,
    totalSOLNotRefundable: 0,
  };
  return (
    <section className="w-full mx-auto transform-center">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        📝 {t('key_29')}
      </h1>
      <p className="text-sm text-muted-foreground text-center">{t('key_30')}</p>
      <Card className="w-full max-w-4xl mx-auto mt-4 px-4">
        <div className="flex items-center justify-center gap-2 flex-wrap mt-4">
          <Button variant="secondary" className="cursor-not-allowed">
            {totalNotClosableToken} {t('key_31')}:{' '}
            {formatNumber({
              value: totalSOLLocked,
              digit: 6,
            })}{' '}
            SOL
          </Button>

          {connected ? (
            <Button
              variant="secondary"
              className="bg-lime-500/90"
              onClick={() => closeTokenMutation()}
              disabled={isPendingCloseToken || totalClosableToken === 0}
            >
              {isPendingCloseToken ? (
                <Spinner className="h-4 w-4 animate-spin" />
              ) : (
                <DollarSign className="h-4 w-4" />
              )}
              <span>
                {totalClosableToken} SOL Refund(Closable):{' '}
                {formatNumber({
                  value: totalSOLRefundable,
                  digit: 6,
                })}{' '}
                SOL
              </span>
            </Button>
          ) : (
            <Button type="button" onClick={() => setVisible(true)}>
              <WalletIcon className="h-4 w-4 mr-2" />
              {t('key_45')}
            </Button>
          )}
        </div>
        <SheetData
          loading={isPendingClosableTokens}
          rowData={closableTokens}
          columnDefs={columnDefsCloseToken}
        />
        {totalClosableToken === 0 && (
          <Alert className="border-amber-600 text-amber-600 dark:border-amber-400 dark:text-amber-400 ">
            <AlertTitle>{t('key_46')}</AlertTitle>
            <AlertDescription>{t('key_47')}</AlertDescription>
          </Alert>
        )}
      </Card>
    </section>
  );
}
export default CloseTokenAccountComponent;

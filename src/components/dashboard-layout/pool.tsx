'use client';
import usePoolAddressTokenMint, {
  Pair,
  UsePoolAddressTokenMintResponse,
} from '@/hooks/dexscreener/use-pool-address-token-mint';
import {
  UseAllDigitalAssetByOwnerResponse,
  useAllDigitalAssetByOwnerQuery,
} from '@/hooks/metaplex/use-all-digital-asset-by-owner';
import { useFetchDigitalAssetQuery } from '@/hooks/metaplex/use-fetch-digital-asset';
import {
  ColDef,
  ColGroupDef,
  ICellRendererParams,
  ValueFormatterParams,
} from 'ag-grid-community';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Suspense, memo, useCallback, useMemo, useState } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import {
  SheetData,
  SheetDataPagination,
  SheetDataProvider,
  ViewColumns,
} from '../kit/sheet-data';
import { Avatar, AvatarImage, Button } from '../ui';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Form } from '../ui/form';
import SelectCombobox, { ComboboxItem } from '../ui/select-token-combobox';
import { Spinner } from '../ui/spinner';
import CreateLiquidityComponent, {
  CreateLiquidityFormData,
} from './create-liquidity';

const decimalFormatter = new Intl.NumberFormat('en-US', {
  style: 'decimal',
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
});

const compactFormatter = new Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 2,
});

const columnDefs: (
  | ColDef<UsePoolAddressTokenMintResponse['pairs'][number]>
  | ColGroupDef<UsePoolAddressTokenMintResponse['pairs'][number]>
)[] = [
  {
    headerName: 'Name',
    cellDataType: 'string',
    cellRenderer: ({ data }: ICellRendererParams<Pair, string>) => {
      console.table(data);
      const info = data?.info;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="size-7">
            <AvatarImage
              src={info?.imageUrl || 'https://placehold.co/60x60'}
              loading="lazy"
              alt="Image"
              width="0"
              height="0"
            />
          </Avatar>
          <span>{data?.baseToken.symbol}</span>
          <span>/</span>
          <span>{data?.quoteToken.symbol}</span>
        </div>
      );
    },
  },
  {
    headerName: 'Price',
    field: 'priceNative',
    cellDataType: 'string',

    valueFormatter: (params: ValueFormatterParams<Pair>) => {
      return decimalFormatter.format(params.value);
    },
  },
  {
    headerName: 'Volume',
    headerClass: '[&_div.ag-header-cell-comp-wrapper]:justify-center ',
    children: [
      {
        headerName: '5m',
        field: 'volume.m5',
        cellDataType: 'number',
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
      {
        headerName: '24h',
        field: 'volume.h24',
        cellDataType: 'number',
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
      {
        headerName: '6h',
        field: 'volume.h6',
        cellDataType: 'number',
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
      {
        headerName: '1h',
        field: 'volume.h1',
        cellDataType: 'number',
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
    ],
  },
  {
    headerName: 'FDV',
    field: 'fdv',
    cellDataType: 'number',
    valueFormatter: (params: ValueFormatterParams<Pair>) => {
      return params.value ? compactFormatter.format(params.value) : '-';
    },
  },
  {
    headerName: 'Market Cap',
    field: 'marketCap',
    cellDataType: 'number',
    valueFormatter: (params: ValueFormatterParams<Pair>) => {
      return params.value ? compactFormatter.format(params.value) : '-';
    },
  },
  {
    headerName: 'Pair Created At',
    field: 'pairCreatedAt',
    cellDataType: 'date',
    valueFormatter: (params: ValueFormatterParams<Pair>) => {
      return format(new Date(params.value), 'dd/MM/yyyy HH:mm');
    },
  },
];
export default function PoolComponent() {
  const t = useTranslations();
  const createPoolForm = useForm<CreateLiquidityFormData>({
    defaultValues: {
      baseToken: null,
    },
    mode: 'onChange',
  });

  const [baseToken] = useWatch({
    control: createPoolForm.control,
    name: ['baseToken'],
  });

  const { data: poolAddressTokenMint, isPending } = usePoolAddressTokenMint(
    baseToken?.publicKey || 'So11111111111111111111111111111111111111112',
  );

  return (
    <section className="p-5 flex-auto overflow-y-auto">
      <h1 className="text-2xl font-bold text-center">{t('key_55')}</h1>
      <p className="text-sm text-muted-foreground text-center">{t('key_56')}</p>
      <Suspense fallback={<Spinner className="size-10 animate-spin mx-auto" />}>
        <SheetDataProvider>
          <div className="flex items-center justify-between my-4">
            <div>
              <ViewColumns />
              {/* <ColumnFilters /> */}
            </div>
            <Form
              className="flex items-center gap-4 "
              form={createPoolForm}
              onSubmit={() => {}}
            >
              <div />
              <SelectBaseToken />
              <CreatePool />
            </Form>
          </div>
          <div className="w-full  h-[calc(100%-170px)]">
            <SheetData
              loading={isPending}
              rowData={poolAddressTokenMint?.pairs || []}
              columnDefs={columnDefs}
              noRowsOverlayComponent={() => (
                <Alert variant="default">
                  <AlertTitle>{t('key_57')}</AlertTitle>
                  <AlertDescription>{t('key_58')}</AlertDescription>
                </Alert>
              )}
            />
            <SheetDataPagination
              currentPage={1}
              totalPages={1}
              setCurrentPage={() => {}}
            />
          </div>
        </SheetDataProvider>
      </Suspense>
    </section>
  );
}

const CreatePool = memo(() => {
  const t = useTranslations();
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus />
            <span className="hidden md:block">{t('key_48')}</span>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle />
          <CreateLiquidityComponent />
        </DialogContent>
      </Dialog>
    </div>
  );
});
CreatePool.displayName = 'CreatePool';

const SelectBaseToken = () => {
  const t = useTranslations();
  const liquidityForm = useFormContext<CreateLiquidityFormData>();
  const { data: baseTokenData = [], isLoading: loadingBaseTokenData } =
    useAllDigitalAssetByOwnerQuery();

  const [baseTokenMintAddress, setBaseTokenMintAddress] = useState('');
  const { isLoading: isLoadingBaseTokenDataQuery } =
    useFetchDigitalAssetQuery(baseTokenMintAddress);

  const memoizedBaseTokenData = useMemo(
    () =>
      baseTokenData.map(token => ({
        ...token,
        description: token.publicKey,
      })),
    [baseTokenData],
  );

  const handleBaseTokenSelect = useCallback(
    (token: ComboboxItem<UseAllDigitalAssetByOwnerResponse[number]>) => {
      liquidityForm.setValue('baseToken', token);
    },
    [liquidityForm],
  );

  const onBaseTokenNotFound = useCallback((search: string) => {
    setBaseTokenMintAddress(search);
  }, []);

  return (
    <SelectCombobox<UseAllDigitalAssetByOwnerResponse[number]>
      placeholder={t('key_59')}
      data={memoizedBaseTokenData}
      isLoading={loadingBaseTokenData || isLoadingBaseTokenDataQuery}
      onSelect={handleBaseTokenSelect}
      onNotFound={onBaseTokenNotFound}
      className="max-w-xs"
    />
  );
};

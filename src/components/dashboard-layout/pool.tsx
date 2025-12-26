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
import CreateLiquidityComponent, {
  CreateLiquidityFormData,
} from './create-liquidity';
import { Spinner } from '../ui/spinner';

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
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
      {
        headerName: '24h',
        field: 'volume.h24',
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
      {
        headerName: '6h',
        field: 'volume.h6',
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
      {
        headerName: '1h',
        field: 'volume.h1',
        valueFormatter: (params: ValueFormatterParams<Pair>) => {
          return decimalFormatter.format(params.value);
        },
      },
    ],
  },
  {
    headerName: 'FDV',
    field: 'fdv',
    valueFormatter: (params: ValueFormatterParams<Pair>) => {
      return compactFormatter.format(params.value);
    },
  },
  {
    headerName: 'Market Cap',
    field: 'marketCap',
    valueFormatter: (params: ValueFormatterParams<Pair>) => {
      return compactFormatter.format(params.value);
    },
  },
  {
    headerName: 'Pair Created At',
    field: 'pairCreatedAt',
    valueFormatter: (params: ValueFormatterParams<Pair>) => {
      return format(new Date(params.value), 'dd/MM/yyyy HH:mm');
    },
  },
];
export default function PoolComponent() {
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
    baseToken?.publicKey || '',
  );

  return (
    <section className="p-5 flex-auto overflow-y-auto">
      <h1 className="text-2xl font-bold text-center">Pool</h1>
      <p className="text-sm text-muted-foreground text-center">
        View the details of a liquidity pool on Solana
      </p>
      <Suspense fallback={<Spinner className="size-10 animate-spin mx-auto" />}>
        <SheetDataProvider>
          <div className="flex items-center justify-between my-4">
            <div>
              <ViewColumns />
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
                  <AlertTitle>No pools found for the selected token</AlertTitle>
                  <AlertDescription>
                    Please select a different token or create a new pool.
                  </AlertDescription>
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
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus />
            <span className="hidden md:block">Create Pool</span>
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
      placeholder="Choose your token to view pools"
      data={memoizedBaseTokenData}
      isLoading={loadingBaseTokenData || isLoadingBaseTokenDataQuery}
      onSelect={handleBaseTokenSelect}
      onNotFound={onBaseTokenNotFound}
      className="max-w-xs"
    />
  );
};

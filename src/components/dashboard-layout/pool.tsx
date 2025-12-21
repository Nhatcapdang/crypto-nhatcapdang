'use client';
import usePoolAddressTokenMint, {
  Pair,
  UsePoolAddressTokenMintResponse,
} from '@/hooks/dexscreener/use-pool-address-token-mint';
import { ColDef, ICellRendererParams } from 'ag-grid-community';
import {
  SheetData,
  SheetDataPagination,
  SheetDataProvider,
  ViewColumns,
} from '../kit/sheet-data';
import { Avatar, AvatarImage } from '../ui';

const columnDefs: ColDef<UsePoolAddressTokenMintResponse['pairs'][number]>[] = [
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
  { headerName: 'Symbol', field: 'baseToken.symbol' },
  { headerName: 'Price', field: 'priceNative' },
  { headerName: 'Volume', field: 'volume.h24' },
  { headerName: 'Liquidity', field: 'liquidity.usd' },
  { headerName: 'Market Cap', field: 'marketCap' },
  { headerName: 'Pair Created At', field: 'pairCreatedAt' },
];
export default function PoolComponent() {
  const { data: poolAddressTokenMint, isPending } = usePoolAddressTokenMint(
    '2b1kV6DkPAnxd5ixfnxCpjxmKwqjjaYmCZfHsFu24GXo',
  );
  console.log(poolAddressTokenMint, 'poolAddressTokenMint');
  return (
    <section className=" p-5">
      <h1 className="text-2xl font-bold text-center">Pool</h1>
      <p className="text-sm text-muted-foreground text-center">
        View the details of a liquidity pool on Solana
      </p>
      <SheetDataProvider>
        <ViewColumns />
        <div className="w-full h-[calc(100vh-300px)]">
          <SheetData
            loading={isPending}
            rowData={poolAddressTokenMint?.pairs}
            columnDefs={columnDefs}
          />
          <SheetDataPagination
            currentPage={1}
            totalPages={1}
            setCurrentPage={() => {}}
          />
        </div>
      </SheetDataProvider>
    </section>
  );
}

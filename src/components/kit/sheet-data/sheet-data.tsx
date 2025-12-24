'use client';

import { ColDef } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import React, {
  ComponentProps,
  Context,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Spinner } from '../../ui/spinner';
import AgGridTheme from './ag-grid-theme';

type SheetDataContextValue<T> = {
  gridRef: AgGridReact<T> | null;
  setGridRef: (ref: AgGridReact<T>) => void;
};

const SheetDataContext = createContext<SheetDataContextValue<unknown> | null>(
  null,
);

const SheetDataProvider = <T,>({ children }: { children: React.ReactNode }) => {
  const [gridRef, setGridRef] = useState<AgGridReact<T> | null>(null);

  const contextValue = useMemo(() => {
    return {
      gridRef,
      setGridRef: (ref: AgGridReact<T>) => {
        setGridRef(ref);
      },
    };
  }, [gridRef]);
  return (
    <SheetDataContext.Provider
      value={contextValue as SheetDataContextValue<unknown>}
    >
      {children}
    </SheetDataContext.Provider>
  );
};

function useSheetData<T>() {
  const context = useContext<SheetDataContextValue<T> | null>(
    SheetDataContext as Context<SheetDataContextValue<T> | null>,
  );
  if (!context) {
    throw new Error('useSheetData must be used within SheetDataProvider');
  }
  return context as SheetDataContextValue<T>;
}

/**
 *
 * @example
 * <div className="w-full h-[calc(100vh-300px)]">
 *      <SheetData<{name: string, age: number}>
 *         rowData={[{name: 'John', age: 20}, {name: 'Jane', age: 21}]}
 *         columnDefs={[
 *           {headerName: 'Name', field: 'name'},
 *           {headerName: 'Age', field: 'age'},
 *         ]}
 *       />
 * </div>
 */
const SheetData = <T,>(props: ComponentProps<typeof AgGridReact<T>>) => {
  const gridRef = useRef<AgGridReact<T>>(null);

  const { setGridRef } = useSheetData<T>();

  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      flex: 1,
      minWidth: 120,
    }),
    [],
  );
  useEffect(() => {
    if (!gridRef.current) return;
    setGridRef(gridRef.current);
  }, [setGridRef]);

  return (
    <AgGridReact
      ref={gridRef}
      theme={AgGridTheme}
      defaultColDef={defaultColDef}
      tooltipShowMode="whenTruncated"
      tooltipShowDelay={500}
      tooltipInteraction
      // pagination
      // paginationPageSizeSelector={false}
      // rowBuffer={20}
      // if page size is 100 = cache overflow size 100, user have to scroll to the bottom to load more data ?
      // cacheOverflowSize={PAGE_SIZE - 1}
      // maxConcurrentDatasourceRequests={2}
      // infiniteInitialRowCount={1}
      loadingOverlayComponent={() => (
        <div className="ag-overlay-loading-center" role="presentation">
          <Spinner />
        </div>
      )}
      {...props}
    />
  );
};

export { SheetData, SheetDataProvider, useSheetData };

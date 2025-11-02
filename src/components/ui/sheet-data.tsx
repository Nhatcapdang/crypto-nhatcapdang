'use client';

import { mergeRefs } from '@mantine/hooks';
import {
  AllCommunityModule,
  ColDef,
  iconSetQuartzBold,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { ComponentProps, forwardRef, JSX, memo, useMemo, useRef } from 'react';

ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTheme = themeQuartz.withPart(iconSetQuartzBold).withParams({
  accentColor: 'var(--color-primary)',
  backgroundColor: 'var(--color-background)',
  borderRadius: 3,
  browserColorScheme: 'inherit',
  cellHorizontalPaddingScale: 1,
  checkboxCheckedShapeColor: 'var(--color-primary)',
  columnBorder: true,
  foregroundColor: 'var(--color-foreground)',
  headerFontFamily: 'inherit',
  headerFontSize: 14,
  headerFontWeight: 700,
  headerRowBorder: false,
  headerTextColor: 'var(--color-foreground)',
  headerVerticalPaddingScale: 1,
  iconSize: 14,
  rowBorder: true,
  rowVerticalPaddingScale: 1,
  wrapperBorder: false,
  wrapperBorderRadius: 8,
});

type SheetDataProps<T> = {} & ComponentProps<typeof AgGridReact<T>>;

// Create the inner component without generics
const SheetDataInner = <T,>(
  props: ComponentProps<typeof AgGridReact<T>>,
  ref: React.Ref<AgGridReact<T>>,
) => {
  const gridRef = useRef<AgGridReact<T>>(null);
  const mergedRef = mergeRefs(gridRef, ref);
  const defaultColDef = useMemo<ColDef<T>>(
    () => ({
      flex: 1,
      minWidth: 120,
    }),
    [],
  );

  return (
    <div className="w-full h-[400px]">
      <AgGridReact
        ref={mergedRef}
        theme={AgGridTheme}
        defaultColDef={defaultColDef}
        {...props}
      />
    </div>
  );
};

const SheetData = memo(forwardRef(SheetDataInner)) as <T>(
  props: SheetDataProps<T> & { ref?: React.Ref<AgGridReact<T>> },
) => JSX.Element;

export default SheetData;

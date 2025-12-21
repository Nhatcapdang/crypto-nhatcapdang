'use client';

import { Column } from 'ag-grid-community';
import { useEffect, useState } from 'react';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
} from '@/components/ui';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ChevronDown, Columns3, RefreshCcw, SearchIcon } from 'lucide-react';
import { useSheetData } from './sheet-data';

const ViewColumns = () => {
  const { gridRef } = useSheetData();
  const [searchQuery, setSearchQuery] = useState('');
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    setColumns(gridRef?.api?.getAllGridColumns() ?? []);

    gridRef?.api?.addEventListener('dragStopped', event => {
      setColumns(event.api.getAllGridColumns() ?? []);
    });
  }, [gridRef?.api]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn('ml-auto', {
            'cursor-not-allowed': columns.length === 0,
          })}
        >
          <Columns3 /> Columns <ChevronDown className="ml-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="relative">
          <Input
            autoFocus
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-8"
            placeholder="Search"
            onKeyDown={e => e.stopPropagation()}
          />
          <SearchIcon className="absolute inset-y-0 my-auto left-2 h-4 w-4" />
        </div>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[300px]">
          {columns.map((column, idx) => {
            const colDef = column.getColDef();
            const isVisible = column.isVisible();
            return (
              <DropdownMenuCheckboxItem
                key={idx}
                className="capitalize"
                checked={isVisible}
                onCheckedChange={value => {
                  gridRef?.api?.setColumnsVisible([column], value);
                  setColumns(gridRef?.api?.getAllGridColumns() ?? []);
                }}
                onSelect={e => e.preventDefault()}
              >
                {colDef.headerName}
              </DropdownMenuCheckboxItem>
            );
          })}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            gridRef?.api?.setColumnsVisible(columns, true);
            setColumns(gridRef?.api?.getAllGridColumns() ?? []);
          }}
        >
          <RefreshCcw /> Reset
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ViewColumns;

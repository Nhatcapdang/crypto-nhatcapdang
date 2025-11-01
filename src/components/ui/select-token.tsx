'use client';

import React, { memo, useId, useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  UseAllDigitalAssetByOwnerResponse,
  useAllDigitalAssetByOwnerQuery,
} from '@/hooks/metaplex/use-all-digital-asset-by-owner';
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Spinner } from './spinner';

type SelectTokenProps = {
  label?: string;
  placeholder?: string;
  onSelectToken?: (token: UseAllDigitalAssetByOwnerResponse[number]) => void;
  className?: string;
};

const SelectTokenComponent: React.FC<SelectTokenProps> = ({
  label,
  placeholder = 'Select token',
  className,
  onSelectToken,
}) => {
  const id = useId();
  const [open, setOpen] = useState(false);

  const { data: allDigitalAssetByOwner = [], isLoading } =
    useAllDigitalAssetByOwnerQuery();
  const [selectedToken, setSelectedToken] = useState<
    UseAllDigitalAssetByOwnerResponse[number] | null
  >(null);

  const handleSelectToken = (
    token: UseAllDigitalAssetByOwnerResponse[number],
  ) => {
    setSelectedToken(token);
    onSelectToken?.(token);
  };
  return (
    <div className={cn('w-full max-w-xl space-y-2', className)}>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
            size="lg"
          >
            {selectedToken ? (
              <RenderTrigger
                image={selectedToken.image}
                name={selectedToken.metadata.name}
                symbol={selectedToken.metadata.symbol}
                mint={selectedToken.metadata.mint}
              />
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDownIcon
              size={16}
              className="text-muted-foreground/80 shrink-0"
              aria-hidden="true"
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[520px] p-0">
          <Command>
            <CommandInput placeholder="Search token by name or mint address" />
            <CommandList>
              <CommandEmpty>
                {isLoading ? (
                  <div className="flex items-center gap-2 justify-center ">
                    <Spinner className="size-6" />
                    Loading tokens…
                  </div>
                ) : (
                  'No tokens found.'
                )}
              </CommandEmpty>
              <CommandGroup>
                {allDigitalAssetByOwner.map(item => (
                  <CommandItem
                    key={item.metadata.mint.toString()}
                    value={item.metadata.mint.toString()}
                    onSelect={() => handleSelectToken(item)}
                  >
                    <RenderItem
                      mint={item.metadata.mint}
                      name={item.metadata.name}
                      symbol={item.metadata.symbol}
                      image={item.image}
                      checked={
                        selectedToken?.metadata.mint === item.metadata.mint
                      }
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const SelectToken = memo(SelectTokenComponent);

export const RenderItem = ({
  mint,
  name,
  symbol,
  image,
  checked = false,
}: {
  mint: string;
  name: string;
  symbol: string;
  image: string;
  checked?: boolean;
}) => {
  return (
    <div className="flex gap-3 w-full items-center">
      <Avatar className="size-7 mt-0.5">
        <AvatarImage src={image} alt={name} loading="lazy" />
        <AvatarFallback>
          {(symbol || name || 'T').toString().slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name || 'Unknown'}</span>
          <span className="text-muted-foreground text-xs">{symbol}</span>
        </div>
        <div className=" mt-1 text-xs">
          <div className="text-muted-foreground font-mono truncate">{mint}</div>
        </div>
      </div>
      {checked && <CheckIcon size={16} className="ml-auto" />}
    </div>
  );
};

export const RenderTrigger = ({
  image,
  name,
  symbol,
  mint,
}: {
  image: string;
  name: string;
  symbol: string;
  mint: string;
}) => {
  return (
    <span className="flex gap-2 items-center truncate">
      <Avatar className="size-6">
        <AvatarImage src={image} alt={name} loading="lazy" />
        <AvatarFallback>
          {(symbol || name || 'T').toString().slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="flex flex-col text-left">
        <span className="font-medium leading-tight">
          {name || symbol}
          {symbol && ` (${symbol})`}
        </span>
        <span className="text-muted-foreground text-xs font-mono truncate">
          {mint}
        </span>
      </span>
    </span>
  );
};

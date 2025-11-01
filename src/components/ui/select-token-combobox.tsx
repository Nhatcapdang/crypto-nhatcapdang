'use client';

import { useId, useState } from 'react';

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
import { cn } from '@/lib/utils';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { Spinner } from './spinner';

export type ComboboxItem<T extends object> = T & {
  image: string;
  name: string;
  symbol: string;
  description: string;
};

type SelectComboboxProps<T extends object> = {
  label?: string;
  placeholder?: string;
  className?: string;
  data: ComboboxItem<Partial<T>>[];
  isLoading?: boolean;
  onSelect?: (token: ComboboxItem<T>) => void;
};

const SelectCombobox = <T extends object>({
  label,
  placeholder = 'Select item',
  className,
  data,
  isLoading,
  onSelect,
}: SelectComboboxProps<T>) => {
  const id = useId();
  const [open, setOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<ComboboxItem<T> | null>(
    null,
  );

  const handleSelectToken = (token: ComboboxItem<T>) => {
    setSelectedItem(token);
    onSelect?.(token);
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
            {selectedItem ? (
              <RenderTrigger
                image={selectedItem.image}
                name={selectedItem.name}
                symbol={selectedItem.symbol}
                description={selectedItem.description}
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
            <CommandInput placeholder="Search token by name, symbol or mint address" />
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
                {data.map(item => (
                  <CommandItem
                    key={item.name}
                    value={item.name}
                    onSelect={() => handleSelectToken(item as ComboboxItem<T>)}
                  >
                    <RenderItem
                      description={item.description}
                      name={item.name}
                      symbol={item.symbol}
                      image={item.image}
                      checked={selectedItem?.name === item.name}
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

export default SelectCombobox;

const RenderItem = ({
  description,
  name,
  symbol,
  image,
  checked = false,
}: {
  description: string;
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
          <div className="text-muted-foreground font-mono truncate">
            {description}
          </div>
        </div>
      </div>
      {checked && <CheckIcon size={16} className="ml-auto" />}
    </div>
  );
};

const RenderTrigger = ({
  image,
  name,
  symbol,
  description,
}: {
  image: string;
  name: string;
  symbol: string;
  description: string;
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
          {description}
        </span>
      </span>
    </span>
  );
};

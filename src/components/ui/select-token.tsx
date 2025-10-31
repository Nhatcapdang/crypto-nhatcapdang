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
  useAllDigitalAssetByOwner,
} from '@/hooks/metaplex/useAllDigitalAssetByOwner';
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
    useAllDigitalAssetByOwner();
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
              <span className="flex gap-2 items-center truncate">
                <Avatar className="size-6">
                  <AvatarImage
                    src={selectedToken.image}
                    alt={selectedToken.metadata.name}
                    loading="lazy"
                  />
                  <AvatarFallback>
                    {(
                      selectedToken.metadata.symbol ||
                      selectedToken.metadata.name ||
                      'T'
                    )
                      .toString()
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="flex flex-col text-left">
                  <span className="font-medium leading-tight">
                    {selectedToken.metadata.name ||
                      selectedToken.metadata.symbol ||
                      'Unknown'}
                    {selectedToken.metadata.symbol &&
                      ` (${selectedToken.metadata.symbol})`}
                  </span>
                  {selectedToken.metadata.mint && (
                    <span className="text-muted-foreground text-xs font-mono truncate">
                      {selectedToken.metadata.mint}
                    </span>
                  )}
                </span>
              </span>
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
                  <>
                    <Spinner className="size-6" />
                    Loading tokens…
                  </>
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
                    <div className="flex gap-3 w-full items-center">
                      <Avatar className="size-7 mt-0.5">
                        <AvatarImage
                          src={item.image}
                          alt={item.metadata.name}
                          loading="lazy"
                        />
                        <AvatarFallback>
                          {(item.metadata.symbol || item.metadata.name || 'T')
                            .toString()
                            .slice(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {item.metadata.name || 'Unknown'}
                          </span>
                          {item.metadata.symbol && (
                            <span className="text-muted-foreground text-xs">
                              {item.metadata.symbol}
                            </span>
                          )}
                        </div>
                        <div className=" mt-1 text-xs">
                          {item.metadata.mint && (
                            <div className="text-muted-foreground font-mono truncate">
                              {item.metadata.mint}
                            </div>
                          )}
                        </div>
                      </div>
                      {selectedToken &&
                        selectedToken.metadata.mint === item.metadata.mint && (
                          <CheckIcon size={16} className="ml-auto" />
                        )}
                    </div>
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

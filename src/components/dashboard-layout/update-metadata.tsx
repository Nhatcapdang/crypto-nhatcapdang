'use client';

import {
  FormCheckbox,
  FormFile,
  FormInput,
  FormSelect,
  FormTextarea,
} from '@/components/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ChevronDown,
  Coins,
  DecimalsArrowRight,
  Globe,
  Hash,
  Image as ImageIcon,
  Layers,
  Loader,
  Search,
  Send,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SelectItem,
  ToggleGroup,
  ToggleGroupItem,
} from '../ui';
import { SelectToken } from '../ui/select-token';

// Solana public key validation regex (base58, typically 32-44 characters)
const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

// Extended schema for update token
const UpdateMetadataFormSchema = z.object({
  tokenMintAddress: z
    .string()
    .min(1, 'Token mint address is required')
    .regex(
      solanaAddressRegex,
      'Invalid Solana address format (must be 32-44 base58 characters)',
    ),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters')
    .regex(
      /^[a-zA-Z0-9\s]+$/,
      'Name can only contain letters, numbers, and spaces',
    ),
  symbol: z
    .string()
    .min(2, 'Symbol must be at least 2 characters')
    .max(50, 'Symbol must not exceed 50 characters'),
  totalSupply: z
    .number()
    .positive('Total supply must be a positive number')
    .int('Total supply must be an integer')
    .min(1, 'Total supply must be at least 1'),
  decimals: z
    .number()
    .int('Decimals must be an integer')
    .min(0, 'Decimals must be between 0 and 9')
    .max(9, 'Decimals must be between 0 and 9'),
  description: z.string().min(2, 'Description must be at least 2 characters'),
  revokeFreezeAuthority: z.boolean(),
  revokeMintAuthority: z.boolean(),
  revokeUpdateAuthority: z.boolean(),
  website: z
    .string()
    .url('Your website URL is not valid')
    .optional()
    .or(z.literal('')),
  telegram: z
    .string()
    .url('Your Telegram URL is not valid')
    .optional()
    .or(z.literal('')),
  twitter: z
    .string()
    .url('Your Twitter/X URL is not valid')
    .optional()
    .or(z.literal('')),
  discord: z
    .string()
    .url('Your Discord URL is not valid')
    .optional()
    .or(z.literal('')),
  tokenImage: z
    .custom<File>(
      val => val instanceof File || val === undefined,
      'Token image must be a valid file',
    )
    .refine(
      file => !file || file.size <= 5 * 1024 * 1024,
      'Image must be less than 5MB',
    )
    .refine(
      file =>
        !file ||
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          file.type,
        ),
      'Image must be JPEG, PNG, GIF, or WebP',
    )
    .optional(),
});

type UpdateMetadataFormData = z.infer<typeof UpdateMetadataFormSchema>;

// Mock data for demonstration - replace with actual Solana calls
const mockUserTokens = [
  {
    address: 'So11111111111111111111111111111111111111112',
    name: 'SOL',
    symbol: 'SOL',
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USDC',
    symbol: 'USDC',
  },
  {
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    name: 'USDT',
    symbol: 'USDT',
  },
];

const UpdateMetadataComponent = React.memo(() => {
  const [selectionMethod, setSelectionMethod] = useState<'select' | 'manual'>(
    'select',
  );
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [hasFetchedToken, setHasFetchedToken] = useState(false);

  const defaultValues = useMemo<UpdateMetadataFormData>(
    () => ({
      tokenMintAddress: '',
      name: '',
      symbol: '',
      totalSupply: 1000000,
      decimals: 9,
      description: '',
      revokeFreezeAuthority: true,
      revokeMintAuthority: true,
      revokeUpdateAuthority: false,
      website: '',
      telegram: '',
      twitter: '',
      discord: '',
      tokenImage: undefined,
    }),
    [],
  );

  const form = useForm<UpdateMetadataFormData>({
    resolver: zodResolver(UpdateMetadataFormSchema),
    defaultValues,
  });

  const watchedTokenAddress = form.watch('tokenMintAddress');

  // Fetch token metadata when address is provided
  useEffect(() => {
    const fetchTokenMetadata = async () => {
      if (!watchedTokenAddress || !hasFetchedToken) return;

      setIsFetchingToken(true);
      try {
        // TODO: Implement actual Solana token metadata fetching
        // For now, using mock data
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock token data - replace with actual fetch
        const mockTokenData: UpdateMetadataFormData = {
          tokenMintAddress: watchedTokenAddress,
          name: 'Example Token',
          symbol: 'EXP',
          totalSupply: 1000000,
          decimals: 9,
          description:
            'This is an example token description with details about the token.',
          revokeFreezeAuthority: true,
          revokeMintAuthority: true,
          revokeUpdateAuthority: false,
          website: 'https://example.com',
          telegram: 'https://t.me/example',
          twitter: 'https://twitter.com/example',
          discord: 'https://discord.gg/example',
          tokenImage: undefined,
        };

        form.reset(mockTokenData);
        toast.success('Token metadata loaded successfully');
      } catch (error) {
        toast.error('Failed to fetch token metadata', {
          description:
            error instanceof Error
              ? error.message
              : 'Unable to load token information',
        });
      } finally {
        setIsFetchingToken(false);
      }
    };

    fetchTokenMetadata();
  }, [watchedTokenAddress, hasFetchedToken, form]);

  const handleLoadToken = () => {
    const address = form.getValues('tokenMintAddress');
    if (!address) {
      toast.error('Please enter a token address');
      return;
    }
    setHasFetchedToken(true);
  };

  const onSubmit = async (data: UpdateMetadataFormData) => {
    try {
      // TODO: Implement actual API call to update token on Solana
      console.log('Token update data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Token updated successfully!');
    } catch (error) {
      toast.error('Failed to update token', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  };

  return (
    <section className=" p-5">
      <h1 className="text-2xl font-bold text-center">Update Token</h1>
      <p className="text-sm text-muted-foreground text-center">
        Update your existing token metadata and settings on Solana
      </p>
      <Card className="w-full max-w-4xl mx-auto mt-4">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-6">
            {/* Token Selection Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="h-5 w-5 text-primary" />
                Select Token
              </h3>

              {/* Toggle between selection methods */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Selection Method:</span>
                <ToggleGroup
                  type="single"
                  value={selectionMethod}
                  onValueChange={value => {
                    if (value) setSelectionMethod(value as 'select' | 'manual');
                  }}
                  className="flex"
                >
                  <ToggleGroupItem
                    value="select"
                    aria-label="Select from dropdown"
                  >
                    Select from List
                  </ToggleGroupItem>
                  <ToggleGroupItem value="manual" aria-label="Enter manually">
                    Enter Address
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Selection UI based on method */}
              {selectionMethod === 'select' ? (
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
                  <SelectToken />
                  <FormSelect
                    control={form.control}
                    name="tokenMintAddress"
                    label="Your Tokens"
                    placeholder="Select a token"
                    value={form.watch('tokenMintAddress')}
                    onValueChange={value => {
                      form.setValue('tokenMintAddress', value);
                      setHasFetchedToken(false);
                    }}
                    leftIcon={<Coins className="h-4 w-4" />}
                  >
                    {mockUserTokens.map(token => (
                      <SelectItem key={token.address} value={token.address}>
                        {token.name} ({token.symbol})
                      </SelectItem>
                    ))}
                  </FormSelect>
                  <Button
                    type="button"
                    onClick={handleLoadToken}
                    disabled={!watchedTokenAddress || isFetchingToken}
                    className="h-10"
                  >
                    {isFetchingToken ? (
                      <Loader className="animate-spin h-4 w-4" />
                    ) : (
                      'Load'
                    )}
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-[1fr_auto] items-end">
                  <FormInput
                    control={form.control}
                    name="tokenMintAddress"
                    label="Token Mint Address"
                    placeholder="Enter Solana token address..."
                    leftIcon={<Hash className="h-4 w-4" />}
                    required
                  />
                  <Button
                    type="button"
                    onClick={handleLoadToken}
                    disabled={!watchedTokenAddress || isFetchingToken}
                    className="h-10"
                  >
                    {isFetchingToken ? (
                      <Loader className="animate-spin h-4 w-4" />
                    ) : (
                      'Load'
                    )}
                  </Button>
                </div>
              )}
            </div>

            {hasFetchedToken && !isFetchingToken && (
              <>
                {/* Section 1: Token Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Coins className="h-5 w-5 text-primary" />
                    Token Information
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2 items-center">
                    <FormInput
                      control={form.control}
                      name="name"
                      label="Token Name"
                      placeholder="Solana, Ethereum, Bitcoin, etc."
                      leftIcon={<Coins className="h-4 w-4" />}
                      required
                    />
                    <FormInput
                      control={form.control}
                      name="symbol"
                      label="Token Symbol"
                      placeholder="SOL, ETH, BTC, etc."
                      leftIcon={<Hash className="h-4 w-4" />}
                      required
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 items-center">
                    <FormInput
                      control={form.control}
                      name="totalSupply"
                      label="Total Supply"
                      type="number"
                      placeholder="1000000"
                      leftIcon={<Layers className="h-4 w-4" />}
                    />
                    <FormSelect
                      control={form.control}
                      name="decimals"
                      label="Decimals"
                      value={form.watch('decimals').toString()}
                      onValueChange={value => {
                        form.setValue('decimals', Number(value));
                      }}
                      leftIcon={<DecimalsArrowRight className="h-4 w-4" />}
                    >
                      <SelectItem value="1">1 Decimals</SelectItem>
                      <SelectItem value="2">2 Decimals</SelectItem>
                      <SelectItem value="3">3 Decimals</SelectItem>
                      <SelectItem value="4">4 Decimals</SelectItem>
                      <SelectItem value="5">5 Decimals</SelectItem>
                      <SelectItem value="6">6 Decimals</SelectItem>
                      <SelectItem value="7">7 Decimals</SelectItem>
                      <SelectItem value="8">8 Decimals</SelectItem>
                      <SelectItem value="9">9 Decimals</SelectItem>
                    </FormSelect>
                  </div>
                  <FormTextarea
                    control={form.control}
                    name="description"
                    label="Description"
                    placeholder="Enter a brief description of your token..."
                    className="min-h-24 max-h-48"
                    required
                  />
                </div>

                {/* Section 3: Authority Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Authority Settings
                  </h3>
                  <div className="grid gap-4 md:grid-cols-3">
                    <FormCheckbox
                      control={form.control}
                      name="revokeFreezeAuthority"
                      label="Revoke Freeze Authority"
                      description="Prevents freezing of token accounts"
                    />
                    <FormCheckbox
                      control={form.control}
                      name="revokeMintAuthority"
                      label="Revoke Mint Authority"
                      description="Prevents creating additional tokens"
                    />
                    <FormCheckbox
                      control={form.control}
                      name="revokeUpdateAuthority"
                      label="Revoke Update Authority"
                      description="Prevents updating token metadata"
                    />
                  </div>
                </div>

                {/* Section 2: Token Image */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    Token Image
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Leave empty to keep the current image
                  </p>
                  <FormFile
                    control={form.control}
                    name="tokenImage"
                    label="Upload New Token Image (Optional)"
                    description="Recommended: 512x512px, Max 5MB. Supported formats: PNG, JPG, GIF, WebP"
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                    accept={{
                      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                    }}
                  />
                </div>

                {/* Section 4: Social Links */}
                <Collapsible>
                  <CollapsibleTrigger className="group flex items-center justify-between gap-2 w-full py-4 transition-colors cursor-pointer">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Globe className="h-5 w-5 text-primary" />
                      Social Links (Optional)
                    </h3>
                    <ChevronDown className="h-4 w-4 group-data-[state=open]:rotate-180 transition-transform text-muted-foreground" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid gap-4 sm:grid-cols-2 items-baseline">
                      <FormInput
                        control={form.control}
                        name="website"
                        label="Website"
                        type="url"
                        placeholder="https://example.com"
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                      <FormInput
                        control={form.control}
                        name="telegram"
                        label="Telegram"
                        type="url"
                        placeholder="https://t.me/..."
                        leftIcon={<Send className="h-4 w-4" />}
                      />
                      <FormInput
                        control={form.control}
                        name="twitter"
                        label="Twitter/X"
                        type="url"
                        placeholder="https://twitter.com/..."
                        leftIcon={<X className="h-4 w-4" />}
                      />
                      <FormInput
                        control={form.control}
                        name="discord"
                        label="Discord"
                        type="url"
                        placeholder="https://discord.gg/..."
                        leftIcon={<Globe className="h-4 w-4" />}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </>
            )}

            {isFetchingToken && (
              <div className="flex items-center justify-center py-8">
                <Loader className="animate-spin h-8 w-8 text-primary" />
                <span className="ml-2 text-muted-foreground">
                  Loading token metadata...
                </span>
              </div>
            )}
          </CardContent>

          {hasFetchedToken && !isFetchingToken && (
            <CardFooter className="flex justify-end mt-4">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin size-4 mr-2" />
                ) : (
                  <ShieldCheck className="h-4 w-4 mr-2" />
                )}
                Update Token
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </section>
  );
});

UpdateMetadataComponent.displayName = 'UpdateToken';

export default UpdateMetadataComponent;
export { UpdateMetadataComponent };

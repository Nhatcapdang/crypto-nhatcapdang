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
import { useUpdateTokenMetadataMutation } from '@/hooks/metaplex';
import { UseAllDigitalAssetByOwnerResponse } from '@/hooks/metaplex/use-all-digital-asset-by-owner';
import { AmountBigInt } from '@/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import {
  ChevronDown,
  Coins,
  DecimalsArrowRight,
  Globe,
  Hash,
  Image as ImageIcon,
  Layers,
  Pencil,
  Shield,
  WalletIcon,
} from 'lucide-react';
import React, { useCallback } from 'react';
import { Controller, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { DiscordLogo, TelegramLogo, XLogo } from '../../../public/svgs';
import NumberFormatter from '../form/NumberFormatter';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SelectItem,
} from '../ui';
import { SelectToken } from '../ui/select-token';
import { Spinner } from '../ui/spinner';

const UpdateMetadataFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must not exceed 50 characters'),
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
  freezeAuthority: z.boolean(),
  mintAuthority: z.boolean(),
  updateAuthority: z.boolean(),
  website: z
    .string()
    .refine(
      val => val === '' || z.string().url().safeParse(val).success,
      'Your website URL must be a valid URL, e.g. https://example.com',
    )
    .optional(),
  telegram: z
    .string()
    .refine(
      val => val === '' || z.string().url().safeParse(val).success,
      'Your Telegram URL must be a valid URL, e.g. https://t.me/...',
    )
    .optional(),
  twitter: z
    .string()
    .refine(
      val => val === '' || z.string().url().safeParse(val).success,
      'Your Twitter/X URL must be a valid URL, e.g. https://twitter.com/...',
    )
    .optional(),
  discord: z
    .string()
    .refine(
      val => val === '' || z.string().url().safeParse(val).success,
      'Your Discord URL must be a valid URL, e.g. https://discord.gg/...',
    )
    .optional(),
  tokenImage: z
    .union([z.instanceof(File), z.string(), z.null()])
    .refine(
      val => {
        // If it's a string (URL), it's valid
        if (typeof val === 'string') return true;
        // If it's a File, check size
        if (val instanceof File) {
          return val.size <= 5 * 1024 * 1024;
        }
        return false;
      },
      {
        message: 'Image must be less than 5MB',
      },
    )
    .refine(
      val => {
        // If it's a string (URL), it's valid
        if (typeof val === 'string') return true;
        // If it's a File, check type
        if (val instanceof File) {
          return [
            'image/jpeg',
            'image/png',
            'image/gif',
            'image/webp',
          ].includes(val.type);
        }
        return false;
      },
      {
        message: 'Image must be JPEG, PNG, GIF, or WebP',
      },
    )
    .optional(),
  selectedToken: z.custom<UseAllDigitalAssetByOwnerResponse[number] | null>(
    val => val !== null && val !== undefined,
    { message: 'Please select a token to update' },
  ),
});

export type UpdateMetadataForm = z.infer<typeof UpdateMetadataFormSchema>;

const UpdateMetadataComponent = React.memo(() => {
  const { setVisible } = useWalletModal();
  const { connected } = useWallet();
  const { mutate: updateTokenMetadataMutation, isPending } =
    useUpdateTokenMetadataMutation();
  const updateMetadataForm = useForm<UpdateMetadataForm>({
    resolver: zodResolver(UpdateMetadataFormSchema),
    defaultValues: {
      selectedToken: null,
      name: '',
      symbol: '',
      totalSupply: 0,
      decimals: 9,
      description: '',
      freezeAuthority: false,
      mintAuthority: false,
      updateAuthority: false,
      website: '',
      telegram: '',
      twitter: '',
      discord: '',
      tokenImage: null,
    },
    mode: 'onSubmit',
  });
  const [selectedToken] = useWatch({
    control: updateMetadataForm.control,
    name: ['selectedToken'],
  });

  const onSubmit = useCallback<SubmitHandler<UpdateMetadataForm>>(
    data => {
      updateTokenMetadataMutation(data, {
        onSuccess: () => {
          updateMetadataForm.reset();
        },
      });
    },
    [updateMetadataForm, updateTokenMetadataMutation],
  );

  return (
    <section className=" p-5">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Pencil className="h-6 w-6 text-primary" /> Update Token
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Update your existing token metadata and settings on Solana
      </p>
      <Card className="w-full max-w-4xl mx-auto mt-4">
        <form onSubmit={updateMetadataForm.handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-6">
            {/* Token Selection Section */}
            <div className="space-y-4">
              <Controller
                control={updateMetadataForm.control}
                name="selectedToken"
                render={({ field }) => (
                  <SelectToken
                    placeholder="Select token to update"
                    onSelectToken={token => {
                      field.onChange(token);
                      updateMetadataForm.setValue('name', token.metadata.name);
                      updateMetadataForm.setValue(
                        'symbol',
                        token.metadata.symbol,
                      );
                      updateMetadataForm.setValue(
                        'totalSupply',
                        AmountBigInt(token.mint.supply, token.mint.decimals),
                      );
                      updateMetadataForm.setValue(
                        'decimals',
                        token.mint.decimals,
                      );
                      updateMetadataForm.setValue(
                        'description',
                        token.description,
                      );
                      updateMetadataForm.setValue(
                        'freezeAuthority',
                        token.mint.freezeAuthority.__option === 'None',
                      );
                      updateMetadataForm.setValue(
                        'mintAuthority',
                        token.mint.mintAuthority.__option === 'None',
                      );
                      updateMetadataForm.setValue('updateAuthority', false);
                      updateMetadataForm.setValue('tokenImage', token.image);
                      updateMetadataForm.setValue('website', token.website);
                      updateMetadataForm.setValue('telegram', token.telegram);
                      updateMetadataForm.setValue('twitter', token.twitter);
                      updateMetadataForm.setValue('discord', token.discord);
                    }}
                  />
                )}
              />
            </div>

            <>
              {/* Section 1: Token Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" />
                  Token Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2 items-center">
                  <FormInput
                    control={updateMetadataForm.control}
                    name="name"
                    label="Token Name"
                    placeholder="Solana, Ethereum, Bitcoin, etc."
                    leftIcon={<Coins className="h-4 w-4" />}
                    required
                  />
                  <FormInput
                    control={updateMetadataForm.control}
                    name="symbol"
                    label="Token Symbol"
                    placeholder="SOL, ETH, BTC, etc."
                    leftIcon={<Hash className="h-4 w-4" />}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 items-center">
                  <NumberFormatter
                    control={updateMetadataForm.control}
                    name="totalSupply"
                    label="Total Supply"
                    leftIcon={<Layers className="h-4 w-4" />}
                    allowNegative={false}
                    thousandSeparator=","
                    disabled={
                      selectedToken?.mint.mintAuthority.__option === 'None'
                    }
                  />
                  <FormSelect
                    control={updateMetadataForm.control}
                    name="decimals"
                    label="Decimals"
                    value={updateMetadataForm.watch('decimals').toString()}
                    onValueChange={value => {
                      updateMetadataForm.setValue('decimals', Number(value));
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
                  control={updateMetadataForm.control}
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
                    control={updateMetadataForm.control}
                    name="freezeAuthority"
                    label="Revoke Freeze Authority"
                    description="Prevents freezing of token accounts"
                    disabled={
                      selectedToken?.mint.freezeAuthority.__option === 'None'
                    }
                  />
                  <FormCheckbox
                    control={updateMetadataForm.control}
                    name="mintAuthority"
                    label="Revoke Mint Authority"
                    description="Prevents creating additional tokens"
                    disabled={
                      selectedToken?.mint.mintAuthority.__option === 'None'
                    }
                  />
                  <FormCheckbox
                    control={updateMetadataForm.control}
                    name="updateAuthority"
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
                  control={updateMetadataForm.control}
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
              <Collapsible defaultOpen>
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
                      control={updateMetadataForm.control}
                      name="website"
                      label="Website"
                      type="url"
                      placeholder="https://example.com"
                      leftIcon={<Globe className="h-5 w-5" />}
                    />
                    <FormInput
                      control={updateMetadataForm.control}
                      name="telegram"
                      label="Telegram"
                      type="url"
                      placeholder="https://t.me/..."
                      leftIcon={
                        <TelegramLogo
                          width={20}
                          height={20}
                          className="text-muted-foreground [&>path]:fill-current"
                        />
                      }
                    />
                    <FormInput
                      control={updateMetadataForm.control}
                      name="twitter"
                      label="Twitter/X"
                      type="url"
                      placeholder="https://twitter.com/..."
                      leftIcon={<XLogo width={16} height={16} />}
                    />
                    <FormInput
                      control={updateMetadataForm.control}
                      name="discord"
                      label="Discord"
                      type="url"
                      placeholder="https://discord.gg/..."
                      leftIcon={
                        <DiscordLogo
                          width={20}
                          height={20}
                          className="text-muted-foreground [&>path]:fill-current"
                        />
                      }
                    />
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </>
          </CardContent>

          <CardFooter className="flex justify-end mt-4">
            {connected ? (
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? <Spinner /> : <Pencil className="h-4 w-4 mr-2" />}{' '}
                Update Token (0.1 SOL)
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full"
                onClick={() => setVisible(true)}
              >
                <WalletIcon className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </section>
  );
});

UpdateMetadataComponent.displayName = 'UpdateToken';

export default UpdateMetadataComponent;
export { UpdateMetadataComponent };

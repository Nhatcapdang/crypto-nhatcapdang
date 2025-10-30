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
  Send,
  Shield,
  ShieldCheck,
  X,
} from 'lucide-react';
import React, { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  SelectItem,
} from '../ui';

// Zod validation schema
const tokenFormSchema = z.object({
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
  description: z.string().min(2, 'Description must be at least 20 characters'),
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
      val => val instanceof File,
      'Are you serious? You want your token image to be naked?',
    )
    .refine(file => file.size <= 5 * 1024 * 1024, 'Image must be less than 5MB')
    .refine(
      file =>
        ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(
          file.type,
        ),
      'Image must be JPEG, PNG, GIF, or WebP',
    ),
});

type TokenFormData = z.infer<typeof tokenFormSchema>;

const CreateTokenComponent = React.memo(() => {
  const defaultValues = useMemo<TokenFormData>(
    () => ({
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
      tokenImage: undefined as unknown as File,
    }),
    [],
  );

  const form = useForm<TokenFormData>({
    resolver: zodResolver(tokenFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TokenFormData) => {
    try {
      // TODO: Implement actual API call to create token
      console.log('Token creation data:', data);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Token created successfully!');
      // form.reset(defaultValues);
    } catch (error) {
      toast.error('Failed to create token', {
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      });
    }
  };

  return (
    <section className=" p-5">
      <h1 className="text-2xl font-bold text-center">Create Token</h1>
      <p className="text-sm text-muted-foreground text-center">
        Create a new token on Solana with custom settings and metadata
      </p>
      <Card className="w-full max-w-4xl mx-auto mt-4">
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <CardContent className="space-y-6">
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
                {/* <NumberFormatter
                  control={form.control}
                  name="totalSupply"
                  label="Total Supply"
                /> */}
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
              <FormFile
                control={form.control}
                name="tokenImage"
                label="Upload Token Image (Required)"
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
          </CardContent>

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
              Create Token
            </Button>
          </CardFooter>
        </form>
      </Card>
    </section>
  );
});

CreateTokenComponent.displayName = 'CreateToken';

export default CreateTokenComponent;
export { CreateTokenComponent };

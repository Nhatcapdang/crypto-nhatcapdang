'use client';

import { useForm } from '@tanstack/react-form';
import { motion } from 'framer-motion';
import {
  Check,
  Globe,
  Hash,
  MessageCircle,
  Sparkles,
  Twitter,
  X,
} from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { InputWithAdornments } from '../input-with-adornments';
import { ReactDropzone } from '../ui/react-dropzone';
import Switch from '../ui/switch';

/**
 * Token creation form data type
 */
type TokenFormData = {
  name: string;
  symbol: string;
  totalSupply: number;
  decimals: number;
  description?: string;
  revokeFreezeAuthority: boolean;
  revokeMintAuthority: boolean;
  revokeUpdateAuthority: boolean;
  website?: string;
  telegram?: string;
  twitter?: string;
  discord?: string;
  tokenImage?: File | null;
};

const TokenPreview: React.FC<{ formData: Partial<TokenFormData> }> = ({
  formData,
}) => {
  const cost = 0.09; // SOL cost for token creation

  return (
    <Card className="sticky top-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Token Preview
        </CardTitle>
        <CardDescription>Review your token configuration</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Token Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary to-chart-2 flex items-center justify-center">
            {formData.tokenImage ? (
              <Image
                src={URL.createObjectURL(formData.tokenImage)}
                alt="Token icon"
                width={64}
                height={64}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <Sparkles className="w-8 h-8 text-white" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {formData.name || 'Token Name'}
            </h3>
            <p className="text-sm text-muted-foreground font-mono">
              {formData.symbol || 'SYMBOL'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Token Information */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Total Supply</span>
            <span className="font-mono text-sm">
              {formData.totalSupply?.toLocaleString() || '1,000,000,000'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Decimals</span>
            <span className="font-mono text-sm">
              {formData.decimals || '9'}
            </span>
          </div>
          {formData.description && (
            <div>
              <span className="text-sm text-muted-foreground">Description</span>
              <p className="text-sm mt-1">{formData.description}</p>
            </div>
          )}
        </div>

        <Separator />

        {/* Cost Information */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <p className="text-sm font-medium text-destructive">
            REQUIRED: {cost} SOL + FEES + RENT + GAS
          </p>
        </div>

        {/* Authority Status */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Authority Status</h4>
          <div className="space-y-2">
            <div
              className={`flex items-center justify-between p-2 rounded ${formData.revokeFreezeAuthority ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'}`}
            >
              <span className="text-xs">FREEZE AUTHORITY</span>
              {formData.revokeFreezeAuthority ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
            <div
              className={`flex items-center justify-between p-2 rounded ${formData.revokeMintAuthority ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'}`}
            >
              <span className="text-xs">MINT AUTHORITY</span>
              {formData.revokeMintAuthority ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
            <div
              className={`flex items-center justify-between p-2 rounded ${formData.revokeUpdateAuthority ? 'bg-green-500/10 text-green-600' : 'bg-gray-500/10 text-gray-600'}`}
            >
              <span className="text-xs">UPDATE AUTHORITY</span>
              {formData.revokeUpdateAuthority ? (
                <Check className="w-4 h-4" />
              ) : (
                <X className="w-4 h-4" />
              )}
            </div>
          </div>
        </div>

        {/* Social Links Preview */}
        {(formData.website ||
          formData.telegram ||
          formData.twitter ||
          formData.discord) && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Social Links</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                {formData.website && <p>Website: {formData.website}</p>}
                {formData.telegram && <p>Telegram: {formData.telegram}</p>}
                {formData.twitter && <p>Twitter/X: {formData.twitter}</p>}
                {formData.discord && <p>Discord: {formData.discord}</p>}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const createTokenSchema = z.object({
  name: z.string().min(1, 'Name must be at least 1 character'),
  symbol: z.string().min(1, 'Symbol must be at least 1 character'),
  totalSupply: z.number().min(1, 'Total supply must be at least 1'),
  decimals: z.number().min(1, 'Decimals must be between 1 and 9'),
  description: z.string().min(1, 'Description must be at least 1 character'),
  revokeFreezeAuthority: z.boolean(),
  revokeMintAuthority: z.boolean(),
  revokeUpdateAuthority: z.boolean(),
  website: z
    .string()
    .optional()
    .refine(
      url => url === '' || z.string().url().safeParse(url).success,
      'Website must start with https',
    )
    .or(z.literal('')),
  telegram: z
    .string()
    .optional()
    .refine(
      url => url === '' || z.string().url().safeParse(url).success,
      'Telegram must start with t.me/',
    )
    .or(z.literal('')),
  twitter: z
    .string()
    .optional()
    .refine(
      url => url === '' || z.string().url().safeParse(url).success,
      'Twitter/X must start with x.com/',
    )
    .or(z.literal('')),
  discord: z
    .string()
    .optional()
    .refine(
      url => url === '' || z.string().url().safeParse(url).success,
      'Discord must start with discord.gg/',
    )
    .or(z.literal('')),
  tokenImage: z.instanceof(File).optional(),
});

export default function CreateToken() {
  const form = useForm({
    defaultValues: {
      name: '',
      symbol: '',
      totalSupply: 1000000000,
      decimals: 9,
      description: '',
      revokeFreezeAuthority: true,
      revokeMintAuthority: true,
      revokeUpdateAuthority: false,
      website: '',
      telegram: '',
      twitter: '',
      discord: '',
      tokenImage: null as File | null,
    } as TokenFormData,
    validators: {
      onSubmit: createTokenSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold mb-2"
          >
            Create Tokens
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg"
          >
            Launch your own meme token with the Solana blockchain
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <form
              onSubmit={e => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <Card>
                <CardContent className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form.Field name="name">
                    {field => (
                      <InputWithAdornments
                        label="Token Name"
                        required
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        placeholder="Solana, Ethereum, Bitcoin, etc."
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>

                  <form.Field name="symbol">
                    {field => (
                      <InputWithAdornments
                        label="Symbol"
                        required
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        placeholder="SOL, ETH, BTC, etc."
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>

                  <form.Field name="totalSupply">
                    {field => (
                      <InputWithAdornments
                        label="Total Supply"
                        required
                        value={field.state.value}
                        onChange={e =>
                          field.handleChange(Number(e.target.value))
                        }
                        placeholder="1000000000"
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>

                  <form.Field name="decimals">
                    {field => (
                      <Field>
                        <FieldLabel>Decimals</FieldLabel>
                        <Select
                          value={field.state.value.toString()}
                          onValueChange={value =>
                            field.handleChange(Number(value))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select decimals" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 9 }, (_, i) => i + 1).map(
                              num => (
                                <SelectItem key={num} value={num.toString()}>
                                  {num} decimals
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <FieldError>
                          {field.state.meta.errors[0]?.message}
                        </FieldError>
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="description">
                    {field => (
                      <Textarea
                        fieldClassName="col-span-2"
                        label="Description"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        placeholder="Describe your token project..."
                        rows={3}
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>
                  <div className="flex gap-4 col-span-2">
                    <form.Field name="revokeFreezeAuthority">
                      {field => (
                        <Switch
                          label="Revoke Freeze Authority"
                          description="Prevents freezing of token accounts"
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      )}
                    </form.Field>
                    <form.Field name="revokeMintAuthority">
                      {field => (
                        <Switch
                          label="Revoke Mint Authority"
                          description="Makes token supply fixed and immutable"
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      )}
                    </form.Field>

                    <form.Field name="revokeUpdateAuthority">
                      {field => (
                        <Switch
                          label="Revoke Update Authority"
                          description="Makes token metadata immutable"
                          checked={field.state.value}
                          onCheckedChange={field.handleChange}
                        />
                      )}
                    </form.Field>
                  </div>
                  <form.Field name="website">
                    {field => (
                      <InputWithAdornments
                        label="Website"
                        leftAdornment={<Globe className="w-4 h-4" />}
                        placeholder="https://..."
                        value={field.state.value || ''}
                        onChange={e => field.handleChange(e.target.value)}
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>

                  <form.Field name="telegram">
                    {field => (
                      <InputWithAdornments
                        label="Telegram"
                        leftAdornment={<MessageCircle className="w-4 h-4" />}
                        placeholder="t.me/..."
                        value={field.state.value || ''}
                        onChange={e => field.handleChange(e.target.value)}
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>

                  <form.Field name="twitter">
                    {field => (
                      <InputWithAdornments
                        label="Twitter / X"
                        leftAdornment={<Twitter className="w-4 h-4" />}
                        placeholder="x.com/..."
                        value={field.state.value || ''}
                        onChange={e => field.handleChange(e.target.value)}
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>

                  <form.Field name="discord">
                    {field => (
                      <InputWithAdornments
                        label="Discord"
                        leftAdornment={<Hash className="w-4 h-4" />}
                        placeholder="discord.gg/..."
                        value={field.state.value || ''}
                        onChange={e => field.handleChange(e.target.value)}
                        error={field.state.meta.errors[0]?.message}
                        disableAnimations
                      />
                    )}
                  </form.Field>

                  <form.Field name="tokenImage">
                    {field => (
                      <ReactDropzone
                        className="col-span-2"
                        onDrop={files => field.handleChange(files[0] || null)}
                        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
                        maxSize={10 * 1024 * 1024}
                        showPreviews
                        maxFiles={1}
                        error={field.state.meta.errors[0]?.message}
                      />
                    )}
                  </form.Field>
                </CardContent>
              </Card>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-gradient-to-r from-primary to-chart-2 hover:from-primary/90 hover:to-chart-2/90 text-white"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Creating Token...
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TokenPreview formData={form.state.values} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

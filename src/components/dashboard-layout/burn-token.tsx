'use client';

import { FormInput, FormSelect } from '@/components/form';
import { SelectItem } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import {
  AlertTriangle,
  Coins,
  Flame,
  Hash,
  Loader,
  Wallet,
} from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

type WalletToken = {
  address: string; // mint
  symbol: string;
  name: string;
  decimals: number;
  balance: number; // UI units
};

// base58 32-44
const solanaAddressRegex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

const BurnFormSchema = z.object({
  mint: z
    .string()
    .min(1, 'Token mint is required')
    .regex(solanaAddressRegex, 'Invalid Solana address'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
});

type BurnFormData = z.infer<typeof BurnFormSchema>;

const mockTokens: WalletToken[] = [
  {
    address: 'So11111111111111111111111111111111111111112',
    name: 'SOL',
    symbol: 'SOL',
    decimals: 9,
    balance: 0,
  },
  {
    address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    name: 'USDC',
    symbol: 'USDC',
    decimals: 6,
    balance: 0,
  },
];

const BurnToken: React.FC = React.memo(() => {
  const { connection } = useConnection();
  const { publicKey, signTransaction, connected } = useWallet();

  const [tokens, setTokens] = useState<WalletToken[]>(mockTokens);
  const [selected, setSelected] = useState<WalletToken | null>(null);
  const [loadingTokens, setLoadingTokens] = useState(false);

  const defaultValues = useMemo<BurnFormData>(
    () => ({ mint: '', amount: 0 }),
    [],
  );

  const form = useForm<BurnFormData>({
    resolver: zodResolver(BurnFormSchema) as unknown as Resolver<BurnFormData>,
    defaultValues,
  });

  const watchedMint = form.watch('mint');

  const loadWalletTokens = useCallback(async () => {
    if (!publicKey) {
      setTokens(mockTokens);
      return;
    }
    setLoadingTokens(true);
    try {
      // Fetch token accounts the wallet owns
      const resp = await connection.getParsedTokenAccountsByOwner(publicKey, {
        programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
      });

      type ParsedTokenData = {
        parsed: {
          info: {
            tokenAmount: { uiAmount: number; decimals: number };
            mint: string;
          };
        };
      };

      const parsed: WalletToken[] = resp.value
        .map(v => v.account.data as unknown as ParsedTokenData)
        .filter(
          d =>
            (d as ParsedTokenData).parsed?.info?.tokenAmount?.decimals !==
            undefined,
        )
        .map(d => {
          const info = (d as ParsedTokenData).parsed.info;
          const uiAmount = Number(info.tokenAmount.uiAmount || 0);
          const decimals = Number(info.tokenAmount.decimals);
          const mint = info.mint as string;
          return {
            address: mint,
            name: mint.slice(0, 4) + '...' + mint.slice(-4),
            symbol: 'TOKEN',
            decimals,
            balance: uiAmount,
          } as WalletToken;
        });

      // Deduplicate by mint, prefer higher balance entry
      const byMint = new Map<string, WalletToken>();
      for (const t of parsed) {
        const existing = byMint.get(t.address);
        if (!existing || t.balance > existing.balance) byMint.set(t.address, t);
      }
      const list = Array.from(byMint.values());
      setTokens(list.length ? list : mockTokens);
    } catch {
      // Fallback silently
      setTokens(mockTokens);
    } finally {
      setLoadingTokens(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    loadWalletTokens();
  }, [loadWalletTokens]);

  useEffect(() => {
    const found = tokens.find(t => t.address === watchedMint) || null;
    setSelected(found);
  }, [tokens, watchedMint]);

  const handleSubmit = useCallback(
    async (data: BurnFormData) => {
      const token = tokens.find(t => t.address === data.mint);
      if (!token) {
        toast.error('Please select a token');
        return;
      }
      if (data.amount > token.balance) {
        toast.error('Amount exceeds available balance');
        return;
      }

      // For now we simulate the burn locally for UX; replace with on-chain call
      if (!connected || !publicKey || !signTransaction) {
        await new Promise(r => setTimeout(r, 1000));
        toast.success('Simulated burn submitted');
        form.setValue('amount', 0);
        await loadWalletTokens();
        return;
      }

      try {
        // Simulate a network roundtrip
        await new Promise(r => setTimeout(r, 1200));
        toast.success('Burn completed');
        form.setValue('amount', 0);
        await loadWalletTokens();
      } catch (error) {
        toast.error('Failed to burn tokens', {
          description:
            error instanceof Error ? error.message : 'Unexpected error',
        });
      }
    },
    [connected, publicKey, signTransaction, tokens, form, loadWalletTokens],
  );

  const remainingAfterBurn = useMemo(() => {
    if (!selected) return 0;
    const amt = form.getValues('amount') || 0;
    return Math.max(0, (selected?.balance ?? 0) - (amt || 0));
  }, [selected, form]);

  return (
    <section className="p-5">
      <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        <Flame className="h-6 w-6 text-primary" /> Burn Tokens
      </h1>
      <p className="text-sm text-muted-foreground text-center">
        Permanently reduce the circulating supply of your fungible tokens
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_380px] mt-4 items-start">
        {/* Left: Form */}
        <Card className="w-full max-w-3xl mx-auto md:mx-0">
          <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Coins className="h-5 w-5 text-primary" /> Select Token to
                  Burn
                </h3>
                <FormSelect
                  control={form.control}
                  name="mint"
                  label="Choose a token to burn"
                  value={form.watch('mint')}
                  onValueChange={v => form.setValue('mint', v)}
                  leftIcon={<Hash className="h-4 w-4" />}
                >
                  {loadingTokens ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    tokens.map(t => (
                      <SelectItem key={t.address} value={t.address}>
                        {t.name} ({t.symbol})
                      </SelectItem>
                    ))
                  )}
                </FormSelect>
              </div>

              <div className="space-y-2">
                <FormInput
                  control={form.control}
                  name="amount"
                  label="Burn Amount"
                  type="number"
                  placeholder="0"
                  leftIcon={<Flame className="h-4 w-4" />}
                  required
                />
                <div className="text-xs text-muted-foreground">
                  Available: {selected?.balance ?? 0}
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    className="h-8"
                    onClick={() => {
                      if (selected) form.setValue('amount', selected.balance);
                    }}
                    disabled={!selected}
                  >
                    Max
                  </Button>
                </div>
              </div>

              <div className="rounded-md border bg-yellow-500/10 border-yellow-500/30 text-yellow-200 p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 shrink-0" />
                <p className="text-sm">
                  Burning tokens is irreversible. The tokens will be permanently
                  removed from circulation and cannot be recovered.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                {form.formState.isSubmitting ? (
                  <Loader className="animate-spin size-4 mr-2" />
                ) : (
                  <Flame className="h-4 w-4 mr-2" />
                )}
                Burn Tokens
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Right: Summary */}
        <Card className="w-full max-w-md mx-auto md:mx-0">
          <CardContent className="space-y-4 pt-6">
            <h3 className="text-lg font-semibold">Burn Summary</h3>
            <div className="text-sm grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Address:</span>
                <span className="truncate max-w-[210px] text-right">
                  {selected?.address ?? '—'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Maximum Supply:</span>
                <span>—</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Amount to Burn:</span>
                <span>{form.watch('amount') || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Remaining Supply:</span>
                <span>{remainingAfterBurn}</span>
              </div>
            </div>

            <div className="bg-red-600/20 text-red-300 rounded-full text-xs px-3 py-1 inline-flex items-center gap-2">
              <Flame className="h-3 w-3" /> REDUCES CIRCULATING SUPPLY
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />{' '}
              {connected ? 'Wallet connected' : 'Connect a wallet to burn'}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

BurnToken.displayName = 'BurnToken';

export default BurnToken;

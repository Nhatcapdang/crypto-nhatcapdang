'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CurrencyAmount,
  Liquidity,
  TOKEN_PROGRAM_ID,
  Token,
  TxVersion,
  WSOL,
} from '@raydium-io/raydium-sdk';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, VersionedTransaction } from '@solana/web3.js';
import BN from 'bn.js';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

interface CreatePoolFormData {
  tokenMint: string;
  marketId: string;
  solAmount: number;
  tokenAmount: number;
}

export default function CreatePoolComponent() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePoolFormData>({
    tokenMint: 'GvcTGqfWtihrGStaadNjmGWWPMqLiKgdwN2UhgXugVVt',
    marketId: '',
    solAmount: 10,
    tokenAmount: 100000000,
  });

  const handleInputChange = useCallback(
    (field: keyof CreatePoolFormData, value: string | number) => {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    },
    [],
  );

  const createLiquidityPool = useCallback(async () => {
    if (!publicKey || !signTransaction) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.tokenMint) {
      toast.error('Please enter your token mint address');
      return;
    }

    if (!formData.marketId) {
      toast.error('Please enter the market ID');
      return;
    }

    setIsLoading(true);

    try {
      // Validate token mint address and market ID
      const tokenMintPubkey = new PublicKey(formData.tokenMint);
      const marketIdPubkey = new PublicKey(formData.marketId);

      // Create token instances
      const baseToken = new Token(
        TOKEN_PROGRAM_ID,
        tokenMintPubkey,
        9, // Assuming 6 decimals, adjust based on your token
        'LOADING',
        'Loding',
      );

      const quoteToken = WSOL; // Using wrapped SOL as quote token

      // Convert amounts to proper format using BN to handle large numbers
      const baseAmountBN = new BN(formData.tokenAmount).mul(
        new BN(10).pow(new BN(baseToken.decimals)),
      );
      const quoteAmountBN = new BN(formData.solAmount).mul(
        new BN(10).pow(new BN(quoteToken.decimals)),
      );

      const baseAmount = new CurrencyAmount(baseToken, baseAmountBN);
      const quoteAmount = new CurrencyAmount(quoteToken, quoteAmountBN);
      const wsolMint = new PublicKey(WSOL.mint);
      // Create the liquidity pool
      const { innerTransactions } =
        await Liquidity.makeCreatePoolV4InstructionV2Simple({
          connection,
          programId: new PublicKey(
            '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8',
          ), // Raydium AMM program ID
          marketInfo: {
            marketId: marketIdPubkey,
            programId: new PublicKey(
              'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX',
            ), // OpenBook program ID
          },
          baseMintInfo: {
            mint: tokenMintPubkey,
            decimals: baseToken.decimals,
          },
          quoteMintInfo: {
            mint: wsolMint,
            decimals: WSOL.decimals,
          },
          baseAmount: baseAmount.raw,
          quoteAmount: quoteAmount.raw,
          startTime: new BN(Math.floor(new Date().getTime() / 1000)), // Start immediately
          ownerInfo: {
            feePayer: publicKey,
            wallet: publicKey,
            tokenAccounts: [], // Will be populated automatically
            useSOLBalance: true, // Use SOL balance instead of wrapped SOL
          },
          associatedOnly: false,
          checkCreateATAOwner: true,
          makeTxVersion: TxVersion.V0, // Use versioned transactions
          feeDestinationId: new PublicKey(
            '7YttLkHDoNj9wyDur5pM1ejNaAvT9X4eqaYcHQqtj2G5',
          ), // Raydium fee destination
        });

      // Sign and send transactions
      const transactions: VersionedTransaction[] = [];

      for (const innerTransaction of innerTransactions) {
        if (innerTransaction instanceof VersionedTransaction) {
          transactions.push(innerTransaction);
        }
      }

      // Sign all transactions
      const signedTransactions = await signTransaction(transactions[0]); // For simplicity, handling first transaction

      // Send transaction
      const signature = await sendTransaction(signedTransactions, connection, {
        skipPreflight: false,
        preflightCommitment: 'confirmed',
      });

      // Wait for confirmation
      await connection.confirmTransaction(signature, 'confirmed');

      toast.success(`Pool created successfully! Transaction: ${signature}`);
    } catch (error) {
      console.error('Error creating pool:', error);
      toast.error(
        `Failed to create pool: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, signTransaction, sendTransaction, connection, formData]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Raydium Liquidity Pool</CardTitle>
          <CardDescription>
            Create a new liquidity pool with your token and SOL
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tokenMint">Token Mint Address</Label>
            <Input
              id="tokenMint"
              placeholder="Enter your token mint address"
              value={formData.tokenMint}
              onChange={e => handleInputChange('tokenMint', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="marketId">OpenBook Market ID</Label>
            <Input
              id="marketId"
              placeholder="Enter the OpenBook market ID for your token/SOL pair"
              value={formData.marketId}
              onChange={e => handleInputChange('marketId', e.target.value)}
            />
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>
                💡 <strong>Don&apos;t have a Market ID?</strong> Check the
                methods below to find or create one.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="solAmount">SOL Amount</Label>
              <Input
                id="solAmount"
                type="number"
                value={formData.solAmount}
                onChange={e =>
                  handleInputChange('solAmount', parseFloat(e.target.value))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tokenAmount">Token Amount</Label>
              <Input
                id="tokenAmount"
                type="number"
                value={formData.tokenAmount}
                onChange={e =>
                  handleInputChange('tokenAmount', parseFloat(e.target.value))
                }
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
              📋 How to Get OpenBook Market ID:
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-3">
              <div>
                <strong>Method 1: Check Existing Markets</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>
                    • Search on{' '}
                    <a
                      href="https://birdeye.so"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Birdeye.so
                    </a>
                  </li>
                  <li>
                    • Check{' '}
                    <a
                      href="https://dexscreener.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      DexScreener
                    </a>
                  </li>
                  <li>
                    • Look on{' '}
                    <a
                      href="https://solscan.io"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Solscan.io
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <strong>
                  Method 2: Create New Market (Cost: ~0.2-2.8 SOL)
                </strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>
                    •{' '}
                    <a
                      href="https://openbookmarketid.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      OpenBookMarketID.com
                    </a>{' '}
                    (Recommended)
                  </li>
                  <li>
                    •{' '}
                    <a
                      href="https://solana.pandatool.org/en/market"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      PandaTool
                    </a>{' '}
                    (~0.55 SOL)
                  </li>
                  <li>
                    •{' '}
                    <a
                      href="https://www.solz.app/market/create-openbook"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      Solz.app
                    </a>
                  </li>
                  <li>
                    •{' '}
                    <a
                      href="https://solhub.io/token-manager/openbook-market"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      SolHub.io
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Important Notes:
            </h4>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
              <li>
                • Ensure you have sufficient SOL for transaction fees (~0.01
                SOL)
              </li>
              <li>
                • Your wallet must contain the specified amounts of both assets
              </li>
              <li>
                • Pool creation is irreversible - double-check all parameters
              </li>
              <li>• Market creation costs vary by platform (0.2-2.8 SOL)</li>
              <li>• Always verify market ID before proceeding</li>
            </ul>
          </div>

          <Button
            onClick={createLiquidityPool}
            disabled={!publicKey || isLoading}
            className="w-full"
          >
            {isLoading ? 'Creating Pool...' : 'Create Liquidity Pool'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

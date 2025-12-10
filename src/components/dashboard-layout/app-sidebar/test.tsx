// Update your test component
'use client';

import { Button } from '@/components/ui';
import { useCreateSplashLiquidityPool } from '@/hooks/orca/use-create-splash-pool';
import { useOpenPosition } from '@/hooks/orca/use-open-position';
import { useOrca } from '@/hooks/orca/use-orca';
import { getSplashPoolAddress } from '@/utils';
import { PriceMath } from '@orca-so/whirlpools-sdk';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';

interface PoolMetrics {
  currentPrice: number;
  currentPriceUSD: number;
  liquidity: string;
  tvlUSD: number;
  tokenAReserve: number;
  tokenBReserve: number;
  marketCapUSD: number;
  fdvUSD: number;
}

export default function TestComponent() {
  const { whirlpoolClient, isDevnet } = useOrca();
  const [poolStatus, setPoolStatus] = useState('Checking...');
  const [metrics, setMetrics] = useState<PoolMetrics | null>(null);

  const { mutate: createSplashLiquidityPool, isPending } =
    useCreateSplashLiquidityPool();
  const { mutate: openPosition, isPending: isOpeningPosition } =
    useOpenPosition();

  const poolAddress = getSplashPoolAddress(
    new PublicKey('So11111111111111111111111111111111111111112'), // SOL
    new PublicKey('GZboHKS2c1WG73kr5P7XHeWPuPPDWMUtvErCEoCwUNRZ'), // Your token
    isDevnet,
  );

  const calculatePoolMetrics = async () => {
    if (!whirlpoolClient) return;

    try {
      const pool = await whirlpoolClient.getPool(poolAddress);
      const poolData = pool.getData();
      const tokenAInfo = pool.getTokenAInfo();
      const tokenBInfo = pool.getTokenBInfo();

      // Current price calculation
      const sqrtPriceX64 = poolData.sqrtPrice;
      const currentPrice = PriceMath.sqrtPriceX64ToPrice(
        sqrtPriceX64,
        tokenAInfo.decimals,
        tokenBInfo.decimals,
      );

      // Token reserves
      const tokenAVault = pool.getTokenVaultAInfo();
      const tokenBVault = pool.getTokenVaultBInfo();
      console.table({
        poolData,
        tokenAInfo,
        tokenBInfo,
        tokenAVault,
        tokenBVault,
      });
      const calculatedMetrics: PoolMetrics = {
        currentPrice: currentPrice.toNumber(),
        currentPriceUSD: currentPrice.toNumber() * 200,
        liquidity: poolData.liquidity.toString(),
        tvlUSD: Number(tokenBVault.amount) * 200,
        tokenAReserve: Number(tokenAVault.amount),
        tokenBReserve: Number(tokenBVault.amount),
        marketCapUSD: Number(tokenBVault.amount) * 200,
        fdvUSD: Number(tokenBVault.amount) * 200,
      };

      setMetrics(calculatedMetrics);
      console.log('Pool Metrics:', calculatedMetrics);
    } catch (error) {
      console.error('Error calculating metrics:', error);
    }
  };

  useEffect(() => {
    const checkPoolExists = async () => {
      if (!whirlpoolClient) {
        setPoolStatus('Wallet not connected');
        return;
      }

      try {
        const accountInfo = await whirlpoolClient
          .getContext()
          .connection.getAccountInfo(poolAddress);

        if (!accountInfo) {
          setPoolStatus('❌ Pool does not exist - Create it first!');
          return;
        }

        const pool = await whirlpoolClient.getPool(poolAddress);
        const poolData = pool.getData();

        const hasLiquidity = poolData.liquidity.toString() !== '0';

        setPoolStatus(
          hasLiquidity
            ? '✅ Pool exists with liquidity - Trading possible!'
            : '⚠️ Pool exists but no liquidity - Add liquidity first!',
        );

        // Calculate metrics if pool has liquidity
        if (hasLiquidity) {
          await calculatePoolMetrics();
        }
      } catch (error) {
        console.error('Error checking pool:', error);
        setPoolStatus(
          `❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    };

    checkPoolExists();
  }, [whirlpoolClient, poolAddress, , calculatePoolMetrics]);

  const handleCreatePool = () => {
    createSplashLiquidityPool({
      tokenMintA: 'So11111111111111111111111111111111111111112',
      tokenMintB: 'GZboHKS2c1WG73kr5P7XHeWPuPPDWMUtvErCEoCwUNRZ',
      initialPrice: 2 / 500_000_000,
    });
  };

  const handleOpenPosition = () => {
    openPosition({
      tokenMintA: 'So11111111111111111111111111111111111111112',
      tokenMintB: 'GZboHKS2c1WG73kr5P7XHeWPuPPDWMUtvErCEoCwUNRZ',
    });
  };

  return (
    <div className="p-4 space-y-4">
      <div className=" p-3 rounded">
        <p>
          <strong>Network:</strong> {isDevnet ? 'Devnet' : 'Mainnet'}
        </p>
        <p>
          <strong>Pool Status:</strong> {poolStatus}
        </p>
        <p className="text-xs font-mono">
          <strong>Pool Address:</strong> {poolAddress?.toString()}
        </p>
      </div>

      {/* Pool Metrics Display */}
      {metrics && (
        <div className=" p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-3">📊 Pool Analytics</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">💰 Price Data</h4>
              <p>Current Price: {metrics.currentPrice.toFixed(10)} SOL</p>
              <p>Price USD: ${metrics.currentPriceUSD.toFixed(8)}</p>
            </div>

            <div>
              <h4 className="font-semibold">🏊 Liquidity Data</h4>
              <p>TVL: ${metrics.tvlUSD.toFixed(2)}</p>
              <p>SOL Reserve: {metrics.tokenAReserve.toFixed(4)}</p>
              <p>Token Reserve: {metrics.tokenBReserve.toLocaleString()}</p>
            </div>

            <div>
              <h4 className="font-semibold">📈 Market Data</h4>
              <p>Market Cap: ${metrics.marketCapUSD.toLocaleString()}</p>
              <p>FDV: ${metrics.fdvUSD.toLocaleString()}</p>
            </div>

            <div>
              <h4 className="font-semibold">🔄 Pool Info</h4>
              <p>Liquidity: {metrics.liquidity}</p>
              <button
                onClick={calculatePoolMetrics}
                className="text-blue-600 underline text-sm"
              >
                🔄 Refresh Metrics
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-x-2">
        <Button onClick={handleCreatePool} disabled={isPending}>
          {isPending ? 'Creating Pool...' : 'Create Splash Pool'}
        </Button>

        <Button onClick={handleOpenPosition} disabled={isOpeningPosition}>
          {isOpeningPosition ? 'Opening Position...' : 'Add Liquidity'}
        </Button>

        <Button onClick={calculatePoolMetrics} variant="outline">
          📊 Calculate Metrics
        </Button>
      </div>
    </div>
  );
}

'use client';

import { Button } from '@/components/ui';
import { useClosePosition } from '@/hooks/orca/use-close-position';
import { useCreateSplashLiquidityPool } from '@/hooks/orca/use-create-splash-pool';
import { useOpenPosition } from '@/hooks/orca/use-open-position';
import { useCallback } from 'react';

export default function TestComponent() {
  const { mutate: createSplashLiquidityPool, isPending } =
    useCreateSplashLiquidityPool();
  const { mutate: openPosition, isPending: isOpeningPosition } =
    useOpenPosition();
  const { mutate: closePosition, isPending: isClosingPosition } =
    useClosePosition();

  const handleCreatePool = useCallback(() => {
    console.log('Creating pool...');
    createSplashLiquidityPool({
      tokenMintA: 'PVmF8R41sh2YCLrt2eKGiyte4RSgbu7dXvf7H7C5vot',
      tokenMintB: 'So11111111111111111111111111111111111111112',
      initialPrice: 2 / 500_000_000,
    });
  }, [createSplashLiquidityPool]);

  const handleOpenPosition = useCallback(() => {
    openPosition({
      tokenMintA: 'PVmF8R41sh2YCLrt2eKGiyte4RSgbu7dXvf7H7C5vot',
      tokenMintB: 'So11111111111111111111111111111111111111112',
      amountOfTokenA: 400_000_000,
    });
  }, [openPosition]);

  const handleClosePosition = useCallback(() => {
    closePosition({
      tokenMintA: 'So11111111111111111111111111111111111111112',
      tokenMintB: 'PVmF8R41sh2YCLrt2eKGiyte4RSgbu7dXvf7H7C5vot',
    });
  }, [closePosition]);

  return (
    <div className="p-4 space-y-4">
      <div className="space-x-2">
        <Button onClick={handleCreatePool} disabled={isPending}>
          {isPending ? 'Creating Pool...' : 'Create Splash Pool'}
        </Button>

        <Button onClick={handleOpenPosition} disabled={isOpeningPosition}>
          {isOpeningPosition ? 'Opening Position...' : 'Add Liquidity'}
        </Button>

        <Button onClick={handleClosePosition} disabled={isClosingPosition}>
          {isClosingPosition ? 'Closing Position...' : 'Close Position'}
        </Button>

        {/* <Button onClick={calculatePoolMetrics} variant="outline">
          📊 Calculate Metrics
        </Button> */}
      </div>
    </div>
  );
}

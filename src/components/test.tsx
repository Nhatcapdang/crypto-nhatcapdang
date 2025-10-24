'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

export default function Test() {
  return (
    <div>
      <WalletMultiButton
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
        }}
      />
    </div>
  );
}

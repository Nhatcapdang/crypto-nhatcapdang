'use client';

import { withMounted } from '@/hooks/withMounted';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

function WalletMultiBtn() {
  return (
    <div className="">
      <WalletMultiButton
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-primary-foreground)',
          height: '32px',
          width: '100%',
          borderRadius: '8px',
          padding: '0 16px',
          fontSize: 'var(--text-xs)',
        }}
      />
    </div>
  );
}
export default withMounted(WalletMultiBtn);

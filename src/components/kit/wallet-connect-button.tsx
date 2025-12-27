'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { WalletIcon } from 'lucide-react';
import type { ReactNode } from 'react';

type WalletActionButtonProps = {
  isPending?: boolean;
  leftIcon: ReactNode;
} & React.ComponentProps<typeof Button>;

export function WalletConnectButton({
  isPending = false,
  leftIcon,
  children,
  ...props
}: WalletActionButtonProps) {
  const { setVisible } = useWalletModal();
  const { connected } = useWallet();
  if (connected) {
    return (
      <Button {...props} disabled={isPending || props.disabled}>
        {isPending ? <Spinner /> : leftIcon}
        {children}
      </Button>
    );
  }

  return (
    <Button {...props} onClick={() => setVisible(true)} type="button">
      <WalletIcon className="h-4 w-4 mr-2" />
      Connect Wallet
    </Button>
  );
}

import type { UiWallet } from '@wallet-standard/react';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui';
import { Spinner } from '../ui/spinner';

type Props = Readonly<{
  children?: React.ReactNode;
  loading?: boolean;
  wallet: UiWallet;
}>;

export function WalletMenuItemContent({ children, loading, wallet }: Props) {
  return (
    <div className="flex items-center gap-2">
      <Spinner>
        <Avatar>
          <AvatarImage src={wallet.icon} alt={wallet.name} />
          <AvatarFallback>{wallet.name.slice(0, 1)}</AvatarFallback>
        </Avatar>
      </Spinner>
      <span className="truncate">{children ?? wallet.name}</span>
    </div>
  );
}

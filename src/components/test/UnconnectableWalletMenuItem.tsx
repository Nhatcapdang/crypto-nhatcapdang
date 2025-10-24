import type { UiWallet } from '@wallet-standard/react';
import { useState } from 'react';

import { ErrorDialog } from './ErrorDialog';
import { WalletMenuItemContent } from './WalletMenuItemContent';
import { DropdownMenuItem } from '../ui';

type Props = Readonly<{
  error: unknown;
  wallet: UiWallet;
}>;

export function UnconnectableWalletMenuItem({ error, wallet }: Props) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <>
      <DropdownMenuItem disabled onClick={() => setDialogIsOpen(true)}>
        <WalletMenuItemContent wallet={wallet}>
          <span style={{ textDecoration: 'line-through' }}>{wallet.name}</span>
        </WalletMenuItemContent>
      </DropdownMenuItem>
      {dialogIsOpen ? (
        <ErrorDialog
          error={error}
          onClose={() => setDialogIsOpen(false)}
          title="Unconnectable wallet"
        />
      ) : null}
    </>
  );
}

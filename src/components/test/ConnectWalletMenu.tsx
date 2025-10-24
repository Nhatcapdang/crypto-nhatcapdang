'use client';
import { StandardConnect, StandardDisconnect } from '@wallet-standard/core';
import type { UiWallet } from '@wallet-standard/react';
import {
  uiWalletAccountBelongsToUiWallet,
  useWallets,
} from '@wallet-standard/react';
import { useContext, useRef, useState } from 'react';

import { SelectedWalletAccountContext } from '@/contexts/SelectedWalletAccountContext';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui';
import { ConnectWalletMenuItem } from './ConnectWalletMenuItem';
import { ErrorDialog } from './ErrorDialog';
import { WalletAccountIcon } from './WalletAccountIcon';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function ConnectWalletMenu({ children }: Props) {
  const { current: NO_ERROR } = useRef(Symbol());
  const wallets = useWallets();
  const [selectedWalletAccount, setSelectedWalletAccount] = useContext(
    SelectedWalletAccountContext,
  );
  const [error, setError] = useState(NO_ERROR);
  const [forceClose, setForceClose] = useState(false);
  function renderItem(wallet: UiWallet) {
    return (
      <ConnectWalletMenuItem
        key={Math.random()}
        onAccountSelect={account => {
          setSelectedWalletAccount(account);
          setForceClose(true);
        }}
        onDisconnect={wallet => {
          if (
            selectedWalletAccount &&
            uiWalletAccountBelongsToUiWallet(selectedWalletAccount, wallet)
          ) {
            setSelectedWalletAccount(undefined);
          }
        }}
        onError={setError}
        wallet={wallet}
      />
    );
  }
  const walletsThatSupportStandardConnect = [];
  const unconnectableWallets = [];
  for (const wallet of wallets) {
    if (
      wallet.features.includes(StandardConnect) &&
      wallet.features.includes(StandardDisconnect)
    ) {
      walletsThatSupportStandardConnect.push(wallet);
    } else {
      unconnectableWallets.push(wallet);
    }
  }
  return (
    <>
      <DropdownMenu
        open={forceClose ? false : undefined}
        onOpenChange={setForceClose.bind(null, false)}
      >
        <DropdownMenuTrigger>
          {selectedWalletAccount ? (
            <>
              <WalletAccountIcon
                account={selectedWalletAccount}
                width="18"
                height="18"
              />
              {selectedWalletAccount.address.slice(0, 8)}
            </>
          ) : (
            children
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {wallets.length === 0 ? (
            <h1>No wallets installed</h1>
          ) : (
            <>
              {walletsThatSupportStandardConnect.map(renderItem)}
              {unconnectableWallets.length ? (
                <>
                  <DropdownMenuSeparator />
                  {unconnectableWallets.map(renderItem)}
                </>
              ) : null}
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error !== NO_ERROR ? (
        <ErrorDialog error={error} onClose={() => setError(NO_ERROR)} />
      ) : null}
    </>
  );
}

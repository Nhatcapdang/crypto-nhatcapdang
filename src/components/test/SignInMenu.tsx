'use client';
import { SolanaSignIn } from '@solana/wallet-standard-features';
import type { UiWallet } from '@wallet-standard/react';
import { useWallets } from '@wallet-standard/react';
import { useContext, useRef, useState } from 'react';

import { SelectedWalletAccountContext } from '@/contexts/SelectedWalletAccountContext';
import { ErrorDialog } from './ErrorDialog';
import { SignInMenuItem } from './SignInMenuItem';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui';

type Props = Readonly<{
  children: React.ReactNode;
}>;

export function SignInMenu({ children }: Props) {
  const { current: NO_ERROR } = useRef(Symbol());
  const wallets = useWallets();
  const [_, setSelectedWalletAccount] = useContext(
    SelectedWalletAccountContext,
  );
  const [error, setError] = useState(NO_ERROR);
  const [forceClose, setForceClose] = useState(false);
  function renderItem(wallet: UiWallet) {
    return (
      <SignInMenuItem
        onSignIn={account => {
          setSelectedWalletAccount(account);
          setForceClose(true);
        }}
        onError={setError}
        wallet={wallet}
      />
    );
  }
  const walletsThatSupportSignInWithSolana = [];
  for (const wallet of wallets) {
    if (wallet.features.includes(SolanaSignIn)) {
      walletsThatSupportSignInWithSolana.push(wallet);
    }
  }
  return (
    <>
      <DropdownMenu
        open={forceClose ? false : undefined}
        onOpenChange={setForceClose.bind(null, false)}
      >
        <DropdownMenuTrigger>{children}</DropdownMenuTrigger>
        <DropdownMenuContent>
          {walletsThatSupportSignInWithSolana.length === 0 ? (
            <h1>adsa</h1>
          ) : (
            walletsThatSupportSignInWithSolana.map(renderItem)
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {error !== NO_ERROR ? (
        <ErrorDialog error={error} onClose={() => setError(NO_ERROR)} />
      ) : null}
    </>
  );
}

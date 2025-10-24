'use client';
import { useContext } from 'react';

import { ChainContext } from '@/contexts/ChainContext';
import { ConnectWalletMenu } from './ConnectWalletMenu';
import { SignInMenu } from './SignInMenu';
import {
  Badge,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui';

export function Nav() {
  const {
    displayName: currentChainName,
    chain,
    setChain,
  } = useContext(ChainContext);
  const currentChainBadge = (
    <Badge color="gray" style={{ verticalAlign: 'middle' }}>
      {currentChainName}
    </Badge>
  );
  return (
    <div className="bg-gray-1 border-b border-gray-a6 z-10 sticky top-0 p-3">
      <div className="flex gap-4 justify-between items-center">
        {/* <div className="flex-grow-1">
          <h1 className="text-4xs sm:text-6xs truncate">
            Solana React App{' '}
            {setChain ? (
              <DropdownMenu>
                <DropdownMenuTrigger>{currentChainBadge}</DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    onValueChange={value => {
                      setChain(value as 'solana:${string}');
                    }}
                    value={chain}
                  >
                    {process.env.REACT_EXAMPLE_APP_ENABLE_MAINNET === 'true' ? (
                      <DropdownMenuRadioItem value="solana:mainnet">
                        Mainnet Beta
                      </DropdownMenuRadioItem>
                    ) : null}
                    <DropdownMenuRadioItem value="solana:devnet">
                      Devnet
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="solana:testnet">
                      Testnet
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              currentChainBadge
            )}
          </h1>
        </div> */}
        <ConnectWalletMenu>Connect Wallet</ConnectWalletMenu>
        <SignInMenu>Sign In</SignInMenu>
      </div>
    </div>
  );
}

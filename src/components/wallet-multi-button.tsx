'use client';

import React, { memo, useCallback, useContext, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  useWallets,
  type UiWallet,
  type UiWalletAccount,
} from '@wallet-standard/react';
import {
  Copy,
  ChevronDown,
  Wallet,
  LogOut,
  Check,
  Loader2,
  AlertCircle,
  Globe,
} from 'lucide-react';
import { toast } from 'sonner';
import { useClipboard } from '@mantine/hooks';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { SelectedWalletAccountContext } from '@/contexts/SelectedWalletAccountContext';
import { ChainContext } from '@/contexts/ChainContext';

/**
 * Labels used throughout the wallet multi-button component
 */
const LABELS = {
  'change-wallet': 'Change wallet',
  connecting: 'Connecting ...',
  'copy-address': 'Copy address',
  copied: 'Copied',
  disconnect: 'Disconnect',
  'has-wallet': 'Connect',
  'no-wallet': 'Select Wallet',
} as const;

/**
 * Wallet icon mapping for popular Solana wallets
 */
const WALLET_ICONS: Record<string, string> = {
  Phantom: 'https://phantom.app/img/phantom-logo.png',
  Solflare: 'https://solflare.com/img/logo.svg',
  Backpack: 'https://backpack.app/icon-192.png',
  Glow: 'https://glow.app/favicon.ico',
  Slope: 'https://slope.finance/favicon.ico',
  Sollet: 'https://www.sollet.io/favicon.ico',
  Coin98: 'https://coin98.com/favicon.ico',
  Clover: 'https://clover.finance/favicon.ico',
  Exodus: 'https://exodus.com/favicon.ico',
  Ledger: 'https://ledger.com/favicon.ico',
};

/**
 * Get wallet icon URL with fallback
 */
const getWalletIcon = (walletName: string): string | null => {
  return WALLET_ICONS[walletName] || null;
};

/**
 * Wallet icon component with fallback
 */
const WalletIcon = memo<{
  walletName: string;
  className?: string;
  size?: number;
}>(function WalletIcon({ walletName, className, size = 20 }) {
  const [hasError, setHasError] = useState(false);
  const iconUrl = getWalletIcon(walletName);

  if (!iconUrl || hasError) {
    return (
      <div
        className={cn(
          'rounded-full bg-primary/10 flex items-center justify-center',
          className,
        )}
        style={{ width: size, height: size }}
      >
        <Wallet className="size-3" />
      </div>
    );
  }

  return (
    <Image
      src={iconUrl}
      alt={`${walletName} wallet`}
      width={size}
      height={size}
      className={cn('rounded-full', className)}
      onError={() => setHasError(true)}
    />
  );
});

/**
 * Connection states for the wallet button
 */
type WalletConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'error';

/**
 * Props for the WalletMultiButton component
 */
interface WalletMultiButtonProps {
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: 'default' | 'outline' | 'ghost';
  /** Button size */
  size?: 'default' | 'sm' | 'lg';
  /** Whether to show the chain selector */
  showChainSelector?: boolean;
}

/**
 * A comprehensive wallet connection button component that handles wallet selection,
 * account management, chain switching, and address copying functionality.
 *
 * Features:
 * - Wallet selection dialog for initial connection
 * - Dropdown menu for connected wallet actions
 * - Address copying with toast notifications
 * - Chain switching integration
 * - Multiple account management
 * - Optimized with React.memo for performance
 *
 * @param props - Component props
 * @returns The wallet multi-button component
 */
export const WalletMultiButton = memo<WalletMultiButtonProps>(
  function WalletMultiButton({
    className,
    variant = 'default',
    size = 'default',
    showChainSelector = true,
  }) {
    // Context hooks
    const wallets = useWallets();

    const [selectedWalletAccount, setSelectedWalletAccount] = useContext(
      SelectedWalletAccountContext,
    );
    const chainContext = useContext(ChainContext);

    // Local state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [connectionState, setConnectionState] =
      useState<WalletConnectionState>('disconnected');
    const [connectingWallet, setConnectingWallet] = useState<string | null>(
      null,
    );

    // Clipboard functionality
    const clipboard = useClipboard({ timeout: 2000 });

    // Memoized values
    const availableWallets = useMemo(
      () => wallets.filter(wallet => wallet.accounts.length > 0),
      [wallets],
    );

    const isConnected = useMemo(
      () => Boolean(selectedWalletAccount),
      [selectedWalletAccount],
    );

    const truncatedAddress = useMemo(() => {
      if (!selectedWalletAccount?.address) return '';
      const addr = selectedWalletAccount.address;
      return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    }, [selectedWalletAccount?.address]);

    // Event handlers
    const handleWalletSelect = useCallback(
      async (wallet: UiWallet) => {
        if (wallet.accounts.length === 0) return;

        setConnectingWallet(wallet.name);
        setConnectionState('connecting');

        try {
          // Select the first account from the wallet
          const account = wallet.accounts[0];
          setSelectedWalletAccount(account);
          setConnectionState('connected');
          setIsDialogOpen(false);

          toast.success(`Connected to ${wallet.name}`);
        } catch (error) {
          console.error('Failed to connect wallet:', error);
          setConnectionState('error');
          toast.error('Failed to connect wallet');
        } finally {
          setConnectingWallet(null);
        }
      },
      [setSelectedWalletAccount],
    );

    const handleDisconnect = useCallback(() => {
      setSelectedWalletAccount(undefined);
      setConnectionState('disconnected');
      toast.success('Wallet disconnected');
    }, [setSelectedWalletAccount]);

    const handleCopyAddress = useCallback(() => {
      if (!selectedWalletAccount?.address) return;

      clipboard.copy(selectedWalletAccount.address);
      toast.success(LABELS.copied);
    }, [selectedWalletAccount?.address, clipboard]);

    const handleAccountSwitch = useCallback(
      (account: UiWalletAccount) => {
        setSelectedWalletAccount(account);
        toast.success('Account switched');
      },
      [setSelectedWalletAccount],
    );

    // Render wallet selection dialog
    const renderWalletDialog = () => (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={cn('gap-2', className)}
            disabled={connectionState === 'connecting'}
            aria-label={
              connectionState === 'connecting'
                ? LABELS.connecting
                : LABELS['no-wallet']
            }
          >
            {connectionState === 'connecting' ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                {LABELS.connecting}
              </>
            ) : (
              <>
                <Wallet className="size-4" />
                {LABELS['no-wallet']}
              </>
            )}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select a Wallet</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {availableWallets.map(wallet => (
              <Button
                key={wallet.name}
                variant="outline"
                className="justify-start gap-3 h-auto p-4"
                onClick={() => handleWalletSelect(wallet)}
                disabled={connectingWallet === wallet.name}
                aria-label={`Connect to ${wallet.name} wallet with ${wallet.accounts.length} account${wallet.accounts.length !== 1 ? 's' : ''}`}
              >
                {connectingWallet === wallet.name ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <WalletIcon walletName={wallet.name} size={20} />
                )}
                <div className="text-left">
                  <div className="font-medium">{wallet.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {wallet.accounts.length} account
                    {wallet.accounts.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </Button>
            ))}
            {availableWallets.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="size-8 mx-auto mb-2" />
                <p>No wallets detected</p>
                <p className="text-sm">
                  Please install a Solana wallet extension
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );

    // Render connected wallet dropdown
    const renderConnectedDropdown = () => {
      if (!selectedWalletAccount) return null;

      const currentWallet = wallets.find(w =>
        w.accounts.some(acc => acc.address === selectedWalletAccount.address),
      );

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              size={size}
              className={cn('gap-2 min-w-0', className)}
              onClick={handleCopyAddress}
              aria-label={`Connected wallet: ${truncatedAddress}. Click to copy address or open menu`}
            >
              <Avatar className="size-5">
                <WalletIcon
                  walletName={currentWallet?.name || 'Unknown'}
                  size={20}
                />
              </Avatar>
              <span className="truncate">{truncatedAddress}</span>
              <ChevronDown className="size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentWallet?.name}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {selectedWalletAccount.address}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Account switching */}
            {currentWallet && currentWallet.accounts.length > 1 && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Switch Account
                </DropdownMenuLabel>
                {currentWallet.accounts.map((account, index) => (
                  <DropdownMenuItem
                    key={account.address}
                    onClick={() => handleAccountSwitch(account)}
                    className="font-mono text-xs"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>Account {index + 1}</span>
                      {account.address === selectedWalletAccount.address && (
                        <Check className="size-3" />
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {/* Chain selector */}
            {showChainSelector && (
              <>
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Network
                </DropdownMenuLabel>
                <DropdownMenuItem className="gap-2">
                  <Globe className="size-4" />
                  <div className="flex items-center justify-between w-full">
                    <span>{chainContext.displayName}</span>
                    <div
                      className={cn(
                        'size-2 rounded-full',
                        chainContext.chain === 'solana:mainnet'
                          ? 'bg-green-500'
                          : chainContext.chain === 'solana:testnet'
                            ? 'bg-yellow-500'
                            : 'bg-orange-500',
                      )}
                    />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </>
            )}

            {/* Copy address */}
            <DropdownMenuItem onClick={handleCopyAddress} className="gap-2">
              {clipboard.copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {clipboard.copied ? LABELS.copied : LABELS['copy-address']}
            </DropdownMenuItem>

            {/* Disconnect */}
            <DropdownMenuItem
              onClick={handleDisconnect}
              className="gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="size-4" />
              {LABELS.disconnect}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };

    // Main render
    if (isConnected) {
      return renderConnectedDropdown();
    }

    return renderWalletDialog();
  },
);

// Default export for compatibility
export default WalletMultiButton;

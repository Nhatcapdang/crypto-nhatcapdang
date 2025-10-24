import { ChainContextProvider } from '@/contexts/ChainContextProvider';
import { RpcContextProvider } from '@/contexts/RpcContextProvider';
import { SelectedWalletAccountContextProvider } from '@/contexts/SelectedWalletAccountContextProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ChainContextProvider>
      <SelectedWalletAccountContextProvider>
        <RpcContextProvider>{children}</RpcContextProvider>
      </SelectedWalletAccountContextProvider>
    </ChainContextProvider>
  );
}

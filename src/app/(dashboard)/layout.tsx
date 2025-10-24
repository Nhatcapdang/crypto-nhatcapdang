import { WalletContextProvider } from '@/providers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <WalletContextProvider>{children}</WalletContextProvider>;
}

import {
  AppSidebar,
  SiteFooter,
  SiteHeader,
} from '@/components/dashboard-layout';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { WalletContextProvider } from '@/providers';
import StoreProvider from '@/providers/StoreProvider';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider>
      <WalletContextProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <SiteHeader />
            {children}
            <SiteFooter />
          </SidebarInset>
        </SidebarProvider>
      </WalletContextProvider>
    </StoreProvider>
  );
}

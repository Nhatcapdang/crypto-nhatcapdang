import AppSidebar from '@/components/dashboard-layout/app-sidebar';
import SiteFooter from '@/components/dashboard-layout/app-sidebar/site-footer';
import SiteHeader from '@/components/dashboard-layout/app-sidebar/site-header';
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

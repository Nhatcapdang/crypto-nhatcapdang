import {
  AppSidebar,
  SiteFooter,
  SiteHeader,
} from '@/components/dashboard-layout';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { WalletContextProvider } from '@/providers';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
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
  );
}

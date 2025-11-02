import { AppSidebar } from '@/components/dashboard-layout/app-sidebar';
import SiteHeader from '@/components/dashboard-layout/site-header';
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
          <main>
            <SiteHeader />
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </WalletContextProvider>
  );
}

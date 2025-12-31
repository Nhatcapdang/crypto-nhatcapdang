import { AppSidebar } from '@/components/dashboard-layout/app-sidebar';
import SiteFooter from '@/components/dashboard-layout/site-footer';
import SiteHeader from '@/components/dashboard-layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <main>
          <SiteHeader />
          {children}
          <SiteFooter />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

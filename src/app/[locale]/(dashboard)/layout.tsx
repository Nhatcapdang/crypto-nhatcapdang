import {
  AppSidebar,
  SiteFooter,
  SiteHeader,
} from '@/components/dashboard-layout';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { WalletContextProvider } from '@/providers';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'layout' });

  return {
    title: {
      template: t('template'),
      default: t('default'),
    },
    description: t('description') || 'Create Meme Coin for Free | NhatCapDang',
  };
};

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
            <SiteFooter />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </WalletContextProvider>
  );
}

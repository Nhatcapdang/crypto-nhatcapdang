import { AppSidebar } from '@/components/dashboard-layout/app-sidebar';
import SiteFooter from '@/components/dashboard-layout/site-footer';
import SiteHeader from '@/components/dashboard-layout/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui';
import { SettingsProvider } from '@/contexts/settingsContext';
import { ThemeProvider, WalletContextProvider } from '@/providers';
import { getMode, getSettingsFromCookie } from '@/utils/serverHelpers';
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

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mode = await getMode();
  const settingsCookie = await getSettingsFromCookie();
  return (
    <WalletContextProvider>
      <SettingsProvider settingsCookie={settingsCookie} mode={mode}>
        <ThemeProvider>
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
        </ThemeProvider>
      </SettingsProvider>
    </WalletContextProvider>
  );
}

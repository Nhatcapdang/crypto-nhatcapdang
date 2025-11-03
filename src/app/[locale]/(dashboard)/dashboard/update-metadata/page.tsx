import { UpdateMetadataComponent } from '@/components/dashboard-layout/update-metadata';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> => {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  return {
    title: t('update_metadata') || 'Update Metadata',
    description:
      t('update_token_description') || 'Modify token metadata on the fly',
    alternates: {
      canonical: '/dashboard/update-metadata',
      languages: {
        en: '/dashboard/update-metadata',
        vi: '/vi/dashboard/update-metadata',
      },
    },
  };
};

export default function UpdateMetadataPage() {
  return <UpdateMetadataComponent />;
}

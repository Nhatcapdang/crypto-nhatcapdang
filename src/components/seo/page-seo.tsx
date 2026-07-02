import { StructuredData } from '@/components/seo/structured-data';
import {
  createBreadcrumbStructuredData,
  createSoftwareApplicationStructuredData,
  createWebPageStructuredData,
} from '@/lib/seo';

interface PageSeoProps {
  title: string;
  description: string;
  locale: string;
  path: string;
  application?: boolean;
}

export function PageSeo({
  title,
  description,
  locale,
  path,
  application = false,
}: PageSeoProps) {
  const breadcrumbItems = [
    { name: 'Home', path: '/', locale },
    ...(path === '/'
      ? []
      : [
          {
            name: title,
            path,
            locale,
          },
        ]),
  ];

  const structuredData = [
    createWebPageStructuredData({ title, description, locale, path }),
    createBreadcrumbStructuredData(breadcrumbItems),
    ...(application
      ? [
          createSoftwareApplicationStructuredData({
            title,
            description,
            locale,
            path,
          }),
        ]
      : []),
  ];

  return <StructuredData data={structuredData} />;
}

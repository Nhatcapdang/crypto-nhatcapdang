import type { JsonLd } from '@/lib/seo';

interface StructuredDataProps {
  data: JsonLd | JsonLd[];
}

export function StructuredData({ data }: StructuredDataProps) {
  const graph = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(graph.length === 1 ? graph[0] : graph),
      }}
    />
  );
}

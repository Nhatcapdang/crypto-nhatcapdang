import { Button } from '@/components/ui';
import { Filter, FilterFieldConfig, Filters } from '@/components/ui/filters';
import { FunnelPlus } from 'lucide-react';
import { useCallback, useState } from 'react';

const ColumnFilters = () => {
  const fields: FilterFieldConfig[] = [
    {
      key: 'priceNative',
      label: 'Price Native',
      type: 'number',
      className: 'w-max',
      placeholder: 'Price Native',
    },
    {
      key: 'pairCreatedAt',
      label: 'Pair Created At',
      type: 'date',
      placeholder: 'Pair Created At',
    },
    {
      key: 'pairCreatedAtDate',
      label: 'Pair Created At Date',
      type: 'datetime',
      placeholder: 'Pair Created At',
    },
    {
      key: 'pairCreatedAtRange',
      label: 'Pair Created At Range',
      type: 'daterange',
      placeholder: 'Pair Created At',
    },
  ];
  const [filters, setFilters] = useState<Filter[]>([]);
  const handleFiltersChange = useCallback((filters: Filter[]) => {
    console.log('Filters updated:', filters);
    setFilters(filters);
  }, []);

  return (
    <Filters
      filters={filters}
      fields={fields}
      addButton={
        <Button size="sm" variant="outline" className="icon">
          <FunnelPlus />
        </Button>
      }
      onChange={handleFiltersChange}
    />
  );
};

export default ColumnFilters;

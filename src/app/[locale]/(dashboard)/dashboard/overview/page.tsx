import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { Plus } from 'lucide-react';

export default function OverviewPage({ pool }: { pool: React.ReactNode }) {
  return (
    <>
      {pool}
      <Link href="/dashboard/overview/create-liquidity">
        <Button>
          <Plus />
          Create Liquidity
        </Button>
      </Link>
    </>
  );
}

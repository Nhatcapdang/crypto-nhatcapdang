import CreateLiquidityComponent from '@/components/dashboard-layout/create-liquidity';
import { Modal } from '@/components/ui/modal';

export default function Page() {
  return (
    <Modal>
      <CreateLiquidityComponent />
    </Modal>
  );
}

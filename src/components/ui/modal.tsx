'use client';

import { useRouter } from '@/i18n/navigation';
import { Dialog, DialogContent, DialogTitle } from './dialog';

interface ModalProps {
  children: React.ReactNode;
}

export function Modal({ children }: ModalProps) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.back();
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogTitle />
        {children}
      </DialogContent>
    </Dialog>
  );
}

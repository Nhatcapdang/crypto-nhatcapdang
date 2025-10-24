'use client';
import { useState } from 'react';

import { getErrorMessage } from './errors';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '../ui';

type Props = Readonly<{
  error: unknown;
  onClose?(): false | void;
  title?: string;
}>;

export function ErrorDialog({ error, onClose, title }: Props) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) {
          if (!onClose || onClose() !== false) {
            setIsOpen(false);
          }
        }
      }}
    >
      <DialogContent>
        <DialogTitle color="red">
          {title ?? 'We encountered the following error'}
        </DialogTitle>
        <DialogDescription>
          <span>{getErrorMessage(error, 'Unknown')}</span>
        </DialogDescription>
        <div className="flex justify-end mt-4">
          <DialogClose>Close</DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}

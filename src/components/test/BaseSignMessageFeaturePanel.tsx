import type { ReadonlyUint8Array } from '@wallet-standard/core';
import { useRef, useState } from 'react';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '../ui';
import { ErrorDialog } from './ErrorDialog';

type Props = Readonly<{
  signMessage(message: ReadonlyUint8Array): Promise<ReadonlyUint8Array>;
}>;

export function BaseSignMessageFeaturePanel({ signMessage }: Props) {
  const { current: NO_ERROR } = useRef(Symbol());
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [error, setError] = useState(NO_ERROR);
  const [lastSignature, setLastSignature] = useState<
    ReadonlyUint8Array | undefined
  >();
  const [text, setText] = useState<string>();
  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        setError(NO_ERROR);
        setIsSigningMessage(true);
        try {
          const signature = await signMessage(new TextEncoder().encode(text));
          setLastSignature(signature);
        } catch (e) {
          setLastSignature(undefined);
          setError(e as unknown as symbol);
        } finally {
          setIsSigningMessage(false);
        }
      }}
    >
      <div className="flex-grow-1">sa</div>
      <Dialog
        open={!!lastSignature}
        onOpenChange={open => {
          if (!open) {
            setLastSignature(undefined);
          }
        }}
      >
        <DialogTrigger>Sign Message</DialogTrigger>
        {lastSignature ? (
          <DialogContent
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          >
            <DialogTitle>You Signed a Message!</DialogTitle>
            asdas
            <div className="flex gap-3 mt-4 justify-end">
              <DialogClose>Cool!</DialogClose>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
      {error !== NO_ERROR ? (
        <ErrorDialog
          error={error}
          onClose={() => setError(NO_ERROR)}
          title="Failed to sign message"
        />
      ) : null}
    </form>
  );
}

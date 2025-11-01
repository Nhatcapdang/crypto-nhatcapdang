'use client';

import { Button } from '@/components/ui/button';

import { useClipboard } from '@mantine/hooks';
import { ComponentProps } from 'react';

export type CopyButtonProps = {
  /** Children callback, provides current status and copy function as an argument */
  children: (payload: { copied: boolean; copy: () => void }) => React.ReactNode;
  /** Value that is copied to the clipboard when the button is clicked */
  value: string;
  className?: string;
  /** Copied status timeout in ms @default `1000` */
  timeout?: number;
} & Omit<ComponentProps<typeof Button>, 'children'>;

const CopyButton = ({ value, children, ...props }: CopyButtonProps) => {
  const clipboard = useClipboard({
    timeout: 1000,
  });
  return (
    <Button value={value} {...props}>
      {children({
        copied: clipboard.copied,
        copy: () => clipboard.copy(value),
      })}
    </Button>
  );
};
export default CopyButton;

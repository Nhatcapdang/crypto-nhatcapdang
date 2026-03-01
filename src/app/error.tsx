'use client';

import { Button } from '@/components/ui/button';
// eslint-disable-next-line no-restricted-imports
import Link from 'next/link';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">Whoops!</h2>
        <h3 className="mb-1.5 text-3xl font-semibold">Something went wrong</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The page you&apos;re looking for isn&apos;t found, we suggest you back
          to home.
        </p>
        <div className="flex gap-2">
          <Button variant="default" asChild>
            <Link href="/">Back to home </Link>
          </Button>
          <Button variant="outline" onClick={() => reset()}>
            Try again
          </Button>
        </div>
      </div>
    </div>
  );
}

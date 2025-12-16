'use client';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactNode } from 'react';
import { toast } from 'sonner';

interface QueryProviderProps {
  children: ReactNode;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      /**
       * Time in milliseconds that data remains fresh
       * When data is fresh (not stale): React Query will NOT refetch it automatically
       * When data is stale: React Query MAY refetch it in certain situations (window focus, component remount, etc.)
       */
      staleTime: 1000 * 60 * 5, // 5 minutes
      /**
       * gcTime (Garbage Collection Time)
       * Time in milliseconds that unused/inactive cache data remains in memory
       * When data is inactive (not used in any component): React Query will remove it from memory
       * When data is active (used in any component): React Query will keep it in memory
       */
      gcTime: 1000 * 60 * 30, // 30 minutes
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
  queryCache: new QueryCache({
    onError: error => {
      toast.error('Data fetch failed', {
        description: error.message || 'Failed to load data',
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.options.onError) {
        toast.error('Operation failed', {
          description: error.message || 'The operation could not be completed',
        });
      }
    },
  }),
});

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Only show devtools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

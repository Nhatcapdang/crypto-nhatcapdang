import { SwapFormData } from '@/components/swap';
import { pick } from 'lodash';
import { persist } from 'zustand/middleware';
import { createStore } from 'zustand/vanilla';

export type SwapState = {
  _hasHydrated: boolean;
  swapForm: SwapFormData;
};

export type SwapActions = {
  setSwapForm: (swapForm: SwapFormData) => void;
  _setHasHydrated: (hasHydrated: boolean) => void;
};

export type SwapStore = SwapState & SwapActions;

export const defaultInitStateSwap: SwapState = {
  _hasHydrated: false,
  swapForm: {
    payToken: null,
    receiveToken: null,
    payAmount: 0,
    receiveAmount: 0,
  },
};

export const createSwapStore = (
  initState: SwapState = defaultInitStateSwap
) => {
  return createStore<SwapStore>()(
    persist(
      set => ({
        ...initState,
        setSwapForm: swapForm => set({ swapForm }),
        _setHasHydrated: hasHydrated => set({ _hasHydrated: hasHydrated }),
      }),
      {
        name: 'swap-storage',
        partialize: state => pick(state, []),
        onRehydrateStorage: () => {
          return state => {
            state?._setHasHydrated(true);
          };
        },
      }
    )
  );
};

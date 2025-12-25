import type {
  Middleware,
  MiddlewareAPI,
  PayloadAction,
} from '@reduxjs/toolkit';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'sonner';

interface ErrorJupiterResponse {
  data: string;
  error: string;
  originalStatus: number;
  status: string;
}
export const rtkQueryErrorLogger: Middleware =
  (_api: MiddlewareAPI) => next => action => {
    // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
    if (isRejectedWithValue(action)) {
      const err = action as PayloadAction<
        ErrorJupiterResponse,
        string,
        {
          arg: unknown;
          requestId: string;
          requestStatus: 'rejected';
          aborted: boolean;
          condition: boolean;
        } & (
          | { rejectedWithValue: true }
          | ({ rejectedWithValue: false } & { error: ErrorJupiterResponse })
        ),
        ErrorJupiterResponse
      >;
      console.log(action);
      toast.error(err.payload.data, {
        description: err.payload.error,
      });
    }

    return next(action);
  };

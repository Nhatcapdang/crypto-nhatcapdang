import { Middleware, combineReducers } from '@reduxjs/toolkit';
import { rtkQueryErrorLogger } from './api/errorHandler';
import { jupiterApi } from './jupiter/jup-api';

export const reducers = combineReducers({
  [jupiterApi.reducerPath]: jupiterApi.reducer,
});

export const middlewares: Middleware[] = [
  jupiterApi.middleware,
  rtkQueryErrorLogger,
];

/**
 * Redux Store Configuration
 * Main store setup with Redux Toolkit
 */

import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import tasksReducer from './slices/tasksSlice';
import metricsReducer from './slices/metricsSlice';

// Configure the store
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    metrics: metricsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Export store for provider
export default store;

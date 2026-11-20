import { configureStore } from '@reduxjs/toolkit';
import auctionReducer from '../features/auctions/auctionSlice';
import workflowReducer from '../features/workflow/workflowSlice';

export const store = configureStore({
  reducer: {
    auctions: auctionReducer,
    workflow: workflowReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

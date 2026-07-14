import { configureStore } from "@reduxjs/toolkit";

import transactions from "../features/transactions/transactionSlice";
import transactionTypes from "../features/transactionTypes/transactionTypeSlice";

const store = configureStore({
  reducer: {
    transactionTypes,
    transactions,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

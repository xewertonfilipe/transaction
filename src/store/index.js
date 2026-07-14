import { configureStore } from "@reduxjs/toolkit";

import transactions from "../features/transactions/transactionSlice";
import transactionTypes from "../features/transactionTypes/transactionTypeSlice";

const store = configureStore({
  reducer: {
    transactionTypes,
    transactions,
  },
});

export default store;

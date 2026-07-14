import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import http from "../../http";

type TransactionTypesStatus = "idle" | "loading" | "succeeded" | "failed";

export interface TransactionTypeOption {
  value: string;
  display: string;
}

interface TransactionTypesState {
  types: TransactionTypeOption[];
  status: TransactionTypesStatus;
  error: string | null;
}

interface TransactionTypesSliceState {
  transactionTypes: TransactionTypesState;
}

const initialState: TransactionTypesState = {
  types: [],
  status: "idle",
  error: null,
};

export const fetchTransactionTypes = createAsyncThunk<
  TransactionTypeOption[],
  void,
  { rejectValue: string }
>("transactionTypes/fetchTransactionTypes", (_, { rejectWithValue }) => {
  return http
    .get("/transactions/types")
    .then((response) => {
      return response.data ?? [];
    })
    .catch(() =>
      rejectWithValue("Não foi possível carregar os tipos de transação.")
    );
});

const transactionTypeSlices = createSlice({
  name: "transactionTypes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionTypes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchTransactionTypes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.types = action.payload;
      })
      .addCase(fetchTransactionTypes.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? "Não foi possível carregar os tipos de transação.";
      });
  },
});

export const selectTransactionTypes = (state: TransactionTypesSliceState) =>
  state.transactionTypes.types;
export const selectTransactionTypesStatus = (
  state: TransactionTypesSliceState
) => state.transactionTypes.status;
export const selectTransactionTypesError = (
  state: TransactionTypesSliceState
) => state.transactionTypes.error;

export default transactionTypeSlices.reducer;

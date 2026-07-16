import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";

import http from "../../http";

type TransactionsStatus = "idle" | "loading" | "succeeded" | "failed";

interface TransactionPayload {
  value: number;
  type: string;
}

interface StoredTransaction {
  id: number;
  value: number;
  type: string;
  date: string;
}

interface TransactionsState {
  transactions: StoredTransaction[];
  status: TransactionsStatus;
  createStatus: TransactionsStatus;
  error: string | null;
}

interface TransactionSliceState {
  transactions: TransactionsState;
}

const initialState: TransactionsState = {
  transactions: [],
  status: "idle",
  createStatus: "idle",
  error: null,
};

const normalizeTransactionType = (type: string) => {
  return type
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

const getSignedValueByType = (value: number, type: string) => {
  if (normalizeTransactionType(type) === "deposito") {
    return Math.abs(value);
  }

  return -Math.abs(value);
};

const mapResponseToStoredTransaction = (
  data: unknown,
  payload: TransactionPayload
): StoredTransaction => {
  const typedData = (data ?? {}) as {
    id?: unknown;
    value?: unknown;
    type?: unknown;
    createdAt?: unknown;
    date?: unknown;
  };

  const responseType =
    typeof typedData.type === "string" ? typedData.type : payload.type;
  const rawValue =
    typeof typedData.value === "number" ? typedData.value : payload.value;

  return {
    id: typeof typedData.id === "number" ? typedData.id : Date.now(),
    type: responseType,
    value: getSignedValueByType(rawValue, responseType),
    date:
      typeof typedData.createdAt === "string"
        ? typedData.createdAt
        : typeof typedData.date === "string"
        ? typedData.date
        : new Date().toISOString(),
  };
};

export const createTransaction = createAsyncThunk<
  StoredTransaction,
  TransactionPayload,
  { rejectValue: string }
>("transactions/createTransaction", (payload, { rejectWithValue }) => {
  return http
    .post("/transactions", {
      value: Math.abs(payload.value),
      type: payload.type,
    })
    .then((response) => {
      const responseData = response.data?.transaction ?? response.data;
      return mapResponseToStoredTransaction(responseData, payload);
    })
    .catch(() =>
      rejectWithValue("Nao foi possivel concluir a transacao. Tente novamente.")
    );
});

const transactionSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<TransactionPayload>) => {
      state.transactions.push({
        ...action.payload,
        value: getSignedValueByType(action.payload.value, action.payload.type),
        id: state.transactions.length + 1,
        date: new Date().toISOString(),
      });
    },
    resetTransactionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTransaction.pending, (state) => {
        state.createStatus = "loading";
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.createStatus = "succeeded";
        state.transactions.push(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.createStatus = "failed";
        state.error =
          action.payload ??
          "Nao foi possivel concluir a transacao. Tente novamente.";
      });
  },
});

export const selectTransactions = createSelector(
  (state: TransactionSliceState) => state.transactions.transactions,
  (transactions) =>
    transactions.map((t) => {
      return {
        ...t,
        date: new Date(t.date),
      };
    })
);

export const selectCurrentBalance = createSelector(
  selectTransactions,
  (transactions) => transactions.reduce((balance, t) => balance + t.value, 0)
);

export const selectTransactionsStatus = (state: TransactionSliceState) =>
  state.transactions.status;
export const selectCreateTransactionStatus = (state: TransactionSliceState) =>
  state.transactions.createStatus;
export const selectTransactionsError = (state: TransactionSliceState) =>
  state.transactions.error;

export const { addTransaction, resetTransactionError } =
  transactionSlice.actions;

export default transactionSlice.reducer;

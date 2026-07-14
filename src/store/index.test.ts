import { createTransaction } from "../features/transactions/transactionSlice";
import {
  fetchTransactionTypes,
  selectTransactionTypes,
} from "../features/transactionTypes/transactionTypeSlice";

const getFreshStore = async () => {
  jest.resetModules();
  const module = await import(".");
  return module.default;
};

describe("store", () => {
  it("starts with expected reducer keys and initial values", async () => {
    const store = await getFreshStore();
    const state = store.getState();

    expect(Object.keys(state)).toEqual(["transactionTypes", "transactions"]);
    expect(state.transactionTypes.status).toBe("idle");
    expect(state.transactions.createStatus).toBe("idle");
    expect(state.transactions.error).toBeNull();
  });

  it("updates transactionTypes flow for pending, fulfilled and rejected", async () => {
    const store = await getFreshStore();

    store.dispatch(fetchTransactionTypes.pending("req-1", undefined));
    expect(store.getState().transactionTypes.status).toBe("loading");
    expect(store.getState().transactionTypes.error).toBeNull();

    store.dispatch(
      fetchTransactionTypes.fulfilled(
        [{ value: "deposito", display: "Deposito" }],
        "req-1",
        undefined
      )
    );
    expect(store.getState().transactionTypes.status).toBe("succeeded");
    expect(selectTransactionTypes(store.getState())).toEqual([
      { value: "deposito", display: "Deposito" },
    ]);

    store.dispatch(
      fetchTransactionTypes.rejected(
        new Error("network"),
        "req-2",
        undefined,
        "Não foi possível carregar os tipos de transação."
      )
    );
    expect(store.getState().transactionTypes.status).toBe("failed");
    expect(store.getState().transactionTypes.error).toBe(
      "Não foi possível carregar os tipos de transação."
    );
  });

  it("updates transactions flow for pending, fulfilled and rejected", async () => {
    const store = await getFreshStore();

    store.dispatch(
      createTransaction.pending("req-1", { value: 120, type: "deposito" })
    );
    expect(store.getState().transactions.createStatus).toBe("loading");
    expect(store.getState().transactions.error).toBeNull();

    store.dispatch(
      createTransaction.fulfilled(
        {
          id: 1,
          value: 120,
          type: "deposito",
          date: "2026-07-14T12:00:00.000Z",
        },
        "req-1",
        { value: 120, type: "deposito" }
      )
    );
    expect(store.getState().transactions.createStatus).toBe("succeeded");
    expect(store.getState().transactions.transactions).toHaveLength(1);

    store.dispatch(
      createTransaction.rejected(
        new Error("network"),
        "req-2",
        { value: 10, type: "saque" },
        "Nao foi possivel concluir a transacao. Tente novamente."
      )
    );
    expect(store.getState().transactions.createStatus).toBe("failed");
    expect(store.getState().transactions.error).toBe(
      "Nao foi possivel concluir a transacao. Tente novamente."
    );
  });
});

import http from "../../http";
import reducer, {
  addTransaction,
  createTransaction,
  resetTransactionError,
  selectCurrentBalance,
  selectTransactions,
} from "./transactionSlice";

jest.mock("../../http", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("createTransaction", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("maps createdAt from the API response into the internal date field", async () => {
    const createdAt = "2026-07-14T08:47:46.310Z";
    const mockedHttp = http as unknown as { post: jest.Mock };

    mockedHttp.post.mockResolvedValue({
      data: {
        transaction: {
          id: 1,
          value: 120,
          type: "deposito",
          createdAt,
        },
      },
    });

    const action = await createTransaction({ value: 120, type: "deposito" })(
      jest.fn(),
      jest.fn(),
      undefined
    );

    expect(mockedHttp.post).toHaveBeenCalledWith("/transactions", {
      value: 120,
      type: "deposito",
    });
    expect(action.type).toBe("transactions/createTransaction/fulfilled");
    expect(action.payload).toMatchObject({
      id: 1,
      value: 120,
      type: "deposito",
      date: createdAt,
    });
  });

  it("returns a rejected action with a friendly message when API fails", async () => {
    const mockedHttp = http as unknown as { post: jest.Mock };

    mockedHttp.post.mockRejectedValue(new Error("Network down"));

    const action = await createTransaction({ value: 120, type: "deposito" })(
      jest.fn(),
      jest.fn(),
      undefined
    );

    expect(action.type).toBe("transactions/createTransaction/rejected");
    expect(action.payload).toBe(
      "Nao foi possivel concluir a transacao. Tente novamente."
    );
  });
});

describe("transactions reducer and selectors", () => {
  it("adds positive value for deposito and negative value for saque", () => {
    const withDeposit = reducer(
      undefined,
      addTransaction({ value: 200, type: "Depósito" })
    );
    const withWithdraw = reducer(
      withDeposit,
      addTransaction({ value: 50, type: "saque" })
    );

    expect(withWithdraw.transactions).toHaveLength(2);
    expect(withWithdraw.transactions[0].value).toBe(200);
    expect(withWithdraw.transactions[1].value).toBe(-50);
  });

  it("resets previous transaction error", () => {
    const stateWithError = reducer(
      undefined,
      createTransaction.rejected(
        new Error("request failed"),
        "req-1",
        { value: 10, type: "saque" },
        "Nao foi possivel concluir a transacao. Tente novamente."
      )
    );

    const nextState = reducer(stateWithError, resetTransactionError());

    expect(stateWithError.error).toBe(
      "Nao foi possivel concluir a transacao. Tente novamente."
    );
    expect(nextState.error).toBeNull();
  });

  it("calculates current balance and maps date to Date objects", () => {
    const state = {
      transactions: {
        transactions: [
          {
            id: 1,
            value: 100,
            type: "deposito",
            date: "2026-07-14T08:47:46.310Z",
          },
          {
            id: 2,
            value: -30,
            type: "saque",
            date: "2026-07-14T09:47:46.310Z",
          },
        ],
        status: "idle" as const,
        createStatus: "idle" as const,
        error: null,
      },
    };

    const transactions = selectTransactions(state);
    const balance = selectCurrentBalance(state);

    expect(transactions[0].date).toBeInstanceOf(Date);
    expect(transactions[1].date).toBeInstanceOf(Date);
    expect(balance).toBe(70);
  });
});

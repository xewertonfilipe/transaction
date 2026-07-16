import http from "../../http";
import reducer, {
  fetchTransactionTypes,
  selectTransactionTypes,
  selectTransactionTypesError,
  selectTransactionTypesStatus,
} from "./transactionTypeSlice";

jest.mock("../../http", () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
  },
}));

describe("fetchTransactionTypes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns fulfilled with API payload", async () => {
    const mockedHttp = http as unknown as { get: jest.Mock };
    const payload = [
      { value: "deposito", display: "Deposito" },
      { value: "saque", display: "Saque" },
    ];

    mockedHttp.get.mockResolvedValue({ data: payload });

    const action = await fetchTransactionTypes()(
      jest.fn(),
      jest.fn(),
      undefined
    );

    expect(mockedHttp.get).toHaveBeenCalledWith("/transactions/types");
    expect(action.type).toBe(
      "transactionTypes/fetchTransactionTypes/fulfilled"
    );
    expect(action.payload).toEqual(payload);
  });

  it("returns a rejected action with a friendly message", async () => {
    const mockedHttp = http as unknown as { get: jest.Mock };

    mockedHttp.get.mockRejectedValue(new Error("timeout"));

    const action = await fetchTransactionTypes()(
      jest.fn(),
      jest.fn(),
      undefined
    );

    expect(action.type).toBe("transactionTypes/fetchTransactionTypes/rejected");
    expect(action.payload).toBe(
      "Não foi possível carregar os tipos de transação."
    );
  });
});

describe("transactionTypes reducer and selectors", () => {
  it("updates status and list on fulfilled", () => {
    const nextState = reducer(
      undefined,
      fetchTransactionTypes.fulfilled(
        [{ value: "deposito", display: "Deposito" }],
        "req-1"
      )
    );

    expect(nextState.status).toBe("succeeded");
    expect(nextState.types).toEqual([
      { value: "deposito", display: "Deposito" },
    ]);
  });

  it("updates status and error on rejected", () => {
    const nextState = reducer(
      undefined,
      fetchTransactionTypes.rejected(
        new Error("request failed"),
        "req-2",
        undefined,
        "Não foi possível carregar os tipos de transação."
      )
    );

    expect(nextState.status).toBe("failed");
    expect(nextState.error).toBe(
      "Não foi possível carregar os tipos de transação."
    );
  });

  it("reads values from selectors", () => {
    const state = {
      transactionTypes: {
        types: [{ value: "saque", display: "Saque" }],
        status: "succeeded" as const,
        error: null,
      },
    };

    expect(selectTransactionTypes(state)).toEqual([
      { value: "saque", display: "Saque" },
    ]);
    expect(selectTransactionTypesStatus(state)).toBe("succeeded");
    expect(selectTransactionTypesError(state)).toBeNull();
  });
});

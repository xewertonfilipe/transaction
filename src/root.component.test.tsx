import { render } from "@testing-library/react";

import * as transactionTypeSlice from "./features/transactionTypes/transactionTypeSlice";
import Root from "./root.component";
import * as hooks from "./store/hooks";

const mockDispatch = jest.fn();

describe("Root component", () => {
  let dispatchSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    dispatchSpy = jest
      .spyOn(hooks, "useAppDispatch")
      .mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    dispatchSpy.mockRestore();
  });

  it("should be in the document", () => {
    const { getByRole } = render(<Root />);

    expect(
      getByRole("heading", { name: /Nova transação/i })
    ).toBeInTheDocument();
  });

  it("dispatches fetchTransactionTypes on mount", () => {
    const action = { type: "transactionTypes/fetchTransactionTypes/pending" };
    const fetchSpy = jest
      .spyOn(transactionTypeSlice, "fetchTransactionTypes")
      .mockReturnValue(
        action as unknown as ReturnType<
          typeof transactionTypeSlice.fetchTransactionTypes
        >
      );

    render(<Root />);

    expect(transactionTypeSlice.fetchTransactionTypes).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(action);

    fetchSpy.mockRestore();
  });
});

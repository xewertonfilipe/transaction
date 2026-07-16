import { fireEvent, render, waitFor } from "@testing-library/react";

import { createTransaction } from "../../features/transactions/transactionSlice";
import { TransactionForm } from ".";

const mockDispatch = jest.fn();
const mockUseAppDispatch = jest.fn();
const mockUseAppSelector = jest.fn();

jest.mock("../../store/hooks", () => ({
  useAppDispatch: () => mockUseAppDispatch(),
  useAppSelector: (selector: (state: unknown) => unknown) =>
    mockUseAppSelector(selector),
}));

jest.mock("../../features/transactions/transactionSlice", () => {
  const actual = jest.requireActual(
    "../../features/transactions/transactionSlice"
  );
  return {
    ...actual,
    createTransaction: jest.fn(),
  };
});

const baseState = {
  transactionTypes: {
    types: [
      { value: "deposito", display: "Deposito" },
      { value: "saque", display: "Saque" },
    ],
    status: "succeeded",
    error: null,
  },
  transactions: {
    transactions: [],
    status: "idle",
    createStatus: "idle",
    error: null,
  },
};

describe("TransactionForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppDispatch.mockReturnValue(mockDispatch);
    mockUseAppSelector.mockImplementation((selector) => selector(baseState));
  });

  it("does not dispatch when transaction type is missing", () => {
    render(<TransactionForm />);

    const input = document.querySelector('input[type="number"]');
    const form = document.querySelector("form");

    if (!input || !form) {
      throw new Error("Expected form controls to be rendered");
    }

    fireEvent.change(input, { target: { value: "120" } });
    fireEvent.submit(form);

    expect(mockDispatch).not.toHaveBeenCalled();
    expect(createTransaction).not.toHaveBeenCalled();
  });

  it("dispatches createTransaction and resets fields on success", async () => {
    const unwrap = jest.fn().mockResolvedValue(undefined);
    const fakeAction = { type: "transactions/createTransaction/pending" };
    const dispatchEventSpy = jest.spyOn(document, "dispatchEvent");

    mockDispatch.mockReturnValue({ unwrap });
    (createTransaction as any).mockReturnValue(fakeAction);

    const { getByRole } = render(<TransactionForm />);
    const select = getByRole("combobox") as HTMLSelectElement;
    const input = document.querySelector(
      'input[type="number"]'
    ) as HTMLInputElement;
    const form = document.querySelector("form") as HTMLFormElement;

    fireEvent.change(select, { target: { value: "deposito" } });
    fireEvent.change(input, { target: { value: "120" } });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(createTransaction).toHaveBeenCalledWith({
        value: 120,
        type: "deposito",
      });
      expect(mockDispatch).toHaveBeenCalledWith(fakeAction);
      expect(unwrap).toHaveBeenCalled();
      expect(select.value).toBe("");
      expect(input.value).toBe("");
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({ type: "bank:transaction:created" })
      );
    });
  });

  it("disables controls while request is loading", () => {
    mockUseAppSelector.mockImplementation((selector) =>
      selector({
        ...baseState,
        transactions: {
          ...baseState.transactions,
          createStatus: "loading",
        },
      })
    );

    const { getByRole } = render(<TransactionForm />);
    const select = getByRole("combobox");
    const input = document.querySelector('input[type="number"]');
    const button = getByRole("button", { name: /Concluindo transacao/i });

    expect(select).toBeDisabled();
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();
    expect(
      document.querySelector('[data-testid="button-loading-spinner"]')
    ).toBeInTheDocument();
  });
});

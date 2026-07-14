import http from "../../http";
import { createTransaction } from "./transactionSlice";

jest.mock("../../http", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("createTransaction", () => {
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
});

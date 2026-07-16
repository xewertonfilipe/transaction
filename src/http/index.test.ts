type RequestConfig = {
  headers?: Record<string, string>;
};

const mockCreate = jest.fn();

jest.mock("axios", () => ({
  __esModule: true,
  default: {
    create: mockCreate,
  },
}));

describe("http client", () => {
  const originalEnvValue = process.env.VITE_API_BASE_URL;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterEach(() => {
    process.env.VITE_API_BASE_URL = originalEnvValue;
    jest.restoreAllMocks();
  });

  it("creates an axios client with baseURL from env", async () => {
    const requestUse = jest.fn();

    process.env.VITE_API_BASE_URL = "https://api.bytebank.test";

    mockCreate.mockReturnValue({
      interceptors: {
        request: {
          use: requestUse,
        },
      },
    });

    await import(".");

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: "https://api.bytebank.test/",
    });
    expect(requestUse).toHaveBeenCalledTimes(1);
  });

  it("falls back to localhost baseURL when env is missing", async () => {
    const requestUse = jest.fn();

    delete process.env.VITE_API_BASE_URL;

    mockCreate.mockReturnValue({
      interceptors: {
        request: {
          use: requestUse,
        },
      },
    });

    await import(".");

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: "http://localhost:3000/",
    });
    expect(requestUse).toHaveBeenCalledTimes(1);
  });

  it("adds Authorization header when accessToken is available", async () => {
    const requestUse = jest.fn();

    mockCreate.mockReturnValue({
      interceptors: {
        request: {
          use: requestUse,
        },
      },
    });

    jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation((key) =>
        key === "accessToken" ? "token-123" : null
      );

    await import(".");

    const onFulfilled = requestUse.mock.calls[0][0] as (
      config: RequestConfig
    ) => RequestConfig;
    const result = onFulfilled({ headers: {} });

    expect(result.headers).toEqual({ Authorization: "Bearer token-123" });
  });

  it("falls back to token when accessToken is missing", async () => {
    const requestUse = jest.fn();

    mockCreate.mockReturnValue({
      interceptors: {
        request: {
          use: requestUse,
        },
      },
    });

    jest.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
      if (key === "accessToken") {
        return null;
      }

      if (key === "token") {
        return "legacy-token";
      }

      return null;
    });

    await import(".");

    const onFulfilled = requestUse.mock.calls[0][0] as (
      config: RequestConfig
    ) => RequestConfig;
    const result = onFulfilled({ headers: {} });

    expect(result.headers).toEqual({ Authorization: "Bearer legacy-token" });
  });

  it("keeps headers unchanged when token is missing", async () => {
    const requestUse = jest.fn();

    mockCreate.mockReturnValue({
      interceptors: {
        request: {
          use: requestUse,
        },
      },
    });

    jest.spyOn(Storage.prototype, "getItem").mockReturnValue(null);

    await import(".");

    const onFulfilled = requestUse.mock.calls[0][0] as (
      config: RequestConfig
    ) => RequestConfig;
    const result = onFulfilled({ headers: { "X-Test": "1" } });

    expect(result.headers).toEqual({ "X-Test": "1" });
  });

  it("propagates interceptor errors", async () => {
    const requestUse = jest.fn();
    const error = new Error("request failed");

    mockCreate.mockReturnValue({
      interceptors: {
        request: {
          use: requestUse,
        },
      },
    });

    await import(".");

    const onRejected = requestUse.mock.calls[0][1] as (
      err: Error
    ) => Promise<never>;

    await expect(onRejected(error)).rejects.toBe(error);
  });
});

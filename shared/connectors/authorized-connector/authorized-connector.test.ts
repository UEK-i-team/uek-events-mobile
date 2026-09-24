import { AxiosRequestConfig, AxiosResponse } from "axios";

import { IHttpConnector } from "../http-connector";
import {
  AuthorizedHttpConnector,
  IAccessTokenProvider,
  MissingAccessTokenError,
} from "./authorized-connector";

function createResponse<T>(data: T, status = 200): AxiosResponse<T> {
  return {
    data,
    status,
    statusText: "OK",
    headers: {},
    config: {} as AxiosResponse["config"],
  };
}

function createHttpError(status: number) {
  return { isAxiosError: true, response: { status } };
}

class FakeHttp implements IHttpConnector {
  public calls: AxiosRequestConfig[] = [];
  public responses: (AxiosResponse | object)[] = [];

  public async get<T>(_url: string, config?: AxiosRequestConfig) {
    this.calls.push(config ?? {});
    const next = this.responses.shift();
    if (!next || !("status" in next && "data" in next)) {
      throw next;
    }
    return next as AxiosResponse<T>;
  }

  public post = this.get;
  public put = this.get;
  public patch = this.get;
  public delete = this.get;
}

class FakeTokenProvider implements IAccessTokenProvider {
  public accessToken: string | null = "access-1";
  public refreshedToken: string | null = "access-2";
  public refreshError: unknown = null;
  public refreshCalls: string[] = [];

  public async getValidAccessToken() {
    return this.accessToken;
  }

  public async refreshAfterUnauthorized(rejectedAccessToken: string) {
    this.refreshCalls.push(rejectedAccessToken);
    if (this.refreshError) {
      throw this.refreshError;
    }
    return this.refreshedToken;
  }
}

function authorizationOf(config: AxiosRequestConfig) {
  return (config.headers as Record<string, string>).Authorization;
}

describe("AuthorizedHttpConnector", () => {
  it("sends the access token as a Bearer header", async () => {
    const http = new FakeHttp();
    http.responses.push(createResponse({ ok: true }));
    const connector = new AuthorizedHttpConnector(http, new FakeTokenProvider());

    const response = await connector.get("api/test", {
      headers: { "X-Custom": "1" },
    });

    expect(response.data).toEqual({ ok: true });
    expect(authorizationOf(http.calls[0])).toBe("Bearer access-1");
    expect((http.calls[0].headers as Record<string, string>)["X-Custom"]).toBe("1");
  });

  it("refreshes once and retries after a 401", async () => {
    const http = new FakeHttp();
    http.responses.push(createHttpError(401), createResponse({ ok: true }));
    const tokens = new FakeTokenProvider();
    const connector = new AuthorizedHttpConnector(http, tokens);

    const response = await connector.get("api/test");

    expect(response.data).toEqual({ ok: true });
    expect(tokens.refreshCalls).toEqual(["access-1"]);
    expect(authorizationOf(http.calls[1])).toBe("Bearer access-2");
  });

  it("rethrows a repeated 401 without refreshing again", async () => {
    const http = new FakeHttp();
    const secondError = createHttpError(401);
    http.responses.push(createHttpError(401), secondError);
    const tokens = new FakeTokenProvider();
    const connector = new AuthorizedHttpConnector(http, tokens);

    await expect(connector.get("api/test")).rejects.toBe(secondError);
    expect(tokens.refreshCalls).toHaveLength(1);
    expect(http.calls).toHaveLength(2);
  });

  it("does not refresh on server errors", async () => {
    const http = new FakeHttp();
    const serverError = createHttpError(500);
    http.responses.push(serverError);
    const tokens = new FakeTokenProvider();
    const connector = new AuthorizedHttpConnector(http, tokens);

    await expect(connector.get("api/test")).rejects.toBe(serverError);
    expect(tokens.refreshCalls).toHaveLength(0);
  });

  it("rethrows the original 401 when the session could not be refreshed", async () => {
    const http = new FakeHttp();
    const unauthorized = createHttpError(401);
    http.responses.push(unauthorized);
    const tokens = new FakeTokenProvider();
    tokens.refreshedToken = null;
    const connector = new AuthorizedHttpConnector(http, tokens);

    await expect(connector.get("api/test")).rejects.toBe(unauthorized);
    expect(http.calls).toHaveLength(1);
  });

  it("propagates transient refresh failures", async () => {
    const http = new FakeHttp();
    http.responses.push(createHttpError(401));
    const tokens = new FakeTokenProvider();
    const refreshError = new Error("offline");
    tokens.refreshError = refreshError;
    const connector = new AuthorizedHttpConnector(http, tokens);

    await expect(connector.get("api/test")).rejects.toBe(refreshError);
  });

  it("fails without calling the API when there is no access token", async () => {
    const http = new FakeHttp();
    const tokens = new FakeTokenProvider();
    tokens.accessToken = null;
    const connector = new AuthorizedHttpConnector(http, tokens);

    await expect(connector.get("api/test")).rejects.toBeInstanceOf(
      MissingAccessTokenError,
    );
    expect(http.calls).toHaveLength(0);
  });
});

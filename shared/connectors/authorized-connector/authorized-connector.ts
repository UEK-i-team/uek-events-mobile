import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

import { IHttpConnector } from "../http-connector";

export interface IAccessTokenProvider {
  getValidAccessToken(): Promise<string | null>;
  refreshAfterUnauthorized(rejectedAccessToken: string): Promise<string | null>;
}

export class MissingAccessTokenError extends Error {
  constructor() {
    super("No access token available.");
    this.name = "MissingAccessTokenError";
  }
}

type RequestExecutor<T> = (
  config: AxiosRequestConfig,
) => Promise<AxiosResponse<T>>;

/**
 * Sends requests with a Bearer token and retries once with a refreshed token
 * after a 401. A repeated 401 is rethrown as a regular error: only the auth
 * session (refresh endpoint) decides whether the user is logged out.
 */
export class AuthorizedHttpConnector implements IHttpConnector {
  constructor(
    private readonly http: IHttpConnector,
    private readonly tokenProvider: IAccessTokenProvider,
  ) {}

  public get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.send((c) => this.http.get<T>(url, c), config);
  }

  public post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.send((c) => this.http.post<T>(url, data, c), config);
  }

  public put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.send((c) => this.http.put<T>(url, data, c), config);
  }

  public patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.send((c) => this.http.patch<T>(url, data, c), config);
  }

  public delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.send((c) => this.http.delete<T>(url, c), config);
  }

  private async send<T>(
    execute: RequestExecutor<T>,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const accessToken = await this.tokenProvider.getValidAccessToken();
    if (!accessToken) {
      throw new MissingAccessTokenError();
    }

    try {
      return await execute(withAccessToken(config, accessToken));
    } catch (error) {
      if (!isUnauthorizedError(error)) {
        throw error;
      }

      const refreshedAccessToken =
        await this.tokenProvider.refreshAfterUnauthorized(accessToken);
      if (!refreshedAccessToken) {
        throw error;
      }

      return execute(withAccessToken(config, refreshedAccessToken));
    }
  }
}

function withAccessToken(
  config: AxiosRequestConfig | undefined,
  accessToken: string,
): AxiosRequestConfig {
  return {
    ...config,
    headers: {
      ...(config?.headers as Record<string, string> | undefined),
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

function isUnauthorizedError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as AxiosError).isAxiosError === true &&
    (error as AxiosError).response?.status === 401
  );
}

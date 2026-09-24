import { AxiosResponse } from "axios";

import { IHttpConnector } from "@/shared/connectors/http-connector";

import {
  MeResponse,
  RefreshResponse,
  StartResponse,
  VerifyResponse,
} from "../types";
import { AuthApiError, parseAuthApiError } from "./auth-errors";

const AUTH_BASE = "api/auth/authuser";

export interface IAuthRepository {
  start(email: string): Promise<StartResponse>;
  verify(challengeId: string, code: string): Promise<VerifyResponse>;
  refresh(refreshToken: string): Promise<RefreshResponse>;
  me(accessToken: string): Promise<MeResponse>;
  logout(accessToken: string): Promise<void>;
}

export class AuthRepository implements IAuthRepository {
  constructor(private readonly http: IHttpConnector) {}

  public async start(email: string): Promise<StartResponse> {
    return this.request(() =>
      this.http.post<StartResponse>(`${AUTH_BASE}/start/`, { email }),
    );
  }

  public async verify(
    challengeId: string,
    code: string,
  ): Promise<VerifyResponse> {
    return this.request(() =>
      this.http.post<VerifyResponse>(`${AUTH_BASE}/verify/`, {
        challengeId,
        code,
      }),
    );
  }

  public async refresh(refreshToken: string): Promise<RefreshResponse> {
    return this.request(() =>
      this.http.post<RefreshResponse>(`${AUTH_BASE}/refresh/`, {
        refreshToken,
      }),
    );
  }

  public async me(accessToken: string): Promise<MeResponse> {
    return this.request(() =>
      this.http.get<MeResponse>(`${AUTH_BASE}/me/`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
  }

  public async logout(accessToken: string): Promise<void> {
    await this.request(() =>
      this.http.post(`${AUTH_BASE}/logout/`, undefined, {
        headers: { Authorization: `Bearer ${accessToken}` },
      }),
    );
  }

  private async request<T>(
    fn: () => Promise<AxiosResponse<T>>,
  ): Promise<T> {
    try {
      const response = await fn();
      return response.data;
    } catch (error) {
      throw parseAuthApiError(error);
    }
  }
}

export function isSessionExpiredError(error: unknown): boolean {
  if (!(error instanceof AuthApiError)) {
    return false;
  }

  return (
    error.code === "invalid_refresh_token" ||
    error.code === "refresh_token_replay" ||
    error.code === "session_revoked"
  );
}

import { AxiosError } from "axios";

import { AuthErrorCode } from "../types";

export class AuthApiError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly httpStatus?: number,
  ) {
    super(message);
    this.name = "AuthApiError";
  }
}

const AUTH_ERROR_CODES: AuthErrorCode[] = [
  "rate_limit_exceeded",
  "invalid_challenge",
  "challenge_expired",
  "challenge_used",
  "too_many_attempts",
  "invalid_code",
  "invalid_refresh_token",
  "refresh_token_replay",
  "session_revoked",
];

function isAuthErrorCode(value: unknown): value is AuthErrorCode {
  return (
    typeof value === "string" &&
    AUTH_ERROR_CODES.includes(value as AuthErrorCode)
  );
}

function mapHttpStatusToCode(status: number): AuthErrorCode {
  if (status === 429) return "rate_limit_exceeded";
  if (status === 401) return "session_revoked";
  if (status >= 500) return "network_error";
  if (status === 400 || status === 422) return "validation_error";
  // 403 and other client errors: unknown (avoid aggressive logout)
  return "unknown";
}

export function parseAuthApiError(error: unknown): AuthApiError {
  if (error instanceof AuthApiError) {
    return error;
  }

  if (!isAxiosError(error)) {
    return new AuthApiError("network_error", "Network error");
  }

  if (!error.response) {
    return new AuthApiError("network_error", "Network error");
  }

  const { status, data } = error.response;

  if (data && typeof data === "object" && "error" in data) {
    const payload = data as { error?: unknown; message?: unknown };
    const code = isAuthErrorCode(payload.error)
      ? payload.error
      : mapHttpStatusToCode(status);
    const message =
      typeof payload.message === "string" ? payload.message : "Request failed";
    return new AuthApiError(code, message, status);
  }

  if (data && typeof data === "object" && "detail" in data) {
    const detail = (data as { detail?: unknown }).detail;
    const code = mapHttpStatusToCode(status);
    const message =
      typeof detail === "string" ? detail : "Sesja wygasła. Zaloguj się ponownie.";
    return new AuthApiError(code, message, status);
  }

  if (data && typeof data === "object") {
    const fieldErrors = Object.values(data as Record<string, unknown>).flat();
    const firstMessage = fieldErrors.find((item) => typeof item === "string");
    return new AuthApiError(
      "validation_error",
      typeof firstMessage === "string" ? firstMessage : "Sprawdź wprowadzone dane.",
      status,
    );
  }

  return new AuthApiError(mapHttpStatusToCode(status), "Request failed", status);
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === "object" &&
    error !== null &&
    "isAxiosError" in error &&
    (error as AxiosError).isAxiosError === true
  );
}

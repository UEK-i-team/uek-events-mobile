import { AxiosError } from "axios";

import { isSessionExpiredError } from "./auth-repository";
import { parseAuthApiError } from "./auth-errors";

function axiosErrorWithResponse(
  status: number,
  data: unknown,
): AxiosError {
  return {
    isAxiosError: true,
    response: { status, data, headers: {}, config: {} as AxiosError["config"] },
    name: "AxiosError",
    message: "Request failed",
    config: {} as AxiosError["config"],
    toJSON: () => ({}),
  } as AxiosError;
}

describe("parseAuthApiError", () => {
  describe("detail payload", () => {
    it("maps 401 detail to session_revoked", () => {
      const error = axiosErrorWithResponse(401, {
        detail: "Authentication credentials were not provided.",
      });
      const parsed = parseAuthApiError(error);
      expect(parsed.code).toBe("session_revoked");
      expect(parsed.message).toBe(
        "Authentication credentials were not provided.",
      );
      expect(isSessionExpiredError(parsed)).toBe(true);
    });

    it("maps 429 detail to rate_limit_exceeded", () => {
      const error = axiosErrorWithResponse(429, {
        detail: "Request was throttled.",
      });
      const parsed = parseAuthApiError(error);
      expect(parsed.code).toBe("rate_limit_exceeded");
      expect(parsed.message).toBe("Request was throttled.");
      expect(isSessionExpiredError(parsed)).toBe(false);
    });

    it("maps 400 detail to validation_error", () => {
      const error = axiosErrorWithResponse(400, { detail: "Invalid input." });
      const parsed = parseAuthApiError(error);
      expect(parsed.code).toBe("validation_error");
      expect(isSessionExpiredError(parsed)).toBe(false);
    });

    it("maps 503 detail to network_error without session expiry", () => {
      const error = axiosErrorWithResponse(503, {
        detail: "Service unavailable.",
      });
      const parsed = parseAuthApiError(error);
      expect(parsed.code).toBe("network_error");
      expect(parsed.message).toBe("Service unavailable.");
      expect(isSessionExpiredError(parsed)).toBe(false);
    });
  });

  describe("error payload priority", () => {
    it("prefers structured error over detail semantics", () => {
      const error = axiosErrorWithResponse(400, {
        error: "invalid_code",
        message: "Wrong code.",
      });
      const parsed = parseAuthApiError(error);
      expect(parsed.code).toBe("invalid_code");
      expect(parsed.message).toBe("Wrong code.");
    });
  });
});

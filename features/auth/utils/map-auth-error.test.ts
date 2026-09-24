import { AuthApiError } from "../api/auth-errors";
import { TokenPersistenceError } from "../services/auth-session.service";
import {
  mapAuthError,
  shouldRestartOtpFlow,
  toOtpErrorCode,
} from "./map-auth-error";

describe("mapAuthError", () => {
  it("maps known auth error codes to polish messages", () => {
    expect(mapAuthError("invalid_code")).toBe(
      "Kod jest niepoprawny lub wygasł.",
    );
    expect(mapAuthError("rate_limit_exceeded")).toBe(
      "Zbyt wiele prób. Spróbuj ponownie za chwilę.",
    );
  });

  it("falls back to unknown message", () => {
    expect(mapAuthError("unknown")).toBe("Coś poszło nie tak. Spróbuj ponownie.");
  });
});

describe("shouldRestartOtpFlow", () => {
  it("returns true for expired or exhausted challenge errors", () => {
    expect(shouldRestartOtpFlow("challenge_expired")).toBe(true);
    expect(shouldRestartOtpFlow("too_many_attempts")).toBe(true);
    expect(shouldRestartOtpFlow("invalid_challenge")).toBe(true);
  });

  it("returns false for invalid code", () => {
    expect(shouldRestartOtpFlow("invalid_code")).toBe(false);
  });

  it("restarts the flow when the session could not be persisted", () => {
    expect(shouldRestartOtpFlow("session_persist_failed")).toBe(true);
  });
});

describe("toOtpErrorCode", () => {
  it("uses the code of an API error", () => {
    expect(toOtpErrorCode(new AuthApiError("invalid_code", "Invalid"))).toBe(
      "invalid_code",
    );
  });

  it("maps a token persistence failure to session_persist_failed", () => {
    expect(
      toOtpErrorCode(new TokenPersistenceError("Failed to persist refresh token.")),
    ).toBe("session_persist_failed");
  });

  it("falls back to unknown for other errors", () => {
    expect(toOtpErrorCode(new Error("boom"))).toBe("unknown");
  });
});

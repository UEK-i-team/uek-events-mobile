import { AuthApiError } from "../api/auth-errors";
import { TokenPersistenceError } from "../services/auth-session.service";
import { AuthErrorCode } from "../types";

const MESSAGES: Record<AuthErrorCode, string> = {
  rate_limit_exceeded: "Zbyt wiele prób. Spróbuj ponownie za chwilę.",
  invalid_challenge: "Sesja wygasła. Rozpocznij logowanie od nowa.",
  challenge_expired: "Kod wygasł. Wyślij nowy kod.",
  challenge_used: "Kod został już użyty. Rozpocznij logowanie od nowa.",
  too_many_attempts: "Przekroczono liczbę prób. Wyślij nowy kod.",
  invalid_code: "Kod jest niepoprawny lub wygasł.",
  invalid_refresh_token: "Sesja wygasła. Zaloguj się ponownie.",
  refresh_token_replay: "Sesja wygasła. Zaloguj się ponownie.",
  session_revoked: "Sesja wygasła. Zaloguj się ponownie.",
  validation_error: "Sprawdź wprowadzone dane.",
  network_error: "Brak połączenia z internetem. Spróbuj ponownie.",
  session_persist_failed:
    "Nie udało się zapisać sesji na urządzeniu. Zaloguj się ponownie.",
  unknown: "Coś poszło nie tak. Spróbuj ponownie.",
};

export function mapAuthError(code: AuthErrorCode): string {
  return MESSAGES[code] ?? MESSAGES.unknown;
}

export function toOtpErrorCode(error: unknown): AuthErrorCode {
  if (error instanceof AuthApiError) {
    return error.code;
  }

  if (error instanceof TokenPersistenceError) {
    return "session_persist_failed";
  }

  return "unknown";
}

export function shouldRestartOtpFlow(code: AuthErrorCode): boolean {
  return (
    code === "invalid_challenge" ||
    code === "challenge_expired" ||
    code === "challenge_used" ||
    code === "too_many_attempts" ||
    // The server already consumed the challenge; retrying the code would fail.
    code === "session_persist_failed"
  );
}

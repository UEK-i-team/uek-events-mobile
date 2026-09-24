export type AuthStatus =
  | "initializing"
  | "unauthenticated"
  | "authenticated"
  | "unverified";

export type AuthErrorCode =
  | "rate_limit_exceeded"
  | "invalid_challenge"
  | "challenge_expired"
  | "challenge_used"
  | "too_many_attempts"
  | "invalid_code"
  | "invalid_refresh_token"
  | "refresh_token_replay"
  | "session_revoked"
  | "validation_error"
  | "network_error"
  | "session_persist_failed"
  | "unknown";

export interface StartResponse {
  challengeId?: string;
  expiresIn?: number;
  message: string;
}

export interface VerifyResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface MeResponse {
  id: string;
  status: string;
  emailVerifiedAt: string;
  lastReverifiedAt: string;
}

export interface AuthErrorResponse {
  error: AuthErrorCode;
  message: string;
}

export type OtpLoginStep = "email" | "code";

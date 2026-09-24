import { AuthApiError } from "../api/auth-errors";
import { IAuthRepository, isSessionExpiredError } from "../api/auth-repository";
import { IAuthTokenStore } from "../storage/auth-token-store";
import { AuthStatus, MeResponse, StartResponse, VerifyResponse } from "../types";

const ACCESS_TOKEN_REFRESH_BUFFER_MS = 60_000;
const REFRESH_TOKEN_PERSIST_MAX_ATTEMPTS = 3;
const REFRESH_TOKEN_PERSIST_RETRY_DELAY_MS = 100;

type SessionListener = (status: AuthStatus, user: MeResponse | null) => void;

interface RefreshInFlight {
  epoch: number;
  promise: Promise<string | null>;
}

export class TokenPersistenceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "TokenPersistenceError";
  }
}

export class AuthSessionService {
  private status: AuthStatus = "initializing";
  private user: MeResponse | null = null;
  private accessToken: string | null = null;
  private accessTokenExpiresAt = 0;
  private sessionEpoch = 0;
  private refreshInFlight: RefreshInFlight | null = null;
  private restoreInFlight: Promise<void> | null = null;
  private storageQueue: Promise<unknown> = Promise.resolve();
  private listeners = new Set<SessionListener>();

  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly tokenStore: IAuthTokenStore,
  ) {}

  public getStatus(): AuthStatus {
    return this.status;
  }

  public getUser(): MeResponse | null {
    return this.user;
  }

  public subscribe(listener: SessionListener): () => void {
    this.listeners.add(listener);
    listener(this.status, this.user);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public async restore(): Promise<void> {
    if (this.restoreInFlight) {
      return this.restoreInFlight;
    }

    this.restoreInFlight = this.runRestore().finally(() => {
      this.restoreInFlight = null;
    });

    return this.restoreInFlight;
  }

  public async startChallenge(email: string): Promise<StartResponse> {
    return this.authRepository.start(email);
  }

  public async verify(challengeId: string, code: string): Promise<void> {
    const epoch = this.sessionEpoch;
    const tokens = await this.authRepository.verify(challengeId, code);
    const persisted = await this.persistTokens(tokens, epoch);
    if (!persisted) {
      return;
    }
    await this.finalizeSession(epoch);
  }

  public async getValidAccessToken(): Promise<string | null> {
    if (this.accessToken && this.isAccessTokenValid()) {
      return this.accessToken;
    }

    return this.refreshAccessToken();
  }

  /**
   * Called after an API responded 401 to `rejectedAccessToken`. Refreshes once
   * even when several requests fail with the same token. Ends the session only
   * when the refresh itself is rejected as expired; transient refresh failures
   * are rethrown and keep the session intact.
   */
  public async refreshAfterUnauthorized(
    rejectedAccessToken: string,
  ): Promise<string | null> {
    if (
      this.accessToken &&
      this.accessToken !== rejectedAccessToken &&
      this.isAccessTokenValid()
    ) {
      return this.accessToken;
    }

    if (this.accessToken === rejectedAccessToken) {
      this.accessTokenExpiresAt = 0;
    }

    return this.refreshAccessToken();
  }

  public async logout(): Promise<void> {
    try {
      const accessToken = await this.getValidAccessToken();
      if (accessToken) {
        await this.authRepository.logout(accessToken);
      }
    } catch {
      // Offline or transient failure: local logout only (server may not revoke).
    }

    await this.clearStoredSession();
  }

  public async revalidate(): Promise<void> {
    if (this.status === "unverified") {
      await this.restore();
      return;
    }

    if (this.status !== "authenticated") {
      return;
    }

    const epoch = this.sessionEpoch;
    try {
      const token = await this.getValidAccessToken();
      if (epoch !== this.sessionEpoch || !token) {
        // Session was superseded, or refresh already resolved the session
        // (e.g. transitioned to unauthenticated). Nothing more to do.
        return;
      }

      const profile = await this.loadUserProfile(token);
      this.setSessionIfCurrent(epoch, "authenticated", profile);
    } catch (error) {
      if (epoch !== this.sessionEpoch || !isSessionExpiredError(error)) {
        // Transient failure while re-validating on resume (from /me or from
        // refresh alike): keep the current authenticated state so the user is
        // not disrupted by a flaky network.
        return;
      }

      await this.endExpiredSession(epoch);
    }
  }

  private async runRestore(): Promise<void> {
    this.setSession("initializing", null);
    const epoch = this.sessionEpoch;

    try {
      let refreshToken: string | null;
      try {
        refreshToken = await this.withStorageLock(() =>
          this.tokenStore.getRefreshToken(),
        );
      } catch {
        this.setSessionIfCurrent(epoch, "unverified", null);
        return;
      }

      if (epoch !== this.sessionEpoch) {
        return;
      }

      if (!refreshToken) {
        this.clearSessionIfCurrent(epoch, "unauthenticated");
        return;
      }

      let token: string | null;
      try {
        token = await this.refreshAccessToken();
      } catch {
        this.setSessionIfCurrent(epoch, "unverified", null);
        return;
      }

      if (epoch !== this.sessionEpoch || !token) {
        return;
      }

      await this.finalizeSession(epoch);
    } catch {
      // Safety net: never leave the app stuck in "initializing" when an
      // unexpected failure escapes the targeted handlers above.
      this.setSessionIfCurrent(epoch, "unverified", null);
    }
  }

  private refreshAccessToken(): Promise<string | null> {
    const epoch = this.sessionEpoch;
    if (this.refreshInFlight && this.refreshInFlight.epoch === epoch) {
      return this.refreshInFlight.promise;
    }

    const promise = this.runRefresh(epoch).finally(() => {
      if (this.refreshInFlight?.promise === promise) {
        this.refreshInFlight = null;
      }
    });
    this.refreshInFlight = { epoch, promise };

    return promise;
  }

  private async runRefresh(epoch: number): Promise<string | null> {
    const refreshToken = await this.withStorageLock(() =>
      this.tokenStore.getRefreshToken(),
    );

    if (epoch !== this.sessionEpoch) {
      // A newer session superseded this one while reading storage.
      return null;
    }

    if (!refreshToken) {
      await this.endExpiredSession(epoch);
      return null;
    }

    try {
      const tokens = await this.authRepository.refresh(refreshToken);
      const persisted = await this.persistTokens(tokens, epoch);
      return persisted ? this.accessToken : null;
    } catch (error) {
      if (epoch !== this.sessionEpoch) {
        // A newer session took over while refreshing; do not touch its state.
        return null;
      }

      if (error instanceof TokenPersistenceError) {
        // The rotated token could not be stored and storage was already
        // best-effort cleared, so end the session cleanly instead of leaving a
        // consumed token that would trigger a replay on the next attempt.
        this.clearSessionIfCurrent(epoch, "unauthenticated");
        return null;
      }

      if (isSessionExpiredError(error)) {
        await this.endExpiredSession(epoch);
        return null;
      }

      throw error;
    }
  }

  /**
   * Returns false when the session was superseded and the tokens were
   * discarded instead of being committed.
   */
  private async persistTokens(
    tokens: VerifyResponse,
    epoch: number,
  ): Promise<boolean> {
    const stored = await this.persistRefreshTokenWithRetry(
      tokens.refreshToken,
      epoch,
    );
    if (!stored) {
      return false;
    }

    if (epoch !== this.sessionEpoch) {
      // Only remove the token this operation wrote; a newer session may have
      // already stored its own.
      await this.removeRefreshTokenIfStored(tokens.refreshToken).catch(() => {});
      return false;
    }

    this.accessToken = tokens.accessToken;
    this.accessTokenExpiresAt = Date.now() + tokens.expiresIn * 1000;
    return true;
  }

  private async persistRefreshTokenWithRetry(
    refreshToken: string,
    epoch: number,
  ): Promise<boolean> {
    let lastError: unknown;

    for (let attempt = 0; attempt < REFRESH_TOKEN_PERSIST_MAX_ATTEMPTS; attempt++) {
      try {
        return await this.withStorageLock(async () => {
          if (epoch !== this.sessionEpoch) {
            return false;
          }
          await this.tokenStore.setRefreshToken(refreshToken);
          return true;
        });
      } catch (error) {
        lastError = error;
        if (attempt < REFRESH_TOKEN_PERSIST_MAX_ATTEMPTS - 1) {
          await new Promise((resolve) =>
            setTimeout(resolve, REFRESH_TOKEN_PERSIST_RETRY_DELAY_MS),
          );
        }
      }
    }

    // The new (rotated) refresh token could not be stored. Any token of this
    // session still in storage is now consumed server-side, so leaving it would
    // trigger a replay detection on the next attempt. Best-effort clear it, but
    // never touch storage owned by a newer session.
    await this.withStorageLock(async () => {
      if (epoch === this.sessionEpoch) {
        await this.tokenStore.clearRefreshToken();
      }
    }).catch(() => {});

    throw new TokenPersistenceError(
      "Failed to persist refresh token.",
      lastError,
    );
  }

  private removeRefreshTokenIfStored(refreshToken: string): Promise<void> {
    return this.withStorageLock(async () => {
      if ((await this.tokenStore.getRefreshToken()) === refreshToken) {
        await this.tokenStore.clearRefreshToken();
      }
    });
  }

  private async finalizeSession(epoch: number): Promise<void> {
    try {
      const profile = await this.loadUserProfile();
      this.setSessionIfCurrent(epoch, "authenticated", profile);
    } catch (error) {
      if (epoch !== this.sessionEpoch) {
        return;
      }
      if (isSessionExpiredError(error)) {
        await this.endExpiredSession(epoch);
        return;
      }
      this.setSession("unverified", null);
    }
  }

  private async loadUserProfile(
    accessToken: string | null = this.accessToken,
  ): Promise<MeResponse> {
    if (!accessToken) {
      throw new AuthApiError("session_revoked", "Brak tokenu dostępu.");
    }

    try {
      return await this.authRepository.me(accessToken);
    } catch (error) {
      if (!(error instanceof AuthApiError) || error.httpStatus !== 401) {
        throw error;
      }

      const refreshedAccessToken = await this.refreshAccessToken();
      if (!refreshedAccessToken) {
        throw error;
      }

      return this.authRepository.me(refreshedAccessToken);
    }
  }

  private isAccessTokenValid(): boolean {
    return Date.now() < this.accessTokenExpiresAt - ACCESS_TOKEN_REFRESH_BUFFER_MS;
  }

  /**
   * Ends a session rejected by the server. When the stored token cannot be
   * deleted, falls back to "unverified" so the app never stays authenticated
   * or stuck in "initializing".
   */
  private async endExpiredSession(epoch: number): Promise<void> {
    try {
      await this.clearStoredSessionIfCurrent(epoch);
    } catch {
      this.setSessionIfCurrent(epoch, "unverified", null);
    }
  }

  private async clearStoredSession(): Promise<void> {
    await this.withStorageLock(() => this.clearStoredSessionUnlocked());
  }

  private async clearStoredSessionIfCurrent(epoch: number): Promise<boolean> {
    return this.withStorageLock(async () => {
      if (epoch !== this.sessionEpoch) {
        return false;
      }
      await this.clearStoredSessionUnlocked();
      return true;
    });
  }

  private async clearStoredSessionUnlocked(): Promise<void> {
    // Clear storage first so a failed delete aborts before we mutate the epoch
    // or in-memory state.
    await this.tokenStore.clearRefreshToken();
    this.resetInMemorySession();
    this.setSession("unauthenticated", null);
  }

  /**
   * Serializes token store access so check-then-act sequences (epoch check
   * plus write/delete) cannot interleave between sessions. Operations must not
   * call withStorageLock themselves, or the queue deadlocks.
   */
  private withStorageLock<T>(operation: () => Promise<T>): Promise<T> {
    const result = this.storageQueue.then(operation);
    this.storageQueue = result.catch(() => {});
    return result;
  }

  private resetInMemorySession(): void {
    this.sessionEpoch += 1;
    this.accessToken = null;
    this.accessTokenExpiresAt = 0;
    this.user = null;
  }

  private clearSession(status: AuthStatus): void {
    this.resetInMemorySession();
    this.setSession(status, null);
  }

  private clearSessionIfCurrent(epoch: number, status: AuthStatus): void {
    if (epoch !== this.sessionEpoch) {
      return;
    }
    this.clearSession(status);
  }

  private setSession(status: AuthStatus, user: MeResponse | null): void {
    this.status = status;
    this.user = user;
    this.listeners.forEach((listener) => listener(status, user));
  }

  private setSessionIfCurrent(
    epoch: number,
    status: AuthStatus,
    user: MeResponse | null,
  ): void {
    if (epoch !== this.sessionEpoch) {
      return;
    }
    this.setSession(status, user);
  }
}

import { AuthApiError } from "../api/auth-errors";
import { IAuthRepository } from "../api/auth-repository";
import { IAuthTokenStore } from "../storage/auth-token-store";
import {
  AuthSessionService,
  TokenPersistenceError,
} from "./auth-session.service";

class MemoryTokenStore implements IAuthTokenStore {
  private value: string | null = null;

  public async getRefreshToken(): Promise<string | null> {
    return this.value;
  }

  public async setRefreshToken(token: string): Promise<void> {
    this.value = token;
  }

  public async clearRefreshToken(): Promise<void> {
    this.value = null;
  }
}

class FailingTokenStore implements IAuthTokenStore {
  private value: string | null = null;
  public failGet = false;
  public failSet = false;
  public failClear = false;

  public async getRefreshToken(): Promise<string | null> {
    if (this.failGet) {
      throw new Error("SecureStore read failed");
    }
    return this.value;
  }

  public async setRefreshToken(token: string): Promise<void> {
    if (this.failSet) {
      throw new Error("SecureStore write failed");
    }
    this.value = token;
  }

  public async clearRefreshToken(): Promise<void> {
    if (this.failClear) {
      throw new Error("SecureStore delete failed");
    }
    this.value = null;
  }
}

function createDeferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

function createProfile(id = "user-1") {
  return {
    id,
    status: "university_email_verified",
    emailVerifiedAt: new Date().toISOString(),
    lastReverifiedAt: new Date().toISOString(),
  };
}

function expireAccessToken(service: AuthSessionService) {
  (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
    Date.now() - 1000;
}

function supersedeSession(service: AuthSessionService) {
  (service as unknown as { sessionEpoch: number }).sessionEpoch += 1;
}

class ControlledTokenStore implements IAuthTokenStore {
  private value: string | null = null;
  public failingTokens = new Set<string>();
  private heldSet: {
    started: ReturnType<typeof createDeferred>;
    release: ReturnType<typeof createDeferred>;
  } | null = null;

  public holdNextSet() {
    const hold = { started: createDeferred(), release: createDeferred() };
    this.heldSet = hold;
    return {
      started: hold.started.promise,
      release: () => hold.release.resolve(),
    };
  }

  public async getRefreshToken(): Promise<string | null> {
    return this.value;
  }

  public async setRefreshToken(token: string): Promise<void> {
    const hold = this.heldSet;
    if (hold) {
      this.heldSet = null;
      hold.started.resolve();
      await hold.release.promise;
    }
    if (this.failingTokens.has(token)) {
      throw new Error("SecureStore write failed");
    }
    this.value = token;
  }

  public async clearRefreshToken(): Promise<void> {
    this.value = null;
  }
}

function createSequencedRepository() {
  let verifyCalls = 0;
  let meGate: ReturnType<typeof createDeferred> | null = null;
  let meStarted: ReturnType<typeof createDeferred> | null = null;

  const repository: IAuthRepository = {
    async start() {
      return { challengeId: "c", expiresIn: 600, message: "ok" };
    },
    async verify() {
      verifyCalls += 1;
      return {
        accessToken: `access-v${verifyCalls}`,
        refreshToken: `refresh-v${verifyCalls}`,
        expiresIn: 900,
      };
    },
    async refresh() {
      return {
        accessToken: "access-old",
        refreshToken: "refresh-old",
        expiresIn: 900,
      };
    },
    async me() {
      const gate = meGate;
      if (gate) {
        meGate = null;
        meStarted?.resolve();
        await gate.promise;
      }
      return createProfile(`user-v${verifyCalls}`);
    },
    async logout() {},
  };

  return {
    repository,
    holdNextMe() {
      const gate = createDeferred();
      const started = createDeferred();
      meGate = gate;
      meStarted = started;
      return { started: started.promise, release: () => gate.resolve() };
    },
  };
}

class TestAuthRepository implements IAuthRepository {
  public refreshCalls = 0;
  public logoutCalls = 0;
  public lastLogoutAccessToken: string | null = null;
  public nextRefreshError: AuthApiError | null = null;
  public nextMeError: AuthApiError | null = null;
  private currentRefreshToken = "refresh-1";
  private usedRefreshTokens = new Set<string>();

  public async start() {
    return {
      challengeId: "challenge-1",
      expiresIn: 600,
      message: "ok",
    };
  }

  public async verify() {
    return {
      accessToken: "access-1",
      refreshToken: this.currentRefreshToken,
      expiresIn: 900,
    };
  }

  public async refresh(refreshToken: string) {
    this.refreshCalls += 1;

    if (this.nextRefreshError) {
      const error = this.nextRefreshError;
      this.nextRefreshError = null;
      throw error;
    }

    if (this.usedRefreshTokens.has(refreshToken)) {
      throw new AuthApiError("refresh_token_replay", "Replay detected");
    }

    if (refreshToken !== this.currentRefreshToken) {
      throw new AuthApiError("invalid_refresh_token", "Invalid refresh token");
    }

    this.usedRefreshTokens.add(refreshToken);
    this.currentRefreshToken = `refresh-${this.refreshCalls + 1}`;

    return {
      accessToken: `access-${this.refreshCalls + 1}`,
      refreshToken: this.currentRefreshToken,
      expiresIn: 900,
    };
  }

  public async me() {
    if (this.nextMeError) {
      const error = this.nextMeError;
      this.nextMeError = null;
      throw error;
    }

    return {
      id: "user-1",
      status: "university_email_verified",
      emailVerifiedAt: new Date().toISOString(),
      lastReverifiedAt: new Date().toISOString(),
    };
  }

  public async logout(accessToken: string) {
    this.logoutCalls += 1;
    this.lastLogoutAccessToken = accessToken;
  }
}

describe("AuthSessionService", () => {
  it("uses single-flight refresh for concurrent token requests", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;

    const [first, second] = await Promise.all([
      service.getValidAccessToken(),
      service.getValidAccessToken(),
    ]);

    expect(first).toBe("access-2");
    expect(second).toBe("access-2");
    expect(repository.refreshCalls).toBe(1);
    expect(await tokenStore.getRefreshToken()).toBe("refresh-2");
  });

  it("rotates refresh token on every refresh", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;

    await service.getValidAccessToken();
    const firstStoredRefresh = await tokenStore.getRefreshToken();

    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;

    await service.getValidAccessToken();
    const secondStoredRefresh = await tokenStore.getRefreshToken();

    expect(firstStoredRefresh).toBe("refresh-2");
    expect(secondStoredRefresh).toBe("refresh-3");
    expect(firstStoredRefresh).not.toBe(secondStoredRefresh);
  });

  it("clears session when refresh token replay is detected", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    const staleRefreshToken = await tokenStore.getRefreshToken();

    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;

    await service.getValidAccessToken();

    await tokenStore.setRefreshToken(staleRefreshToken!);
    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;

    const token = await service.getValidAccessToken();

    expect(token).toBeNull();
    expect(service.getStatus()).toBe("unauthenticated");
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });

  it("A1: keeps refresh token and sets unverified on transient restore failure", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await tokenStore.setRefreshToken("refresh-1");
    repository.nextRefreshError = new AuthApiError(
      "network_error",
      "Network error",
    );

    await service.restore();

    expect(service.getStatus()).toBe("unverified");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-1");

    await service.restore();

    expect(service.getStatus()).toBe("authenticated");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-3");
    expect(repository.refreshCalls).toBe(2);
  });

  it("A2: keeps rotated refresh token when /me fails transiently during restore", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await tokenStore.setRefreshToken("refresh-1");
    repository.nextMeError = new AuthApiError("unknown", "Service unavailable", 503);

    await service.restore();

    expect(service.getStatus()).toBe("unverified");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-2");
    expect(repository.refreshCalls).toBe(1);
  });

  it("A3: clears session on permanent refresh rejection during restore", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await tokenStore.setRefreshToken("refresh-1");
    repository.nextRefreshError = new AuthApiError(
      "invalid_refresh_token",
      "Invalid refresh token",
    );

    await service.restore();

    expect(service.getStatus()).toBe("unauthenticated");
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });

  it("A4: logout refreshes access token before server revoke", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;

    await service.logout();

    expect(repository.refreshCalls).toBe(1);
    expect(repository.logoutCalls).toBe(1);
    expect(repository.lastLogoutAccessToken).toBe("access-2");
    expect(service.getStatus()).toBe("unauthenticated");
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });

  it("A4b: logout clears locally when refresh fails offline", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;
    repository.nextRefreshError = new AuthApiError(
      "network_error",
      "Network error",
    );

    await service.logout();

    expect(repository.logoutCalls).toBe(0);
    expect(service.getStatus()).toBe("unauthenticated");
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });

  it("sets unverified after verify when /me fails transiently without reusing challenge", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    repository.nextMeError = new AuthApiError("network_error", "Network error");

    await expect(service.verify("challenge-1", "123456")).resolves.toBeUndefined();

    expect(service.getStatus()).toBe("unverified");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-1");
    expect(
      (service as unknown as { accessToken: string | null }).accessToken,
    ).toBe("access-1");
  });

  it("does not update in-memory access token when refresh token persist fails", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new FailingTokenStore();
    tokenStore.failSet = true;
    const service = new AuthSessionService(repository, tokenStore);

    await expect(service.verify("challenge-1", "123456")).rejects.toBeInstanceOf(
      TokenPersistenceError,
    );

    expect(
      (service as unknown as { accessToken: string | null }).accessToken,
    ).toBeNull();
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });

  it("rejects logout when secure storage delete fails and keeps session", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new FailingTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    tokenStore.failClear = true;

    await expect(service.logout()).rejects.toThrow("SecureStore delete failed");

    expect(service.getStatus()).toBe("authenticated");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-1");
    expect(repository.logoutCalls).toBe(1);
  });

  it("sets unverified when refresh token read fails during restore", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new FailingTokenStore();
    await tokenStore.setRefreshToken("refresh-1");
    tokenStore.failGet = true;
    const service = new AuthSessionService(repository, tokenStore);

    await service.restore();

    expect(service.getStatus()).toBe("unverified");
    tokenStore.failGet = false;
    expect(await tokenStore.getRefreshToken()).toBe("refresh-1");
    expect(repository.refreshCalls).toBe(0);
  });

  it("A5: clears storage and ends unauthenticated when rotated token cannot be persisted (no replay on retry)", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new FailingTokenStore();
    await tokenStore.setRefreshToken("refresh-1");
    tokenStore.failSet = true;
    const service = new AuthSessionService(repository, tokenStore);

    await service.restore();

    expect(service.getStatus()).toBe("unauthenticated");
    expect(await tokenStore.getRefreshToken()).toBeNull();
    // The consumed token was cleared, so a retry cannot replay it.
    expect(repository.refreshCalls).toBe(1);
  });

  it("A6: restore ends unverified (not stuck initializing) when /me is session-expired and token delete fails", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new FailingTokenStore();
    await tokenStore.setRefreshToken("refresh-1");
    tokenStore.failClear = true;
    repository.nextMeError = new AuthApiError(
      "session_revoked",
      "Session revoked",
    );
    const service = new AuthSessionService(repository, tokenStore);

    await service.restore();

    expect(service.getStatus()).toBe("unverified");
    expect(service.getStatus()).not.toBe("initializing");
  });

  it("A7: a late refresh resolving after a newer session does not change state or delete the newer token", async () => {
    const tokenStore = new MemoryTokenStore();
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    let signalRefreshStarted!: () => void;
    const refreshStarted = new Promise<void>((resolve) => {
      signalRefreshStarted = resolve;
    });
    let refreshCalls = 0;

    const repository: IAuthRepository = {
      async start() {
        return { challengeId: "c", expiresIn: 600, message: "ok" };
      },
      async verify() {
        return {
          accessToken: "access-A",
          refreshToken: "refresh-A",
          expiresIn: 900,
        };
      },
      async refresh() {
        refreshCalls += 1;
        signalRefreshStarted();
        await refreshGate;
        throw new AuthApiError("invalid_refresh_token", "Expired");
      },
      async me() {
        return {
          id: "u",
          status: "university_email_verified",
          emailVerifiedAt: new Date().toISOString(),
          lastReverifiedAt: new Date().toISOString(),
        };
      },
      async logout() {},
    };

    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("c", "123456");
    expect(service.getStatus()).toBe("authenticated");

    (service as unknown as { accessTokenExpiresAt: number }).accessTokenExpiresAt =
      Date.now() - 1000;

    // Start a refresh that blocks on the gate (session A).
    const stalePromise = service.getValidAccessToken();

    // Wait until the refresh is actually in flight (past the read-time guard).
    await refreshStarted;

    // A newer session takes over while the stale refresh is still in flight.
    (service as unknown as { sessionEpoch: number }).sessionEpoch += 1;
    await tokenStore.setRefreshToken("refresh-B");

    // The stale refresh now resolves (and fails as session-expired).
    releaseRefresh();
    const result = await stalePromise;

    expect(result).toBeNull();
    expect(refreshCalls).toBe(1);
    // The stale operation must not have deleted the newer session's token...
    expect(await tokenStore.getRefreshToken()).toBe("refresh-B");
    // ...nor overwritten the current state.
    expect(service.getStatus()).toBe("authenticated");
  });

  it("A8: a late token write of an older session does not delete the newer session token", async () => {
    const tokenStore = new ControlledTokenStore();
    const { repository } = createSequencedRepository();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("c", "111111");
    expireAccessToken(service);

    const heldWrite = tokenStore.holdNextSet();
    const staleRefresh = service.getValidAccessToken();
    await heldWrite.started;

    supersedeSession(service);
    const newerVerify = service.verify("c2", "222222");

    heldWrite.release();
    const [staleResult] = await Promise.all([staleRefresh, newerVerify]);

    expect(staleResult).toBeNull();
    expect(await tokenStore.getRefreshToken()).toBe("refresh-v2");
    expect(service.getStatus()).toBe("authenticated");
    expect(service.getUser()?.id).toBe("user-v2");
  });

  it("A9: a failed token write of an older session does not clear the newer session token", async () => {
    const tokenStore = new ControlledTokenStore();
    tokenStore.failingTokens.add("refresh-old");
    const { repository } = createSequencedRepository();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("c", "111111");
    expireAccessToken(service);

    const heldWrite = tokenStore.holdNextSet();
    const staleRefresh = service.getValidAccessToken();
    await heldWrite.started;

    supersedeSession(service);
    const newerVerify = service.verify("c2", "222222");

    heldWrite.release();
    const [staleResult] = await Promise.all([staleRefresh, newerVerify]);

    expect(staleResult).toBeNull();
    expect(await tokenStore.getRefreshToken()).toBe("refresh-v2");
    expect(service.getStatus()).toBe("authenticated");
  });

  it("A10: a late /me response during revalidate does not restore the profile after logout", async () => {
    const tokenStore = new MemoryTokenStore();
    const { repository, holdNextMe } = createSequencedRepository();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("c", "111111");

    const heldMe = holdNextMe();
    const revalidation = service.revalidate();
    await heldMe.started;

    await service.logout();
    heldMe.release();
    await revalidation;

    expect(service.getStatus()).toBe("unauthenticated");
    expect(service.getUser()).toBeNull();
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });

  it("R1: revalidate keeps the session when /me is offline with a valid access token", async () => {
    const repository = new TestAuthRepository();
    const service = new AuthSessionService(repository, new MemoryTokenStore());

    await service.verify("challenge-1", "123456");
    repository.nextMeError = new AuthApiError("network_error", "Network error");

    await service.revalidate();

    expect(service.getStatus()).toBe("authenticated");
    expect(service.getUser()?.id).toBe("user-1");
  });

  it("R2: revalidate keeps the session when refresh is offline", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    expireAccessToken(service);
    repository.nextRefreshError = new AuthApiError("network_error", "Network error");

    await service.revalidate();

    expect(service.getStatus()).toBe("authenticated");
    expect(service.getUser()?.id).toBe("user-1");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-1");
  });

  it("U1: refreshAfterUnauthorized rotates the rejected access token", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");

    const token = await service.refreshAfterUnauthorized("access-1");

    expect(token).toBe("access-2");
    expect(repository.refreshCalls).toBe(1);
    expect(service.getStatus()).toBe("authenticated");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-2");
  });

  it("U2: refreshAfterUnauthorized reuses a token already refreshed by another request", async () => {
    const repository = new TestAuthRepository();
    const service = new AuthSessionService(repository, new MemoryTokenStore());

    await service.verify("challenge-1", "123456");

    const [first, second] = await Promise.all([
      service.refreshAfterUnauthorized("access-1"),
      service.refreshAfterUnauthorized("access-1"),
    ]);
    const late = await service.refreshAfterUnauthorized("access-1");

    expect(first).toBe("access-2");
    expect(second).toBe("access-2");
    expect(late).toBe("access-2");
    expect(repository.refreshCalls).toBe(1);
  });

  it("U3: refreshAfterUnauthorized keeps the session on a transient refresh failure", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    repository.nextRefreshError = new AuthApiError(
      "network_error",
      "Server error",
      500,
    );

    await expect(service.refreshAfterUnauthorized("access-1")).rejects.toThrow(
      "Server error",
    );

    expect(service.getStatus()).toBe("authenticated");
    expect(await tokenStore.getRefreshToken()).toBe("refresh-1");
  });

  it("U4: refreshAfterUnauthorized ends the session when refresh is rejected", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    repository.nextRefreshError = new AuthApiError(
      "session_revoked",
      "Unauthorized",
      401,
    );

    const token = await service.refreshAfterUnauthorized("access-1");

    expect(token).toBeNull();
    expect(service.getStatus()).toBe("unauthenticated");
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });

  it("R3: revalidate ends the session when the server revokes it", async () => {
    const repository = new TestAuthRepository();
    const tokenStore = new MemoryTokenStore();
    const service = new AuthSessionService(repository, tokenStore);

    await service.verify("challenge-1", "123456");
    repository.nextMeError = new AuthApiError("session_revoked", "Session revoked");

    await service.revalidate();

    expect(service.getStatus()).toBe("unauthenticated");
    expect(service.getUser()).toBeNull();
    expect(await tokenStore.getRefreshToken()).toBeNull();
  });
});

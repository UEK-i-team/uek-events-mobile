import { AuthApiError } from "./auth-errors";
import { IAuthRepository } from "./auth-repository";
import {
  MeResponse,
  RefreshResponse,
  StartResponse,
  VerifyResponse,
} from "../types";

const MOCK_CODE = "123456";
const MOCK_REFRESH_TOKEN = "mock-refresh-token";
const MOCK_ACCESS_TOKEN = "mock-access-token";

export class AuthRepositoryMock implements IAuthRepository {
  private challengeCounter = 0;
  private activeChallengeId: string | null = null;
  private storedRefreshToken: string | null = null;

  public async start(email: string): Promise<StartResponse> {
    if (!email.includes("@")) {
      throw new AuthApiError("validation_error", "Podaj poprawny adres e-mail.");
    }

    if (!email.endsWith("@student.uek.krakow.pl")) {
      return {
        message:
          "Jeśli adres może zostać użyty do logowania, wysłaliśmy na niego kod.",
      };
    }

    this.challengeCounter += 1;
    this.activeChallengeId = `mock-challenge-${this.challengeCounter}`;

    return {
      challengeId: this.activeChallengeId,
      expiresIn: 600,
      message:
        "Jeśli adres może zostać użyty do logowania, wysłaliśmy na niego kod.",
    };
  }

  public async verify(
    challengeId: string,
    code: string,
  ): Promise<VerifyResponse> {
    if (challengeId !== this.activeChallengeId) {
      throw new AuthApiError("invalid_challenge", "Invalid challenge");
    }

    if (code !== MOCK_CODE) {
      throw new AuthApiError("invalid_code", "Invalid code");
    }

    this.storedRefreshToken = `${MOCK_REFRESH_TOKEN}-${Date.now()}`;

    return {
      accessToken: `${MOCK_ACCESS_TOKEN}-${Date.now()}`,
      refreshToken: this.storedRefreshToken,
      expiresIn: 900,
    };
  }

  public async refresh(refreshToken: string): Promise<RefreshResponse> {
    if (!this.storedRefreshToken || refreshToken !== this.storedRefreshToken) {
      throw new AuthApiError("invalid_refresh_token", "Invalid refresh token");
    }

    this.storedRefreshToken = `${MOCK_REFRESH_TOKEN}-${Date.now()}`;

    return {
      accessToken: `${MOCK_ACCESS_TOKEN}-${Date.now()}`,
      refreshToken: this.storedRefreshToken,
      expiresIn: 900,
    };
  }

  public async me(_accessToken: string): Promise<MeResponse> {
    return {
      id: "mock-user-id",
      status: "university_email_verified",
      emailVerifiedAt: new Date().toISOString(),
      lastReverifiedAt: new Date().toISOString(),
    };
  }

  public async logout(_accessToken: string): Promise<void> {
    this.storedRefreshToken = null;
    this.activeChallengeId = null;
  }
}

import { SecureStorageService } from "@/shared/storage/secure-storage-service/secure-storage-service";

const REFRESH_TOKEN_KEY = "auth_refresh_token";

export interface IAuthTokenStore {
  getRefreshToken(): Promise<string | null>;
  setRefreshToken(token: string): Promise<void>;
  clearRefreshToken(): Promise<void>;
}

export class SecureAuthTokenStore implements IAuthTokenStore {
  private readonly storage = new SecureStorageService(REFRESH_TOKEN_KEY);

  public async getRefreshToken(): Promise<string | null> {
    return this.storage.get();
  }

  public async setRefreshToken(token: string): Promise<void> {
    await this.storage.set(token);
  }

  public async clearRefreshToken(): Promise<void> {
    await this.storage.remove();
  }
}

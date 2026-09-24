import * as SecureStore from "expo-secure-store";

export class SecureStorageService {
  constructor(private readonly storageKey: string) {}

  public async get(): Promise<string | null> {
    return SecureStore.getItemAsync(this.storageKey);
  }

  public async set(value: string): Promise<void> {
    await SecureStore.setItemAsync(this.storageKey, value);
  }

  public async remove(): Promise<void> {
    await SecureStore.deleteItemAsync(this.storageKey);
  }
}

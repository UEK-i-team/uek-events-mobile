import AsyncStorage from "@react-native-async-storage/async-storage";

export class AsyncStorageService<T> {
  constructor(private readonly storageKey: string) {}

  public async get(): Promise<T | null> {
    try {
      const jsonString = await AsyncStorage.getItem(this.storageKey);

      if (jsonString === null) return null;

      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(
        `Error reading from AsyncStorage [${this.storageKey}]:`,
        error,
      );
      return null;
    }
  }

  public async set(data: T): Promise<void> {
    try {
      const jsonString = JSON.stringify(data);
      await AsyncStorage.setItem(this.storageKey, jsonString);
    } catch (error) {
      console.error(
        `Error writing to AsyncStorage [${this.storageKey}]:`,
        error,
      );
      throw error;
    }
  }

  public async remove(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(
        `Error removing from AsyncStorage [${this.storageKey}]:`,
        error,
      );
      throw error;
    }
  }

  public async exists(): Promise<boolean> {
    try {
      const value = await AsyncStorage.getItem(this.storageKey);
      return value !== null;
    } catch (error) {
      console.error(`Error checking AsyncStorage [${this.storageKey}]:`, error);
      return false;
    }
  }
}

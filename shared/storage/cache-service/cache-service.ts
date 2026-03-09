import * as FileSystem from "expo-file-system/legacy";

export class CacheService {
  private readonly cacheDir: string;

  constructor() {
    this.cacheDir = `${FileSystem.documentDirectory}cache/`;
    this.initializeCacheDirectory();
  }

  private async initializeCacheDirectory(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, {
          intermediates: true,
        });
      }
    } catch (error) {
      console.error("Błąd inicjalizacji katalogu cache:", error);
    }
  }

  public async set<T>(fileName: string, data: T): Promise<void> {
    try {
      await this.initializeCacheDirectory();
      const filePath = `${this.cacheDir}${fileName}`;
      const jsonString = JSON.stringify(data);

      await FileSystem.writeAsStringAsync(filePath, jsonString, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      console.error(`Błąd zapisu pliku ${fileName}:`, error);
      throw error;
    }
  }

  public async get<T>(fileName: string): Promise<T | null> {
    try {
      const filePath = `${this.cacheDir}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (!fileInfo.exists) return null;

      const jsonString = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error(`Błąd odczytu pliku ${fileName}:`, error);
      return null;
    }
  }

  public async remove(fileName: string): Promise<void> {
    try {
      const filePath = `${this.cacheDir}${fileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath);
      }
    } catch (error) {
      console.error(`Błąd usuwania pliku ${fileName}:`, error);
      throw error;
    }
  }

  public async getFileInfo(fileName: string) {
    const filePath = `${this.cacheDir}${fileName}`;
    return await FileSystem.getInfoAsync(filePath);
  }
}

// Globalna instancja dysku
export const cacheService = new CacheService();

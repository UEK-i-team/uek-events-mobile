import type { Event } from '@/shared/types/event';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Cache Service - zarządza zapisywaniem i odczytywaniem danych z pamięci urządzenia
 * Używa Expo FileSystem do przechowywania większych ilości danych
 */
export class CacheService {
  private static instance: CacheService;
  private readonly cacheDir: string;
  private readonly eventsFileName = 'events-cache.json';
  private readonly metadataFileName = 'cache-metadata.json';

  private constructor() {
    // Ścieżka do katalogu cache w pamięci urządzenia
    this.cacheDir = `${FileSystem.documentDirectory}cache/`;
    this.initializeCacheDirectory();
  }

  /**
   * Singleton pattern - jedna instancja dla całej aplikacji
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Inicjalizacja katalogu cache (jeśli nie istnieje)
   */
  private async initializeCacheDirectory(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
        console.log('📁 Cache directory created:', this.cacheDir);
      }
    } catch (error) {
      console.error('Error initializing cache directory:', error);
    }
  }

  /**
   * Zapisz eventy w pamięci urządzenia
   * @param events - Tablica eventów do zapisania
   */
  public async saveEvents(events: Event[]): Promise<void> {
    try {
      await this.ensureCacheDirectory();

      const filePath = `${this.cacheDir}${this.eventsFileName}`;
      const data = JSON.stringify(events, null, 2);
      
      await FileSystem.writeAsStringAsync(filePath, data, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Zapisz metadata (czas cache'owania)
      await this.saveMetadata({
        lastCached: Date.now(),
        eventsCount: events.length,
      });

      console.log(`💾 Saved ${events.length} events to cache`);
    } catch (error) {
      console.error('Error saving events to cache:', error);
      throw error;
    }
  }

  /**
   * Odczytaj eventy z pamięci urządzenia
   * @returns Tablica eventów lub null jeśli nie ma cache
   */
  public async getEvents(): Promise<Event[] | null> {
    try {
      const filePath = `${this.cacheDir}${this.eventsFileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (!fileInfo.exists) {
        console.log('📭 No cached events found');
        return null;
      }

      const data = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      const events: Event[] = JSON.parse(data);
      console.log(`📂 Loaded ${events.length} events from cache`);
      
      return events;
    } catch (error) {
      console.error('Error reading events from cache:', error);
      return null;
    }
  }

  /**
   * Dodaj nowe eventy do istniejącego cache (bez duplikatów)
   * @param newEvents - Nowe eventy do dodania
   */
  public async appendEvents(newEvents: Event[]): Promise<void> {
    try {
      const existingEvents = await this.getEvents() || [];
      
      // Utwórz Set z ID istniejących eventów dla szybkiego sprawdzania
      const existingIds = new Set(existingEvents.map(e => e.id));
      
      // Dodaj tylko nowe eventy (bez duplikatów)
      const uniqueNewEvents = newEvents.filter(event => !existingIds.has(event.id));
      
      if (uniqueNewEvents.length > 0) {
        const allEvents = [...existingEvents, ...uniqueNewEvents];
        await this.saveEvents(allEvents);
        console.log(`➕ Added ${uniqueNewEvents.length} new events to cache`);
      } else {
        console.log('ℹ️ No new events to add (all already cached)');
      }
    } catch (error) {
      console.error('Error appending events to cache:', error);
      throw error;
    }
  }

  /**
   * Zapisz metadata cache
   */
  private async saveMetadata(metadata: CacheMetadata): Promise<void> {
    try {
      const filePath = `${this.cacheDir}${this.metadataFileName}`;
      const data = JSON.stringify(metadata, null, 2);
      
      await FileSystem.writeAsStringAsync(filePath, data, {
        encoding: FileSystem.EncodingType.UTF8,
      });
    } catch (error) {
      console.error('Error saving cache metadata:', error);
    }
  }

  /**
   * Odczytaj metadata cache
   */
  public async getMetadata(): Promise<CacheMetadata | null> {
    try {
      const filePath = `${this.cacheDir}${this.metadataFileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (!fileInfo.exists) {
        return null;
      }

      const data = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading cache metadata:', error);
      return null;
    }
  }

  /**
   * Wyczyść cache eventów
   */
  public async clearEventsCache(): Promise<void> {
    try {
      const filePath = `${this.cacheDir}${this.eventsFileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(filePath);
        console.log('🗑️ Events cache cleared');
      }

      // Wyczyść również metadata
      const metadataPath = `${this.cacheDir}${this.metadataFileName}`;
      const metadataInfo = await FileSystem.getInfoAsync(metadataPath);
      if (metadataInfo.exists) {
        await FileSystem.deleteAsync(metadataPath);
      }
    } catch (error) {
      console.error('Error clearing events cache:', error);
      throw error;
    }
  }

  /**
   * Sprawdź czy cache jest świeży (młodszy niż podany czas w ms)
   * @param maxAge - Maksymalny wiek cache w milisekundach (domyślnie 1 godzina)
   */
  public async isCacheFresh(maxAge: number = 60 * 60 * 1000): Promise<boolean> {
    try {
      const metadata = await this.getMetadata();
      
      if (!metadata) {
        return false;
      }

      const age = Date.now() - metadata.lastCached;
      return age < maxAge;
    } catch (error) {
      console.error('Error checking cache freshness:', error);
      return false;
    }
  }

  /**
   * Upewnij się, że katalog cache istnieje
   */
  private async ensureCacheDirectory(): Promise<void> {
    try {
      const dirInfo = await FileSystem.getInfoAsync(this.cacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(this.cacheDir, { intermediates: true });
      }
    } catch (error) {
      console.error('Error ensuring cache directory exists:', error);
      throw error;
    }
  }

  /**
   * Pobierz datę najnowszego eventu z cache (createdAt)
   * @returns ISO 8601 timestamp najnowszego eventu lub null jeśli brak
   */
  public async getNewestEventDate(): Promise<string | null> {
    try {
      const events = await this.getEvents();
      
      if (!events || events.length === 0) {
        return null;
      }

      // Znajdź najnowszy event po createdAt
      const eventsWithDates = events.filter(e => e.createdAt);
      
      if (eventsWithDates.length === 0) {
        return null;
      }

      // Sortuj po createdAt descending i weź pierwszy
      const newest = eventsWithDates.sort((a, b) => {
        const dateA = new Date(a.createdAt!).getTime();
        const dateB = new Date(b.createdAt!).getTime();
        return dateB - dateA;
      })[0];

      return newest.createdAt || null;
    } catch (error) {
      console.error('Error getting newest event date:', error);
      return null;
    }
  }

  /**
   * Pobierz informacje o rozmiarze cache
   */
  public async getCacheInfo(): Promise<CacheInfo> {
    try {
      const filePath = `${this.cacheDir}${this.eventsFileName}`;
      const fileInfo = await FileSystem.getInfoAsync(filePath);
      const metadata = await this.getMetadata();

      if (!fileInfo.exists) {
        return {
          exists: false,
          size: 0,
          eventsCount: 0,
          lastCached: null,
        };
      }

      return {
        exists: true,
        size: fileInfo.size || 0,
        eventsCount: metadata?.eventsCount || 0,
        lastCached: metadata?.lastCached || null,
      };
    } catch (error) {
      console.error('Error getting cache info:', error);
      return {
        exists: false,
        size: 0,
        eventsCount: 0,
        lastCached: null,
      };
    }
  }
}

/**
 * Metadata przechowywana w cache
 */
interface CacheMetadata {
  lastCached: number;
  eventsCount: number;
}

/**
 * Informacje o cache
 */
interface CacheInfo {
  exists: boolean;
  size: number;
  eventsCount: number;
  lastCached: number | null;
}

// Export instancji singleton
export const cacheService = CacheService.getInstance();


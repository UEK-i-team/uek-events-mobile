import { HttpConnector } from '../http-connector';
import { EventMapper } from '../mappers/event-mapper';
import { cacheService } from '../services/cache-service';
import type { Event, IEventsRepository } from '../types';
import type { ApiEventsResponse } from '../types/api-types';

/**
 * Events Repository - klasa do komunikacji z endpointem eventów
 * Z automatycznym cache'owaniem w pamięci urządzenia
 */
export class EventsRepository extends HttpConnector implements IEventsRepository {
  private static instance: EventsRepository;

  private constructor() {
    // Pobierz URL z .env lub użyj domyślnego
    const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.uek-events.com';

    super(baseURL, {
      maxRetries: 3,
      retryDelay: 1000,
    });
  }

  /**
   * Singleton pattern - jedna instancja dla całej aplikacji
   */
  public static getInstance(): EventsRepository {
    if (!EventsRepository.instance) {
      EventsRepository.instance = new EventsRepository();
    }
    return EventsRepository.instance;
  }

  /**
   * Pobieranie eventów z opcjonalnym filtrem since
   * Z automatycznym cache'owaniem w pamięci urządzenia
   * @param since - ISO 8601 timestamp (np. '2024-11-22T10:30:00Z') - pobierz tylko nowsze eventy
   * @param useCache - Czy użyć cache przy braku połączenia (domyślnie true)
   */
  public async getEvents(
    since?: string | null,
    useCache: boolean = true
  ): Promise<Event[]> {
    try {
      let url = 'api/events';
      
      // Dodaj query param jeśli since jest podane
      if (since) {
        url += `?since=${encodeURIComponent(since)}`;
      }
      
      // Pobierz dane z API w formacie ApiEventsResponse
      const response = await this.get<ApiEventsResponse>(url);
      const apiResponse = response.data;
      
      // Sprawdź czy są jakieś dane
      if (apiResponse.count === 0 || !apiResponse.data || apiResponse.data.length === 0) {
        console.log('ℹ️ No new events from API');
        
        // Jeśli to odświeżanie (z since), zwróć pustą tablicę
        if (since) {
          return [];
        }
        
        // Jeśli to pierwsze pobranie, spróbuj załadować z cache
        if (useCache) {
          const cachedEvents = await cacheService.getEvents();
          if (cachedEvents && cachedEvents.length > 0) {
            console.log('📦 No new events, returning cache');
            return cachedEvents;
          }
        }
        
        return [];
      }
      
      // Konwertuj ApiEvent[] na Event[] używając mappera
      const events = EventMapper.toEvents(apiResponse.data);
      console.log(`✅ Fetched ${events.length} events from API`);
      
      // Zapisz pobrane eventy w cache
      if (events.length > 0) {
        if (since) {
          // Jeśli to odświeżanie (z since), dodaj do istniejącego cache
          await cacheService.appendEvents(events);
          console.log(`➕ Added ${events.length} new events to cache`);
        } else {
          // Jeśli to pierwsze pobranie, zapisz wszystko
          await cacheService.saveEvents(events);
          console.log(`💾 Saved ${events.length} events to cache`);
        }
      }
      
      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      
      // Jeśli nie ma połączenia i cache jest włączony, spróbuj użyć cache
      if (useCache && !since) {
        console.log('📱 Trying to load events from cache...');
        const cachedEvents = await cacheService.getEvents();
        
        if (cachedEvents && cachedEvents.length > 0) {
          console.log('✅ Loaded events from cache successfully');
          return cachedEvents;
        }
      }
      
      throw error;
    }
  }

  /**
   * Wyczyść cache eventów
   */
  public async clearCache(): Promise<void> {
    await cacheService.clearEventsCache();
  }

  /**
   * Pobierz informacje o cache
   */
  public async getCacheInfo() {
    return await cacheService.getCacheInfo();
  }
}

// Export instancji singleton
export const eventsRepository = EventsRepository.getInstance();


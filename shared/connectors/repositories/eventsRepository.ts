import { HttpConnector } from '../http-connector';
import type { Event, IEventsRepository } from '../types';

/**
 * Events Repository - klasa do komunikacji z endpointem eventów
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
   * Pobieranie eventów z opcjonalnym filtrem lastEventDate
   * @param lastEventDate - Timestamp ostatniego eventu lub null
   */
  public async getEvents(lastEventDate?: number | null): Promise<Event[]> {
    try {
      let url = '/events';
      
      // Dodaj query param jeśli lastEventDate jest podane
      if (lastEventDate !== undefined && lastEventDate !== null) {
        url += `?lastEventDate=${lastEventDate}`;
      }
      
      const response = await this.get<Event[]>(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  }
}

// Export instancji singleton
export const eventsRepository = EventsRepository.getInstance();


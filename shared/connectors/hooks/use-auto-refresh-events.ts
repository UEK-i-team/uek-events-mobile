import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useEventsRepository } from '../context';
import { cacheService } from '../services/cache-service';
import type { Event } from '../types';

/**
 * Hook do automatycznego odświeżania eventów przy focus aplikacji
 * 
 * Zachowanie:
 * 1. Przy pierwszym montowaniu: pobiera wszystkie eventy (bez since)
 * 2. Przy kolejnych focus: pobiera tylko nowe eventy (z since = najnowszy createdAt)
 * 3. Wyświetla cache + nowe eventy posortowane po dacie rozpoczęcia (event_date_start)
 */
export function useAutoRefreshEvents() {
  const eventsRepo = useEventsRepository();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const appState = useRef(AppState.currentState);
  const isInitialMount = useRef(true);

  /**
   * Sortuj eventy po dacie rozpoczęcia (najwcześniejszy pierwszy)
   */
  const sortEventsByStartDate = (eventsToSort: Event[]): Event[] => {
    return [...eventsToSort].sort((a, b) => {
      const getTimestamp = (event: Event): number => {
        // Użyj eventDateStart (ISO 8601 z API) - data rozpoczęcia eventu
        if (event.eventDateStart) {
          return new Date(event.eventDateStart).getTime();
        }
        // Fallback: createdAt
        if (event.createdAt) {
          return new Date(event.createdAt).getTime();
        }
        return 0;
      };

      return getTimestamp(a) - getTimestamp(b);
    });
  };

  /**
   * Pobierz eventy - z since lub bez
   * @param useSince - Czy użyć since (najnowszy event z cache)
   */
  const fetchEvents = useCallback(async (useSince: boolean = false) => {
    try {
      if (useSince) {
        setIsRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      let sinceParam: string | null = null;

      if (useSince) {
        // Sprawdź czy są eventy w cache i pobierz najnowszy createdAt
        const newestDate = await cacheService.getNewestEventDate();
        if (newestDate) {
          sinceParam = newestDate;
          console.log('🔄 Refreshing events since:', sinceParam);
        } else {
          console.log('📭 No cached events found, fetching all');
        }
      } else {
        console.log('📥 Initial fetch - getting all events');
      }

      // Pobierz eventy (z since lub bez)
      // Repository automatycznie zapisze je w cache
      const newEvents = await eventsRepo.getEvents(sinceParam);

      // ZAWSZE pobierz wszystkie eventy z cache i posortuj
      const allEventsFromCache = await cacheService.getEvents();
      
      if (allEventsFromCache && allEventsFromCache.length > 0) {
        // Sortuj po dacie rozpoczęcia
        const sortedEvents = sortEventsByStartDate(allEventsFromCache);
        setEvents(sortedEvents);
        
        if (sinceParam) {
          console.log(`✅ Refreshed: ${newEvents.length} new events added, total: ${sortedEvents.length}`);
        } else {
          console.log(`✅ Loaded ${sortedEvents.length} events`);
        }
      } else {
        // Brak cache (nie powinno się zdarzyć po getEvents, ale dla bezpieczeństwa)
        setEvents(newEvents);
        console.log(`✅ Loaded ${newEvents.length} events (no cache)`);
      }
    } catch (err) {
      console.error('❌ Error fetching events:', err);
      setError(err instanceof Error ? err : new Error('Unknown error'));

      // Spróbuj załadować z cache przy błędzie
      try {
        const cachedEvents = await cacheService.getEvents();
        if (cachedEvents && cachedEvents.length > 0) {
          const sortedEvents = sortEventsByStartDate(cachedEvents);
          setEvents(sortedEvents);
          console.log('📱 Loaded from cache due to error');
        }
      } catch (cacheErr) {
        console.error('Failed to load from cache:', cacheErr);
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [eventsRepo]);

  /**
   * Ręczne odświeżenie
   */
  const refresh = useCallback(async () => {
    await fetchEvents(true);
  }, [fetchEvents]);

  // Załaduj eventy przy montowaniu (bez since)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchEvents(false);
    }
  }, [fetchEvents]);

  // Słuchaj zmian AppState i odświeżaj przy focus
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // Aplikacja przeszła z tła na foreground
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('📱 App came to foreground - refreshing events');
        // Użyj since bo to odświeżanie
        fetchEvents(true);
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    isRefreshing,
    refresh,
    refetch: () => fetchEvents(false), // Wymuś pełne pobranie
  };
}


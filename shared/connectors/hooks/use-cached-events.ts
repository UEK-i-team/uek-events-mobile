import { useCallback, useEffect, useState } from 'react';
import { useEventsRepository } from '../context';
import { cacheService } from '../services/cache-service';
import type { Event } from '../types';

/**
 * Hook do pobierania eventów z automatycznym cache'owaniem
 * Pokazuje czy dane są z cache i pozwala na odświeżanie
 */
export function useCachedEvents() {
  const eventsRepo = useEventsRepository();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{
    exists: boolean;
    size: number;
    eventsCount: number;
    lastCached: number | null;
  } | null>(null);

  /**
   * Pobierz eventy (z API lub cache)
   */
  const fetchEvents = useCallback(async (useCache = true) => {
    console.log('now1')
    try {
      setLoading(true);
      setError(null);
      
      // Sprawdź czy cache istnieje i pobierz datę najnowszego eventu
      let sinceParam: string | null = null;

      if (useCache) {
        const newestDate = await cacheService.getNewestEventDate();
        if (newestDate) {
          sinceParam = newestDate;
        } 
      }
      
      // Pobierz eventy (automatycznie cache'owane)
      const data = await eventsRepo.getEvents(sinceParam, useCache);
      setEvents(data);
      setIsOffline(false);
      
      // Pobierz info o cache (jeśli metoda istnieje)
      if (eventsRepo.getCacheInfo) {
        const info = await eventsRepo.getCacheInfo();
        setCacheInfo(info);
      }
      
      console.log('✅ Events loaded successfully');
    } catch (err) {
      console.error('❌ Failed to load events:', err);
      setError(err as Error);
      setIsOffline(true);
      
      // Spróbuj załadować z cache
      try {
        if (eventsRepo.getCacheInfo) {
          const info = await eventsRepo.getCacheInfo();
          setCacheInfo(info);
          
          if (info.exists && info.eventsCount > 0) {
            console.log('📱 Loading from cache (offline mode)');
            // Cache już powinien być załadowany przez repozytorium
            // ale jeśli nie, możemy spróbować jeszcze raz
          }
        }
      } catch (cacheErr) {
        console.error('Failed to load cache info:', cacheErr);
      }
    } finally {
      setLoading(false);
    }
  }, [eventsRepo]);

  /**
   * Odśwież eventy (wymusza pobranie z API)
   */
  const refresh = useCallback(async () => {
    await fetchEvents(false);
  }, [fetchEvents]);

  /**
   * Wyczyść cache
   */
  const clearCache = useCallback(async () => {
    try {
      if (eventsRepo.clearCache) {
        await eventsRepo.clearCache();
        setCacheInfo(null);
        console.log('🗑️ Cache cleared');
      } else {
        console.warn('clearCache method not available on repository');
      }
    } catch (err) {
      console.error('Failed to clear cache:', err);
      throw err;
    }
  }, [eventsRepo]);

  // Załaduj eventy przy montowaniu
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    isOffline,
    cacheInfo,
    refresh,
    clearCache,
    fetchEvents,
  };
}


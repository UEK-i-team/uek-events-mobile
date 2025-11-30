import { NotificationContext } from '@/features/notifications/contexts';
import { useViewedEvents } from '@/features/viewed';
import { useAutoRefreshEvents } from '@/shared/connectors';
import { Event } from '@/shared/types/event';
import { useContext, useEffect, useRef } from 'react';

interface UseEventsDataReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook do pobierania eventów z repozytorium
 * Z automatycznym odświeżaniem przy wejściu do aplikacji
 */
export function useEventsData(): UseEventsDataReturn {
  const { showNotification } = useContext(NotificationContext);
  const { viewedEventsData } = useViewedEvents();
  const hasShownInitialNotification = useRef(false);
  const lastProcessedRefresh = useRef<number>(0);

  // Użyj hooka z automatycznym odświeżaniem
  const { events, loading, error, refetch, newEventsCount, wasRefreshed, refreshCounter } = useAutoRefreshEvents();

  // Nowa logika wyświetlania notyfikacji
  useEffect(() => {
    if (!loading && events.length > 0) {
      
      // PRZYPADEK 1: Initial load (pierwsze załadowanie aplikacji)
      if (!hasShownInitialNotification.current) {
        hasShownInitialNotification.current = true;
        
        // Sprawdź czy wszystkie eventy są przejrzane
        const allEventsViewed = events.every(event => 
          viewedEventsData.some(viewed => viewed.eventId === event.id)
        );
        
        
        if (allEventsViewed && events.length > 0) {
          showNotification('info', 'Jesteś na bieżąco');
        } 
        return;
      }
      
      // PRZYPADEK 2: Refresh (odświeżanie przy wejściu z backgroundu)
      if (!wasRefreshed) {
        return;
      }
      
      // Sprawdź czy to jest nowy refresh (zmienił się refreshCounter)
      if (lastProcessedRefresh.current === refreshCounter) {
        return;
      }
      
      lastProcessedRefresh.current = refreshCounter;
      
      // Sprawdź czy były nowe eventy (po odświeżeniu)
      if (newEventsCount > 0) {
        // Jeśli pobrano więcej niż 1 nowy event -> zielony modal sukcesu
        if (newEventsCount > 1) {
          showNotification('success', 'Pobrano nowe eventy');
        }
        // Jeśli pobrano dokładnie 1 event -> też pokaż sukces
        else if (newEventsCount === 1) {
          showNotification('success', 'Pobrano nowy event');
        }
      }
      // Sprawdź czy użytkownik jest na bieżąco (brak nowych eventów + wszystkie przejrzane)
      else if (newEventsCount === 0) {
        
        // Sprawdź czy wszystkie eventy są przejrzane
        const allEventsViewed = events.every(event => 
          viewedEventsData.some(viewed => viewed.eventId === event.id)
        );
        
        
        if (allEventsViewed && events.length > 0) {
          showNotification('info', 'Jesteś na bieżąco');
        } 
      }
    }
  }, [events.length, loading, showNotification, newEventsCount, viewedEventsData, events, wasRefreshed, refreshCounter]);

  return {
    events,
    loading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}


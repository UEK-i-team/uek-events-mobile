import { NotificationContext } from '@/features/notifications/contexts';
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
  const hasShownInitialNotification = useRef(false);
  const previousEventsLength = useRef(0);

  // Użyj hooka z automatycznym odświeżaniem
  const { events, loading, error, refresh, refetch } = useAutoRefreshEvents();

  // Pokaż notyfikację tylko przy nowych eventach
  useEffect(() => {
    if (!loading && events.length > 0) {
      // Pierwsza notyfikacja
      if (!hasShownInitialNotification.current) {
        showNotification('info', 'Załadowano wydarzenia');
        hasShownInitialNotification.current = true;
        previousEventsLength.current = events.length;
      }
      // Nowe eventy dodane (refresh)
      else if (events.length > previousEventsLength.current) {
        const newCount = events.length - previousEventsLength.current;
        showNotification('info', `Dodano ${newCount} nowych wydarzeń`);
        previousEventsLength.current = events.length;
      }
    }
  }, [events.length, loading, showNotification]);

  return {
    events,
    loading,
    error,
    refetch: async () => {
      await refetch();
    },
  };
}


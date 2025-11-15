import { useEventsRepository } from '@/shared/connectors';
import { Event } from '@/shared/types/event';
import { useEffect, useState } from 'react';

interface UseEventsDataReturn {
  events: Event[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook do pobierania eventów z repozytorium
 */
export function useEventsData(): UseEventsDataReturn {
  const eventsRepository = useEventsRepository();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventsRepository.getEvents();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    refetch: fetchEvents,
  };
}


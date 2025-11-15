import type { Event } from '@/shared/types/event';

/**
 * Re-export Event type
 */
export type { Event };

/**
 * Interfejs dla EventsRepository - kontrakt który muszą spełniać
 * zarówno prawdziwe jak i mockowe repozytoria
 */
export interface IEventsRepository {
  getEvents(lastEventDate?: number | null): Promise<Event[]>;
}


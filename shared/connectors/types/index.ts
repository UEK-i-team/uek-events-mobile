import type { Event } from '@/shared/types/event';

/**
 * Re-export Event type
 */
export type { Event };

/**
 * API types
 */
export type { ApiEventsResponse, ApiEvent } from './api-types';

/**
 * Interfejs dla EventsRepository - kontrakt który muszą spełniać
 * zarówno prawdziwe jak i mockowe repozytoria
 */
export interface IEventsRepository {
  /**
   * Pobierz eventy
   * @param since - ISO 8601 timestamp (np. '2024-11-22T10:30:00Z') - pobierz tylko nowsze eventy
   * @param useCache - Czy użyć cache przy braku połączenia (domyślnie true)
   */
  getEvents(since?: string | null, useCache?: boolean): Promise<Event[]>;
  clearCache?(): Promise<void>;
  getCacheInfo?(): Promise<any>;
}


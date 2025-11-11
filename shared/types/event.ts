/**
 * Typy dla eventów i filtrów w aplikacji
 */

import { EventCategory, EventLocation, EventTag, EventType } from './event-enums';

export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  time: string;
  location: string;
  tags: EventTag[]; // Tagi jako wartości enumów
  isHot?: boolean;
  isPopular?: boolean;
  availableSpots?: number;
  organizer?: string;
  isFavorite?: boolean;
  eventType?: EventType; // Typ wydarzenia
  eventCategory?: EventCategory; // Kategoria wydarzenia
  eventLocation?: EventLocation; // Kategoria lokalizacji
  entranceFee?: string; // np. 'Wstęp wolny', '50 PLN'
  requiresRegistration?: boolean;
  registeredCount?: number;
  maxParticipants?: number;
  summary?: string[]; // punkty "w skrócie"
  organizerDetails?: string;
  originalLink?: string; // link do oryginalnego wydarzenia
  cardColor?: string; // kolor tła karty
}

export interface FilterOption {
  id: string;
  label: string;
}

export type FilterId = 'today' | 'week' | 'month' | null;


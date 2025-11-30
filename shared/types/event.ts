/**
 * Typy dla eventów i filtrów w aplikacji
 */

import { EventCategory, EventLocation, EventTag, EventType, OrganizerType, RegistrationType } from './event-enums';

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
  organizerType?: OrganizerType; // Typ organizatora
  isFavorite?: boolean;
  eventType?: EventType; // Typ wydarzenia
  eventCategory?: EventCategory; // Kategoria wydarzenia
  eventLocation?: EventLocation; // Kategoria lokalizacji
  entranceFee?: string; // np. 'Wstęp wolny', '50 PLN'
  registrationType?: RegistrationType; // Typ rejestracji/wstępu
  requiresRegistration?: boolean;
  registeredCount?: number;
  maxParticipants?: number;
  summary?: string[]; // punkty "w skrócie"
  organizerDetails?: string;
  originalLink?: string; // link do oryginalnego wydarzenia
  cardColor?: string; // kolor tła karty
  createdAt?: string; // ISO 8601 timestamp utworzenia eventu (np. '2024-11-22T10:30:00Z')
  eventDateStart?: string; // ISO 8601 timestamp rozpoczęcia eventu (do sortowania)
  eventDateEnd?: string; // ISO 8601 timestamp zakończenia eventu
  topics?: string; // Tematy/agenda wydarzenia w formacie markdown (newline-separated)
  isSeparator?: boolean; // Specjalny marker dla separatora "Jesteś na bieżąco"
}

export interface FilterOption {
  id: string;
  label: string;
}

export type FilterId = 'today' | 'week' | 'month' | null;


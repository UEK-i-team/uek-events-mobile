/**
 * Typy dla eventów i filtrów w aplikacji
 */

export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  date: string;
  time: string;
  location: string;
  tags: string[];
  isHot?: boolean;
  isPopular?: boolean;
  availableSpots?: number;
  organizer?: string;
  isFavorite?: boolean;
  eventType?: string[]; // np. ['Wykład', 'Konferencja', 'Szkolenie']
  entranceFee?: string; // np. 'Wstęp wolny', '50 PLN'
  requiresRegistration?: boolean;
  registeredCount?: number;
  maxParticipants?: number;
  summary?: string[]; // punkty "w skrócie"
  organizerDetails?: string;
  originalLink?: string; // link do oryginalnego wydarzenia
}

export interface FilterOption {
  id: string;
  label: string;
}

export type FilterId = 'today' | 'week' | 'month' | null;


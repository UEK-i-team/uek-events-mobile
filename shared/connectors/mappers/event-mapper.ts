import type { Event } from '@/shared/types/event';
import {
  EventCategory,
  EventLocation,
  EventTag,
  EventType,
} from '@/shared/types/event-enums';
import type { ApiEvent } from '../types/api-types';

/**
 * Mapper do konwersji ApiEvent (format API) na Event (format aplikacji)
 */
export class EventMapper {
  /**
   * Konwertuj pojedynczy ApiEvent na Event
   */
  static toEvent(apiEvent: ApiEvent): Event {
    return {
      id: String(apiEvent.id),
      title: apiEvent.title,
      description: apiEvent.short_desc,
      image: apiEvent.image_url || undefined,
      date: this.formatDate(apiEvent.event_date_start),
      time: this.formatTime(apiEvent.event_date_start),
      location: apiEvent.location,
      tags: this.parseTags(apiEvent.tags),
      organizer: apiEvent.organisators,
      eventType: this.mapEventType(apiEvent.event_type),
      eventCategory: this.mapEventCategory(apiEvent.event_category),
      eventLocation: this.mapEventLocation(apiEvent.location_category),
      availableSpots: apiEvent.availability || undefined,
      requiresRegistration: apiEvent.registration_type === 'REQUIRED',
      originalLink: apiEvent.origin_url,
      createdAt: apiEvent.create_date,
      eventDateStart: apiEvent.event_date_start, // ISO 8601 - do sortowania
      // Opcjonalne pola można dodać później
      entranceFee: undefined,
      organizerDetails: apiEvent.organisators,
      cardColor: this.getCardColor(apiEvent.event_category),
    };
  }

  /**
   * Konwertuj tablicę ApiEvent[] na Event[]
   */
  static toEvents(apiEvents: ApiEvent[]): Event[] {
    return apiEvents.map((apiEvent) => this.toEvent(apiEvent));
  }

  /**
   * Formatuj datę z ISO 8601 na format "DD MMM" (np. "26 lis")
   */
  private static formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const day = date.getDate();
    const monthNames = [
      'sty',
      'lut',
      'mar',
      'kwi',
      'maj',
      'cze',
      'lip',
      'sie',
      'wrz',
      'paź',
      'lis',
      'gru',
    ];
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  }

  /**
   * Formatuj czas z ISO 8601 na format "HH:MM" (np. "10:00")
   */
  private static formatTime(isoDate: string): string {
    const date = new Date(isoDate);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  /**
   * Parsuj tagi z formatu "TAG1,TAG2,TAG3" na EventTag[]
   */
  private static parseTags(tagsString: string): EventTag[] {
    if (!tagsString) return [];

    const tagMap: Record<string, EventTag> = {
      TECHNOLOGY: EventTag.Technology,
      SCIENCE: EventTag.Science,
      BUSINESS: EventTag.Business,
      ART: EventTag.Art,
      SPORT: EventTag.Sport,
      ENTREPRENEURSHIP: EventTag.Entrepreneurship,
      PERSONAL_DEVELOPMENT: EventTag.PersonalDevelopment,
      RESEARCH: EventTag.Research,
      NETWORKING: EventTag.Networking,
      LIBRARY: EventTag.Technology, // mapuj LIBRARY na Technology
      EBSCO: EventTag.Technology,
      PLATFORM: EventTag.Technology,
      LAW: EventTag.Business, // mapuj LAW na Business
      SOFTWARE: EventTag.Technology,
      TRAINING: EventTag.PersonalDevelopment,
    };

    const tags = tagsString.split(',').map((tag) => tag.trim().toUpperCase());
    const mappedTags = tags
      .map((tag) => tagMap[tag])
      .filter((tag): tag is EventTag => tag !== undefined);

    // Jeśli nie zmapowano żadnego tagu, zwróć domyślny
    return mappedTags.length > 0 ? mappedTags : [EventTag.PersonalDevelopment];
  }

  /**
   * Mapuj event_type z API na EventType
   */
  private static mapEventType(apiType: string): EventType {
    const typeMap: Record<string, EventType> = {
      WORKSHOP: EventType.Workshop,
      TRAINING: EventType.Workshop, // mapuj TRAINING na Workshop
      LECTURE: EventType.Lecture,
      CONFERENCE: EventType.Conference,
      TOURNAMENT: EventType.Tournament,
      MEETING: EventType.Meeting,
      EXHIBITION: EventType.Exhibition,
      OTHER: EventType.Other,
    };

    return typeMap[apiType.toUpperCase()] || EventType.Other;
  }

  /**
   * Mapuj event_category z API na EventCategory
   */
  private static mapEventCategory(apiCategory: string): EventCategory {
    const categoryMap: Record<string, EventCategory> = {
      SCIENTIFIC: EventCategory.Scientific,
      INFORMATIONAL: EventCategory.Scientific, // mapuj INFORMATIONAL na Scientific
      CULTURAL: EventCategory.Cultural,
      SPORTS: EventCategory.Sports,
      SOCIAL: EventCategory.Social,
      CAREER: EventCategory.Career,
      OTHER: EventCategory.Other,
    };

    return categoryMap[apiCategory.toUpperCase()] || EventCategory.Other;
  }

  /**
   * Mapuj location_category z API na EventLocation
   */
  private static mapEventLocation(apiLocation: string): EventLocation {
    const locationMap: Record<string, EventLocation> = {
      ON_UEK_CAMPUS: EventLocation.OnUekCampus,
      ONLINE: EventLocation.Online,
      OUTSIDE_UEK: EventLocation.OutsideUek,
      HYBRID: EventLocation.Hybrid,
    };

    return locationMap[apiLocation.toUpperCase()] || EventLocation.OutsideUek;
  }

  /**
   * Przypisz kolor karty na podstawie kategorii
   */
  private static getCardColor(category: string): string {
    const colorMap: Record<string, string> = {
      SCIENTIFIC: '#E8F5E9',
      INFORMATIONAL: '#E3F2FD',
      CULTURAL: '#F3E5F5',
      SPORTS: '#FFF3E0',
      SOCIAL: '#FCE4EC',
      CAREER: '#E0F2F1',
    };

    return colorMap[category.toUpperCase()] || '#F5F5F5';
  }
}


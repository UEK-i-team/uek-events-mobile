import type { Event } from '@/shared/types/event';
import {
  EventCategory,
  EventLocation,
  EventTag,
  EventType,
  OrganizerType,
  RegistrationType,
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
      organizerType: this.mapOrganizerType(apiEvent.organisators_category),
      eventType: this.mapEventType(apiEvent.event_type),
      eventCategory: this.mapEventCategory(apiEvent.event_category),
      eventLocation: this.mapEventLocation(apiEvent.location_category),
      registrationType: this.mapRegistrationType(apiEvent.registration_type),
      availableSpots: apiEvent.availability || undefined,
      requiresRegistration: apiEvent.registration_type === 'REGISTRATION_REQUIRED',
      originalLink: apiEvent.origin_url,
      createdAt: apiEvent.create_date,
      eventDateStart: apiEvent.event_date_start, // ISO 8601 - do sortowania
      eventDateEnd: apiEvent.event_date_end || undefined,
      topics: apiEvent.topics || undefined,
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
      SCIENCE: EventTag.Science,
      RESEARCH: EventTag.Research,
      TECHNOLOGY: EventTag.Technology,
      BUSINESS: EventTag.Business,
      ENTREPRENEURSHIP: EventTag.Entrepreneurship,
      MARKETING: EventTag.Marketing,
      FINANCE: EventTag.Finance,
      LAW: EventTag.Law,
      ECONOMICS: EventTag.Economics,
      PSYCHOLOGY: EventTag.Psychology,
      POLITICAL_SCIENCE: EventTag.PoliticalScience,
      FILM: EventTag.Film,
      MUSIC: EventTag.Music,
      HEALTH: EventTag.Health,
      FOREIGN_LANGUAGES: EventTag.ForeignLanguages,
      TRAVEL: EventTag.Travel,
      PERSONAL_DEVELOPMENT: EventTag.PersonalDevelopment,
      ECOLOGY: EventTag.Ecology,
    };

    const tags = tagsString.split(',').map((tag) => tag.trim().toUpperCase());
    const mappedTags = tags
      .map((tag) => tagMap[tag])
      .filter((tag): tag is EventTag => tag !== undefined);

    // Jeśli nie zmapowano żadnego tagu, zwróć pusty array
    return mappedTags;
  }

  /**
   * Mapuj event_type z API na EventType
   */
  private static mapEventType(apiType: string): EventType | undefined {
    const typeMap: Record<string, EventType> = {
      LECTURE: EventType.Lecture,
      CONFERENCE: EventType.Conference,
      DEBATE: EventType.Debate,
      DISCUSSION: EventType.Discussion,
      WORKSHOP: EventType.Workshop,
      TRAINING: EventType.Training,
      SHOW: EventType.Show,
      JOB_FAIR: EventType.JobFair,
      MEETING: EventType.Meeting,
      CAREER_CONSULTATION: EventType.CareerConsultation,
      CASE_STUDY: EventType.CaseStudy,
      NETWORKING: EventType.Networking,
      CONCERT: EventType.Concert,
      PERFORMANCE: EventType.Performance,
      EXHIBITION: EventType.Exhibition,
      PARTY: EventType.Party,
      TRIP: EventType.Trip,
      TOURNAMENT: EventType.Tournament,
      RUN: EventType.Run,
      SPORTS_CLASS: EventType.SportsClass,
      CHARITY_EVENT: EventType.CharityEvent,
      FUNDRAISER: EventType.Fundraiser,
      VOLUNTEERING: EventType.Volunteering,
      CEREMONY: EventType.Ceremony,
      AUTHOR_MEETING: EventType.AuthorMeeting,
      OPEN_DAY: EventType.OpenDays,
      CONTEST: EventType.Contest,
      INTERNSHIP: EventType.Internship,
      CONSULTATION: EventType.Consultation,
      JOB: EventType.Job,
    };

    return typeMap[apiType.toUpperCase()];
  }

  /**
   * Mapuj event_category z API na EventCategory
   */
  private static mapEventCategory(apiCategory: string): EventCategory | undefined {
    const categoryMap: Record<string, EventCategory> = {
      SCIENTIFIC: EventCategory.Scientific,
      CAREER: EventCategory.Career,
      CULTURAL: EventCategory.Cultural,
      INTEGRATION: EventCategory.Integration,
      SPORTS: EventCategory.Sports,
      SOCIAL: EventCategory.Social,
      OFFICIAL: EventCategory.Official,
      INFORMATIONAL: EventCategory.Informational,
      BUSINESS: EventCategory.Business,
    };

    return categoryMap[apiCategory.toUpperCase()];
  }

  /**
   * Mapuj location_category z API na EventLocation
   */
  private static mapEventLocation(apiLocation: string): EventLocation | undefined {
    const locationMap: Record<string, EventLocation> = {
      ON_UEK_CAMPUS: EventLocation.OnUekCampus,
      ONLINE: EventLocation.Online,
      OFF_UEK_CAMPUS: EventLocation.OffUekCampus,
      HYBRID: EventLocation.Hybrid,
    };

    return locationMap[apiLocation.toUpperCase()];
  }

  /**
   * Mapuj organisators_category z API na OrganizerType
   */
  private static mapOrganizerType(apiOrganizerCategory: string): OrganizerType | undefined {
    const organizerMap: Record<string, OrganizerType> = {
      UEK_AUTHORITIES: OrganizerType.UekAuthorities,
      UEK_UNIT: OrganizerType.UekUnit,
      SCIENTIFIC_CIRCLE: OrganizerType.ScientificCircle,
      STUDENT_ORGANIZATION: OrganizerType.StudentOrganization,
      COMPANY: OrganizerType.Company,
      SOCIAL_ORGANIZATION: OrganizerType.SocialOrganization,
      PUBLIC_INSTITUTION: OrganizerType.PublicInstitution,
    };

    return organizerMap[apiOrganizerCategory.toUpperCase()];
  }

  /**
   * Mapuj registration_type z API na RegistrationType
   */
  private static mapRegistrationType(apiRegistrationType: string): RegistrationType | undefined {
    const registrationMap: Record<string, RegistrationType> = {
      REGISTRATION_REQUIRED: RegistrationType.RegistrationRequired,
      FREE_ENTRY: RegistrationType.FreeEntry,
      PAID_ENTRY: RegistrationType.PaidEntry,
    };

    return registrationMap[apiRegistrationType.toUpperCase()];
  }

  /**
   * Przypisz kolor karty na podstawie kategorii
   */
  private static getCardColor(category: string): string {
    const colorMap: Record<string, string> = {
      SCIENTIFIC: '#E8F5E9',
      CAREER: '#E0F2F1',
      CULTURAL: '#F3E5F5',
      INTEGRATION: '#FFF9C4',
      SPORTS: '#FFF3E0',
      SOCIAL: '#FCE4EC',
      OFFICIAL: '#E1F5FE',
      INFORMATIONAL: '#E3F2FD',
      BUSINESS: '#F1F8E9',
    };

    return colorMap[category.toUpperCase()] || '#F5F5F5';
  }
}


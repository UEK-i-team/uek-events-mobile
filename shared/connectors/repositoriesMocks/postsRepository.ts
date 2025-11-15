import {
  EventCategory,
  EventLocation,
  EventTag,
  EventType,
} from '@/shared/types/event-enums';
import type { Event, IEventsRepository } from '../types';

/**
 * Mock Events Repository - zwraca zmockowane dane bez połączenia z API
 */
export class MockEventsRepository implements IEventsRepository {
  private static instance: MockEventsRepository;

  private constructor() {
    console.log('🎭 MockEventsRepository initialized - using mocked data');
  }

  /**
   * Singleton pattern - jedna instancja dla całej aplikacji
   */
  public static getInstance(): MockEventsRepository {
    if (!MockEventsRepository.instance) {
      MockEventsRepository.instance = new MockEventsRepository();
    }
    return MockEventsRepository.instance;
  }

  /**
   * Mock getEvents - zwraca przykładowe eventy
   * @param lastEventDate - Timestamp ostatniego eventu lub null (nie używany w mocku)
   */
  public async getEvents(lastEventDate?: number | null): Promise<Event[]> {
    console.log('🎭 Mock: Getting events with lastEventDate:', lastEventDate);
    
    // Symuluj opóźnienie sieciowe
    await this.delay(500);

    // Zmockowane dane eventów (z pliku events.ts)
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'AI & Machine Learning Workshop',
        description: 'Poznaj podstawy uczenia maszynowego i zbuduj swój pierwszy model AI.',
        image: 'https://kariery.uek.krakow.pl/wp-content/uploads/2025/11/Grafika-promocyjna-600x600.png',
        date: '11 lis',
        time: '18:00',
        location: 'UEK - Sala 204, Budynek A',
        tags: [EventTag.Technology, EventTag.Science, EventTag.Research],
        isHot: true,
        availableSpots: 12,
        organizer: 'Koło Naukowe Informatyki',
        eventType: EventType.Workshop,
        eventCategory: EventCategory.Scientific,
        eventLocation: EventLocation.OnUekCampus,
        entranceFee: 'Wstęp wolny',
        requiresRegistration: true,
        registeredCount: 38,
        maxParticipants: 50,
        summary: [
          'Nauczysz się podstaw uczenia maszynowego i sztucznej inteligencji',
          'Zbudujesz swój pierwszy model AI od podstaw',
          'Poznasz popularne biblioteki i narzędzia do pracy z AI',
          'Otrzymasz certyfikat uczestnictwa',
          'Zdobędziesz praktyczne umiejętności przydatne na rynku pracy',
        ],
        organizerDetails: 'Koło Naukowe Informatyki',
        originalLink: 'https://uek.krakow.pl/wydarzenia/ai-machine-learning-workshop',
        cardColor: '#E8F5E9',
      },
      {
        id: '2',
        title: 'Spotkania w świecie biznesu',
        description: '[krótki opis 1 zdanie] – Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
        date: '14 lis',
        time: '10:00',
        location: 'UEK - Pawilon Główny sala 309',
        tags: [EventTag.Business, EventTag.Entrepreneurship, EventTag.PersonalDevelopment],
        isPopular: true,
        organizer: 'Koło Naukowe Analiz Strategicznych',
        eventType: EventType.Conference,
        eventCategory: EventCategory.Career,
        eventLocation: EventLocation.OnUekCampus,
        entranceFee: 'Wstęp wolny',
        requiresRegistration: true,
        registeredCount: 20,
        maxParticipants: 50,
        summary: [
          'Poznasz techniki, które pomogą Ci odnaleźć się w świecie zawodowym',
          'Spotkasz profesjonalistów z różnych branż',
          'Zdobędziesz kontakty, która wspierają w poszukiwaniu pracy',
          'Poznasz strategie związane z zarządzaniem karierą — będziesz wiedział, jak planować swoje cele zawodowe',
          'Otrzymasz praktyczne narzędzia umożliwiające skuteczne networkingowanie — zbudujesz wartościową sieć kontaktów',
        ],
        organizerDetails: 'Koło Naukowe Analiz Strategicznych',
        originalLink: 'https://uek.krakow.pl/wydarzenia/spotkania-w-swiecie-biznesu',
        cardColor: '#E3F2FD',
      },
      {
        id: '3',
        title: 'Hackathon UEK',
        description: '24-godzinny maraton programistyczny - rozwiąż realne problemy biznesowe.',
        image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
        date: '20 lis',
        time: '09:00',
        location: 'UEK - Centrum Konferencyjne',
        tags: [EventTag.Technology, EventTag.Business, EventTag.Entrepreneurship],
        availableSpots: 5,
        organizer: 'Koło Naukowe Informatyki',
        eventType: EventType.Tournament,
        eventCategory: EventCategory.Scientific,
        eventLocation: EventLocation.OnUekCampus,
        entranceFee: 'Wstęp wolny',
        requiresRegistration: true,
        registeredCount: 95,
        maxParticipants: 100,
        summary: [
          '24-godzinny maraton programistyczny z realnym wyzwaniem',
          'Praca w zespołach nad innowacyjnymi rozwiązaniami',
          'Mentoring od ekspertów z branży IT',
          'Nagrody dla najlepszych projektów',
          'Networking z przedstawicielami firm technologicznych',
        ],
        organizerDetails: 'Koło Naukowe Informatyki we współpracy z partnerami biznesowymi',
        originalLink: 'https://uek.krakow.pl/wydarzenia/hackathon-uek-2024',
        cardColor: '#FFF3E0',
      },
      {
        id: '4',
        title: 'Warsztaty Programowania',
        description: 'Praktyczne warsztaty z programowania w React Native.',
        date: '5 gru',
        time: '14:00',
        location: 'Sala 101, Budynek B',
        tags: [EventTag.Technology, EventTag.PersonalDevelopment],
        eventType: EventType.Workshop,
        eventCategory: EventCategory.Scientific,
        eventLocation: EventLocation.OnUekCampus,
        availableSpots: 8,
        originalLink: 'https://uek.krakow.pl/wydarzenia/warsztaty-programowania',
        cardColor: '#F3E5F5',
      },
      {
        id: '5',
        title: 'Wykład: Przyszłość AI',
        description: 'Ekspercki wykład o sztucznej inteligencji i jej wpływie na biznes.',
        date: '12 gru',
        time: '16:00',
        location: 'Aula Główna',
        tags: [EventTag.Science, EventTag.Technology, EventTag.Business],
        eventType: EventType.Lecture,
        eventCategory: EventCategory.Scientific,
        eventLocation: EventLocation.OnUekCampus,
        isHot: true,
        originalLink: 'https://uek.krakow.pl/wydarzenia/wyklad-przyszlosc-ai',
        cardColor: '#FCE4EC',
      },
    ];

    // Jeśli lastEventDate jest podane, filtruj eventy
    if (lastEventDate) {
      // Symuluj filtrowanie - zwróć tylko ostatnie 2 eventy
      return mockEvents.slice(-2);
    }

    return mockEvents;
  }

  /**
   * Symulacja opóźnienia
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export instancji singleton
export const mockEventsRepository = MockEventsRepository.getInstance();


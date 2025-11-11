import { Event, FilterOption } from '@/shared/types/event';

/**
 * Przykładowe dane eventów
 * TODO: Zastąpić danymi z API
 */
export const EXAMPLE_EVENTS: Event[] = [
  {
    id: '1',
    title: 'AI & Machine Learning Workshop',
    description: 'Poznaj podstawy uczenia maszynowego i zbuduj swój pierwszy model AI.',
    image: 'https://kariery.uek.krakow.pl/wp-content/uploads/2025/11/Grafika-promocyjna-600x600.png',
    date: '15 lis',
    time: '18:00',
    location: 'UEK - Sala 204, Budynek A',
    tags: ['Technologia', 'AI', 'Warsztaty'],
    isHot: true,
    availableSpots: 12,
    organizer: 'Koło Naukowe Informatyki',
    eventType: ['Warsztaty', 'Szkolenie'],
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
  },
  {
    id: '2',
    title: 'Spotkania w świecie biznesu',
    description: '[krótki opis 1 zdanie] – Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800',
    date: '17 wrz (jutro)',
    time: '10:00',
    location: 'UEK - Pawilon Główny sala 309',
    tags: ['Kariera', 'Technologia'],
    isPopular: true,
    organizer: 'Koło Naukowe Analiz Strategicznych',
    eventType: ['Wykład', 'Konferencja', 'Szkolenie', 'Integracja', 'Konkurs'],
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
  },
  {
    id: '3',
    title: 'Hackathon UEK',
    description: '24-godzinny maraton programistyczny - rozwiąż realne problemy biznesowe.',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    date: '20 wrz',
    time: '09:00',
    location: 'UEK - Centrum Konferencyjne',
    tags: ['Technologia', 'Konkurs', 'Networking'],
    availableSpots: 5,
    organizer: 'Koło Naukowe Informatyki',
    eventType: ['Konkurs', 'Hackathon'],
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
  },
  {
    id: '4',
    title: 'Warsztaty Programowania',
    description: 'Praktyczne warsztaty z programowania w React Native.',
    date: '22 wrz',
    time: '14:00',
    location: 'Sala 101, Budynek B',
    tags: ['Technologia', 'Warsztaty', 'Programowanie'],
    availableSpots: 8,
    originalLink: 'https://uek.krakow.pl/wydarzenia/warsztaty-programowania',
  },
  {
    id: '5',
    title: 'Wykład: Przyszłość AI',
    description: 'Ekspercki wykład o sztucznej inteligencji i jej wpływie na biznes.',
    date: '25 wrz',
    time: '16:00',
    location: 'Aula Główna',
    tags: ['Naukowe', 'AI', 'Biznes'],
    isHot: true,
    originalLink: 'https://uek.krakow.pl/wydarzenia/wyklad-przyszlosc-ai',
  },
];

/**
 * Opcje filtrów czasowych
 */
export const FILTER_OPTIONS: FilterOption[] = [
  { id: 'today', label: 'Tylko dzisiaj' },
  { id: 'week', label: 'W tym tygodniu' },
  { id: 'month', label: 'W tym miesiącu' },
];

